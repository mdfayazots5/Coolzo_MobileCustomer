import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Check, ChevronRight, Loader2 } from 'lucide-react';
import { useBookingStore } from '@/store/useBookingStore';
import { cn } from '@/lib/utils';
import { CatalogService, CatalogServiceItem } from '@/services/catalogService';

export default function Step1Service() {
  const { serviceId, subServiceId, updateBooking } = useBookingStore();
  const [services, setServices] = useState<CatalogServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    CatalogService.getServices()
      .then((data) => {
        if (!isMounted) return;
        setServices(data);
        setError('');
      })
      .catch((err) => {
        console.error('Failed to load services:', err);
        if (isMounted) setError('Services could not be loaded. Please retry.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedService = services.find(s => s.id === serviceId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">What do you need?</h2>
        <p className="text-navy/60 text-sm">Select a service category to begin.</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12 text-gold">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600 flex items-center gap-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {!isLoading && !error && services.length === 0 && (
        <div className="rounded-2xl border border-navy/5 bg-white p-6 text-center text-sm font-bold text-navy/40">
          No services are available right now.
        </div>
      )}

      {!isLoading && !error && services.length > 0 && (
      <div className="grid grid-cols-2 gap-4">
        {services.map((service) => (
          <motion.button
            key={service.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateBooking({
              serviceId: service.id,
              serviceName: service.name,
              servicePrice: service.price,
              subServiceId: null,
            })}
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
              {/* In a real app, we'd have specific icons for each service */}
              <Check className={cn("w-5 h-5", serviceId === service.id ? "opacity-100" : "opacity-0")} />
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
        ))}
      </div>
      )}

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
