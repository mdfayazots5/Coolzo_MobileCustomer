# Coolzo Customer App - API Integration Progress

This document tracks the progress of API integration for the top 10 priority screens.

## Strategy
- **Base API Configuration:** Centralized in `src/config/apiConfig.ts`.
- **API Client:** Generic client in `src/services/apiClient.ts`.
- **Service Layer:** Domain-specific services in `src/services/`.
- **Mock Toggle:** `IS_MOCK` flag in `apiConfig.ts` allows switching between mock and real APIs.

## Top 10 Priority Screens

| Screen | Status | API Service | Methods Used |
| :--- | :--- | :--- | :--- |
| 1. Login | ✅ Completed | `AuthService` | `loginWithGoogle` |
| 2. Register | ✅ Completed | `AuthService` | `setUser` (Mock OTP) |
| 3. Home Dashboard | ✅ Completed | `BookingService` | `getLiveJobs` |
| 4. Service Catalog | ✅ Completed | `CatalogService` | `getServices` |
| 5. Service Detail | ✅ Completed | `CatalogService` | `getServiceById` |
| 6. Booking Wizard | ✅ Completed | `BookingService` | `createBooking` |
| 7. Booking Confirmation | ✅ Completed | N/A | Static / State-driven |
| 8. My Bookings (List) | ✅ Completed | `BookingService` | `getLiveJobs` |
| 9. Booking Detail / Job Tracker | ✅ Completed | `BookingService` | `onBookingUpdate` |
| 10. Profile Screen | ✅ Completed | `AuthService` | `updateProfile` |

## Batch 2 Priority Screens (Next 10)

| Screen | Status | API Service | Methods Used |
| :--- | :--- | :--- | :--- |
| 11. AMC Plans List | ✅ Completed | `AMCService` | `getPlans` |
| 12. AMC Plan Detail | ✅ Completed | `AMCService` | `getPlanById` |
| 13. Address Book | ✅ Completed | `AddressService` | `getAddresses` |
| 14. Add/Edit Address | ✅ Completed | `AddressService` | `saveAddress` |
| 15. Equipment List | ✅ Completed | `EquipmentService` | `getEquipment` |
| 16. Add/Edit Equipment | ✅ Completed | `EquipmentService` | `saveEquipment` |
| 17. Notification Centre | ✅ Completed | `NotificationService` | `onNotificationsUpdate` |
| 18. Invoices List | ✅ Completed | `PaymentService` | `getInvoices` |
| 19. Support Tickets List | ✅ Completed | `SupportService` | `getTickets` |
| 20. Support Ticket Detail | ✅ Completed | `SupportService` | `onTicketUpdate` |

## Batch 3 Priority Screens (Next 10)

| Screen | Status | API Service | Methods Used |
| :--- | :--- | :--- | :--- |
| 21. Global Search | ✅ Completed | `CatalogService` | `searchServices` |
| 22. Promotional Offers | ✅ Completed | `OfferService` | `getOffers` |
| 23. Refer & Earn | ✅ Completed | `ReferralService` | `getReferralStats` |
| 24. Loyalty Rewards | ✅ Completed | `LoyaltyService` | `getLoyaltyPoints`, `getTransactions` |
| 25. Technician Profile | ✅ Completed | `TechnicianService` | `getTechnicianById` |
| 26. Review Submission | ✅ Completed | `ReviewService` | `submitReview` |
| 27. Service Reviews | ✅ Completed | `ReviewService` | `getReviews` |
| 28. Invoice Detail | ✅ Completed | `PaymentService` | `getInvoiceById` |
| 29. AMC Dashboard | ✅ Completed | `AMCService` | `getSubscription` |
| 30. Notification Prefs | ✅ Completed | `NotificationService` | `getPreferences`, `updatePreferences` |

## Batch 4 Priority Screens (Completed)

