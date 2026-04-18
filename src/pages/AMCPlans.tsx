import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ShieldCheck, Zap, Crown, Building2, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AMCService, AMCPlan } from '@/services/amcService';
import { useBookingStore } from '@/store/useBookingStore';
import { cn } from '@/lib/utils';

const PlanIcon = ({ name }: { name: string }) => {
  if (name.includes('Basic')) return <ShieldCheck className="w-6 h-6" />;
  if (name.includes('Standard')) return <Zap className="w-6 h-6" />;
  if (name.includes('Premium')) return <Crown className="w-6 h-6" />;
  if (name.includes('Enterprise')) return <Building2 className="w-6 h-6" />;
  return <ShieldCheck className="w-6 h-6" />;
};

export default function AMCPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<AMCPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePlan, setActivePlan] = useState(0);
  const { updateBooking, setStep, resetBooking } = useBookingStore();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await AMCService.getPlans();
        setPlans(data);
        const recommendedIndex = data.findIndex(p => p.recommended);
        if (recommendedIndex !== -1) setActivePlan(recommendedIndex);
      } catch (error) {
        console.error('Failed to fetch AMC plans:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleBookAMC = (planId: string) => {
    resetBooking();
    updateBooking({ 
      serviceId: 'amc', 
      subServiceId: planId 
    });
    setStep(2);
    navigate('/app/book');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Mastery Header */}
      <div className="bg-navy px-8 pt-16 pb-32 text-warm-white rounded-b-[72px] relative overflow-hidden shadow-3xl shadow-navy/40 z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white mb-16 active:scale-90 transition-transform shadow-2xl"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        
        <div className="relative z-10 space-y-6 italic">
          <h1 className="text-[52px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Mastery Matrix</h1>
          <p className="text-warm-white/40 text-[14px] max-w-[340px] font-bold uppercase tracking-[0.4em] leading-relaxed">
            Eliminate operational failure with elite synchronization protocols.
          </p>
        </div>

        <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* Plan Telemetry Scroll Cluster */}
      <div className="px-8 -mt-20 mb-24 relative z-30">
        <div className="flex gap-10 overflow-x-auto no-scrollbar py-12 snap-x snap-mandatory px-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: index === activePlan ? 1 : 0.92, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              className={cn(
                "snap-center shrink-0 w-[360px] bg-white rounded-[72px] p-12 shadow-3xl transition-all duration-1000 border-2 relative overflow-hidden group italic",
                index === activePlan 
                  ? "border-gold border-opacity-40 shadow-gold/10" 
                  : "border-transparent opacity-60 shadow-navy/5"
              )}
              onClick={() => setActivePlan(index)}
            >
              <div className="flex justify-between items-start mb-16 relative z-10">
                <div className={cn(
                  "w-20 h-20 rounded-[32px] flex items-center justify-center transition-all duration-1000 shadow-inner",
                  index === activePlan ? "bg-navy text-gold rotate-6 scale-110 shadow-navy/30" : "bg-navy/5 text-navy/10"
                )}>
                  <PlanIcon name={plan.name} />
                </div>
                {plan.recommended && (
                  <Badge className="bg-gold text-navy text-[10px] font-bold uppercase tracking-[0.4em] px-6 py-2.5 rounded-full border-none shadow-3xl shadow-gold/30 italic">
                    Elite Standard
                  </Badge>
                )}
              </div>
              
              <div className="mb-14 relative z-10">
                <h3 className="text-[44px] font-display font-bold text-navy mb-2 tracking-tighter leading-none uppercase">{plan.name}</h3>
                <p className="text-[11px] text-navy/20 font-bold uppercase tracking-[0.6em]">Protection Tier Protocol</p>
              </div>

              <div className="flex items-baseline gap-4 mb-16 bg-navy/5 p-8 rounded-[40px] justify-center group-hover:bg-gold/5 transition-all duration-1000 relative z-10">
                <span className="text-[52px] font-display font-bold text-navy tracking-tighter leading-none">
                  ₹{plan.price}
                </span>
                <span className="text-navy/20 text-[15px] font-bold uppercase tracking-[0.5em]">/ {plan.duration}</span>
              </div>

              <div className="space-y-6 mb-16 border-t border-navy/5 pt-12 relative z-10 italic">
                {plan.features.slice(0, 5).map((feature, i) => (
                  <div key={i} className="flex items-start gap-5 group/feature">
                    <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5 shadow-inner group-hover/feature:bg-gold transition-colors duration-500">
                      <Check className="w-3.5 h-3.5 text-gold group-hover/feature:text-navy stroke-[4]" />
                    </div>
                    <span className="text-[15px] font-bold text-navy/60 leading-tight tracking-tight group-hover:text-navy transition-colors">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-8 relative z-10">
                <Button 
                  className={cn(
                    "h-24 rounded-[36px] font-bold text-[18px] uppercase tracking-[0.4em] transition-all duration-1000 shadow-3xl active:scale-95",
                    index === activePlan
                      ? "bg-navy text-gold shadow-navy/40 hover:bg-navy/95" 
                      : "bg-navy/10 text-navy/20 shadow-none"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookAMC(plan.id);
                  }}
                >
                  Authorize Enrollment
                </Button>
                <button 
                  className="h-16 rounded-[28px] text-navy/20 font-bold text-[12px] uppercase tracking-[0.6em] hover:text-navy hover:bg-navy/5 transition-all flex items-center justify-center gap-5 group/btn italic"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/amc-plan/${plan.id}`);
                  }}
                >
                  Technical Specs
                  <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform" />
                </button>
              </div>
              
              <div className="absolute -right-16 -bottom-16 w-60 h-60 bg-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-gold/10 transition-colors duration-1000" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Institutional Advantage Matrix */}
      <div className="px-8 space-y-24 pb-20 relative z-30">
        <section className="space-y-16">
          <div className="flex items-end justify-between px-6 italic">
            <div className="space-y-3">
              <h2 className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none uppercase">Systemic Edge</h2>
              <p className="text-[11px] text-navy/20 font-bold uppercase tracking-[0.5em]">Proprietary Logistics Matrix • Authorized</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-10">
            {[
              { title: 'Precedence Response', desc: 'Guaranteed strategic arrival within 240 minutes of system incident registry.', icon: <Zap className="w-9 h-9" /> },
              { title: 'Artifact Integrity', desc: 'Flat 40% fiscal reduction on all institutional spare artifacts and refills.', icon: <ShieldCheck className="w-9 h-9" /> },
              { title: 'Smart Telemetry', desc: 'Predictive diagnostic reports generated via advanced systemic usage patterns.', icon: <ShieldCheck className="w-9 h-9" /> }
            ].map((item, i) => (
              <div key={i} className="flex gap-10 p-12 bg-white rounded-[60px] border border-navy/5 shadow-3xl shadow-black/[0.01] hover:border-gold/30 transition-all group overflow-hidden relative italic">
                <div className="w-22 h-22 rounded-[36px] bg-navy text-gold flex items-center justify-center shrink-0 shadow-3xl shadow-navy/30 group-hover:bg-gold group-hover:text-navy transition-all duration-1000 group-hover:rotate-12 z-10">
                  {item.icon}
                </div>
                <div className="relative z-10 pt-2">
                  <h4 className="font-display font-bold text-navy text-[24px] uppercase leading-tight tracking-tight group-hover:text-gold transition-colors">{item.title}</h4>
                  <p className="text-navy/40 text-[15px] font-bold leading-relaxed mt-4 uppercase tracking-tight">{item.desc}</p>
                </div>
                <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-navy/[0.01] rounded-full group-hover:bg-gold/[0.08] transition-all duration-1000" />
              </div>
            ))}
          </div>
        </section>

        {/* Patron Endorsement Layer */}
        <section className="bg-navy rounded-[84px] p-20 text-warm-white relative overflow-hidden shadow-3xl shadow-navy/60 mx-2 group italic">
          <div className="relative z-10 flex flex-col items-center text-center space-y-16">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(i => <Crown key={i} className="w-7 h-7 text-gold fill-gold shadow-[0_0_20px_rgba(201,162,74,0.6)] animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />)}
            </div>
            <p className="text-[32px] font-display font-medium leading-[1.3] text-warm-white italic opacity-95 tracking-tighter max-w-[500px] uppercase">
              "The Premium Protocol redefined my expectations. Coolzo manages synchronization with absolute institutional precision."
            </p>
            <div className="flex flex-col items-center gap-8">
              <div className="w-24 h-24 rounded-full border-4 border-gold/40 p-2.5 shadow-3xl shadow-black/60 rotate-6 group-hover:rotate-0 transition-transform duration-1000">
                <div className="w-full h-full rounded-full bg-gold/10 flex items-center justify-center font-display font-bold text-gold text-4xl italic">MK</div>
              </div>
              <div className="space-y-3">
                <p className="text-[22px] font-display font-bold text-gold tracking-tight uppercase">Mahesh Kumar</p>
                <p className="text-[11px] text-warm-white/30 uppercase tracking-[0.5em] font-bold italic">Patron Member • Enterprise Protocol</p>
              </div>
            </div>
          </div>
          <div className="absolute -left-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute right-0 bottom-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-[3000ms]">
            <ShieldCheck className="w-[500px] h-[500px] -mr-40 -mb-40 rotate-12" />
          </div>
        </section>
      </div>
    </div>
  );
}
