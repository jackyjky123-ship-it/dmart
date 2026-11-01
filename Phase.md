# Remaining Implementation Phases — DMart

This document tracks all phases not yet implemented from [PLAN.md](PLAN.md).
Phases 0 and 1 are already completed.

---

## Overview

| Phase | Name | Target Deliverables |
|---|---|---|
| **Phase 2** | Auth Portals & Layout Skeleton | Dedicated login portals, custom layouts (`StorefrontLayout`, `AdminLayout`, `PosLayout`), route shells |
| **Phase 3** | Admin Catalog Management | Category CRUD, Product CRUD, image uploads/management, stock adjustments & ledger, store settings |
| **Phase 4** | Storefront & Cart | Category browsing, product listing/detail, `CartService` (session + DB cart merge on login), letter tile fallback |
| **Phase 5** | Checkout, Payment Simulation & Orders | Checkout flow, fresh address snapshot, `OrderService`, `MockKhqrGateway`, `PaymentService`, idempotency guard, order history |
| **Phase 6** | POS Terminal | POS selling screen, debounced live search, cash with change calculation, mock QR, 80mm thermal receipt printing, own-sales history |
| **Phase 7** | Admin Orders, Dashboard & Staff | Status fulfillment flow, order cancellation with auto-restock, SVG sales chart, KPI cards, staff account management |
| **Phase 8** | Seed Data & Demo Polish | Seeders for 8 categories, 40 products, 3 demo users, 30 historical orders, sample images, dark mode & responsive UI polish |
| **Phase 9** | Hardening & Quality Gates | Comprehensive Pest feature tests (15–25 tests), Larastan check, production build, manual demo script run |

---

## Phase 2 — Auth Portals & Route Skeleton

### Scope
- [x] Dedicated login portals:
  - `/admin/login` (Admin portal)
  - `/pos/login` (Cashier portal)
  - `/login` (Customer portal)
- [x] Layout resolution in `resources/js/app.tsx`:
  - `storefront/*` → `StorefrontLayout`
  - `admin/*` → `AdminLayout`
  - `pos/*` → `PosLayout`
  - `auth/*` → `AuthLayout`
  - `settings/*` → `[AppLayout, SettingsLayout]`
- [x] Layout components:
  - `resources/js/layouts/storefront-layout.tsx` (header with logo, search bar, cart badge, user menu, footer, dark mode toggle)
  - `resources/js/layouts/admin-layout.tsx` (sidebar with Dashboard, Products, Categories, Orders, Stock, Staff, Settings, top bar, breadcrumbs, user menu)
  - `resources/js/layouts/pos-layout.tsx` (full-width terminal shell, cashier name badge, quick logout)
- [x] Role-based redirect on `/dashboard` (admin → `/admin`, cashier → `/pos`, customer → `/`)

**Status:** Completed and verified with feature tests & build.

**Done when:**
Each role authenticates through its designated portal and lands in the proper workspace; wrong-portal logins show clear validation errors; inactive users cannot log in.

---

## Phase 3 — Admin Catalog

### Scope
- [x] Controllers & Form Requests:
  - `Admin\CategoryController` (`StoreCategoryRequest`, `UpdateCategoryRequest`)
  - `Admin\ProductController` (`StoreProductRequest`, `UpdateProductRequest`)
  - `Admin\ProductImageController` (`StoreProductImagesRequest`)
  - `Admin\StockController` (`AdjustStockRequest`)
  - `Admin\SettingController` (`UpdateSettingsRequest`)
- [x] Services:
  - `StockService` (adjust stock, write `stock_movements` ledger)
- [x] Frontend Pages:
  - `resources/js/pages/admin/categories/index.tsx` (category table, modal create/edit, product count, delete guard when products exist)
  - `resources/js/pages/admin/products/index.tsx` (product table with search, category filter, active toggle, stock count, edit/delete)
  - `resources/js/pages/admin/products/create.tsx` (name, slug, SKU, category, price, compare-at price, initial stock, description, image uploader)
  - `resources/js/pages/admin/products/edit.tsx` (edit product attributes, manage images, primary image selection, delete image)
  - `resources/js/pages/admin/stock/index.tsx` (stock ledger, low-stock filter, manual adjustment modal with reason)
  - `resources/js/pages/admin/settings.tsx` (store name, address, phone, shipping fee, free shipping threshold, low stock threshold)
- [x] Image Storage:
  - Store to `public` disk under `products/{product_id}/{uuid}.{ext}`
  - Delete file when image is deleted, promote next image to primary if previous primary was deleted

