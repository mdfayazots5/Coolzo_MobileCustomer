import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  ChevronLeft, 
  Crown,
  Star, 
  History, 
  ArrowUpRight,
  Gift,
  Zap,
  Loader2,
  Shield,
  User,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LoyaltyService, LoyaltyPoints, LoyaltyTransaction } from '@/services/loyaltyService';
import { useAuthStore } from '@/store/useAuthStore';

const LoyaltyRewards = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [pointsData, setPointsData] = useState<LoyaltyPoints | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [points, history] = await Promise.all([
          LoyaltyService.getLoyaltyPoints(user.uid),
          LoyaltyService.getTransactions(user.uid)
        ]);
        setPointsData(points);
        setTransactions(history);
      } catch (error) {
        console.error('Failed to fetch loyalty data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden italic">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[160px] -ml-40 -mt-20 pointer-events-none" />

      {/* Privilege Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-8 text-left">
            <button 
              onClick={() => navigate('/app')}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div>
              <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase italic">Privilege Domain</h1>
              <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.5em] mt-2">Asset and Yield Intelligence</p>
            </div>
          </div>
          <button className="w-14 h-14 rounded-[22px] bg-white/5 flex items-center justify-center text-gold/60 active:scale-90 transition-all hover:bg-gold hover:text-navy shadow-inner border border-white/5">
            <Shield className="w-6 h-6" />
          </button>
        </div>
        
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-20 relative z-30 pb-40">
        {/* Tier Intelligence Matrix */}
        <div className="bg-white rounded-[72px] p-16 border border-navy/5 shadow-3xl shadow-black/[0.02] relative overflow-hidden group active:scale-[0.99] transition-all">
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-[40px] bg-navy flex items-center justify-center text-gold shadow-3xl shadow-navy/30 group-hover:scale-110 transition-transform duration-700">
                <Crown className="w-16 h-16" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-[18px] bg-gold flex items-center justify-center text-navy shadow-xl border-4 border-white animate-bounce">
                <Star className="w-6 h-6 fill-navy" />
              </div>
            </div>
            
            <h2 className="text-[44px] font-display font-bold text-navy tracking-tighter leading-none mb-4 uppercase italic">{pointsData?.tier || 'Pro'} <span className="text-gold">Status.</span></h2>
            <p className="text-navy/20 text-[12px] font-bold uppercase tracking-[0.5em] mb-12">Tier Allocation: {pointsData?.tier}</p>
            
            <div className="w-full space-y-6">
              <div className="flex justify-between items-end mb-2 px-6">
                 <span className="text-[11px] font-bold text-navy/40 uppercase tracking-[0.4em]">Yield Progress</span>
                 <span className="text-[18px] font-display font-bold text-navy italic">{pointsData?.balance?.toLocaleString()} Pts</span>
              </div>
              <div className="h-4 bg-navy/[0.03] rounded-full overflow-hidden shadow-inner p-1">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min(100, (pointsData?.balance || 0) / ((pointsData?.balance || 0) + (pointsData?.nextTierPoints || 1)) * 100)}%` }}
                   className="h-full bg-gold rounded-full shadow-[0_0_15px_rgba(201,162,74,0.5)] transition-all duration-1000" 
                />
              </div>
              <p className="text-[10px] text-gold font-bold uppercase tracking-[0.4em] italic">{pointsData?.nextTierPoints} Points until <span className="underline underline-offset-4 decoration-2">Tier Evolution</span></p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/[0.01] rounded-tl-full pointer-events-none" />
        </div>

        {/* Action Interface */}
        <div className="grid grid-cols-2 gap-8">
           <Button className="h-28 rounded-[40px] bg-navy text-gold font-bold flex flex-col gap-3 shadow-3xl shadow-navy/40 active:scale-95 transition-all group overflow-hidden relative border border-white/5">
              <ArrowUpRight className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] relative z-10">Extract Yield</span>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gold/20" />
           </Button>
           <Button variant="outline" className="h-28 rounded-[40px] bg-white border-navy/5 text-navy font-bold flex flex-col gap-3 shadow-3xl shadow-black/[0.01] active:scale-95 transition-all group overflow-hidden relative">
              <History className="w-8 h-8 group-hover:rotate-12 transition-transform opacity-20" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] relative z-10">Archive Log</span>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-navy/5" />
           </Button>
        </div>

        {/* Benefits Stack */}
        <section className="space-y-10">
          <div className="flex items-center justify-between px-6">
             <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20">Privilege Artifacts</h3>
             <Zap className="w-5 h-5 text-gold animate-pulse" />
          </div>
          <div className="space-y-6">
            {[
              { title: 'Priority Deployment', desc: 'Accelerated dispatch logistics', icon: Zap },
              { title: 'Fiscal Rebates', desc: '15% reduction on all artifacts', icon: Gift },
              { title: 'Concierge Protocol', desc: 'Dedicated institutional liaison', icon: User }
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-8 p-8 bg-white rounded-[44px] border border-navy/5 shadow-3xl shadow-black/[0.01] group active:scale-[0.99] transition-all relative overflow-hidden">
                <div className="w-16 h-16 rounded-[24px] bg-navy/[0.02] flex items-center justify-center text-navy/10 group-hover:bg-gold group-hover:text-navy transition-all duration-700 shadow-inner group-hover:rotate-6">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[20px] font-display font-bold text-navy tracking-tighter uppercase italic group-hover:text-gold transition-colors">{benefit.title}</h4>
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-navy/20">{benefit.desc}</p>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.01] rounded-bl-full pointer-events-none" />
              </div>
            ))}
          </div>
        </section>

        {/* Transactional Ledger */}
        <section className="space-y-10">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-6">Transactional Yields</h3>
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-white rounded-[40px] p-8 border border-navy/5 flex justify-between items-center shadow-3xl shadow-black/[0.01] group hover:border-gold/20 transition-all active:scale-[0.99]">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:rotate-12",
                    tx.type === 'earn' ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                  )}>
                    {tx.type === 'earn' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-navy text-[18px] tracking-tight uppercase italic">{tx.description}</h5>
                    <p className="text-[10px] text-navy/20 font-bold uppercase tracking-[0.3em] mt-1">
                      {tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-[28px] font-display font-bold tracking-tighter transition-all duration-700",
                    tx.type === 'earn' ? "text-green-600 group-hover:scale-110" : "text-red-600 group-hover:scale-90"
                  )}>
                    {tx.type === 'earn' ? '+' : '-'}{tx.points.toLocaleString()}
                  </span>
                  <p className="text-[9px] font-bold text-navy/10 uppercase tracking-[0.4em] mt-1">Credits</p>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="py-24 text-center">
                <div className="w-20 h-20 bg-navy/5 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <History className="w-10 h-10 text-navy/10" />
                </div>
                <p className="text-navy/30 text-[11px] font-bold uppercase tracking-[0.3em] max-w-[200px] mx-auto">No transactional yields recorded in the local cluster.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoyaltyRewards;
