import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Zap, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

const AMCEnrollmentUpsell = () => {
  const navigate = useNavigate();

  const benefits = [
    { title: '4 Free Services', desc: 'Scheduled preventive maintenance every quarter.' },
    { title: 'Priority Dispatch', desc: 'Jump the queue with 2-hour response guarantee.' },
    { title: 'Unlimited Repairs', desc: 'Zero labor charges on all breakdown calls.' },
    { title: 'Spare Part Discounts', desc: 'Flat 15% off on all genuine spare parts.' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Cinematic Hero */}
      <div className="bg-navy p-10 pt-20 pb-32 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-16 active:scale-95 transition-transform shadow-3xl"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <div className="relative z-10 space-y-10 italic">
          <div className="w-24 h-24 rounded-[40px] bg-gold/10 flex items-center justify-center text-gold mb-12 shadow-3xl border border-gold/10 rotate-3 group active:scale-95 transition-all">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="text-[52px] font-display font-bold text-gold leading-[1] tracking-tighter uppercase">
            Seamless Care,<br /><span className="text-white">Absolute Precision.</span>
          </h1>
          <p className="text-warm-white/40 text-[15px] leading-relaxed max-w-[340px] font-bold uppercase tracking-tight italic">
            Join the elite circle of 10,000+ patrons who have eradicated appliance downtime from their vocabulary. Authorized mastery.
          </p>
        </div>
        
        <Sparkles className="absolute -right-20 -bottom-20 w-80 h-80 text-warm-white/[0.03] opacity-50 rotate-12" />
        <div className="absolute -left-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="px-8 py-16 space-y-24 relative z-30">
        {/* Recovery Matrix Card */}
        <div className="bg-gold rounded-[72px] p-12 text-navy flex items-center justify-between shadow-3xl shadow-gold/40 relative overflow-hidden active:scale-[0.99] transition-transform group italic mx-2">
          <div className="relative z-10 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/40 leading-none">Projected Recovery</p>
            <p className="text-[48px] font-display font-bold tracking-tighter leading-none uppercase">₹4,500+</p>
          </div>
          <div className="text-right relative z-10 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/40 leading-none">Base Retention</p>
            <p className="text-[28px] font-display font-bold tracking-tighter leading-none uppercase">₹1,999<span className="text-[14px] opacity-40 ml-2">/yr</span></p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
        </div>

        {/* Advantage Protocol List */}
        <div className="space-y-16">
          <div className="flex items-center justify-between px-6 italic">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 leading-none">The Protocol Advantage</h3>
            <Zap className="w-5 h-5 text-gold/40 animate-pulse" />
          </div>
          <div className="space-y-12">
            {benefits.map((b, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-10 group italic"
              >
                <div className="w-20 h-20 rounded-[32px] bg-white border border-navy/5 flex items-center justify-center text-navy shrink-0 shadow-3xl shadow-black/[0.01] group-hover:bg-navy group-hover:text-gold transition-all duration-1000 group-hover:rotate-12">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="flex flex-col justify-center pt-1.5">
                  <h4 className="font-display font-bold text-navy text-[24px] mb-2 tracking-tighter leading-none uppercase group-hover:text-gold transition-colors">{b.title}</h4>
                  <p className="text-[14px] text-navy/40 leading-tight font-bold uppercase tracking-tight">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comparative Logistics Matrix */}
        <div className="bg-white rounded-[60px] border border-navy/5 p-12 space-y-12 shadow-3xl shadow-black/[0.01] italic group">
          <h4 className="text-center text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 mb-8 leading-none">Tactical Comparative Logistics</h4>
          <div className="space-y-10">
            <div className="flex justify-between items-center text-[15px] py-6 border-b border-navy/5 group/row">
              <span className="text-navy/40 font-bold uppercase tracking-[0.3em] group-hover/row:text-navy transition-colors">Labor Overhead</span>
              <div className="flex gap-8 items-center">
                <span className="text-red-400 font-bold line-through opacity-40 text-[18px]">₹499</span>
                <span className="text-green-600 font-display font-bold bg-green-50 px-6 py-2.5 rounded-2xl shadow-lg shadow-green-500/10 text-[18px] uppercase tracking-tighter">ZERO</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[15px] py-4 group/row">
              <span className="text-navy/40 font-bold uppercase tracking-[0.3em] group-hover/row:text-navy transition-colors">Dispatch Response</span>
              <div className="flex gap-8 items-center">
                <span className="text-red-400 font-bold opacity-40 text-[18px]">24H</span>
                <span className="text-gold font-display font-bold bg-gold/5 px-6 py-2.5 rounded-2xl shadow-lg shadow-gold/10 text-[18px] uppercase tracking-tighter">2H PRIORITY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Persistence Layer */}
        <div className="fixed bottom-0 left-0 right-0 p-10 bg-white/95 backdrop-blur-3xl border-t border-navy/5 z-50 rounded-t-[54px] shadow-3xl">
          <div className="max-w-[440px] mx-auto italic">
            <Button 
              onClick={() => navigate('/app/amc-plans')}
              className="w-full h-24 rounded-[32px] bg-navy text-gold font-bold text-[20px] shadow-3xl shadow-navy/40 flex items-center justify-center gap-6 uppercase tracking-[0.35em] active:scale-95 transition-all hover:bg-navy/95 italic"
            >
              Examine Plans
              <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMCEnrollmentUpsell;
