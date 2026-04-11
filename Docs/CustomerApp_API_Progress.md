# Customer App API Progress

Last updated: 2026-04-11

Source of truth:
- API contract: `Coolzo_API_Integration_Master.md`
- App path: `Mobile/Coolzo_MobileCustomer`
- Mock mode remains available with `VITE_USE_MOCK_API=true`. Real API mode is enabled with `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL`.

## Current Batch

Batch: 2026-04-11 customer real API integration pass

Status: Core available APIs integrated; missing/non-contract surfaces are tracked in `Docs/CustomerApp_API_Integration_Issues.md`.

Validation:
- `npm ci` completed successfully because `node_modules` was missing.
- `npm run lint` passed.
- `npm run build` passed.
- Build warning: Vite reports a large JS chunk above 500 kB; no functional build failure.

## Integrated Screens And Services

| Module | Screens / Services | Status | API routes connected |
| --- | --- | --- | --- |
| Shared API foundation | `apiConfig.ts`, `apiClient.ts` | Integrated | Envelope unwrap, bearer auth, refresh token via `/auth/refresh`, query params, API errors |
| Auth | Login, Register, Forgot Password, Reset Password, Change Password | Partially integrated | `/auth/login`, `/auth/me`, `/customer-auth/register`, `/customer-auth/forgot-password`, `/customer-auth/reset-password`, `/customer-auth/change-password` |
| Catalog / booking lookups | Service Catalog, Service Detail, Search, Booking step 1-4 | Integrated | `/booking-lookups/services`, `/booking-lookups/ac-types`, `/booking-lookups/brands`, `/booking-lookups/tonnage`, `/booking-lookups/zones/by-pincode/{pincode}`, `/booking-lookups/slots` |
| Booking create/history | Booking Wizard, Booking Confirmation, My Jobs, Booking Detail, Job Tracker, Service Report | Partially integrated | `/bookings/customer`, `/customer-bookings`, `/customer-bookings/{bookingId}` |
| Billing and payments | Invoices, Invoice Detail, Payment Gateway, Receipt View | Integrated with receipt limitation | `/invoices/customer`, `/invoices/{id}`, `/payments/collect`, `/payments/invoice/{invoiceId}` |
| Support | Support Tickets, Raise Ticket, Ticket Detail | Integrated | `/support-ticket-lookups/categories`, `/support-ticket-lookups/priorities`, `/support-tickets/my-tickets`, `/support-tickets`, `/support-tickets/{supportTicketId}`, `/support-tickets/{supportTicketId}/replies` |
| Notification preferences | Notification Preferences | Integrated | `/communication-preferences/me` GET/PUT |
| AMC | AMC Plans, AMC Plan Detail, AMC Dashboard, AMC Visit Detail | Partially integrated | `/amc/plans`, `/amc/customer/me` |
| CMS content | FAQ, About, Legal/Service content | Partially integrated | `/cms/public/home`, `/cms/public/faqs`, `/cms/public/service-content/{key}` |

## Blocked Or Non-Contract Surfaces

These are intentionally not wired to guessed endpoints. Details are in `Docs/CustomerApp_API_Integration_Issues.md`.

| Module | Screens / Services | Status |
| --- | --- | --- |
| Auth | Google login, phone OTP login/register | API Missing |
| Customer account | Profile update, delete account | API Missing |
| Address book | Addresses, Add/Edit Address | API Missing |
| Equipment | Equipment List, Equipment Detail, Add/Edit Equipment | API Missing |
| Booking | Emergency booking, reschedule, draft sync, dedicated service report | API Missing |
| Estimates | Estimate approval UI needs real numeric `quotationId` from booking detail | Request Mismatch |
| Billing | Download/share PDF receipt | API Missing |
| Notifications | Notification list and mark-read | API Missing |
| Support | Attachments and linked entity schema from customer UI | Contract gap |
| AMC | Customer enrollment/purchase/renewal, dedicated plan detail, direct visit detail | API Missing |
| Marketing/rewards | Offers, coupon validation, referral, loyalty, reviews, blog/changelog/app feedback | API Missing |
| Technician profile | Customer-facing technician detail | API Missing |

## Files Changed In This Batch

Config/client:
- `src/config/apiConfig.ts`
- `src/services/apiClient.ts`
- `.env.example`

Services:
- `src/services/authService.ts`
- `src/services/catalogService.ts`
- `src/services/bookingService.ts`
- `src/services/paymentService.ts`
- `src/services/supportService.ts`
- `src/services/notificationService.ts`
- `src/services/amcService.ts`
- `src/services/contentService.ts`
- `src/services/addressService.ts`
- `src/services/equipmentService.ts`
- `src/services/offerService.ts`
- `src/services/referralService.ts`
- `src/services/loyaltyService.ts`
- `src/services/reviewService.ts`
- `src/services/technicianService.ts`

Store and UI:
- `src/store/useBookingStore.ts`
- `src/pages/Login.tsx`
- `src/pages/Register.tsx`
- `src/pages/ForgotPassword.tsx`
- `src/pages/ResetPassword.tsx`
- `src/pages/BookingWizard.tsx`
- `src/pages/BookingConfirmation.tsx`
- `src/pages/MyJobs.tsx`
- `src/pages/BookingDetail.tsx`
- `src/pages/JobTracker.tsx`
- `src/pages/AMCPlans.tsx`
- `src/pages/AMCPlanDetail.tsx`
- `src/pages/ServiceDetail.tsx`
- `src/pages/RaiseTicket.tsx`
- `src/pages/TicketDetail.tsx`
- `src/components/booking/Step1Service.tsx`
- `src/components/booking/Step2Equipment.tsx`
- `src/components/booking/Step3Location.tsx`
- `src/components/booking/Step4DateTime.tsx`
- `src/components/booking/Step5Contact.tsx`
- `src/components/booking/Step6Summary.tsx`

Docs:
- `Docs/CustomerApp_API_Progress.md`
- `Docs/CustomerApp_API_Integration_Issues.md`

## Next Recommended Batch

1. Backend/API: decide and add missing customer APIs for OTP, profile update, address book, equipment, emergency/reschedule booking, AMC enrollment, notifications, coupons/offers, loyalty/referrals/reviews, and technician profile.
2. UI: wire backend-provided `quotationId` into Estimate Approval instead of mock `est-123`.
3. UI: add receipt/PDF download once an invoice/receipt document endpoint exists.
4. UI: add support ticket attachments and linked booking IDs after the link/attachment contract is confirmed.
5. Performance: split large app chunks after API correctness work is complete.
