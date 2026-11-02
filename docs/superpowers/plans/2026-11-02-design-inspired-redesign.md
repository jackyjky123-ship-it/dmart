# DMart Streetwear Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

This plan redesigns the DMart platform based on the visual design references in `Design/`:
1. `brand_color.png`: Black `#171717` and Accent Orange `#F25623` color system.
2. `design_ref.png`: Storefront Home / Drops / Brand Store dark editorial aesthetic, ticker marquee, statement manifesto, product drop cards, and narrative story sections.
3. `product_detail_layout.png`: High-fashion PDP with vertical thumbnail gallery, color swatches, size selector, tabs, and recommendation carousel.
4. `admin_dashboard_ref.png`: Dark matte charcoal dashboard with KPI cards, heatmap grid (orders by time), dual sales curve chart, and country/product breakdown.
5. `pos_system_ref.png`: Point of Sale interface with category chips, product cards with steppers, active held tickets, and full right-rail payment checkout drawer.

---

### File Decomposition & Responsibility Map

| File | Responsibility |
| --- | --- |
| `resources/css/app.css` | Core design tokens: sets primary `#F25623`, background `#171717`, surface `#1f1f1f`, custom ticker animation, and orange glow utilities |
| `resources/js/layouts/storefront-layout.tsx` | Global storefront header with drop announcement banner, bold DMART logo, navigation, search dialog, cart drawer, and sleek footer |
| `resources/js/pages/storefront/home.tsx` | Storefront home inspired by `design_ref.png`: hero showcase ("STYLE VIBE REFLECT"), "DESIGNED TO DISRUPT" manifesto, drops grid, infinite marquee ticker, "Our Mission" / "Our Vision" story sections |
| `resources/js/pages/storefront/products/show.tsx` | Product detail page inspired by `product_detail_layout.png`: thumbnail gallery, zoom, color swatches, size selector, trust badges, specs tabs, and recommended items |
| `resources/js/layouts/admin-layout.tsx` | Admin navigation and shell with dark slate styling and orange accents |
| `resources/js/pages/admin/dashboard.tsx` | Admin analytics dashboard inspired by `admin_dashboard_ref.png`: KPI metric cards, orders-by-time heatmap matrix, dual-line sales performance chart, sales by country, and top products table |
| `resources/js/layouts/pos-layout.tsx` | POS layout with compact dark sidebar, fast cashier switching, and full-screen register workspace |
| `resources/js/pages/pos/index.tsx` | POS register inspired by `pos_system_ref.png`: category pills with live counts, product grid with quantity steppers, held order tabs (T1, T2, T3), and slide-in payment checkout drawer |

---

### Task 1: Design Tokens & Styling Foundation (`#171717` & `#F25623`)

- [ ] **Step 1.1**: Update `resources/css/app.css` with the new color palette:
  - Background: `#171717`
  - Accent / Primary: `#F25623`
  - Primary Foreground: `#ffffff`
  - Cards & Popovers: `#1e1e1e` / `#252525`
  - Borders & Dividers: `#2d2d2d`
  - Add `@keyframes marquee` and `.animate-marquee` utility for horizontal ticker tapes.
- [ ] **Step 1.2**: Verify CSS build compiles cleanly with `npm run build`.

### Task 2: Storefront Layout & Header / Footer Redesign

- [ ] **Step 2.1**: Update `resources/js/layouts/storefront-layout.tsx`:
  - Add top announcement bar: `"LIMITED RELEASES. EXCLUSIVE DROPS. ELEGANCE IS NOW LIVE."` + `"Free Shipping on orders over $99"`.
  - Header: Left navigation (`Home`, `Catalog`, `Drops`, `About`, `Contact`), Center bold `DMART` wordmark with subtle orange accent, Right actions (Search, User Account, Cart button with dynamic item count badge).
  - Modern dark luxury footer with newsletter subscription, brand ethos, customer service links, and payment icons.
- [ ] **Step 2.2**: Verify navigation links and cart counter reactivity in `storefront-layout.tsx`.

### Task 3: Storefront Homepage Redesign (`design_ref.png`)

- [ ] **Step 3.1**: Rewrite `resources/js/pages/storefront/home.tsx` implementing the visual elements from `design_ref.png`:
  - **Hero Section**: High-contrast fashion editorial with models, bold headline `"STYLE VIBE REFLECT"`, subtitle `"Add a little bit of body text"` / narrative, and `"SHOP NOW"` button with orange highlight.
  - **Disruption Manifesto**: `"DESIGNED TO DISRUPT"` section with statement copy.
  - **Featured Drops Grid**: Streetwear products (hoodies, sweatshirts, jackets) with sale badges (`Sale`), struck-through original pricing (`$67.00`), current drop prices (`$45.00`), and quick add to cart.
  - **Animated Marquee Ticker**: Continuous horizontal ticker bar (`LIMITED EDITION ✦ NEW ARRIVAL ✦ EXCLUSIVE DROP ✦ STREET LUXURY`).
  - **Editorial Split Sections**: Alternating narrative cards for `"Our Mission"` and `"Our Vision"` with photographic imagery and `"Learn More"` buttons.