| Screen | Status | API Service | Methods Used |
| :--- | :--- | :--- | :--- |
| 31. AMC Visit Detail | ✅ Completed | `AMCService` | `getVisitDetail` |
| 32. Service Report | ✅ Completed | `BookingService` | `getServiceReport` |
| 33. About Us | ✅ Completed | `ContentService` | `getAboutContent` |
| 34. Legal Content | ✅ Completed | `ContentService` | `getLegalContent` |
| 35. Delete Account | ✅ Completed | `AuthService` | `deleteAccount` |
| 36. Blog List | ✅ Completed | `ContentService` | `getBlogs` |
| 37. Blog Detail | ✅ Completed | `ContentService` | `getBlogById` |
| 38. Emergency Booking | ✅ Completed | `BookingService` | `createEmergencyBooking` |
| 39. Estimate Approval | ✅ Completed | `BookingService` | `approveEstimate` |
| 40. Receipt View | ✅ Completed | `PaymentService` | `getReceipt` |

## Batch 5: Support, Settings & Utilities (Completed)

| Screen | Status | API Service | Methods Used |
| :--- | :--- | :--- | :--- |
| 41. Raise Ticket | ✅ Completed | `SupportService` | `createTicket` |
| 42. Contact Support | ✅ Completed | `SupportService` | `createTicket` |
| 43. Change Password | ✅ Completed | `AuthService` | `changePassword` |
| 44. Forgot Password | ✅ Completed | `AuthService` | `resetPassword` |
| 45. Reschedule Booking | ✅ Completed | `BookingService` | `rescheduleBooking` |
| 46. Payment Gateway | ✅ Completed | `PaymentService` | `processPayment` |
| 47. App Rating Prompt | ✅ Completed | `ContentService` | `submitAppFeedback` |
| 48. Permissions Mgmt | ✅ Completed | `AuthService` | `updateProfile` |
| 49. Changelog | ✅ Completed | `ContentService` | `getChangelog` |
| 50. Booking Drafts | ✅ Completed | `BookingService` | `getDrafts` |

## Batch 6: Final Polish & Remaining Screens (Completed)

| Screen | Status | API Service | Methods Used |
| :--- | :--- | :--- | :--- |
| 51. Search | ✅ Completed | `CatalogService` | `searchServices` |
| 52. Loyalty Rewards | ✅ Completed | `LoyaltyService` | `getLoyaltyPoints`, `getTransactions` |
| 53. Promotional Offers | ✅ Completed | `OfferService` | `getOffers` |
| 54. Notification Prefs | ✅ Completed | `NotificationService` | `getPreferences`, `updatePreferences` |
| 55. Add/Edit Address | ✅ Completed | `AddressService` | `saveAddress` |
| 56. Add/Edit Equipment | ✅ Completed | `EquipmentService` | `saveEquipment` |
| 57. Technician Profile | ✅ Completed | `TechnicianService` | `getTechnicianById` |
| 58. Ticket Detail | ✅ Completed | `SupportService` | `getTicketById`, `addMessage` |
| 59. Support Tickets List | ✅ Completed | `SupportService` | `getTickets` |
| 60. Invoice Detail | ✅ Completed | `PaymentService` | `getInvoiceById` |

## Demo/Mock Mode Support

The application includes a centralized demo/mock mode switch to allow full exploration without a live backend.

### Global Configuration
- **Source of Truth:** `src/config/apiConfig.ts`
- **Flag:** `IS_MOCK` (boolean)

### Mock Mode Behavior (`IS_MOCK = true`)
- **Authentication:**
  - Login accepts any phone number and any 4-digit OTP.
  - Returns a persistent demo user session.
  - Google Login is simulated with mock profile data.
- **Data Services:**
  - All services (`Booking`, `Catalog`, `Payment`, etc.) return high-quality dummy data.
  - CRUD operations (saving addresses, adding equipment, raising tickets) are simulated with success responses.
  - Real-time listeners (`onSnapshot`) are simulated or use local mock state.
- **Navigation:**
  - No blocked routes or mandatory backend dependencies.
  - All modules (AMC, Loyalty, Invoices, Support) are fully accessible.

