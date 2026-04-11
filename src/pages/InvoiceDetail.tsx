import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Download, 
  CreditCard, 
  Printer,
  Share2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { INVOICES } from '@/lib/mockData';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoice = INVOICES.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-2xl font-display font-bold text-navy mb-4">Invoice Not Found</h2>
        <Button onClick={() => navigate('/app/invoices')}>Back to Invoices</Button>
      </div>
    );
  }

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
          <h1 className="text-xl font-display font-bold text-navy">Invoice Details</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40">
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-[32px] p-8 border border-navy/5 shadow-sm text-center">
          <Badge className={cn(
            "border-none font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 mb-4",
            invoice.status === 'Paid' ? "bg-green-50 text-green-600" :
            invoice.status === 'Overdue' ? "bg-red-50 text-red-600" :
            "bg-amber-50 text-amber-600"
          )}>
            {invoice.status}
          </Badge>
          <h2 className="text-3xl font-display font-bold text-navy mb-1">₹{invoice.amount.toLocaleString()}</h2>
          <p className="text-navy/40 text-xs font-bold uppercase tracking-widest">Total Payable</p>
          
          {invoice.status !== 'Paid' && (
            <div className="mt-8 space-y-3">
              <Button 
                className="w-full h-14 rounded-2xl bg-gold text-navy font-bold text-lg shadow-lg shadow-gold/20"
                onClick={() => navigate(`/app/payment/${invoice.id}`)}
              >
                Pay Now
              </Button>
              <p className="text-[10px] text-navy/40 font-medium">Secure payment via Razorpay</p>
            </div>
          )}
        </div>

        {/* Invoice Info */}
        <div className="bg-white rounded-[32px] p-8 border border-navy/5 shadow-sm">
          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Invoice Number</p>
              <p className="text-sm font-bold text-navy">{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Service Job</p>
              <button 
                onClick={() => navigate(`/app/job/${invoice.srNumber}`)}
                className="text-sm font-bold text-gold flex items-center justify-end gap-1"
              >
                {invoice.srNumber}
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Issue Date</p>
              <p className="text-sm font-bold text-navy">{new Date(invoice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Due Date</p>
              <p className="text-sm font-bold text-navy">{new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Itemized Breakdown */}
        <div className="bg-white rounded-[32px] p-8 border border-navy/5 shadow-sm">
          <h3 className="text-sm font-bold text-navy mb-6 uppercase tracking-widest">Bill Summary</h3>
          <div className="space-y-4">
            {invoice.items.map((item, i) => (
              <div key={i} className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <p className="text-sm font-bold text-navy leading-tight">{item.name}</p>
                  <p className="text-[10px] text-navy/40 font-medium">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-bold text-navy">₹{item.price.toLocaleString()}</p>
              </div>
            ))}
            <div className="pt-4 border-t border-navy/5 flex justify-between items-center">
              <p className="text-sm font-display font-bold text-navy">Total Amount</p>
              <p className="text-xl font-display font-bold text-navy">₹{invoice.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="bg-navy/5 rounded-3xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-navy/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-navy">Need help with this bill?</p>
              <p className="text-[10px] text-navy/40 font-medium">Raise a support ticket</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gold font-bold"
            onClick={() => navigate('/app/support/new', { state: { srNumber: invoice.srNumber } })}
          >
            Contact
          </Button>
        </div>

        <Button 
          variant="outline" 
          className="w-full h-14 rounded-2xl border-navy/10 text-navy/60 font-bold gap-2"
        >
          <Download className="w-5 h-5" />
          Download PDF Receipt
        </Button>
      </div>
    </div>
  );
};

export default InvoiceDetail;
