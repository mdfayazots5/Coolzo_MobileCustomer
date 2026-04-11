# Customer App API Integration Issues

Last updated: 2026-04-11

Scope: `Mobile/Coolzo_MobileCustomer` real API integration against `Coolzo_API_Integration_Master.md`.

## Fully Working Screens

| Screen name | Module name | Expected API | Current status | Notes | Last updated date |
| --- | --- | --- | --- | --- | --- |
| Login | Auth | `/auth/login`, `/auth/me`, `/auth/refresh` | Integrated | Email/username password login, current-user bootstrap, token refresh and logout token clear are wired. | 2026-04-11 |
| Forgot Password | Auth | `/customer-auth/forgot-password` | Integrated | Uses `loginId` contract. | 2026-04-11 |
| Reset Password | Auth | `/customer-auth/reset-password` | Integrated | API uses same `loginId` contract as forgot-password; final password/token reset flow is not distinguishable by contract. | 2026-04-11 |
| Change Password | Auth | `/customer-auth/change-password` | Integrated | Authenticated change-password route wired. | 2026-04-11 |
| Service Catalog | Booking Lookup | `/booking-lookups/services` | Integrated | Reads service lookup values through `CatalogService`. | 2026-04-11 |
| Service Detail | Booking Lookup | `/booking-lookups/services` | Integrated | Detail is resolved from the service lookup list because no dedicated service detail route exists. | 2026-04-11 |
| Search | Booking Lookup | `/booking-lookups/services?search=` | Integrated | Service search uses lookup API. Article search remains local because blog API is missing. | 2026-04-11 |
| Notification Preferences | Communication | `/communication-preferences/me` GET/PUT | Integrated | Channel and promotional preferences are mapped. | 2026-04-11 |
| Support Tickets | Support | `/support-tickets/my-tickets` | Integrated | Customer ticket list is wired. | 2026-04-11 |
| Ticket Detail | Support | `/support-tickets/{supportTicketId}`, `/support-tickets/{supportTicketId}/replies` | Integrated | Detail and replies are wired with a one-shot fetch in real mode. | 2026-04-11 |
| Invoices | Billing | `/invoices/customer` | Integrated | Customer invoice list is wired. | 2026-04-11 |
| Invoice Detail | Billing | `/invoices/{id}` | Integrated | Invoice detail and line mapping are wired. | 2026-04-11 |
| Payment Gateway | Billing | `/payments/collect` | Integrated | Payment collection contract is wired with an idempotency key. | 2026-04-11 |

## Partially Integrated Screens

| Screen name | Module name | Expected API | Current status | Exact issue description | Required backend/API action | Required UI action | Temporary workaround if any | Priority | Last updated date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Register | Auth | `/customer-auth/register`, OTP routes | Pending | Customer registration is wired, but production OTP registration/verification is not defined in API master. | Add OTP send/verify routes or confirm no OTP flow for customer mobile. | Keep password registration active; keep OTP UI blocked in real mode. | Mock mode keeps demo OTP flow. | High | 2026-04-11 |
| Booking Wizard | Booking | `/bookings/customer`, `/booking-lookups/*` | Integrated | Normal customer booking is wired; emergency booking is blocked because no emergency-specific API contract exists. | Add emergency booking route/fields or confirm standard booking covers emergency. | Emergency toggle is disabled in real mode. | Mock mode preserves emergency flow. | High | 2026-04-11 |
| Booking Confirmation | Booking | `/bookings/customer` response | Integrated | Shows returned booking reference when available. | None unless backend needs richer confirmation payload. | No further action. | None. | Low | 2026-04-11 |
| My Jobs | Booking | `/customer-bookings` | Integrated | List is wired; list response lacks full address/price fields so detail remains source for richer fields. | Add list fields if cards need address/price. | Keep list fields limited. | Uses available list fields. | Medium | 2026-04-11 |
| Booking Detail | Booking | `/customer-bookings/{bookingId}` | Integrated | Detail is wired; technician profile remains mock/null because customer technician detail API is missing. | Add customer-visible technician detail route. | Continue showing assigned state without detail when API has only ID/name. | Uses mock technician only in mock/legacy data match. | Medium | 2026-04-11 |
| Job Tracker | Booking | `/customer-bookings/{bookingId}` | Integrated | Real mode is one-shot fetch; no customer realtime/polling route is defined. | Add realtime/event feed or status polling contract if required. | Manual refresh calls detail API. | Refresh button re-fetches detail. | Medium | 2026-04-11 |
| Service Report | Booking | dedicated service report API | Pending | No dedicated customer service report endpoint exists; booking detail is used to synthesize visible report fields. | Add service report/customer job completion endpoint. | Keep synthesized report from booking detail. | `/customer-bookings/{bookingId}`. | Medium | 2026-04-11 |
| Receipt View | Billing | receipt/PDF endpoint | Pending | No receipt/detail download endpoint exists; payment history is mapped from `/payments/invoice/{invoiceId}`. | Add receipt detail/PDF/download route or include receipt URL in payment response. | Keep receipt view from latest payment transaction. | `/payments/invoice/{invoiceId}`. | Medium | 2026-04-11 |
| Raise Ticket | Support | `/support-ticket-lookups/categories`, `/support-tickets` | Integrated | Ticket creation is wired; attachments and linked booking schema are not available in the master. | Confirm/create support ticket attachment and link contract. | Append related booking text in description; send empty `links`. | Related booking is embedded in description. | Medium | 2026-04-11 |
| AMC Plans | AMC | `/amc/plans` | Integrated | Plan list is wired; purchase/enrollment action is blocked in real mode. | Add customer AMC enrollment/purchase/renewal route. | Real mode shows blocked toast for enrollment. | Mock mode keeps booking-based demo flow. | High | 2026-04-11 |
| AMC Plan Detail | AMC | `/amc/plans` | Integrated | Detail is resolved from list because no dedicated customer plan detail route exists. | Add `/amc/plans/{id}` customer-readable route if detail grows. | Keep list lookup detail. | Fetch list and match by ID. | Low | 2026-04-11 |
| AMC Dashboard | AMC | `/amc/customer/me` | Integrated | Subscription summary is wired; direct visit detail/reschedule/renewal APIs are not defined. | Add visit detail, reschedule, renewal routes if needed. | Keep summary and block unavailable actions. | Uses subscription `visits` collection when present. | Medium | 2026-04-11 |
| About / FAQ / Legal Content | CMS | `/cms/public/home`, `/cms/public/faqs`, `/cms/public/service-content/{key}` | Integrated | Public CMS content routes are wired; blog/changelog/app feedback APIs are missing. | Add public blog/changelog/app feedback APIs if those screens stay dynamic. | Use empty state or mock only in demo for missing content groups. | FAQ/about/legal use CMS API. | Medium | 2026-04-11 |

