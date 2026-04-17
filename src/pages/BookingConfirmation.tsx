import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Check, 
  Copy, 
  Share2, 
  Home, 
  Calendar, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { resetBooking, contact } = useBookingStore();
  const { isAuthenticated } = useAuthStore();
  const bookingRef = "CZ-" + Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    // Reset booking state when leaving this screen
    return () => resetBooking();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingRef);
    toast.success("Booking reference copied!");
  };

  const handleShare = () => {
    const text = `I just booked an AC service with Coolzo! My reference is ${bookingRef}.`;
    if (navigator.share) {
      navigator.share({ title: 'Coolzo Booking', text });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      <div className="flex-1 px-6 py-12 flex flex-col items-center text-center">
        {/* Success Animation */}
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-gold rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-gold/40"
        >
          <Check className="w-12 h-12 text-navy stroke-[3]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-display font-bold text-navy mb-2">Booking Confirmed!</h1>
          <p className="text-navy/60 text-sm mb-8">Your technician will be assigned shortly.</p>
        </motion.div>

        {/* Reference Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-white rounded-[40px] p-8 border border-navy/5 shadow-sm mb-10"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40 mb-3">Booking Reference</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-3xl font-mono font-bold text-navy tracking-tighter">{bookingRef}</span>
            <button 
              onClick={handleCopy}
              className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40 hover:text-navy transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 rounded-2xl border-navy/10 text-navy font-bold gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button 
              className="h-12 rounded-2xl bg-navy text-gold font-bold gap-2"
              onClick={() => navigate('/app/jobs')}
            >
              Track Job <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="w-full space-y-8 px-4 mb-12">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 text-left">What Happens Next</h3>
          <div className="space-y-6">
            {[
              { icon: ShieldCheck, title: 'Technician Assignment', desc: 'We are matching the best expert for your AC brand.' },
              { icon: MessageSquare, title: 'Confirmation Call', desc: 'Technician will call you to confirm the exact arrival time.' },
              { icon: Calendar, title: 'Service Delivery', desc: 'Expert arrives at your doorstep with all necessary tools.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-5 text-left relative">
                {i < 2 && <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-navy/5" />}
                <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/20 shrink-0">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-navy/40 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Registration Prompt */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="w-full bg-gold rounded-[40px] p-8 relative overflow-hidden text-left"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-navy text-gold flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-navy mb-2">Save your details?</h3>
              <p className="text-navy/60 text-xs font-bold mb-6 leading-relaxed">
                Create an account to track this booking, save your address, and get 10% off your next service.
              </p>
              <Button 
                className="w-full h-14 rounded-2xl bg-navy text-gold font-bold"
                onClick={() => navigate('/register', { state: { email: contact.email } })}
              >
                Create Account
              </Button>
              <button 
                onClick={() => navigate('/app')}
                className="w-full mt-4 text-[10px] font-bold uppercase tracking-widest text-navy/40 text-center"
              >
                Maybe Later
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-navy/5 rounded-full blur-3xl" />
          </motion.div>
        )}

        <Button 
          variant="ghost" 
          className="mt-8 text-navy/40 font-bold gap-2"
          onClick={() => navigate('/app')}
        >
          <Home className="w-4 h-4" /> Back to Home
        </Button>
      </div>
    </div>
  );
}
