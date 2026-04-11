import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Clock, Calendar, Shield, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AMCVisitDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-border sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-navy">AMC Visit Details</h1>
            <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Visit #0{id || 1}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Status Banner */}
        <div className="bg-navy rounded-[32px] p-8 text-warm-white relative overflow-hidden">
          <div className="relative z-10">
            <Badge className="bg-gold/20 text-gold border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1 mb-4">
              Scheduled
            </Badge>
            <h2 className="text-2xl font-display font-bold text-gold mb-2">Preventive Maintenance</h2>
            <p className="text-warm-white/60 text-sm leading-relaxed">
              This is your 2nd of 4 scheduled maintenance visits for your Premium AMC plan.
            </p>
          </div>
          <Shield className="absolute -right-10 -bottom-10 w-48 h-48 text-warm-white/5" />
        </div>

        {/* Schedule Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] border border-border">
            <Calendar className="w-6 h-6 text-gold mb-3" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">Date</p>
            <p className="text-sm font-bold text-navy">24 Apr 2026</p>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-border">
            <Clock className="w-6 h-6 text-gold mb-3" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">Time Slot</p>
            <p className="text-sm font-bold text-navy">10 AM - 12 PM</p>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Visit Checklist</h3>
          <div className="bg-white rounded-[32px] border border-border p-6 space-y-4">
            {[
              'Filter cleaning & disinfection',
              'Cooling coil inspection',
              'Drain tray & pipe cleaning',
              'Gas pressure check',
              'Electrical safety audit',
              'Remote control functionality'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-navy/5 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-navy/20" />
                </div>
                <span className="text-xs font-medium text-navy/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gold/5 rounded-3xl p-6 flex gap-4 border border-gold/10">
          <Info className="w-5 h-5 text-gold shrink-0" />
          <p className="text-[10px] text-navy/60 leading-relaxed font-medium">
            AMC visits are pre-paid. No additional charges apply for labor or standard cleaning supplies. Spare parts, if needed, will be charged separately.
          </p>
        </div>

        {/* Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-border z-40">
          <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-16 rounded-[24px] border-border text-navy font-bold">
              Reschedule
            </Button>
            <Button className="h-16 rounded-[24px] bg-navy text-gold font-bold shadow-card">
              Confirm Slot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMCVisitDetail;
