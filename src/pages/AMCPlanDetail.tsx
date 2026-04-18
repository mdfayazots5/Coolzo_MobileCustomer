import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ShieldCheck, Zap, Crown, Building2, Info, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AMCService, AMCPlan } from '@/services/amcService';
import { cn } from '@/lib/utils';

export default function AMCPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<AMCPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;
      try {
        const data = await AMCService.getPlanById(id);
        setPlan(data);
      } catch (error) {
        console.error('Failed to fetch AMC plan:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-12 text-center italic">
        <h1 className="text-[32px] font-display font-bold text-navy uppercase tracking-tighter">Plan non-existent</h1>
        <Button onClick={() => navigate('/app/amc-plans')} className="mt-8 bg-gold text-navy font-bold h-16 px-10 rounded-2xl uppercase tracking-[0.2em]">Return to Matrix</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Dossier Header */}
      <div className="px-8 pt-16 pb-24 bg-navy text-warm-white rounded-b-[72px] relative overflow-hidden shadow-3xl shadow-navy/50 z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white mb-12 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        
        <div className="flex items-center gap-10 mb-14 relative z-10 italic">
          <div className="w-24 h-24 rounded-[36px] bg-gold text-navy flex items-center justify-center shadow-3xl shadow-gold/20 rotate-3 group active:scale-95 transition-transform">
            {plan.name === 'Basic' && <ShieldCheck className="w-12 h-12" />}
            {plan.name === 'Standard' && <Zap className="w-12 h-12" />}
            {plan.name === 'Premium' && <Crown className="w-12 h-12" />}
            {plan.name === 'Enterprise' && <Building2 className="w-12 h-12" />}
          </div>
          <div>
            <h1 className="text-[48px] font-display font-bold text-gold leading-none tracking-tighter mb-3 uppercase">{plan.name}</h1>
            <p className="text-warm-white/30 text-[11px] font-bold uppercase tracking-[0.5em] leading-none">Elite Coverage Protocol • Authorized</p>
          </div>
        </div>

        <div className="flex items-baseline gap-4 mb-8 relative z-10 italic">
          <span className="text-[64px] font-display font-bold text-white tracking-tighter leading-none">
            ₹{plan.price}
          </span>
          <span className="text-warm-white/30 text-[18px] font-bold uppercase tracking-[0.4em]">/ {plan.duration}</span>
        </div>

        <p className="text-[15px] text-warm-white/40 font-bold leading-relaxed max-w-[340px] relative z-10 uppercase tracking-tight italic">
          Institutional grade protection for your residential assets. Experience absolute priority across our entire service spectrum. Eradicate downtime.
        </p>

        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="px-8 py-16 space-y-20 relative z-30">
        {/* Deliverables Spectrum */}
        <section className="space-y-12">
          <div className="flex items-center justify-between px-6 italic">
            <div className="space-y-2">
              <h2 className="text-[32px] font-display font-bold text-navy tracking-tighter leading-none uppercase">Included Delta</h2>
              <p className="text-[11px] text-navy/20 font-bold uppercase tracking-[0.4em]">Operational Technical Specs</p>
            </div>
            <Badge className="bg-gold/10 text-gold border border-gold/20 text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full shadow-lg italic">
              {plan.features.length} Components
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {plan.features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-8 p-10 bg-white rounded-[44px] border border-navy/5 shadow-3xl shadow-black/[0.01] hover:border-gold/30 transition-all group italic"
              >
                <div className="w-14 h-14 rounded-[22px] bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors duration-500 shadow-inner">
                  <Check className="w-7 h-7 text-gold stroke-[4] group-hover:text-navy transition-colors duration-500" />
                </div>
                <span className="text-[16px] font-bold text-navy/60 leading-tight tracking-tight group-hover:text-navy transition-colors uppercase">{feature}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Policy Invariants */}
        <section className="bg-navy rounded-[72px] p-16 text-warm-white relative overflow-hidden shadow-3xl shadow-navy/50 group mx-2 italic">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-bl-full transition-transform group-hover:scale-110 duration-[2000ms]" />
          <h2 className="text-[28px] font-display font-bold text-gold mb-12 flex items-center gap-6 uppercase tracking-tight">
            <Info className="w-8 h-8" />
            Policy Protocol
          </h2>
          <div className="space-y-10">
            {[
              'Valid for 12 months from enrollment date.',
              'Eco-friendly sterilization with certified reagents.',
              'Strategic priority response during peak loads.',
              'Transferable within designated grid premises.'
            ].map((term, i) => (
              <div key={i} className="flex items-start gap-6 group/item">
                <div className="w-3 h-3 rounded-full bg-gold shrink-0 mt-2.5 shadow-[0_0_15px_rgba(201,162,74,0.6)] group-hover/item:scale-150 transition-transform" />
                <p className="text-[16px] text-warm-white/40 font-bold leading-relaxed tracking-tight uppercase">{term}</p>
              </div>
            ))}
          </div>
          <div className="absolute -left-40 -bottom-40 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[140px]" />
        </section>

        {/* Support Link */}
        <div className="flex items-center justify-between p-10 bg-white rounded-[48px] border border-navy/5 shadow-3xl shadow-black/[0.01] relative overflow-hidden group active:scale-[0.99] transition-all italic">
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-18 h-18 rounded-full bg-navy/5 flex items-center justify-center text-navy/10 shadow-inner group-hover:bg-navy group-hover:text-gold transition-all duration-1000 group-hover:rotate-12">
              <HelpCircle className="w-9 h-9" />
            </div>
            <div>
              <p className="text-[18px] font-display font-bold text-navy tracking-tight leading-none mb-2 uppercase">Need Intel?</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/20 leading-none">Expert Logistics Consultation</p>
            </div>
          </div>
          <Button variant="link" className="text-gold font-bold text-[14px] h-auto p-0 hover:no-underline active:opacity-50 relative z-10 uppercase tracking-[0.2em] group-hover:translate-x-3 transition-transform">Speak to Agent</Button>
          <div className="absolute right-0 top-0 w-32 h-32 bg-navy/[0.02] rounded-bl-full pointer-events-none group-hover:bg-gold/[0.05] transition-colors" />
        </div>
      </div>

      {/* Persistence Interface */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-navy/5 px-10 py-10 z-50 rounded-t-[54px] shadow-3xl">
        <div className="max-w-[440px] mx-auto italic">
          <Button 
            className="w-full h-24 rounded-[32px] bg-navy text-gold hover:bg-navy/95 font-bold text-[20px] uppercase tracking-[0.35em] shadow-3xl shadow-navy/40 active:scale-95 transition-all italic"
            onClick={() => navigate('/app/book')}
          >
            Authorize Enrollment
          </Button>
        </div>
      </div>
    </div>
  );
}
