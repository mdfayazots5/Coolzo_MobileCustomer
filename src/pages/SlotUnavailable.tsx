import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarX, Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SlotUnavailable = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center bg-warm-white relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-navy/[0.02] rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/[0.02] rounded-tr-full pointer-events-none" />

      <div className="w-32 h-32 bg-navy/5 rounded-[48px] flex items-center justify-center text-navy/10 mb-12 shadow-inner border border-navy/5 relative group active:scale-95 transition-all">
        <CalendarX className="w-16 h-16 group-hover:rotate-12 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gold/5 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="space-y-4 mb-16">
        <h1 className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none">Capacity Saturation</h1>
        <p className="text-navy/40 text-[15px] font-bold uppercase tracking-[0.25em] max-w-[320px] mx-auto leading-relaxed">
          Our elite operative grid is currently fully engaged in your sector for the selected temporal window.
        </p>
      </div>

      <div className="w-full max-w-[400px] space-y-8 relative z-10">
        {/* Notify Card */}
        <div className="bg-white p-10 rounded-[48px] border border-navy/5 shadow-2xl shadow-black/[0.01] text-left relative overflow-hidden group active:scale-[0.99] transition-all">
          <div className="flex items-center gap-6 mb-8 relative z-10">
            <div className="w-14 h-14 rounded-[20px] bg-gold/10 flex items-center justify-center text-gold shadow-inner group-hover:rotate-12 transition-transform">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-navy text-[18px] tracking-tight">Active Surveillance</p>
              <p className="text-[11px] font-bold text-navy/30 uppercase tracking-[0.2em]">Notify on slot opening</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full h-16 rounded-[20px] border-navy/5 bg-navy/5 text-navy/40 font-bold text-[13px] uppercase tracking-[0.3em] active:scale-95 transition-all hover:bg-navy/10 hover:text-navy"
            onClick={() => {}}
          >
            Enable Intelligence
          </Button>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.03] rounded-bl-full pointer-events-none" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate(-1)}
            className="w-full h-20 rounded-[28px] bg-navy text-gold font-bold text-[16px] uppercase tracking-[0.3em] shadow-2xl shadow-navy/40 active:scale-95 transition-all"
          >
            Temporal Recalibration
          </Button>

          <Button 
            variant="ghost"
            onClick={() => navigate('/app/contact')}
            className="w-full h-16 rounded-[24px] text-navy/30 font-bold text-[12px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 active:scale-95 transition-all hover:text-navy"
          >
            Concierge Support
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlotUnavailable;
