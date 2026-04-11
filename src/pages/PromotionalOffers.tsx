import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Tag, 
  Clock, 
  ChevronRight, 
  Ticket,
  Copy
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PROMOTIONAL_OFFERS } from '@/lib/mockData';
import { toast } from 'sonner';

const PromotionalOffers = () => {
  const navigate = useNavigate();

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Promo code copied!');
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
          <h1 className="text-xl font-display font-bold text-navy">Special Offers</h1>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-32">
        {PROMOTIONAL_OFFERS.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] border border-navy/5 shadow-sm overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                  <Ticket className="w-6 h-6" />
                </div>
                <Badge className="bg-gold/10 text-gold border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                  {offer.type}
                </Badge>
              </div>

              <h3 className="text-xl font-display font-bold text-navy mb-2">{offer.title}</h3>
              <p className="text-navy/60 text-sm leading-relaxed mb-6">{offer.description}</p>

              <div className="flex items-center gap-4 p-4 bg-navy/5 rounded-2xl border border-dashed border-navy/10 mb-6">
                <div className="flex-1">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-navy/40 mb-1">Promo Code</p>
                  <p className="text-lg font-display font-bold text-navy tracking-widest">{offer.code}</p>
                </div>
                <button 
                  onClick={() => copyCode(offer.code)}
                  className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-navy/40 active:scale-90 transition-transform shadow-sm"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-navy/20">
                  <Clock className="w-3 h-3" />
                  Expires {new Date(offer.expiryDate).toLocaleDateString()}
                </div>
                <Button 
                  size="sm" 
                  className="bg-navy text-gold font-bold rounded-xl h-10 px-6"
                  onClick={() => navigate('/app/book')}
                >
                  Apply
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {PROMOTIONAL_OFFERS.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="w-10 h-10 text-navy/10" />
            </div>
            <h3 className="text-lg font-display font-bold text-navy mb-2">No Offers Available</h3>
            <p className="text-navy/40 text-sm">Check back later for exclusive deals and discounts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionalOffers;
