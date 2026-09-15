# GramBazar — Production Deployment

This document walks through deploying GramBazar to a production server. It is written for
deployment on a fresh Ubuntu-style Linux server with a MySQL database, PHP 8.3+ and a web
server (Nginx or Apache). Every command assumes you are logged in as a user with sudo, and
that the application lives at `/var/www/grambazar`.

> **Status:** preparation complete — deployment to a live server has **not** been performed.
> No server, domain or credentials are available yet. Follow the steps below to actually deploy.

---

## 1. Requirements

| Component   | Version / Requirement                                                                |
| ----------- | ------------------------------------------------------------------------------------ |
| PHP         | 8.3+ (developed and tested on 8.5)                                                   |
| Extensions  | `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`, `zip`, `xdebug` not required |
| MySQL       | 5.7+ / 8.x / MariaDB 10.3+                                                           |
| Composer    | 2.x                                                                                  |
| Node.js     | 20+ (Laravel Vite)                                                                   |
| Web server  | Nginx 1.18+ or Apache 2.4+ with mod_rewrite                                          |
| Redis (opt) | Only needed if QUEUE/CACHE switched from database to Redis                           |

The current stack: **Laravel 13.31, PHP 8.5, MySQL, Inertia + React + Tailwind v4, Fortify**.
No Redis, no queue workers required by default (queue/cache/session use the database).

---

## 2. Production Environment Variables

Copy the example to `.env` on the server **only** if it does not exist yet, then edit it:

```bash
cp .env.example .env
```

Every value here is a placeholder — none are real credentials.

**Mandatory — verify before starting the app:**

| Key                         | Recommended value                                         |
| --------------------------- | --------------------------------------------------------- |
| `APP_ENV`                   | `production`                                              |
| `APP_DEBUG`                 | `false`                                                   |
| `APP_URL`                   | `https://your-domain.tld` (no trailing slash)             |
| `APP_KEY`                   | run `php artisan key:generate`                            |
| `SESSION_SECURE_COOKIE`     | `true` (HTTPS only)                                       |
| `DB_CONNECTION`             | `mysql`                                                   |
| `DB_DATABASE`               | real database name                                        |
| `DB_USERNAME`/`DB_PASSWORD` | real database credentials                                 |
| `MAIL_MAILER`               | `smtp` (password reset, email verification and 2FA email) |

> **Security:** `.env` contains secrets. Never commit it, never copy it into the
> repository, and restrict file permissions to the web/PHP user (`chmod 600`).

---

## 3. Application Key

```bash
php artisan key:generate
```

Never reuse the development `.env` `APP_KEY`. Run against the production `.env` only —
if you prefer, generate a key offline and paste it.

---

## 4. Database Setup

Create the database and a dedicated user:

```sql
CREATE DATABASE grambazar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'grambazar'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON grambazar.* TO 'grambazar'@'localhost';
FLUSH PRIVILEGES;
```

Then migrate (no demo data):

```bash
php artisan migrate --force
```

If the app was already in use, avoid destructive commands (`migrate:fresh`, `db:wipe`).
The project config sets `DB::prohibitDestructiveCommands(true)` in production.

---

## 5. Storage

```bash
php artisan storage:link          # public/storage -> storage/app/public
chown -R <php-user>:<php-group> storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

The web user must be able to write to `storage/framework/{cache,sessions,views}`, `storage/logs`
and `bootstrap/cache` (they hold sessions, compiled views and cached config).

---

## 6. Seeders — Production-Safe Only

Run **only** the idempotent production seeders:

```bash
php artisan migrate --force
php artisan db:seed --class=CategorySeeder --force
php artisan db:seed --class=PermissionSeeder --force
php artisan db:seed --class=SiteSettingSeeder --force
```

`CategorySeeder`, `PermissionSeeder` and `SiteSettingSeeder` are safe and idempotent
(`updateOrCreate` / `firstOrCreate`) and contain the real product catalogue, permission
set and Bengali site content.

> **Do NOT run the generic `php artisan db:seed`.** `DatabaseSeeder` additionally creates
> demo users, demo farmers and demo products that are only for local development.

After the first admin user is created by you (via the registration flow or manually),
grant it a super-admin role before it can manage the store.

---

## 7. Install Production Dependencies & Build Assets

On the server (production dependencies only — no Pest/Pint):

```bash
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
npm ci --omit=dev && npm run build
```

Or run the full setup (also creates `.env` from the template):

```bash
composer run setup
```

The compiled frontend lives in `public/build` and is **git-ignored**, so it must be built
on the server (or built in CI and uploaded).

---

## 8. Laravel Optimization

```bash
php artisan optimize          # config, routes, events, views
php artisan view:cache
```

Verify after optimization:

```bash
php artisan route:list --path=up     # health check route must still resolve
php artisan about --only=environment # confirm production, APP_DEBUG=false
```

> Route caching works on this project (Laravel 13 can serialize the closure route inside
> the settings middleware). If you ever change routes, re-run `php artisan optimize`.

---

## 9. Web Server — Document Root

Point the virtual host at **`public/`** — never the project root.

**Nginx:**

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.tld;

    root /var/www/grambazar/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    location ~ (^|/)\.(?:git|env)$ {
        deny all;
    }
}
```

