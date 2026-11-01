# DMart — Implementation Plan

> Status: scope agreed, implementation not started.
> This file is the single source of truth for what we build, in what order, and how we verify it.

---

## 1. Product

DMart is a local-only grocery/mini-mart demo with three portals:

| Portal | Who | What they do |
|---|---|---|
| Storefront | `customer` (and guests browsing) | Browse products, cart, checkout, mock KHQR payment, order history |
| POS | `cashier` | Search products, build a sale, take cash or mock QR, print an 80mm receipt |
| Back office | `admin` | Products, categories, staff, stock, orders, shipping status, dashboard, settings |

It is a portfolio/student project. There is **no deployment**, **no real payment**, and **no real email**.

### Stack (installed versions)

- Laravel `^13.17` on PHP 8.5
- Inertia `^3.0` (React 19.2 + TypeScript 5.7)
- Tailwind CSS 4 + the starter kit's shadcn-style components
- Laravel Fortify `^1.37`, Wayfinder `^0.1`
- Pest `^5.3`, Pint, Larastan
- SQLite (`DB_CONNECTION=sqlite`), mail driver `log`

### Non-negotiables

- **No new Composer or npm dependencies.** No chart library, no state library, no image-resizing package.
- Local `public` disk for uploads, no cloud storage.
- English only, USD only, integer cents for money.
- Mock payment only; the UI must say so.

---

## 2. Decisions locked in the interview

| Topic | Decision |
|---|---|
| Store domain | Grocery / mini-mart, name **DMart** |
| Roles | One role per user: `customer`, `cashier`, `admin` |
| Staff accounts | Admin creates cashier/admin accounts; customers self-register |
| Login | Separate `/login`, `/admin/login`, `/pos/login` pages, **one auth guard** with role checks |
| Guest access | Browse freely; login required at checkout |
| Orders | One `orders` table, `channel = online \| pos` |
| POS payments | Cash (tendered + change) and mock KHQR |
| Receipt | 80mm browser-print layout via `window.print()` |
| Inventory | Shared pool; decrement on payment success / POS completion, transactional |
| Fulfillment | Admin only; cashier sees only their own POS sales |
| Shipping | Flat fee + free-shipping threshold; manual tracking number/carrier text; no carrier API |
| Cart | Session cart for guests, DB cart for authenticated users, merged on login |
| Product images | Up to 5 per product, local disk, no resizing, compare-at price supported |
| Image fallback | Colored tile with the product's first letter |
| Admin dashboard | 4 KPI cards, 7-day revenue SVG chart, recent orders, top products |
| Deletion | Soft-delete products; snapshot order line items and addresses |
| Stock | `stock_movements` ledger + current balance on products |
| Storefront | Home, product list (search/filter/sort/pagination), detail, cart, checkout, orders |
| Address | Typed fresh at every checkout and snapshotted onto the order |
| Design | Warm grocery palette (amber/emerald), dark mode, storefront mobile-first |
| Quality bar | ~15–25 Pest feature tests covering the risky paths |
| Hosting | None. Runs locally via `php artisan serve` + `npm run dev` |

---

## 3. Assumptions

1. Store name, copy, and seed catalog are placeholder-quality but realistic.
2. USD only; the mock QR is decorative and does not encode a valid KHQR payload.
3. No SSR, no sitemap, no SEO work; per-page `<Head title>` only.
4. Fortify features reduced to **registration + password reset**. Email verification, 2FA, and passkeys are disabled and their starter-kit UI is removed.
5. `MAIL_MAILER=log`; password reset is present but not part of the demo script.
6. SQLite remains the database. `lockForUpdate()` is effectively a no-op there; correctness relies on short transactions and a re-check inside them.
7. Demo accounts use password `password`.
8. Seed product photos are attempted from curated royalty-free URLs; any failure falls back to the letter tile.
9. Pagination: 12 products on the storefront, 20 rows in admin tables.
10. Timezone is `Asia/Phnom_Penh`; revenue "today" uses this timezone.

---

## 4. Out of scope for v1

Real ABA PayWay/Bakong integration · email delivery · reviews · wishlist · coupons · refunds/returns · product variants · multi-store · carrier APIs · offline POS · SSR/SEO · deployment · audit log · 2FA/passkeys · guest checkout.

---

## 5. Architecture

### Request flow

