import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Loader2,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NotificationService, Notification } from '@/services/notificationService';
import { useAuthStore } from '@/store/useAuthStore';

export default function NotificationCentre() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = NotificationService.onNotificationsUpdate(user.uid, (data) => {
      setNotifications(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => NotificationService.markAsRead(n.id)));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return Bell;
      case 'success': return ShieldCheck;
      case 'warning': return AlertTriangle;
      case 'error': return ShieldAlert;
      default: return Zap;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden italic">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[160px] -ml-40 -mt-20 pointer-events-none" />

      {/* Intelligence Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-8 text-left">
            <button 
              onClick={() => navigate('/app')}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div>
              <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase italic">Intelligence</h1>
              <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.5em] mt-2">Active Signal Distribution</p>
            </div>
          </div>
          <button 
            onClick={markAllRead}
            className="w-14 h-14 rounded-[22px] bg-gold text-navy flex items-center justify-center active:scale-90 transition-all shadow-3xl shadow-gold/20 font-bold hover:bg-white"
          >
            <CheckCircle2 className="w-6 h-6" />
          </button>
        </div>
        
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-8 relative z-30 pb-40">
        <AnimatePresence initial={false}>
          {notifications.map((notif, index) => {
            const Icon = getIcon(notif.type);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "bg-white rounded-[48px] p-10 border transition-all flex gap-8 relative group shadow-3xl shadow-black/[0.01] active:scale-[0.98] hover:border-gold/30",
                  notif.isRead ? "border-navy/5 opacity-40 shadow-none" : "border-gold/20 shadow-gold/5"
                )}
                onClick={() => notif.link && navigate(notif.link)}
              >
                {!notif.isRead && (
                  <div className="absolute top-10 right-10 w-4 h-4 rounded-full bg-gold shadow-[0_0_20px_rgba(201,162,74,1)] animate-pulse border-4 border-white" />
                )}
                
                <div className={cn(
                  "w-20 h-20 rounded-[32px] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-700",
                  notif.type === 'success' ? "bg-green-500/10 text-green-500" :
                  notif.type === 'warning' ? "bg-gold/10 text-gold" :
                  notif.type === 'error' ? "bg-red-500/10 text-red-500" :
                  "bg-navy/5 text-navy/10"
                )}>
                  <Icon className="w-10 h-10" />
                </div>

                <div className="flex-1 pr-12">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[9px] font-bold text-navy/10 uppercase tracking-[0.4em]">Signal 0x{notif.id.slice(0, 4).toUpperCase()}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-navy/5" />
                    <span className="text-[9px] font-bold text-gold uppercase tracking-[0.3em]">{notif.type} protocol</span>
                  </div>
                  <h3 className="font-display font-bold text-navy text-[22px] leading-tight mb-3 tracking-tighter uppercase italic group-hover:text-gold transition-colors">{notif.title}</h3>
                  <p className="text-navy/40 text-[14px] font-medium leading-[1.6] mb-6 italic">{notif.message}</p>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-navy/20">
                    <Clock className="w-4 h-4 text-gold/30" />
                    {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="absolute bottom-10 right-10 w-14 h-14 rounded-[22px] bg-red-50 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white active:scale-90 shadow-3xl shadow-red-500/10"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.01] rounded-bl-full pointer-events-none" />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="py-48 text-center px-12">
            <div className="w-32 h-32 bg-navy/5 rounded-[56px] flex items-center justify-center mx-auto mb-10 shadow-inner">
              <Bell className="w-14 h-14 text-navy/10" />
            </div>
            <h3 className="text-[28px] font-display font-bold text-navy mb-4 tracking-tighter uppercase italic">Signal Silence</h3>
            <p className="text-navy/30 text-[12px] font-bold uppercase tracking-[0.4em] max-w-[320px] mx-auto leading-relaxed italic">No active tactical transmissions detected for your executive account at this timestamp.</p>
          </div>
        )}
      </div>
    </div>
  );
}
