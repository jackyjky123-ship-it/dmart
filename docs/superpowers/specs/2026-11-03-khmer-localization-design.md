# Design Document: Khmer Localization & Language Switcher (DMart)

- **Date:** 2026-11-03
- **Author:** Antigravity & User
- **Status:** Approved / Ready for Planning

---

## 1. Intent & The Why

DMart is an e-commerce, POS, and store administration platform currently running in English. The goal is to provide a complete, high-quality Khmer translation across all roles (Storefront customers, POS cashiers, Store administrators, and Guests/Auth), styled with the **Kantumruy** (`Kantumruy Pro`) font for authentic, readable Khmer typography.

A language switcher allows users in any role to seamlessly switch between English and Khmer (ភាសាខ្មែរ).

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals

- Full localization from English to Khmer across all UI text in the application:
    - **Storefront:** Home, catalog, product details, cart, checkout, payment, order history & tracking.
    - **POS (Point of Sale):** Cashier register, product grid, cart, checkout/tender dialog, receipt modal, sales history.
    - **Admin:** Dashboard & KPI cards, categories, products, inventory/stock management, orders fulfillment, staff management, store settings.
    - **Auth & Settings:** Login (Admin, POS, Customer), registration, password recovery, profile, security, appearance.
    - **Common UI:** Status badges, alerts, toasts, empty states, confirmation dialogs, navigation links.
    - **Category Display Names:** Default and seeded category names (e.g. Beverages, Bakery, Snacks) are translated via dictionary lookup `t(category.name)` in Storefront and POS navigation and filters without requiring database schema changes.
- Typography integration:
    - Import Google Font `Kantumruy Pro` (weights 400, 500, 600, 700).
    - Configure Tailwind CSS so that when the language is Khmer (`html[lang="km"]`), the default font family (`--font-sans`) automatically adopts `Kantumruy Pro`.
- Dynamic language switcher:
    - Visible, accessible language toggle/dropdown in Storefront header/mobile menu, POS header, Admin sidebar/header, and Auth screens.
    - Persists preference across user sessions and page reloads via session and cookie (`locale`).
- Shared translations via Laravel + Inertia:
    - Standard JSON dictionaries (`lang/km.json` and `lang/en.json`).
    - Zero-overhead translation helper `useTranslation()` (`t(key)`) in React.
    - Backend flash messages, notifications, and validation responses aligned with the active locale.

### Non-Goals

- Translating dynamic user-created products (e.g., custom product names entered by store admins like "Coca Cola 330ml"). User-created product records remain as stored in the database, while all system labels, statuses, categories, headers, instructions, and messages are localized.
- Database schema changes (no extra multilingual columns like `name_km` needed).
- Multi-currency conversion (currency remains as configured, e.g., USD/KHR formatting where applicable).

### Anti-Goals

- Hardcoding Khmer strings into templates without translation keys, which would destroy English support.
- Loading bulky third-party i18n libraries that bloat the client bundle when a standard Laravel/Inertia setup achieves the same with near-zero bundle footprint.
- Font flickering or layout breakage caused by font mismatch.

---

## 3. Constraints

- **Framework:** Laravel 13, Inertia v3, React 19, Tailwind CSS v4.
- **Wayfinder:** Preserves Wayfinder route generation conventions.
- **Pint & Pest:** All PHP code must pass Pint formatting (`vendor/bin/pint --format agent`) and all existing test suites must pass without regression.

---

## 4. Approaches Considered

### Approach 1: Full-Stack Laravel + Inertia Localization (Selected)

- Translations stored in `lang/km.json` and `lang/en.json`.
- `SetLocale` middleware reads session/cookie, calls `app()->setLocale($locale)`, and updates `<html lang="...">` in `app.blade.php`.
- `HandleInertiaRequests` shares `locale` and `translations`.
- In React, a lightweight `useTranslation()` hook provides `t('String')`. When in English, `translations` is `{}` and `t()` falls back directly to the string, minimizing prop payload.
- CSS applies `Kantumruy Pro` when `html[lang="km"]` is active.
- **Trade-off:** Single source of truth for both backend and frontend, clean architecture, optimal payload.

### Approach 2: Client-Only React Localization

- Dictionaries kept exclusively in frontend `resources/js/locales/`.
- Fast client-only switching, but disconnected from Laravel backend errors, validation, and Blade `<html lang="...">`.
- **Trade-off:** Fragmented translation state between frontend and backend. (Rejected)

---

## 5. Architectural & Implementation Details

### 5.1 Backend Localization Setup

1. **Locale Management Route & Controller:**
    - Route: `POST /locale` handled by `LocaleController@update`.
    - Validates `locale` in `['en', 'km']`.
    - Stores `locale` in session `session(['locale' => $locale])` and returns cookie `cookie()->forever('locale', $locale)`.
    - Redirects back.
2. **Middleware:**
    - `App\Http\Middleware\SetLocale` registered in `bootstrap/app.php` web middleware group.
    - Reads `session('locale', request()->cookie('locale', config('app.locale', 'en')))`.
    - Sets `app()->setLocale($locale)`.
3. **Inertia Shared Data:**
    - In `HandleInertiaRequests.php`:
        - Shares `locale => app()->getLocale()`.
        - Shares `locales => ['en' => 'English', 'km' => 'ភាសាខ្មែរ']`.
        - Shares `translations => app()->getLocale() === 'km' ? trans()->getLoader()->load('km', '*', '*') ?? json_decode(file_get_contents(base_path('lang/km.json')), true) : (object)[]`.

### 5.2 Typography & Font Styling

