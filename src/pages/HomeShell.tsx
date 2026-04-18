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
      <div className="px-6 pt-10 pb-32 space-y-12">
        {/* Hero Section for Guests */}
        <section className="relative overflow-hidden rounded-[40px] bg-navy p-10 text-warm-white shadow-2xl shadow-navy/40 group active:scale-[0.99] transition-transform">
          <div className="relative z-10 space-y-4">
            <Badge className="bg-gold text-navy border-none mb-2 font-bold uppercase tracking-[0.3em] text-[9px] px-4 py-1.5 rounded-full">Elite Protocol</Badge>
            <h1 className="text-[32px] font-display font-bold text-gold mb-3 leading-none tracking-tighter">Superior Climate <br/>Engineering</h1>
            <p className="text-warm-white/40 text-[12px] mb-8 leading-relaxed max-w-[220px] font-bold uppercase tracking-widest">
              Master-Certified Technicians • Synchronized Response • Absolute Precision
            </p>
            <Button 
              className="h-16 rounded-[24px] bg-gold text-navy hover:bg-gold/90 font-bold px-10 text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-black/20 active:scale-95 transition-all"
              onClick={() => navigate('/app/book')}
            >
              Initiate Booking
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[80px] -mr-24 -mt-24" />
          <Wind className="absolute bottom-10 right-10 w-32 h-32 text-gold/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/20">Operational Domains</h2>
            <button 
              onClick={() => navigate('/services')}
              className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 active:scale-90 transition-transform"
            >
              Full Index <ArrowRight className="w-3.5 h-3.5" />
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
                  className="p-8 rounded-[32px] bg-white border border-navy/5 shadow-2xl shadow-black/[0.02] flex flex-col gap-6 text-left group hover:border-gold/20 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/20 group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-bold text-navy text-[16px] leading-none tracking-tight uppercase group-hover:text-gold transition-colors">{service.name}</p>
                    <p className="text-[9px] text-navy/30 font-bold uppercase tracking-[0.2em]">Floor: ₹{service.price}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        <section className="bg-gold/5 rounded-[40px] p-10 border border-gold/10 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold shadow-inner group-hover:bg-navy transition-colors duration-500">
                <Crown className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/40">VIP Subscription</span>
            </div>
            <h3 className="text-[24px] font-display font-bold text-navy mb-3 leading-none tracking-tight">Privilege Coverage Plan</h3>
            <p className="text-navy/50 text-[13px] mb-8 leading-relaxed font-medium uppercase tracking-widest max-w-[260px]">
              Synchronized diagnostics, zero-cost unit recovery, and priority vector deployment.
            </p>
            <Button 
              variant="outline"
              className="w-full h-16 rounded-[24px] border-navy/5 bg-white text-navy font-bold text-[13px] uppercase tracking-[0.2em] shadow-sm hover:bg-navy hover:text-gold transition-all active:scale-95"
              onClick={() => navigate('/amc-plans')}
            >
              Evaluate Tiers
            </Button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-56 h-56 bg-gold/10 rounded-full blur-[100px] opacity-30" />
        </section>
      </div>
    );
  }

  return (
    <div className="px-6 pt-10 pb-32 space-y-10">
      {/* Active Job Card */}
        {activeJob && (
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/20">Active Operation</h3>
              <div className="flex items-center gap-2.5 bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(201,162,74,0.5)]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold">Live Telemetry</span>
              </div>
            </div>
            <div className="bg-white rounded-[48px] p-10 border-[3px] border-gold shadow-2xl shadow-gold/10 relative overflow-hidden group active:scale-[0.99] transition-transform"
              onClick={() => navigate(`/job-tracker/${activeJob.id}`)}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-18 h-18 rounded-[24px] bg-gold/10 flex items-center justify-center text-gold shadow-inner">
                    {React.createElement(getIconByServiceName(activeJob.serviceType), { className: "w-9 h-9" })}
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/30">{activeJob.srNumber}</p>
                    <h4 className="text-[24px] font-display font-bold text-navy tracking-tighter leading-none">{activeJob.serviceType}</h4>
                  </div>
                </div>
                <Badge className="bg-navy text-gold border-none font-bold uppercase tracking-[0.2em] text-[9px] px-4 py-1.5 rounded-full shadow-lg shadow-navy/20">
                  {activeJob.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-navy/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy/20 shadow-inner">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-[11px] font-bold text-navy/60 uppercase tracking-widest">ETA Status</span>
                    <span className="block text-[13px] font-bold text-navy tracking-tight uppercase">Arriving in 20m</span>
                  </div>
                </div>
                <Button className="h-16 px-8 rounded-[24px] bg-navy text-gold font-bold text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-navy/30 group-hover:scale-105 transition-all">
                  Track Job
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.03] rounded-bl-full" />
            </div>
          </section>
        )}

        {/* Quick Actions Grid */}
        <section className="space-y-8">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/20 px-2">Mission Control</h3>
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: 'Initiate', path: '/book', icon: PlusCircle, color: 'bg-gold/10 text-gold shadow-inner border border-gold/10' },
              { label: 'Register', path: '/app/jobs', icon: Briefcase, color: 'bg-navy/5 text-navy/20 border border-navy/5' },
              { label: 'Artifacts', path: '/app/equipment', icon: Wind, color: 'bg-navy/5 text-navy/20 border border-navy/5' },
              { label: 'Support', path: '/contact', icon: MessageSquare, color: 'bg-navy/5 text-navy/20 border border-navy/5' },
            ].map((action, i) => (
              <button 
                key={i}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-4 group"
              >
                <div className={cn(
                  "w-18 h-18 rounded-[32px] flex items-center justify-center transition-all group-active:scale-95 shadow-sm group-hover:bg-navy group-hover:text-gold",
                  action.color
                )}>
                  <action.icon className="w-7 h-7" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-navy/40 group-hover:text-navy transition-colors">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* AMC Status Card */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/20">Elite Membership</h3>
            <button onClick={() => navigate('/app/amc')} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold active:scale-90 transition-transform">Command</button>
          </div>
          <div className="bg-navy rounded-[48px] p-10 text-warm-white relative overflow-hidden shadow-2xl shadow-navy/40 group active:scale-[0.99] transition-transform">
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[28px] font-display font-bold text-gold tracking-tight leading-none">{amc.planName}</h4>
                  <p className="text-warm-white/20 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Commissioned until {amc.endDate}</p>
                </div>
                <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/5 flex items-center justify-center text-gold/40 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] text-warm-white/20">
                  <span>Usage Delta</span>
                  <span>{amc.visitsUsed} / {amc.totalVisits} Units</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(amc.visitsUsed / amc.totalVisits) * 100}%` }}
                    className="h-full bg-gold shadow-[0_0_15px_rgba(201,162,74,0.3)]" 
                  />
                </div>
              </div>
            </div>
            <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-gold/5 rounded-full blur-[100px] opacity-20" />
            <Crown className="absolute top-[-10%] left-[-5%] w-40 h-40 text-gold/[0.02] -rotate-12 pointer-events-none" />
          </div>
        </section>

        {/* Recent Bookings Teaser */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/20">Historical Log</h3>
            <button onClick={() => navigate('/app/jobs')} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold active:scale-90 transition-transform">Full Archive</button>
          </div>
          <div className="space-y-5">
            {recentJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-white rounded-[32px] p-8 border border-navy/5 flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-navy/5 shadow-2xl shadow-black/[0.01]"
                onClick={() => navigate(`/app/booking-detail/${job.id}`)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/20 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                    {React.createElement(getIconByServiceName(job.serviceType), { className: "w-6 h-6" })}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-navy text-[16px] tracking-tight uppercase group-hover:text-gold transition-colors">{job.serviceType}</p>
                    <p className="text-[10px] text-navy/30 font-bold uppercase tracking-[0.2em]">{job.date}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-navy/10 group-hover:text-gold group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </section>
    </div>
  );
};
// --- Other Tab Components

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
    <div className="px-6 pt-10 pb-32 space-y-10">
      <div className="space-y-1.5 px-2">
        <h1 className="text-[28px] font-display font-bold text-navy tracking-tight leading-none">Service Manifest</h1>
        <p className="text-navy/40 text-[12px] font-bold uppercase tracking-[0.2em] mt-3">Select specialized engineering vector</p>
      </div>
      
      <div className="grid grid-cols-2 gap-5">
        {SERVICES.map((service) => {
          const Icon = getServiceIcon(service.category);
          return (
            <motion.button
              key={service.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickStart(service.id)}
              className="p-8 rounded-[32px] bg-white border border-navy/5 shadow-2xl shadow-black/[0.01] flex flex-col gap-6 text-left group hover:border-gold/20 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/20 group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-inner">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-navy text-[16px] leading-tight tracking-tight uppercase group-hover:text-gold transition-colors">{service.name}</p>
                <p className="text-[9px] text-navy/30 font-bold uppercase tracking-[0.2em]">Tier: ₹{service.price}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <Button 
        variant="ghost" 
        className="w-full h-16 rounded-[24px] text-gold font-bold gap-3 text-[13px] uppercase tracking-[0.3em] hover:bg-gold/5 active:scale-95 transition-all"
        onClick={() => navigate('/services')}
      >
        Extended Catalog <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Resume Draft Bottom Sheet */}
      <AnimatePresence>
        {showResume && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/90 backdrop-blur-md flex items-end"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-white rounded-t-[48px] p-10 pb-12 shadow-2xl"
            >
              <div className="w-16 h-1.5 bg-navy/5 rounded-full mx-auto mb-10" />
              <h2 className="text-[28px] font-display font-bold text-navy mb-3 tracking-tight">System Recall?</h2>
              <p className="text-navy/40 text-[13px] font-bold uppercase tracking-[0.2em] mb-10 leading-relaxed">Active configuration detected. Synchronize previous parameters or initialize fresh?</p>
              <div className="space-y-4">
                <Button 
                  className="w-full h-18 rounded-[24px] bg-navy text-gold font-bold text-[14px] uppercase tracking-[0.3em] shadow-2xl shadow-navy/20 active:scale-95 transition-all"
                  onClick={handleResume}
                >
                  Synchronize State
                </Button>
                <Button 
                  variant="ghost"
                  className="w-full h-14 rounded-[20px] text-navy/30 font-bold text-[11px] uppercase tracking-[0.4em] active:scale-90 transition-all hover:text-navy"
                  onClick={handleStartFresh}
                >
                  Clear Buffer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AccountTab = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const unreadTickets = SUPPORT_TICKETS.filter(t => t.status === 'In Progress').length; // Mocking unread as In Progress

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-10 pb-32 text-center space-y-8">
        <div className="w-24 h-24 bg-navy/5 rounded-[32px] flex items-center justify-center shadow-inner border border-navy/5">
          <User className="w-10 h-10 text-navy/10" />
        </div>
        <div className="space-y-3">
          <h2 className="text-[28px] font-display font-bold text-navy tracking-tight leading-none">Authentication Required</h2>
          <p className="text-navy/40 text-[13px] font-bold uppercase tracking-[0.2em] px-4 leading-relaxed">Establish credentials to manage individual engineering profiles and AMC assets.</p>
        </div>
        <Button 
          className="w-full h-18 rounded-[24px] bg-gold text-navy font-bold text-[14px] uppercase tracking-[0.3em] shadow-2xl shadow-gold/20 active:scale-95 transition-all"
          onClick={() => navigate('/login')}
        >
          Initialize Login
        </Button>
      </div>
    );
  }

  const menuItems = [
    { icon: MessageSquare, label: 'Technical Support', path: '/app/support', badge: unreadTickets > 0 ? unreadTickets : null },
    ...(FEATURE_FLAGS.SHOW_SPECIAL_OFFERS ? [{ icon: Tag, label: 'Privilege Vouchers', path: '/app/offers' }] : []),
    ...(FEATURE_FLAGS.SHOW_LOYALTY_REWARDS ? [{ icon: Trophy, label: 'Performance Rewards', path: '/app/rewards' }] : []),
    ...(FEATURE_FLAGS.SHOW_REFER_FRIEND ? [{ icon: Heart, label: 'Recruitment Protocol', path: '/app/refer' }] : []),
    { icon: User, label: 'Identity Settings', path: '/app/profile-settings' },
    { icon: MapPin, label: 'Deployment Vectors', path: '/app/addresses' },
    { icon: Bell, label: 'Transmission Config', path: '/app/notification-preferences' },
    ...(FEATURE_FLAGS.SHOW_APP_PERMISSIONS ? [{ icon: ShieldCheck, label: 'Access Permissions', path: '/app/permissions' }] : []),
    ...(FEATURE_FLAGS.SHOW_WHATS_NEW ? [{ icon: Sparkles, label: "System Changelog", path: '/app/changelog' }] : []),
    { icon: Shield, label: 'Privacy Policy', path: '/app/privacy' },
    { icon: Lock, label: 'Legal Framework', path: '/app/terms' },
  ];

  return (
    <div className="px-6 pt-10 pb-32 space-y-10">
      <div className="space-y-1.5 px-2">
        <h1 className="text-[28px] font-display font-bold text-navy tracking-tight leading-none">Account Paradigm</h1>
        <p className="text-navy/40 text-[12px] font-bold uppercase tracking-[0.2em] mt-3">Identity and operational preferences</p>
      </div>

      {/* Profile Card */}
      <section className="bg-navy rounded-[40px] p-8 text-warm-white relative overflow-hidden shadow-2xl shadow-navy/40 group active:scale-[0.99] transition-transform">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 rounded-[28px] bg-gold/10 border-2 border-gold/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-700">
            <img src={`https://i.pravatar.cc/150?u=${user?.email}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <h2 className="text-[22px] font-display font-bold text-gold tracking-tight">{user?.name}</h2>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(201,162,74,0.5)]" />
              <span className="text-warm-white/40 text-[9px] font-bold uppercase tracking-[0.3em]">{user?.membershipStatus} OPERATIVE</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[60px] opacity-20 -mr-16 -mt-16" />
        <Crown className="absolute bottom-[-10%] right-[-5%] w-32 h-32 text-white/5 -rotate-12 pointer-events-none" />
      </section>

      {/* Stats Row */}
      <section className={cn(
        "bg-white rounded-[32px] p-8 border border-navy/5 shadow-2xl shadow-black/[0.01] grid gap-6",
        FEATURE_FLAGS.SHOW_LOYALTY_REWARDS ? "grid-cols-3" : "grid-cols-2"
      )}>
        <div className="text-center space-y-1.5">
          <p className="text-[24px] font-display font-bold text-navy leading-none">{JOBS.length}</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-navy/20">Operational Record</p>
        </div>
        <div className={cn(
          "text-center space-y-1.5",
          FEATURE_FLAGS.SHOW_LOYALTY_REWARDS ? "border-x border-navy/5" : "border-l border-navy/5"
        )}>
          <p className="text-[24px] font-display font-bold text-gold leading-none">Secured</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-navy/20">Subscription Status</p>
        </div>
        {FEATURE_FLAGS.SHOW_LOYALTY_REWARDS && (
          <div className="text-center space-y-1.5">
            <p className="text-[24px] font-display font-bold text-navy leading-none">450</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-navy/20">Merit Points</p>
          </div>
        )}
      </section>

      {/* Menu List */}
      <div className="space-y-4">
        {menuItems.map((item, i) => (
          <button 
            key={i} 
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between p-6 bg-white rounded-[24px] border border-navy/5 group active:scale-[0.98] transition-all hover:bg-navy/5 shadow-sm"
          >
            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/20 group-hover:bg-gold/10 group-hover:text-gold transition-colors shadow-inner">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-navy text-[15px] tracking-tight group-hover:text-gold transition-colors">{item.label}</span>
            </div>
            <div className="flex items-center gap-4">
              {item.badge && (
                <span className="h-6 min-w-[24px] px-2 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-red-500/20">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-navy/10 group-hover:text-gold transition-colors" />
            </div>
          </button>
        ))}
        
        <div className="pt-6">
          <Button 
            variant="ghost" 
            className="w-full h-18 rounded-[24px] text-red-600 hover:text-red-700 hover:bg-red-500/5 font-bold gap-4 text-[14px] uppercase tracking-[0.3em] active:scale-95 transition-all"
            onClick={() => {
              logout();
              navigate('/auth-gate');
            }}
          >
            <LogOut className="w-6 h-6" />
            Terminate Session
          </Button>
        </div>
      </div>
    </div>
  );
};