```
React page (Inertia) → Wayfinder route function → Laravel route
   → middleware (auth, role, active, throttle)
   → Form Request validation
   → Controller → Service (transaction) → Eloquent
   → Inertia::render(props) / redirect + Inertia::flash toast
```

- Controllers stay thin; ordering, stock, and payment logic live in services.
- All write validation goes through Form Requests.
- Every portal route is protected by `auth` + a `role:` middleware.
- Server state arrives as Inertia props; no client data-fetching library. The POS product search is the one JSON endpoint, consumed with native `fetch`.
- Monetary values are integer cents everywhere; formatting happens in one helper.

### Portal protection

| Middleware | Applied to |
|---|---|
| `auth` | Checkout, payment, orders, all portals |
| `role:customer` | Customer-only account pages (optional; ownership policies are the real gate) |
| `role:cashier` | `/pos/*` |
| `role:admin` | `/admin/*` |
| `active` | All authenticated routes; inactive users are logged out with an error |
| `throttle:checkout`, `throttle:payment` | Checkout and payment endpoints |

Login enforcement: `/admin/login` and `/pos/login` render the same auth page with a `portal` prop. The form posts to Fortify's `/login` with a hidden `portal` field. `Fortify::authenticateUsing()` rejects a user whose role doesn't match the portal, and inactive users are rejected too. A custom `LoginResponse` redirects admins to `/admin`, cashiers to `/pos`, customers to `/` (or the intended URL).

### Money

`App\Support\Money`:

- `Money::parse(string $decimal): int` — accepts `12`, `12.5`, `12.50`, rejects more than 2 decimals.
- `Money::format(int $cents): string` — `$12.50`.
- All requests accept decimal strings from forms and convert to cents before persisting.
- Totals are always recalculated server-side; client-submitted totals are ignored.

### Payments

`App\Payments\PaymentGateway` contract:

```php
interface PaymentGateway
{
    public function createIntent(Order $order): Payment;

    public function confirm(Payment $payment): bool;
}
```

- `MockKhqrGateway` creates a `payments` row with provider `mock_khqr`, a UUID reference, and status `pending`.
- `confirm()` is idempotent: it only transitions `pending → paid`.
- `PaymentService::complete(Order $order, Payment $payment)` opens a transaction, locks the order, re-checks stock, decrements stock, writes `stock_movements`, marks the payment paid and the order `paid`, and sets `paid_at`.
- If stock is insufficient at confirmation, the payment is marked `failed`, the order is cancelled, and the customer sees a clear message.
- `config/payments.php` selects the driver (`PAYMENT_DRIVER=mock`); a real ABA implementation would implement the same contract later.
- The payment page carries a visible **"Demo payment — no real money"** banner.

### Stock

`StockService` is the only code allowed to change `products.stock`:

- `decrement(Product $product, int $qty, StockMovementType $type, array $meta)` — throws `InsufficientStockException`.
- `increment(...)` — restock / return.
- `adjust(Product $product, int $delta, string $reason, User $actor)` — manual correction.
- Every operation writes a `stock_movements` row with delta, reason, actor, and optional order.
- Product create records an initial `restock` movement; product edit that changes stock records an `adjustment`.

### Order lifecycle

```
online:  pending_payment → paid → processing → shipped → delivered
                              ↘ cancelled (admin; restock if paid)

pos:     completed (created paid, paid_at set)
```

- Transitions are centralized in `OrderService::transition()` with an allowed-transition map. Invalid transitions return a validation error.
- Customer may cancel only `pending_payment`.
- Admin may cancel `pending_payment` or `paid`; cancelling a paid order restocks every line and records `return` movements.
- POS sales are immutable in v1 (no refunds).

---

## 6. Data model

### Enums (`app/Enums`)

| Enum | Cases |
|---|---|
| `UserRole` | `Customer`, `Cashier`, `Admin` |
| `OrderChannel` | `Online`, `Pos` |
| `OrderStatus` | `PendingPayment`, `Paid`, `Processing`, `Shipped`, `Delivered`, `Completed`, `Cancelled` |
| `PaymentMethod` | `Cash`, `Khqr` |
| `PaymentStatus` | `Pending`, `Paid`, `Failed`, `Cancelled` |
| `StockMovementType` | `Sale`, `Restock`, `Adjustment`, `Return` |

Follow the project rule: TitleCase enum keys. Cast enums on models.

### Tables

**`users`** (extend the starter migration with a new migration)

