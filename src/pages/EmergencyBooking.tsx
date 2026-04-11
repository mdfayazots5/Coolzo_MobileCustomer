import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Zap, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const EmergencyBooking = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-error p-8 text-white rounded-b-[40px] relative overflow-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-8"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
            <h1 className="text-2xl font-display font-bold">Emergency Service</h1>
          </div>
          <p className="text-white/80 text-sm leading-relaxed max-w-[280px]">
            AC breakdown? Gas leak? Water dripping? We prioritize emergency requests with 60-minute response time.
          </p>
        </div>
        
        <AlertTriangle className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 rotate-12" />
      </div>

      <div className="p-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-display font-bold text-navy">Why choose Emergency?</h2>
          <div className="space-y-4">
            {[
              { icon: Zap, label: '60 Min Response', desc: 'Technician reaches your doorstep in under an hour.' },
              { icon: ShieldCheck, label: 'Senior Experts', desc: 'Only Level 3 certified technicians handle emergencies.' },
              { icon: Clock, label: '24/7 Availability', desc: 'Even at 3 AM, our emergency team is ready.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-border shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-navy text-sm">{item.label}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-navy/5 rounded-3xl p-6 border border-dashed border-navy/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-navy/40 uppercase tracking-widest">Emergency Fee</span>
            <span className="text-lg font-display font-bold text-error">+₹499</span>
          </div>
          <p className="text-[10px] text-navy/40 leading-relaxed">
            *This fee is added to the standard service charges for priority dispatch and 24/7 support.
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-lg border-t border-border">
          <Button 
            onClick={() => navigate('/book', { state: { isEmergency: true } })}
            className="w-full h-16 rounded-[24px] bg-error text-white font-bold text-lg shadow-xl shadow-error/20"
          >
            Confirm Emergency Dispatch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBooking;
