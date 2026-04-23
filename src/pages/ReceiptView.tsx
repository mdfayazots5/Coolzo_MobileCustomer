import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Download, Share2, Printer, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentService } from '@/services/paymentService';
import { toast } from 'sonner';

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

  const handleDownload = async () => {
    try {
      await PaymentService.downloadReceiptPdf(id!);
    } catch (error) {
      toast.error('Failed to download receipt PDF.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-8 border-b border-navy/5 sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-white/90">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center text-navy active:scale-90 transition-transform"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-[20px] font-display font-bold text-navy tracking-tight">Digital Ledger</h1>
              <p className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] mt-0.5">Transaction Certification</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-11 h-11 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/20 active:scale-90 transition-transform hover:bg-gold hover:text-navy shadow-inner">
              <Share2 className="w-5 h-5" />
            </button>
            <button onClick={() => void handleDownload()} className="w-11 h-11 rounded-2xl bg-gold text-navy flex items-center justify-center shadow-2xl shadow-gold/20 active:scale-90 transition-transform">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-10 space-y-10 pb-40">
        {/* Receipt Paper */}
        <div className="bg-white rounded-[48px] border border-navy/5 shadow-2xl shadow-black/[0.04] overflow-hidden relative">
          {/* Top Notch - Digital signature area */}
          <div className="absolute top-0 inset-x-0 h-2 bg-green-500/20" />
          
          <div className="p-10 space-y-12">
            {/* Logo & Status */}
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-600 mx-auto shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border border-green-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-[26px] font-display font-bold text-navy tracking-tight leading-tight">Liquidation Successful</h2>
                <div className="flex items-center justify-center gap-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/20">Artifact Identifier</span>
                  <span className="text-[11px] font-bold text-gold uppercase tracking-tighter">{receipt.receiptNumber}</span>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="bg-navy rounded-[32px] p-10 text-center shadow-2xl shadow-navy/20 relative overflow-hidden active:scale-[0.99] transition-transform">
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-3">Settled Fiscal Amount</p>
                <p className="text-[48px] font-display font-bold text-gold tracking-tighter leading-none mb-2">₹{receipt.amount.toLocaleString()}</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold/40">Verified via Secure Downlink</p>
              </div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16 blur-2xl" />
              <ShieldCheck className="absolute bottom-[-20%] right-[-10%] w-48 h-48 text-white/5 rotate-12" />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-10 pt-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/20">Timestamp</p>
                <p className="text-[15px] font-bold text-navy">{new Date(receipt.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="text-right space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/20">Funding Source</p>
                <p className="text-[15px] font-bold text-navy">{receipt.paymentMethod}</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/20">Deployment Unit</p>
                <p className="text-[15px] font-bold text-navy">Service Ref #{receipt.jobId || receipt.invoiceId}</p>
              </div>
              <div className="text-right space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/20">Protocol Hash</p>
                <p className="text-[15px] font-bold text-navy font-mono truncate pl-4 tracking-tighter">{receipt.transactionId?.slice(0, 14)}...</p>
              </div>
            </div>

            {/* Divider with V-Cut logic */}
            <div className="border-t border-dashed border-navy/10 pt-10 relative">
              <div className="absolute -top-3 -left-12 w-6 h-6 bg-warm-white rounded-full border-r border-navy/5" />
              <div className="absolute -top-3 -right-12 w-6 h-6 bg-warm-white rounded-full border-l border-navy/5" />
              
              <div className="flex items-start gap-6 p-6 bg-navy/5 rounded-[24px] border border-navy/5">
                <ShieldCheck className="w-10 h-10 text-gold/60 shrink-0" />
                <div>
                  <p className="text-[11px] text-navy/40 leading-relaxed font-bold uppercase tracking-[0.2em]">Verified Signature</p>
                  <p className="text-[11px] text-navy/60 leading-relaxed font-medium mt-1.5">
                    This digital asset constitutes a legitimate proof of payment. Full fiscal statements are accessible via the Enterprise Dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-5">
          <Button variant="outline" className="h-18 rounded-[24px] border-navy/5 bg-white text-navy/40 font-bold gap-4 uppercase tracking-[0.3em] text-[12px] shadow-sm active:scale-95 transition-all hover:bg-navy/5">
            <Printer className="w-5 h-5 opacity-40" />
            Archive
          </Button>
          <Button 
            onClick={() => navigate('/app/jobs')}
            className="h-18 rounded-[24px] bg-navy text-gold font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl shadow-navy/30 active:scale-95 transition-all hover:bg-navy/95"
          >
            System OK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptView;