- `role` string, default `customer`, indexed
- `is_active` boolean, default `true`
- Remove `MustVerifyEmail`, `PasskeyUser`, and `TwoFactorAuthenticatable` from the model after disabling those Fortify features.

**`categories`**

- `id`, `name`, `slug` unique, `description` nullable, timestamps

**`products`**

- `id`, `category_id` FK → categories (`restrictOnDelete`)
- `name`, `slug` unique, `sku` unique
- `description` text
- `price_cents` unsigned int
- `compare_at_price_cents` unsigned int nullable
- `stock` unsigned int default 0
- `low_stock_threshold` unsigned int default 5
- `is_active` boolean default true
- timestamps, `softDeletes`
- Indexes: `category_id`, `is_active`, `stock`

**`product_images`**

- `id`, `product_id` FK cascade
- `path`, `alt` nullable
- `is_primary` boolean default false
- `sort_order` unsigned int default 0
- timestamps

**`carts`**

- `id`, `user_id` FK cascade, **unique**
- timestamps

**`cart_items`**

- `id`, `cart_id` FK cascade, `product_id` FK cascade
- `quantity` unsigned int
- timestamps
- Unique (`cart_id`, `product_id`)

**`orders`**

- `id`, `order_number` string unique (`DM-000123`, derived from the id after insert)
- `user_id` nullable FK → users (`nullOnDelete`) — null for walk-in POS sales
- `channel` string, `status` string
- `payment_method` string nullable
- `cashier_id` nullable FK → users (`nullOnDelete`)
- `subtotal_cents`, `shipping_fee_cents`, `total_cents`
- `cash_tendered_cents`, `change_cents` nullable (POS cash only)
- `shipping_name`, `shipping_phone`, `shipping_address`, `shipping_city`
- `shipping_notes` nullable
- `tracking_number`, `carrier` nullable
- `paid_at`, `shipped_at`, `delivered_at`, `cancelled_at` nullable timestamps
- timestamps
- Indexes: `user_id`, `status`, `channel`, `cashier_id`, `created_at`

**`order_items`** (immutable snapshots)

- `id`, `order_id` FK cascade
- `product_id` nullable FK → products (`nullOnDelete`)
- `product_name`, `product_sku`
- `unit_price_cents`, `quantity`, `line_total_cents`
- timestamps

**`payments`**

- `id`, `order_id` FK cascade
- `provider` string, `method` string
- `reference` string **unique**
- `amount_cents`, `status`
- `payload` JSON nullable
- `paid_at` nullable
- timestamps
- Unique `reference` is the idempotency guard.

**`stock_movements`**

- `id`, `product_id` FK cascade
- `type` string
- `quantity_delta` signed int
- `reason` nullable
- `user_id` nullable FK (`nullOnDelete`)
- `order_id` nullable FK (`nullOnDelete`)
- timestamps
- Index (`product_id`, `created_at`)

**`settings`**

- `id`, `key` unique, `value` text, timestamps
- Seeded keys: `store_name`, `store_address`, `store_phone`, `shipping_fee_cents`, `free_shipping_threshold_cents`, `low_stock_threshold`

### Model notes

- Use Laravel 13's `#[Fillable]` / `#[Hidden]` attributes, matching the existing `User` model — not `$fillable` properties.
- Relationships: `Category::products()`, `Product::category()/images()/movements()`, `Order::items()/payments()/user()/cashier()`, `Cart::items()`, `User::cart()/orders()`.
- Storefront only exposes `Product::active()` (scope: `is_active = true` and category exists).
- `OrderItem` and the order address fields are never updated after creation.
- Factories for every model; product images are optional in factories.

---

## 7. Route map

### Public / guest

| Method | URI | Name | Handler |
|---|---|---|---|
| GET | `/` | `home` | `Storefront\HomeController@index` |
| GET | `/products` | `products.index` | `Storefront\ProductController@index` |
| GET | `/products/{product:slug}` | `products.show` | `Storefront\ProductController@show` |
| GET | `/cart` | `cart.index` | `Storefront\CartController@index` |
| POST | `/cart/items` | `cart.items.store` | `Storefront\CartController@store` |
| PATCH | `/cart/items/{product}` | `cart.items.update` | `Storefront\CartController@update` |
| DELETE | `/cart/items/{product}` | `cart.items.destroy` | `Storefront\CartController@destroy` |

Cart routes use the session cart for guests and the DB cart for authenticated users.

### Auth

