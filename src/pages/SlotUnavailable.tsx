import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarX, Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SlotUnavailable = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-warm-white">
      <div className="w-24 h-24 bg-navy/5 rounded-[40px] flex items-center justify-center text-navy/10 mb-8">
        <CalendarX className="w-12 h-12" />
      </div>

      <h1 className="text-3xl font-display font-bold text-navy mb-4">Fully Booked!</h1>
      <p className="text-text-secondary text-sm leading-relaxed mb-12 max-w-[280px]">
        Our experts are currently busy serving other customers in your area for the selected date.
      </p>

      <div className="w-full space-y-4">
        <div className="bg-white p-6 rounded-[32px] border border-border shadow-sm text-left">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-navy text-sm">Notify Me</p>
              <p className="text-[10px] text-text-secondary">Get alerted if a slot opens up</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl border-border text-navy font-bold"
            onClick={() => {}}
          >
            Enable Notifications
          </Button>
        </div>

        <Button 
          onClick={() => navigate(-1)}
          className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-card"
        >
          Pick Another Date
        </Button>

        <Button 
          variant="ghost"
          onClick={() => navigate('/app/support/new')}
          className="w-full h-14 rounded-2xl text-text-secondary font-bold flex items-center justify-center gap-2"
        >
          Contact Support
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SlotUnavailable;