1. In `resources/css/app.css`:
    - Import Google Font:
      `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&family=Montserrat:wght@800;900&display=swap');`
    - Define `--font-khmer: 'Kantumruy Pro', ui-sans-serif, system-ui, sans-serif;`
    - Target Khmer documents:
        ```css
        html[lang='km'],
        html[lang^='km-'] {
            --font-sans:
                'Kantumruy Pro', ui-sans-serif, system-ui, sans-serif,
                'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
                'Noto Color Emoji';
        }
        ```
    - All components using standard `font-sans` automatically inherit `Kantumruy Pro` when Khmer is active.

### 5.3 Frontend Translation System

1. **Hook:** `resources/js/hooks/use-translation.ts`
    ```ts
    import { usePage } from '@inertiajs/react';

    export function useTranslation() {
        const { props } = usePage<{
            locale?: string;
            translations?: Record<string, string>;
        }>();

        const t = (
            key: string,
            replacements?: Record<string, string | number>,
        ): string => {
            let text = props.translations?.[key] ?? key;
            if (replacements) {
                Object.entries(replacements).forEach(([k, v]) => {
                    text = text.replace(
                        new RegExp(`:${k}|{${k}}`, 'g'),
                        String(v),
                    );
                });
            }
            return text;
        };

        return { t, locale: props.locale ?? 'en' };
    }
    ```
2. **Language Switcher Component:** `resources/js/components/language-switcher.tsx`
    - Dropdown or segmented button showing the current language flag/code (`EN` | `ខ្មែរ`).
    - Dispatches `router.post('/locale', { locale }, { preserveScroll: true, preserveState: false })`.
    - Placed in:
        - `StorefrontHeader` in `storefront-layout.tsx` (top bar and mobile nav).
        - `POSHeader` in `pos-layout.tsx`.
        - `AppSidebar` and `AppHeader` in `admin-layout.tsx`.
        - `AuthCardLayout` and `AuthSimpleLayout` in `layouts/auth/`.

### 5.4 Scope of Translation Dictionaries (`lang/km.json`)

The translation dictionary covers comprehensive Khmer translations for:

1. **Storefront:**
    - Navigation: Home, Products, Cart, Orders, Sign In, Register, Logout, Admin Portal, POS Register.
    - Announcements: Free shipping, Limited Releases, etc.
    - Home Page: Hero banners, Featured Categories, Best Sellers, Special Discounts, "Shop Now", "Add to Cart", "View Details".
    - Product Catalog: Search placeholders, Category filters, Price ranges, Sort options, Stock status ("In Stock", "Out of Stock").
    - Cart & Checkout: "Your Cart", "Subtotal", "Delivery Fee", "Total", "Proceed to Checkout", Shipping address form fields, Payment methods (Bakong KHQR, Cash on Delivery), "Place Order".
    - Orders: Order status badges (Pending, Processing, Completed, Cancelled), tracking dates, item lists, totals.
2. **POS (Cashier):**
    - Header: Cashier name, Register status, "Sales History", "New Sale", "Logout".
    - Register: Search products, Barcode scan, Categories, Cart items, Quantity +/- , Item discount, Order discount, Tax, Subtotal, Total.
    - Tender/Payment Modal: "Received Amount", "Change Due", "Payment Type", "Complete Sale", "Print Receipt".
    - Receipt Modal: Store name, Date, Cashier, Item summary, Thank you message.
3. **Admin:**
    - Sidebar: Dashboard, Products, Categories, Stock Inventory, Orders, Staff, Settings.
    - Dashboard: KPI cards (Today Sales, Total Orders, Low Stock Alerts, Customers), Sales analytics chart labels, Recent Orders.
    - Products & Categories: "Add Product", "Edit Product", "Delete", "SKU", "Barcode", "Price", "Cost", "Stock Quantity", category selector, image upload, form actions.
    - Stock: "Adjust Stock", "In Stock", "Low Stock", "Out of Stock", "Stock History".
    - Staff: "Add Staff Member", roles ("Admin", "Cashier"), status ("Active", "Inactive").
    - Store Settings: General, Receipt header/footer, Tax percentage, Save changes.
4. **Auth & User Settings:**
    - Login, Register, Forgot Password, Reset Password, Confirm Password.
    - Profile settings, Security/Password update, Appearance settings.
5. **Common UI & Feedback:**
    - Alerts, validation notices, confirmation dialogs ("Are you sure?", "Cancel", "Confirm", "Delete"), toast messages ("Item added to cart", "Order created successfully").

---

### 5.5 Category Display Localization

- Category model remains unchanged in the database.
- Storefront categories navigation, header menus, and POS category filter tabs wrap category names in `t(category.name)`.
- Default/seeded categories (e.g., Beverages -> ភេសជ្ជៈ, Bakery -> នំបុ័ង, Snacks -> អាហារសម្រន់, Dairy -> ផលិតផលទឹកដោះគោ, Fresh Produce -> បន្លែផ្លែឈើស្រស់, etc.) are included in `lang/km.json`.
- Custom categories entered by admins will render their entered name as fallback if not in the dictionary.

### 5.6 Validation & System Messages

- Application flash toasts and common input validation messages (required, email, min, password confirmation) are mapped in `lang/km.json`.
- Controllers and FormRequests use `__()` for custom validation exceptions and flash toasts.

---

## 6. What's Left to the Builder

- Translation dictionary accuracy in `lang/km.json` adhering to natural, standard Cambodian Khmer terminology (e.g., ទំព័រដើម for Home, កន្ត្រក for Cart, ការទូទាត់ for Checkout/Payment, ផ្ទាំងគ្រប់គ្រង for Dashboard, បញ្ជីទំនិញ for Products).
- Component-by-component integration of `useTranslation()` across page templates.
- Testing language persistence and font rendering.