| Method | URI | Notes |
|---|---|---|
| GET | `/login`, `/register` | Fortify views (customer portal) |
| GET | `/admin/login` | Same page, `portal=admin` |
| GET | `/pos/login` | Same page, `portal=cashier` |
| POST | `/login` | Fortify; hidden `portal` field enforced by `authenticateUsing` |
| POST | `/logout` | Fortify |

Already-authenticated users who hit the wrong portal login are redirected to their own portal.

### Customer (auth, active)

| Method | URI | Name |
|---|---|---|
| GET | `/checkout` | `checkout.index` |
| POST | `/checkout` | `checkout.store` (`throttle:checkout`) |
| GET | `/payment/{order}` | `payment.show` (owner only) |
| POST | `/payment/{order}/simulate` | `payment.simulate` (`throttle:payment`) |
| GET | `/orders` | `orders.index` |
| GET | `/orders/{order}` | `orders.show` (owner only) |
| POST | `/orders/{order}/cancel` | `orders.cancel` (owner, pending only) |

### Cashier (auth, active, `role:cashier`)

| Method | URI | Name |
|---|---|---|
| GET | `/pos` | `pos.index` |
| GET | `/pos/products` | `pos.products.search` (JSON, `?q=`; max 20) |
| POST | `/pos/sales` | `pos.sales.store` |
| GET | `/pos/sales` | `pos.sales.index` (own sales) |
| GET | `/pos/sales/{order}/receipt` | `pos.sales.receipt` (own sale or admin) |

### Admin (auth, active, `role:admin`, prefix `/admin`)

| Method | URI | Name |
|---|---|---|
| GET | `/admin` | `admin.dashboard` |
| Resource | `/admin/categories` | `admin.categories.*` (except show) |
| Resource | `/admin/products` | `admin.products.*` (except show) |
| POST | `/admin/products/{product}/images` | `admin.products.images.store` |
| DELETE | `/admin/products/{product}/images/{image}` | `admin.products.images.destroy` |
| PATCH | `/admin/products/{product}/images/{image}/primary` | `admin.products.images.primary` |
| GET | `/admin/orders` | `admin.orders.index` |
| GET | `/admin/orders/{order}` | `admin.orders.show` |
| PATCH | `/admin/orders/{order}/status` | `admin.orders.status` |
| POST | `/admin/orders/{order}/cancel` | `admin.orders.cancel` |
| GET | `/admin/stock` | `admin.stock.index` |
| POST | `/admin/products/{product}/stock` | `admin.stock.store` |
| GET | `/admin/staff` | `admin.staff.index` |
| POST | `/admin/staff` | `admin.staff.store` |
| PATCH | `/admin/staff/{user}` | `admin.staff.update` |
| PATCH | `/admin/staff/{user}/status` | `admin.staff.status` |
| PATCH | `/admin/staff/{user}/password` | `admin.staff.password` |
| GET | `/admin/settings` | `admin.settings.edit` |
| PATCH | `/admin/settings` | `admin.settings.update` |

Route files: `routes/web.php` keeps the home route and includes `routes/storefront.php`, `routes/customer.php`, `routes/pos.php`, `routes/admin.php`. Use route groups, names, and middleware in each file. `/dashboard` becomes a role-based redirect (kept for compatibility with the starter kit).

---

## 8. Backend components

### Middleware

- `app/Http/Middleware/EnsureUserHasRole.php` — alias `role`.
- `app/Http/Middleware/EnsureUserIsActive.php` — alias `active`; logs out and redirects with an error if `is_active` is false.
- Register both in `bootstrap/app.php`.
- Extend `HandleInertiaRequests::share()` with:
  - `auth.user` including `role`
  - `cartCount` (auth DB cart or guest session)
  - `flash.toast` is handled by Inertia 3's `Inertia::flash()`; no extra prop needed.

### Controllers (`app/Http/Controllers`)

**Storefront:** `HomeController`, `ProductController`, `CartController`, `CheckoutController`, `PaymentController`, `OrderController`.

**POS:** `PosController` (terminal + JSON search), `PosSaleController` (store, index, receipt).

**Admin:** `DashboardController`, `CategoryController`, `ProductController`, `ProductImageController`, `OrderController`, `StockController`, `StaffController`, `SettingController`.

**Auth:** keep the starter kit's Fortify views; add a tiny `PortalLoginController@show` for `/admin/login` and `/pos/login`, or render directly from routes.

### Form Requests (`app/Http/Requests`)

