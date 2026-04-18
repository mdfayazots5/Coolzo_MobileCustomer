import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Download, 
  CreditCard, 
  Printer,
  Share2,
  ExternalLink,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PaymentService, Invoice } from '@/services/paymentService';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-bl-full blur-[160px] pointer-events-none" />
        <h2 className="text-[44px] font-display font-bold text-navy tracking-tighter leading-none mb-8 uppercase italic">Statement <span className="text-gold">Nullified.</span></h2>
        <Button onClick={() => navigate('/app/invoices')} className="bg-navy text-gold font-bold rounded-[32px] px-12 h-20 shadow-3xl shadow-navy/40 uppercase tracking-[0.4em] active:scale-95 transition-all">Return to Ledger</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden italic">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[160px] -ml-40 -mt-20 pointer-events-none" />

      {/* Artifact Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate(-1)}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div>
              <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase italic">Fiscal Artifact</h1>
              <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.5em] mt-2">Authenticated Settlement Record</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="w-14 h-14 rounded-[22px] bg-white/5 flex items-center justify-center text-gold/60 active:scale-90 transition-all hover:bg-gold hover:text-navy shadow-inner border border-white/5 group">
              <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-14 h-14 rounded-[22px] bg-white/5 flex items-center justify-center text-gold/60 active:scale-90 transition-all hover:bg-gold hover:text-navy shadow-inner border border-white/5 group">
              <Printer className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
        
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-20 relative z-30 pb-40">
        {/* Settlement Status Terminal */}
        <div className="bg-white rounded-[72px] p-16 border border-navy/5 shadow-3xl shadow-black/[0.02] text-center relative overflow-hidden active:scale-[0.99] transition-all group">
          <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <Badge className={cn(
            "border-none font-bold text-[11px] uppercase tracking-[0.5em] px-10 py-3 mb-12 shadow-2xl rounded-full",
            invoice.status === 'Paid' ? "bg-green-500/10 text-green-600 shadow-green-500/10" :
            invoice.status === 'Overdue' ? "bg-red-500/10 text-red-600 shadow-red-500/10" :
            "bg-gold/10 text-gold shadow-gold/10"
          )}>
            {invoice.status} Status Protocol
          </Badge>
          <div className="flex items-baseline justify-center gap-3 mb-6 group-hover:scale-110 transition-transform duration-1000">
            <span className="text-[64px] font-display font-bold text-navy italic">₹</span>
            <span className="text-[84px] font-display font-bold text-navy tracking-tighter leading-none">{invoice.total.toLocaleString()}</span>
          </div>
          <p className="text-navy/20 text-[12px] font-bold uppercase tracking-[0.5em] mb-4">Consolidated Net Valuation</p>
          
          {invoice.status !== 'Paid' && (
            <div className="mt-20 space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <Button 
                className="w-full h-24 rounded-[44px] bg-navy text-gold hover:bg-navy/95 font-bold text-[20px] shadow-3xl shadow-navy/40 uppercase tracking-[0.4em] active:scale-95 transition-all relative overflow-hidden group/btn"
                onClick={() => navigate(`/app/payment/${invoice.id}`)}
              >
                <span className="relative z-10">Liquidate Statement</span>
                <div className="absolute inset-0 bg-gold/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              </Button>
              <div className="flex items-center justify-center gap-6 opacity-30">
                <ShieldCheck className="w-6 h-6 text-gold" />
                <p className="text-[11px] font-bold uppercase tracking-[0.4em]">AES-512 Encrypted Settlement Protocol</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/[0.01] rounded-tl-full pointer-events-none" />
        </div>

        {/* Verification Matrix */}
        <div className="bg-white rounded-[56px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.01] relative overflow-hidden">
          <div className="grid grid-cols-2 gap-x-12 gap-y-16 relative z-10">
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20">Record ID</p>
              <p className="text-[20px] font-bold text-navy font-mono tracking-tighter italic">{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20">Deployment Link</p>
              <button 
                onClick={() => navigate(`/app/job/${invoice.jobId}`)}
                className="text-[20px] font-bold text-gold flex items-center justify-end gap-4 ml-auto active:scale-95 transition-all group/link"
              >
                {invoice.jobId}
                <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center group-hover/link:bg-gold group-hover/link:text-navy transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20">Archived Date</p>
              <p className="text-[20px] font-bold text-navy tracking-tight italic uppercase">{new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="text-right space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20">Authorization</p>
              <p className="text-[14px] font-bold text-navy uppercase tracking-[0.3em] bg-navy/5 px-6 py-2 rounded-full inline-block">HQ Certified Record</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.01] rounded-bl-full pointer-events-none" />
        </div>

        {/* Logistics Breakdown */}
        <div className="bg-white rounded-[72px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.01]">
          <div className="flex items-center justify-between mb-16 pb-10 border-b border-navy/5">
            <h3 className="text-[14px] font-bold text-navy/30 uppercase tracking-[0.6em]">Logistics Breakdown</h3>
            <span className="text-[11px] font-bold text-gold/60 uppercase tracking-[0.5em] bg-gold/5 px-6 py-2.5 rounded-full border border-gold/10 italic">Analysis v1.02</span>
          </div>
          <div className="space-y-12">
            {invoice.items.map((item, i) => (
              <div key={i} className="flex justify-between items-start gap-12 group">
                <div className="flex-1 space-y-3">
                  <p className="text-[20px] font-bold text-navy leading-none tracking-tight group-hover:text-gold transition-colors italic uppercase">{item.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-gold/40" />
                    <p className="text-[11px] text-navy/30 font-bold uppercase tracking-[0.4em]">Unit Logistics • Qty 01</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[16px] font-display font-bold text-navy/20 italic">₹</span>
                  <p className="text-[24px] font-display font-bold text-navy tracking-tight">{item.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
            
            <div className="pt-16 border-t border-navy/5 mt-10 space-y-8">
              <div className="flex justify-between items-center opacity-40">
                <p className="text-[14px] font-bold text-navy uppercase tracking-[0.5em]">Taxable Subtotal</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[12px] font-display font-bold italic">₹</span>
                  <p className="text-[18px] font-bold text-navy font-mono">{(invoice.total - invoice.tax).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center opacity-40">
                <p className="text-[14px] font-bold text-navy uppercase tracking-[0.5em]">IGST (Statutory 18%)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[12px] font-display font-bold italic">₹</span>
                  <p className="text-[18px] font-bold text-navy font-mono">{invoice.tax.toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-12 flex justify-between items-center border-t border-dashed border-navy/10 group">
                <p className="text-[28px] font-display font-bold text-navy tracking-tighter italic group-hover:translate-x-3 transition-transform uppercase">Consolidated Total</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-display font-bold text-gold italic">₹</span>
                  <p className="text-[48px] font-display font-bold text-gold tracking-tighter leading-none">{invoice.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Terminal */}
        <section className="bg-navy rounded-[56px] p-12 text-warm-white flex flex-col items-center gap-12 shadow-3xl shadow-navy/60 relative overflow-hidden">
          <div className="flex flex-col items-center gap-6 relative z-10 text-center">
            <div className="w-24 h-24 rounded-[36px] bg-white/5 flex items-center justify-center text-gold shadow-inner border border-white/5 group-hover:rotate-12 transition-transform">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <div className="space-y-3">
              <p className="text-[24px] font-display font-bold text-warm-white tracking-tighter italic uppercase">Ledger Discrepancy?</p>
              <p className="text-[12px] text-white/30 font-bold uppercase tracking-[0.5em]">Direct HQ Verification Channel</p>
            </div>
          </div>
          <Button 
            className="bg-gold text-navy font-bold rounded-[32px] h-22 px-16 text-[16px] uppercase tracking-[0.5em] relative z-10 active:scale-95 transition-all shadow-3xl shadow-gold/30 overflow-hidden group/esc w-full"
            onClick={() => navigate('/app/support/new', { state: { jobId: invoice.jobId } })}
          >
            <span className="relative z-10">Escalate Pulse</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/esc:translate-y-0 transition-transform duration-500" />
          </Button>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full -mr-40 -mt-20 blur-[100px] pointer-events-none" />
        </section>

        <Button 
          variant="outline" 
          className="w-full h-24 rounded-[44px] border-navy/5 bg-white text-navy/20 font-bold gap-8 text-[16px] uppercase tracking-[0.5em] hover:bg-navy/5 active:scale-[0.98] transition-all group overflow-hidden shadow-3xl shadow-black/[0.01]"
        >
          <Download className="w-8 h-8 opacity-20 group-hover:scale-125 transition-transform group-hover:text-gold" />
          <span className="group-hover:text-navy transition-colors uppercase tracking-[0.6em]">Export PDF Artifact</span>
        </Button>
      </div>
    </div>
  );
};

export default InvoiceDetail;
