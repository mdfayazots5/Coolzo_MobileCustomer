import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Briefcase, 
  CreditCard, 
  MessageSquare, 
  Tag,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NotificationService, Notification } from '@/services/notificationService';
import { useAuthStore } from '@/store/useAuthStore';

const NotificationCentre = () => {
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
    // Service doesn't have delete yet, just mock UI for now
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return Bell;
      case 'success': return CheckCircle2;
      case 'warning': return Bell;
      case 'error': return Bell;
      default: return Bell;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-bold text-navy">Notifications</h1>
          </div>
          <button 
            onClick={markAllRead}
            className="text-[10px] font-bold text-gold uppercase tracking-widest"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4 pb-20">
        <AnimatePresence initial={false}>
          {notifications.map((notif) => {
            const Icon = getIcon(notif.type);
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  "bg-white rounded-[28px] p-5 border transition-all flex gap-4 relative group",
                  notif.isRead ? "border-navy/5 opacity-60" : "border-gold/30 shadow-lg shadow-gold/5"
                )}
                onClick={() => notif.link && navigate(notif.link)}
              >
                {!notif.isRead && (
                  <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-gold" />
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  notif.type === 'success' ? "bg-green-50 text-green-500" :
                  notif.type === 'warning' ? "bg-orange-50 text-orange-500" :
                  notif.type === 'error' ? "bg-red-50 text-red-500" :
                  "bg-blue-50 text-blue-500"
                )}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 pr-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-navy text-sm">{notif.title}</h3>
                  </div>
                  <p className="text-navy/60 text-xs leading-relaxed mb-3">{notif.message}</p>
                  <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-navy/20">
                    <Clock className="w-3 h-3" />
                    {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString() : new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="absolute bottom-5 right-5 w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-navy/10" />
            </div>
            <h3 className="text-lg font-display font-bold text-navy mb-2">All Caught Up!</h3>
            <p className="text-navy/40 text-sm">No new notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCentre;
