import React from 'react';
import { motion } from 'motion/react';
import { Check, ChevronRight, Wrench, Droplets, PlusCircle, Gauge, ShieldCheck, Zap } from 'lucide-react';
import { SERVICES } from '@/lib/mockData';
import { useBookingStore } from '@/store/useBookingStore';
import { cn } from '@/lib/utils';

export default function Step1Service() {
  const { serviceId, subServiceId, updateBooking } = useBookingStore();

  const selectedService = SERVICES.find(s => s.id === serviceId);

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'Repair': return Wrench;
      case 'Cleaning': return Droplets;
      case 'Installation': return PlusCircle;
      case 'Gas Refill': return Gauge;
      case 'AMC': return ShieldCheck;
      default: return Zap;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">What do you need?</h2>
        <p className="text-navy/60 text-sm">Select a service category to begin.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {SERVICES.map((service) => {
          const Icon = getServiceIcon(service.category);
          return (
            <motion.button
              key={service.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateBooking({ serviceId: service.id, subServiceId: null })}
              className={cn(
                "p-4 rounded-[24px] border-2 text-left transition-all duration-300 flex flex-col gap-3 relative overflow-hidden",
                serviceId === service.id 
                  ? "border-gold bg-gold/5 shadow-lg shadow-gold/10" 
                  : "border-navy/5 bg-white hover:border-navy/10"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                serviceId === service.id ? "bg-gold text-navy" : "bg-navy/5 text-navy/40"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-navy">{service.name}</p>
                <p className="text-[10px] text-navy/40 font-medium mt-0.5">From ₹{service.price}</p>
              </div>
              {serviceId === service.id && (
                <motion.div 
                  layoutId="check"
                  className="absolute top-3 right-3 w-5 h-5 bg-gold rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-navy" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {selectedService && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-4"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 px-2">Select Specific Issue</h3>
          <div className="space-y-2">
            {['General Checkup', 'Cooling Issue', 'Water Leakage', 'Noise Problem', 'Gas Refill'].map((sub) => (
              <button
                key={sub}
                onClick={() => updateBooking({ subServiceId: sub })}
                className={cn(
                  "w-full p-4 rounded-2xl border flex items-center justify-between transition-all",
                  subServiceId === sub 
                    ? "border-gold bg-gold/5 text-navy" 
                    : "border-navy/5 bg-white text-navy/60 hover:border-navy/10"
                )}
              >
                <span className="text-sm font-bold">{sub}</span>
                {subServiceId === sub ? (
                  <Check className="w-4 h-4 text-gold" />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-20" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
