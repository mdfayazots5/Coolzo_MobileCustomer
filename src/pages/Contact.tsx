import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, MessageCircle, Mail, Clock, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-12">
      {/* Header */}
      <div className="px-6 py-8 bg-white border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-navy/5 text-navy"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Contact Support</h1>
        </div>
      </div>

      <div className="px-6 py-8 space-y-10">
        {/* Quick Contact Cards */}
        <section className="grid grid-cols-1 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-navy/5 shadow-sm flex items-center justify-between group active:scale-95 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-navy text-sm">Call Us</h4>
                <p className="text-navy/40 text-xs">+91 1800-COOL-ZO</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full text-gold">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-navy/5 shadow-sm flex items-center justify-between group active:scale-95 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-navy text-sm">WhatsApp</h4>
                <p className="text-navy/40 text-xs">Chat with our experts</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full text-green-500">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-navy/5 shadow-sm flex items-center justify-between group active:scale-95 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-navy text-sm">Email</h4>
                <p className="text-navy/40 text-xs">support@coolzo.com</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full text-blue-500">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Inquiry Form */}
        <section className="bg-white rounded-[32px] p-8 border border-navy/5 shadow-xl">
          <h2 className="text-xl font-display font-bold text-navy mb-6">Send an Inquiry</h2>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-navy/40">Full Name</Label>
              <Input id="name" placeholder="John Doe" className="rounded-xl border-navy/10 h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-navy/40">Subject</Label>
              <Input id="subject" placeholder="AMC Inquiry" className="rounded-xl border-navy/10 h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-navy/40">Message</Label>
              <Textarea id="message" placeholder="How can we help you?" className="rounded-xl border-navy/10 min-h-[120px]" />
            </div>
            <Button className="w-full h-14 rounded-2xl bg-navy text-gold hover:bg-navy/90 font-bold text-lg">
              Submit Message
            </Button>
          </form>
        </section>

        {/* Business Info */}
        <section className="space-y-4 px-2">
          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 text-gold mt-0.5" />
            <div>
              <h4 className="font-bold text-navy text-sm">Business Hours</h4>
              <p className="text-navy/40 text-xs">Mon - Sun: 8:00 AM - 9:00 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-gold mt-0.5" />
            <div>
              <h4 className="font-bold text-navy text-sm">Service Areas</h4>
              <p className="text-navy/40 text-xs leading-relaxed">Mumbai, Pune, Delhi NCR, Bangalore, Hyderabad, Chennai.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
