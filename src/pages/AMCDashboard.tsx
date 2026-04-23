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
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AMCService, AMCSubscription } from '@/services/amcService';
import { useAuthStore } from '@/store/useAuthStore';

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

  const getTierIcon = (planName: string) => {
    if (planName?.includes('Premium')) return Crown;
    if (planName?.includes('Standard')) return Zap;
    return ShieldCheck;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center p-12 text-center relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-navy/[0.03] rounded-bl-full blur-[100px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-tr-full blur-[100px] -ml-40 -mb-40" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-48 h-48 bg-navy/5 rounded-[64px] flex items-center justify-center shadow-inner border border-navy/5 relative group active:scale-95 transition-all mb-16"
        >
          <ShieldCheck className="w-24 h-24 text-navy/10 group-hover:text-gold/30 transition-all duration-1000 group-hover:rotate-12" />
          <div className="absolute inset-0 bg-gold/5 rounded-[64px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
        
        <div className="space-y-8 mb-24 relative z-10 italic">
          <h2 className="text-[48px] font-display font-bold text-navy tracking-tighter leading-none uppercase">Coverage <span className="text-gold">Deficit.</span></h2>
          <p className="text-navy/40 text-[14px] font-bold uppercase tracking-[0.4em] px-8 leading-relaxed max-w-[380px] mx-auto">
            Synchronize your appliance lifecycle with institutional mastery protocols to eradicate operational failure.
          </p>
        </div>

        <Button 
          className="w-full max-w-[360px] h-24 rounded-[36px] bg-navy text-gold font-bold text-[20px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/40 active:scale-95 transition-all italic hover:brightness-105"
          onClick={() => navigate('/amc-plans')}
        >
          Evaluate Mastery Tiers
        </Button>
      </div>
    );
  }

  const TierIcon = getTierIcon(subscription.planName);
  const nextVisit = subscription.visits.find((visit) => !visit.status.toLowerCase().includes('completed'));
  const pastVisits = subscription.visits
    .filter((visit) => visit.status.toLowerCase().includes('completed'))
    .sort((left, right) => new Date(right.scheduledDate).getTime() - new Date(left.scheduledDate).getTime())
    .slice(0, 3);
  const daysUntilExpiry = Math.max(Math.ceil((new Date(subscription.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 0);

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Institutional Header */}
      <div className="bg-navy px-8 pt-16 pb-32 text-warm-white rounded-b-[72px] relative overflow-hidden shadow-3xl shadow-navy/40 z-20">
        <div className="flex items-center justify-between mb-16 relative z-10">
          <button 
            onClick={() => navigate('/app')}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-90 transition-transform shadow-2xl"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>
          <div className="bg-gold/10 backdrop-blur-3xl px-8 py-3.5 rounded-full border border-gold/20 flex items-center gap-5 shadow-3xl">
            <TierIcon className="w-6 h-6 text-gold fill-gold/20" />
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-gold italic">{subscription.planName} Protocol</span>
          </div>
        </div>
        
        <div className="space-y-4 mb-20 relative z-10 italic">
          <h1 className="text-[52px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Elite Coverage</h1>
          <p className="text-warm-white/30 text-[11px] font-bold uppercase tracking-[0.5em] leading-none">Institutional Synchronization Log • Active</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-3xl rounded-[64px] p-12 border border-white/10 relative z-10 shadow-3xl shadow-black/20 group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
          <div className="flex justify-between items-end mb-12 italic relative z-10">
            <div className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.6em] text-gold/40">Status Synchronization</p>
              <h4 className="text-[40px] font-display font-bold text-white tracking-tighter leading-none uppercase">
                {subscription.totalVisits - subscription.remainingVisits} <span className="text-white/10 text-2xl font-medium mx-3">/</span> <span className="text-white/40 text-2xl font-medium tracking-normal">{subscription.totalVisits} Cycles</span>
              </h4>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-gold bg-navy/50 backdrop-blur-3xl flex flex-col items-center justify-center shadow-3xl shadow-gold/30 group-hover:scale-110 transition-transform duration-1000">
              <span className="text-[24px] font-display font-bold text-gold italic">{( (subscription.totalVisits - subscription.remainingVisits) / subscription.totalVisits * 100).toFixed(0)}%</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-gold/40">Sync</span>
            </div>
          </div>
          
          <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5 p-1.5 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((subscription.totalVisits - subscription.remainingVisits) / subscription.totalVisits) * 100}%` }}
              className="h-full bg-gradient-to-r from-gold/60 via-gold to-gold/60 rounded-full shadow-[0_0_30px_rgba(201,162,74,0.8)]"
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-[shimmer_3s_infinite]" />
          </div>
          <div className="mt-10 flex items-center justify-center gap-4 italic opacity-40">
             <Clock className="w-4 h-4 text-gold" />
             <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-warm-white">Protocol terminates: {new Date(subscription.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-16 py-20 space-y-24 relative z-30 pb-40">
        {/* Next Visit Module */}
        {nextVisit && (
          <section className="space-y-12">
            <div className="flex items-end justify-between px-6">
              <div className="space-y-3 italic">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 leading-none">Operational Vector</h3>
                <h2 className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none uppercase">Imminent <span className="text-gold">Sync.</span></h2>
              </div>
            </div>
            <div className="bg-white rounded-[72px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.02] relative overflow-hidden group active:scale-[0.99] transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/[0.03] rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
              <div className="flex items-center gap-12 mb-16 relative z-10 italic">
                <div className="w-28 h-28 rounded-[44px] bg-navy text-gold flex items-center justify-center shadow-3xl shadow-navy/30 group-hover:rotate-6 transition-transform duration-1000">
                  <Calendar className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                  <p className="text-[44px] font-display font-bold text-navy leading-none tracking-tighter uppercase">
                    {new Date(nextVisit.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                    <p className="text-[13px] text-navy/40 font-bold uppercase tracking-[0.4em]">Strategic Launch Phase Authorized</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-8 relative z-10">
                <Button 
                  className="flex-1 h-22 rounded-[32px] bg-navy text-gold shadow-3xl shadow-navy/40 font-bold text-[15px] uppercase tracking-[0.4em] active:scale-95 transition-all hover:bg-navy/95 italic uppercase"
                  onClick={() => navigate(`/app/amc/visit/${nextVisit.id}`)}
                >
                  View Visit
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Tactical History Cluster */}
        <section className="space-y-12">
          <div className="flex items-center justify-between px-6">
            <div className="space-y-3 italic">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.6em] text-navy/20 leading-none">Operational Archive</h3>
              <h2 className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none uppercase">Registry Log</h2>
            </div>
            <button className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold bg-gold/5 px-10 py-4.5 rounded-full active:scale-90 transition-all border border-gold/10 hover:bg-gold/10 shadow-lg italic">Extract Intel</button>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {pastVisits.map((visit, i) => (
              <motion.div 
                key={visit.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                className="bg-white rounded-[56px] p-10 border border-navy/5 shadow-3xl shadow-black/[0.01] flex items-center justify-between group active:scale-[0.98] transition-all hover:border-gold/30 hover:shadow-black/5 relative overflow-hidden italic"
                onClick={() => navigate(`/app/amc/visit/${visit.id}`)}
              >
                <div className="flex items-center gap-10 relative z-10">
                  <div className="w-20 h-20 rounded-[32px] bg-navy/5 flex items-center justify-center text-navy/10 group-hover:bg-navy group-hover:text-gold transition-all duration-1000 shadow-inner group-hover:rotate-12">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <p className="font-bold text-navy text-[26px] tracking-tighter leading-none uppercase">Cycle #{visit.visitNumber}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <p className="text-[11px] text-navy/30 font-bold uppercase tracking-[0.5em] leading-none">{new Date(visit.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center text-navy/10 group-hover:bg-gold group-hover:text-navy transition-all duration-1000 shadow-md group-hover:scale-110 relative z-10">
                  <ChevronRight className="w-8 h-8" />
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-navy/[0.01] rounded-tl-full pointer-events-none group-hover:bg-gold/[0.05] transition-colors" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Renewal Protocol Layer */}
        {daysUntilExpiry <= 30 && (
          <section className="bg-gold rounded-[72px] p-16 relative overflow-hidden shadow-3xl shadow-gold/30 group active:scale-[0.99] transition-all text-center mx-2">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-28 h-28 rounded-[48px] bg-navy flex items-center justify-center text-gold mb-14 shadow-3xl shadow-navy/40 group-hover:rotate-[360deg] transition-transform duration-[2000ms]">
              <RefreshCw className="w-12 h-12" />
            </div>
            <h3 className="text-[48px] font-display font-bold text-navy mb-6 tracking-tighter leading-none italic uppercase">Perpetuate Excellence</h3>
            <p className="text-navy/50 text-[15px] font-bold mb-16 leading-relaxed max-w-[380px] uppercase tracking-[0.3em] italic">
              Sustain institutional priority and grandfathered protection rates across the grid. {daysUntilExpiry} days remain before protocol expiry.
            </p>
            <Button className="w-full h-24 rounded-[36px] bg-navy text-gold font-bold text-[20px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/40 active:scale-95 transition-all hover:bg-navy/95 italic uppercase" onClick={() => navigate('/amc-plans')}>
              Initialize Renewal Protocol
            </Button>
          </div>
          <RefreshCw className="absolute -right-32 -bottom-32 w-[500px] h-[500px] text-navy/[0.04] -rotate-12 pointer-events-none group-hover:rotate-[45deg] transition-transform duration-[5000ms]" />
          </section>
        )}
      </div>
    </div>
  );
}