## Blocked Screens

| Screen name | Module name | Expected API | Current status | Exact issue description | Required backend/API action | Required UI action | Temporary workaround if any | Priority | Last updated date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Google Login | Auth | Customer social login route | API Missing | API master does not define Google/social login. | Add social auth route or remove production social login requirement. | Hidden in real mode. | Mock mode uses Firebase Google login. | Medium | 2026-04-11 |
| Phone OTP Login | Auth | OTP send/verify routes | API Missing | API master does not define customer phone OTP login. | Add OTP routes. | OTP button remains disabled in real mode. | Mock/demo only. | High | 2026-04-11 |
| Profile Update | Customer Account | customer profile update route | API Missing | No customer self-service profile update route in master. | Add profile update route. | Service throws explicit non-contract error in real mode. | Mock mode uses Firestore. | High | 2026-04-11 |
| Delete Account | Customer Account | customer delete/deactivate route | API Missing | No customer self-service delete-account route in master. | Add delete/deactivate account route. | Service throws explicit non-contract error in real mode. | Mock mode marks Firestore user deleted. | Medium | 2026-04-11 |
| Addresses / Add Edit Address | Customer Account | customer address CRUD routes | API Missing | No address CRUD route in API master. | Add customer address book CRUD. | Real mode returns empty list and blocks save/delete with explicit errors. | Mock mode uses Firestore. | High | 2026-04-11 |
| Equipment List / Detail / Add Edit Equipment | Customer Account | customer equipment CRUD routes | API Missing | No customer equipment inventory CRUD route in API master. | Add equipment CRUD. | Real mode returns empty list and blocks save/delete with explicit errors. | Mock mode uses Firestore. | High | 2026-04-11 |
| Emergency Booking | Booking | emergency booking route/fields | API Missing | Standard booking request has no emergency indicator/surcharge fields. | Add emergency route or extend booking create contract. | Real mode disables emergency toggle. | Mock mode preserved. | High | 2026-04-11 |
| Reschedule | Booking | customer reschedule route | API Missing | No customer booking reschedule route in API master. | Add reschedule route with slot availability ID. | Current service throws explicit non-contract error in real mode. | Mock mode updates Firestore. | High | 2026-04-11 |
| Booking Draft Resume | Booking | draft booking CRUD route | API Missing | No backend draft route in master. | Add draft CRUD route or keep client-only drafts. | Real mode returns empty draft list. | Zustand persisted draft. | Low | 2026-04-11 |
| Promotional Offers / Coupon | Marketing | offers list and validate coupon routes | API Missing | No offers/coupon API in master. | Add offers and coupon validation routes. | Real mode returns no offers and coupon validation fails. | Mock mode keeps demo coupon success in booking step. | Medium | 2026-04-11 |
| Refer Friend | Marketing | referral stats route | API Missing | No referral API in master. | Add referral stats/share route. | Real mode returns empty stats. | Mock mode uses Firestore/fallback. | Low | 2026-04-11 |
| Loyalty Rewards | Marketing | loyalty points/transactions routes | API Missing | No loyalty API in master. | Add loyalty points and transaction routes. | Real mode returns zero/empty state. | Mock mode uses Firestore/fallback. | Low | 2026-04-11 |
| Reviews / Review Submission | Feedback | customer review routes | API Missing | No customer review API in master. | Add review list/create routes. | Real mode shows empty reviews and blocks submission. | Mock mode uses Firestore. | Medium | 2026-04-11 |
| Blog / Blog Detail / Changelog | CMS | blog/changelog public routes | API Missing | CMS public API includes home/faqs/banners/service-content, not blog or changelog. | Add blog/changelog CMS routes or remove dynamic screens. | Real mode returns empty lists. | Mock content stays in demo screens. | Low | 2026-04-11 |
| App Feedback | Feedback | app feedback route | API Missing | No app feedback submission route in master. | Add feedback route. | Real mode throws explicit non-contract error. | Mock delay only. | Low | 2026-04-11 |
| Technician Profile | Booking/Technician | customer-visible technician detail route | API Missing | API master has technician workflow/admin surfaces, not customer technician detail. | Add customer technician detail route. | Real mode returns null. | Mock data can display legacy technicians. | Medium | 2026-04-11 |
| Notification Centre | Communication | customer notifications list/mark-read routes | API Missing | Master only defines communication preferences, not notification inbox routes. | Add notification inbox and mark-read routes. | Real mode returns empty notification list and mark-read is no-op. | Mock mode uses Firestore. | Medium | 2026-04-11 |

