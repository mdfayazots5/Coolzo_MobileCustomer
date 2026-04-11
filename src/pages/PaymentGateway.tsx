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
      await PaymentService.processPayment({
        invoiceId: id,
        amount: invoice.amount,
        method
      });
      navigate(`/app/payment-status/success/${id}`);
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
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Secure Checkout</h1>
        </div>
        <ShieldCheck className="w-6 h-6 text-green-500" />
      </div>

      <div className="p-6 space-y-8">
        {/* Summary */}
        <div className="bg-navy rounded-[32px] p-8 text-warm-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-warm-white/40 mb-2">Amount to Pay</p>
            <h2 className="text-4xl font-display font-bold text-gold mb-4">₹{invoice.amount.toLocaleString()}</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-warm-white/60">
              <Lock className="w-3 h-3" />
              100% Secure SSL Encryption
            </div>
          </div>
          <CreditCard className="absolute -right-10 -bottom-10 w-40 h-40 text-warm-white/5" />
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Select Payment Method</h3>
          
          {[
            { id: 'UPI', icon: Smartphone, label: 'UPI (GPay, PhonePe, Paytm)', desc: 'Instant & Secure' },
            { id: 'Card', icon: CreditCard, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
            { id: 'NetBanking', icon: Building2, label: 'Net Banking', desc: 'All Indian Banks' },
            { id: 'Wallet', icon: Wallet, label: 'Wallets', desc: 'Amazon Pay, Mobikwik' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMethod(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-[24px] border transition-all text-left",
                method === item.id 
                  ? "bg-gold/5 border-gold shadow-lg shadow-gold/5" 
                  : "bg-white border-navy/5"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                method === item.id ? "bg-gold text-navy" : "bg-navy/5 text-navy/40"
              )}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-navy text-sm">{item.label}</p>
                <p className="text-[10px] text-navy/40 font-medium">{item.desc}</p>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                method === item.id ? "border-gold bg-gold" : "border-navy/10"
              )}>
                {method === item.id && <div className="w-2 h-2 rounded-full bg-navy" />}
              </div>
            </button>
          ))}
        </div>

        {/* Pay Button */}
        <div className="pt-4">
          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-xl shadow-navy/20 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                Processing...
              </div>
            ) : `Pay ₹${invoice.amount.toLocaleString()}`}
          </Button>
          <p className="text-center text-[10px] text-navy/30 font-medium mt-6">
            By clicking, you agree to our <span className="underline">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
