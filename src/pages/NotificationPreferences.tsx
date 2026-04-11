import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone,
  CheckCircle2,
  Info,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NotificationService, NotificationPreferences as Prefs } from '@/services/notificationService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const NotificationPreferences = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      if (!user) return;
      try {
        const data = await NotificationService.getPreferences(user.uid);
        setPrefs(data);
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrefs();
  }, [user]);

  const toggleChannel = (channel: keyof Prefs) => {
    if (!prefs) return;
    setPrefs({ ...prefs, [channel]: !prefs[channel] });
  };

  const handleSave = async () => {
    if (!user || !prefs) return;
    setIsSaving(true);
    try {
      await NotificationService.updatePreferences(user.uid, prefs);
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setIsSaving(false);
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
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Notification Preferences</h1>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Info Card */}
        <div className="bg-blue-50 rounded-3xl p-6 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            Critical updates like OTPs and booking confirmations are mandatory and cannot be disabled.
          </p>
        </div>

        {/* Preferences List */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-navy mb-1">Communication Channels</h3>
              <p className="text-navy/40 text-[10px] font-medium leading-relaxed">Choose how you want to receive updates from us.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'push', icon: Bell, label: 'Push Notifications' },
                { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp' },
                { id: 'email', icon: Mail, label: 'Email' },
                { id: 'sms', icon: Smartphone, label: 'SMS' }
              ].map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => toggleChannel(channel.id as keyof Prefs)}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all",
                    prefs?.[channel.id as keyof Prefs]
                      ? "bg-gold/10 border-gold text-gold"
                      : "bg-navy/5 border-transparent text-navy/20"
                  )}
                >
                  <channel.icon className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{channel.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm">
            <div className="mb-6">
              <h3 className="font-bold text-navy mb-1">Content Preferences</h3>
              <p className="text-navy/40 text-[10px] font-medium leading-relaxed">Select the type of content you want to see.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'offers', label: 'Offers & Promotions', desc: 'Get notified about exclusive deals' },
                { id: 'updates', label: 'Service Updates', desc: 'New features and service improvements' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChannel(item.id as keyof Prefs)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                    prefs?.[item.id as keyof Prefs]
                      ? "bg-gold/5 border-gold/20"
                      : "bg-white border-navy/5"
                  )}
                >
                  <div className="text-left">
                    <p className="text-sm font-bold text-navy">{item.label}</p>
                    <p className="text-[10px] text-navy/40 font-medium">{item.desc}</p>
                  </div>
                  <div className={cn(
                    "w-10 h-6 rounded-full relative transition-colors",
                    prefs?.[item.id as keyof Prefs] ? "bg-gold" : "bg-navy/10"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      prefs?.[item.id as keyof Prefs] ? "left-5" : "left-1"
                    )} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-navy/5 z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-16 rounded-[24px] bg-gold text-navy font-bold text-lg shadow-xl shadow-gold/20 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
