import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { JOBS } from '@/lib/mockData';
import { toast } from 'sonner';

const Reschedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = JOBS.find(j => j.id === id) || JOBS[0];

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const dates = [
    { day: 'Mon', date: '12', full: '2026-04-12' },
    { day: 'Tue', date: '13', full: '2026-04-13' },
    { day: 'Wed', date: '14', full: '2026-04-14' },
    { day: 'Thu', date: '15', full: '2026-04-15' },
    { day: 'Fri', date: '16', full: '2026-04-16' }
  ];

  const times = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM'
  ];

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }
    toast.success('Booking Rescheduled Successfully');
    navigate(-1);
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
          <h1 className="text-xl font-display font-bold text-navy">Reschedule</h1>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Info Banner */}
        <div className="bg-gold/10 border border-gold/20 rounded-[32px] p-6 flex gap-4">
          <AlertCircle className="w-6 h-6 text-gold shrink-0" />
          <p className="text-xs text-navy/60 leading-relaxed font-medium">
            Rescheduling is free up to 24 hours before the service. Changes made within 24 hours may incur a small fee.
          </p>
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Select New Date</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {dates.map((d) => (
              <button
                key={d.full}
                onClick={() => setSelectedDate(d.full)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[72px] h-24 rounded-[24px] border transition-all",
                  selectedDate === d.full 
                    ? "bg-navy border-navy text-gold shadow-lg shadow-navy/20" 
                    : "bg-white border-border text-navy/40"
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1">{d.day}</span>
                <span className="text-xl font-display font-bold">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Select New Time</h3>
          <div className="space-y-3">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={cn(
                  "w-full p-5 rounded-2xl border flex items-center gap-4 transition-all",
                  selectedTime === t 
                    ? "bg-gold/10 border-gold text-gold" 
                    : "bg-white border-border text-navy/40"
                )}
              >
                <Clock className="w-5 h-5" />
                <span className="text-sm font-bold">{t}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-border z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={handleReschedule}
              className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-card"
            >
              Confirm New Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reschedule;
