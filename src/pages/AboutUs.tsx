import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Target, Shield, Users, Globe } from 'lucide-react';

export default function AboutUs() {
  const navigate = useNavigate();

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
        <h1 className="text-3xl font-display font-bold text-gold mb-2">Our Story</h1>
        <p className="text-warm-white/60 text-sm">Redefining AC service standards since 2018.</p>
      </div>

      <div className="px-6 py-10 space-y-12">
        {/* Narrative */}
        <section>
          <h2 className="text-xl font-display font-bold text-navy mb-4">The Coolzo Journey</h2>
          <p className="text-navy/60 leading-relaxed text-sm">
            Coolzo was born out of a simple frustration: the lack of professional, reliable, and transparent AC services in India. We realized that while ACs are essential for comfort, the service industry was fragmented and untrustworthy.
          </p>
          <p className="text-navy/60 leading-relaxed text-sm mt-4">
            Today, we are proud to be India's most trusted premium AC service platform, serving over 50,000 households and businesses with a team of 500+ certified technicians.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-xl font-display font-bold text-navy mb-6">Core Values</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, title: 'Customer First', color: 'text-red-500' },
              { icon: Target, title: 'Precision', color: 'text-blue-500' },
              { icon: Shield, title: 'Integrity', color: 'text-green-500' },
              { icon: Users, title: 'Expertise', color: 'text-gold' }
            ].map((value, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-navy/5 shadow-sm flex flex-col items-center text-center">
                <value.icon className={cn("w-8 h-8 mb-3", value.color)} />
                <span className="text-xs font-bold text-navy">{value.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-navy rounded-[32px] p-8 grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-gold">5+</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-warm-white/40 mt-1">Years</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-gold">12+</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-warm-white/40 mt-1">Cities</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-gold">50k+</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-warm-white/40 mt-1">Services</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-gold">4.9</div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-warm-white/40 mt-1">Rating</p>
          </div>
        </section>

        {/* The Promise */}
        <section className="bg-gold/10 rounded-[32px] p-8 border border-gold/20">
          <h3 className="text-xl font-display font-bold text-navy mb-4">The Coolzo Promise</h3>
          <p className="text-navy/70 text-sm leading-relaxed italic">
            "We promise to treat your home with respect, provide transparent pricing, and ensure your AC runs at peak efficiency. If you're not satisfied, we'll make it right. That's the Coolzo guarantee."
          </p>
        </section>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