### Live Mode Behavior (`IS_MOCK = false`)
- **Authentication:** Uses real Firebase Auth (Google) and prepared REST endpoints.
- **Data Services:** All calls are routed to the `BASE_URL` defined in `apiConfig.ts` via `apiClient`.
- **Security:** Real security rules and token validation are enforced.

## API Details

### AuthService
- **`loginWithGoogle()`**
  - **Request:** Google Auth Popup
  - **Response:** `UserProfile` object
  - **Firestore:** `users/{uid}`
- **`updateProfile(uid, data)`**
  - **Request:** `{ name?: string, phone?: string }`
  - **Response:** `void`
  - **Firestore:** `users/{uid}` (Update)

### BookingService
- **`createBooking(data)`**
  - **Request:** `BookingData` object
  - **Response:** `void`
  - **Firestore:** `jobs/` (Add)
- **`getLiveJobs(userId, callback)`**
  - **Request:** `userId`
  - **Response:** Real-time stream of `Job[]`
  - **Firestore:** `jobs` (Query where `userId == userId`)
- **`onBookingUpdate(jobId, callback)`**
  - **Request:** `jobId`
  - **Response:** Real-time stream of `Job`
  - **Firestore:** `jobs/{jobId}`

### CatalogService
- **`getServices()`**
  - **Request:** None
  - **Response:** `Service[]` (Currently Mock)
- **`getServiceById(id)`**
  - **Request:** `id`
  - **Response:** `Service` (Currently Mock)

### AMCService
- **`getPlans()`**
  - **Request:** None
  - **Response:** `AMCPlan[]`
- **`getPlanById(id)`**
  - **Request:** `id`
  - **Response:** `AMCPlan`

### AddressService
- **`getAddresses(userId)`**
  - **Request:** `userId`
  - **Response:** `Address[]`
- **`saveAddress(userId, data)`**
  - **Request:** `Address` object
  - **Response:** `void`

### EquipmentService
- **`getEquipment(userId)`**
  - **Request:** `userId`
  - **Response:** `Equipment[]`
- **`saveEquipment(userId, data)`**
  - **Request:** `Equipment` object
  - **Response:** `void`

### NotificationService
- **`onNotificationsUpdate(userId, callback)`**
  - **Request:** `userId`
  - **Response:** Real-time stream of `Notification[]`

### PaymentService
- **`getInvoices(userId)`**
  - **Request:** `userId`
  - **Response:** `Invoice[]`

### SupportService
- **`getTickets(userId)`**
  - **Request:** `userId`
  - **Response:** `SupportTicket[]`
- **`onTicketUpdate(id, callback)`**
  - **Request:** `id`
  - **Response:** Real-time stream of `SupportTicket`

### OfferService
- **`getOffers()`**
  - **Request:** None
  - **Response:** `Offer[]`
- **`validateCoupon(code)`**
  - **Request:** `code`
  - **Response:** `Offer`

### ReferralService
- **`getReferralStats(userId)`**
  - **Request:** `userId`
  - **Response:** `ReferralStats`

### LoyaltyService
- **`getLoyaltyPoints(userId)`**
  - **Request:** `userId`
  - **Response:** `LoyaltyPoints`
- **`getTransactions(userId)`**
  - **Request:** `userId`
  - **Response:** `LoyaltyTransaction[]`

### TechnicianService
- **`getTechnicianById(id)`**
  - **Request:** `id`
  - **Response:** `Technician`

### ReviewService
- **`getReviews(serviceType?)`**
  - **Request:** `serviceType` (optional)
  - **Response:** `Review[]`
- **`submitReview(userId, review)`**
  - **Request:** `userId`, `Review` object
  - **Response:** `void`

## Next Steps
- [ ] Implement real backend APIs for `CatalogService`.
- [ ] Implement real OTP verification in `AuthService`.
- [ ] Final end-to-end testing of all 60 screens.