const AboutTab = () => {
  return (
    <div className="px-6 pt-10 pb-32 space-y-12">
      {/* Hero Section */}
      <section className="space-y-6">
        <div className="px-2 space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold mb-1">Biological Standards</h3>
          <h1 className="text-[32px] font-display font-bold text-navy leading-none tracking-tighter">Atmospheric <br/>Mastery Paradigm</h1>
          <p className="text-navy/40 text-[13px] leading-relaxed max-w-xs font-medium uppercase tracking-widest">
            Engineering environments beyond conventional cooling. Precision. Purity. Performance.
          </p>
        </div>
        
        <div className="grid gap-5">
          <div className="bg-white rounded-[40px] p-10 border border-navy/5 shadow-2xl shadow-black/[0.01]">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-[20px] font-display font-bold text-navy mb-2 tracking-tight">Master Verification</h4>
            <p className="text-navy/40 text-[12px] leading-relaxed font-bold uppercase tracking-[0.1em]">
              Our engineering force consists of certified specialists navigating 500+ hours of forensic diagnostic training.
            </p>
          </div>

          <div className="bg-navy rounded-[40px] p-10 text-warm-white relative overflow-hidden shadow-2xl shadow-navy/40">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold mb-6 shadow-inner">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-[20px] font-display font-bold text-gold mb-2 tracking-tight">Technical Dominance</h4>
              <p className="text-warm-white/40 text-[12px] leading-relaxed font-bold uppercase tracking-[0.1em]">
                From sub-zero latency to AI-assisted thermal synchronization, we define the edge of environmental control.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gold/5 rounded-[40px] p-10 border border-gold/10 text-center space-y-8 relative overflow-hidden">
          <div className="flex justify-center">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-14 h-14 rounded-[20px] border-4 border-white bg-navy/5 overflow-hidden shadow-lg">
                  <img src={`https://i.pravatar.cc/150?u=user${i}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <p className="text-navy/50 text-[14px] italic font-serif px-4 leading-relaxed">
            "Coolzo transitioned our operational expectations from standard maintenance to high-precision engineering."
          </p>
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold font-display bg-navy/5 py-2 px-6 rounded-full inline-block">— Global operative Network</div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="space-y-10">
        <h2 className="text-[24px] font-display font-bold text-navy px-2 text-center tracking-tight leading-none">Core Tenets</h2>
        <div className="space-y-4">
          {[
            { title: 'Reliability', desc: 'Temporal accuracy is absolute. Our synchronized logistics guarantee zero-latency arrival.' },
            { title: 'Transparency', desc: 'Fiscal clarity is paramount. Pre-calculated estimates with digital verification protocols.' },
            { title: 'Excellence', desc: 'Precision is the floor. We operate at the intersection of craftsmanship and engineering.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start p-8 bg-white rounded-[32px] border border-navy/5 shadow-sm hover:border-gold/20 transition-all">
              <div className="text-gold font-display font-bold text-[28px] leading-none opacity-20">0{i+1}</div>
              <div className="space-y-2">
                <h4 className="font-bold text-navy uppercase tracking-[0.3em] text-[11px]">{item.title}</h4>
                <p className="text-navy/40 text-[13px] leading-relaxed font-medium">{item.desc}</p>
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
      { icon: Briefcase, label: 'Jobs', path: '/app/jobs' },
      { icon: FileText, label: 'Billings', path: '/app/invoices' }
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
      <div className="flex-1 overflow-y-auto no-scrollbar">
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
              <Route path="/jobs" element={<MyJobs />} />
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-navy/5 px-6 pt-3 pb-8 z-50">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                if (location.pathname !== tab.path && !(location.pathname === '/app/' && tab.path === '/app')) {
                  navigate(tab.path);
                }
              }}
              className="flex flex-col items-center gap-1.5 relative py-1 px-4 group active:scale-90 transition-transform"
            >
              <div className={cn(
                "w-6 h-6 flex items-center justify-center transition-all duration-300",
                activeTab === index ? "text-gold" : "text-navy/20"
              )}>
                <tab.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300",
                activeTab === index ? "text-navy" : "text-navy/20"
              )}>
                {tab.label}
              </span>
              {activeTab === index && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-3 w-8 h-1 bg-gold rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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
