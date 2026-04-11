import { motion } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationPromptProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function NotificationPrompt({ onAccept, onDecline }: NotificationPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/80 backdrop-blur-sm"
    >
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gold/10 -z-10" />
        
        <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gold/20">
          <Bell className="w-8 h-8 text-navy" />
        </div>

        <h2 className="text-2xl font-display font-bold text-navy mb-3">Stay Updated</h2>
        <p className="text-navy/60 text-sm leading-relaxed mb-8">
          Enable notifications to track your technician in real-time and get updates on your AC service jobs.
        </p>

        <div className="space-y-3">
          <Button 
            onClick={onAccept}
            className="w-full h-14 rounded-2xl bg-navy text-warm-white font-bold"
          >
            Allow Notifications
          </Button>
          <Button 
            onClick={onDecline}
            variant="ghost"
            className="w-full h-12 rounded-2xl text-navy/40 font-bold hover:text-navy hover:bg-navy/5"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
