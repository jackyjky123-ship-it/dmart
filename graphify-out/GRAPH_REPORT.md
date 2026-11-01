# Graph Report - DMart  (2026-11-01)

## Corpus Check
- 227 files · ~55,237 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 25 file(s) not represented in the graph (top: (none) 19, .example 1, .log 1)

## Summary
- 1258 nodes · 2887 edges · 91 communities (43 shown, 48 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 1,500 input · 800 output

## Community Hubs (Navigation)
- React & UI Component Primitives
- Profile & Security Settings Pages
- Inertia Application Root & Layouts
- Users Database Migration & Tables
- OTP Input UI Component
- User Navigation & Dropdown Menu
- Cart & Cart Item Models
- Storefront Header & Navigation
- Frontend NPM Dependencies
- Fortify User Creation & Actions
- Role & Active Auth Middleware
- Order & Order Channel Enums
- App Sidebar & Navigation Layout
- Radix UI Dialog & Avatar Packages
- GitHub CI Test Workflow
- Application Service Provider & Boot
- Vite & Tailwind Build Tooling
- Shadcn UI Component Configuration
- Base Controller & Profile Handlers
- Stock Movement Types & Ledger
- TypeScript Compiler Configuration
- Category Model & Product Relations
- Native Binary & Compiler Dependencies
- DMart Portals & Roadmap Specs
- Payment Status & Method Enums
- Inertia Shared Props & Requests
- Product & Catalog Eloquent Model
- Currency & Money Value Formatting
- NPM Scripts & Dev Tooling
- Cart Model Testing Factories
- Radix UI Toggle Components
- Composer PSR-4 Autoloading
- Composer Dev Dependencies & Larastan
- Dependabot Version Update Policy
- User Eloquent Model & Relations
- Frontend Authentication Type Definitions
- User Role Authorization Enum
- Product Image Attachment Model
- Order Testing Factories & States
- Password Confirmation Feature Tests
- Avatar UI Display Components
- Card Container UI Components
- Core Composer Dependencies
- Pest Testing Suite & Base TestCases
- Pest Plugin & HTTP Discovery
- User Factory Admin States
- Build & Production Scripts
- Alert & Error UI Feedback
- Order Model & Cashier Relationships
- Product Factory Testing Definitions
- Radix UI Collapsible Component
- Application PSR-4 Namespace Mapping
- Laravel Post-Create Project Hook
- Database Seeder Execution
- Clipboard Copy Utility Hook
- Radix UI Separator Component
- PNPM Workspace Package Configuration
- Lucide Icon Wrapper Component
- Radix UI Slot Primitive
- Phase 2 Auth & Middleware Specs
- Phase 9 Testing & Quality Gates
- UI-First Strategy & Portals Preview
- Phase 8 Seed Data Roadmap
- Database Schema Design Spec
- Apple Touch Icon Asset
- Favicon Vector Asset
- Search Engine Crawler Policy

## God Nodes (most connected - your core abstractions)
1. `cn()` - 139 edges
2. `Button()` - 75 edges
3. `react` - 73 edges
4. `@inertiajs/react` - 54 edges
5. `lucide-react` - 47 edges
6. `Input()` - 40 edges
7. `Label()` - 32 edges
8. `User` - 31 edges
9. `AppHeader()` - 30 edges
10. `Badge()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `Storefront Portal Wireframe` --conceptually_related_to--> `Phase 4: Storefront & Cart`  [INFERRED]
  .superpowers/brainstorm/6929-1793533039/content/ui-first-strategy.html → Phase.md
- `POS Terminal Wireframe` --conceptually_related_to--> `Phase 6: POS Terminal`  [INFERRED]
  .superpowers/brainstorm/6929-1793533039/content/ui-first-strategy.html → Phase.md
- `Admin Back Office Wireframe` --conceptually_related_to--> `Phase 7: Admin Orders & Dashboard`  [INFERRED]
  .superpowers/brainstorm/6929-1793533039/content/ui-first-strategy.html → Phase.md
- `AuthSplitLayout()` --calls--> `AppLogoIcon()`  [EXTRACTED]
  resources/js/layouts/auth/auth-split-layout.tsx → resources/js/components/app-logo-icon.tsx
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  resources/js/components/ui/breadcrumb.tsx → resources/js/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **DMart Core Architecture Services** — plan_stock_service, plan_cart_service, plan_payment_gateway [EXTRACTED 1.00]
- **DMart Three Portals** — _superpowers_brainstorm_6929_1793533039_content_ui_first_strategy_storefront_wireframe, _superpowers_brainstorm_6929_1793533039_content_ui_first_strategy_pos_wireframe, _superpowers_brainstorm_6929_1793533039_content_ui_first_strategy_admin_wireframe [EXTRACTED 1.00]

## Communities (91 total, 48 thin omitted)

### Community 0 - "React & UI Component Primitives"
Cohesion: 0.05
Nodes (109): @inertiajs/react, lucide-react, react, sonner, EmptyState(), EmptyStateProps, Price(), PriceProps (+101 more)

### Community 1 - "Profile & Security Settings Pages"
Cohesion: 0.08
Nodes (29): DeleteUser(), Heading(), InputError(), PasswordInput(), Props, TextLink(), Checkbox(), DialogClose() (+21 more)

### Community 2 - "Inertia Application Root & Layouts"
Cohesion: 0.06
Nodes (47): withApp(), AppContent(), Props, AppShell(), Props, AppSidebarHeader(), AppearanceToggleTab(), Breadcrumbs() (+39 more)

### Community 3 - "Users Database Migration & Tables"
Cohesion: 0.05
Nodes (20): {closure#1}(), {closure#2}(), {closure#3}(), {closure#1}(), {closure#2}(), {closure#1}(), {closure#2}(), {closure#3}() (+12 more)

### Community 4 - "OTP Input UI Component"
Cohesion: 0.11
Nodes (30): InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+22 more)

### Community 5 - "User Navigation & Dropdown Menu"
Cohesion: 0.11
Nodes (23): NavUser(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+15 more)

### Community 6 - "Cart & Cart Item Models"
Cohesion: 0.14
Nodes (6): Cart, CartItem, OrderItem, Payment, Setting, StockMovement

### Community 7 - "Storefront Header & Navigation"
Cohesion: 0.14
Nodes (25): AppHeader(), mainNavItems, Props, rightNavItems, AppLogo(), AppLogoIcon(), NavigationMenu(), NavigationMenuContent() (+17 more)

### Community 9 - "Frontend NPM Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, clsx@^2.1.1, concurrently@^10.0.3, @inertiajs/react@^3.0.0, input-otp@^1.4.2, @laravel/passkeys@^0.2.0, lucide-react@^0.475.0, @radix-ui/react-label@^2.1.2 (+21 more)

### Community 10 - "Fortify User Creation & Actions"
Cohesion: 0.12
Nodes (6): CreateNewUser, ResetUserPassword, PasswordValidationRules, ProfileValidationRules, ProfileDeleteRequest, ProfileUpdateRequest

### Community 11 - "Role & Active Auth Middleware"
Cohesion: 0.13
Nodes (9): EnsureUserHasRole, EnsureUserIsActive, HandleAppearance, LoginResponse, {closure#1}(), {closure#2}(), {closure#3}(), {closure#4}() (+1 more)

### Community 12 - "Order & Order Channel Enums"
Cohesion: 0.08
Nodes (14): OrderChannel, Online, Pos, OrderStatus, Cancelled, Completed, Delivered, Paid (+6 more)

### Community 13 - "App Sidebar & Navigation Layout"
Cohesion: 0.18
Nodes (21): AppSidebar(), footerNavItems, mainNavItems, NavFooter(), NavMain(), SidebarContent(), SidebarFooter(), SidebarGroup() (+13 more)

### Community 14 - "Radix UI Dialog & Avatar Packages"
Cohesion: 0.09
Nodes (21): @radix-ui/react-avatar@^1.1.3, @radix-ui/react-checkbox@^1.1.4, @radix-ui/react-dialog@^1.1.6, @radix-ui/react-dropdown-menu@^2.1.6, @radix-ui/react-tooltip@^1.1.8, tailwind-merge@^3.0.1, @types/react@^19.2.0, vite@npm:@voidzero-dev/vite-plus-core@1.4.0 (+13 more)

### Community 15 - "GitHub CI Test Workflow"
Cohesion: 0.10
Nodes (20): runs-on, steps, jobs, ci, name, on, pull_request, push (+12 more)

### Community 16 - "Application Service Provider & Boot"
Cohesion: 0.14
Nodes (3): AppServiceProvider, {closure#1}(), FortifyServiceProvider

### Community 17 - "Vite & Tailwind Build Tooling"
Cohesion: 0.11
Nodes (19): @inertiajs/vite@^3.0.0, laravel-vite-plugin@^3.0.0, @tailwindcss/vite@^4.1.11, @vitejs/plugin-react@^6.1.1, devDependencies, babel-plugin-react-compiler@^1.0.0, @laravel/vite-plugin-wayfinder@^0.1.3, @rolldown/plugin-babel@^0.2.3 (+11 more)

### Community 18 - "Shadcn UI Component Configuration"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 19 - "Base Controller & Profile Handlers"
Cohesion: 0.19
Nodes (4): Controller, ProfileController, SecurityController, PasswordUpdateRequest

### Community 20 - "Stock Movement Types & Ledger"
Cohesion: 0.14
Nodes (6): StockMovementType, Adjustment, Restock, Return, Sale, StockMovementFactory

### Community 21 - "TypeScript Compiler Configuration"
Cohesion: 0.12
Nodes (15): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 23 - "Native Binary & Compiler Dependencies"
Cohesion: 0.13
Nodes (15): optionalDependencies, @laravel/multiplex@^0.4.1, lightningcss-linux-x64-gnu@^1.29.1, lightningcss-win32-x64-msvc@^1.29.1, @rollup/rollup-linux-x64-gnu@4.9.5, @rollup/rollup-win32-x64-msvc@4.9.5, @tailwindcss/oxide-linux-x64-gnu@^4.0.1, @tailwindcss/oxide-win32-x64-msvc@^4.0.1 (+7 more)

### Community 24 - "DMart Portals & Roadmap Specs"
Cohesion: 0.16
Nodes (14): Admin Back Office Wireframe, POS Terminal Wireframe, Storefront Portal Wireframe, Implementation Phases Roadmap, Phase 3: Admin Catalog Management, Phase 4: Storefront & Cart, Phase 5: Checkout & Mock Payment, Phase 6: POS Terminal (+6 more)

### Community 25 - "Payment Status & Method Enums"
Cohesion: 0.15
Nodes (6): PaymentStatus, Cancelled, Failed, Paid, Pending, PaymentFactory

### Community 26 - "Inertia Shared Props & Requests"
Cohesion: 0.18
Nodes (4): HandleInertiaRequests, {closure#1}(), {closure#2}(), {closure#3}()

### Community 28 - "Currency & Money Value Formatting"
Cohesion: 0.23
Nodes (7): Money, {closure#1}(), {closure#2}(), {closure#4}(), {closure#5}(), {closure#6}(), {closure#7}()

### Community 29 - "NPM Scripts & Dev Tooling"
Cohesion: 0.15
Nodes (13): scripts, ci:check, dev, lint, lint:check, post-autoload-dump, post-create-project-cmd, post-root-package-install (+5 more)

### Community 30 - "Cart Model Testing Factories"
Cohesion: 0.21
Nodes (4): CartFactory, CartItemFactory, OrderItemFactory, SettingFactory

### Community 31 - "Radix UI Toggle Components"
Cohesion: 0.21
Nodes (11): class-variance-authority@^0.7.1, @radix-ui/react-toggle@^1.1.2, @radix-ui/react-toggle-group@^1.1.2, class-variance-authority, @radix-ui/react-toggle, @radix-ui/react-toggle-group, ToggleGroup(), ToggleGroupContext (+3 more)

### Community 32 - "Composer PSR-4 Autoloading"
Cohesion: 0.17
Nodes (11): autoload-dev, psr-4, description, keywords, license, minimum-stability, name, prefer-stable (+3 more)

### Community 33 - "Composer Dev Dependencies & Larastan"
Cohesion: 0.17
Nodes (12): require-dev, fakerphp/faker, larastan/larastan, laravel/boost, laravel/pail, laravel/pao, laravel/pint, laravel/sail (+4 more)

### Community 35 - "Dependabot Version Update Policy"
Cohesion: 0.17
Nodes (11): default-days, patterns, github-actions, interval, updates, cooldown, directory, groups (+3 more)

### Community 38 - "Frontend Authentication Type Definitions"
Cohesion: 0.22
Nodes (9): Auth, Passkey, TwoFactorSecretKey, TwoFactorSetupData, User, InertiaConfig, @inertiajs/core, InputHTMLAttributes (+1 more)

### Community 39 - "User Role Authorization Enum"
Cohesion: 0.20
Nodes (4): UserRole, Admin, Cashier, Customer

### Community 45 - "Avatar UI Display Components"
Cohesion: 0.40
Nodes (7): Avatar(), AvatarFallback(), AvatarImage(), UserInfo(), getInitial(), GetInitialsFn, useInitials()

### Community 46 - "Card Container UI Components"
Cohesion: 0.50
Nodes (7): Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), AuthCardLayout()

### Community 47 - "Core Composer Dependencies"
Cohesion: 0.25
Nodes (8): require, inertiajs/inertia-laravel, laravel/chisel, laravel/fortify, laravel/framework, laravel/tinker, laravel/wayfinder, php

### Community 50 - "Pest Plugin & HTTP Discovery"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 52 - "Build & Production Scripts"
Cohesion: 0.29
Nodes (7): scripts, build, build:ssr, check, check:fix, dev, types:check

### Community 53 - "Alert & Error UI Feedback"
Cohesion: 0.62
Nodes (5): AlertError(), Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 60 - "Application PSR-4 Namespace Mapping"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 61 - "Laravel Post-Create Project Hook"
Cohesion: 0.40
Nodes (5): extra, laravel, post-create-project, dont-discover, installer

### Community 64 - "Clipboard Copy Utility Hook"
Cohesion: 0.40
Nodes (3): CopiedValue, CopyFn, UseClipboardReturn

## Knowledge Gaps
- **38 isolated node(s):** `Online`, `Pos`, `PendingPayment`, `Paid`, `Processing` (+33 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 484 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User Eloquent Model & Relations` to `Admin Dashboard Feature Tests`, `Fortify Configuration & Email Verification`, `Email Verification Event Handling`, `Cart & Cart Item Models`, `User Profile Update Feature Tests`, `Fortify User Creation & Actions`, `Role & Active Auth Middleware`, `Order & Order Channel Enums`, `User Factory & Testing Utilities`, `Password Confirmation Feature Tests`, `Password Reset Feature Tests`, `Authentication Feature Test Suite`, `Portal Login Feature Tests`, `Role Access Control Feature Tests`, `Product & Catalog Eloquent Model`, `Cart Model Testing Factories`, `Database Seeder Execution`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `Online`, `Pos`, `PendingPayment` to the rest of the system?**
  _38 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React & UI Component Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.05285898143041 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `OTP Input UI Component` to `React & UI Component Primitives`, `Profile & Security Settings Pages`, `Inertia Application Root & Layouts`, `Radix UI Separator Component`, `User Navigation & Dropdown Menu`, `Storefront Header & Navigation`, `Avatar UI Display Components`, `Card Container UI Components`, `App Sidebar & Navigation Layout`, `Alert & Error UI Feedback`, `Radix UI Toggle Components`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `Profile & Security Settings Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.07502131287297528 - nodes in this community are weakly interconnected._
- **Why does `react` connect `React & UI Component Primitives` to `Clipboard Copy Utility Hook`, `Profile & Security Settings Pages`, `Inertia Application Root & Layouts`, `OTP Input UI Component`, `User Navigation & Dropdown Menu`, `Radix UI Separator Component`, `Storefront Header & Navigation`, `Frontend NPM Dependencies`, `App Sidebar & Navigation Layout`, `Radix UI Dialog & Avatar Packages`, `Avatar UI Display Components`, `Card Container UI Components`, `Alert & Error UI Feedback`, `Radix UI Toggle Components`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `Inertia Application Root & Layouts` be split into smaller, more focused modules?**
  _Cohesion score 0.06467661691542288 - nodes in this community are weakly interconnected._