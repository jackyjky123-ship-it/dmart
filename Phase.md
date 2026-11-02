# Remaining Implementation Phases — DMart

This document tracks all phases not yet implemented from [PLAN.md](PLAN.md).
Phases 0 and 1 are already completed.

---

## Overview

| Phase | Name | Target Deliverables | Status |
|---|---|---|---|
| **Phase 2** | Auth Portals & Layout Skeleton | Dedicated login portals, custom layouts (`StorefrontLayout`, `AdminLayout`, `PosLayout`), route shells | ✅ Completed |
| **Phase 3** | Admin Catalog Management | Category CRUD, Product CRUD, image uploads/management, stock adjustments & ledger, store settings | ✅ Completed |
| **Phase 4** | Storefront & Cart | Category browsing, product listing/detail, client-side persistent cart state, letter tile fallback | ✅ Completed |
| **Phase 5** | Checkout, Payment Simulation & Orders | Checkout flow, fresh address snapshot, payment simulation, cancellation auto-restock, order history | ✅ Completed |
| **Phase 6** | POS Terminal | POS selling screen, category chips, held tickets, cash with change calculation, mock QR, 80mm thermal receipt printing, own-sales history | ✅ Completed |
| **Phase 7** | Admin Orders, Dashboard & Staff | Status fulfillment flow, order cancellation with auto-restock, sales performance chart, heatmap matrix, staff account management | ✅ Completed |
| **Phase 8** | Seed Data & Demo Polish | Seeders for categories, products, demo users, 31 historical orders with payments & movements, dark mode & responsive UI polish | ✅ Completed |
| **Phase 9** | Hardening & Quality Gates | Comprehensive Pest feature tests (15–25 tests), Larastan check, production build, manual demo script run | ⏳ Next |

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
- [x] Controllers:
  - `Storefront\HomeController` (categories, featured/newest active products)
  - `Storefront\ProductController` (`index` with search, category filtering, sorting, pagination; `show` with image gallery, related products)
- [x] Client Cart & State:
  - `resources/js/hooks/use-cart.tsx`: Client-side persistent cart state with local storage, stock ceiling enforcement, subtotal calculation, and clear/remove actions
- [x] Frontend Pages:
  - `resources/js/pages/storefront/home.tsx` (hero banner, category grid, featured products, promotional strips, ticker marquee)
  - `resources/js/pages/storefront/products/index.tsx` (filter by category, search input, sort by price/newest, responsive product grid, pagination)
  - `resources/js/pages/storefront/products/show.tsx` (image gallery/thumbnails, letter tile fallback, pricing, stock status, quantity stepper, color/size swatches, add to cart button, related items)
  - `resources/js/pages/storefront/cart.tsx` (cart line items, quantity adjustment, delete item, subtotal, shipping fee estimate, free shipping progress bar, checkout CTA)
- [x] Shared Components:
  - `product-card.tsx`, `product-thumb.tsx` (deterministic colored letter-tile fallback), `price.tsx`, `quantity-stepper.tsx`, `empty-state.tsx`

**Status:** Completed and verified with production build.

**Done when:**
A guest can browse, search, and add items to a cart; stock caps prevent over-ordering; product thumbnails fall back to colored letter tiles when images are absent.

---

## Phase 5 — Checkout, Mock Payment & Orders

### Scope
- [x] Services & Support:
  - `StorefrontProduct` & `OrderPresenter` (presentation helpers snapshotting line items, pricing, addresses, statuses)
  - Stock verification and ledger entries on order placement and cancellation
