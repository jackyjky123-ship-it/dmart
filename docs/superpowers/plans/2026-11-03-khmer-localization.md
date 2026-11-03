# Khmer Localization & Kantumruy Font Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate the entire DMart website from English to Khmer across all user roles (Storefront, POS, Admin, Auth, Settings) using Google Font Kantumruy Pro with a responsive language switcher.

**Architecture:** Laravel backend localization with a `SetLocale` middleware and `LocaleController` persisting preference via session and cookie; Inertia shares active locale and translation dictionary to React; a client `useTranslation()` hook applies translations seamlessly while Tailwind CSS dynamically switches `--font-sans` to `Kantumruy Pro` whenever `html[lang="km"]` is active.

**Tech Stack:** Laravel 13, Inertia.js v3, React 19, Tailwind CSS v4, Google Fonts (`Kantumruy Pro`), Pest PHP, TypeScript.

**Spec:** [docs/superpowers/specs/2026-11-03-khmer-localization-design.md](file:///media/spiderweb/DATA/DMart/docs/superpowers/specs/2026-11-03-khmer-localization-design.md)

## Global Constraints

- PHP code must follow Laravel Pint standards: `vendor/bin/pint --format agent`.
- Test suite must pass without regressions: `vendor/bin/pest`.
- Frontend builds and type checks must pass without errors: `npm run types:check && npm run build`.
- No database migrations or schema alterations for categories or products; default categories use dictionary lookup `t(category.name)`.
- When `locale === 'en'`, `translations` shared by Inertia is empty `(object)[]`, allowing `t(key)` to fall back directly to `key` without memory overhead.
- When `html[lang="km"]` is set, `app.css` applies `'Kantumruy Pro'` to `--font-sans` so all existing UI typography scales uniformly.

## Review Focus

1. **Locale Persistence on Guest Visits:** When an unauthenticated user switches language to Khmer, cookies preserve the choice across multiple subsequent page requests.
    - _Test:_ `tests/Feature/LocaleTest.php::test_unauthenticated_user_can_switch_locale_and_cookie_persists()`
2. **Invalid Locale Fallback:** A request posting an invalid locale (e.g. `es`, `fr`, or arbitrary string) safely rejects with validation error or falls back to default `en`.
    - _Test:_ `tests/Feature/LocaleTest.php::test_invalid_locale_is_rejected()`
3. **Inertia Props Optimization:** In English mode, `translations` prop is empty; in Khmer mode, `translations` contains the mapped dictionary.
    - _Test:_ `tests/Feature/LocaleTest.php::test_inertia_shares_translations_only_when_khmer_active()`
4. **Font Switching Cascade:** When `html[lang="km"]` is active, elements using `font-sans` render with `Kantumruy Pro`.
    - _Test:_ Verified in `resources/css/app.css` and browser stylesheet inspection.
5. **Replacements in Translation Strings:** Placeholders such as `:count` or `:name` are properly replaced when formatted via `t(key, replacements)`.
    - _Test:_ Verified in `useTranslation` unit test / React component assertions.

---

### Task 1: Backend Localization Infrastructure (Routes, Controller, Middleware & Inertia Sharing)

**Files:**

- Create: `app/Http/Controllers/LocaleController.php`
- Create: `app/Http/Middleware/SetLocale.php`
- Modify: `bootstrap/app.php`
- Modify: `routes/web.php`
- Modify: `app/Http/Middleware/HandleInertiaRequests.php`
- Test: `tests/Feature/LocaleTest.php`

**Interfaces:**

- Consumes: Standard Laravel Request, Session, Cookie, Inertia middleware
- Produces:
    - Route: `POST /locale` (`name: locale.update`) accepting `{ "locale": "en" | "km" }`
    - Middleware `SetLocale`: sets `app()->setLocale($locale)`
    - Inertia Shared Props: `locale: string`, `locales: Record<string, string>`, `translations: Record<string, string>`

- [ ] **Step 1: Write the failing tests in `tests/Feature/LocaleTest.php`**

```php
test('user can switch locale between en and km', function () {
    $response = $this->post(route('locale.update'), ['locale' => 'km']);
    $response->assertRedirect();
    $response->assertSessionHas('locale', 'km');
    $response->assertCookie('locale', 'km');
});

test('invalid locale is rejected', function () {
    $response = $this->post(route('locale.update'), ['locale' => 'invalid']);
    $response->assertSessionHasErrors('locale');
});

test('inertia receives locale and translations props', function () {
    $this->withSession(['locale' => 'km'])
        ->get('/')
        ->assertInertia(fn ($page) => $page
            ->where('locale', 'km')
            ->has('translations')
        );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `vendor/bin/pest tests/Feature/LocaleTest.php`
Expected: FAIL (route `locale.update` not defined)

- [ ] **Step 3: Implement `LocaleController`, `SetLocale` middleware, routes, and `HandleInertiaRequests` sharing**

1. Create `app/Http/Controllers/LocaleController.php`:
    - Validates `['locale' => 'required|string|in:en,km']`.
    - Stores in session `session(['locale' => $request->input('locale')])`.
    - Returns `back()->withCookie(cookie()->forever('locale', $request->input('locale')))`.
2. Create `app/Http/Middleware/SetLocale.php`:
    - Checks `session('locale') ?? $request->cookie('locale') ?? config('app.locale', 'en')`.
    - If not in `['en', 'km']`, defaults to `'en'`.
    - Calls `app()->setLocale($locale)`.
3. Register `SetLocale` in `bootstrap/app.php` inside `withMiddleware(function (Middleware $middleware) { ... })`.
4. Register `Route::post('locale', [LocaleController::class, 'update'])->name('locale.update');` in `routes/web.php`.
5. Update `app/Http/Middleware/HandleInertiaRequests.php` `share()` method to include:
    - `'locale' => app()->getLocale()`
    - `'locales' => ['en' => 'English', 'km' => 'ភាសាខ្មែរ']`
    - `'translations' => fn () => app()->getLocale() === 'km' && file_exists(base_path('lang/km.json')) ? json_decode(file_get_contents(base_path('lang/km.json')), true) : (object)[]`

- [ ] **Step 4: Run test to verify it passes**

Run: `vendor/bin/pest tests/Feature/LocaleTest.php`
Expected: PASS (all 3 tests green)

- [ ] **Step 5: Format and commit**

```bash
vendor/bin/pint --format agent
git add app/Http/Controllers/LocaleController.php app/Http/Middleware/SetLocale.php bootstrap/app.php routes/web.php app/Http/Middleware/HandleInertiaRequests.php tests/Feature/LocaleTest.php
git commit -m "feat(i18n): add locale controller, set-locale middleware, and inertia props"
```

---

### Task 2: Kantumruy Pro Typography & Tailwind CSS Configuration

**Files:**

- Modify: `resources/css/app.css`
- Modify: `resources/views/app.blade.php`

**Interfaces:**

- Consumes: Google Fonts API (`family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700`)
- Produces: CSS rules dynamically switching `--font-sans` to `'Kantumruy Pro'` when `html[lang="km"]` is active.

- [ ] **Step 1: Inspect and update `resources/css/app.css`**

1. Update Google Fonts `@import` at line 1 to include `Kantumruy Pro`:
    ```css
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&family=Montserrat:wght@800;900&display=swap');
    ```
2. In `@theme`, define `--font-khmer`:
    ```css
    --font-khmer: 'Kantumruy Pro', ui-sans-serif, system-ui, sans-serif;
    ```
3. Add locale font rule below `@theme`:
    ```css
    html[lang='km'],
    html[lang^='km-'] {
        --font-sans:
            'Kantumruy Pro', ui-sans-serif, system-ui, sans-serif,
            'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
            'Noto Color Emoji';
        font-family: var(--font-sans);
    }
    ```

- [ ] **Step 2: Verify `resources/views/app.blade.php`**

Ensure line 2 `<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" ...>` stays intact so changing `app()->setLocale('km')` outputs `<html lang="km">`.

- [ ] **Step 3: Run Vite build to verify stylesheet compilation**

Run: `npm run build`
Expected: PASS with 0 build errors.

- [ ] **Step 4: Commit**

```bash
git add resources/css/app.css resources/views/app.blade.php
git commit -m "style: configure Kantumruy Pro font for Khmer locale in app.css"
```

---

### Task 3: Comprehensive Translation Dictionaries (`lang/km.json` and `lang/en.json`)

**Files:**

- Create: `lang/km.json`
- Create: `lang/en.json`

**Interfaces:**

- Consumes: System labels, button texts, table headers, validation errors, and categories across DMart
- Produces: Key-value JSON dictionaries for English and Khmer.

- [ ] **Step 1: Author comprehensive Khmer dictionary in `lang/km.json`**

Include standard Cambodian translations for:

- **Navigation & Layout:** "Home", "Products", "Categories", "Cart", "Checkout", "Orders", "Sign In", "Sign Out", "Register", "Dashboard", "POS Register", "Admin Portal", "Settings", "Profile", "Security", "Appearance".
- **Storefront Home & Catalog:** "Featured Categories", "Best Sellers", "New Arrivals", "Special Offers", "Shop Now", "Add to Cart", "View Details", "In Stock", "Out of Stock", "Search products...", "Filter by", "Sort by", "Price: Low to High", "Price: High to Low", "All Products", "Free shipping over $35".
- **Cart & Checkout:** "Shopping Cart", "Your cart is empty", "Subtotal", "Delivery Fee", "Total", "Proceed to Checkout", "Shipping Address", "Full Name", "Phone Number", "Delivery Address", "Payment Method", "Bakong KHQR", "Cash on Delivery", "Place Order", "Order Summary".
- **Orders & Tracking:** "Order History", "Order ID", "Date", "Items", "Status", "Pending", "Processing", "Completed", "Cancelled", "Paid", "Unpaid", "Order Details", "Track Order", "Back to Orders".
- **POS (Cashier):** "Point of Sale", "Sales History", "New Sale", "Scan barcode or enter SKU", "Customer", "Walk-in Customer", "Discount", "Tax", "Amount Tendered", "Change Due", "Pay Now", "Complete Sale", "Print Receipt", "Receipt No", "Cashier", "Thank you for shopping with us!".
- **Admin:** "Store Overview", "Today Sales", "Total Orders", "Low Stock Alerts", "Total Customers", "Add Product", "Edit Product", "Delete Product", "Product Name", "SKU", "Barcode", "Cost Price", "Selling Price", "Quantity", "Adjust Stock", "Category Name", "Add Category", "Staff Members", "Role", "Admin", "Cashier", "Active", "Inactive", "Store Settings", "Save Changes".
- **Default Categories:** "Beverages" -> "ភេសជ្ជៈ", "Bakery" -> "នំបុ័ង", "Snacks" -> "អាហារសម្រន់", "Dairy" -> "ផលិតផលទឹកដោះគោ", "Fresh Produce" -> "បន្លែផ្លែឈើស្រស់", "Pantry" -> "គ្រឿងទេស", "Frozen Food" -> "អាហារក្លាសេ", "Personal Care" -> "សម្ភារៈថែរក្សាខ្លួន".
- **Common UI & Alerts:** "Confirm", "Cancel", "Delete", "Save", "Edit", "Close", "Back", "Are you sure?", "This action cannot be undone.", "Success", "Error", "Item added to cart.", "Order placed successfully.", "Settings updated successfully.".

- [ ] **Step 2: Create mirror file `lang/en.json`**

Provide key-value identity mappings for English strings.

- [ ] **Step 3: Verify JSON validity and dictionary loading**

Run: `php -r "json_decode(file_get_contents('lang/km.json'), true, 512, JSON_THROW_ON_ERROR); json_decode(file_get_contents('lang/en.json'), true, 512, JSON_THROW_ON_ERROR); echo 'Valid JSON';" `
Expected: "Valid JSON"

- [ ] **Step 4: Commit**

```bash
git add lang/km.json lang/en.json
git commit -m "feat(i18n): create Khmer and English translation dictionaries"
```

---

### Task 4: Frontend `useTranslation` Hook & `LanguageSwitcher` Component

**Files:**

- Create: `resources/js/hooks/use-translation.ts`
- Create: `resources/js/components/language-switcher.tsx`
- Modify: `resources/js/types/index.ts` (or relevant types)

**Interfaces:**

- Consumes: Inertia `props.locale`, `props.translations`, `props.locales`
- Produces:
    - `useTranslation()`: `{ t: (key: string, replacements?: Record<string, string | number>) => string, locale: string }`
    - `<LanguageSwitcher variant="header" | "compact" | "dropdown" />`

- [ ] **Step 1: Create `resources/js/hooks/use-translation.ts`**

Implement `useTranslation` reading `usePage<{ locale?: string; translations?: Record<string, string> }>()`.
Include placeholder replacement for `:key` and `{key}`.

- [ ] **Step 2: Create `resources/js/components/language-switcher.tsx`**

Implement a dropdown / toggle component displaying current language (`EN` / `ខ្មែរ`).
On change:

```ts
router.post(
    '/locale',
    { locale: targetLocale },
    { preserveScroll: true, preserveState: false },
);
```

Support dark mode and clean styling matching DMart's navbar/sidebar aesthetic.

- [ ] **Step 3: Run TypeScript check to verify type safety**

Run: `npm run types:check`
Expected: PASS (0 type errors)

- [ ] **Step 4: Commit**

```bash
git add resources/js/hooks/use-translation.ts resources/js/components/language-switcher.tsx resources/js/types/
git commit -m "feat(i18n): add useTranslation hook and LanguageSwitcher component"
```

---

### Task 5: Integrate Language Switcher into Layouts

**Files:**

- Modify: `resources/js/layouts/storefront-layout.tsx`
- Modify: `resources/js/layouts/pos-layout.tsx`
- Modify: `resources/js/layouts/admin-layout.tsx`
- Modify: `resources/js/layouts/auth/auth-simple-layout.tsx`
- Modify: `resources/js/layouts/auth/auth-card-layout.tsx`

**Interfaces:**

- Consumes: `<LanguageSwitcher />` from `resources/js/components/language-switcher.tsx`
- Produces: Header and mobile language switcher access across all roles.

- [ ] **Step 1: Add `<LanguageSwitcher />` to Storefront Header and Mobile Menu in `storefront-layout.tsx`**

Place in top announcement bar (or beside USD/currency indicator) and inside the mobile drawer.

- [ ] **Step 2: Add `<LanguageSwitcher />` to POS Topbar in `pos-layout.tsx`**

Place alongside the cashier status badge and clock in the header.

- [ ] **Step 3: Add `<LanguageSwitcher />` to Admin Layout in `admin-layout.tsx` & `app-sidebar.tsx`**

Place in admin header / sidebar footer next to user profile.

- [ ] **Step 4: Add `<LanguageSwitcher />` to Auth Layouts in `auth-simple-layout.tsx` and `auth-card-layout.tsx`**

Place in the top-right corner of auth pages so guests can switch languages before signing in or registering.

- [ ] **Step 5: Run TypeScript check and Vite build**

Run: `npm run types:check && npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add resources/js/layouts/
git commit -m "feat(ui): add language switcher across Storefront, POS, Admin, and Auth layouts"
```

---

### Task 6: Localize Storefront Pages & Components

**Files:**

- Modify: `resources/js/layouts/storefront-layout.tsx`
- Modify: `resources/js/pages/storefront/home.tsx`
- Modify: `resources/js/pages/storefront/products/index.tsx`
- Modify: `resources/js/pages/storefront/products/show.tsx`
- Modify: `resources/js/pages/storefront/cart.tsx`
- Modify: `resources/js/pages/storefront/checkout.tsx`
- Modify: `resources/js/pages/storefront/payment.tsx`
- Modify: `resources/js/pages/storefront/orders/index.tsx`
- Modify: `resources/js/pages/storefront/orders/show.tsx`
- Modify: `resources/js/components/product-card.tsx`
- Modify: `resources/js/components/status-badge.tsx`

**Interfaces:**

- Consumes: `useTranslation` (`t`)
- Produces: Fully translated customer-facing storefront in Khmer when active.

- [ ] **Step 1: Localize Storefront layout chrome, navbar, and footer**

Wrap all navigation links, search placeholders, announcements, and footer links in `t(...)`.

- [ ] **Step 2: Localize Home page & Product cards**

Translate hero titles, badge labels ("Limited Drops", "Best Sellers"), category cards `t(category.name)`, "Shop Now", "Add to Cart", and price badges.

- [ ] **Step 3: Localize Product catalog & Product detail page**

Translate filter labels, sorting options ("Price: Low to High", "Newest"), search input, stock availability ("In Stock", "Out of Stock"), description tabs, quantity selector, and breadcrumbs.

- [ ] **Step 4: Localize Cart, Checkout, and Payment pages**

Translate cart table headers, empty cart state, summary totals (Subtotal, Shipping, Total), shipping address form inputs, delivery instructions, KHQR instructions, Cash on delivery option, and "Place Order" button.

- [ ] **Step 5: Localize Orders list and Order detail pages**

Translate order status badges (`status-badge.tsx`), order date labels, items count, invoices, delivery timeline, and back links.

- [ ] **Step 6: Run TypeScript check and Pest tests**

Run: `npm run types:check && vendor/bin/pest`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add resources/js/pages/storefront/ resources/js/components/product-card.tsx resources/js/components/status-badge.tsx resources/js/layouts/storefront-layout.tsx
git commit -m "feat(storefront): localize storefront layout, catalog, cart, checkout, and orders to Khmer"
```

---

### Task 7: Localize POS (Point of Sale) Pages

**Files:**

- Modify: `resources/js/layouts/pos-layout.tsx`
- Modify: `resources/js/pages/pos/index.tsx`
- Modify: `resources/js/pages/pos/sales/index.tsx`

**Interfaces:**

- Consumes: `useTranslation` (`t`)
- Produces: Fully localized cashier terminal, product search, cart, tender payment modal, receipt modal, and sales history.

- [ ] **Step 1: Localize POS Layout & Topbar**

Translate cashier shift badge, current date display, "Sales History", "Register", "Logout" in `pos-layout.tsx`.

- [ ] **Step 2: Localize POS Cashier Register in `pages/pos/index.tsx`**

Translate:

- Search bar & barcode scanner placeholders.
- Category filter buttons `t(category.name)`.
- Cart basket headers ("Item", "Qty", "Price", "Total", "Discount", "Clear Cart").
- Summary calculations ("Subtotal", "Discount", "Tax", "Total Amount").
- Action buttons: "Hold Sale", "Pay / Tender", "Cancel".
- Tender payment modal: "Received Cash", "Change Due", "Exact Amount", "Complete Sale".
- Receipt modal: "Store Receipt", "Cashier", "Date & Time", "Thank you for shopping with us!", "Print Receipt".

- [ ] **Step 3: Localize Sales History in `pages/pos/sales/index.tsx`**

Translate sales table headers ("Receipt #", "Cashier", "Items", "Total", "Payment Method", "Actions"), filter by date, reprint receipt button, and empty state.

- [ ] **Step 4: Run TypeScript check and Pest tests**

Run: `npm run types:check && vendor/bin/pest`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add resources/js/pages/pos/ resources/js/layouts/pos-layout.tsx
git commit -m "feat(pos): localize cashier register, tender modal, receipt, and sales history"
```

---

### Task 8: Localize Admin Portal Pages & Navigation

**Files:**

- Modify: `resources/js/layouts/admin-layout.tsx`
- Modify: `resources/js/components/app-sidebar.tsx`
- Modify: `resources/js/pages/admin/dashboard.tsx`
- Modify: `resources/js/pages/admin/categories/index.tsx`
- Modify: `resources/js/pages/admin/products/index.tsx`
- Modify: `resources/js/pages/admin/products/create.tsx`
- Modify: `resources/js/pages/admin/products/edit.tsx`
- Modify: `resources/js/pages/admin/stock/index.tsx`
- Modify: `resources/js/pages/admin/orders/index.tsx`
- Modify: `resources/js/pages/admin/orders/show.tsx`
- Modify: `resources/js/pages/admin/staff/index.tsx`
- Modify: `resources/js/pages/admin/settings.tsx`

**Interfaces:**

- Consumes: `useTranslation` (`t`)
- Produces: Fully translated admin portal for inventory, categories, orders, staff, settings, and dashboard metrics.

- [ ] **Step 1: Localize Admin Sidebar & Header in `admin-layout.tsx` and `app-sidebar.tsx`**

Translate sidebar links: "Dashboard", "Products", "Categories", "Stock", "Orders", "Staff", "Settings".

- [ ] **Step 2: Localize Dashboard in `pages/admin/dashboard.tsx`**

Translate KPI titles ("Today Sales", "Total Orders", "Low Stock Items", "Total Customers"), chart axis/period labels ("Last 7 Days", "This Month"), and recent orders table headers.

- [ ] **Step 3: Localize Categories & Products in `pages/admin/categories/` and `pages/admin/products/`**

Translate "Add Category", "Edit Category", category name inputs, "Add Product", "Edit Product", SKU, Barcode, Selling Price, Cost Price, Stock Count, Category dropdown, and Save/Cancel buttons.

- [ ] **Step 4: Localize Stock Management in `pages/admin/stock/index.tsx`**

Translate "Stock Inventory", "Adjust Stock", "Current Stock", "New Quantity", "Reason", "Low Stock Threshold", and stock status badges.

- [ ] **Step 5: Localize Orders Management in `pages/admin/orders/`**

Translate order lists, customer details, fulfillment status dropdowns ("Mark as Processing", "Mark as Completed", "Cancel Order"), and invoice summaries.

- [ ] **Step 6: Localize Staff Management & Store Settings in `pages/admin/staff/` and `pages/admin/settings.tsx`**

Translate staff role labels ("Admin", "Cashier"), status toggles ("Active", "Inactive"), "Invite Staff", and store configuration inputs (Store Name, Phone, Address, Receipt Footer, Tax Rate).

- [ ] **Step 7: Run TypeScript check and Pest tests**

Run: `npm run types:check && vendor/bin/pest`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add resources/js/pages/admin/ resources/js/layouts/admin-layout.tsx resources/js/components/app-sidebar.tsx
git commit -m "feat(admin): localize admin dashboard, inventory, categories, orders, staff, and settings"
```

---

### Task 9: Localize Authentication & User Settings Pages

**Files:**

- Modify: `resources/js/pages/auth/login.tsx`
- Modify: `resources/js/pages/auth/register.tsx`
- Modify: `resources/js/pages/auth/forgot-password.tsx`
- Modify: `resources/js/pages/auth/reset-password.tsx`
- Modify: `resources/js/pages/auth/confirm-password.tsx`
- Modify: `resources/js/pages/settings/profile.tsx`
- Modify: `resources/js/pages/settings/appearance.tsx`
- Modify: `resources/js/pages/settings/security.tsx`
- Modify: `resources/js/components/user-menu-content.tsx`

**Interfaces:**

- Consumes: `useTranslation` (`t`)
- Produces: Localized authentication portals (Customer, Cashier, Admin login) and account settings screens.

- [ ] **Step 1: Localize Auth pages (Login, Register, Password Recovery)**

Translate:

- Role titles ("Customer Sign In", "Cashier Terminal Login", "Admin Portal Login").
- Form inputs ("Email address", "Password", "Confirm Password", "Remember me", "Forgot your password?").
- Actions ("Sign in", "Create Account", "Already have an account? Sign in", "Send Password Reset Link", "Reset Password").

- [ ] **Step 2: Localize Settings & Profile pages**

Translate "Profile Information", "Update Password", "Appearance Settings" (Light, Dark, System), "Security", "Delete Account", and confirmation prompts.

- [ ] **Step 3: Run TypeScript check and Pest tests**

Run: `npm run types:check && vendor/bin/pest`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add resources/js/pages/auth/ resources/js/pages/settings/ resources/js/components/user-menu-content.tsx
git commit -m "feat(auth): localize login, register, password recovery, and user profile settings"
```

---

### Task 10: System Verification, Formatting & Final Build

**Files:**

- Modify: (Any files touched that require formatting or linting)

**Interfaces:**

- Consumes: All updated codebase files
- Produces: Verified, green test suite, formatted PHP code, and compiled Vite assets.

- [ ] **Step 1: Format PHP files with Pint**

Run: `vendor/bin/pint --format agent`
Expected: PASS (all files formatted to project standard).

- [ ] **Step 2: Run Pest test suite**

Run: `vendor/bin/pest`
Expected: PASS (all 128+ tests passing).

- [ ] **Step 3: Run TypeScript type check**

Run: `npm run types:check`
Expected: PASS (0 errors).

- [ ] **Step 4: Run Vite production build**

Run: `npm run build`
Expected: PASS (bundle built successfully).

- [ ] **Step 5: Final commit if any formatting changes occurred**

```bash
git add -A
git commit -m "chore: format codebase and verify build suite"
```
