# GramBazar Project Tracker

## Project Status
Phase: 02 — Database & Backend
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
- [ ] Navbar
- [ ] Hero section
- [ ] Categories
- [ ] Popular products
- [ ] Farmer section
- [ ] Seasonal products
- [ ] Spice section
- [ ] Village story/video
- [ ] Farmer story
- [ ] Footer
- [ ] Responsive design

## Phase 04 — Customer Shopping
- [ ] Shop
- [ ] Product details
- [ ] Search
- [ ] Filters
- [ ] Cart
- [ ] Checkout
- [ ] Order confirmation

## Phase 05 — Authentication
- [ ] Registration
- [ ] Login
- [ ] Logout
- [ ] Password reset
- [ ] Customer profile
- [ ] Order history

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