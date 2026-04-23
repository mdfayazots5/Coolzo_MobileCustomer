import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  Bell, 
  ShieldCheck,
  Info,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NotificationService, NotificationPreferences } from '@/services/notificationService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const PERMISSIONS_STORAGE_KEY = 'coolzo-device-permissions';

type PermissionStatusValue = 'Granted' | 'Denied' | 'Not Requested';

interface LocalPermissionState {
  location: PermissionStatusValue;
  push: PermissionStatusValue;
}

const PermissionsManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [permissionState, setPermissionState] = useState<LocalPermissionState>({
    location: 'Not Requested',
    push: 'Not Requested',
  });

  useEffect(() => {
    const stored = window.localStorage.getItem(PERMISSIONS_STORAGE_KEY);

    if (!stored) {
      return;
    }

    try {
      setPermissionState(JSON.parse(stored) as LocalPermissionState);
    } catch {
      window.localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        return;
      }

      try {
        setPrefs(await NotificationService.getPreferences(user.uid));
      } catch {
        setPrefs({
          push: false,
          email: true,
          sms: false,
          whatsapp: true,
          offers: true,
          updates: true,
        });
      }
    };

    void loadPreferences();
  }, [user]);

  const persistPermissionState = (nextState: LocalPermissionState) => {
    setPermissionState(nextState);
    window.localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(nextState));
  };

  const perms = [
    { 
      id: 'location', 
      icon: MapPin, 
      label: 'Location Services', 
      desc: 'Essential for precise service delivery and real-time technician tracking to your doorstep.',
      status: permissionState.location,
    },
    { 
      id: 'push', 
      icon: Bell, 
      label: 'Push Notifications', 
      desc: 'Receive exclusive updates on your service status, premium offers, and priority support.',
      status: permissionState.push,
    }
  ];

  const handleEnable = async (id: string) => {
    setIsUpdating(id);
    try {
      if (id === 'location') {
        if (!navigator.geolocation) {
          throw new Error('Location services are not supported on this device.');
        }

        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(),
            () => reject(new Error('Location access denied')),
          );
        });

        persistPermissionState({ ...permissionState, location: 'Granted' });
        toast.success('Location access granted');
        return;
      }

      if (id === 'push') {
        if (!prefs || !user) {
          throw new Error('Notification preferences are unavailable.');
        }

        if (typeof Notification === 'undefined') {
          throw new Error('Push notifications are not supported on this device.');
        }

        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
          persistPermissionState({ ...permissionState, push: 'Denied' });
          throw new Error('Notification access denied');
        }

        await NotificationService.updatePreferences(user.uid, {
          ...prefs,
          push: true,
        });

        setPrefs({ ...prefs, push: true });
        persistPermissionState({ ...permissionState, push: 'Granted' });
        toast.success('Push access granted');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update permission');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy hover:bg-navy/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-bold text-navy tracking-tight">Access Control</h1>
          </div>
          <Badge variant="outline" className="border-gold/30 text-gold font-bold text-[10px] uppercase tracking-widest px-3">
            Secure
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32 max-w-md mx-auto w-full">
        {/* Premium Banner */}
        <div className="relative group">
          <div className="absolute inset-0 bg-navy rounded-[40px] transform transition-transform group-hover:scale-[1.02] duration-500" />
          <div className="relative p-10 text-warm-white overflow-hidden rounded-[40px]">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center text-gold mb-8 border border-gold/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gold mb-3 leading-tight">Privacy & Precision</h2>
              <p className="text-warm-white/60 text-sm leading-relaxed font-light">
                At Coolzo, your privacy is as important as your comfort. We only request access essential for delivering a seamless, premium service experience.
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-32 h-32" />
            </div>
          </div>
        </div>

        {/* Permissions List */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40 px-2">Active Permissions</h3>
          {perms.map((perm) => (
            <motion.div 
              key={perm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 border border-navy/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                    perm.status === 'Granted' ? "bg-green-50 text-green-500" : "bg-navy/5 text-navy/40"
                  )}>
                    <perm.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-lg">{perm.label}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        perm.status === 'Granted' ? "bg-green-500" : "bg-navy/20"
                      )} />
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        perm.status === 'Granted' ? "text-green-600" : "text-navy/30"
                      )}>
                        {perm.status}
                      </span>
                    </div>
                  </div>
                </div>
                {perm.status !== 'Granted' && (
                  <Button 
                    onClick={() => handleEnable(perm.id)}
                    disabled={isUpdating === perm.id}
                    className="bg-navy text-gold hover:bg-navy/90 rounded-xl px-6 font-bold text-xs h-11"
                  >
                    {isUpdating === perm.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enable'}
                  </Button>
                )}
              </div>
              <p className="text-navy/50 text-xs leading-relaxed font-medium pr-4">{perm.desc}</p>
              
              {/* Subtle hover effect */}
              <div className="absolute top-0 right-0 w-1 h-full bg-gold transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
            </motion.div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="flex gap-5 p-8 bg-white rounded-[32px] border border-navy/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/30 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-navy">System Settings</p>
            <p className="text-[10px] text-navy/40 leading-relaxed font-medium">
              You can manage these preferences anytime in your device's system settings under the Coolzo application profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsManagement;
