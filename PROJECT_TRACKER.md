# GramBazar Project Tracker

## Project Status

Phase: 05 — Authentication & Customer Account
Status: Completed

## Phase 01 — Foundation

- [x] Project structure inspected
- [x] Framework/version verified
- [x] Dependencies verified
- [x] Environment configuration verified
- [x] .gitignore created/verified
- [x] .env.example verified
- [ ] Git status checked (directory is not a Git repository yet)
- [x] Basic project health check completed

## Phase 02 — Database & Backend

- [x] Categories
- [x] Products
- [x] Farmers
- [x] Users/Roles
- [x] Product images
- [x] Stock
- [ ] Orders
- [ ] Cart
- [ ] Coupons
- [x] Other backend requirements

> **Phase 02 Notes (completed):**
>
> **Schema (additive migrations, applied to dev MySQL):**
>
> - `users.role` string default `customer`, cast to `UserRole` enum (Customer/Farmer/Admin/SuperAdmin).
> - `farmers` — one-to-one with users (`user_id` unique, cascade delete); `approval_status` default `pending` (Pending/Approved/Rejected/Suspended).
> - `categories` — self-referencing `parent_id` (nullOnDelete), unique `slug`, `is_active`, `sort_order`.
> - `products` — `farmer_id` (cascade), `category_id` (restrict delete), unique `slug`, `price`/`sale_price` decimal(10,2), `unit` string default `kg` cast to `ProductUnit`, `stock_quantity`, `min_order_quantity`, featured/popular/seasonal/active flags.
> - `product_images` — `product_id` (cascade), `is_primary` (source of truth for product images).
>
> **Models & relationships:** `Farmer`, `Category`, `Product`, `ProductImage` created; `User` extended (`role`, `farmer()`). Enum casts with `label()` in Bengali.
>
> **Authorization (policies auto-discovered):** Category CRUD admin-only; product create farmer/admin, update/delete owner-or-admin; farmer update owner-or-admin, approve/suspend/delete admin-only. Admin = Admin or SuperAdmin.
>
> **Validation (form requests):** `Store/UpdateCategoryRequest`, `Store/UpdateProductRequest` (prices/stock ≥ 0, enum units, unique slugs, image rules), `Store/UpdateFarmerRequest` (non-admin cannot change `approval_status`).
>
> **Seeders (dev/demo only):** `CategorySeeder` — 7 root categories (চাল, শাক-সবজি, ফল, মাছ, দেশি মুরগি, বীজ, মসলা). `DatabaseSeeder` — demo users (super-admin, admin, approved farmer, pending farmer, customer) + 3 demo products from the approved farmer.
>
> **Checks:** `vendor/bin/pest` 67 tests passed; `vendor/bin/phpstan analyse` passed; `vendor/bin/pint` clean. Note: `pdo_sqlite` is not installed on this machine, so the suite runs against a dedicated MySQL `grambazar_test` database via env overrides until `php8.5-sqlite3` is installed.
>
> **Not built (future phases):** Orders, Cart, Coupons — relationships/design accounted for in schema, implementation deferred.

## Phase 03 — Homepage

- [x] Navbar
- [x] Hero section
- [x] Categories
- [x] Popular products
- [x] Farmer section
- [x] Seasonal products
- [x] Spice section
- [x] Village story/video
- [x] Farmer story
- [x] Footer
- [x] Responsive design

**Phase 03 Notes:**

