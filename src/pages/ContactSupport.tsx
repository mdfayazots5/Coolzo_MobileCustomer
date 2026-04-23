import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, MessageCircle, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupportService } from '@/services/supportService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const ContactSupport = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [subject, setSubject] = useState('General Enquiry');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      toast.error('Identity required for support contact.');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter your support message.');
      return;
    }

    setIsSubmitting(true);

    try {
      await SupportService.createTicket(user.uid, {
        category: 'General Enquiry',
        subject,
        description,
        priority: 'Medium',
      });
      toast.success('Support request submitted.');
      navigate('/app/support');
    } catch {
      toast.error('Failed to contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Contact Support</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <a href="tel:+919999999999" className="bg-white border border-navy/5 rounded-2xl p-4 text-center text-navy">
            <Phone className="w-5 h-5 mx-auto mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Phone</span>
          </a>
          <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="bg-white border border-navy/5 rounded-2xl p-4 text-center text-navy">
            <MessageCircle className="w-5 h-5 mx-auto mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
          </a>
          <a href="mailto:support@coolzo.com" className="bg-white border border-navy/5 rounded-2xl p-4 text-center text-navy">
            <Mail className="w-5 h-5 mx-auto mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Email</span>
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-navy/5 rounded-3xl p-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Subject</label>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full h-12 px-4 bg-navy/[0.02] border border-navy/5 rounded-xl text-navy font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Message</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              className="w-full p-4 bg-navy/[0.02] border border-navy/5 rounded-2xl text-navy font-medium resize-none"
              placeholder="Describe your issue or question."
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-xl bg-navy text-gold font-bold">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Support Ticket'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactSupport;
