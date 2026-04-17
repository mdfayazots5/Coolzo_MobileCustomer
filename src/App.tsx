/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Logo } from '@/components/Logo';
import { useAuthStore } from '@/store/useAuthStore';
import BookingDraftResume from '@/pages/BookingDraftResume';
import AMCEnrollmentVariant from '@/pages/AMCEnrollmentVariant';
import AppRatingPrompt from '@/pages/AppRatingPrompt';
import GuestRegistrationPrompt from '@/pages/GuestRegistrationPrompt';
import BookingDetail from '@/pages/BookingDetail';
import Reschedule from '@/pages/Reschedule';
import AMCVisitDetail from '@/pages/AMCVisitDetail';
import AMCEnrollmentUpsell from '@/pages/AMCEnrollmentUpsell';
import EquipmentDetail from '@/pages/EquipmentDetail';
import AddEditEquipment from '@/pages/AddEditEquipment';
import ReceiptView from '@/pages/ReceiptView';
import AddEditAddress from '@/pages/AddEditAddress';
import OTPScreen from '@/pages/OTPScreen';
import EmergencyBooking from '@/pages/EmergencyBooking';
import SlotUnavailable from '@/pages/SlotUnavailable';
import TechnicianProfile from '@/pages/TechnicianProfile';
import ServiceReport from '@/pages/ServiceReport';
import Splash from '@/pages/Splash';
import Onboarding from '@/pages/Onboarding';
import AuthGate from '@/pages/AuthGate';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import BrandShowcase from '@/pages/BrandShowcase';
import HomeShell from '@/pages/HomeShell';
import ServiceCatalog from '@/pages/ServiceCatalog';
import ServiceDetail from '@/pages/ServiceDetail';
import AMCPlans from '@/pages/AMCPlans';
import AMCPlanDetail from '@/pages/AMCPlanDetail';
import Reviews from '@/pages/Reviews';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import WhyCoolzo from '@/pages/WhyCoolzo';
import Contact from '@/pages/Contact';
import AboutUs from '@/pages/AboutUs';
import Search from '@/pages/Search';
import BookingWizard from '@/pages/BookingWizard';
import BookingConfirmation from '@/pages/BookingConfirmation';
import JobTracker from '@/pages/JobTracker';
import MyJobs from '@/pages/MyJobs';
import EstimateApproval from '@/pages/EstimateApproval';
import EquipmentList from '@/pages/EquipmentList';
import AMCDashboard from '@/pages/AMCDashboard';
import Invoices from '@/pages/Invoices';
import InvoiceDetail from '@/pages/InvoiceDetail';
import SupportTickets from '@/pages/SupportTickets';
import RaiseTicket from '@/pages/RaiseTicket';
import TicketDetail from '@/pages/TicketDetail';
import Profile from '@/pages/Profile';
import Addresses from '@/pages/Addresses';
import NotificationPreferences from '@/pages/NotificationPreferences';
import LegalContent from '@/pages/LegalContent';
import PaymentGateway from '@/pages/PaymentGateway';
import PaymentStatus from '@/pages/PaymentStatus';
import ChangePassword from '@/pages/ChangePassword';
import DeleteAccount from '@/pages/DeleteAccount';
import ReviewSubmission from '@/pages/ReviewSubmission';
import ReferFriend from '@/pages/ReferFriend';
import LoyaltyRewards from '@/pages/LoyaltyRewards';
import PromotionalOffers from '@/pages/PromotionalOffers';
import NotificationCentre from '@/pages/NotificationCentre';
import PermissionsManagement from '@/pages/PermissionsManagement';
import Changelog from '@/pages/Changelog';
import ErrorScreen from '@/pages/ErrorScreen';
import NetworkStatusBanner from '@/components/NetworkStatusBanner';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth-gate" replace />;
  return <>{children}</>;
};