- Homepage rebuilt on Inertia + React (no Blade). `GET /` now renders `welcome` via invokable `App\Http\Controllers\HomeController` (was `Route::inertia`).
- Sections (exact order): sticky navbar (mobile drawer, search stub, wishlist/cart stubs), hero (SVG scene + floating featured-product card + Bengali-digit stats), category grid (7 db-driven), popular products (4), farmer-direct CTA, seasonal (3), spice (4), village story with video placeholder, farmer story + become-a-farmer CTA, dark-green footer (newsletter stub, contact, socials).
- Database-driven: categories, popular/seasonal/spice product rails all read live from DB via `HomeController`. Seeder extended idempotently to 12 demo products (4 popular, 3 seasonal, 4 moshola, 2 featured).
- Assets: 13 hand-made local SVG illustrations under `public/images/home/` (hero, farmer-direct, village, farmer-story, spice, product-fallback, cat-{slug}); product cards fall back to their category art. No external image hotlinks.
- Bengali-first: all visible copy Bengali; prices/units/stats/phone shown in Bengali digits via `lib/format.ts`. `--font-sans` extended with `Noto Sans Bengali`, `Hind Siliguri`, `Mukta`, `SolaimanLipi`, `SutonnyMJ`.
- Interactions (lightweight, UI-only until later phases): search, category links, add-to-cart, wishlist, "see all", video play, newsletter, socials → sonner toast placeholders. No fragile fake cart/shopping logic.
- Accessibility: skip link, aria labels on icon buttons/navs, focus-visible rings, semantic landmarks, `scroll-mt` for anchor sections, lazy-loading images.
- Checks: `vendor/bin/pest` 70 passed / 239 assertions (incl. new `HomepageTest` + updated `DatabaseSeederTest`), `phpstan analyse` 0 errors, `pint --dirty` clean, `npm run types:check` + `vp check` clean, `npm run build` succeeds.
- Remaining (deferred): real product photos, actual video, live search/shop/cart, category pages, farmer onboarding flow, newsletter backend.

## Phase 04 — Customer Shopping

- [x] Shop
- [x] Product details
- [x] Search
- [x] Filters
- [x] Cart
- [x] Checkout
- [x] Order confirmation

**Phase 04 Notes:**

- Public routes added in `routes/web.php`: `/shop`, `/category/{category:slug}`, `/products/{product:slug}`, `/cart` (+ POST `/cart/add`, `/cart/update`, `/cart/remove`), `/checkout` (+ POST), `/orders/{order:order_number}`. `HomeController` unchanged except `productPayload()` now also sends `description` + `min_order_quantity` so one `ProductCard` works on every page.
- Shop page: active (visible + purchasable) products only; category filter includes descendant categories; search (`q`) uses `LIKE` on name with escaped `%`/`_` (`addcslashes`); sort options (popular default via `COALESCE(orders_count,0)` + `popularity` column, price asc/desc, newest, name); paginated (12/page, `config('shop.products_per_page')`); filter/search changes navigate with `preserveState`/`preserveScroll`/`replace`.
- Cart is session-backed (`shopping_cart` key, product id → int quantity) in `app/Services/Cart/Cart.php`. Prices are always recomputed server-side; products that no longer exist are dropped, while inactive or out-of-stock lines are returned so the UI can flag them as "unavailable" (banner + remove). Minimum order quantity enforced on add/update; stock checked on every read.
- Checkout (guest, `user_id` nullable) via `OrderPlacer` inside `DB::transaction` with `lockForUpdate` on stock lines; decrements stock with a guarded `decrement()` (never below zero); snapshots `product_name`, `unit`, `unit_price`, quantity into `order_items`; order number format `GB-{ymd}-{6 random uppercase}`; delivery charge 60 BDT flat (`config('shop.delivery_charge')`), free ≥ 1000 BDT (`config('shop.free_delivery_above')`); COD only (`PaymentMethod`). Empty cart → redirect to cart; unavailable/insufficient stock → `errors.cart` with Bengali messages and full rollback.
- Orders: `OrderStatus` (Pending → Confirmed → Processing → Shipped → Delivered, + Cancelled), `PaymentStatus` (Unpaid/Paid/Refunded), `PaymentMethod` (COD); confirmation page shows the snapshot line items, totals, delivery details; related products shown on the product page (same category, active, excluding self).
- Inertia shared props extended in `HandleInertiaRequests` with `cartCount`, `categories` (6 active roots), and `flash` (`success`/`error`). Session flash messages surface as sonner toasts via `lib/flash.ts` `useAppFlash` in the store layout.
- Storefront pages use a `Link`-heavy design (`StoreLayout` navbar/footer reused): shop grid + category chips + sort select + pagination, product gallery (thumbnails/prev/next) + quantity stepper + add-to-cart, cart line items with quantity steppers + order summary sidebar, checkout delivery form (`StoreCheckoutRequest` validation, Bengali attribute names), order confirmation.
- Wayfinder: generated route modules are consumed as default exports (`import cartRoutes from '@/routes/cart'`) and query params go through the `{ query: {...} }` option; generate with `php artisan wayfinder:generate --with-form` (needed for `.form()` variants used by auth/settings).
- Laravel 13 note: `Blueprint::unsignedDecimal()` does not exist — order/order_items money columns use plain `decimal(10,2)`.
- Checks: `vendor/bin/pest` 101 passed / 540 assertions (new `ShopTest`, `CartTest`, `CheckoutTest`, `OrderTest`; run with `DB_CONNECTION=mysql DB_DATABASE=grambazar_test DB_USERNAME=root DB_PASSWORD= vendor/bin/pest` since `pdo_sqlite` is unavailable), `phpstan analyse` 0 errors, `pint` clean, `npm run types:check` + `vp check` clean, `npm run build` succeeds. Smoke-tested `/shop`, `/category/{slug}`, `/products/{slug}`, `/cart`, `/checkout` (empty cart → redirect to cart).
- Deferred to later phases: real product photos, order history + customer account (Phase 05), payment gateway, coupons, farmer order management (Phase 06), admin order management (Phase 07).