- Store/Update `CategoryRequest`
- Store/Update `ProductRequest` (slug auto-generated when blank; money parsed to cents; stock handled through `StockService`)
- `StoreProductImagesRequest` (array of images, max 5, `mimes:jpg,jpeg,png,webp`, max 2048 KB each)
- Store/Update `StaffRequest`, `UpdateStaffPasswordRequest`
- `CheckoutRequest` (name, phone, address, city, notes; server-side totals)
- `StorePosSaleRequest` (items array, payment method, cash tendered required when cash)
- `UpdateOrderStatusRequest`
- `CancelOrderRequest` (optional reason)
- `AdjustStockRequest` (non-zero delta, required reason)
- `UpdateSettingsRequest`

### Services (`app/Services`)

| Service | Responsibility |
|---|---|
| `CartService` | Resolve guest session cart vs DB cart, add/update/remove, merge on login, totals, stock caps |
| `OrderService` | Create online order, create POS sale, transition status, cancel, order numbers |
| `StockService` | Decrement/increment/adjust, ledger writes, low-stock checks |
| `PaymentService` | Create intent, confirm payment, idempotent completion, failure handling |
| `DashboardService` | KPI queries, 7-day revenue series, top products |

### Policies

- `OrderPolicy`: `view` (owner, admin, or cashier who owns the POS sale), `cancel` (owner + pending, or admin), `updateStatus` (admin).
- Product/category/staff/settings writes are admin-only via middleware; no extra policies needed for v1.
- Use `authorize()` in controllers even where middleware already limits access.

### Image handling

- Upload path: `products/{product_id}/{uuid}.{ext}` on the `public` disk.
- First upload becomes primary; "make primary" unsets the previous primary inside a transaction.
- Deleting an image removes the file and, if it was primary, promotes the next image.
- Products with no image render the letter tile in React — no placeholder files stored.
- Run `php artisan storage:link` in setup.

---

## 9. Frontend

### Layout resolution

`resources/js/app.tsx` currently maps layouts by page prefix. Extend the switch:

- `storefront/*` → `StorefrontLayout`
- `admin/*` → `AdminLayout`
- `pos/*` → `PosLayout`
- `auth/*` → existing `AuthLayout`
- `settings/*` → existing `[AppLayout, SettingsLayout]`

Remove the `welcome` special case once `/` renders a storefront page.

### New layouts

| Layout | Contents |
|---|---|
| `layouts/storefront-layout.tsx` | Header with logo, nav, search, cart badge, user menu; footer; dark-mode toggle; mobile menu |
| `layouts/admin-layout.tsx` | Sidebar (Dashboard, Products, Categories, Orders, Stock, Staff, Settings), top bar, breadcrumbs, user menu |
| `layouts/pos-layout.tsx` | Minimal full-width shell, cashier name, logout; no sidebar |

Reuse the starter kit's `ui/sidebar`, `dropdown-menu`, `breadcrumb`, `button`, `card`, and `sonner` components.

### Pages

```
resources/js/pages/storefront/
  home.tsx
  products/index.tsx
  products/show.tsx
  cart.tsx
  checkout.tsx
  payment.tsx
  orders/index.tsx
  orders/show.tsx

resources/js/pages/admin/
  dashboard.tsx
  products/index.tsx
  products/create.tsx
  products/edit.tsx
  categories/index.tsx
  orders/index.tsx
  orders/show.tsx
  stock/index.tsx
  staff/index.tsx
  settings.tsx

resources/js/pages/pos/
  index.tsx
  sales/index.tsx
  sales/receipt.tsx
```

Auth pages stay where they are, with the passkey block removed from `auth/login.tsx`.

### Shared components (`resources/js/components`)

`product-card.tsx` · `product-thumb.tsx` (image or deterministic letter tile) · `price.tsx` · `quantity-stepper.tsx` · `cart-line.tsx` · `empty-state.tsx` · `status-badge.tsx` (order + payment statuses) · `pagination.tsx` · `search-input.tsx` · `image-uploader.tsx` (previews + remove) · `stat-card.tsx` · `sales-chart.tsx` (hand-rolled SVG bars) · `confirm-dialog.tsx` · `order-timeline.tsx` · `receipt-print.tsx` (print CSS).

### UI behavior standards

