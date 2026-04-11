import { BookingService } from '@/services/bookingService';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookingStore } from '@/store/useBookingStore';
import NotificationPrompt from '@/components/auth/NotificationPrompt';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        <ChevronRight className="w-3 h-3" />
      </button>
    )}
  </div>
);

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
      <div className="pb-24">
        {/* App Bar */}
        <div className="sticky top-0 z-30 bg-warm-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-display font-bold text-navy tracking-tight">COOLZO</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/app/notifications')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-navy/5 text-navy relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-gold rounded-full border-2 border-white" />
            </button>
            <button 
              onClick={() => navigate('/search')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-navy/5 text-navy"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-8 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-navy">Expert AC Services</h2>
              <Button variant="ghost" className="text-gold font-bold text-xs uppercase tracking-widest" onClick={() => navigate('/services')}>View All</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {SERVICES.slice(0, 4).map((service) => (
                <motion.button
                  key={service.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/service/${service.id}`)}
                  className="p-6 rounded-[32px] bg-white border border-navy/5 shadow-sm flex flex-col gap-4 text-left group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/40 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{service.name}</p>
                    <p className="text-[10px] text-navy/40 font-medium mt-0.5">Starting ₹{service.price}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          <section className="bg-navy rounded-[40px] p-8 text-warm-white relative overflow-hidden">
            <div className="relative z-10">
              <Badge className="bg-gold text-navy border-none mb-4 font-bold">ANNUAL PLANS</Badge>
              <h3 className="text-2xl font-display font-bold text-gold mb-2 leading-tight">Coolzo Protection</h3>
              <p className="text-warm-white/60 text-sm mb-6 leading-relaxed">
                Get 4 services a year, priority support, and 20% off on parts.
              </p>
              <Button 
                className="w-full h-14 rounded-2xl bg-gold text-navy hover:bg-gold/90 font-bold"
                onClick={() => navigate('/amc-plans')}
              >
                Compare Plans
              </Button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* App Bar */}
      <div className="sticky top-0 z-30 bg-warm-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Welcome back,</span>
          <span className="text-xl font-display font-bold text-navy">{user?.name.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/search')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-navy/5 text-navy"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/app/notifications')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-navy/5 text-navy relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-gold rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      <div className="px-6 py-8 space-y-10">
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
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[40px] p-8 border-2 border-gold shadow-xl shadow-gold/5 relative overflow-hidden group"
              onClick={() => navigate(`/job-tracker/${activeJob.id}`)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                    <Zap className="w-7 h-7" />
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
            </motion.div>
          </section>
        )}

        {/* Quick Actions Grid */}
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Book', icon: Zap, path: '/book', color: 'bg-gold/10 text-gold' },
              { label: 'Jobs', icon: Calendar, path: '/app/jobs', color: 'bg-navy/5 text-navy/40' },
              { label: 'Units', icon: ShieldCheck, path: '/app/equipment', color: 'bg-navy/5 text-navy/40' },
              { label: 'Help', icon: MessageSquare, path: '/contact', color: 'bg-navy/5 text-navy/40' },
            ].map((action, i) => (
              <button 
                key={i}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-3 group"
              >
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex items-center justify-center transition-all group-active:scale-90",
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
                <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold">
                  <Crown className="w-6 h-6" />
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
                  <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{job.serviceType}</p>
                    <p className="text-[10px] text-navy/40 font-medium uppercase tracking-widest mt-0.5">{job.date}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-navy/20 group-hover:text-gold transition-colors" />
              </div>
            ))}
          </div>
        </section>
      </div>
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
    <div className="px-6 py-8">
      <h1 className="text-2xl font-display font-bold text-navy mb-2">Book a Service</h1>
      <p className="text-navy/60 text-sm mb-8">Select a category to start your booking.</p>
      
      <div className="grid grid-cols-2 gap-4">
        {SERVICES.map((service) => (
          <motion.button
            key={service.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickStart(service.id)}
            className="p-6 rounded-[32px] bg-white border border-navy/5 shadow-sm flex flex-col gap-4 text-left group"
          >
            <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/40 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-navy text-sm">{service.name}</p>
              <p className="text-[10px] text-navy/40 font-medium mt-0.5">Starting ₹{service.price}</p>
            </div>
          </motion.button>
        ))}
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
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
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
    <div className="px-6 py-8">
      <h1 className="text-2xl font-display font-bold text-navy mb-8">My Jobs</h1>
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-3xl border-2 border-gold shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <Badge className="bg-gold text-navy border-none font-bold">In Progress</Badge>
            <span className="text-[10px] font-bold text-navy/40 uppercase">#CZ-8821</span>
          </div>
          <h3 className="font-bold text-navy mb-1">Deep Jet Cleaning</h3>
          <p className="text-xs text-navy/60 mb-4">Scheduled for Today, 12:45 PM</p>
          <Button className="w-full bg-navy text-gold rounded-xl font-bold">Track Technician</Button>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-navy/5 shadow-sm opacity-60">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="secondary" className="bg-navy/5 text-navy/40 border-none font-bold">Completed</Badge>
            <span className="text-[10px] font-bold text-navy/40 uppercase">#CZ-7712</span>
          </div>
          <h3 className="font-bold text-navy mb-1">Split AC Repair</h3>
          <p className="text-xs text-navy/60">June 12, 2023</p>
        </div>
      </div>
    </div>
  );
};

const AccountTab = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const overdueInvoices = INVOICES.filter(inv => inv.status === 'Overdue').length;
  const unreadTickets = SUPPORT_TICKETS.filter(t => t.status === 'In Progress').length; // Mocking unread as In Progress

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
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
    { icon: FileText, label: 'My Invoices', path: '/app/invoices', badge: overdueInvoices > 0 ? overdueInvoices : null },
    { icon: MessageSquare, label: 'My Support', path: '/app/support', badge: unreadTickets > 0 ? unreadTickets : null },
    { icon: Tag, label: 'Special Offers', path: '/app/offers' },
    { icon: Trophy, label: 'Loyalty Rewards', path: '/app/rewards' },
    { icon: Heart, label: 'Refer a Friend', path: '/app/refer' },
    { icon: User, label: 'My Profile', path: '/app/profile-settings' },
    { icon: MapPin, label: 'My Addresses', path: '/app/addresses' },
    { icon: Bell, label: 'Notification Preferences', path: '/app/notification-preferences' },
    { icon: ShieldCheck, label: 'App Permissions', path: '/app/permissions' },
    { icon: Sparkles, label: "What's New", path: '/app/changelog' },
    { icon: Shield, label: 'Privacy Policy', path: '/app/privacy' },
    { icon: Lock, label: 'Terms & Conditions', path: '/app/terms' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Profile Header */}
      <div className="px-6 py-10 bg-navy text-warm-white rounded-b-[40px] relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 rounded-[28px] bg-gold/20 border-2 border-gold/30 flex items-center justify-center overflow-hidden">
            <img src={`https://i.pravatar.cc/150?u=${user?.email}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gold">{user?.name}</h1>
            <p className="text-warm-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Member since Jan 2024</p>
            <Badge className="mt-3 bg-gold/10 text-gold border-none font-bold text-[10px] uppercase tracking-widest">
              {user?.membershipStatus} Member
            </Badge>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
      </div>

      {/* Stats Row */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 border border-navy/5 shadow-xl shadow-navy/5 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xl font-display font-bold text-navy">{JOBS.length}</p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-navy/40 mt-1">Total Jobs</p>
          </div>
          <div className="text-center border-x border-navy/5">
            <p className="text-xl font-display font-bold text-gold">Active</p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-navy/40 mt-1">AMC Status</p>
          </div>
          <div 
            className="text-center cursor-pointer active:scale-95 transition-transform"
            onClick={() => navigate('/app/rewards')}
          >
            <p className="text-xl font-display font-bold text-navy">450</p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-navy/40 mt-1">Points</p>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-6 py-10 space-y-3">
        {menuItems.map((item, i) => (
          <button 
            key={i} 
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-navy/5 group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-navy text-sm">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.badge && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-navy/20 group-hover:text-gold transition-colors" />
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

// --- Main Shell ---

export default function HomeShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasSeenNotificationPrompt, setHasSeenNotificationPrompt } = useAuthStore();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  // Determine active tab based on path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/app/book')) return 1;
    if (path.includes('/app/jobs')) return 2;
    if (path.includes('/app/account')) return 3;
    return 0;
  };

  const activeTab = getActiveTab();

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

  const overdueInvoices = INVOICES.filter(inv => inv.status === 'Overdue').length;
  const unreadTickets = SUPPORT_TICKETS.filter(t => t.status === 'In Progress').length;
  const totalBadgeCount = overdueInvoices + unreadTickets;

  const tabs = [
    { icon: HomeIcon, label: 'Home', path: '/app' },
    { icon: Calendar, label: 'Book', path: '/app/book' },
    { icon: Briefcase, label: 'My Jobs', path: '/app/jobs' },
    { icon: User, label: 'Account', path: '/app/account', badge: totalBadgeCount > 0 ? totalBadgeCount : null },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<HomeTab />} />
              <Route path="/book" element={<BookTab />} />
              <Route path="/jobs" element={<JobsTab />} />
              <Route path="/account" element={<AccountTab />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-navy/5 px-6 py-3 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 relative py-1 px-3 group"
            >
              <div className={cn(
                "transition-all duration-300 relative",
                activeTab === index ? "text-gold -translate-y-1" : "text-navy/30"
              )}>
                <tab.icon className={cn("w-6 h-6", activeTab === index && "fill-gold/20")} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                activeTab === index ? "text-navy opacity-100" : "text-navy/30 opacity-0"
              )}>
                {tab.label}
              </span>
              {activeTab === index && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-1 w-1 h-1 bg-gold rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Prompt Modal */}
      <AnimatePresence>
        {showNotificationPrompt && (
          <NotificationPrompt 
            onAccept={handleNotificationClose} 
            onDecline={handleNotificationClose} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
