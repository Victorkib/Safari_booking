# Operations guide

## SEO & branding

- Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://safariadventures.com`) for canonical URLs, sitemap, and Open Graph.
- Favicons and PWA icons are generated from `public/logo.png`: run `npm run brand:assets` after logo changes.
- Public routes are indexed; `/admin`, `/driver`, `/booking`, and account pages are `noindex`.
- `@vercel/analytics` is not used — the site is standalone with no Vercel tracking snippet.

## Role matrix

| Capability | Customer | Driver | Admin |
|------------|----------|--------|-------|
| Browse `/packages` | Yes | Yes | Yes (preview only) |
| Self-book (`createBooking`) | Yes | No | No |
| `/booking/*`, `/customer-dashboard` | Yes | Blocked | Redirected to admin |
| Admin console | No | No | Yes |
| Book on behalf of customer | No | No | `/admin/bookings/new` |
| Record / verify payments | Own STK flow | No | `/admin/bookings/[id]` |

## Admin payments (on behalf of customer)

At **Admin → Bookings → [id] → Record payment**:

| Method | When to use | Booking after record |
|--------|-------------|----------------------|
| **Cash** | Paid in person | `confirmed` immediately |
| **Bank transfer** | Offline transfer | `confirmed` immediately |
| **M-Pesa (manual)** | Customer paid; admin has receipt/reference | `paid` until admin clicks **Verify payment** |
| **M-Pesa STK** | Customer should pay on phone now | STK sent; `paid` after verify (or callback) |

Cash and bank skip M-Pesa polling. STK uses the phone number the admin enters (customer’s number).

## User lifecycle

- **Day-to-day delete:** soft delete (`deletedAt` set). User cannot sign in; hidden from admin lists.
- **Permanent delete:** only via `npm run db:purge-deleted` (removes users soft-deleted **≥ 7 days** ago and related auth rows).
- **Full wipe (dev/staging/prod emergency):** `npm run db:clear` — see below. Not available in the UI.

Schedule purge on your host (e.g. daily cron):

```bash
npm run db:purge-deleted
```

## Database scripts

| Script | Purpose |
|--------|---------|
| `npm run db:push` | Apply schema (e.g. `user.deletedAt`) |
| `npm run db:seed` | Demo data |
| `npm run db:clear` | Delete all business + auth data (tables kept) |
| `npm run db:reset` | `db:clear` then `db:seed` (non-production only by default) |
| `npm run db:purge-deleted` | Hard-delete users soft-deleted 7+ days ago |

### Production DB clear (CLI only)

There is **no** admin UI button for clearing the database.

```bash
CONFIRM_DB_CLEAR=yes npm run db:clear
```

`db:clear` refuses to run in `NODE_ENV=production` unless `CONFIRM_DB_CLEAR=yes` is set. Prefer backups and staging resets over production clears.

### Environment

```env
# Required for production clear
CONFIRM_DB_CLEAR=yes   # only when intentionally running db:clear in production
```
