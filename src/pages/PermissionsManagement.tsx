import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  Bell, 
  Camera, 
  Image as ImageIcon,
  ShieldCheck,
  ChevronRight,
  Info,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PermissionsManagement = () => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [perms, setPerms] = useState([
    { 
      id: 'location', 
      icon: MapPin, 
      label: 'Location Services', 
      desc: 'Required for accurate booking and live technician tracking.',
      status: 'Granted'
    },
    { 
      id: 'push', 
      icon: Bell, 
      label: 'Push Notifications', 
      desc: 'Get real-time updates on job status, payments, and support.',
      status: 'Granted'
    },
    { 
      id: 'camera', 
      icon: Camera, 
      label: 'Camera Access', 
      desc: 'Used for uploading profile photos and scanning QR codes.',
      status: 'Denied'
    },
    { 
      id: 'photos', 
      icon: ImageIcon, 
      label: 'Photo Library', 
      desc: 'Used for attaching images to support tickets.',
      status: 'Not Asked'
    }
  ]);

  const handleEnable = async (id: string) => {
    setIsUpdating(id);
    // Simulate system permission request
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPerms(perms.map(p => p.id === id ? { ...p, status: 'Granted' } : p));
    setIsUpdating(null);
    toast.success('Permission granted');
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">App Permissions</h1>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Security Banner */}
        <div className="bg-navy rounded-[32px] p-8 text-warm-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gold mb-2">Privacy First</h2>
            <p className="text-warm-white/60 text-sm leading-relaxed">
              We only request permissions that are essential for providing a premium service experience. Your data is always encrypted and secure.
            </p>
          </div>
          <ShieldCheck className="absolute -right-10 -bottom-10 w-48 h-48 text-warm-white/5" />
        </div>

        {/* Permissions List */}
        <div className="space-y-4">
          {perms.map((perm) => (
            <div key={perm.id} className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    perm.status === 'Granted' ? "bg-green-50 text-green-500" :
                    perm.status === 'Denied' ? "bg-red-50 text-red-500" :
                    "bg-navy/5 text-navy/40"
                  )}>
                    <perm.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy">{perm.label}</h3>
                    <Badge className={cn(
                      "border-none font-bold text-[8px] uppercase tracking-widest px-2 py-0.5 mt-1",
                      perm.status === 'Granted' ? "bg-green-50 text-green-600" :
                      perm.status === 'Denied' ? "bg-red-50 text-red-600" :
                      "bg-navy/5 text-navy/40"
                    )}>
                      {perm.status}
                    </Badge>
                  </div>
                </div>
                {perm.status !== 'Granted' && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleEnable(perm.id)}
                    disabled={isUpdating === perm.id}
                    className="text-gold font-bold text-[10px] uppercase tracking-widest"
                  >
                    {isUpdating === perm.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enable'}
                  </Button>
                )}
              </div>
              <p className="text-navy/40 text-[10px] font-medium leading-relaxed">{perm.desc}</p>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="flex gap-4 p-6 bg-navy/5 rounded-3xl">
          <Info className="w-5 h-5 text-navy/40 shrink-0" />
          <p className="text-[10px] text-navy/60 leading-relaxed font-medium">
            You can also manage these permissions anytime from your device's <b>System Settings</b> under Coolzo app info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermissionsManagement;
