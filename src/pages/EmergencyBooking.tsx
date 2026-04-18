import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Zap, ShieldCheck, Clock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { BookingService } from '@/services/bookingService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const EmergencyBooking = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmergencyDispatch = async () => {
    if (!user) {
      toast.error('Identity verification required for emergency dispatch.');
      navigate('/app/auth-gate');
      return;
    }

    setIsSubmitting(true);
    try {
      const jobId = await BookingService.createEmergencyBooking({
        userId: user.uid,
        serviceId: 'emergency-ac-repair',
        subServiceId: 'emergency-ac-repair-standard',
        location: {}, 
        contact: { name: user.name || 'Guest', phone: 'User Phone' },
        price: 999, 
      });
      toast.success('Crisis intervention mission confirmed. Dispatch imminent.');
      navigate(`/app/job-tracker/${jobId}`);
    } catch (error) {
      toast.error('Dispatch synchronization failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="bg-red-600 px-6 pt-12 pb-24 text-white rounded-b-[60px] relative overflow-hidden shadow-2xl shadow-red-600/40">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-10 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-red-600 shadow-2xl shadow-black/20 animate-bounce">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-[32px] font-display font-bold tracking-tighter leading-none">Crisis Intervention</h1>
          </div>
          <p className="text-white/80 text-[14px] leading-relaxed max-w-[320px] font-medium">
            Immediate mechanical failure? Life-safety hazard? We prioritize emergency payloads with a <span className="text-white font-bold underline underline-offset-4">60-minute terminal response</span>.
          </p>
        </div>
        
        <AlertTriangle className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5 rotate-12 pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-48 h-48 bg-white/5 rounded-full blur-[80px]" />
      </div>

      <div className="px-6 -mt-10 py-12 space-y-16 relative z-30">
        {/* Why choose Emergency? */}
        <section className="space-y-10">
          <div className="flex items-end justify-between px-4">
            <div className="space-y-2">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-navy/20">Operational Superiority</h3>
              <h2 className="text-[28px] font-display font-bold text-navy tracking-tighter leading-none">Instant Resolution</h2>
            </div>
          </div>
          <div className="space-y-6">
            {[
              { icon: Zap, label: '60 Min Deployment', desc: 'Sovereign response team reaches your sector in under an hour.' },
              { icon: ShieldCheck, label: 'Masters Only', desc: 'Exclusively Level 3 institutional operatives handle crisis telemetry.' },
              { icon: Clock, label: 'Perpetual Readiness', desc: 'Our emergency logistics grid remains active 24/7/365.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 p-8 bg-white rounded-[40px] border border-red-100 shadow-2xl shadow-red-600/[0.02] group active:scale-[0.99] transition-all">
                <div className="w-16 h-16 rounded-[24px] bg-red-50 flex items-center justify-center text-red-600 shrink-0 shadow-inner group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-navy text-[18px] tracking-tight">{item.label}</h4>
                  <p className="text-[13px] text-navy/40 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Module */}
        <section className="bg-navy rounded-[48px] p-10 border border-white/5 shadow-2xl shadow-navy/40 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Priority Premium</p>
              <h4 className="text-[20px] font-bold text-white tracking-tight">Emergency Dispatch Fee</h4>
            </div>
            <div className="text-[32px] font-display font-bold text-red-400 tracking-tighter leading-none">+₹499</div>
          </div>
          <p className="text-[11px] text-white/30 leading-relaxed font-medium relative z-10 uppercase tracking-widest">
            *Applied to standard mission rates for 24/7 priority synchronization.
          </p>
          <AlertTriangle className="absolute -right-10 -bottom-10 w-40 h-40 text-white/[0.03] -rotate-12 pointer-events-none group-hover:rotate-12 transition-transform duration-[2000ms]" />
        </section>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/95 backdrop-blur-2xl border-t border-navy/5 z-50 rounded-t-[40px] shadow-2xl">
        <div className="max-w-[440px] mx-auto min-h-[72px] flex items-center">
          <Button 
            onClick={handleEmergencyDispatch}
            disabled={isSubmitting}
            className="w-full h-20 rounded-[28px] bg-red-600 hover:bg-red-700 text-white font-bold text-[18px] uppercase tracking-[0.25em] shadow-2xl shadow-red-600/40 active:scale-95 transition-all flex items-center gap-5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-7 h-7 animate-spin" />
                <span>Synchronizing...</span>
              </>
            ) : (
              <>
                <Zap className="w-7 h-7" />
                <span>Confirm Dispatch</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBooking;
