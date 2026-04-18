import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Clock, Calendar, Shield, Info, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AMCService } from '@/services/amcService';

const AMCVisitDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [visit, setVisit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisit = async () => {
      if (!id) return;
      try {
        const data = await AMCService.getVisitDetail(id);
        setVisit(data);
      } catch (error) {
        console.error('Failed to fetch visit detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVisit();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-12 text-center bg-warm-white italic">
        <h2 className="text-[32px] font-display font-bold text-navy mb-8 uppercase tracking-tighter leading-none">Inquiry Nullified</h2>
        <Button onClick={() => navigate(-1)} className="bg-navy text-gold font-bold rounded-2xl px-12 h-18 uppercase tracking-[0.3em] shadow-3xl shadow-navy/40 active:scale-95 transition-all">Return to Registry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Intelligence Header */}
      <div className="px-8 pt-16 pb-24 bg-navy text-warm-white rounded-b-[72px] relative overflow-hidden shadow-3xl shadow-navy/40 z-20">
        <div className="flex items-center gap-8 relative z-10 italic">
          <button 
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform shadow-3xl"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="space-y-3">
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Visit Intelligence</h1>
            <p className="text-warm-white/40 text-[11px] font-bold uppercase tracking-[0.4em] leading-none">Deployment Protocol • Trace: {visit.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
        <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="px-8 py-16 space-y-20 relative z-30">
        {/* Status Banner Dossier */}
        <div className="bg-navy rounded-[72px] p-16 text-warm-white relative overflow-hidden shadow-3xl shadow-navy/60 group italic">
          <div className="relative z-10 flex flex-col items-start gap-12">
            <Badge className="bg-gold/10 text-gold border border-gold/20 font-bold text-[10px] uppercase tracking-[0.5em] px-10 py-3 rounded-full shadow-3xl shadow-gold/10">
              {visit.status} Protocol
            </Badge>
            <div className="space-y-6">
              <h2 className="text-[48px] font-display font-bold text-gold leading-none tracking-tighter uppercase">System Sanitization</h2>
              <p className="text-warm-white/40 text-[16px] font-bold leading-relaxed max-w-[340px] uppercase tracking-tight">
                {visit.notes || 'Full diagnostic evaluation and deep cleaning scheduled for your appliance infrastructure.'}
              </p>
            </div>
          </div>
          <Shield className="absolute -right-24 -bottom-24 w-80 h-80 text-warm-white/[0.03] rotate-12 group-hover:rotate-[30deg] transition-transform duration-[3000ms]" />
        </div>

        {/* Schedule Precision Matrix */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[60px] border border-navy/5 shadow-3xl shadow-black/[0.01] hover:border-gold/30 transition-all group italic">
            <div className="w-20 h-20 rounded-[32px] bg-navy text-gold flex items-center justify-center mb-10 shadow-3xl shadow-navy/30 group-hover:bg-gold group-hover:text-navy transition-all duration-1000 group-hover:rotate-6">
              <Calendar className="w-10 h-10" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 mb-3">Target Date</p>
            <p className="text-[20px] font-display font-bold text-navy tracking-tighter uppercase leading-none">{new Date(visit.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="bg-white p-10 rounded-[60px] border border-navy/5 shadow-3xl shadow-black/[0.01] hover:border-gold/30 transition-all group italic">
            <div className="w-20 h-20 rounded-[32px] bg-navy text-gold flex items-center justify-center mb-10 shadow-3xl shadow-navy/30 group-hover:bg-gold group-hover:text-navy transition-all duration-1000 group-hover:rotate-6">
              <Clock className="w-10 h-10" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 mb-3">Temporal Window</p>
            <p className="text-[20px] font-display font-bold text-navy tracking-tighter uppercase leading-none">10 AM - 12 PM</p>
          </div>
        </div>

        {/* Checklist Benchmarks */}
        <div className="space-y-12">
          <div className="flex items-center justify-between px-6 italic">
            <div className="space-y-2">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 leading-none">Service Protocol</h3>
              <p className="text-[10px] font-bold text-gold/60 uppercase tracking-[0.3em]">Procedural Benchmarks</p>
            </div>
            <Badge className="bg-navy/5 text-navy/40 border border-navy/10 font-bold text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-full italic">
              ISO Compliance
            </Badge>
          </div>
          <div className="bg-white rounded-[72px] border border-navy/5 p-12 space-y-12 shadow-3xl shadow-black/[0.01] italic">
            {visit.checklist.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-8 group">
                <div className={cn(
                  "w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 mt-0.5 transition-all duration-1000 shadow-inner",
                  item.status === 'Completed' ? "bg-green-500 text-white shadow-green-500/20" : "bg-navy/5 text-navy/10 border border-navy/5"
                )}>
                  {item.status === 'Completed' ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-current" />
                  )}
                </div>
                <div className="flex-1 space-y-2 pt-1.5">
                  <span className={cn(
                    "text-[18px] font-display font-bold leading-tight tracking-tight transition-all duration-1000 uppercase",
                    item.status === 'Completed' ? "text-navy/80" : "text-navy/20"
                  )}>{item.item}</span>
                  {item.status === 'Completed' && (
                    <p className="text-[11px] font-bold text-green-600/60 uppercase tracking-[0.4em] transform origin-left transition-all italic">Verified Strategy Authorized</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advantage Insight */}
        <div className="bg-gold p-12 rounded-[72px] flex flex-col gap-10 shadow-3xl shadow-gold/30 relative overflow-hidden active:scale-[0.99] transition-all italic group">
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-22 h-22 rounded-[36px] bg-white/20 flex items-center justify-center text-navy shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-1000">
              <Info className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className="font-display font-bold text-navy text-[28px] tracking-tighter leading-none uppercase">Patron Privileges</h4>
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/40">Tier Specific Advantage Layer</p>
            </div>
          </div>
          <p className="text-[15px] text-navy/60 leading-relaxed font-bold relative z-10 uppercase tracking-tight">
            This deployment is fully covered under your active Annual Mastery Contract. Consumables, specialized cleaning reagents, and diagnostic reports inclusive. Zero fiscal draw.
          </p>
          <Shield className="absolute -right-12 -bottom-12 w-48 h-48 text-navy/[0.03] rotate-12 pointer-events-none group-hover:scale-125 transition-transform duration-[2000ms]" />
        </div>
      </div>

      {/* Control Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-10 bg-white/95 backdrop-blur-3xl border-t border-navy/5 z-50 rounded-t-[54px] shadow-3xl italic">
        <div className="max-w-[440px] mx-auto grid grid-cols-2 gap-8">
          <Button 
            variant="outline" 
            className="h-24 rounded-[32px] border-navy/10 text-navy/40 hover:text-navy hover:bg-navy/5 font-bold uppercase tracking-[0.3em] text-[15px] active:scale-95 transition-all italic"
            onClick={() => navigate('/app/reschedule-booking/amc-next')}
          >
            Temporal Shift
          </Button>
          <Button className="h-24 rounded-[32px] bg-navy text-gold hover:bg-navy/95 font-bold uppercase tracking-[0.3em] text-[15px] shadow-3xl shadow-navy/40 active:scale-95 transition-all italic underline-offset-8">
            Authorize Slot
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AMCVisitDetail;
