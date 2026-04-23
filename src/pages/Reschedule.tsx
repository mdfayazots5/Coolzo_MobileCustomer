import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BookingService } from '@/services/bookingService';
import { toast } from 'sonner';

const Reschedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<{ date: string; label: string }[]>([]);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const data = await BookingService.getBookingById(id);
        setJob(data);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const dates = useMemo(() => (
    Array.from({ length: 5 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index + 1);

      return {
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: date.toLocaleDateString('en-IN', { day: '2-digit' }),
        full: date.toISOString().slice(0, 10),
      };
    })
  ), []);

  useEffect(() => {
    const fetchSlots = async () => {
      const persistedRaw = localStorage.getItem('coolzo-booking-draft');
      const persisted = persistedRaw
        ? JSON.parse(persistedRaw) as { state?: { location?: { zoneId?: number | null } } }
        : null;
      const zoneId = persisted?.state?.location?.zoneId ?? null;

      if (!zoneId || !selectedDate) {
        setAvailableSlots([]);
        return;
      }

      try {
        const slots = await BookingService.getSlots(zoneId, selectedDate);
        setAvailableSlots(
          slots
            .filter((slot) => slot.isAvailable)
            .map((slot) => ({ date: slot.slotDate, label: slot.slotLabel }))
        );
      } catch {
        setAvailableSlots([]);
      }
    };

    setSelectedTime('');
    void fetchSlots();
  }, [selectedDate]);

  const times = availableSlots.map((slot) => slot.label);

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await BookingService.rescheduleBooking(id!, {
        requestedDate: selectedDate,
        timeWindow: selectedTime,
        reason: `Requested from customer app for booking ${job?.bookingReference || id}`,
      });
      toast.success('Booking Rescheduled Successfully');
      navigate(-1);
    } catch (error) {
      toast.error('Failed to reschedule booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-border sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[20px] font-display font-bold text-navy">Reschedule</h1>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-32">
        {/* Info Banner */}
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-5 flex gap-4">
          <AlertCircle className="w-5 h-5 text-gold shrink-0" />
          <p className="text-[11px] text-navy/60 leading-relaxed font-bold uppercase tracking-widest">
            Rescheduling is free up to 24 hours before service. Changes within 24 hours may incur a small fee.
          </p>
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Select New Date</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {dates.map((d) => (
              <button
                key={d.full}
                onClick={() => setSelectedDate(d.full)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[72px] h-20 rounded-xl border transition-all",
                  selectedDate === d.full 
                    ? "bg-navy border-navy text-gold shadow-lg shadow-navy/20" 
                    : "bg-white border-border text-navy/40"
                )}
              >
                <span className="text-[9px] font-bold uppercase tracking-widest mb-1">{d.day}</span>
                <span className="text-[18px] font-display font-bold">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Select New Time</h3>
          <div className="space-y-2">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={cn(
                  "w-full p-4 rounded-xl border flex items-center gap-4 transition-all",
                  selectedTime === t 
                    ? "bg-gold/10 border-gold text-gold" 
                    : "bg-white border-border text-navy/40"
                )}
              >
                <Clock className="w-4 h-4" />
                <span className="text-[14px] font-bold uppercase tracking-widest">{t}</span>
              </button>
            ))}
            {selectedDate && times.length === 0 && (
              <div className="w-full p-4 rounded-xl border bg-white text-navy/40 text-[12px] font-bold">
                No slots are currently available for the selected date.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-border z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={handleReschedule}
              disabled={isSubmitting}
              className="w-full h-14 rounded-lg bg-navy text-gold font-bold text-[16px] shadow-card"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Reschedule'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reschedule;
