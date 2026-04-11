import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, FileText, Ticket, Check, Loader2 } from 'lucide-react';

export default function Step5Contact() {
  const { contact, updateContact } = useBookingStore();
  const { isAuthenticated, user } = useAuthStore();
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = () => {
    if (!contact.couponCode) return;
    setCouponLoading(true);
    setTimeout(() => {
      setCouponLoading(false);
      setCouponApplied(true);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">Contact Details</h2>
        <p className="text-navy/60 text-sm">How can we reach you?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Full Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20" />
              <Input 
                placeholder="John Doe" 
                className="h-14 rounded-2xl border-navy/10 bg-white pl-12"
                value={contact.fullName}
                onChange={(e) => updateContact({ fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20" />
                <Input 
                  placeholder="+91 98765 43210" 
                  className="h-14 rounded-2xl border-navy/10 bg-white pl-12"
                  value={contact.mobile}
                  onChange={(e) => updateContact({ mobile: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20" />
                <Input 
                  placeholder="john@example.com" 
                  className="h-14 rounded-2xl border-navy/10 bg-white pl-12"
                  value={contact.email}
                  onChange={(e) => updateContact({ email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Special Instructions (Optional)</Label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-4 h-4 text-navy/20" />
              <Textarea 
                placeholder="Any specific directions or requests..." 
                className="min-h-[120px] rounded-2xl border-navy/10 bg-white pl-12 pt-3.5"
                value={contact.instructions}
                onChange={(e) => updateContact({ instructions: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Coupon Section */}
        <section className="p-6 bg-gold/5 rounded-[32px] border-2 border-dashed border-gold/20">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Apply Coupon</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
              <Input 
                placeholder="Enter code" 
                className="h-12 rounded-xl border-gold/20 bg-white pl-10 uppercase font-bold text-navy"
                value={contact.couponCode}
                onChange={(e) => updateContact({ couponCode: e.target.value.toUpperCase() })}
                disabled={couponApplied}
              />
            </div>
            <Button 
              onClick={handleApplyCoupon}
              disabled={!contact.couponCode || couponLoading || couponApplied}
              className={cn(
                "h-12 rounded-xl font-bold px-6 transition-all",
                couponApplied ? "bg-green-500 text-white" : "bg-navy text-gold"
              )}
            >
              {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : couponApplied ? <Check className="w-4 h-4" /> : 'Apply'}
            </Button>
          </div>
          {couponApplied && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-bold text-green-600 mt-3 ml-2 uppercase tracking-widest"
            >
              Coupon COOLZO20 applied! You saved ₹200
            </motion.p>
          )}
        </section>
      </div>
    </div>
  );
}