**Apache:** `AllowOverride All` and `.htaccess` is included in `public/`.

---

## 10. HTTPS / SSL

- Obtain a certificate (Let's Encrypt) per domain.
- Force HTTPS (redirect HTTP→HTTPS).
- Set `SESSION_SECURE_COOKIE=true` in `.env`.
- Optionally add HSTS but lower `max-age` initially.
- Renewal must be automatic (certbot timer).

Never run production over plain HTTP — sessions, orders and admin data would be exposed.

---

## 11. Domain / APP_URL

- Point the domain A/AAAA record at the server IP.
- `APP_URL` must match the public HTTPS origin exactly (used to build absolute
  asset/route links for images and emails).
- Test `https://your-domain.tld/up` returns `200`.

---

## 12. Mail

In production, Fortify sends **password-reset**, **email-verification** and
**2FA-code** emails, and site settings store contact data.

- Set `MAIL_MAILER=smtp` and a working `MAIL_HOST`/credentials in `.env`.
- `MAIL_FROM_ADDRESS` should be a real monitored address.
- If you add queued mail later, use `QUEUE_CONNECTION=database` (already the default)
  and run a worker.

---

## 13. Queue / Scheduler

- **No queue worker is required by default** — the app does not dispatch queued jobs or
  notifications. `failed_jobs`/`jobs` tables exist and `QUEUE_CONNECTION=database` is set,
  so a worker is ready if mail/leads get queued later.
- **Single instance scheduler**: `php artisan schedule:work` if you ever add scheduled
  commands (`routes/console.php` currently only defines the default `inspire`; nothing
  is scheduled yet).

---

## 14. Cache

Defaults use the database (`CACHE_STORE=database`, `SESSION_DRIVER=database`), which works
on a single server with no extra dependencies.

After config changes, always rebuild the config cache (`php artisan optimize`).
Clear caches between deploys:

```bash
php artisan optimize:clear
```

---

## 15. Logging & Monitoring

- Laravel writes to `storage/logs/laravel.log` by default.
- For longer retention, rotate logs (logrotate over `storage/logs/*.log`).
- Watch the `failed_jobs` table if a queue worker is enabled later.
- Keep `APP_DEBUG=false`; `APP_DEBUG=true` is only for development.

---

## 16. Backups

- **MySQL:** `mysqldump grambazar | gzip > backup-$(date +%F).sql.gz` on a schedule.
  Optionally use binary logs for point-in-time recovery.
- **Files:** back up `storage/app/public/*` and uploaded product images.
- **Code:** the repo is the source of truth; `public/build` is reproducible via `npm run build`.
- Test restoring a backup at least once. Keep at least 7 daily + 4 weekly backups,
  off-server if possible.
- Secrets (`APP_KEY`, DB/MAIL credentials) are not backed up to the repo — keep them
  separately in your password manager.

---

## 17. Health Check

A health check endpoint ships at `/up` (route defined in `bootstrap/app.php`), returning
`200 OK` when the app boots. Wire your uptime monitor to it.

---

## Deployment Checklist (server-side)

```bash
# 1. code
git pull --rebase
# 2. dependencies
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
npm ci --omit=dev && npm run build
# 3. environment
cp .env.example .env   # then fill real values
php artisan key:generate
# 4. database
php artisan migrate --force
# 5. seed production data only
php artisan db:seed --class=CategorySeeder --force
php artisan db:seed --class=PermissionSeeder --force
php artisan db:seed --class=SiteSettingSeeder --force
# 6. storage
php artisan storage:link
chown -R <php-user>:<php-user> storage bootstrap/cache
# 7. optimize
php artisan optimize
php artisan view:cache
# 8. verify
curl -s https://your-domain.tld/up
```

Then run the post-deployment smoke checks (homepage, product page, register/login,
add to cart, checkout, admin dashboard, a deliberately-bad URL showing the branded 404).

---

## Production Security Summary

- `.env` untracked, `SESSION_SECURE_COOKIE=true`, HTTPS enforced.
- `APP_DEBUG=false` and `APP_ENV=production`.
- Baseline security headers set by `app/Http/Middleware/SetSecurityHeaders.php`:
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 0`.
- Branded error pages (`ErrorPage` Inertia component) for 403/404/419/429/500/503.
- `DB::prohibitDestructiveCommands(true)` in production prevents accidental
  `migrate:fresh` / `db:wipe`.
- No CSP is set on purpose (Inertia + Vite need inline scripts); if you add one,
  test thoroughly.
