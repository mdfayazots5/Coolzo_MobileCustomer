import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Download, Share2, Printer, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentService } from '@/services/paymentService';

const ReceiptView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!id) return;
      try {
        const data = await PaymentService.getReceipt(id);
        setReceipt(data);
      } catch (error) {
        console.error('Failed to fetch receipt:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReceipt();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-2xl font-display font-bold text-navy mb-4">Receipt Not Found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-border sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-bold text-navy">Receipt</h1>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy/40">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Receipt Paper */}
        <div className="bg-white rounded-[40px] border border-border shadow-xl shadow-navy/5 overflow-hidden relative">
          {/* Top Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-2 bg-navy/5 rounded-b-full" />
          
          <div className="p-8 space-y-8">
            {/* Logo & Status */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-navy">Payment Successful</h2>
                <p className="text-xs text-text-secondary font-medium">Receipt #{receipt.receiptNumber}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-navy/5 rounded-3xl p-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Total Amount Paid</p>
              <p className="text-4xl font-display font-bold text-navy">₹{receipt.amount.toLocaleString()}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-6 pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Date</p>
                <p className="text-sm font-bold text-navy">{new Date(receipt.paymentDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Payment Method</p>
                <p className="text-sm font-bold text-navy">{receipt.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Service Type</p>
                <p className="text-sm font-bold text-navy">AC Service</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Transaction ID</p>
                <p className="text-sm font-bold text-navy">{receipt.transactionId}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-dashed border-navy/5 pt-8">
              <div className="flex items-center gap-4 p-4 bg-navy/5 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-navy/40" />
                <p className="text-[10px] text-navy/60 leading-relaxed font-medium">
                  This is a computer-generated receipt and does not require a physical signature. Tax Invoice #GST_2026_001.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-14 rounded-2xl border-border text-navy font-bold gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button 
            onClick={() => navigate('/app/jobs')}
            className="h-14 rounded-2xl bg-navy text-gold font-bold"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptView;
