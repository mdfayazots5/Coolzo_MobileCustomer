import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Heart, Target, Shield, Users, Globe, Loader2 } from 'lucide-react';
import { ContentService } from '@/services/contentService';
import { cn } from '@/lib/utils';

export default function AboutUs() {
  const navigate = useNavigate();
  const [about, setAbout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await ContentService.getAboutContent();
        setAbout(data);
      } catch (error) {
        console.error('Failed to fetch about content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.03] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />

      {/* Genesis Header */}
      <div className="px-8 pt-16 pb-32 bg-navy text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <button 
          onClick={() => navigate('/app')}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white mb-12 active:scale-90 transition-all shadow-3xl"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div className="relative z-10 space-y-4 italic">
          <h1 className="text-[44px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Our Genesis</h1>
          <p className="text-warm-white/30 text-[12px] font-bold uppercase tracking-[0.4em] leading-none">Establishing the Gold Standard</p>
        </div>
        <Shield className="absolute -right-20 -bottom-20 w-[420px] h-[420px] text-warm-white/[0.03] rotate-12 pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-16 py-12 space-y-20 relative z-30 italic">
        {/* Narrative cluster */}
        <section className="bg-white rounded-[72px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.01] space-y-12 relative overflow-hidden">
          <div className="inline-flex items-center gap-4 px-8 py-3 bg-gold/5 text-gold rounded-full border border-gold/10">
            <Globe className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-[0.4em]">Institutional Reach</span>
          </div>
          <div className="space-y-8">
            <h2 className="text-[40px] font-display font-bold text-navy tracking-tighter leading-none uppercase">The Protocol</h2>
            <div className="space-y-8">
              <p className="text-navy/60 leading-relaxed text-[18px] font-bold uppercase tracking-tight italic border-l-4 border-gold/30 pl-8">
                {about?.vision || "Coolzo was meticulously engineered to solve the systemic fragmentation within the appliance logistics sector. We believe technology and transparency are the twin pillars of modern climate care."}
              </p>
              <p className="text-navy/40 leading-relaxed text-[16px] font-bold uppercase tracking-widest pl-9">
                {about?.mission || "Today, we stand as India's premier institutional-grade AC service platform, serving over 50,000 discerning households and corporate infrastructures with an elite corps of certified technicians."}
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.02] rounded-bl-full pointer-events-none" />
        </section>

        {/* DNA Values Matrix */}
        <section className="space-y-12 px-4">
          <div className="text-center space-y-3">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-navy/20">Core Principles</h3>
            <h2 className="text-[36px] font-display font-bold text-navy tracking-tighter uppercase">Institutional DNA</h2>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {[
              { icon: Heart, title: 'Patron Focus', color: 'text-red-400', bg: 'bg-red-50/50' },
              { icon: Target, title: 'Precision', color: 'text-blue-400', bg: 'bg-blue-50/50' },
              { icon: Shield, title: 'Integrity', color: 'text-green-500', bg: 'bg-green-50/50' },
              { icon: Users, title: 'Expertise', color: 'text-gold', bg: 'bg-gold/5' }
            ].map((value, i) => (
              <div key={i} className="bg-white p-10 rounded-[56px] border border-navy/5 shadow-3xl shadow-black/[0.01] flex flex-col items-center text-center group active:scale-95 transition-all">
                <div className={cn("w-20 h-20 rounded-[32px] flex items-center justify-center mb-8 transition-all group-hover:bg-navy group-hover:text-white group-hover:scale-105 shadow-inner", value.bg)}>
                  <value.icon className={cn("w-10 h-10 transition-colors group-hover:text-gold", value.color)} />
                </div>
                <span className="text-[12px] font-bold text-navy uppercase tracking-[0.4em] leading-tight">{value.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Institutional Scale stats */}
        <section className="bg-navy rounded-[72px] p-16 grid grid-cols-2 gap-12 border border-white/5 shadow-3xl shadow-navy/60 relative overflow-hidden">
          {about?.stats?.map((stat: any, i: number) => (
            <div key={i} className="text-center space-y-3 relative z-10">
              <div className="text-[48px] font-display font-bold text-gold tracking-tighter leading-none uppercase">{stat.value}</div>
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-warm-white/20 leading-none">{stat.label}</p>
            </div>
          )) || (
            <>
              <div className="text-center space-y-3 relative z-10">
                <div className="text-[48px] font-display font-bold text-gold tracking-tighter leading-none uppercase">05+</div>
                <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-warm-white/20 leading-none">Years Service</p>
              </div>
              <div className="text-center space-y-3 relative z-10">
                <div className="text-[48px] font-display font-bold text-gold tracking-tighter leading-none uppercase">12+</div>
                <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-warm-white/20 leading-none">Strategic Hubs</p>
              </div>
            </>
          )}
          <div className="absolute inset-0 bg-gold/5 blur-[100px] pointer-events-none" />
        </section>

        {/* Ethical Compact */}
        <section className="bg-gold rounded-[84px] p-12 shadow-[0_40px_80px_-20px_rgba(201,162,74,0.4)] relative overflow-hidden group active:scale-[0.99] transition-all">
          <div className="flex items-center gap-8 mb-10">
            <div className="w-18 h-18 rounded-[28px] bg-navy flex items-center justify-center text-gold shadow-3xl shadow-navy/40">
              <Shield className="w-9 h-9" />
            </div>
            <h3 className="text-[28px] font-display font-bold text-navy tracking-tight leading-none uppercase italic">Ethical Compact</h3>
          </div>
          <p className="text-navy/70 text-[18px] leading-relaxed italic font-bold uppercase tracking-tight">
            "We treat every client infrastructure with sovereign respect, providing transparent logistics and ensuring peak mechanical performance. If the protocol fails, we rectify instantly."
          </p>
          <Shield className="absolute -right-16 -bottom-16 w-64 h-64 text-navy/[0.03] rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-[3000ms]" />
        </section>
      </div>
    </div>
  );
}
