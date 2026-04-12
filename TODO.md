# Coolzo Customer App: React → Flutter Migration TODO

## Current Status
- [x] Flutter starter structure exists (basic auth/home)
- [ ] Full page migration (40+ pages from src/)
- React src/ kept as reference (no deletion)

## Phase 1: Auth Flow (Priority: High)
- [x] Created lib/pages/auth/ directory + files
- [x] Migrated SplashScreen (lib/pages/auth/splash.dart)
- [x] Migrated Login + OTP (lib/pages/auth/login.dart, otp.dart)
- [ ] Enhance auth_provider.dart with Firebase integration (mock → real)
- [ ] Test auth flow: flutter run

## Phase 2: Core Navigation + Home (Priority: High)
- [ ] Bottom navigation bar (Jobs, Invoices, Support like HomeShell.tsx)
- [ ] Migrate HomeShell → lib/pages/home_shell.dart

## Phase 3: Key Features (Priority: Medium)
- [ ] Bookings: BookingWizard, Confirmation, Tracker (10+ pages)
- [ ] AMC: Plans, Dashboard, Enrollment
- [ ] Profile/Support/Equipment/Invoices

## Phase 4: Polish + Build
- [ ] Theme/UI consistency (Material 3 matching React design)
- [ ] flutter build apk && flutter install
- [ ] Full testing on device

## Completed Steps
- [x] Step 1: Created TODO.md
- [x] Step 2: Flutter pub get
- [x] Step 3: Phase 1 Auth structure + pages + main.dart router update