- Every list has an **empty state** with a next action.
- Every async action disables its button and shows a spinner (`Spinner` component already exists).
- Validation errors appear inline via `InputError`.
- Toasts use `Inertia::flash('toast', ['type' => 'success', 'message' => ...])` from the server.
- Tables scroll horizontally on small screens; filters live in the URL query string.
- Money is formatted through a shared `formatMoney()` TypeScript helper.
- Dark mode uses the starter kit's appearance system; no hardcoded background colors.
- Storefront usable at **375px**; POS at **≥768px**; admin at **≥1024px**.
- Print styles are scoped to the receipt page only.

### Wayfinder

Use generated functions from `@/actions` and `@/routes` instead of hardcoded URLs. Regenerate after adding controllers:

```bash
php artisan wayfinder:generate
```

The Vite plugin also regenerates during `npm run dev` / `npm run build`.

---

## 10. Starter kit adjustments

1. `.env` / `.env.example`: `APP_NAME=DMart`, add `APP_TIMEZONE=Asia/Phnom_Penh`.
2. `config/app.php`: timezone from `APP_TIMEZONE`; add `config/payments.php`.
3. `config/fortify.php`: keep `registration` and `resetPasswords`; remove `emailVerification`, `twoFactorAuthentication`, and `passkeys`.
4. `App\Models\User`: remove `MustVerifyEmail`, `PasskeyUser`, `TwoFactorAuthenticatable`, and their imports.
5. `routes/web.php` / `routes/settings.php`: remove the `verified` middleware; keep profile and password settings.
6. `resources/js/pages/settings/security.tsx` and `SecurityController`: keep password updates, remove 2FA/passkey sections and components.
7. `resources/js/pages/auth/login.tsx`: remove `PasskeyVerify`.
8. `resources/js/app.tsx`: add the new layout prefixes.
9. Delete unused starter components (`manage-two-factor`, `manage-passkeys`, `passkey-*`, `two-factor-*`) once nothing imports them.
10. Starter tests affected by disabled features: adapt them to assert the trimmed behavior rather than deleting them outright. **Deleting any starter test file requires explicit approval** per the project rules; the affected files are `EmailVerificationTest`, `TwoFactorChallengeTest`, `VerificationNotificationTest`, and the passkey parts of `SecurityTest`.
11. `/dashboard` becomes a redirect based on role; update `DashboardTest` accordingly.

---

## 11. Implementation phases

Work in this order. Each phase ends with a working app and passing tests.

### Phase 0 — Baseline

- Set app name, timezone, payment config.
- Trim Fortify features and user model.
- Configure role middleware, active middleware, shared props.
- Add `storage:link`.
- Confirm `npm run build` and `php artisan test` still pass before domain work.

**Done when:** login/register still work; no references to 2FA/passkeys remain; build is clean.

### Phase 1 — Schema and models

- Add enums.
- Create migrations for categories, products, product_images, carts, cart_items, orders, order_items, payments, stock_movements, settings.
- Add `role`/`is_active` to users.
- Create models with `#[Fillable]`, casts, relationships, scopes.
- Create factories.
- Install `Money` helper and `Setting` accessor.

**Done when:** `php artisan migrate:fresh` succeeds and model factories work in `php artisan tinker`/tests.

### Phase 2 — Auth portals and route skeleton

- Add `/admin/login` and `/pos/login` pages with the `portal` field.
- Add `Fortify::authenticateUsing` role/active checks and a custom `LoginResponse`.
- Add route files and placeholder pages for each portal.
- Add layouts and navigation shells.
- Add role-based `/dashboard` redirect.

**Done when:** each role logs in through its portal and lands in the right place; wrong-portal logins are rejected; inactive users cannot log in.

### Phase 3 — Admin catalog

- Category CRUD + delete guard when products exist.
- Product CRUD with SKU/slug uniqueness, price parsing, compare-at price, active flag, soft delete.
- Product image upload/delete/primary.
- Stock adjustments with ledger; low-stock view.
- Settings page (store name/address/phone, shipping fee, free threshold, low-stock threshold).

**Done when:** an admin can build a complete catalog from an empty database and stock changes are recorded.

### Phase 4 — Storefront and cart

- Home (category tiles + newest 8 active products).
- Product listing with search, category filter, sort, pagination.
- Product detail with gallery, stock state, related products.
- Cart service + guest session cart + authenticated DB cart + merge on login.
- Cart page with quantity edits, remove, subtotal, shipping estimate.
- Letter-tile fallback component.

**Done when:** a guest can build a cart, log in, and keep it; stock caps are enforced; no N+1 queries on listing pages.

### Phase 5 — Checkout, mock payment, orders

