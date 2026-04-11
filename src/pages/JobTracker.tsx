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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JOBS, TECHNICIANS, Technician, Job } from '@/lib/mockData';
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
  const [job, setJob] = useState<Job | undefined>(JOBS.find(j => j.id === id));
  const [technician, setTechnician] = useState<Technician | undefined>(
    TECHNICIANS.find(t => t.id === job?.technicianId)
  );
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-poll simulation
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1500);
  };

  if (!job) return null;

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === job.status);

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-warm-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-navy/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-navy/5 text-navy"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-navy uppercase tracking-widest">Track Job</h1>
            <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{job.srNumber}</p>
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full bg-navy/5 text-navy/40",
            isRefreshing && "animate-spin"
          )}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* ETA Banner */}
      {job.status === 'En Route' && (
        <div className="bg-gold px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Estimated Arrival</p>
              <p className="text-lg font-bold text-navy">20 Minutes</p>
            </div>
          </div>
          <p className="text-[10px] font-bold text-navy/40 uppercase">Updated {Math.floor((new Date().getTime() - lastUpdated.getTime()) / 60000)}m ago</p>
        </div>
      )}

      <div className="px-6 py-8 space-y-8">
        {/* Status Stepper */}
        <section className="bg-white rounded-[40px] p-8 border border-navy/5 shadow-sm">
          <div className="space-y-6">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.id} className="flex gap-6 relative">
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={cn(
                      "absolute left-4 top-8 bottom-0 w-0.5",
                      isCompleted ? "bg-gold" : "bg-navy/5"
                    )} />
                  )}
                  
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500",
                    isCompleted ? "bg-gold text-navy" : 
                    isCurrent ? "bg-navy text-gold ring-4 ring-navy/10" : 
                    "bg-navy/5 text-navy/20"
                  )}>
                    {isCompleted ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : isCurrent ? (
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-2 h-2 bg-gold rounded-full"
                      />
                    ) : (
                      <div className="w-1.5 h-1.5 bg-current rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 pt-1">
                    <p className={cn(
                      "text-sm font-bold transition-colors",
                      isCurrent ? "text-navy" : isCompleted ? "text-navy/60" : "text-navy/20"
                    )}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-[10px] text-navy/40 font-medium uppercase tracking-widest mt-1">
                        {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technician Card */}
        {technician && (
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Assigned Technician</h3>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-navy rounded-[40px] p-6 text-warm-white shadow-xl shadow-navy/20 relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-4">
                <img 
                  src={technician.photo} 
                  alt={technician.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-gold/20"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg">{technician.name}</h4>
                    <div className="flex items-center gap-1 bg-gold/20 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                      <span className="text-[10px] font-bold text-gold">{technician.rating}</span>
                    </div>
                  </div>
                  <p className="text-warm-white/40 text-xs font-medium">{technician.experience} Experience</p>
                </div>
                <a 
                  href={`tel:${technician.phone}`}
                  className="w-12 h-12 rounded-2xl bg-gold flex items-center justify-center text-navy shadow-lg shadow-gold/20 active:scale-95 transition-transform"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-2">
                  {technician.certifications.slice(0, 2).map((cert, i) => (
                    <div key={i} className="bg-white/5 px-3 py-1.5 rounded-xl flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-gold" />
                      <span className="text-[10px] font-bold text-warm-white/60">{cert}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => navigate(`/technician/${technician.id}`)}
                  className="text-[10px] font-bold uppercase tracking-widest text-gold flex items-center gap-1"
                >
                  Profile <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="absolute -right-10 -top-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
            </motion.div>
          </section>
        )}

        {/* Estimate Alert */}
        {job.hasEstimate && !job.estimateApproved && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-500 rounded-[32px] p-6 text-white flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Estimate Awaiting Approval</p>
              <p className="text-[10px] opacity-80 font-medium uppercase tracking-widest mt-1">Review items to continue service</p>
            </div>
            <Button 
              onClick={() => navigate(`/estimate-approval/${job.id}`)}
              className="bg-white text-red-500 hover:bg-white/90 font-bold rounded-xl h-10 px-4"
            >
              Review
            </Button>
          </motion.div>
        )}

        {/* Job Details Summary */}
        <section className="bg-white rounded-[40px] p-8 border border-navy/5 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-navy/40" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Service Location</p>
              <p className="text-sm font-bold text-navy leading-relaxed">{job.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-navy/40" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Service Type</p>
              <p className="text-sm font-bold text-navy">{job.serviceType}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-navy/5 p-6 z-40">
        <div className="max-w-md mx-auto flex gap-3">
          <Button 
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-navy/10 text-navy font-bold"
            onClick={() => navigate(`/booking-detail/${job.id}`)}
          >
            Job Details
          </Button>
          <Button 
            className="flex-1 h-14 rounded-2xl bg-navy text-gold font-bold"
            onClick={() => navigate('/contact')}
          >
            Support
          </Button>
        </div>
      </div>
    </div>
  );
}
