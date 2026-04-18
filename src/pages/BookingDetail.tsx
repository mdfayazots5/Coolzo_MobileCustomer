import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, MapPin, CreditCard, FileText, ChevronRight, MessageSquare, ShieldCheck, Info, Share2, Phone, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JOBS, TECHNICIANS } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = JOBS.find(j => j.id === id) || JOBS[0];
  const technician = TECHNICIANS.find(t => t.id === job.technicianId);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed': return { color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: ShieldCheck, label: 'Post-Action Verified' };
      case 'Cancelled': return { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: Info, label: 'Deployment Terminated' };
      default: return { color: 'text-gold bg-gold/10 border-gold/20', icon: Clock, label: 'Active Deployment' };
    }
  };

  const status = getStatusConfig(job.status);

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Specifications Header */}
      <div className="bg-navy px-8 pt-16 pb-28 text-warm-white rounded-b-[72px] relative overflow-hidden shadow-3xl shadow-navy/40 z-20">
        <div className="flex items-center justify-between mb-12 relative z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="space-y-1">
              <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none italic">Mission Specs</h1>
              <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.4em] italic leading-none mt-1">Registry Engagement • {job.srNumber}</p>
            </div>
          </div>
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-gold active:scale-95 transition-all shadow-2xl">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-3">
             <p className="text-warm-white/20 text-[10px] font-bold uppercase tracking-[0.5em] italic leading-none">Status Classification</p>
             <div className="flex items-center gap-4">
               <span className="w-3 h-3 rounded-full bg-gold animate-pulse shadow-[0_0_12px_rgba(201,162,74,0.6)]" />
               <h2 className="text-[28px] font-display font-bold text-white tracking-tighter leading-none italic uppercase">{job.status}</h2>
             </div>
          </div>
          <div className="text-right space-y-2">
            <p className="text-warm-white/20 text-[10px] font-bold uppercase tracking-[0.5em] italic">Fiscal Index</p>
            <p className="text-[24px] font-display font-bold text-gold tracking-tighter leading-none italic">₹{job.price}</p>
          </div>
        </div>

        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-12 space-y-16 relative z-30 pb-40">
        {/* Engagement Objective Layer */}
        <section className="bg-white rounded-[60px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.02] space-y-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
          <div className="space-y-4 relative z-10 italic">
            <p className="text-[12px] font-bold uppercase tracking-[0.5em] text-gold/60 leading-none">Deployment Objective</p>
            <h2 className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none uppercase">{job.serviceType}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-10 pt-4 relative z-10 italic">
            <div className="space-y-3">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/10 shadow-inner group-hover:bg-gold group-hover:text-navy transition-all duration-700">
                  <Calendar className="w-7 h-7" />
                </div>
                <p className="text-[18px] font-bold text-navy tracking-tight uppercase leading-none">{job.date}</p>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/10 pl-2">Temporal Point</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/10 shadow-inner group-hover:bg-gold group-hover:text-navy transition-all duration-700">
                  <Clock className="w-7 h-7" />
                </div>
                <p className="text-[18px] font-bold text-navy tracking-tight uppercase leading-none truncate">{job.timeSlot.split('(')[0]}</p>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/10 pl-2 text-right lg:text-left">Vector Slot</p>
            </div>
          </div>
        </section>

        {/* Operative Profile Layer */}
        {technician && (
          <section className="space-y-8">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-4">Assigned Field Expert</h3>
            <div className="bg-navy rounded-[60px] p-10 text-warm-white relative overflow-hidden shadow-3xl shadow-navy/40 group active:scale-[0.99] transition-all">
              <div className="relative z-10 flex items-center justify-between gap-8">
                <div className="flex items-center gap-10">
                  <div className="w-24 h-24 rounded-[36px] bg-gold/10 border-2 border-gold/30 flex items-center justify-center overflow-hidden shadow-inner group-hover:rotate-3 transition-transform duration-1000">
                    <img src={technician.photo} alt={technician.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[28px] font-display font-bold text-gold tracking-tighter leading-none mb-1 italic">{technician.name}</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(201,162,74,0.6)] animate-pulse" />
                      <span className="text-warm-white/30 text-[11px] font-bold uppercase tracking-[0.5em] italic">Institutional Rank • Lvl 3</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/app/technician-profile/${technician.id}`)}
                  className="w-20 h-20 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-center text-gold/30 hover:bg-gold hover:text-navy transition-all duration-700 shadow-3xl shadow-black/40"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </div>
              <div className="absolute -right-24 -top-24 w-60 h-60 bg-white/5 rounded-full blur-[120px] opacity-10" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/[0.02] rounded-tl-full pointer-events-none" />
            </div>
          </section>
        )}

        {/* Logistic Intelligence Cluster */}
        <section className="space-y-8">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-4">Logistic Intelligence</h3>
           <div className="bg-white rounded-[60px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.02] space-y-12 relative overflow-hidden group">
            <div className="flex items-start gap-8 group/item">
              <div className="w-16 h-16 rounded-[24px] bg-navy/5 flex items-center justify-center shrink-0 group-hover/item:bg-gold group-hover/item:text-navy transition-all duration-700 shadow-inner">
                <MapPin className="w-8 h-8 text-navy/10 group-hover/item:text-navy" />
              </div>
              <div className="space-y-3 flex-1 pb-12 border-b border-navy/5 group-last:border-0 group-last:pb-0 italic">
                <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 leading-none">Sector Destination</p>
                <p className="text-[17px] font-bold text-navy/80 leading-relaxed tracking-tight group-hover:text-navy transition-colors italic uppercase">
                  Coolzo Tech Park, Tower B, Node 04, Gurugram
                </p>
              </div>
            </div>

            <div className="flex items-start gap-8 group/item">
              <div className="w-16 h-16 rounded-[24px] bg-navy/5 flex items-center justify-center shrink-0 group-hover/item:bg-gold group-hover/item:text-navy transition-all duration-700 shadow-inner">
                <CreditCard className="w-8 h-8 text-navy/10 group-hover/item:text-navy" />
              </div>
              <div className="space-y-3 flex-1 flex items-center justify-between italic">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 leading-none mb-3">Fiscal Protocol</p>
                  <p className="text-[17px] font-bold text-navy/80 tracking-tight uppercase group-hover:text-navy transition-colors">Digital Grid Sync • UPI</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none italic">₹{job.price}</p>
                  <Badge className="bg-green-500/10 text-green-600 border-none font-bold text-[9px] uppercase tracking-widest px-4 py-2 rounded-full italic">Verified</Badge>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-navy/[0.01] rounded-tl-full pointer-events-none group-hover:bg-gold/[0.03] transition-colors" />
          </div>
        </section>

        {/* Operational Intervention Bar */}
        <section className="space-y-10 pt-10 border-t border-navy/5">
          {job.status === 'Completed' ? (
            <Button 
              onClick={() => navigate(`/app/service-report/${job.id}`)}
              className="w-full h-24 rounded-[36px] bg-gold text-navy shadow-3xl shadow-gold/30 font-bold gap-8 text-[18px] uppercase tracking-[0.4em] active:scale-95 transition-all italic hover:brightness-105"
            >
              <FileText className="w-8 h-8" />
              Post-Action Records
            </Button>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <Button 
                  variant="outline" 
                  className="h-20 rounded-[28px] border-navy/10 text-navy/30 hover:text-navy hover:bg-navy/5 font-bold text-[14px] uppercase tracking-[0.4em] active:scale-95 transition-all shadow-sm italic"
                  onClick={() => navigate(`/app/reschedule/${job.id}`)}
                >
                  Reschedule
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 rounded-[28px] border-red-500/10 text-red-500/30 hover:text-red-600 hover:bg-red-500/5 font-bold text-[14px] uppercase tracking-[0.4em] active:scale-95 transition-all shadow-sm italic"
                >
                  Abort
                </Button>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            className="w-full h-20 rounded-[28px] text-navy/20 hover:text-navy/60 font-bold gap-6 text-[14px] uppercase tracking-[0.5em] active:scale-95 transition-all italic hover:bg-navy/5"
            onClick={() => navigate('/app/support/new')}
          >
            <MessageSquare className="w-6 h-6 opacity-40" />
            Liaison Link
          </Button>
        </section>
      </div>
    </div>
  );
}
