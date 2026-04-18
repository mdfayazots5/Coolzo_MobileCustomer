import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Download, 
  Share2, 
  ArrowRight,
  MessageSquare,
  Clock,
  Fingerprint
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { INVOICES } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const PaymentStatus = () => {
  const { id, status } = useParams();
  const navigate = useNavigate();
  const invoice = INVOICES.find(inv => inv.id === id);
  const isSuccess = status === 'success';

  if (!invoice) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center bg-warm-white bg-[radial-gradient(circle_at_center,rgba(201,162,74,0.08),transparent_80%)]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className={cn(
          "w-28 h-28 rounded-[40px] flex items-center justify-center mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-2",
          isSuccess 
            ? "bg-white text-green-500 border-green-100/50" 
            : "bg-white text-red-500 border-red-100/50"
        )}
      >
        {isSuccess ? <CheckCircle2 className="w-14 h-14" /> : <XCircle className="w-14 h-14" />}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mb-16"
      >
        <h1 className="text-[36px] font-display font-bold text-navy tracking-tight leading-none">
          {isSuccess ? 'Settlement Confirmed' : 'Sync Interrupted'}
        </h1>
        <p className="text-navy/40 text-[15px] max-w-[320px] mx-auto leading-relaxed font-medium">
          {isSuccess 
            ? `₹${invoice.amount.toLocaleString()} has been successfully liquidated for Service Token #${invoice.invoiceNumber}.`
            : 'The fiscal handshake failed to initialize. Please verify your banking credentials and re-initiate the protocol.'}
        </p>
      </motion.div>

      {isSuccess && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-white rounded-[40px] p-10 border border-navy/5 mb-16 text-left shadow-2xl shadow-black/[0.02] relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8 border-b border-navy/[0.03] pb-6">
            <div className="flex flex-col gap-1.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-navy/20">Protocol Hash</p>
              <div className="flex items-center gap-2">
                <Fingerprint className="w-3.5 h-3.5 text-gold/60" />
                <p className="text-[13px] font-bold text-navy font-mono tracking-tighter">XL_0039281726</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-navy/20">Authorization Log</p>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold/60" />
                <p className="text-[13px] font-bold text-navy uppercase tracking-tighter">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.02] rounded-bl-full" />
        </motion.div>
      )}

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full space-y-5 max-w-sm"
      >
        {isSuccess ? (
          <>
            <Button 
              className="w-full h-18 rounded-[24px] bg-navy text-gold font-bold gap-4 uppercase tracking-[0.3em] text-[13px] shadow-2xl shadow-navy/30 active:scale-95 transition-all"
              onClick={() => navigate(`/app/receipt/${id}`)}
            >
              <Download className="w-5 h-5" />
              Obtain Receipt
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline"
                className="h-16 rounded-[24px] border-navy/5 bg-white text-navy/40 font-bold gap-3 text-[11px] uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all"
                onClick={() => {}}
              >
                <Share2 className="w-4 h-4 opacity-40" />
                Share
              </Button>
              <Button 
                variant="outline"
                className="h-16 rounded-[24px] border-navy/5 bg-white text-navy/40 font-bold text-[11px] uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all"
                onClick={() => navigate('/app/invoices')}
              >
                History
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button 
              className="w-full h-18 rounded-[24px] bg-navy text-gold font-bold uppercase tracking-[0.3em] text-[13px] shadow-2xl shadow-navy/30 active:scale-95 transition-all"
              onClick={() => navigate(`/app/payment/${id}`)}
            >
              Retry Handshake
            </Button>
            <Button 
              variant="outline"
              className="w-full h-16 rounded-[24px] border-navy/5 bg-white text-navy/40 font-bold gap-4 text-[11px] uppercase tracking-[0.2em] shadow-sm active:scale-95 transition-all"
              onClick={() => navigate('/app/support/new')}
            >
              <MessageSquare className="w-4 h-4 opacity-40" />
              Contact Protocol Support
            </Button>
          </>
        )}
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={() => navigate('/app')}
        className="mt-16 flex items-center gap-3 text-gold font-bold text-[11px] uppercase tracking-[0.4em] active:scale-90 transition-all hover:tracking-[0.5em]"
      >
        Return to Command
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

export default PaymentStatus;