**Status:** Completed and verified with feature tests & production build.

**Done when:**
An admin can build a catalog from scratch, upload product images, set compare-at prices, adjust stock with audit reasons, and configure store settings.

---

## Phase 4 — Storefront & Cart

### Scope
- [ ] Services:
  - `CartService`: Guest session cart, authenticated DB cart, automatic merge on login, stock ceiling enforcement, subtotal calculation
- [ ] Controllers:
  - `Storefront\HomeController` (categories, featured/newest active products)
  - `Storefront\ProductController` (`index` with search, category filtering, sorting, pagination; `show` with image gallery, related products)
  - `Storefront\CartController` (`index`, `store`, `update`, `destroy`)
- [ ] Frontend Pages:
  - `resources/js/pages/storefront/home.tsx` (hero banner, category grid, featured products, promotional strips)
  - `resources/js/pages/storefront/products/index.tsx` (filter by category, search input, sort by price/newest, responsive product grid, pagination)
  - `resources/js/pages/storefront/products/show.tsx` (image carousel/thumbnails, letter tile fallback, pricing, stock status, quantity stepper, add to cart button, related items)
  - `resources/js/pages/storefront/cart.tsx` (cart line items, quantity adjustment, delete item, subtotal, shipping fee estimate, free shipping progress bar, checkout CTA)
- [ ] Shared Components:
  - `product-card.tsx`, `product-thumb.tsx` (deterministic colored letter-tile fallback), `price.tsx`, `quantity-stepper.tsx`, `cart-line.tsx`, `empty-state.tsx`

**Done when:**
A guest can browse, search, and add items to a cart; logging in merges guest cart with their DB cart; stock caps prevent over-ordering; product thumbnails fall back to colored letter tiles when images are absent.

---

## Phase 5 — Checkout, Mock Payment & Orders

### Scope
- [ ] Payment Gateway Architecture:
  - `App\Payments\PaymentGateway` interface (`createIntent`, `confirm`)
  - `App\Payments\MockKhqrGateway` implementation
- [ ] Services:
  - `OrderService::createOnlineOrder` (snapshot line items, fresh address, calculate totals & shipping fee, generate `DM-######` number)
  - `PaymentService::complete` (transactional re-check of stock, decrement stock via `StockService`, create `stock_movements` rows, transition payment & order to `paid`)
- [ ] Controllers & Form Requests:
  - `Storefront\CheckoutController` (`CheckoutRequest`)
  - `Storefront\PaymentController` (`simulate` with throttle and idempotency guard)
  - `Storefront\OrderController` (`index`, `show`, `cancel`)
- [ ] Policies:
  - `OrderPolicy` (ensure customers can only view and cancel their own orders)
- [ ] Frontend Pages:
  - `resources/js/pages/storefront/checkout.tsx` (shipping form: name, phone, address, city, notes; order summary; place order CTA)
  - `resources/js/pages/storefront/payment.tsx` (decorative KHQR QR code display, "Demo payment — no real money" banner, simulate payment button, cancel button)
  - `resources/js/pages/storefront/orders/index.tsx` (customer order history list, status badges, totals, view link)
  - `resources/js/pages/storefront/orders/show.tsx` (order details, shipping info, line item snapshots, status timeline, cancel button for pending orders)

**Done when:**
Full checkout flow functions end-to-end; simulated payment transitions order to `paid` and decrements stock; repeated simulate clicks are idempotent; customer can cancel pending orders.

---

## Phase 6 — POS Terminal

