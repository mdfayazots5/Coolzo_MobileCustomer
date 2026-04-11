import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Crown,
  Zap,
  Building2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AMCService, AMCSubscription } from '@/services/amcService';
import { JOBS } from '@/lib/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export default function AMCDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [subscription, setSubscription] = useState<AMCSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      try {
        const data = await AMCService.getSubscription(user.uid);
        setSubscription(data);
      } catch (error) {
        console.error('Failed to fetch AMC subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscription();
  }, [user]);

  const pastVisits = JOBS.filter(j => j.serviceType.includes('AMC') || j.status === 'Completed').slice(0, 3);

  const getTierIcon = (planName: string) => {
    if (planName?.includes('Premium')) return Crown;
    if (planName?.includes('Standard')) return Zap;
    return ShieldCheck;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10 text-navy/10" />
        </div>
        <h2 className="text-xl font-display font-bold text-navy mb-2">No Active AMC</h2>
        <p className="text-navy/40 text-sm mb-8">Protect your appliances with our Annual Maintenance Contracts.</p>
        <Button 
          className="w-full h-14 rounded-2xl bg-gold text-navy font-bold"
          onClick={() => navigate('/app/amc')}
        >
          View AMC Plans
        </Button>
      </div>
    );
  }

  const TierIcon = getTierIcon(subscription.planName);

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="px-6 py-8 bg-navy text-warm-white rounded-b-[40px] relative overflow-hidden">
        <button 
          onClick={() => navigate('/app')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-display font-bold text-gold">My AMC</h1>
          <div className="bg-gold/20 px-4 py-1.5 rounded-full border border-gold/20 flex items-center gap-2">
            <TierIcon className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold">{subscription.planName}</span>
          </div>
        </div>
        
        <p className="text-warm-white/60 text-sm max-w-xs mb-8">
          Active until {new Date(subscription.expiryDate).toLocaleDateString()}. You have {subscription.remainingVisits} visits remaining.
        </p>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-warm-white/40">
            <span>Visit Progress</span>
            <span>{subscription.totalVisits - subscription.remainingVisits} / {subscription.totalVisits} Used</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((subscription.totalVisits - subscription.remainingVisits) / subscription.totalVisits) * 100}%` }}
              className="h-full bg-gold"
            />
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="px-6 py-8 space-y-10">
        {/* Next Visit Card */}
        {subscription.nextVisitDate && (
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Upcoming AMC Visit</h3>
            <div className="bg-white rounded-[40px] p-8 border border-navy/5 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-lg font-bold text-navy">{new Date(subscription.nextVisitDate).toLocaleDateString()}</p>
                  <p className="text-xs text-navy/40 font-medium">Scheduled Morning Slot</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-navy/10 text-navy font-bold"
                  onClick={() => navigate('/reschedule-booking/amc-next')}
                >
                  Reschedule
                </Button>
                <Button 
                  className="flex-1 h-12 rounded-xl bg-navy text-gold font-bold"
                  onClick={() => navigate('/amc-visit-detail/amc-next')}
                >
                  View Details
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Visit History */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Visit History</h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-gold">View All</button>
          </div>
          <div className="space-y-4">
            {pastVisits.map((visit, i) => (
              <div 
                key={i}
                className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/service-report/${visit.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">Visit #{subscription.totalVisits - subscription.remainingVisits - i}</p>
                    <p className="text-[10px] text-navy/40 font-medium uppercase tracking-widest mt-0.5">{visit.date}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-navy/20 group-hover:text-gold group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </section>

        {/* Renewal Banner */}
        <section className="bg-gold rounded-[40px] p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-display font-bold text-navy mb-2">Renewal Coming Up</h3>
            <p className="text-navy/60 text-xs font-bold mb-6 leading-relaxed">
              Your contract expires in 45 days. Renew now to lock in current prices and get 1 extra service free.
            </p>
            <Button className="w-full h-14 rounded-2xl bg-navy text-gold font-bold">
              Renew Contract
            </Button>
          </div>
          <RefreshCw className="absolute -right-8 -bottom-8 w-32 h-32 text-navy/5 -rotate-12" />
        </section>
      </div>
    </div>
  );
}
