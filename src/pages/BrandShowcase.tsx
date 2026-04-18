import React from 'react';
import { Logo } from '@/components/Logo';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function BrandShowcase() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warm-white flex flex-col items-center justify-start p-10 pt-32 font-sans selection:bg-gold selection:text-navy pb-40">
      <button 
        onClick={() => navigate('/')}
        className="fixed top-12 left-8 flex items-center gap-5 text-navy/40 hover:text-gold transition-all z-50 group px-8 py-4 bg-white/80 backdrop-blur-2xl rounded-full border border-navy/5 shadow-2xl active:scale-95"
      >
        <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-inner">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Institutional Core</span>
      </button>

      <div className="max-w-5xl w-full space-y-24">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <h2 className="text-navy font-display font-bold text-[56px] leading-none tracking-tighter">Visual <span className="text-gold">Infrastructure</span></h2>
          <p className="text-navy/20 font-mono text-[10px] uppercase tracking-[0.6em] font-bold">Brand Artifact Specification v3.0 // Master Registry</p>
        </div>

        {/* Main Composition Box */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="aspect-video bg-white p-16 rounded-[60px] shadow-2xl flex flex-col gap-12 relative overflow-hidden border border-navy/5"
        >
          {/* Grid background texture - subtle */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0B1F3A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Top Section: Primary Horizontal Logo */}
          <div className="flex-1 bg-navy rounded-[40px] flex items-center justify-center relative shadow-2xl group border border-white/5 overflow-hidden shadow-navy/40">
            <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <Logo variant="white" className="scale-[1.8] transition-transform group-hover:scale-[1.9] duration-[3000ms]" />
            <div className="absolute top-10 left-10 text-[10px] font-bold uppercase tracking-[0.4em] text-white/5">Primary Identity Matrix</div>
          </div>

          {/* Bottom Section: App Icon and Symbol Series */}
          <div className="h-1/2 flex gap-12">
            {/* App Icon */}
            <div className="flex-1 bg-transparent flex flex-col gap-6">
              <div className="flex-1 bg-navy rounded-[48px] flex items-center justify-center shadow-2xl shadow-navy/20 relative overflow-hidden group border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <Logo iconOnly variant="white" className="scale-[3.2] transition-transform group-hover:scale-[3.5] duration-[3000ms]" />
              </div>
              <div className="flex justify-between items-center px-6">
                <span className="text-navy/20 font-bold text-[10px] uppercase tracking-[0.4em]">Artifact Scale</span>
                <span className="text-navy/20 font-bold text-[10px] uppercase tracking-[0.4em]">120pt • 240pt</span>
              </div>
            </div>

            {/* Symbol & Favicon */}
            <div className="aspect-square bg-white rounded-[48px] flex flex-col items-center justify-center gap-12 relative shadow-2xl border border-navy/5 group overflow-hidden">
              <div className="absolute inset-0 bg-navy opacity-0 group-hover:opacity-5 transition-opacity" />
              <Logo iconOnly variant="navy" className="scale-[1.5] transition-transform group-hover:rotate-12 duration-1000" />
              <div className="flex gap-6 items-end">
                <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center border border-navy/10 shadow-inner group-hover:bg-gold group-hover:text-navy transition-all duration-500">
                  <Logo iconOnly variant="navy" className="scale-[0.6] group-hover:variant-none" />
                </div>
                <div className="w-6 h-6 rounded-lg bg-navy/5 flex items-center justify-center border border-navy/10 shadow-inner">
                  <Logo iconOnly variant="navy" className="scale-[0.25]" />
                </div>
              </div>
              <div className="absolute bottom-6 text-[9px] font-bold uppercase tracking-[0.5em] text-navy/10">Glyph Dynamics</div>
            </div>
          </div>
        </motion.div>

        {/* Labels and Technical details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 pt-12 border-t border-navy/5">
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-navy font-display font-bold text-[28px] tracking-tight">Chromatic Variables</h3>
              <p className="text-navy/40 text-[14px] leading-relaxed font-medium italic">Defined for high-precision rendering across institutional touchpoints.</p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {[
                { label: 'Brand Navy', hex: '#0B1F3A', class: 'bg-navy' },
                { label: 'Accent Gold', hex: '#C9A24A', class: 'bg-gold' },
                { label: 'Warm Ground', hex: '#F8F9FA', class: 'bg-warm-white' }
              ].map((color, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white rounded-[32px] border border-navy/5 shadow-sm group hover:border-gold/30 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={cn("w-14 h-14 rounded-[20px] shadow-2xl border border-black/5", color.class)} />
                    <div className="space-y-1">
                      <p className="text-navy font-bold text-[15px] tracking-tight">{color.label}</p>
                      <p className="text-navy/20 font-mono text-[10px] uppercase tracking-widest">{color.hex}</p>
                    </div>
                  </div>
                  <div className="text-navy/10 font-mono text-[10px] font-bold group-hover:text-gold transition-colors">HEX/SRGB</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-navy font-display font-bold text-[28px] tracking-tight">Philosophy</h3>
              <p className="text-navy/40 text-[14px] leading-relaxed font-medium">
                Our visual identity is a testament to structural integrity and modular efficiency. 
              </p>
            </div>
            <div className="bg-navy p-10 rounded-[48px] text-warm-white/60 space-y-8 relative overflow-hidden shadow-2xl shadow-navy/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 to-transparent" />
              <p className="text-[14px] leading-relaxed italic relative z-10">
                "Engineering a bold geometric monogram from the C primitive. Reimagined with precision and institutional force. The visual system exists to reinforce the elite nature of our dispatch grid."
              </p>
              <div className="flex items-center justify-between border-t border-white/5 pt-8 relative z-10">
                <div className="space-y-1">
                  <p className="text-gold font-display font-bold text-[18px]">Coolzo Creative</p>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-bold">Artisan Lab / Core</p>
                </div>
                <Logo iconOnly variant="white" className="scale-[0.8] opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
