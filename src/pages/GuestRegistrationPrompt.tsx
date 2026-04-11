import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck, Gift, ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GuestRegistrationPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-warm-white p-8">
      <button 
        onClick={() => navigate(-1)}
        className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-navy mb-12"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-24 h-24 bg-gold/10 rounded-[40px] flex items-center justify-center text-gold mb-4">
          <UserPlus className="w-12 h-12" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-display font-bold text-navy">Save your details?</h1>
          <p className="text-text-secondary text-sm leading-relaxed max-w-[280px]">
            Create an account to track your job in real-time and earn ₹250 in credits.
          </p>
        </div>

        <div className="w-full space-y-4">
          <div className="bg-white p-6 rounded-[32px] border border-border space-y-4 text-left">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span className="text-xs font-bold text-navy">Secure Job Tracking</span>
            </div>
            <div className="flex items-center gap-4">
              <Gift className="w-5 h-5 text-gold" />
              <span className="text-xs font-bold text-navy">₹250 Joining Bonus</span>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/register')}
            className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-card"
          >
            Create Account
          </Button>

          <Button 
            variant="ghost"
            onClick={() => navigate('/book')}
            className="w-full h-14 rounded-2xl text-text-secondary font-bold flex items-center justify-center gap-2"
          >
            Continue as Guest
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestRegistrationPrompt;
