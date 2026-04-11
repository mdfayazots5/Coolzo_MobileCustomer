import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Download, 
  Share2, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { INVOICES } from '@/lib/mockData';

const PaymentStatus = () => {
  const { id, status } = useParams();
  const navigate = useNavigate();
  const invoice = INVOICES.find(inv => inv.id === id);
  const isSuccess = status === 'success';

  if (!invoice) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-warm-white">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-xl",
          isSuccess ? "bg-green-100 text-green-600 shadow-green-200/50" : "bg-red-100 text-red-600 shadow-red-200/50"
        )}
      >
        {isSuccess ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
      </motion.div>

      <h1 className="text-3xl font-display font-bold text-navy mb-2">
        {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
      </h1>
      <p className="text-navy/60 text-sm mb-10 max-w-[280px]">
        {isSuccess 
          ? `We've received your payment of ₹${invoice.amount.toLocaleString()} for Invoice ${invoice.invoiceNumber}.`
          : 'Something went wrong with your transaction. Please try again or use a different payment method.'}
      </p>

      {isSuccess && (
        <div className="w-full bg-white rounded-3xl p-6 border border-navy/5 mb-10 text-left">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Transaction ID</p>
            <p className="text-xs font-bold text-navy">TXN_8829100293</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Payment Date</p>
            <p className="text-xs font-bold text-navy">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      )}

      <div className="w-full space-y-3">
        {isSuccess ? (
          <>
            <Button 
              className="w-full h-14 rounded-2xl bg-navy text-gold font-bold gap-2"
              onClick={() => {}}
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="h-14 rounded-2xl border-navy/10 text-navy/60 font-bold gap-2"
                onClick={() => {}}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button 
                variant="outline"
                className="h-14 rounded-2xl border-navy/10 text-navy/60 font-bold"
                onClick={() => navigate('/app/invoices')}
              >
                My Invoices
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button 
              className="w-full h-14 rounded-2xl bg-navy text-gold font-bold"
              onClick={() => navigate(`/app/payment/${id}`)}
            >
              Try Again
            </Button>
            <Button 
              variant="ghost"
              className="w-full h-14 rounded-2xl text-navy/40 font-bold gap-2"
              onClick={() => navigate('/app/support/new')}
            >
              <MessageSquare className="w-4 h-4" />
              Contact Support
            </Button>
          </>
        )}
      </div>

      <button 
        onClick={() => navigate('/app')}
        className="mt-10 flex items-center gap-2 text-gold font-bold text-sm"
      >
        Return to Home
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

import { cn } from '@/lib/utils';
export default PaymentStatus;
