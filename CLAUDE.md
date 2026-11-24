# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Admin dashboard (Next.js 15 App Router, React 19, TypeScript, Tailwind v4, shadcn/radix UI) for the Fertility Sisterhood mobile app. It talks to a separate REST backend at `NEXT_PUBLIC_API_BASE_URL` (in `.env`, e.g. `.../api/v1`). Only users whose JWT role is `ADMIN` can use it.

## Commands

- `npm run dev`: dev server with Turbopack
- `npm run build`: production build (also type-checks and lints)
- `npm run lint`: ESLint (`next lint`). Existing `no-explicit-any` warnings are known and expected.
- `npx tsc --noEmit`: type-check only

There is no test suite.

## Architecture

**Routing and auth**
- `src/app/(authLayout)/auth/*` holds the login, forgot-password, OTP and reset pages.
- `src/app/(generalLayout)/dashboard/*` holds the admin pages. The layout provides the sidebar and header.
- `src/middleware.ts` decodes the `accessToken` cookie and checks only that `role === "ADMIN"`, not expiry. It redirects `/` and unauthenticated `/dashboard/*` requests to `/auth/login?redirect=...`.
- `src/redux/slice/authSlice.ts` stores the user and token. The slice is persisted with redux-persist, and `setUser`/`logOut` also write or remove the `accessToken` cookie that the middleware reads.

**Data layer (RTK Query)**
- `src/redux/api/baseApi.ts` sends the Bearer token from the cookie. On a 401 it calls `GET /auth/refresh-token` (refresh cookie, `credentials: "include"`) and retries the request. If the refresh fails, it logs out and redirects to login.
- Each feature has a file in `src/redux/api/*Api.ts` that uses `baseApi.injectEndpoints` and exports hooks.
- Cache invalidation uses the string tags declared in `baseApi.tagTypes`. A new tag must be added there first.
- Query params go through `cleanParams()` (`src/utils/cleanParams.ts`), which drops empty values and the value `"all"`, so filter selects use `"all"` as their "no filter" value.
- Backend responses are `{ success, message, data }`. Paginated lists come back as `data: { <items>: [...], meta: { page, limit, total } }` (`TMeta` in `src/interface/global.interface.ts`).

**Mutations and forms**
- Call mutations through `handleMutation(payload, mutationFn, loadingText, onSuccess?)` from `src/utils/handleMutation.ts`. It handles `.unwrap()` and the sonner loading, success and error toasts.
- Forms use `AForm` (react-hook-form plus a zod resolver) with field components from `src/components/form/` (`AInput`, `ATextarea`, `ASelect`, `ATextEditor` for the Jodit rich text editor, and others).
- Zod schemas live in `src/validations/`. Types live in `src/interface/`. Shared select options live in `src/data/global.data.ts`.

**Page conventions**
- Each route has `page.tsx` (exports `metadata` and renders a container) and `_components/` with a `"use client"` container.
- Containers use `AContainer`, `PageTitle`, `ASpinner`, `AErrorMessage` (takes `error` and `onRetry`), `APagination` and `DeleteAction` (a confirm dialog).
- Sidebar entries are in `src/data/nav.data.tsx`.
- Charts use recharts through `ChartContainer` (`src/components/ui/chart.tsx`).
- Format money with `formatCurrency()` (default GBP, the backend's reporting currency) and dates with `src/utils/formatDate.ts`.

## Notes

- Many source files use CRLF line endings. Preserve them when editing. If an exact multi-line match fails, line endings are the likely cause.
- The backend's Swagger spec is at `<server>/api-docs` (raw JSON at `/api-docs.json`) and is the source of truth. `BACKEND_API_REQUIREMENTS.md` is the earlier request to the backend; the backend changed some of it (subscriptions moved to RevenueCat `/packages`, money is GBP, payments have `store`/`environment` instead of `invoiceUrl`).
- Notifications arrive with the mobile app's field names (`message`, `description`, `modelType`, `read`). `notificationApi`'s `transformResponse` maps them to the dashboard's `TNotification`.