## Request / Response Contract Mismatches

| Screen name | Module name | Expected API | Current status | Exact issue description | Required backend/API action | Required UI action | Temporary workaround if any | Priority | Last updated date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Estimate Approval | Billing | `/quotations/{quotationId}/approve` | Request Mismatch | Existing UI uses mock estimate IDs like `est-123`; API expects numeric `quotationId`. | Ensure booking detail exposes `quotationId` for customer estimate approval and confirm route is customer-authorized. | Pass real `quotationId` from booking detail instead of mock estimate ID. | Service rejects non-numeric IDs in real mode. | High | 2026-04-11 |
| Reset Password | Auth | `/customer-auth/reset-password` | Contract Limitation | Reset route uses `ForgotCustomerPasswordRequest` with only `loginId`, so UI cannot submit token/new password. | Confirm intended reset completion flow or add token/new password fields. | Current UI requests reset by login ID only. | Mirrors API contract exactly. | Medium | 2026-04-11 |
| Support Ticket Links | Support | `/support-tickets` create `links` | Contract Gap | `links` is required, but API master does not list the link request schema fields. | Document `CreateSupportTicketLinkRequest` fields. | Send `links: []` and include related booking in description. | Description includes related booking reference. | Medium | 2026-04-11 |
| Communication Preferences | Communication | `/communication-preferences/me` | Field Mapping Issue | UI has `updates` preference, but API only defines channel flags and `allowPromotionalContent`. | Add service-update preference field or confirm it is always mandatory. | UI keeps `updates` local/default true and does not send it. | `updates` remains true after API read. | Low | 2026-04-11 |
| Service Detail | Booking Lookup | `/booking-lookups/services` | Response Limitation | No service detail endpoint; UI detail is built from lookup summary/base price. | Add detail route if detail page needs richer fields. | Use lookup list and match by ID. | `CatalogService.getServiceById()` fetches list and finds ID. | Low | 2026-04-11 |

## Auth / Token / Environment Issues

| Screen name | Module name | Expected API | Current status | Exact issue description | Required backend/API action | Required UI action | Temporary workaround if any | Priority | Last updated date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| All authenticated screens | Shared API | Bearer token + `/auth/refresh` | Integrated | Token storage and refresh are centralized; real backend URL must be supplied by environment for non-demo mode. | Provide deployed API base URL and CORS configuration. | Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=https://.../api/v1`. | Default remains mock mode to preserve demo. | High | 2026-04-11 |
| Local validation | Build tooling | npm dependencies | Working | `node_modules` was missing before validation. | None. | Ran `npm ci`. | Lockfile install succeeded. | Low | 2026-04-11 |

## Final Pending Items For Next Follow-Up

1. Add/confirm missing backend APIs listed under Blocked Screens.
2. Wire Estimate Approval to real numeric `quotationId`.
3. Add receipt/PDF download when billing exposes a document/receipt route.
4. Add customer notification inbox when backend route exists.
5. Add AMC enrollment/purchase/renewal when backend route exists.
6. Add support attachments/linked entity payload after `CreateSupportTicketLinkRequest` is documented.
7. Consider route-level code splitting to address Vite large chunk warning after API correctness work.