- Checkout page and request (fresh address, notes).
- `OrderService::createOnlineOrder` with snapshots, shipping fee, order number.
- Payment page with mock QR, demo banner, simulate button, cancel.
- `MockKhqrGateway` + `PaymentService` with idempotent completion and stock decrement.
- Order history and detail with timeline; customer cancellation while pending.
- Flash success/error messages.

**Done when:** the full customer flow works and a repeated "simulate" click cannot double-decrement stock.

### Phase 6 — POS

- POS terminal: search (debounced), category chips, product grid, client-side sale cart.
- Payment panel: cash tendered/change or mock QR.
- `OrderService::createPosSale` with stock decrement, snapshots, completed status.
- Receipt page with 80mm print CSS and `window.print()`.
- Own-sales list with reprint; cashier scoping via policy.

**Done when:** a cashier can complete a cash sale in under a minute and print a receipt; out-of-stock and under-tendered sales are rejected.

### Phase 7 — Admin orders and dashboard

- Orders list with channel/status filters and search by order number/customer.
- Order detail: items, totals, address, payment, timeline.
- Status transition form (processing/shipped/delivered) with tracking/carrier.
- Admin cancellation with restock for paid orders.
- Dashboard KPIs, 7-day SVG chart, recent orders, top products.
- Staff management (create, edit, deactivate, reset password; cannot deactivate self).

**Done when:** an order can travel from paid to delivered, cancellations restore stock, and dashboard numbers match seeded data.

### Phase 8 — Seed data and demo polish

- `DemoSettingsSeeder`, `CategorySeeder`, `ProductSeeder`, `DemoUserSeeder`, `DemoOrderSeeder`.
- 8 categories, ~40 products, 3 demo accounts, ~30 orders over 30 days in mixed statuses.
- Image download attempts with graceful fallback.
- Empty/loading/skeleton states, mobile pass, dark-mode pass.
- Demo script written at the bottom of this file.

**Done when:** `php artisan migrate:fresh --seed` produces a store that looks alive in screenshots.

### Phase 9 — Tests and hardening

- Implement the tests in section 13.
- Add missing edge-case handling.
- Run Pint, Larastan if configured, TypeScript check, production build.

**Done when:** the full suite is green and the demo script passes manually.

---

## 12. Seed data

| Seeder | Contents |
|---|---|
| `DemoUserSeeder` | `admin@dmart.test`, `cashier@dmart.test`, `customer@dmart.test` — password `password`; 2 extra customers |
| `DemoCategorySeeder` | 8 categories: Beverages, Snacks, Bakery, Dairy, Household, Personal Care, Frozen, Produce |
| `ProductSeeder` | 40 products across categories, realistic names/SKUs/prices, some with compare-at prices, a few inactive, some low stock |
| `DemoOrderSeeder` | ~30 orders: online in `pending_payment`/`paid`/`processing`/`shipped`/`delivered`/`cancelled` and POS `completed`; spread over 30 days; matching order items, payments, and stock movements |
| `DemoSettingsSeeder` | Store name/address/phone, shipping fee `$2.00`, free threshold `$50.00`, low-stock threshold `5` |

Image strategy: a small curated map of royalty-free URLs per category; `Http::timeout(5)` download into `storage/app/public/products`; on failure the product simply has no image and the UI shows the letter tile. Attribution URLs are recorded in a seeder comment.

The seeder must be idempotent enough for repeated local runs (`migrate:fresh --seed` is the documented path).

---

## 13. Test plan (Pest)

New feature tests:

| File | Covers |
|---|---|
| `tests/Feature/Auth/RoleAccessTest.php` | Guest redirected; customer blocked from admin/POS; cashier blocked from admin; admin allowed; inactive user rejected |
| `tests/Feature/Auth/PortalLoginTest.php` | Each portal accepts only its role; correct landing redirects |
| `tests/Feature/Storefront/CartTest.php` | Guest cart add/update/remove; merge on login; quantity capped at stock |
| `tests/Feature/Storefront/CheckoutTest.php` | Creates pending order; snapshots address/items; shipping fee and free threshold; client totals ignored; stock unchanged before payment |
| `tests/Feature/Payments/MockPaymentTest.php` | Simulate marks paid and decrements once; duplicate simulate is idempotent; insufficient stock cancels; non-owner forbidden; cancel pending order works |
| `tests/Feature/Pos/SaleTest.php` | Cash sale totals/change; QR sale; out-of-stock rejected; under-tendered cash rejected; cashier sees only own sales; non-cashier forbidden |
| `tests/Feature/Admin/ProductManagementTest.php` | CRUD, slug/SKU uniqueness, image upload/primary/delete, soft delete, stock ledger, category delete guard, authorization |
| `tests/Feature/Admin/OrderFulfillmentTest.php` | Valid transitions, invalid transition rejected, tracking saved, cancellation restocks paid orders, customer cannot change status |
| `tests/Feature/Admin/StaffTest.php` | Create cashier/admin, deactivate, cannot deactivate self, password reset, customer forbidden |
| `tests/Feature/Admin/SettingsTest.php` | Update shipping settings; validation; storefront totals change |
| `tests/Feature/Admin/DashboardTest.php` | KPI values, 7-day series length/fill, top products ordering |