- [x] Controllers & Actions:
  - `Storefront\OrderController::checkout` (checkout view with address input)
  - `Storefront\OrderController::store` (transactional checkout order placement with address snapshot)
  - `Storefront\OrderController::payment` (decorative KHQR payment view)
  - `Storefront\OrderController::simulatePayment` (transitions order to `paid` and creates payment record)
  - `Storefront\OrderController::index` (customer's own orders list)
  - `Storefront\OrderController::show` (order detail snapshot view)
  - `Storefront\OrderController::cancel` (cancellation with automatic inventory restoration)
- [x] Authorization:
  - Scoped to authenticated user's own orders
- [x] Frontend Pages:
  - `resources/js/pages/storefront/checkout.tsx` (shipping form: name, phone, address, city, notes; order summary; place order CTA)
  - `resources/js/pages/storefront/payment.tsx` (decorative KHQR QR code display, "Demo payment — no real money" banner, simulate payment button, cancel button)
  - `resources/js/pages/storefront/orders/index.tsx` (customer order history list, status badges, totals, view link)
  - `resources/js/pages/storefront/orders/show.tsx` (order details, shipping info, line item snapshots, status timeline, cancel button for pending orders)

**Status:** Completed and verified with production build.

**Done when:**
Full checkout flow functions end-to-end; simulated payment transitions order to `paid` and decrements stock; repeated simulate clicks are idempotent; customer can cancel pending orders.

---

## Phase 6 — POS Terminal

### Scope
- [x] Controllers & Requests:
  - `Pos\SaleController::index` (renders POS terminal with live catalog, categories, and active held tickets)
  - `Pos\SaleController::store` (creates POS sale with instant stock decrement, cash tendered/change calculation or mock QR)
  - `Pos\SaleController::sales` (cashier's own sales list for the shift)
- [x] Frontend Pages:
  - `resources/js/pages/pos/index.tsx` (two-column layout: product catalog grid with instant search & category chips on left; live cart, subtotal, held ticket switching, tender drawer on right)
  - `resources/js/pages/pos/sales/index.tsx` (list of cashier's sales for the shift, time, order number, amount, reprint receipt button)
- [x] Cashier Scoping:
  - Middleware `['auth', 'active', 'role:cashier,admin']`, sale records track `cashier_id`

**Status:** Completed and verified with production build.

**Done when:**
A cashier can ring up a walk-in sale in under 60 seconds with cash (calculating change) or mock QR, decrement stock immediately, and print a thermal receipt; sales are scoped to the logged-in cashier.

---

## Phase 7 — Admin Orders, Dashboard & Staff

### Scope
- [x] Controllers & Requests:
  - `Admin\DashboardController` (live revenue, order count, paid order count, 7-day revenue grouping, 30-day orders-by-hour heatmap matrix, top products, category breakdown)
  - `Admin\OrderController` (`index`, `show`, `update` status transition `paid` → `processing` → `shipped` → `delivered`, `cancel` order with auto-restock)
  - `Admin\StaffController` (`index`, `store` new cashier/admin, `updateStatus` with self-deactivation guard, `resetPassword`)
- [x] Frontend Pages:
  - `resources/js/pages/admin/dashboard.tsx` (4 KPI stat cards, sales performance chart, orders-by-time heatmap grid, recent orders table, low-stock warnings, top products list)
  - `resources/js/pages/admin/orders/index.tsx` (all orders across channels, status filter tabs, search by order number/customer, pagination)
  - `resources/js/pages/admin/orders/show.tsx` (order details, payment metadata, customer info, status transition dropdown with carrier & tracking number input, cancellation with auto-restock)
  - `resources/js/pages/admin/staff/index.tsx` (staff table with name, email, role, active badge; modal to create cashier/admin, edit staff, toggle active status with self-deactivation guard, reset password)

**Status:** Completed and verified with production build.

**Done when:**
Admin can advance orders through `paid` → `processing` → `shipped` → `delivered`; cancelling a paid order restores inventory with a return stock movement; admin dashboard renders accurate stats; staff can be created and managed securely.

---

## Phase 8 — Seed Data & Demo Polish

### Scope
- [x] Seeders:
  - `DemoUserSeeder`: Admin (`admin@dmart.test`), Cashier (`cashier@dmart.test`), Customer (`customer@dmart.test`), plus additional sample customer profiles (`jacob@example.com`, `bessie@example.com`, `ralph@example.com`, `esther@example.com`) with default password `password`
  - `DemoCatalogSeeder`: Real streetwear categories (Hoodies, Tees, Outerwear, Bottoms, Accessories) and 12 curated products with images, SKUs, compare-at pricing, and stock
  - `DemoOrderSeeder`: 31 realistic orders across 30 days (online orders in diverse statuses and completed POS sales) with corresponding payments and stock ledger entries wrapped in a fast database transaction
  - `DemoSettingsSeeder`: Store name, address, phone, shipping fee ($2.00), free shipping threshold ($35.00), low stock threshold (5)
- [x] UI Polish:
  - Dark mode aesthetic across storefront (`#171717` + `#F25623`), back-office admin, and POS terminal
  - Responsive layout verification: mobile storefront, tablet POS register, and desktop admin dashboard
  - Loading states, empty states, and fallback letter tiles

**Status:** Completed and verified with `php artisan migrate:fresh --seed` (runs in ~16s).

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
