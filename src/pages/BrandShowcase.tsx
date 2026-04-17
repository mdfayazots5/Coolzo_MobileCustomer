import React from 'react';
import { Logo } from '@/components/Logo';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BrandShowcase() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center p-12 font-sans selection:bg-gold selection:text-navy">
      <button 
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 flex items-center gap-2 text-white/40 hover:text-gold transition-colors z-50"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to App</span>
      </button>

      <div className="max-w-4xl w-full space-y-8">
        {/* Main Composition Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-video bg-[#050505] p-12 rounded-3xl shadow-2xl flex flex-col gap-8 relative overflow-hidden"
        >
          {/* Grid background texture - subtle */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* Top Section: Primary Horizontal Logo */}
          <div className="flex-1 bg-navy rounded-2xl flex items-center justify-center relative shadow-lg group">
            <Logo variant="white" className="scale-125 transition-transform group-hover:scale-[1.3]" />
            <div className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-widest text-white/10">Primary Identity</div>
          </div>

          {/* Bottom Section: App Icon and Symbol Series */}
          <div className="h-1/2 flex gap-8">
            {/* App Icon */}
            <div className="flex-1 bg-transparent flex flex-col gap-4">
              <div className="flex-1 bg-[#0B1F3A] rounded-[48px] flex items-center justify-center shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Logo iconOnly variant="white" className="scale-[2.2]" />
              </div>
              <div className="flex justify-between items-center px-4">
                <span className="text-white/20 font-bold text-[9px] uppercase tracking-[0.3em]">App Icon</span>
                <span className="text-white/20 font-bold text-[9px] uppercase tracking-[0.3em]">iOS/Android</span>
              </div>
            </div>

            {/* Symbol & Favicon */}
            <div className="aspect-square bg-navy rounded-2xl flex flex-col items-center justify-center gap-8 relative shadow-lg">
              <Logo iconOnly variant="white" className="scale-110" />
              <div className="flex gap-4 items-end">
                <div className="w-8 h-8 rounded-sm bg-black/20 flex items-center justify-center">
                  <Logo iconOnly variant="white" className="scale-[0.4]" />
                </div>
                <div className="w-4 h-4 rounded-[2px] bg-black/20 flex items-center justify-center">
                  <Logo iconOnly variant="white" className="scale-[0.2]" />
                </div>
              </div>
              <div className="absolute bottom-4 text-[9px] font-bold uppercase tracking-[0.3em] text-white/10">Symbol Series</div>
            </div>
          </div>
        </motion.div>

        {/* Labels and Technical details */}
        <div className="flex justify-between items-end border-t border-white/5 pt-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-gold font-display font-medium text-lg leading-none">COOLZO</h2>
              <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">Brand Identity System V1.0</p>
            </div>
            <div className="flex gap-12">
              <div className="space-y-1">
                <div className="text-white/20 font-bold text-[8px] uppercase tracking-widest">Navy</div>
                <div className="text-white font-mono text-[10px]">#0B1F3A</div>
              </div>
              <div className="space-y-1">
                <div className="text-white/20 font-bold text-[8px] uppercase tracking-widest">Gold</div>
                <div className="text-white font-mono text-[10px]">#C9A24A</div>
              </div>
              <div className="space-y-1">
                <div className="text-white/20 font-bold text-[8px] uppercase tracking-widest">Warm White</div>
                <div className="text-white font-mono text-[10px]">#F8F9FA</div>
              </div>
            </div>
          </div>

          <div className="text-right space-y-2">
            <p className="text-white/10 text-[9px] max-w-[240px] leading-relaxed uppercase tracking-tighter">
              A bold geometric monogram built from the letter "C" redrawn as a near-complete circle with a 45-degree airflow slash. Architectural. singular. Ownable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