Rules:

- Use factories and named states (`admin()`, `cashier()`, `inactive()`).
- Use `actingAs()` and assert Inertia props where the page contract matters.
- Freeze time (`travelTo`) for "today" revenue assertions.
- Do not assert exact HTML; assert behavior and props.

Target: **15–25 focused feature tests**, all green before "done."

---

## 14. Edge cases to handle explicitly

- Guest adds to cart, logs in → quantities merge and cap at stock.
- Product goes out of stock between checkout and payment → payment fails, order cancels, clear message.
- Double-click "simulate payment" → single transition, single stock decrement.
- Session expires mid-checkout → DB cart survives, redirect back after login.
- Customer tries to view another customer's order → 403.
- Cashier tries to open another cashier's receipt → 403.
- Admin deactivates themselves → blocked.
- Category with products → delete blocked with a clear error.
- Product with order history → soft delete only; order snapshots unchanged.
- Image upload fails validation → no partial files; old primary preserved.
- Cart quantity above stock → clamped with a warning.
- Empty product image → letter tile; empty lists → empty states.
- Shipping fee threshold exactly at the boundary → free shipping.
- POS sale with a deleted/inactive product → rejected at validation.
- Invalid status transition → 422 with a message, no partial writes.
- Network slow/failed request → disabled buttons, spinner, toast on failure.

---

## 15. Definition of done

```bash
# Fresh setup
php artisan migrate:fresh --seed
php artisan storage:link
npm run build

# Quality gates
php artisan test --compact
vendor/bin/pint --dirty --format agent
npm run types:check
```

Manual demo script:

1. **Customer:** open `/` → search "milk" → add 2 items → log in → cart preserved → checkout → simulate KHQR success → order shows `Paid` → admin ships it → customer sees `Shipped` with tracking.
2. **Cashier:** open `/pos` → search by SKU → add items → cash payment with change → receipt prints at 80mm → sale appears in own-sales list.
3. **Admin:** dashboard shows revenue/orders/low stock → create a product with image → adjust stock with a reason → update an order to `Delivered` → cancel a paid order and confirm stock returns → create a cashier account.
4. **Responsive:** storefront at 375px, POS at 768px, admin at 1024px, light and dark mode.

---

## 16. Open risks

1. **SQLite locking.** `lockForUpdate()` is a no-op; concurrent demos are serialized rather than truly locked. Acceptable for a single-user demo, but do not claim production-grade concurrency.
2. **Seed images.** Downloads need network and the license/attribution needs a quick review; the letter tile is the fallback, but screenshots depend on the photos.
3. **Receipt printing.** Output depends on browser/paper settings; the 80mm CSS cannot be verified against a real thermal printer here.
4. **Starter-kit test cleanup.** Disabling Fortify features affects existing tests. Per project rules, deleting them needs explicit approval; the plan is to adapt them.
5. **Wayfinder drift.** New controllers require regenerated actions; forgetting this produces type errors.
6. **One guard, three portals.** Edge cases around authenticated users visiting the wrong login page need explicit redirects.
7. **Portfolio honesty.** The payment flow is a simulation; the UI and README must not imply a real ABA integration.
8. **Scope creep.** No deadline means the out-of-scope list is the guardrail; v2 features stay out of v1.

---

## 17. Deferred to v2 (schema-friendly, not built)

Real ABA PayWay · coupons · reviews · wishlist · variants · refunds/returns · email receipts · delivery-provider tracking · multi-store · deployment.

The schema already supports most of these: integer cents, snapshot line items, a `payments` table with a provider column, a stock ledger, and a `PaymentGateway` contract.
