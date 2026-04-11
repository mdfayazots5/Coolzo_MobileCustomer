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
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Hero Section */}
      <div className="bg-navy p-8 pt-12 text-warm-white rounded-b-[40px] relative overflow-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-8"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative z-10 space-y-4">
          <div className="w-16 h-16 rounded-[24px] bg-gold/20 flex items-center justify-center text-gold mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gold leading-tight">
            Peace of Mind,<br />Guaranteed.
          </h1>
          <p className="text-warm-white/60 text-sm leading-relaxed max-w-[280px]">
            Join 10,000+ happy families who never worry about AC breakdowns again.
          </p>
        </div>
        
        <Sparkles className="absolute -right-10 -bottom-10 w-48 h-48 text-warm-white/5" />
      </div>

      <div className="p-8 space-y-10 pb-32">
        {/* Savings Card */}
        <div className="bg-gold rounded-[32px] p-6 text-navy flex items-center justify-between shadow-xl shadow-gold/20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Annual Savings</p>
            <p className="text-3xl font-display font-bold">₹4,500+</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Starting at</p>
            <p className="text-xl font-display font-bold">₹1,999/yr</p>
          </div>
        </div>

        {/* Benefits List */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Why Upgrade to AMC?</h3>
          <div className="space-y-6">
            {benefits.map((b, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-navy">{b.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-white rounded-[32px] border border-border p-6 space-y-4">
          <h4 className="text-center text-[10px] font-bold uppercase tracking-widest text-text-secondary">One-time vs AMC</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-navy/40">Labor Charges</span>
              <div className="flex gap-4">
                <span className="text-red-500 font-bold">₹499</span>
                <span className="text-green-500 font-bold">FREE</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-navy/40">Response Time</span>
              <div className="flex gap-4">
                <span className="text-red-500 font-bold">24h</span>
                <span className="text-green-500 font-bold">2h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-lg border-t border-border z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={() => navigate('/amc-plans')}
              className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-card flex items-center justify-center gap-3"
            >
              View AMC Plans
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMCEnrollmentUpsell;
