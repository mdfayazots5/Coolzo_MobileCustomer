import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building2,
  Wallet,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PaymentService, Invoice } from '@/services/paymentService';
import { toast } from 'sonner';

const PaymentGateway = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Wallet'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;
      try {
        const data = await PaymentService.getInvoiceById(id);
        setInvoice(data);
      } catch (error) {
        console.error('Failed to fetch invoice:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handlePayment = async () => {
    if (!invoice) return;
    setIsProcessing(true);
    try {
      const result = await PaymentService.processPayment({
        invoiceId: id!,
        method,
      });
      navigate(`/app/payment-status/${result.status === 'Confirmed' ? 'success' : 'failed'}/${id}`);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-8 border-b border-navy/5 sticky top-0 z-40 flex items-center justify-between shadow-sm backdrop-blur-sm bg-white/90">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center text-navy active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-[20px] font-display font-bold text-navy tracking-tight">Checkout</h1>
            <p className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] mt-0.5">Secure Escrow Gateway</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/30">Verified</span>
        </div>
      </div>

      <div className="px-6 py-10 space-y-12 pb-40">
        {/* Summary Card */}
        <div className="bg-navy rounded-[48px] p-10 text-warm-white relative overflow-hidden shadow-2xl shadow-navy/40 group active:scale-[0.99] transition-transform">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-3">Payable Liability</p>
            <h2 className="text-[44px] font-display font-bold text-gold mb-8 tracking-tighter leading-none">₹{invoice.amount.toLocaleString()}</h2>
            <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full w-fit border border-white/5 backdrop-blur-sm">
              <Lock className="w-3.5 h-3.5 text-gold/60" />
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/40">256-Bit SSL Encryption</span>
            </div>
          </div>
          <CreditCard className="absolute -right-16 -bottom-16 w-64 h-64 text-white/5 rotate-12 pointer-events-none group-hover:rotate-45 transition-transform duration-1000" />
        </div>

        {/* Payment Methods */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/20">Authorized Channels</h3>
            <Badge className="bg-navy/5 text-navy/40 border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">Primary Network</Badge>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'UPI', icon: Smartphone, label: 'UPI Network', desc: 'Instant dispatch via VPA' },
              { id: 'Card', icon: CreditCard, label: 'Credit Card', desc: 'Secure plastic transaction' },
              { id: 'NetBanking', icon: Building2, label: 'Bank Terminal', desc: 'Direct institutional transfer' },
              { id: 'Wallet', icon: Wallet, label: 'Digital Escrow', desc: 'Pre-loaded wallet balance' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setMethod(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-6 p-6 rounded-[32px] border transition-all text-left group active:scale-[0.98]",
                  method === item.id 
                    ? "bg-gold/5 border-gold shadow-2xl shadow-gold/10" 
                    : "bg-white border-navy/5 hover:border-navy/10 shadow-sm"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner",
                  method === item.id ? "bg-navy text-gold" : "bg-navy/5 text-navy/20 group-hover:bg-navy/10"
                )}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-navy text-[16px] leading-tight tracking-tight uppercase">{item.label}</p>
                  <p className="text-[10px] text-navy/40 font-bold uppercase tracking-[0.1em] mt-1.5">{item.desc}</p>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  method === item.id ? "border-gold bg-gold shadow-[0_0_15px_rgba(201,162,74,0.3)]" : "border-navy/10"
                )}>
                  {method === item.id && <div className="w-2 h-2 rounded-full bg-navy" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Finalize Action */}
        <div className="pt-10">
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-18 rounded-[24px] bg-navy text-gold font-bold text-[16px] shadow-2xl shadow-navy/30 disabled:opacity-50 active:scale-95 transition-all uppercase tracking-[0.3em] group relative overflow-hidden"
          >
            {isProcessing ? (
              <div className="flex items-center gap-4 relative z-10">
                <Loader2 className="w-6 h-6 animate-spin text-gold/60" />
                Validating...
              </div>
            ) : (
                <span className="relative z-10 flex items-center gap-3">
                  Commit • ₹{invoice.amount.toLocaleString()}
                </span>
            )}
            <div className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Button>
          <div className="flex items-center justify-center gap-6 mt-10 opacity-30 grayscale saturate-0 contrast-125">
             <img src="https://picsum.photos/seed/visa/100/40" alt="Visa" className="h-4 object-contain" referrerPolicy="no-referrer" />
            <img src="https://picsum.photos/seed/mastercard/100/40" alt="Mastercard" className="h-4 object-contain" referrerPolicy="no-referrer" />
            <img src="https://picsum.photos/seed/rupay/100/40" alt="RuPay" className="h-4 object-contain" referrerPolicy="no-referrer" />
          </div>
          <p className="text-center text-[10px] text-navy/20 font-bold uppercase tracking-[0.2em] mt-8 max-w-[240px] mx-auto leading-relaxed">
            By committing, you authorize the secure transfer under our <span className="text-navy/40 underline decoration-gold/30 underline-offset-4">Transaction Protocol</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