export default function App() {
  const { isAuthReady, initialize } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Logo variant="white" iconOnly className="animate-pulse scale-150" />
          <div className="w-12 h-1 border-2 border-gold/20 rounded-full overflow-hidden">
            <div className="h-full bg-gold animate-loading-bar" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <NetworkStatusBanner />
      <div className="min-h-screen bg-warm-white font-sans selection:bg-gold/30">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth-gate" element={<AuthGate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/brand" element={<BrandShowcase />} />
          <Route path="/otp" element={<OTPScreen />} />
          <Route path="/emergency" element={<EmergencyBooking />} />
          <Route path="/slot-unavailable" element={<SlotUnavailable />} />
          <Route path="/technician/:id" element={<TechnicianProfile />} />
          <Route path="/service-report/:id" element={<ProtectedRoute><ServiceReport /></ProtectedRoute>} />
          
          {/* Discovery Routes (Accessible to guests) */}
          <Route path="/services" element={<ServiceCatalog />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/amc-plans" element={<AMCPlans />} />
          <Route path="/amc-plan/:id" element={<AMCPlanDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/why-coolzo" element={<WhyCoolzo />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/search" element={<Search />} />
          <Route path="/book" element={<BookingWizard />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/job-tracker/:id" element={<ProtectedRoute><JobTracker /></ProtectedRoute>} />
          <Route path="/estimate-approval/:id" element={<ProtectedRoute><EstimateApproval /></ProtectedRoute>} />
          
          <Route path="/app/equipment/:id" element={<ProtectedRoute><EquipmentDetail /></ProtectedRoute>} />
          <Route path="/app/equipment/new" element={<ProtectedRoute><AddEditEquipment /></ProtectedRoute>} />
          <Route path="/app/equipment/edit/:id" element={<ProtectedRoute><AddEditEquipment /></ProtectedRoute>} />
          <Route path="/app/amc/visit/:id" element={<ProtectedRoute><AMCVisitDetail /></ProtectedRoute>} />
          <Route path="/app/amc/upsell" element={<ProtectedRoute><AMCEnrollmentUpsell /></ProtectedRoute>} />
          <Route path="/app/booking-detail/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
          <Route path="/app/reschedule/:id" element={<ProtectedRoute><Reschedule /></ProtectedRoute>} />
          <Route path="/app/receipt/:id" element={<ProtectedRoute><ReceiptView /></ProtectedRoute>} />
          <Route path="/app/addresses/new" element={<ProtectedRoute><AddEditAddress /></ProtectedRoute>} />
          <Route path="/app/addresses/edit/:id" element={<ProtectedRoute><AddEditAddress /></ProtectedRoute>} />
          <Route path="/app/rating" element={<AppRatingPrompt />} />
          <Route path="/guest-prompt" element={<GuestRegistrationPrompt />} />
          <Route path="/booking-resume" element={<BookingDraftResume />} />
          <Route path="/amc-enrollment" element={<AMCEnrollmentVariant />} />
          <Route path="/app/invoice/:id" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
          <Route path="/app/support/new" element={<ProtectedRoute><RaiseTicket /></ProtectedRoute>} />
          <Route path="/app/support/:id" element={<ProtectedRoute><TicketDetail /></ProtectedRoute>} />
          <Route path="/app/privacy" element={<LegalContent />} />
          <Route path="/app/terms" element={<LegalContent />} />
          <Route path="/app/payment/:id" element={<ProtectedRoute><PaymentGateway /></ProtectedRoute>} />
          <Route path="/app/payment-status/:status/:id" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
          <Route path="/app/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/app/delete-account" element={<ProtectedRoute><DeleteAccount /></ProtectedRoute>} />
          <Route path="/app/review/:id" element={<ProtectedRoute><ReviewSubmission /></ProtectedRoute>} />
          <Route path="/app/refer" element={<ProtectedRoute><ReferFriend /></ProtectedRoute>} />
          <Route path="/app/rewards" element={<ProtectedRoute><LoyaltyRewards /></ProtectedRoute>} />
          <Route path="/app/offers" element={<ProtectedRoute><PromotionalOffers /></ProtectedRoute>} />
          <Route path="/app/notifications" element={<ProtectedRoute><NotificationCentre /></ProtectedRoute>} />
          <Route path="/app/permissions" element={<ProtectedRoute><PermissionsManagement /></ProtectedRoute>} />
          <Route path="/app/changelog" element={<Changelog />} />
          <Route path="/app/error" element={<ErrorScreen />} />
          <Route path="/app/maintenance" element={<ErrorScreen type="maintenance" />} />
          {/* Home Shell (Layout with Footer) */}
          <Route
            path="/app/*"
            element={<HomeShell />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  );
}

