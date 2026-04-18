import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const AMCEnrollmentVariant = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Directive Header */}
      <div className="bg-navy p-10 pt-20 pb-24 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-16 active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        <div className="relative z-10 space-y-8 italic">
          <Badge className="bg-gold/10 text-gold border-gold/20 font-bold text-[11px] uppercase tracking-[0.6em] px-8 py-2.5 mb-2 rounded-full shadow-3xl shadow-gold/10 leading-none">
            Directive Phase 01/03
          </Badge>
          <h1 className="text-[52px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Identify Protocol</h1>
          <p className="text-warm-white/40 text-[15px] font-bold leading-relaxed max-w-[320px] uppercase tracking-tight">Calibrate the protection tier optimal for your specific home environment. Institutional accuracy mandated.</p>
        </div>
        
        <ShieldCheck className="absolute -right-20 -bottom-20 w-80 h-80 text-warm-white/[0.03] opacity-50 rotate-12" />
        <div className="absolute -left-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="px-8 py-16 space-y-12 pb-48 relative z-30">
        {[
          { name: 'Basic', price: '1,999', visits: '2 Visits/yr', color: 'bg-white' },
          { name: 'Premium', price: '3,499', visits: '4 Visits/yr', color: 'bg-gold/5 border-gold border-opacity-40 shadow-gold/5', popular: true },
          { name: 'Elite', price: '5,999', visits: 'Unlimited', color: 'bg-white' }
        ].map((plan, i) => (
          <div 
            key={i}
            className={cn(
              "p-12 rounded-[72px] border border-navy/5 relative transition-all active:scale-[0.98] shadow-3xl shadow-black/[0.01] overflow-hidden italic group",
              plan.color
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-1 left-12 bg-gold text-navy border-none font-bold text-[10px] uppercase tracking-[0.5em] px-8 py-3 rounded-b-3xl shadow-3xl shadow-gold/40">
                Highest Retention
              </Badge>
            )}
            <div className="flex justify-between items-start mb-14 pt-4">
              <div className="space-y-3">
                <h3 className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none uppercase">{plan.name}</h3>
                <p className="text-[12px] text-navy/30 font-bold uppercase tracking-[0.4em] leading-none">{plan.visits}</p>
              </div>
              <div className="text-right space-y-2">
                <p className="text-[32px] font-display font-bold text-navy tracking-tighter leading-none uppercase">₹{plan.price}</p>
                <p className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.4em] leading-none">per annum</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 mb-14">
              {['Labor Neutralization', 'Priority Signal', 'Fluids Redistribution'].map((feat, j) => (
                <div key={j} className="flex items-center gap-5 group/feat">
                  <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold shadow-inner group-hover/feat:bg-gold transition-colors duration-500">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[13px] font-bold text-navy/40 uppercase tracking-[0.2em] group-hover/feat:text-navy transition-colors">{feat}</span>
                </div>
              ))}
            </div>

            <Button 
              className={cn(
                "w-full h-20 rounded-[32px] font-bold text-[16px] uppercase tracking-[0.4em] shadow-3xl transition-all active:scale-95 italic",
                plan.popular ? "bg-navy text-gold shadow-navy/40" : "bg-navy/5 text-navy border border-navy/5 shadow-none hover:bg-navy/10"
              )}
            >
              Initialize {plan.name}
            </Button>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-navy/[0.01] rounded-full pointer-events-none group-hover:bg-gold/[0.05] transition-colors duration-1000" />
          </div>
        ))}

        {/* Action Layer */}
        <div className="fixed bottom-0 left-0 right-0 p-10 bg-white/95 backdrop-blur-3xl border-t border-navy/5 z-50 rounded-t-[54px] shadow-3xl">
          <div className="max-w-[440px] mx-auto italic">
            <Button 
              onClick={() => navigate('/book')}
              className="w-full h-24 rounded-[32px] bg-navy text-gold font-bold text-[20px] shadow-3xl shadow-navy/40 flex items-center justify-center gap-6 uppercase tracking-[0.35em] active:scale-95 transition-all hover:bg-navy/95 italic underline-offset-8"
            >
              Continue Calibration
              <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
;

export default AMCEnrollmentVariant;
