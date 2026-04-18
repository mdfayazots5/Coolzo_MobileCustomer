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
    toast.success("Engagement reference copied to clipboard");
  };

  const handleShare = () => {
    const text = `Institutional deployment synchronized with Coolzo. Reference: ${bookingRef}. Experience the elite standard.`;
    if (navigator.share) {
      navigator.share({ title: 'Coolzo Deployment', text });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32 relative overflow-hidden">
      <div className="flex-1 px-8 py-24 flex flex-col items-center text-center relative z-10">
        {/* Cinematic Success Signature */}
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-40 h-40 bg-navy rounded-[48px] flex items-center justify-center mb-16 shadow-3xl shadow-navy/40 relative group"
        >
          <div className="absolute inset-0 bg-gold/20 rounded-[48px] animate-ping opacity-20" />
          <div className="absolute inset-0 bg-gold/10 rounded-[48px] blur-3xl group-hover:bg-gold/20 transition-colors duration-1000" />
          <Check className="w-20 h-20 text-gold stroke-[4] relative z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 mb-20"
        >
          <h1 className="text-[48px] font-display font-bold text-navy tracking-tighter leading-none italic">Deployment <span className="text-gold">Cleared.</span></h1>
          <p className="text-navy/30 text-[12px] font-bold uppercase tracking-[0.4em] italic leading-tight">Tactical Synchronization Successful</p>
        </motion.div>

        {/* Reference Dossier Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md bg-white rounded-[72px] p-12 border border-navy/5 shadow-2xl shadow-black/[0.01] mb-20 relative overflow-hidden group"
        >
          <div className="absolute top-0 inset-x-0 h-2 bg-navy/5 group-hover:bg-gold/20 transition-colors duration-1000" />
          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 mb-8 italic">Engagement Reference Dossier</p>
          <div className="flex items-center justify-center gap-8 mb-16 relative z-10">
            <span className="text-[44px] font-mono font-bold text-navy tracking-tighter italic">{bookingRef}</span>
            <button 
              onClick={handleCopy}
              className="w-16 h-16 rounded-[24px] bg-navy/5 flex items-center justify-center text-navy/20 hover:text-navy hover:bg-navy/10 transition-all active:scale-90 shadow-inner group-hover:bg-gold/10 group-hover:text-gold"
            >
              <Copy className="w-7 h-7" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-8 relative z-10">
            <Button 
              variant="outline" 
              className="h-20 rounded-[28px] border-navy/10 text-navy/40 font-bold gap-4 uppercase tracking-[0.3em] text-[12px] bg-navy/5 hover:bg-navy/10 transition-all active:scale-95 italic shadow-sm"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" /> Share
            </Button>
            <Button 
              className="h-20 rounded-[28px] bg-navy text-gold font-bold gap-4 uppercase tracking-[0.3em] text-[12px] shadow-3xl shadow-navy/40 hover:bg-navy/95 active:scale-95 transition-all italic"
              onClick={() => navigate('/app/jobs')}
            >
              Telemetry <ArrowRight className="w-5 h-5 text-gold" />
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-gold/[0.01] rounded-tl-full pointer-events-none group-hover:bg-gold/5 transition-colors duration-1000" />
        </motion.div>

        {/* Tactical Timeline */}
        <div className="w-full max-w-md space-y-16 px-4 mb-24 text-left">
          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20">Operational Roadmap</h3>
            <h2 className="text-[32px] font-display font-bold text-navy tracking-tighter italic">Imminent Phases</h2>
          </div>
          <div className="space-y-12">
            {[
              { icon: ShieldCheck, title: 'Expert Allocation', desc: 'Sourcing the optimal field operative authorized for your hardware.' },
              { icon: MessageSquare, title: 'Vocal Authorization', desc: 'Operative will establish direct verbal communication to finalize the vector.' },
              { icon: Calendar, title: 'Tactical Presence', desc: 'Professional deployment with standardized high-precision industrial kit.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-10 relative group">
                {i < 2 && <div className="absolute left-8.5 top-18 bottom-[-48px] w-px bg-navy/5 group-hover:bg-gold/30 transition-colors" />}
                <div className="w-18 h-18 rounded-[28px] bg-navy/5 flex items-center justify-center text-navy/10 shrink-0 group-hover:bg-navy group-hover:text-gold transition-all duration-1000 shadow-inner">
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="pt-3">
                  <h4 className="font-bold text-navy text-[19px] mb-2 tracking-tight group-hover:text-gold transition-colors italic leading-none">{step.title}</h4>
                  <p className="text-[14px] text-navy/40 leading-relaxed font-bold italic uppercase tracking-tight opacity-70">"{step.desc}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Identity Synchronization Protocol */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md bg-gold rounded-[72px] p-12 relative overflow-hidden text-left shadow-3xl shadow-gold/30 group active:scale-[0.99] transition-all"
          >
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-[32px] bg-navy text-gold flex items-center justify-center mb-10 shadow-3xl shadow-navy/30 group-hover:rotate-6 transition-transform duration-1000">
                <UserPlus className="w-10 h-10" />
              </div>
              <h3 className="text-[36px] font-display font-bold text-navy mb-4 tracking-tighter leading-none italic">Preserve Protocol?</h3>
              <p className="text-navy/60 text-[14px] font-bold mb-12 leading-relaxed opacity-80 uppercase tracking-[0.1em] italic">
                Establish a permanent alias to synchronize future missions and secure grandfathered rate matrix.
              </p>
              <Button 
                className="w-full h-22 rounded-[32px] bg-navy text-gold font-bold text-[20px] uppercase tracking-[0.3em] shadow-3xl shadow-navy/40 hover:bg-navy/95 active:scale-95 transition-all italic"
                onClick={() => navigate('/register', { state: { email: contact.email } })}
              >
                Establish Identity
              </Button>
              <button 
                onClick={() => navigate('/app')}
                className="w-full mt-10 text-[11px] font-bold uppercase tracking-[0.5em] text-navy/30 text-center hover:text-navy transition-colors italic"
              >
                Defer Identity Registry
              </button>
            </div>
            <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-navy/5 rounded-full blur-[100px]" />
            <UserPlus className="absolute top-12 right-12 w-32 h-32 text-navy/5 -rotate-12 group-hover:rotate-0 transition-transform duration-[3000ms]" />
          </motion.div>
        )}

        <Button 
          variant="ghost" 
          className="mt-20 text-navy/20 font-bold gap-6 text-[13px] uppercase tracking-[0.5em] hover:text-navy hover:bg-navy/5 transition-all px-12 h-16 rounded-full italic mx-auto"
          onClick={() => navigate('/app')}
        >
          <Home className="w-5 h-5 opacity-40" /> Return to Core
        </Button>
      </div>

      {/* Atmospheric Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[140px] -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy/5 rounded-full blur-[120px] -ml-20 -mb-20 pointer-events-none" />
    </div>
  );
}
