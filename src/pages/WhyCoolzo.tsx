import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Check, X, ShieldCheck, Clock, Award, Users, ArrowLeft, CheckCircle2, Zap, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function WhyCoolzo() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Advantage Header */}
      <div className="bg-navy px-8 pt-20 pb-24 text-warm-white rounded-b-[60px] relative overflow-hidden shadow-2xl shadow-navy/40">
        <div className="flex items-center gap-5 mb-12 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-95 transition-all shadow-2xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="space-y-1">
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none">The Coolzo Edge</h1>
            <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">Competitive Advantage Matrix</p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-[44px] font-display font-bold text-white tracking-tighter leading-[0.9] max-w-[280px]">
            Institutional <span className="text-gold italic">Elite.</span>
          </h2>
          <p className="text-warm-white/40 text-[15px] max-w-[300px] leading-relaxed font-medium italic">
            "Engineered for the discerning elite, our operative standards redefine the industry baseline."
          </p>
        </div>
        
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="px-8 -mt-12 relative z-20 space-y-20">
        {/* Comparison Console */}
        <section className="space-y-8">
          <div className="flex items-end justify-between px-4">
            <div className="space-y-2">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-navy/20">Comparative Diagnostics</h3>
              <h2 className="text-[28px] font-display font-bold text-navy tracking-tighter leading-none">The Delta Factor</h2>
            </div>
          </div>

          <div className="bg-white rounded-[48px] border border-navy/5 shadow-2xl shadow-black/[0.01] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy/5 border-b border-navy/5">
                  <th className="p-8 text-[11px] font-bold uppercase tracking-widest text-navy/40">Parameter</th>
                  <th className="p-8 text-[11px] font-bold uppercase tracking-widest text-gold text-center bg-navy shadow-inner">Elite</th>
                  <th className="p-8 text-[11px] font-bold uppercase tracking-widest text-navy/20 text-center">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/[0.02]">
                {[
                  { label: 'Technical Mastery', elite: true, others: false },
                  { label: 'Verified Integrity', elite: true, others: 'Partial' },
                  { label: 'Punctuality Precision', elite: '99.8%', others: 'Variable' },
                  { label: 'Tool Sanitization', elite: true, others: false },
                  { label: 'Fixed Pricing Matrix', elite: true, others: false },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-gold/[0.02] transition-colors">
                    <td className="p-8 font-bold text-navy/60 text-[14px] group-hover:text-navy transition-colors">{row.label}</td>
                    <td className="p-8 bg-navy/5 shadow-inner">
                      <div className="flex justify-center">
                        {row.elite === true ? (
                          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold shadow-inner border border-gold/20">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : typeof row.elite === 'string' ? (
                          <span className="text-gold font-mono font-bold text-[12px] tracking-widest bg-navy px-3 py-1 rounded-full">{row.elite}</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex justify-center">
                        {row.others === false ? (
                          <X className="w-5 h-5 text-navy/10" />
                        ) : (
                          <span className="text-navy/20 font-bold text-[11px] uppercase tracking-widest">{row.others}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pillars of Excellence Matrix */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-navy/20">Institutional Foundations</h3>
            <h2 className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none">Pillars of Excellence</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[
              { 
                icon: ShieldCheck, 
                title: 'Uncompromised Safety', 
                desc: 'Rigorous background clearance and operational telemetry monitoring for every dispatch.',
                color: 'gold' 
              },
              { 
                icon: Clock, 
                title: 'Chronos Precision', 
                desc: 'Punctuality is not a goal; it is a baseline. 99% on-time deployment record.',
                color: 'navy' 
              },
              { 
                icon: Zap, 
                title: 'Reactive Mastery', 
                desc: 'Rapid intervention protocols for emergency scenarios with sub-30 minute response.',
                color: 'gold' 
              },
              { 
                icon: Medal, 
                title: 'Certified Expertise', 
                desc: 'Technicians under go continuous tactical upskilling in our internal excellence labs.',
                color: 'navy' 
              }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[48px] border border-navy/5 shadow-2xl shadow-black/[0.01] flex flex-col gap-6 group hover:border-gold/30 transition-all active:scale-[0.99]"
              >
                <div className={cn(
                  "w-16 h-16 rounded-[28px] flex items-center justify-center shadow-inner group-hover:dark transition-all duration-700",
                  pillar.color === 'gold' ? "bg-gold/5 text-gold group-hover:bg-gold group-hover:text-navy" : "bg-navy/5 text-navy group-hover:bg-navy group-hover:text-gold"
                )}>
                  <pillar.icon className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-[22px] font-display font-bold text-navy tracking-tight">{pillar.title}</h4>
                  <p className="text-navy/40 text-[14px] leading-relaxed font-medium italic">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final Institutional CTA */}
        <section className="py-20">
          <div className="bg-navy rounded-[60px] p-12 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-navy/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent opacity-50" />
            <div className="relative z-10 space-y-4">
              <h2 className="text-[36px] font-display font-bold text-gold tracking-tighter leading-none mb-4">Demand Perfection.</h2>
              <p className="text-warm-white/40 text-[15px] font-medium leading-relaxed max-w-[280px] mx-auto opacity-60">
                Stop compromising on basic service. Experience the institutional elite today.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/app/services')}
              className="relative z-10 w-full h-20 rounded-[28px] bg-gold text-navy font-bold text-[18px] uppercase tracking-[0.3em] shadow-2xl shadow-gold/20 active:scale-95 transition-all"
            >
              Book Elite Slot
            </Button>
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-[60px]" />
          </div>
        </section>
      </div>
    </div>
  );
}
