import React from 'react';
import { motion } from 'motion/react';
import { useBookingStore } from '@/store/useBookingStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Zap, 
  AlertTriangle,
  ChevronRight,
  Check
} from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';

export default function Step4DateTime() {
  const { slot, updateSlot } = useBookingStore();

  // Generate next 7 days
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const timeWindows = [
    { id: 'Morning', label: 'Morning', range: '8 AM - 12 PM', icon: Clock },
    { id: 'Afternoon', label: 'Afternoon', range: '12 PM - 4 PM', icon: Clock },
    { id: 'Evening', label: 'Evening', range: '4 PM - 7 PM', icon: Clock },
  ] as const;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">Schedule Service</h2>
        <p className="text-navy/60 text-sm">Pick a time that works best for you.</p>
      </div>

      {/* Emergency Toggle */}
      <div className={cn(
        "p-6 rounded-[32px] border-2 transition-all duration-500 relative overflow-hidden",
        slot.isEmergency 
          ? "border-red-500 bg-red-50" 
          : "border-navy/5 bg-white"
      )}>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
              slot.isEmergency ? "bg-red-500 text-white" : "bg-navy/5 text-navy/40"
            )}>
              <Zap className={cn("w-6 h-6", slot.isEmergency && "fill-white")} />
            </div>
            <div>
              <h3 className="font-bold text-navy text-sm">Emergency Service</h3>
              <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Technician within 4 hours</p>
            </div>
          </div>
          <Switch 
            checked={slot.isEmergency}
            onCheckedChange={(checked) => updateSlot({ isEmergency: checked })}
            className="data-[state=checked]:bg-red-500"
          />
        </div>
        {slot.isEmergency && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-4 pt-4 border-t border-red-200"
          >
            <div className="flex items-start gap-3 text-red-600">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">
                Emergency dispatch includes a ₹499 priority surcharge. Our nearest technician will be assigned immediately.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {!slot.isEmergency && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-10"
        >
          {/* Date Selector */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Select Date</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 snap-x">
              {next7Days.map((date, i) => {
                const isSelected = slot.date && isSameDay(new Date(slot.date), date);
                return (
                  <button
                    key={i}
                    onClick={() => updateSlot({ date: date.toISOString() })}
                    className={cn(
                      "snap-center shrink-0 w-20 h-24 rounded-[24px] border-2 flex flex-col items-center justify-center gap-1 transition-all",
                      isSelected 
                        ? "border-gold bg-gold text-navy shadow-lg shadow-gold/20" 
                        : "border-navy/5 bg-white text-navy/40 hover:border-navy/10"
                    )}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">{format(date, 'EEE')}</span>
                    <span className="text-2xl font-display font-bold">{format(date, 'dd')}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Time Slots */}
          {slot.date && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Select Time Window</h3>
              <div className="space-y-3">
                {timeWindows.map((window) => (
                  <button
                    key={window.id}
                    onClick={() => updateSlot({ timeWindow: window.id })}
                    className={cn(
                      "w-full p-5 rounded-3xl border-2 flex items-center justify-between transition-all",
                      slot.timeWindow === window.id 
                        ? "border-gold bg-gold/5 text-navy" 
                        : "border-navy/5 bg-white text-navy/60 hover:border-navy/10"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        slot.timeWindow === window.id ? "bg-gold text-navy" : "bg-navy/5 text-navy/40"
                      )}>
                        <window.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm">{window.label}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{window.range}</p>
                      </div>
                    </div>
                    {slot.timeWindow === window.id ? (
                      <Check className="w-5 h-5 text-gold" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-20" />
                    )}
                  </button>
                ))}
              </div>
            </motion.section>
          )}
        </motion.div>
      )}
    </div>
  );
}
