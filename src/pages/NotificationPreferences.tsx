import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone,
  Info,
  Loader2
} from 'lucide-react';
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

  const categories = prefs ? [
    { id: 'booking', label: 'Booking Confirmations', desc: 'Critical booking and OTP traffic stays enabled.', value: true, locked: true },
    { id: 'technician', label: 'Technician Updates', desc: 'Assignments, arrivals, and field changes.', value: prefs.updates, toggleKey: 'updates' as keyof Prefs },
    { id: 'job', label: 'Job Status', desc: 'Progress milestones and service completion signals.', value: prefs.updates, toggleKey: 'updates' as keyof Prefs },
    { id: 'invoice', label: 'Invoice / Payment', desc: 'Invoice issuance and payment reminders.', value: prefs.updates, toggleKey: 'updates' as keyof Prefs },
    { id: 'amc', label: 'AMC Reminders', desc: 'Upcoming visit and renewal notices.', value: prefs.updates, toggleKey: 'updates' as keyof Prefs },
    { id: 'promotions', label: 'Promotions', desc: 'Discounts, offers, and growth campaigns.', value: prefs.offers, toggleKey: 'offers' as keyof Prefs },
    { id: 'support', label: 'Support', desc: 'Ticket replies and closure updates.', value: prefs.updates, toggleKey: 'updates' as keyof Prefs },
  ] : [];

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
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-8 border-b border-navy/5 sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-white/90">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center text-navy active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-[20px] font-display font-bold text-navy tracking-tight">Signal Calibration</h1>
            <p className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] mt-0.5">Communication Preferences</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-10 space-y-10 pb-40">
        {/* Info Card */}
        <div className="bg-navy rounded-[32px] p-8 flex gap-6 shadow-2xl shadow-navy/20 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold shrink-0 border border-white/5 relative z-10">
            <Info className="w-6 h-6" />
          </div>
          <p className="text-[12px] text-warm-white/60 leading-relaxed font-bold uppercase tracking-[0.1em] relative z-10">
            Critical updates like <span className="text-gold">Secure OTPs</span> and <span className="text-gold">Deployment Confirmations</span> are hard-coded for system integrity and cannot be disabled.
          </p>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gold/5 rounded-full blur-2xl" />
        </div>

        {/* Preferences List */}
        <div className="space-y-10">
          <div className="bg-white rounded-[40px] p-10 border border-navy/5 shadow-sm">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-navy text-[17px] tracking-tight">Transmission Channels</h3>
                <p className="text-navy/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">Select primary downlink methods</p>
              </div>
              <Smartphone className="w-5 h-5 text-gold/40" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'push', icon: Bell, label: 'Push Hub' },
                { id: 'whatsapp', icon: MessageSquare, label: 'Secure WA' },
                { id: 'email', icon: Mail, label: 'Standard E-Mail' },
                { id: 'sms', icon: Smartphone, label: 'Legacy SMS' }
              ].map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => toggleChannel(channel.id as keyof Prefs)}
                  className={cn(
                    "flex flex-col items-center gap-4 p-6 rounded-[32px] border transition-all active:scale-95",
                    prefs?.[channel.id as keyof Prefs]
                      ? "bg-gold/5 border-gold text-gold shadow-xl shadow-gold/5"
                      : "bg-navy/5 border-transparent text-navy/20"
                  )}
                >
                  <channel.icon className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{channel.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-10 border border-navy/5 shadow-sm">
            <div className="mb-10">
              <h3 className="font-bold text-navy text-[17px] tracking-tight">Notification Categories</h3>
              <p className="text-navy/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">Operational categories are mapped from the live communication preference record</p>
            </div>

            <div className="space-y-4">
              {categories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => !item.locked && item.toggleKey && toggleChannel(item.toggleKey)}
                  className={cn(
                    "w-full flex items-center justify-between p-7 rounded-[32px] border transition-all active:scale-[0.98]",
                    item.value
                      ? "bg-gold/5 border-gold/20"
                      : "bg-white border-navy/5 shadow-inner"
                  )}
                >
                  <div className="text-left flex-1 pr-6">
                    <p className="text-[15px] font-bold text-navy leading-tight">{item.label}</p>
                    <p className="text-[10px] text-navy/40 font-bold uppercase tracking-[0.1em] mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                  {item.locked ? (
                    <div className="rounded-full bg-navy text-gold px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em]">
                      Locked
                    </div>
                  ) : (
                    <div className={cn(
                      "w-12 h-7 rounded-full relative transition-all duration-300",
                      item.value ? "bg-gold shadow-lg shadow-gold/20" : "bg-navy/10"
                    )}>
                      <div className={cn(
                        "absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm",
                        item.value ? "left-6" : "left-1"
                      )} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/90 backdrop-blur-xl border-t border-navy/5 z-50">
          <div className="max-w-[440px] mx-auto">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-18 rounded-[24px] bg-navy text-gold font-bold text-[16px] uppercase tracking-[0.25em] shadow-2xl shadow-navy/30 active:scale-95 transition-all hover:bg-navy/95"
            >
              {isSaving ? <Loader2 className="w-7 h-7 animate-spin" /> : 'Commit Preferences'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
