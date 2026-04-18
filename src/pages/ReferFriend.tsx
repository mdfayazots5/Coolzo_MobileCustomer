import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Copy, 
  Share2, 
  Gift, 
  Users, 
  UserPlus,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ReferralService, ReferralStats } from '@/services/referralService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const ReferFriend = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const data = await ReferralService.getReferralStats(user.uid);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch referral stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const copyToClipboard = () => {
    if (!stats) return;
    navigator.clipboard.writeText(stats.referralCode);
    toast.success('Ambassador Code Synchronized');
  };

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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />

      {/* Recruitment Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center gap-8 relative z-10">
          <button 
            onClick={() => navigate('/app')}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          <div>
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase italic">Growth Network</h1>
            <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.5em] mt-2">Ambassador Recruitment Protocol</p>
          </div>
        </div>
        
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-20 relative z-30 pb-40">
        {/* Referral Extraction Module */}
        <div className="bg-white rounded-[72px] p-16 border border-navy/5 shadow-3xl shadow-black/[0.02] text-center relative overflow-hidden group active:scale-[0.99] transition-all">
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-[32px] bg-gold/10 flex items-center justify-center text-gold mx-auto mb-10 shadow-inner group-hover:rotate-12 transition-transform duration-700">
               <Share2 className="w-12 h-12" />
            </div>
            <h2 className="text-[28px] font-display font-bold text-navy tracking-tighter uppercase italic leading-none mb-4">Recruitment <span className="text-gold italic">Vector.</span></h2>
            <p className="text-navy/30 text-[12px] font-bold uppercase tracking-[0.4em] mb-12">Authorize new network nodes</p>
            
            <div className="relative">
              <div 
                onClick={copyToClipboard}
                className="bg-navy/[0.03] border-2 border-dashed border-gold/40 rounded-[32px] p-8 cursor-pointer group/code active:scale-95 transition-all overflow-hidden"
              >
                <p className="text-[44px] font-display font-bold text-navy tracking-[0.2em] mb-2">{stats?.referralCode}</p>
                <div className="flex items-center justify-center gap-3">
                   <Copy className="w-4 h-4 text-gold" />
                   <span className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Copy Identifier</span>
                </div>
                <div className="absolute inset-0 bg-gold/[0.02] translate-x-full group-hover/code:translate-x-0 transition-transform duration-1000" />
              </div>
            </div>
            
            <div className="mt-12 pt-12 border-t border-navy/5 flex justify-center gap-20">
              <div className="text-center">
                <p className="text-[32px] font-display font-bold text-navy tracking-tighter">₹250</p>
                <p className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.3em] mt-1">Node Yield</p>
              </div>
              <div className="text-center">
                <p className="text-[32px] font-display font-bold text-gold tracking-tighter">50 Pts</p>
                <p className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.3em] mt-1">Ambassador Bonus</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-navy/[0.01] rounded-tl-full pointer-events-none" />
        </div>

        {/* Operational Lifecycle */}
        <section className="space-y-10">
           <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-6">Expansion Lifecycle</h3>
           <div className="grid grid-cols-3 gap-6">
             {[
               { id: '01', title: 'Dispatch', icon: UserPlus },
               { id: '02', title: 'Adoption', icon: ShieldCheck },
               { id: '03', title: 'Extraction', icon: Gift }
             ].map((step, i) => (
                <div key={i} className="bg-white rounded-[40px] p-6 text-center border border-navy/5 shadow-3xl shadow-black/[0.01] group active:scale-95 transition-all">
                   <div className="w-12 h-12 rounded-[18px] bg-navy/[0.02] flex items-center justify-center text-navy/10 mx-auto mb-4 group-hover:bg-gold group-hover:text-navy transition-all shadow-inner">
                      <step.icon className="w-6 h-6" />
                   </div>
                   <p className="text-[12px] font-bold text-navy tracking-tighter uppercase italic">{step.title}</p>
                   <p className="text-[10px] text-navy/20 font-bold mt-1">Stage {step.id}</p>
                </div>
             ))}
           </div>
        </section>

        {/* Intelligence Ledger */}
        <section className="space-y-10">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-6">Network Nodes Log</h3>
          <div className="space-y-4">
            {stats?.referrals.map((referral) => (
              <div key={referral.id} className="bg-white rounded-[40px] p-8 border border-navy/5 flex justify-between items-center shadow-3xl shadow-black/[0.01] group hover:border-gold/20 transition-all active:scale-[0.99] relative overflow-hidden">
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-14 h-14 rounded-[20px] bg-gold/10 flex items-center justify-center text-gold font-display font-bold text-[20px] group-hover:scale-110 transition-transform">
                    {referral.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-display font-bold text-navy text-[18px] tracking-tighter uppercase italic">{referral.name}</h5>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        referral.status === 'Completed' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gold shadow-[0_0_8px_rgba(201,162,74,0.6)]"
                      )} />
                      <p className="text-[10px] text-navy/20 font-bold uppercase tracking-[0.4em]">{referral.status}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-[20px] font-display font-bold text-navy tracking-tighter italic">₹{referral.reward.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mt-1">Total Yield</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.01] rounded-bl-full pointer-events-none" />
              </div>
            ))}
            
            {(!stats?.referrals || stats.referrals.length === 0) && (
               <div className="py-24 text-center">
                 <div className="w-20 h-20 bg-navy/5 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-inner">
                   <Users className="w-10 h-10 text-navy/10" />
                 </div>
                 <p className="text-navy/30 text-[11px] font-bold uppercase tracking-[0.3em] max-w-[200px] mx-auto leading-loose italic">No active network nodes detected in this operational cluster.</p>
               </div>
            )}
          </div>
        </section>
      </div>

      {/* Global Action Interface */}
      <div className="fixed bottom-0 left-0 right-0 p-10 z-50 bg-gradient-to-t from-warm-white via-warm-white/95 to-transparent flex justify-center">
        <div className="max-w-[480px] w-full">
          <Button 
            className="w-full h-24 rounded-[40px] bg-navy text-gold hover:bg-navy/95 font-bold text-[20px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/60 active:scale-95 transition-all relative overflow-hidden group/recruit"
            onClick={copyToClipboard}
          >
            <span className="relative z-10">Dispatch Recruitment Signal</span>
            <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover/recruit:translate-y-0 transition-transform duration-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferFriend;
