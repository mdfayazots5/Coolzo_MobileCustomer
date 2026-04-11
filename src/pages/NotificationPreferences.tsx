import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Preference {
  id: string;
  label: string;
  description: string;
  channels: {
    push: boolean;
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
  required?: boolean;
}

const INITIAL_PREFERENCES: Preference[] = [
  {
    id: 'booking',
    label: 'Booking Confirmations',
    description: 'Updates about your service bookings and schedules.',
    channels: { push: true, whatsapp: true, email: true, sms: true },
    required: true
  },
  {
    id: 'technician',
    label: 'Technician Updates',
    description: 'Live tracking and technician arrival notifications.',
    channels: { push: true, whatsapp: true, email: false, sms: true }
  },
  {
    id: 'payment',
    label: 'Invoice & Payments',
    description: 'Billing updates, receipts, and payment reminders.',
    channels: { push: true, whatsapp: true, email: true, sms: false }
  },
  {
    id: 'amc',
    label: 'AMC Reminders',
    description: 'Notifications for upcoming AMC visits and renewals.',
    channels: { push: true, whatsapp: true, email: true, sms: true }
  },
  {
    id: 'promotions',
    label: 'Offers & Promotions',
    description: 'Exclusive discounts and seasonal service offers.',
    channels: { push: false, whatsapp: false, email: true, sms: false }
  }
];

const NotificationPreferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(INITIAL_PREFERENCES);
  const [isSaving, setIsSaving] = useState(false);

  const toggleChannel = (prefId: string, channel: keyof Preference['channels']) => {
    setPreferences(prev => prev.map(p => {
      if (p.id === prefId && !p.required) {
        return {
          ...p,
          channels: { ...p.channels, [channel]: !p.channels[channel] }
        };
      }
      return p;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast.success('Preferences saved successfully');
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
          {preferences.map((pref) => (
            <div key={pref.id} className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm">
              <div className="mb-6">
                <h3 className="font-bold text-navy mb-1">{pref.label}</h3>
                <p className="text-navy/40 text-[10px] font-medium leading-relaxed">{pref.description}</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'push', icon: Bell, label: 'Push' },
                  { id: 'whatsapp', icon: MessageSquare, label: 'WA' },
                  { id: 'email', icon: Mail, label: 'Email' },
                  { id: 'sms', icon: Smartphone, label: 'SMS' }
                ].map((channel) => (
                  <button
                    key={channel.id}
                    disabled={pref.required}
                    onClick={() => toggleChannel(pref.id, channel.id as any)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                      pref.channels[channel.id as keyof Preference['channels']]
                        ? "bg-gold/10 border-gold text-gold"
                        : "bg-navy/5 border-transparent text-navy/20",
                      pref.required && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <channel.icon className="w-5 h-5" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">{channel.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
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