## Phase 05 — Authentication & Customer Account

- [x] Registration (name, mobile, email, password; always creates `customer`, no role selection)
- [x] Login (email OR mobile number)
- [x] Logout
- [x] Password reset (email link)
- [x] Customer profile (view/edit name, mobile, email)
- [x] Password change (current + new)
- [x] Customer dashboard (welcome, total orders, recent orders, shortcuts)
- [x] Order history (own orders only)
- [x] Order details (snapshots, ownership enforced)
- [x] Guest cart preserved on login/register
- [x] Checkout links authenticated orders to the customer
- [x] Navbar account state (guest: লগইন/নিবন্ধন; customer: আমার অ্যাকাউন্ট + লগআউট)
- [x] Authorization (ownership policy, auth+verified route group)

**Phase 05 Notes:**

- **Approach:** Reused the Laravel + Fortify starter kit already installed in the repo (headless Fortify 1.39 with Inertia views) instead of building a duplicate auth system. The four starter English auth pages (`login`, `register`, `forgot-password`, `reset-password`) were converted to Bengali-first; existing auth pages (`two-factor-challenge`, `verify-email`, `confirm-password`, passkeys) are untouched.
- **Schema:** Added `users.phone` (`string(20)`, nullable, unique, after `email`) via migration `2026_09_14_215551_add_phone_to_users_table`; `User` fillable + `orders()` `HasMany` added.
- **Registration:** `app/Actions/Fortify/CreateNewUser` now validates via `profileRules(phoneRequired: true)` (name, unique email, Bangladeshi mobile `regex:/^01[3-9][0-9]{8}$/` unique) + password rules; creates ONLY name/email/phone/password — `role` is never accepted and stays the DB default `customer` (tested with `role=admin` in the payload → still `customer`).
- **Login:** `Fortify::authenticateUsing()` matches `email` OR `phone` against the `email` field, then `Hash::check`. Kept the form field name `email` so existing Fortify validation, rate limiting, and two-factor challenge all keep working. Safe failures (no user enumeration); login/registration responses bound to custom contracts: customer → `redirect()->intended('/account')`, other roles → `/dashboard`.
- **Profile edits & password change** reuse the existing settings endpoints (`PATCH settings/profile` via `ProfileValidationRules::profileRules($id, phoneRequired:false)`, `PUT settings/password`), so the new Bengali `/account/profile` and `/account/password` pages add NO new backend logic and the old settings pages keep working (phone is required only at registration, otherwise optional in edits).
- **Account area:** New `/account` route group behind `['auth','verified']` (`account.dashboard` `/`, `account.profile`, `account.password`, `account.orders.index`, `account.orders.show` bound by `order_number`). Controllers under `app/Http/Controllers/Account/`; pages in `resources/js/pages/account/` wrapped in new `resources/js/layouts/account-layout.tsx` under `StoreLayout` (desktop sidebar + mobile horizontal nav + লগআউট button). Dashboard shows শুভেচ্ছা header, মোট অর্ডার stat, সাম্প্রতিক অর্ডার (5) and shortcuts.
- **Order ownership:** New `OrderPolicy` (`view` = `order.user_id === user->id`, registered via `Gate::policy`) enforced with `Gate::authorize('view', $order)` on `account.orders.show` → 403 for other customers. Order history is scoped to `$request->user()->orders()`. Details render from the Phase 04 `order_items` **snapshots** (not live prices) via `ShopPresenter::order()` / `orderSummary()` extracted from `OrderController::show` (refactored to reuse the same presenter — public `/orders/{n}` and account detail use identical payloads).
- **Cart & checkout:** Cart is session-backed and Fortify regenerates the session ID while preserving data, so the guest cart survives login/registration automatically (documented, no merge code needed). Guest checkout remains supported (`user_id` null); authenticated checkout keeps recording `user_id` via `OrderPlacer` (`Auth::id()`), letting orders surface in the account history. Decision documented: **keep guest checkout**, link orders to the user when logged in.
- **Navbar:** logged-in state now shows customer → "আমার অ্যাকাউন্ট" (link to `/account`) + logout icon (POST `/logout`), other roles → "ড্যাশবোর্ড" + logout icon; guests keep লগইন/নিবন্ধন. Mobile drawer updated to match.
- **TypeScript:** `User` type in `resources/js/types/auth.ts` gained `phone: string | null` and `role: 'customer' | 'farmer' | 'admin' | 'super_admin'`; new `resources/js/types/account.ts` for order summaries, paginator, order detail, and dashboard props.
- **Password reset:** Framework Fortify flow (email link to `/forgot-password` → mail via `MAIL_MAILER=log` locally; `.env.example` already carries the `MAIL_*` block, no real creds, `.env` gitignored as before). Invalid/expired tokens surface the safe Fortify error. `passwordRules` shared string drives `PasswordInput` client hints; hashing always via Laravel `Hash` (no plain text anywhere — verified in tests via `Hash::check`).
- **Tests:** `tests/Feature/CustomerAccountTest.php` (11 tests — guest redirect, dashboard totals/recent orders, orders scoped to owner, own-order detail visible, another customer's order 403, profile update incl. phone + duplicate-phone rejection, password change success + wrong-current rejection, guest cart preserved after registration, authenticated checkout links `user_id` + appears in history). Auth coverage extended in `AuthenticationTest` (phone login, unknown-identifier safe failure, non-customer → dashboard) and `RegistrationTest` (phone required/valid, invalid email, duplicate email, password confirmation, `role` ignored, redirect to `/account`). Full suite: **120 passed / 639 assertions** (`DB_CONNECTION=mysql DB_DATABASE=grambazar_test DB_USERNAME=root DB_PASSWORD= vendor/bin/pest`).
- **Checks:** `phpstan analyse` 0 errors; `pint` clean; `npm run types:check` + `vp check` (oxlint) clean; `npm run build` succeeds. Runtime smoke via `artisan serve`: `/login`, `/register`, `/forgot-password`, `/`, `/shop`, `/cart` all 200; `/account` guest → 302 `/login`; a real login (csrf token + cookie jar) returned 302 → `/account`, then `/account`, `/account/orders`, `/account/profile`, `/account/password` all 200 and `account/dashboard` Inertia component rendered (auth persisted across requests). `wayfinder:generate --with-form` rerun after route additions.
- **Not built (deferred):** Farmer authentication/dashboard and admin panels (Phase 06/07), email verification enforcement (still optional), payments.

## Phase 06 — Farmer

- [ ] Farmer authentication
- [ ] Farmer dashboard
- [ ] Product management
- [ ] Orders
- [ ] Sales
- [ ] Profile

## Phase 07 — Admin

- [ ] Admin dashboard
- [ ] User management
- [ ] Farmer management
- [ ] Category management
- [ ] Product management
- [ ] Order management
- [ ] Coupon management
- [ ] Reports
- [ ] Site management

## Phase 08 — Testing & Security

- [ ] Functional testing
- [ ] Validation
- [ ] Authorization
- [ ] Security checks
- [ ] Responsive testing
- [ ] Browser testing
- [ ] Performance checks

## Phase 09 — Deployment

- [ ] Production environment
- [ ] Database
- [ ] Storage
- [ ] Build
- [ ] Environment variables
- [ ] Final testing

## Development Rules

1. Complete one phase before moving to the next.
2. Update PROJECT_TRACKER.md after completing each feature.
3. Do not modify unrelated features.
4. Do not delete existing working functionality without a clear reason.
5. Keep the UI consistent with the GramBazar design direction.
6. Keep the website Bengali-first.
7. Keep the code clean and maintainable.
8. Test changes before marking them complete.
