import { motion } from 'motion/react';
import { Bell, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccessRequestPromptProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function AccessRequestPrompt({ onAccept, onDecline }: AccessRequestPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-[#FDFCFB] rounded-[40px] p-10 max-w-sm w-full text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gold/10 to-transparent -z-10" />
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-gold/5 rounded-full blur-3xl" />
        
        <div className="mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/60">Coolzo Premium</span>
        </div>

        {/* Icon Stack */}
        <div className="relative flex justify-center mb-10">
          <div className="w-20 h-20 bg-navy rounded-[28px] flex items-center justify-center shadow-2xl shadow-navy/20 relative z-10">
            <ShieldCheck className="w-10 h-10 text-gold" />
          </div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 w-20 h-20 bg-gold rounded-[28px] blur-xl mx-auto"
          />
        </div>

        <h2 className="text-3xl font-display font-bold text-navy mb-4 tracking-tight">Elevated Experience</h2>
        <p className="text-navy/50 text-sm leading-relaxed mb-10 font-medium">
          To provide the precision and excellence you expect from Coolzo, we require access to your location and notifications.
        </p>

        {/* Feature List */}
        <div className="space-y-6 mb-10 text-left">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-navy uppercase tracking-widest">Live Tracking</p>
              <p className="text-[10px] text-navy/40 font-medium">Precise technician arrival updates.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-navy uppercase tracking-widest">Priority Alerts</p>
              <p className="text-[10px] text-navy/40 font-medium">Instant service and payment status.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={onAccept}
            className="w-full h-16 rounded-2xl bg-navy text-gold hover:bg-navy/95 font-bold text-base shadow-xl shadow-navy/20 group"
          >
            Grant Access
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <button 
            onClick={onDecline}
            className="w-full py-2 text-navy/30 hover:text-navy/60 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors"
          >
            Review Later
          </button>
        </div>

        {/* Security Badge */}
        <div className="mt-8 pt-8 border-t border-navy/5 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span className="text-[8px] font-bold text-navy/30 uppercase tracking-widest">Bank-Grade Encryption</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
