import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import { JOBS, Job } from '@/lib/mockData';
import { cn } from '@/lib/utils';

type TabType = 'All' | 'Active' | 'Completed' | 'Cancelled';

export default function MyJobs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('All');

  const filteredJobs = JOBS.filter(job => {
    const matchesTab = 
      activeTab === 'All' || 
      (activeTab === 'Active' && !['Completed', 'Cancelled'].includes(job.status)) ||
      (activeTab === 'Completed' && job.status === 'Completed') ||
      (activeTab === 'Cancelled' && job.status === 'Cancelled');
    
    return matchesTab;
  });

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'En Route':
      case 'Arrived':
      case 'In Progress': return 'text-gold bg-gold/10 border-gold/20';
      default: return 'text-navy/40 bg-navy/5 border-navy/5';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-64 relative overflow-hidden italic">
      {/* Session Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[140px] -ml-40 pointer-events-none" />

      {/* Institutional Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="relative z-10 flex items-center justify-between mb-16">
           <div className="space-y-4">
             <h1 className="text-[44px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Session Registry</h1>
             <p className="text-warm-white/30 text-[12px] font-bold uppercase tracking-[0.5em] leading-none">Historical Telemetry Tracking</p>
           </div>
           <div className="w-20 h-20 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-center text-gold/30 shadow-3xl">
             <FileText className="w-10 h-10" />
           </div>
        </div>
        
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* Navigation Matrix */}
      <div className="px-8 -mt-24 relative z-30">
        <div className="bg-white/80 backdrop-blur-3xl p-5 rounded-[52px] border border-navy/5 shadow-3xl shadow-black/[0.05] flex gap-4 overflow-x-auto no-scrollbar">
          {(['All', 'Active', 'Completed', 'Cancelled'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "h-16 px-10 rounded-[32px] text-[11px] font-bold uppercase tracking-[0.4em] transition-all whitespace-nowrap active:scale-95 relative overflow-hidden group/tab italic border",
                activeTab === tab 
                  ? "bg-navy text-gold border-navy shadow-3xl shadow-navy/20" 
                  : "bg-transparent text-navy/20 border-transparent hover:border-gold/30 hover:text-navy"
              )}
            >
              <span className="relative z-10">{tab} Protocol</span>
              {activeTab === tab && (
                <motion.div layoutId="job-tab-indicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold shadow-[0_0_12px_rgba(201,162,74,0.6)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Registry List */}
      <div className="px-8 py-20 space-y-12 pb-64">
        <AnimatePresence mode="popLayout">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, idx) => {
              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 + 0.2 } }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[72px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.01] group active:scale-[0.99] transition-all relative overflow-hidden hover:border-gold/30 hover:shadow-3xl"
                  onClick={() => navigate(`/app/booking-detail/${job.id}`)}
                >
                  <div className="flex items-start justify-between mb-12 relative z-10">
                    <div className="flex items-center gap-10">
                      <div className="w-20 h-20 rounded-[32px] bg-navy/[0.03] flex items-center justify-center text-navy/10 group-hover:bg-navy group-hover:text-gold transition-all duration-700 shadow-inner border border-navy/5 group-hover:rotate-6">
                        <FileText className="w-10 h-10" />
                      </div>
                      <div className="space-y-3 font-bold">
                        <p className="text-[12px] uppercase tracking-[0.6em] text-navy/20 leading-none">{job.srNumber}</p>
                        <h3 className="text-navy text-[32px] tracking-tighter leading-none uppercase group-hover:text-gold transition-colors">{job.serviceType}</h3>
                      </div>
                    </div>
                    <div className={cn(
                      "px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] border shadow-2xl backdrop-blur-3xl",
                      getStatusColor(job.status)
                    )}>
                      {job.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 mb-12 px-2 relative z-10">
                    <div className="space-y-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 leading-none">Registry Date</p>
                      <p className="text-[20px] font-bold text-navy tracking-tight uppercase leading-none italic">{job.date}</p>
                    </div>
                    <div className="space-y-4 text-right">
                      <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 leading-none">Temporal Slot</p>
                      <p className="text-[20px] font-bold text-navy tracking-tight uppercase leading-none truncate italic">{job.timeSlot.split('(')[0]}</p>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-dashed border-navy/10 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_12px_rgba(201,162,74,0.6)] animate-ping absolute inset-0" />
                        <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_8px_rgba(201,162,74,0.4)] relative" />
                      </div>
                      <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-navy/20">
                        {job.technicianId ? 'Expert Vector Locked' : 'Synchronizing Logistics...'}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="h-18 px-12 rounded-[32px] text-gold font-bold text-[13px] uppercase tracking-[0.4em] gap-6 active:scale-95 transition-all bg-gold/5 hover:bg-gold hover:text-navy shadow-3xl shadow-gold/5 group-hover:bg-gold group-hover:text-navy border border-gold/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (['Completed', 'Cancelled'].includes(job.status)) {
                          navigate(`/app/booking-detail/${job.id}`);
                        } else {
                          navigate(`/job-tracker/${job.id}`);
                        }
                      }}
                    >
                      {['Completed', 'Cancelled'].includes(job.status) ? 'Audit Report' : 'Track Vector'}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-700" />
                    </Button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gold/[0.01] rounded-bl-[160px] pointer-events-none group-hover:bg-gold/[0.05] transition-colors duration-1000" />
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-40"
            >
              <EmptyState 
                title="Records Nullified"
                description="The mission log is currently void of service engagements within this classification grid."
                actionLabel="Initialize Protocol"
                onAction={() => navigate('/app/book')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
