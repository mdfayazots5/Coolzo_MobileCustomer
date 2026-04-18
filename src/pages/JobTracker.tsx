import { BookingService } from '@/services/bookingService';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Phone, 
  Star, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TECHNICIANS, Technician } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const STATUS_STEPS = [
  { id: 'Booked', label: 'Booked' },
  { id: 'Assigned', label: 'Assigned' },
  { id: 'En Route', label: 'En Route' },
  { id: 'Arrived', label: 'Arrived' },
  { id: 'In Progress', label: 'In Progress' },
  { id: 'Completed', label: 'Completed' },
];

export default function JobTracker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any | undefined>(null);
  const [technician, setTechnician] = useState<Technician | undefined>(undefined);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = BookingService.getJobStream(id, (jobData) => {
      if (jobData) {
        setJob(jobData);
        setLastUpdated(new Date());
        
        if (jobData.technicianId) {
          setTechnician(TECHNICIANS.find(t => t.id === jobData.technicianId));
        }
      }
    });

    return () => unsubscribe();
  }, [id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1500);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === job.status);

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Instrumentation Header */}
      <div className="px-8 pt-16 pb-20 bg-navy text-warm-white rounded-b-[72px] relative overflow-hidden shadow-2xl shadow-navy/40 z-20">
        <div className="flex items-center justify-between mb-12 relative z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-95 transition-all shadow-2xl"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="space-y-1">
              <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none italic">Vector Tracking</h1>
              <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">Live Grid Synchronization</p>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            className={cn(
              "w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white/40 active:scale-90 transition-all shadow-2xl overflow-hidden group",
              isRefreshing && "text-gold"
            )}
          >
            <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gold/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-gold/60 text-[10px] font-bold uppercase tracking-[0.4em]">Engagement Identifier</p>
            <p className="text-[20px] font-mono font-bold text-white tracking-tight italic">{job.srNumber}</p>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-right space-y-2">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">Registry Status</p>
            <Badge className="bg-gold text-navy border-none font-bold text-[10px] uppercase tracking-widest px-6 py-2 rounded-full italic shadow-2xl shadow-black/40">
              {job.status}
            </Badge>
          </div>
        </div>

        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Cinematic ETA Banner */}
      {job.status === 'En Route' && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-8 -mt-10 relative z-30"
        >
          <div className="bg-gold rounded-[40px] p-10 flex items-center justify-between shadow-2xl shadow-gold/40 relative overflow-hidden group">
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-20 h-20 rounded-[28px] bg-navy/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-700">
                <Clock className="w-10 h-10 text-navy/80" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/40 mb-1 leading-none italic">Estimated Intercept</p>
                <div className="flex items-end gap-2">
                  <p className="text-[40px] font-display font-bold text-navy tracking-tighter leading-none italic">18</p>
                  <p className="text-[14px] font-bold text-navy/60 uppercase tracking-widest mb-1 italic">Minutes</p>
                </div>
              </div>
            </div>
            <div className="text-right space-y-1 relative z-10">
              <div className="flex items-center gap-2 justify-end">
                <span className="w-2 h-2 rounded-full bg-navy/20 animate-pulse" />
                <p className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.3em]">Telemetry Active</p>
              </div>
              <p className="text-[12px] font-bold text-navy italic leading-none">{Math.floor((new Date().getTime() - lastUpdated.getTime()) / 60000)}m since sync</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-navy/[0.02] to-transparent pointer-events-none" />
          </div>
        </motion.div>
      )}

      <div className="px-8 py-16 space-y-16">
        {/* Instrumentation Stepper */}
        <section className="bg-white rounded-[60px] p-12 border border-navy/5 shadow-2xl shadow-black/[0.01] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-navy/[0.02] rounded-bl-full pointer-events-none" />
          <div className="space-y-14 relative z-10">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.id} className="flex gap-10 relative group">
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={cn(
                      "absolute left-6 top-12 bottom-[-56px] w-px",
                      isCompleted ? "bg-gold/40" : "bg-navy/5"
                    )} />
                  )}
                  
                  <div className="relative">
                    <div className={cn(
                      "w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 z-10 transition-all duration-1000",
                      isCompleted ? "bg-gold text-navy shadow-2xl shadow-gold/20" : 
                      isCurrent ? "bg-navy text-gold ring-[12px] ring-navy/5 shadow-2xl shadow-navy/30" : 
                      "bg-navy/[0.02] text-navy/10 border border-navy/5"
                    )}>
                      {isCompleted ? (
                        <ShieldCheck className="w-6 h-6" />
                      ) : isCurrent ? (
                        <motion.div 
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="w-2.5 h-2.5 bg-gold rounded-full"
                        />
                      ) : (
                        <div className="w-2 h-2 bg-navy/10 rounded-full" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className={cn(
                        "text-[18px] font-bold tracking-tighter transition-colors uppercase italic",
                        isCurrent ? "text-navy" : isCompleted ? "text-navy/40" : "text-navy/10"
                      )}>
                        {step.label}
                      </p>
                      {isCompleted && (
                        <Badge variant="outline" className="border-gold/30 text-gold text-[8px] uppercase tracking-widest px-3 py-1 rounded-full italic">Verified</Badge>
                      )}
                    </div>
                    {isCurrent && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 py-3 px-5 bg-navy/[0.02] rounded-2xl border border-navy/5 w-fit"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(201,162,74,0.6)]" />
                        <p className="text-[10px] text-navy/40 font-bold uppercase tracking-[0.4em] italic">
                          Last Synchronization: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Operative Profile Layer */}
        {technician && (
          <section className="space-y-8">
            <div className="flex items-end justify-between px-4">
              <div className="space-y-2">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20">Assigned Operative</h3>
                <h2 className="text-[32px] font-display font-bold text-navy tracking-tighter italic">Field Intelligence</h2>
              </div>
              <Badge className="bg-navy/5 text-navy/30 border-none font-bold text-[9px] uppercase tracking-widest px-4 py-2 rounded-full italic">Tenure Verified</Badge>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-navy rounded-[60px] p-10 text-warm-white shadow-3xl shadow-navy/40 relative overflow-hidden group active:scale-[0.99] transition-all"
            >
              <div className="relative z-10 flex items-center justify-between gap-8">
                <div className="flex items-center gap-10">
                  <div className="w-24 h-24 rounded-[36px] bg-gold/10 border-2 border-gold/30 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-1000">
                    <img src={technician.photo} alt={technician.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-[32px] tracking-tighter text-gold leading-none italic">{technician.name}</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-xl">
                          <Star className="w-3 h-3 text-gold fill-gold" />
                          <span className="text-[11px] font-bold text-gold tracking-tight">{technician.rating} Profile Rating</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-warm-white/20 text-[11px] font-bold uppercase tracking-[0.4em] italic leading-none">{technician.experience} Professional Tenure</p>
                  </div>
                </div>
                <a 
                  href={`tel:${technician.phone}`}
                  className="w-20 h-20 rounded-[32px] bg-gold flex items-center justify-center text-navy shadow-3xl shadow-gold/40 active:scale-90 transition-all hover:scale-110"
                >
                  <Phone className="w-10 h-10" />
                </a>
              </div>

              <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex gap-4">
                  {technician.certifications.slice(0, 1).map((cert, i) => (
                    <div key={i} className="bg-white/5 px-6 py-2.5 rounded-full border border-white/5 flex items-center gap-4 shadow-inner">
                      <ShieldCheck className="w-5 h-5 text-gold" />
                      <span className="text-[10px] font-bold text-warm-white/30 uppercase tracking-[0.4em] italic">{cert}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate(`/app/technician-profile/${technician.id}`)}
                  className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold/30 hover:text-gold flex items-center gap-4 transition-all group/btn italic"
                >
                  Profile Archive <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>

              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-[100px] opacity-10" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.02] rounded-bl-full pointer-events-none" />
            </motion.div>
          </section>
        )}

        {/* Fiscal Divergence Alert */}
        {job.hasEstimate && !job.estimateApproved && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-500 rounded-[48px] p-10 text-white flex items-center gap-8 shadow-3xl shadow-red-500/40 relative overflow-hidden group"
          >
            <div className="w-20 h-20 rounded-[32px] bg-white/20 flex items-center justify-center shrink-0 shadow-inner border border-white/10 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="font-display font-bold text-[28px] tracking-tighter leading-none italic">Fiscal Divergence</p>
              <p className="text-[11px] opacity-70 font-bold uppercase tracking-[0.4em] italic">Estimate Pending Authorization</p>
            </div>
            <Button 
              onClick={() => navigate(`/app/estimate-approval/${job.id}`)}
              className="bg-white text-red-500 hover:bg-navy hover:text-gold font-bold rounded-[24px] h-16 px-10 text-[13px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all italic"
            >
              Analyze
            </Button>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        )}

        {/* Mission Specifications */}
        <section className="bg-white rounded-[60px] p-12 border border-navy/5 shadow-2xl shadow-black/[0.01] space-y-12 relative overflow-hidden group">
          <div className="flex items-start gap-8 relative z-10">
            <div className="w-16 h-16 rounded-[24px] bg-navy/5 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-gold/10 group-hover:text-gold transition-all duration-700">
              <MapPin className="w-8 h-8 text-navy/20 group-hover:text-gold" />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 mb-2 leading-none italic">Service Sector</p>
              <p className="text-[17px] font-bold text-navy leading-snug tracking-tight italic uppercase">{job.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-8 pt-12 border-t border-navy/5 relative z-10">
            <div className="w-16 h-16 rounded-[24px] bg-navy/5 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-gold/10 group-hover:text-gold transition-all duration-700">
              <AlertCircle className="w-8 h-8 text-navy/20 group-hover:text-gold" />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 mb-2 leading-none italic">Objective Profile</p>
              <p className="text-[17px] font-bold text-navy uppercase tracking-[0.3em] italic">{job.serviceType}</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-navy/[0.01] rounded-tl-full pointer-events-none" />
        </section>
      </div>

      {/* Strategic Command Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-10 z-50 bg-gradient-to-t from-warm-white via-warm-white/95 to-transparent">
        <div className="max-w-[480px] mx-auto flex gap-6">
          <Button 
            variant="outline"
            className="flex-1 h-20 rounded-[28px] border-navy/10 text-navy/30 hover:text-navy font-bold text-[14px] uppercase tracking-[0.4em] hover:bg-navy/5 active:scale-95 transition-all italic shadow-2xl"
            onClick={() => navigate(`/app/booking-detail/${job.id}`)}
          >
            Specs
          </Button>
          <Button 
            className="flex-[1.5] h-20 rounded-[28px] bg-navy text-gold shadow-3xl shadow-navy/40 font-bold text-[15px] uppercase tracking-[0.4em] active:scale-95 transition-all italic hover:bg-navy/95"
            onClick={() => navigate('/app/support/new')}
          >
            Liaison
          </Button>
        </div>
      </div>
    </div>
  );
}
