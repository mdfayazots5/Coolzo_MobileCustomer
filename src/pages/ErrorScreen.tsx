import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AlertCircle, 
  RefreshCw, 
  Home, 
  MessageSquare, 
  WifiOff,
  Lock,
  Settings
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

interface ErrorScreenProps {
  type?: 'generic' | '404' | 'offline' | 'session' | 'maintenance';
}

const ErrorScreen = ({ type = 'generic' }: ErrorScreenProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const config = {
    generic: {
      icon: AlertCircle,
      title: 'Something went wrong',
      desc: 'We encountered an unexpected error. Please try again or contact support if the issue persists.',
      primaryAction: () => window.location.reload(),
      primaryLabel: 'Retry',
      secondaryAction: () => navigate('/app/support/new'),
      secondaryLabel: 'Contact Support',
      color: 'text-red-500 bg-red-50'
    },
    '404': {
      icon: Settings,
      title: 'Page not found',
      desc: "The page you're looking for doesn't exist or has been moved.",
      primaryAction: () => navigate('/app'),
      primaryLabel: 'Back to Home',
      secondaryAction: () => navigate(-1),
      secondaryLabel: 'Go Back',
      color: 'text-navy/40 bg-navy/5'
    },
    offline: {
      icon: WifiOff,
      title: 'No connection',
      desc: 'Please check your internet connection and try again.',
      primaryAction: () => window.location.reload(),
      primaryLabel: 'Try Again',
      secondaryAction: () => navigate('/app/jobs'),
      secondaryLabel: 'View Offline Jobs',
      color: 'text-amber-500 bg-amber-50'
    },
    session: {
      icon: Lock,
      title: 'Session Expired',
      desc: 'Your session has expired for security reasons. Please log in again to continue.',
      primaryAction: () => navigate('/login'),
      primaryLabel: 'Log In',
      secondaryAction: () => navigate('/auth-gate'),
      secondaryLabel: 'Guest Mode',
      color: 'text-gold bg-gold/10'
    },
    maintenance: {
      icon: Settings,
      title: 'Under Maintenance',
      desc: "We're performing some scheduled maintenance to improve your experience. We'll be back online in about 30 minutes.",
      primaryAction: () => window.location.reload(),
      primaryLabel: 'Check Status',
      secondaryAction: () => navigate('/contact'),
      secondaryLabel: 'Contact Us',
      color: 'text-blue-500 bg-blue-50'
    }
  };

  const current = config[type] || config.generic;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-warm-white">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-navy/5", current.color)}
      >
        <current.icon className="w-12 h-12" />
      </motion.div>

      <h1 className="text-3xl font-display font-bold text-navy mb-4">{current.title}</h1>
      <p className="text-navy/60 text-sm leading-relaxed mb-12 max-w-[280px]">
        {current.desc}
      </p>

      <div className="w-full space-y-3">
        <Button 
          onClick={current.primaryAction}
          className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-xl shadow-navy/20"
        >
          {current.primaryLabel}
        </Button>
        <Button 
          variant="ghost"
          onClick={current.secondaryAction}
          className="w-full h-14 rounded-2xl text-navy/40 font-bold"
        >
          {current.secondaryLabel}
        </Button>
      </div>

      <div className="mt-12 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-navy/20">
        <AlertCircle className="w-3 h-3" />
        Error Code: {type.toUpperCase()}_ERR_01
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
export default ErrorScreen;
