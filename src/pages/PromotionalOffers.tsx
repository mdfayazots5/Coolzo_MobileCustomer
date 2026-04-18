import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Tag, 
  Clock, 
  ChevronRight, 
  Ticket,
  Copy,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { OfferService, Offer } from '@/services/offerService';
import { toast } from 'sonner';

export default function PromotionalOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await OfferService.getOffers();
        setOffers(data);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Privilege Qualifier Synchronized');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden italic">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />

      {/* Privilege Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center gap-8 relative z-10">
          <button 
            onClick={() => navigate('/app')}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div>
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase italic">Privilege Hub</h1>
            <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.5em] mt-2">Active Strategic Dispatches</p>
          </div>
        </div>
        
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-12 relative z-30 pb-40">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.7 }}
            className="bg-white rounded-[72px] border border-navy/5 shadow-3xl shadow-black/[0.02] overflow-hidden group active:scale-[0.99] transition-all relative"
          >
            <div className="p-12">
              <div className="flex justify-between items-start mb-12">
                <div className="w-20 h-20 rounded-[32px] bg-gold/5 flex items-center justify-center text-gold border border-gold/10 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                  <Ticket className="w-10 h-10" />
                </div>
                <div className="text-right space-y-2">
                  <Badge className="bg-navy text-gold border-none font-bold text-[12px] uppercase tracking-[0.3em] px-8 py-3 rounded-full shadow-3xl shadow-navy/30">
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% Retention` : `₹${offer.discountValue} Credit`}
                  </Badge>
                  <p className="text-[9px] font-bold text-navy/10 uppercase tracking-[0.4em]">Offer Protocol 0x{offer.id.slice(-4).toUpperCase()}</p>
                </div>
              </div>

              <h3 className="text-[28px] font-display font-bold text-navy mb-4 leading-tight tracking-tighter uppercase italic">{offer.title}</h3>
              <p className="text-navy/40 text-[15px] leading-relaxed mb-12 font-medium italic">{offer.description}</p>

              {/* Voucher Artifact Interface */}
              <div className="flex items-center gap-10 p-10 bg-navy/[0.03] rounded-[48px] border border-dashed border-gold/30 mb-12 relative overflow-hidden group/code">
                <div className="flex-1 relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/20 mb-3">Qualifying Identifier</p>
                  <p className="text-[32px] font-display font-bold text-navy tracking-[0.3em] uppercase">{offer.code}</p>
                </div>
                <button 
                  onClick={() => copyCode(offer.code)}
                  className="w-18 h-18 rounded-[28px] bg-white flex items-center justify-center text-navy/40 active:scale-90 transition-all shadow-3xl border border-navy/5 hover:bg-gold hover:text-navy relative z-10"
                >
                  <Copy className="w-7 h-7" />
                </button>
                {/* Circular cut-outs for cinematic voucher feel */}
                <div className="absolute top-1/2 -left-5 w-10 h-10 bg-warm-white rounded-full -translate-y-1/2 border-r-2 border-navy/[0.03]" />
                <div className="absolute top-1/2 -right-5 w-10 h-10 bg-warm-white rounded-full -translate-y-1/2 border-l-2 border-navy/[0.03]" />
                <div className="absolute inset-0 bg-gold/[0.01] translate-x-full group-hover/code:translate-x-0 transition-transform duration-1000" />
              </div>

              <div className="flex items-center justify-between pt-12 border-t border-navy/5">
                <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-navy/20">
                  <Clock className="w-5 h-5 text-gold/30" />
                  Terminal: {new Date(offer.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <Button 
                   className="h-16 rounded-[28px] bg-navy text-gold font-bold px-12 text-[13px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/40 active:scale-95 transition-all group overflow-hidden relative"
                   onClick={() => navigate('/services')}
                >
                  <span className="relative z-10">Dispatch Protocol</span>
                  <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/[0.01] rounded-bl-full pointer-events-none" />
          </motion.div>
        ))}

        {offers.length === 0 && (
          <div className="py-48 text-center">
            <div className="w-32 h-32 bg-navy/5 rounded-[56px] flex items-center justify-center mx-auto mb-12 shadow-inner">
              <Tag className="w-14 h-14 text-navy/10" />
            </div>
            <h3 className="text-[28px] font-display font-bold text-navy mb-4 tracking-tighter uppercase italic">Signal Dormant</h3>
            <p className="text-navy/30 text-[12px] font-bold uppercase tracking-[0.4em] max-w-[320px] mx-auto leading-relaxed italic">No strategic yield qualifiers detected within your regional jurisdiction.</p>
          </div>
        )}
      </div>
    </div>
  );
}
