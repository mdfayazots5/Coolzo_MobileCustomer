import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import { JOBS, Job } from '@/lib/mockData';
import { cn } from '@/lib/utils';

type TabType = 'All' | 'Active' | 'Completed' | 'Cancelled';

export default function MyJobs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = JOBS.filter(job => {
    const matchesTab = 
      activeTab === 'All' || 
      (activeTab === 'Active' && !['Completed', 'Cancelled'].includes(job.status)) ||
      (activeTab === 'Completed' && job.status === 'Completed') ||
      (activeTab === 'Cancelled' && job.status === 'Cancelled');
    
    const matchesSearch = 
      job.srNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.serviceType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'Completed': return 'text-green-500 bg-green-500/10';
      case 'Cancelled': return 'text-red-500 bg-red-500/10';
      case 'En Route':
      case 'Arrived':
      case 'In Progress': return 'text-gold bg-gold/10';
      default: return 'text-navy/40 bg-navy/5';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-12">
      {/* Header */}
      <div className="px-6 py-8 bg-navy text-warm-white rounded-b-[40px] relative overflow-hidden">
        <h1 className="text-3xl font-display font-bold text-gold mb-2">My Bookings</h1>
        <p className="text-warm-white/60 text-sm max-w-xs">
          Track and manage all your service requests in one place.
        </p>

        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
      </div>

      {/* Search & Tabs */}
      <div className="px-6 -mt-6 space-y-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(['All', 'Active', 'Completed', 'Cancelled'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-navy text-gold shadow-lg shadow-navy/20" 
                  : "bg-white text-navy/40 border border-navy/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="px-6 py-8 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm group active:scale-[0.98] transition-transform"
                  onClick={() => navigate(`/booking-detail/${job.id}`)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">{job.srNumber}</p>
                        <h3 className="font-bold text-navy">{job.serviceType}</h3>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      getStatusColor(job.status)
                    )}>
                      {job.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-navy/60">
                      <span className="text-xs font-medium">{job.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-navy/60">
                      <span className="text-xs font-medium truncate">{job.timeSlot.split('(')[0]}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-navy/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-navy/60 uppercase text-[8px] font-bold tracking-widest">
                      {job.technicianId ? 'Technician Assigned' : 'Assigning Expert...'}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="h-10 px-4 rounded-xl text-gold font-bold text-xs gap-1 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (['Completed', 'Cancelled'].includes(job.status)) {
                          navigate(`/booking-detail/${job.id}`);
                        } else {
                          navigate(`/job-tracker/${job.id}`);
                        }
                      }}
                    >
                      {['Completed', 'Cancelled'].includes(job.status) ? 'View Report' : 'Track Job'}
                    </Button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <EmptyState 
              title="No bookings found"
              description="You haven't made any bookings in this category yet. Book your first service to get started."
              actionLabel="Book a Service"
              onAction={() => navigate('/book')}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
