import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  MessageSquare, 
  WifiOff,
  ShieldAlert,
  Cog,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

interface ErrorScreenProps {
  type?: 'generic' | '404' | 'offline' | 'session' | 'maintenance';
}

export default function ErrorScreen({ type = 'generic' }: ErrorScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const config = {
    generic: {
      icon: AlertTriangle,
      title: 'Logic Disruption',
      desc: 'We encountered an unexpected operational anomaly. Please re-synchronize or contact your executive support relay.',
      primaryAction: () => window.location.reload(),
      primaryLabel: 'Re-Synchronize',
      secondaryAction: () => navigate('/app/support/new'),
      secondaryLabel: 'Support Relay',
      color: 'text-red-500 bg-red-50/50'
    },
    '404': {
      icon: Search,
      title: 'Target Missing',
      desc: "The requested architectural coordinate does not exist or has been re-allocated within our primary DNS.",
      primaryAction: () => navigate('/app'),
      primaryLabel: 'Base Protocol',
      secondaryAction: () => navigate(-1),
      secondaryLabel: 'Previous State',
      color: 'text-navy/40 bg-navy/5'
    },
    offline: {
      icon: WifiOff,
      title: 'Signal Lost',
      desc: 'Local communication grid is currently inactive. Please restore your link telemetry to continue.',
      primaryAction: () => window.location.reload(),
      primaryLabel: 'Restore Link',
      secondaryAction: () => navigate('/app/jobs'),
      secondaryLabel: 'Archival Jobs',
      color: 'text-amber-500 bg-amber-50/50'
    },
    session: {
      icon: ShieldAlert,
      title: 'Auth Expired',
      desc: 'Your security handshake has reached terminal duration. Please re-authenticate to verify your identity.',
      primaryAction: () => navigate('/login'),
      primaryLabel: 'Re-Authenticate',
      secondaryAction: () => navigate('/auth-gate'),
      secondaryLabel: 'Guest Access',
      color: 'text-gold bg-gold/5'
    },
    maintenance: {
      icon: Cog,
      title: 'Recalibrating',
      desc: "System is undergoing scheduled structural calibration. Anticipated uptime restoration: T-minus 30 minutes.",
      primaryAction: () => window.location.reload(),
      primaryLabel: 'Check Status',
      secondaryAction: () => navigate('/contact'),
      secondaryLabel: 'Contact Relay',
      color: 'text-blue-500 bg-blue-50/50'
    }
  };

  const current = config[type] || config.generic;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 text-center bg-warm-white relative overflow-hidden italic">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -ml-40 -mb-20 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className={cn("w-32 h-32 rounded-[48px] flex items-center justify-center mb-12 shadow-3xl shadow-black/[0.02] relative group", current.color)}
      >
        <current.icon className="w-16 h-16 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-white/40 rounded-[48px] animate-pulse pointer-events-none" />
      </motion.div>

      <div className="space-y-4 mb-20 max-w-sm">
        <h1 className="text-[40px] font-display font-bold text-navy leading-none tracking-tighter uppercase italic">{current.title}</h1>
        <p className="text-navy/40 text-[15px] leading-relaxed font-medium italic">
          {current.desc}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <Button 
          onClick={current.primaryAction}
          className="w-full h-18 rounded-[32px] bg-navy text-gold font-bold text-[15px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/30 active:scale-95 transition-all"
        >
          {current.primaryLabel}
        </Button>
        <Button 
          variant="ghost"
          onClick={current.secondaryAction}
          className="w-full h-14 rounded-2xl text-navy/20 font-bold uppercase tracking-[0.3em] text-[11px] active:scale-95 transition-all"
        >
          {current.secondaryLabel}
        </Button>
      </div>

      <div className="mt-24 flex items-center gap-4 py-3 px-6 bg-navy/5 rounded-full">
        <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/30">
          Fault Code: {type.toUpperCase()}_LOGIC_0x{Math.floor(Math.random() * 1000).toString(16).toUpperCase()}
        </p>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
