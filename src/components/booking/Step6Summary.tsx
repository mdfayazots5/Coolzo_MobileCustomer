import React from 'react';
import { motion } from 'motion/react';
import { useBookingStore } from '@/store/useBookingStore';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Wrench
} from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function Step6Summary() {
  const { serviceName, servicePrice, equipment, location, slot, contact, pricing } = useBookingStore();
  const basePrice = servicePrice || pricing.basePrice || 0;

  const summaryItems = [
    { 
      icon: Wrench, 
      label: 'Service', 
      value: serviceName || 'Selected service',
      subValue: equipment.brand ? `${equipment.brand} ${equipment.type} (${equipment.capacity})` : null 
    },
    { 
      icon: MapPin, 
      label: 'Location', 
      value: location.label, 
      subValue: `${location.addressLine1}, ${location.pinCode}` 
    },
    { 
      icon: Calendar, 
      label: 'Schedule', 
      value: slot.isEmergency ? 'Emergency (ASAP)' : (slot.date ? format(new Date(slot.date), 'EEE, dd MMM') : 'N/A'), 
      subValue: slot.isEmergency ? 'Within 4 hours' : slot.timeWindow 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">Review & Confirm</h2>
        <p className="text-navy/60 text-sm">Please check all details before booking.</p>
      </div>

      <div className="space-y-6">
        {/* Summary Card */}
        <div className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm space-y-6">
          {summaryItems.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40 shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-0.5">{item.label}</p>
                <p className="text-sm font-bold text-navy">{item.value}</p>
                {item.subValue && <p className="text-[10px] text-navy/40 font-medium">{item.subValue}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-navy rounded-[32px] p-8 text-warm-white relative overflow-hidden">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-6">Price Estimate</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-warm-white/60">Base Service Fee</span>
              <span className="font-bold">₹{basePrice}</span>
            </div>
            {slot.isEmergency && (
              <div className="flex justify-between items-center text-sm text-red-400">
                <span className="flex items-center gap-2">
                  Emergency Surcharge <Zap className="w-3 h-3 fill-red-400" />
                </span>
                <span className="font-bold">+₹499</span>
              </div>
            )}
            {contact.couponCode && (
              <div className="flex justify-between items-center text-sm text-green-400">
                <span>Coupon Discount</span>
                <span className="font-bold">-₹200</span>
              </div>
            )}
            <Separator className="bg-warm-white/10" />
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Estimated Total</p>
                <p className="text-3xl font-display font-bold">₹{basePrice + (slot.isEmergency ? 499 : 0) - (contact.couponCode ? 200 : 0)}</p>
              </div>
              <div className="text-right">
                <Badge className="bg-gold/20 text-gold border-none text-[8px] font-bold uppercase tracking-widest">Pay After Service</Badge>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3 p-4 bg-warm-white/5 rounded-2xl border border-warm-white/10">
            <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <p className="text-[10px] text-warm-white/40 leading-relaxed">
              Final price may vary based on actual spare parts used or additional repairs identified during inspection.
            </p>
          </div>
          <ShieldCheck className="absolute -right-8 -top-8 w-32 h-32 text-warm-white/5" />
        </div>

        {/* T&C */}
        <div className="flex items-start space-x-3 px-2">
          <Checkbox 
            id="terms" 
            className="mt-1 border-navy/20 data-[state=checked]:bg-navy data-[state=checked]:border-navy"
          />
          <Label htmlFor="terms" className="text-[10px] font-medium text-navy/40 leading-relaxed cursor-pointer">
            I agree to the <span className="text-navy font-bold underline">Terms of Service</span> and <span className="text-navy font-bold underline">Cancellation Policy</span>. I understand that a technician will call to confirm the exact arrival time.
          </Label>
        </div>
      </div>
    </div>
  );
}