- [ ] **Step 3.2**: Test responsive views (mobile, tablet, desktop) and cart interactions.

### Task 4: Storefront Product Detail Page Redesign (`product_detail_layout.png`)

- [ ] **Step 4.1**: Overhaul `resources/js/pages/storefront/products/show.tsx` to match `product_detail_layout.png`:
  - Interactive multi-thumbnail vertical strip and large main product preview with zoom icon.
  - Category tag (`"New Arrival"`), bold title (`"Essential Oversized Hoodie"`), star rating (`★★★★★ 4.8 (128 reviews)`), price block (`$59.99` with `$89.99` struck through and `33% OFF` badge).
  - Color swatches with active selection (Charcoal Gray, Heather Gray, Beige, Jet Black).
  - Size selector buttons (`S`, `M`, `L`, `XL`, `XXL`) with size guide dialog.
  - Quantity controls, prominent `"Add to Cart"` button, and wishlist heart icon.
  - Value prop badges: Free Shipping over $99, Easy Returns 30-day policy, Secure Payment 100% guarantee.
  - Tabbed information section: Details, Materials, Size & Fit, Shipping & Returns.
  - `"You May Also Like"` product recommendation carousel/grid.
- [ ] **Step 4.2**: Verify add-to-cart, size/color selection, and tab switching work properly.

### Task 5: Admin Dashboard Redesign (`admin_dashboard_ref.png`)

- [ ] **Step 5.1**: Redesign `resources/js/pages/admin/dashboard.tsx` and `resources/js/layouts/admin-layout.tsx` to match `admin_dashboard_ref.png`:
  - Charcoal black (`#171717`) container background and dark card panels (`#1e1e1e`).
  - Top bar with search input, active date pill, calendar trigger, notifications, and user avatar.
  - Top 4 Metric KPI Cards: Total Revenue (`$24,500`, `+12.5%`), Total Orders (`1,240`, `+8.2%`), New Customers (`320`, `-4.3%`), Conversion Rate (`3.2%`, `+2.1%`).
  - Orders by Time Heatmap Grid: matrix of hours (9 am to 3 pm) vs days (Mon–Sun) with orange color-coded intensity cells and legend (`200>`, `500>`, `1,000>`, `2,000>`).
  - Monthly Sales Performance Chart: smooth dual curve (Sales vs Target) with interactive tooltip.
  - Sales by Country: cards with country flags (UK, Indonesia, Malaysia, China, Thailand, Philippines) and product counts.
  - Top Product Sales: data table showing Product, Revenue, Sales, Growth %, Reviews, and Views.
- [ ] **Step 5.2**: Test interactive elements on the admin dashboard.

### Task 6: POS System Redesign (`pos_system_ref.png`)

- [ ] **Step 6.1**: Redesign `resources/js/pages/pos/index.tsx` and `resources/js/layouts/pos-layout.tsx` matching `pos_system_ref.png`:
  - Unified `#171717` dark aesthetic with `#F25623` active states.
  - Left slim sidebar navigation (Menu, Orders, Hold, Delivery, Reports, Settings, cashier avatar, Logout).
  - Top category filter chips with icons and count indicators (All, Hoodies, Tees, Outerwear, Bottoms, Accessories).
  - Product grid cards with discount badges (`20% Off`), pricing, stock status, and quantity stepper (`- 1 +`).
  - Bottom active held order tabs (`T1 Jacob Jones`, `T2 Bessie Co.`, `T3 Ralph Edwards`) for switching between pending customer tickets.
  - Right checkout summary panel:
    - Order type selector (`In-Store`, `Take Away`, `Delivery`).
    - Itemized order list with thumbnails, names, unit prices, quantities, line totals, and remove action.
    - Financial breakdown: Sub Total, Tax, Total Amount.
    - Payment method switcher: Cash, Credit/Debit Card, QR Code.
    - Primary `"Place Order"` action button.
- [ ] **Step 6.2**: Test item adding, quantity adjustments, ticket switching, and checkout modals.

### Task 7: Build Verification & Regression Testing

- [ ] **Step 7.1**: Run `npm run build` to confirm zero frontend TypeScript or bundling errors.
- [ ] **Step 7.2**: Run `php artisan test --compact` to confirm all 86 backend tests pass.
- [ ] **Step 7.3**: Run `vendor/bin/pint --dirty --format agent` on modified PHP files if any.
