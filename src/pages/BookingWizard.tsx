import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight, Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

// Steps
import Step1Service from '@/components/booking/Step1Service';
import Step2Equipment from '@/components/booking/Step2Equipment';
import Step3Location from '@/components/booking/Step3Location';
import Step4DateTime from '@/components/booking/Step4DateTime';
import Step5Contact from '@/components/booking/Step5Contact';
import Step6Summary from '@/components/booking/Step6Summary';

import { BookingService } from '@/services/bookingService';
import { toast } from 'sonner';

export default function BookingWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    step, 
    setStep, 
    serviceId, 
    subServiceId, 
    equipment, 
    location: bookingLocation, 
    slot, 
    contact,
    termsAccepted,
    resetBooking
  } = useBookingStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation for each step
  const isStepValid = () => {
    switch (step) {
      case 1: return !!serviceId;
      case 2: return !!equipment.brand && !!equipment.type && !!equipment.capacity;
      case 3: return !!bookingLocation.addressLine1 && !!bookingLocation.pinCode && bookingLocation.pinCode.length === 6 && !!bookingLocation.zoneId;
      case 4: return slot.isEmergency || (!!slot.date && !!slot.timeWindow && !!slot.slotAvailabilityId);
      case 5: return !!contact.fullName && !!contact.mobile && !!contact.email;
      case 6: return termsAccepted;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const bookingSummary = await BookingService.createBooking({
        customerId: user?.id,
        serviceTypeId: serviceId || '',
        brand: equipment.brand,
        acType: equipment.type,
        tonnage: equipment.capacity,
        scheduledDate: slot.date,
        slotAvailabilityId: slot.slotAvailabilityId,
        addressLine1: bookingLocation.addressLine1,
        addressLine2: bookingLocation.addressLine2,
        city: bookingLocation.city,
        postalCode: bookingLocation.pinCode,
        addressLabel: bookingLocation.label,
        name: contact.fullName,
        phone: contact.mobile,
        email: contact.email,
        specialInstructions: contact.instructions,
        isEmergency: slot.isEmergency,
      });

      toast.success('Booking confirmed!');
      navigate('/booking-confirmation', {
        state: {
          bookingId: bookingSummary.bookingId,
          srNumber: bookingSummary.bookingReference,
          confirmedDate: bookingSummary.slotDate,
          estimatedPrice: bookingSummary.estimatedPrice,
        },
      });
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Service />;
      case 2: return <Step2Equipment />;
      case 3: return <Step3Location />;
      case 4: return <Step4DateTime />;
      case 5: return <Step5Contact />;
      case 6: return <Step6Summary />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-warm-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-navy/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-navy/5 text-navy"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-navy uppercase tracking-widest">Book Service</h1>
            <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Step {step} of 6</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/app')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-navy/5 text-navy/40"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-navy/5 sticky top-[73px] z-40">
        <motion.div 
          className={cn(
            "h-full transition-all duration-500",
            slot.isEmergency ? "bg-red-500" : "bg-gold"
          )}
          initial={{ width: '0%' }}
          animate={{ width: `${(step / 6) * 100}%` }}
        />
      </div>

      {/* Emergency Banner */}
      <AnimatePresence>
        {slot.isEmergency && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-500 text-white px-6 py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest"
          >
            <AlertCircle className="w-3 h-3" />
            Emergency Service Mode Active
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Content */}
      <div className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-navy/5 p-6 z-50">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
            className={cn(
              "w-full h-16 rounded-[24px] font-bold text-lg shadow-xl transition-all active:scale-95",
              slot.isEmergency 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" 
                : "bg-navy hover:bg-navy/90 text-gold shadow-navy/20"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Securing your booking...</span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full px-4">
                <span className="opacity-0 w-6" /> {/* Spacer */}
                <span>{step === 6 ? 'Confirm & Book' : 'Continue'}</span>
                <ChevronRight className="w-6 h-6" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
