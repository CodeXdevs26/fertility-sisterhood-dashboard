# Admin Dashboard: Backend API Requirements

Audit date: 23 Nov 2026. Compared the admin dashboard code and the live backend (`/api/v1`) against the Fertility Sisterhood user-app Figma design.

All responses use the existing envelope: `{ "success": true, "message": "...", "data": ... }`.
Admin endpoints need the admin's Bearer token (role `ADMIN`) unless marked **public**.
Paginated lists use the same shape as `GET /auth`: `data: { <items>: [...], meta: { page, limit, total } }`.

> **Status (23 Nov 2026):** the backend developer has implemented everything below, but it is not deployed yet. Where the final contract differs from the original request, this file now describes what was built, and the dashboard has been updated to match.

---

## 1. Already done (no work needed)

These are wired in the dashboard and work against the backend.

| Feature | Endpoint |
|---|---|
| Login / logout / refresh token | `POST /auth/login`, `POST /auth/logout`, `GET /auth/refresh-token` |
| Forgot password | `POST /otp/send`, `POST /otp/verify`, `POST /auth/reset-password` |
| Change password | `POST /auth/change-password` |
| Admin profile | `GET /profile`, `PATCH /profile` |
| Users list / details / block | `GET /auth`, `GET /auth/:id`, `PATCH /auth/change-account-status/:id` |
| User growth chart | `GET /meta/user-overview?year=&status=` |
| Supports | `GET /support`, `GET /support/:id`, `PATCH /support/:id/status` |
| Subscription package | `GET /subscriptions/plan`, `PATCH /subscriptions/plan` |
| About / Terms / Privacy | `GET /legal`, `PATCH /legal` |

---

## 2. Changes to existing endpoints

### 2.1 `GET /meta/stats`: add 4 fields

The dashboard now shows 6 cards. Keep the current fields and add the new ones:

```json
{
  "totalUsers": 1200,
  "activeUsers": 1180,
  "blockedUsers": 20,
  "activeSubscribers": 340,
  "newUsersThisMonth": 85,
  "totalRevenue": 15230.50,
  "revenueThisMonth": 2040.00,
  "pendingSupports": 7
}
```

- `newUsersThisMonth`: users (role USER) created since the 1st of the current month.
- `totalRevenue` and `revenueThisMonth`: sum of **succeeded** payments, minus refunds, in EUR.
- `pendingSupports`: supports with status `PENDING`.

### 2.2 `GET /auth` (users list): new filter and new field

- New query param `subscription=premium|free`. If it is missing, return all users.
  - `premium`: the subscription status is `ACTIVE`.
  - `free`: no subscription, or any other status.
- Add `isPremium: boolean` to every user in the list.

### 2.3 `GET /auth/:id` (user details): add 2 fields

```json
{
  "...existing fields": "...",
  "provider": "EMAIL",
  "consent": {
    "healthData": true,
    "healthDataUpdatedAt": "2026-11-01T10:00:00.000Z",
    "marketing": false,
    "cookies": true
  }
}
```

- `provider`: `"EMAIL" | "GOOGLE" | "FACEBOOK"`. Google login isn't live yet, so every user is `"EMAIL"` for now.
- `subscription`: `{ status, cancelAtPeriodEnd, currentPeriodEnd, createdAt }` or `null`.
- `consent`: the choices from the app's "Your consent matters" screen. Use `null` if the user has not answered yet. `healthData` is the explicit consent for processing health data under UK GDPR. The app must also be able to save it and withdraw it.

---

## 3. New endpoints

### 3.1 Earning chart: `GET /meta/earning-overview?year=2026`

Return all 12 months, with 0 for months that have no revenue. Month names are short (`"Jan"` … `"Dec"`), the same as `user-overview`.

```json
[
  { "month": "Jan", "amount": 1200.00 },
  { "month": "Feb", "amount": 0 }
]
```

### 3.2 Transactions: `GET /payments`

Save one record for every Stripe invoice payment (use the webhook events `invoice.paid`, `invoice.payment_failed` and `charge.refunded`).

Query: `page`, `limit`, `searchTerm` (matches user name or email), `status` (`SUCCEEDED | FAILED | REFUNDED`). Sort newest first.

```json
{
  "payments": [
    {
      "id": "...",
      "amount": 9.99,
      "amountRefunded": 0,
      "currency": "eur",
      "status": "SUCCEEDED",
      "invoiceUrl": "https://invoice.stripe.com/...",
      "createdAt": "2026-11-20T09:12:00.000Z",
      "auth": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" }
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 54 }
}
```

A partial refund keeps status `SUCCEEDED` with `amountRefunded > 0`. A full refund sets status `REFUNDED`. Payments made before this update was deployed are not included.

`invoiceUrl` is Stripe's `hosted_invoice_url`, or `null` if there isn't one. `auth` is `null` if the user was deleted.