### Scope
- [ ] Controllers & Requests:
  - `PosController::index` (renders POS terminal)
  - `PosController::searchProducts` (JSON endpoint, debounced search by name/SKU, category filter, max 20 active products with stock > 0)
  - `PosSaleController::store` (`StorePosSaleRequest`: items, payment method, cash tendered)
  - `PosSaleController::index` (cashier's own sales list)
  - `PosSaleController::receipt` (80mm printable receipt)
- [ ] Services:
  - `OrderService::createPosSale` (channel `pos`, status `completed`, immediate stock decrement, cash tendered/change snapshot)
- [ ] Frontend Pages:
  - `resources/js/pages/pos/index.tsx` (two-column layout: product catalog grid with instant search & category chips on left; live cart, subtotal, tender panel on right)
  - `resources/js/pages/pos/sales/index.tsx` (list of cashier's sales for the shift, time, order number, amount, reprint receipt button)
  - `resources/js/pages/pos/sales/receipt.tsx` (80mm thermal receipt layout with store header, itemized list, totals, cash tendered & change, footer note, auto `window.print()`)

**Done when:**
A cashier can ring up a walk-in sale in under 60 seconds with cash (calculating change) or mock QR, decrement stock immediately, and print a thermal receipt; sales are scoped to the logged-in cashier.

---

## Phase 7 — Admin Orders, Dashboard & Staff

### Scope
- [ ] Services:
  - `DashboardService` (revenue today, order count today, low stock count, pending orders, 7-day revenue daily breakdown, top 5 selling products)
- [ ] Controllers & Requests:
  - `Admin\DashboardController`
  - `Admin\OrderController` (`UpdateOrderStatusRequest`, `CancelOrderRequest`)
  - `Admin\StaffController` (`StoreStaffRequest`, `UpdateStaffRequest`, `UpdateStaffPasswordRequest`)
- [ ] Frontend Pages:
  - `resources/js/pages/admin/dashboard.tsx` (4 KPI stat cards, hand-rolled responsive SVG 7-day sales bar chart, recent orders table, low-stock warnings, top products list)
  - `resources/js/pages/admin/orders/index.tsx` (all orders across channels, status filter tabs, search by order number/customer, pagination)
  - `resources/js/pages/admin/orders/show.tsx` (order details, payment metadata, customer info, status transition dropdown with carrier & tracking number input, cancellation with auto-restock)
  - `resources/js/pages/admin/staff/index.tsx` (staff table with name, email, role, active badge; modal to create cashier/admin, edit staff, toggle active status with self-deactivation guard, reset password)

**Done when:**
Admin can advance orders through `paid` → `processing` → `shipped` → `delivered`; cancelling a paid order restores inventory with a return stock movement; admin dashboard renders accurate stats; staff can be created and managed securely.

---

## Phase 8 — Seed Data & Demo Polish

### Scope
- [ ] Seeders:
  - `DemoUserSeeder`: Admin (`admin@dmart.test`), Cashier (`cashier@dmart.test`), Customer (`customer@dmart.test`), with default password `password`
  - `DemoCategorySeeder`: 8 grocery categories (Beverages, Snacks, Bakery, Dairy, Household, Personal Care, Frozen, Produce)
  - `ProductSeeder`: 40 realistic grocery products with SKUs, realistic prices, compare-at prices, initial stock, and low-stock thresholds
  - `DemoOrderSeeder`: ~30 realistic orders across 30 days (online orders in diverse statuses and completed POS sales) with corresponding payments and stock ledger entries
  - `DemoSettingsSeeder`: Store name, address, phone, shipping fee ($2.00), free shipping threshold ($50.00), low stock threshold (5)
  - Image downloader helper: curated royalty-free images downloaded to `storage/app/public/products` with fallback to letter tile on network failure
- [ ] UI Polish:
  - Dark mode audit on all portals (storefront, admin, POS)
  - Responsive verification: 375px (mobile storefront), 768px (POS tablet), 1024px+ (admin desktop)
  - Loading spinners, empty states, and error boundary verification

**Done when:**
`php artisan migrate:fresh --seed` creates a rich, realistic store ready for presentation without manual data entry.

---

## Phase 9 — Tests & Hardening

### Scope
- [ ] Pest Feature Test Suite (15–25 tests):
  - `RoleAccessTest` (guest redirects, role boundary restrictions, inactive user lockout)
  - `PortalLoginTest` (role validation per portal, landing redirects)
  - `CartTest` (guest session cart, cart merge on login, stock cap enforcement)
  - `CheckoutTest` (order creation, address snapshots, shipping calculation, free threshold)
  - `MockPaymentTest` (single simulation, idempotent duplicate simulation, out-of-stock failure handling, owner authorization)
  - `SaleTest` (POS cash sale totals, change calculation, out-of-stock rejection, cashier scoping)
  - `ProductManagementTest` (CRUD, SKU/slug uniqueness, soft deletes, stock ledger audit)
  - `OrderFulfillmentTest` (allowed status transitions, tracking number persistence, restock on cancellation)
  - `StaffTest` (staff CRUD, self-deactivation prevention, authorization)
  - `SettingsTest` (settings update, fee changes reflecting on checkout)
  - `DashboardTest` (KPI calculations, 7-day revenue grouping, top products)
- [ ] Quality Assurance:
  - `php artisan test --compact` green across all tests
  - `npm run types:check` passes with zero errors
  - `npm run build` succeeds cleanly
  - `vendor/bin/pint --dirty --format agent` passes
- [ ] Manual Demo Walkthrough (Section 15 script)

**Done when:**
All automated test suites and quality gates pass with zero errors, and the entire manual walkthrough passes without issue.
