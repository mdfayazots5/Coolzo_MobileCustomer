import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, X, ShieldCheck, Clock, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WhyCoolzo() {
  const navigate = useNavigate();

  const comparison = [
    { feature: 'Technician Quality', coolzo: 'Certified & Verified', others: 'Unskilled/Freelance' },
    { feature: 'Service Warranty', coolzo: '30-Day Guarantee', others: 'No Warranty' },
    { feature: 'Pricing', coolzo: 'Fixed & Transparent', others: 'Hidden Charges' },
    { feature: 'Tracking', coolzo: 'Real-time GPS', others: 'Vague Timelines' },
    { feature: 'Spare Parts', coolzo: 'Genuine OEM', others: 'Local/Refurbished' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-12">
      {/* Header */}
      <div className="px-6 py-8 bg-navy text-warm-white rounded-b-[40px]">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-display font-bold text-gold mb-2">The Coolzo Edge</h1>
        <p className="text-warm-white/60 text-sm">Why 50,000+ customers trust us with their cooling.</p>
      </div>

      <div className="px-6 py-10 space-y-12">
        {/* Comparison Table */}
        <section>
          <h2 className="text-xl font-display font-bold text-navy mb-6">Coolzo vs. Others</h2>
          <div className="bg-white rounded-[32px] overflow-hidden border border-navy/5 shadow-xl">
            <div className="grid grid-cols-3 bg-navy/5 p-4 border-b border-navy/10">
              <div className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Feature</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gold text-center">Coolzo</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-navy/40 text-center">Others</div>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-4 border-b border-navy/5 last:border-0 items-center">
                <div className="text-xs font-bold text-navy">{row.feature}</div>
                <div className="text-[10px] font-bold text-navy text-center bg-gold/10 py-2 rounded-xl border border-gold/20">
                  {row.coolzo}
                </div>
                <div className="text-[10px] font-medium text-navy/40 text-center">
                  {row.others}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars */}
        <section className="grid grid-cols-1 gap-6">
          {[
            { icon: ShieldCheck, title: 'Safety First', desc: 'Every technician undergoes a 3-step background verification process.' },
            { icon: Clock, title: 'Punctuality', desc: '98% of our services start exactly on time. We value your schedule.' },
            { icon: Award, title: 'Certified Parts', desc: 'We only use genuine spare parts sourced directly from manufacturers.' },
            { icon: Users, title: 'Expert Team', desc: 'Our technicians have an average of 8+ years of experience in AC systems.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-5 p-6 bg-white rounded-3xl border border-navy/5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h4 className="font-display font-bold text-navy mb-1">{item.title}</h4>
                <p className="text-navy/60 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="bg-navy rounded-[32px] p-8 text-center">
          <h3 className="text-xl font-display font-bold text-gold mb-2">Ready for a better experience?</h3>
          <p className="text-warm-white/60 text-sm mb-6">Join the premium AC service revolution today.</p>
          <Button 
            className="w-full h-14 rounded-2xl bg-gold text-navy hover:bg-gold/90 font-bold text-lg"
            onClick={() => navigate('/services')}
          >
            Book a Service Now
          </Button>
        </div>
      </div>
    </div>
  );
}
