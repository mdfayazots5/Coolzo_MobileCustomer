import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, MessageSquare, Mail, Clock, MapPin, Send, Loader2, Headphones, ChevronRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SupportService } from '@/services/supportService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function Contact() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Authentication required for transmission.');
      return;
    }
    setIsSubmitting(true);
    try {
      await SupportService.createTicket(user.uid, {
        subject: formData.subject,
        description: formData.message,
        category: 'Concierge Inquiry',
        priority: 'Medium'
      });
      toast.success('Concierge mission acknowledged. We will synchronize shortly.');
      setFormData({ ...formData, subject: '', message: '' });
    } catch (error) {
      toast.error('Transmission failed. Utilize direct channels.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    { icon: Phone, label: 'Voice Link', value: '+91 98765 43210', desc: 'Secure direct line' },
    { icon: MessageSquare, label: 'WhatsApp', value: 'WhatsApp Elite', desc: 'Encrypted telemetry' },
    { icon: Mail, label: 'Correspondence', value: 'concierge@coolzo.com', desc: 'Official documentation' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Concierge Header */}
      <div className="px-8 pt-16 pb-32 bg-navy text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <button 
          onClick={() => navigate('/app')}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white mb-12 active:scale-90 transition-all shadow-3xl"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <div className="relative z-10 space-y-4 italic">
          <h1 className="text-[44px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Concierge</h1>
          <p className="text-warm-white/30 text-[12px] font-bold uppercase tracking-[0.4em] leading-none">Institutional Intelligence Relay</p>
        </div>
        <Headphones className="absolute -right-20 -bottom-20 w-[420px] h-[420px] text-warm-white/[0.03] rotate-12 pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-16 py-12 space-y-20 relative z-30 italic">
        {/* Quick Contact Matrix */}
        <div className="grid grid-cols-1 gap-8">
          {contactMethods.map((method, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }}
              className="bg-white rounded-[64px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.01] flex items-center justify-between group active:scale-[0.99] transition-all hover:border-gold/30"
            >
              <div className="flex items-center gap-10">
                <div className="w-24 h-24 rounded-[36px] bg-navy/[0.04] flex items-center justify-center text-navy/10 group-hover:bg-navy group-hover:text-gold transition-all duration-700 shadow-inner">
                  <method.icon className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/20">{method.label}</p>
                  <p className="text-[22px] font-display font-bold text-navy tracking-tight leading-none uppercase">{method.value}</p>
                  <p className="text-[12px] text-navy/40 font-bold uppercase tracking-widest">{method.desc}</p>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full border border-navy/5 flex items-center justify-center text-navy/10 group-hover:bg-gold group-hover:text-navy transition-all duration-700 shadow-3xl">
                <ChevronRight className="w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transmission Hub */}
        <section className="space-y-10">
          <div className="flex items-end justify-between px-6">
            <div className="space-y-3">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 leading-none">Operational Query</h3>
              <h2 className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none uppercase">Transmission Hub</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="bg-navy rounded-[84px] p-12 space-y-12 shadow-3xl shadow-navy/60 border border-white/5 relative overflow-hidden">
            <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                <Label className="text-warm-white/30 text-[10px] uppercase font-bold tracking-[0.5em] ml-6">Identity Signature</Label>
                <Input 
                  placeholder="Official Name"
                  className="h-22 bg-white/5 border-none rounded-[36px] text-white placeholder:text-white/10 px-10 text-[18px] font-bold uppercase tracking-tight focus-visible:ring-gold/20 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label className="text-warm-white/30 text-[10px] uppercase font-bold tracking-[0.5em] ml-6">Digital Vector</Label>
                <div className="relative">
                  <Input 
                    type="email"
                    placeholder="Verification Email"
                    className="h-22 bg-white/5 border-none rounded-[36px] text-warm-white/40 placeholder:text-white/10 px-10 text-[18px] font-bold uppercase tracking-tight focus-visible:ring-gold/20 transition-all cursor-not-allowed"
                    value={formData.email}
                    readOnly
                  />
                  <Shield className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-warm-white/30 text-[10px] uppercase font-bold tracking-[0.5em] ml-6">Query Subject</Label>
                <Input 
                  placeholder="Strategic Reason"
                  className="h-22 bg-white/5 border-none rounded-[36px] text-white placeholder:text-white/10 px-10 text-[18px] font-bold uppercase tracking-tight focus-visible:ring-gold/20 transition-all"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label className="text-warm-white/30 text-[10px] uppercase font-bold tracking-[0.5em] ml-6">Operational Intelligence</Label>
                <Textarea 
                  placeholder="Describe your requirement with precision..."
                  className="min-h-[260px] bg-white/5 border-none rounded-[56px] text-white placeholder:text-white/10 p-10 text-[18px] font-bold uppercase tracking-tight focus-visible:ring-gold/20 transition-all resize-none leading-relaxed"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-26 rounded-[40px] bg-gold text-navy font-bold text-[20px] uppercase tracking-[0.5em] shadow-3xl shadow-gold/20 active:scale-95 transition-all relative z-10 group overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-[2000ms] origin-left" />
              {isSubmitting ? (
                <div className="flex items-center gap-6">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span>Synchronizing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <Send className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Initialize Broadcast</span>
                </div>
              )}
            </Button>
            
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/[0.03] rounded-full blur-[100px] pointer-events-none" />
          </form>
        </section>

        {/* Business Infrastructure Matrix */}
        <section className="bg-white rounded-[72px] p-12 border border-navy/5 space-y-16 shadow-3xl shadow-black/[0.01]">
          <div className="flex items-center gap-8 group">
            <div className="w-20 h-20 rounded-[28px] bg-navy/[0.04] flex items-center justify-center text-navy/10 group-hover:bg-navy group-hover:text-gold transition-all duration-700 shadow-inner">
              <MapPin className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20">Headquarters Vector</p>
              <p className="text-[18px] font-display font-bold text-navy tracking-tight leading-none uppercase">
                Coolzo Institutional Tower, Gurgaon
              </p>
              <p className="text-[11px] font-bold text-navy/40 uppercase tracking-widest">Global Operations Command</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8 group">
            <div className="w-20 h-20 rounded-[28px] bg-navy/[0.04] flex items-center justify-center text-navy/10 group-hover:bg-navy group-hover:text-gold transition-all duration-700 shadow-inner">
              <Clock className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20">Operational Lifecycle</p>
              <p className="text-[18px] font-display font-bold text-navy tracking-tight leading-none uppercase">
                MON - SAT: 08:00 - 20:00
              </p>
              <p className="text-[11px] font-bold text-navy/40 uppercase tracking-widest leading-none">SUN: Emergency Protocol Only</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
