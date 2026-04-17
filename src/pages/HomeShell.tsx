import { BookingService } from '@/services/bookingService';
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Calendar, 
  Briefcase, 
  User, 
  Bell, 
  Search, 
  Star, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ChevronRight,
  Phone,
  Info,
  BookOpen,
  Award,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Wrench,
  Droplets,
  PlusCircle,
  Gauge,
  Wind
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookingStore } from '@/store/useBookingStore';
import AccessRequestPrompt from '@/components/auth/AccessRequestPrompt';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/App';
import MyJobs from '@/pages/MyJobs';
import EquipmentList from '@/pages/EquipmentList';
import AMCDashboard from '@/pages/AMCDashboard';
import Invoices from '@/pages/Invoices';
import SupportTickets from '@/pages/SupportTickets';
import Profile from '@/pages/Profile';
import Addresses from '@/pages/Addresses';
import NotificationPreferences from '@/pages/NotificationPreferences';
import LoyaltyRewards from '@/pages/LoyaltyRewards';
import PromotionalOffers from '@/pages/PromotionalOffers';
import NotificationCentre from '@/pages/NotificationCentre';
import PermissionsManagement from '@/pages/PermissionsManagement';
import Changelog from '@/pages/Changelog';
import { 
  SERVICES, 
  AMC_PLANS, 
  REVIEWS, 
  ARTICLES,
  JOBS,
  USER_AMC,
  TECHNICIANS,
  INVOICES,
  SUPPORT_TICKETS
} from '@/lib/mockData';
import { FEATURE_FLAGS } from '@/config/apiConfig';
import { 
  MessageSquare, 
  Crown, 
  FileText, 
  LogOut, 
  CreditCard, 
  Heart, 
  Shield, 
  Lock,
  Trophy,
  Tag,
  Sparkles
} from 'lucide-react';

// --- Home Tab Components ---

const SectionHeader = ({ title, actionLabel, onAction }: { title: string, actionLabel?: string, onAction?: () => void }) => (
  <div className="flex items-center justify-between mb-4 px-6">
    <h2 className="text-xl font-display font-bold text-navy">{title}</h2>
    {actionLabel && (
      <button onClick={onAction} className="text-gold text-xs font-bold uppercase tracking-widest flex items-center gap-1">
        {actionLabel}
      </button>
    )}
  </div>
);

const getServiceIcon = (category: string) => {
  switch (category) {
    case 'Repair': return Wrench;
    case 'Cleaning': return Droplets;
    case 'Installation': return PlusCircle;
    case 'Gas Refill': return Gauge;
    case 'AMC': return ShieldCheck;
    default: return Zap;
  }
};

const getIconByServiceName = (serviceName: string) => {
  const service = SERVICES.find(s => s.name === serviceName);
  return getServiceIcon(service?.category || '');
};