### 3.3 Admin notifications

The `/notifications` route already exists (it returns 401). It must also work for the admin and return only the logged-in admin's notifications.

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/notifications?page=&limit=` | Newest first. `meta` must include `unreadCount`. |
| PATCH | `/notifications/:id/read` | Marks one notification as read. |
| PATCH | `/notifications/read-all` | Marks all of them as read. |
| DELETE | `/notifications/:id` | |
| DELETE | `/notifications` | Deletes all of them. Returns `data: { count }`. |

The backend keeps the mobile app's field names, so each item looks like the example below. The dashboard maps them in `notificationApi`: `message` → title, `description` (nullable) → message, `modelType` → type, `read` → isRead.

```json
{
  "notifications": [
    {
      "id": "...",
      "modelType": "NEW_SUPPORT",
      "message": "New support message",
      "description": "Jane Doe sent: \"Can't upload my test results\"",
      "referenceId": "...",
      "read": false,
      "createdAt": "2026-11-23T08:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 32, "unreadCount": 5 }
}
```

Create an admin notification when any of these happens (`modelType` values; `referenceId` is what clicking it opens):

- `NEW_USER`: a user verifies their email (user id)
- `NEW_SUBSCRIPTION`: a user subscribes (user id)
- `SUBSCRIPTION_CANCELED`: a user cancels, or the subscription ends (user id)
- `PAYMENT_FAILED`: a renewal payment fails (payment id)
- `NEW_SUPPORT`: a user sends a Contact Support message (support id)

The header bell checks `GET /notifications?page=1&limit=1` every 60 seconds to read `unreadCount`, so this request must be fast.

### 3.4 Contact & Community settings: `/app-settings`

The app's Profile screen shows a support phone number, a support email ("Contact Support") and a "Join Our Community" link. These are currently hardcoded in the design. Store them as one single document.

| Method | Endpoint | Access |
|---|---|---|
| GET | `/app-settings` | **public** (the app reads it too) |
| PATCH | `/app-settings` | admin; creates the document if it doesn't exist (upsert) |

```json
{ "supportEmail": "support@example.com", "supportPhone": "+44 20 1234 5678", "communityLink": "https://chat.whatsapp.com/..." }
```

PATCH validation: `supportEmail` must be a valid email, `supportPhone` 6 to 20 characters of digits, spaces, `+`, `(`, `)` or `-`, and `communityLink` a valid https URL. All three are required. `GET` returns `data: null` until the first save.

### 3.5 Daily quotes: `/quotes`

The app's home screen shows a motivational quote ("Believe in the power of your body..."). The admin manages the list.

| Method | Endpoint | Body / Query |
|---|---|---|
| GET | `/quotes?page=&limit=` | admin, newest first. Returns `{ quotes, meta }`. |
| POST | `/quotes` | `{ text: string (max 300), author?: string \| null }`. Saved with `isActive: true`. |
| PATCH | `/quotes/:id` | any of `{ text, author, isActive }` |
| DELETE | `/quotes/:id` | |
| GET | `/quotes/today` | **for the app**: one active quote per day, the same for everyone that day (e.g. day-of-year mod active count) |

Quote object: `{ id, text, author, isActive, createdAt }`.

### 3.6 IVF checklist template: `/checklist-templates`

The app's Planner → Checklist screen gives every user a default "pre-treatment IVF checklist" (about 30 items). The admin manages these default items. The user's own ticks and custom items stay in the existing `/checklists` module.

Categories (enum): `MEDICAL | FINANCIAL | LIFESTYLE | WELLBEING | PARTNER | LOGISTIC` (note: `LOGISTIC`, not `LOGISTICS`)

| Method | Endpoint | Body / Query |
|---|---|---|
| GET | `/checklist-templates?category=MEDICAL` | Not paginated. Returns an array sorted by `order`. Without `category`, it returns all items. The app reads this too. |
| POST | `/checklist-templates` | `{ category, title (max 200) }`. `order` = last + 1 in that category. |
| PATCH | `/checklist-templates/:id` | `{ category?, title? }` |
| DELETE | `/checklist-templates/:id` | Delete the template only. Users who already have the item keep their copy and its progress. |

Item object: `{ id, category, title, order, createdAt }`.

Seed the database with the items shown in the Figma design (Medical, Financial, Lifestyle, Wellbeing, Partner, Logistics) so the app doesn't start empty.

---

## 4. Priority

1. `GET /meta/stats` new fields and `GET /meta/earning-overview` (the dashboard home page shows zeros until these exist)
2. `GET /payments` and the Stripe webhook that saves payments
3. Admin notifications
4. `/app-settings` (the app needs it for Contact Support)
5. `/checklist-templates` and its seed data
6. `/quotes`
7. `isPremium` / `subscription` filter, plus `provider` / `consent` on the user endpoints
