import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, MapPin, CreditCard, FileText, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JOBS, TECHNICIANS } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = JOBS.find(j => j.id === id) || JOBS[0];
  const technician = TECHNICIANS.find(t => t.id === job.technicianId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-600';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-gold/10 text-gold';
    }
  };

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
            <h1 className="text-xl font-display font-bold text-navy">Booking Details</h1>
            <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{job.srNumber}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-32">
        {/* Status Card */}
        <div className="bg-white rounded-[32px] p-6 border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <Badge className={cn("border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1", getStatusColor(job.status))}>
              {job.status}
            </Badge>
            <p className="text-[10px] font-bold text-navy/20 uppercase tracking-widest">Booked on {job.date}</p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-display font-bold text-navy">{job.serviceType}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-navy/60">{job.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-navy/60">{job.timeSlot.split('(')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technician Card */}
        {technician && (
          <div className="bg-white rounded-[32px] p-6 border border-border shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-4">Assigned Expert</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-navy/5 overflow-hidden">
                  <img src={technician.photo} alt={technician.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-navy">{technician.name}</p>
                  <p className="text-[10px] text-text-secondary">Level 3 Expert</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/technician/${technician.id}`)}
                className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Address & Payment */}
        <div className="space-y-3">
          <div className="bg-white rounded-[32px] p-6 border border-border shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">Service Address</p>
              <p className="text-xs font-bold text-navy leading-relaxed">
                Coolzo Tech Park, Tower B, Cyber City, Gurugram, 122002
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-border shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">Payment Method</p>
                <p className="text-xs font-bold text-navy">UPI • Google Pay</p>
              </div>
            </div>
            <p className="text-sm font-display font-bold text-navy">₹{job.price}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {job.status === 'Completed' ? (
            <Button 
              onClick={() => navigate(`/service-report/${job.id}`)}
              className="w-full h-14 rounded-2xl bg-navy text-gold font-bold gap-2"
            >
              <FileText className="w-5 h-5" />
              View Service Report
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 rounded-2xl border-border text-navy font-bold">
                Reschedule
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-red-100 text-red-500 font-bold">
                Cancel
              </Button>
            </div>
          )}
          <Button 
            variant="ghost" 
            className="w-full h-14 rounded-2xl text-text-secondary font-bold gap-2"
            onClick={() => navigate('/app/support/new')}
          >
            <MessageSquare className="w-5 h-5" />
            Need Help?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