const HomeTab = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const amc = USER_AMC;

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const unsubscribe = BookingService.getLiveJobs(user.uid, (jobs) => {
      setActiveJobs(jobs.filter((j: any) => !['Completed', 'Cancelled'].includes(j.status)));
      setRecentJobs(jobs.filter((j: any) => j.status === 'Completed').slice(0, 2));
    });

    return () => unsubscribe();
  }, [isAuthenticated, user]);

  const activeJob = activeJobs[0];

  if (!isAuthenticated) {
    return (
      <div className="px-6 pt-2 pb-20 space-y-8">
        {/* Hero Section for Guests */}
        <section className="relative overflow-hidden rounded-[32px] bg-navy p-8 text-warm-white">
          <div className="relative z-10">
            <Badge className="bg-gold text-navy border-none mb-4 font-bold uppercase tracking-widest text-[10px]">Premium Care</Badge>
            <h1 className="text-3xl font-display font-bold text-gold mb-4 leading-tight">Expert AC Solutions for Your Home</h1>
            <p className="text-warm-white/60 text-sm mb-8 leading-relaxed max-w-[240px]">
              Certified technicians, transparent pricing, and 90-minute response time.
            </p>
            <Button 
              className="h-14 rounded-2xl bg-gold text-navy hover:bg-gold/90 font-bold px-8"
              onClick={() => navigate('/app/book')}
            >
              Book Now
            </Button>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
          <Wind className="absolute top-10 right-10 w-24 h-24 text-gold/5" />
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-display font-bold text-navy">Our Services</h2>
            <button 
              onClick={() => navigate('/services')}
              className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {SERVICES.slice(0, 4).map((service) => {
              const Icon = getServiceIcon(service.category);
              return (
                <motion.button
                  key={service.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/service/${service.id}`)}
                  className="p-8 rounded-[40px] bg-white border border-navy/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6 text-left group transition-all hover:shadow-xl hover:shadow-navy/5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/20 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-navy text-base leading-tight">{service.name}</p>
                    <p className="text-[10px] text-navy/30 font-bold uppercase tracking-widest mt-2">From ₹{service.price}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section className="bg-gold/5 rounded-[40px] p-10 border border-gold/10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40">AMC Membership</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-navy mb-3 leading-tight">Vento Protection Plan</h3>
            <p className="text-navy/50 text-sm mb-8 leading-relaxed">
              Enjoy priority support, 4 free services, and 20% discount on all spare parts.
            </p>
            <Button 
              variant="outline"
              className="w-full h-14 rounded-2xl border-navy/10 text-navy hover:bg-navy hover:text-gold font-bold transition-all"
              onClick={() => navigate('/amc-plans')}
            >
              Explore Plans
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="px-6 pt-2 pb-20 space-y-6">
      {/* Active Job Card */}
        {activeJob && (
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Active Service</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Live Tracking</span>
              </div>
            </div>
            <div className="bg-white rounded-[40px] p-8 border-2 border-gold shadow-xl shadow-gold/5 relative overflow-hidden group"
              onClick={() => navigate(`/job-tracker/${activeJob.id}`)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                    {React.createElement(getIconByServiceName(activeJob.serviceType), { className: "w-7 h-7" })}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">{activeJob.srNumber}</p>
                    <h4 className="text-xl font-display font-bold text-navy">{activeJob.serviceType}</h4>
                  </div>
                </div>
                <Badge className="bg-navy text-gold border-none font-bold uppercase tracking-widest text-[10px]">
                  {activeJob.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-navy/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center text-navy/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-navy/60">Arriving in 20m</span>
                </div>
                <Button className="h-12 rounded-xl bg-navy text-gold font-bold px-6 group-hover:bg-navy/90 transition-colors">
                  Track Job
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions Grid */}
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Book', path: '/book', icon: PlusCircle, color: 'bg-gold/10 text-gold shadow-sm' },
              { label: 'Jobs', path: '/app/jobs', icon: Briefcase, color: 'bg-navy/5 text-navy/40' },
              { label: 'Units', path: '/app/equipment', icon: Wind, color: 'bg-navy/5 text-navy/40' },
              { label: 'Help', path: '/contact', icon: MessageSquare, color: 'bg-navy/5 text-navy/40' },
            ].map((action, i) => (
              <button 
                key={i}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-3 group"
              >
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex items-center justify-center transition-all group-active:scale-95",
                  action.color
                )}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* AMC Status Card */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40">AMC Membership</h3>
            <button onClick={() => navigate('/app/amc')} className="text-[10px] font-bold uppercase tracking-widest text-gold">Manage</button>
          </div>
          <div className="bg-navy rounded-[40px] p-8 text-warm-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-display font-bold text-gold">{amc.planName}</h4>
                  <p className="text-warm-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Valid until {amc.endDate}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-warm-white/40">
                  <span>Visit Progress</span>
                  <span>{amc.visitsUsed} / {amc.totalVisits} Used</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold w-1/4" />
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Recent Bookings Teaser */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Recent Bookings</h3>
            <button onClick={() => navigate('/app/jobs')} className="text-[10px] font-bold uppercase tracking-widest text-gold">View All</button>
          </div>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-white rounded-3xl p-5 border border-navy/5 flex items-center justify-between group active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/booking-detail/${job.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-bold text-navy text-sm">{job.serviceType}</p>
                    <p className="text-[10px] text-navy/40 font-medium uppercase tracking-widest mt-0.5">{job.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
    </div>
  );
};
// --- Other Tab Placeholders ---

const BookTab = () => {
  const navigate = useNavigate();
  const { updateBooking, setStep, isDraft, resetBooking } = useBookingStore();
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    if (isDraft) {
      setShowResume(true);
    }
  }, [isDraft]);

  const handleQuickStart = (serviceId: string) => {
    resetBooking();
    updateBooking({ serviceId, subServiceId: 'General Checkup' });
    setStep(2); // Start from equipment details
    navigate('/book');
  };

  const handleResume = () => {
    setShowResume(false);
    navigate('/book');
  };

  const handleStartFresh = () => {
    resetBooking();
    setShowResume(false);
  };

  return (
    <div className="px-6 pt-2 pb-20 space-y-6">
      <h1 className="text-2xl font-display font-bold text-navy mb-1">Book a Service</h1>
      <p className="text-navy/60 text-xs mb-6">Select a category to start your booking.</p>
      
      <div className="grid grid-cols-2 gap-4">
        {SERVICES.map((service) => {
          const Icon = getServiceIcon(service.category);
          return (
            <motion.button
              key={service.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickStart(service.id)}
              className="p-6 rounded-[32px] bg-white border border-navy/5 shadow-sm flex flex-col gap-4 text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/40 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-navy text-sm">{service.name}</p>
                <p className="text-[10px] text-navy/40 font-medium mt-0.5">Starting ₹{service.price}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <Button 
        variant="ghost" 
        className="w-full mt-8 text-gold font-bold gap-2"
        onClick={() => navigate('/services')}
      >
        View All Services <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Resume Draft Bottom Sheet */}
      <AnimatePresence>
        {showResume && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-navy/80 backdrop-blur-sm flex items-end"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-white rounded-t-[40px] p-8 pb-12"
            >
              <div className="w-12 h-1.5 bg-navy/5 rounded-full mx-auto mb-8" />
              <h2 className="text-2xl font-display font-bold text-navy mb-2">Continue Booking?</h2>
              <p className="text-navy/60 text-sm mb-8">You have an incomplete booking. Would you like to continue or start fresh?</p>
              <div className="space-y-3">
                <Button 
                  className="w-full h-14 rounded-2xl bg-navy text-gold font-bold"
                  onClick={handleResume}
                >
                  Continue Booking
                </Button>
                <Button 
                  variant="ghost"
                  className="w-full h-14 rounded-2xl text-navy/40 font-bold"
                  onClick={handleStartFresh}
                >
                  Start Fresh
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JobsTab = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 pb-32 text-center">
        <div className="w-24 h-24 bg-navy/5 rounded-full flex items-center justify-center mb-6">
          <Briefcase className="w-10 h-10 text-navy/20" />
        </div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">Track Your Jobs</h2>
        <p className="text-navy/60 text-sm mb-8">Log in to view your active and past service bookings.</p>
        <Button 
          className="w-full h-14 rounded-2xl bg-gold text-navy font-bold text-lg"
          onClick={() => navigate('/login')}
        >
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-2 pb-20 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-display font-bold text-navy mb-1">My Bookings</h1>
        <p className="text-navy/60 text-xs">Track and manage your service requests.</p>
      </div>

      <div className="space-y-4">
        {JOBS.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm group active:scale-[0.98] transition-transform"
            onClick={() => navigate(`/booking-detail/${job.id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40">
                  {job.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">{job.srNumber}</p>
                  <h3 className="font-bold text-navy">{job.serviceType}</h3>
                </div>
              </div>
              <Badge className={cn(
                "border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1",
                job.status === 'Completed' ? "bg-green-50 text-green-600" : "bg-gold/10 text-gold"
              )}>
                {job.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-navy/5">
              <div className="flex items-center gap-2 text-navy/60">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">{job.date}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-navy/20 group-hover:text-gold transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


const AccountTab = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const unreadTickets = SUPPORT_TICKETS.filter(t => t.status === 'In Progress').length; // Mocking unread as In Progress

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 pb-32 text-center">
        <div className="w-24 h-24 bg-navy/5 rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-navy/20" />
        </div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">Your Profile</h2>
        <p className="text-navy/60 text-sm mb-8">Log in to manage your account, addresses, and AMC plans.</p>
        <Button 
          className="w-full h-14 rounded-2xl bg-gold text-navy font-bold text-lg"
          onClick={() => navigate('/login')}
        >
          Log In
        </Button>
      </div>
    );
  }

  const menuItems = [
    { icon: MessageSquare, label: 'My Support', path: '/app/support', badge: unreadTickets > 0 ? unreadTickets : null },
    ...(FEATURE_FLAGS.SHOW_SPECIAL_OFFERS ? [{ icon: Tag, label: 'Special Offers', path: '/app/offers' }] : []),
    ...(FEATURE_FLAGS.SHOW_LOYALTY_REWARDS ? [{ icon: Trophy, label: 'Loyalty Rewards', path: '/app/rewards' }] : []),
    ...(FEATURE_FLAGS.SHOW_REFER_FRIEND ? [{ icon: Heart, label: 'Refer a Friend', path: '/app/refer' }] : []),
    { icon: User, label: 'My Profile', path: '/app/profile-settings' },
    { icon: MapPin, label: 'My Addresses', path: '/app/addresses' },
    { icon: Bell, label: 'Notification Preferences', path: '/app/notification-preferences' },
    ...(FEATURE_FLAGS.SHOW_APP_PERMISSIONS ? [{ icon: ShieldCheck, label: 'App Permissions', path: '/app/permissions' }] : []),
    ...(FEATURE_FLAGS.SHOW_WHATS_NEW ? [{ icon: Sparkles, label: "What's New", path: '/app/changelog' }] : []),
    { icon: Shield, label: 'Privacy Policy', path: '/app/privacy' },
    { icon: Lock, label: 'Terms & Conditions', path: '/app/terms' },
  ];

  return (
    <div className="px-6 pt-2 pb-20 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-display font-bold text-navy mb-1">My Account</h1>
        <p className="text-navy/60 text-xs">Manage your profile and preferences.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-navy rounded-[32px] p-6 text-warm-white relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center overflow-hidden">
            <img src={`https://i.pravatar.cc/150?u=${user?.email}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-gold">{user?.name}</h2>
            <p className="text-warm-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">{user?.membershipStatus} Member</p>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Stats Row */}
      <div className={cn(
        "bg-white rounded-3xl p-6 border border-navy/5 shadow-sm grid gap-4",
        FEATURE_FLAGS.SHOW_LOYALTY_REWARDS ? "grid-cols-3" : "grid-cols-2"
      )}>
        <div className="text-center">
          <p className="text-xl font-display font-bold text-navy">{JOBS.length}</p>
          <p className="text-[8px] font-bold uppercase tracking-widest text-navy/40 mt-1">Total Jobs</p>
        </div>
        <div className={cn(
          "text-center",
          FEATURE_FLAGS.SHOW_LOYALTY_REWARDS ? "border-x border-navy/5" : "border-l border-navy/5"
        )}>
          <p className="text-xl font-display font-bold text-gold">Active</p>
          <p className="text-[8px] font-bold uppercase tracking-widest text-navy/40 mt-1">AMC Status</p>
        </div>
        {FEATURE_FLAGS.SHOW_LOYALTY_REWARDS && (
          <div className="text-center">
            <p className="text-xl font-display font-bold text-navy">450</p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-navy/40 mt-1">Points</p>
          </div>
        )}
      </div>

      {/* Menu List */}
      <div className="space-y-3">
        {menuItems.map((item, i) => (
          <button 
            key={i} 
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-navy/5 group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="font-bold text-navy text-sm">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.badge && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
          </button>
        ))}
        
        <Button 
          variant="ghost" 
          className="w-full mt-6 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold h-14 rounded-2xl gap-3"
          onClick={() => {
            logout();
            navigate('/auth-gate');
          }}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

const AboutTab = () => {
  return (
    <div className="px-6 pt-2 pb-20 space-y-8">
      {/* Hero Section */}
      <section className="space-y-4">
        <div className="px-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-1">The Coolzo Standard</h3>
          <h1 className="text-3xl font-display font-bold text-navy leading-tight">A New Paradigm in Home Comfort</h1>
          <p className="text-navy/60 text-xs leading-relaxed max-w-sm">
            Coolzo was founded on a simple principle: cooling should be precise, professional, and entirely headache-free.
          </p>
        </div>
        
        <div className="grid gap-4">
          <div className="bg-white rounded-[32px] p-8 border border-navy/5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-display font-bold text-navy mb-2">Certified Expertise</h4>
            <p className="text-navy/50 text-sm leading-relaxed">
              Our technicians are master-certified individuals who undergo 200+ hours of precision training and background verification.
            </p>
          </div>

          <div className="bg-navy rounded-[32px] p-8 text-warm-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-display font-bold text-gold mb-2">Technological Precision</h4>
              <p className="text-warm-white/40 text-sm leading-relaxed">
                From real-time GPS tracking to AI-assisted fault diagnosis, we use technology to deliver a superior service experience.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gold/5 rounded-[40px] p-10 border border-gold/10 text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-navy/5 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=user${i}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <p className="text-navy/60 text-sm italic font-serif px-4 leading-relaxed">
            "Coolzo transformed how we think about home comfort. The precision and digital tracking are unmatched in the current market."
          </p>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gold font-display">— Trusted by 50,000+ Homes</div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-display font-bold text-navy px-2 text-center">Our Core Philosophy</h2>
        <div className="space-y-4">
          {[
            { title: 'Reliability', desc: 'When we say 9 AM, we mean 9 AM. Our reliability is our bond.' },
            { title: 'Transparency', desc: 'Upfront pricing and clear digital receipts. No hidden surprises.' },
            { title: 'Excellence', desc: 'Good is not enough. We strive for excellence in every nut tightened.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start p-4 hover:bg-navy/[0.02] rounded-3xl transition-colors">
              <div className="text-gold font-display font-bold text-2xl leading-none">0{i+1}</div>
              <div className="space-y-1">
                <h4 className="font-bold text-navy uppercase tracking-widest text-xs">{item.title}</h4>
                <p className="text-navy/50 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Main Shell ---

const GlobalHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="sticky top-0 z-30 bg-warm-white/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <div className="flex flex-col">
        {isAuthenticated ? (
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Welcome back,</span>
            <span className="text-lg font-display font-bold text-navy leading-none">{user?.name.split(' ')[0]}</span>
          </div>
        ) : (
          <Logo className="scale-90 origin-left" />
        )}
      </div>
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <button 
            onClick={() => {
              if (location.pathname !== '/app/notifications') {
                navigate('/app/notifications');
              }
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-navy/5 text-navy relative"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-gold border-2 border-white rounded-full" />
          </button>
        )}
        <button 
          onClick={() => {
            if (location.pathname !== '/app/account') {
              navigate('/app/account');
            }
          }}
          className="px-3 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-navy/5 text-navy text-[10px] font-bold uppercase tracking-widest overflow-hidden"
        >
          {isAuthenticated && user?.email ? (
            <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            "Me"
          )}
        </button>
      </div>
    </div>
  );
};

export default function HomeShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasSeenNotificationPrompt, setHasSeenNotificationPrompt, isAuthenticated } = useAuthStore();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  const tabs = useMemo(() => [
    { icon: HomeIcon, label: 'Home', path: '/app' },
    { icon: Calendar, label: 'Book', path: '/app/book' },
    ...(isAuthenticated ? [
      { icon: Briefcase, label: 'My Jobs', path: '/app/jobs' },
      { icon: FileText, label: 'Invoices', path: '/app/invoices' }
    ] : [
      { icon: Info, label: 'About', path: '/app/about' }
    ]),
  ], [isAuthenticated]);

  // Determine active tab based on path
  const activeTab = useMemo(() => {
    const path = location.pathname;
    const index = tabs.findIndex(tab => {
      if (tab.path === '/app') return path === '/app' || path === '/app/';
      return path.startsWith(tab.path);
    });
    return index !== -1 ? index : 0;
  }, [location.pathname, tabs]);

  useEffect(() => {
    // Show notification prompt if user hasn't seen it yet
    if (!hasSeenNotificationPrompt) {
      const timer = setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenNotificationPrompt]);

  const handleNotificationClose = () => {
    setShowNotificationPrompt(false);
    setHasSeenNotificationPrompt(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      <GlobalHeader />
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Routes location={location}>
              <Route path="/" element={<HomeTab />} />
              <Route path="/book" element={<BookTab />} />
              <Route path="/about" element={<AboutTab />} />
              <Route path="/jobs" element={<JobsTab />} />
              <Route path="/account" element={<AccountTab />} />
              <Route path="/equipment" element={<ProtectedRoute><EquipmentList /></ProtectedRoute>} />
              <Route path="/amc" element={<ProtectedRoute><AMCDashboard /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><SupportTickets /></ProtectedRoute>} />
              <Route path="/profile-settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
              <Route path="/notification-preferences" element={<ProtectedRoute><NotificationPreferences /></ProtectedRoute>} />
              <Route path="/rewards" element={<ProtectedRoute><LoyaltyRewards /></ProtectedRoute>} />
              <Route path="/offers" element={<ProtectedRoute><PromotionalOffers /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationCentre /></ProtectedRoute>} />
              <Route path="/permissions" element={<ProtectedRoute><PermissionsManagement /></ProtectedRoute>} />
              <Route path="/changelog" element={<Changelog />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-navy/5 px-6 py-3 z-50">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                if (location.pathname !== tab.path && !(location.pathname === '/app/' && tab.path === '/app')) {
                  navigate(tab.path);
                }
              }}
              className="flex flex-col items-center gap-1 relative py-1 px-3 group"
            >
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                activeTab === index ? "text-gold translate-y-0 opacity-100" : "text-navy/30"
              )}>
                {tab.label}
              </span>
              {activeTab === index && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-gold rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Access Request Prompt Modal */}
      <AnimatePresence>
        {showNotificationPrompt && (
          <AccessRequestPrompt 
            onAccept={handleNotificationClose} 
            onDecline={handleNotificationClose} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
