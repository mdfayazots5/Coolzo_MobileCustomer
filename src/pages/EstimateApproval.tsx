import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText,
  Info,
  ChevronDown,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingService } from '@/services/bookingService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ESTIMATE_ITEMS = [
  { id: 1, name: 'Capacitor Replacement', type: 'Part', qty: 1, price: 450 },
  { id: 2, name: 'Gas Leakage Repair', type: 'Labor', qty: 1, price: 850 },
  { id: 3, name: 'Copper Pipe (per ft)', type: 'Part', qty: 2, price: 350 },
];

export default function EstimateApproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const data = await BookingService.getBookingById(id);
        setJob(data);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!job) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h2 className="text-2xl font-display font-bold text-navy mb-4">Job Not Found</h2>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

  const subtotal = ESTIMATE_ITEMS.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await BookingService.approveEstimate(id!, 'est-123');
      toast.success("Estimate approved! Technician will proceed.");
      navigate(`/app/job-tracker/${id}`);
    } catch (error) {
      toast.error("Failed to approve estimate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = () => {
    setShowDeclineDialog(false);
    toast.error("Estimate declined. Technician notified.");
    navigate(`/app/job-tracker/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-warm-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-navy/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-navy/5 text-navy"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-navy uppercase tracking-widest">Review Estimate</h1>
            <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{job.srNumber}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Summary Card */}
        <section className="bg-navy rounded-[40px] p-8 text-warm-white shadow-xl shadow-navy/20 relative overflow-hidden">
          <div className="relative z-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-warm-white/40 mb-2">Total Estimate Amount</p>
            <h2 className="text-4xl font-display font-bold text-gold mb-4">₹{total.toFixed(0)}</h2>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Coolzo Price Guarantee</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
        </section>

        {/* Itemized Table */}
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Itemized Breakdown</h3>
          <div className="bg-white rounded-[40px] overflow-hidden border border-navy/5 shadow-sm">
            <div className="p-8 space-y-6">
              {ESTIMATE_ITEMS.map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-navy text-sm">{item.name}</p>
                    <p className="text-[10px] text-navy/40 font-medium uppercase tracking-widest mt-1">
                      {item.type} • {item.qty} Unit{item.qty > 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="font-bold text-navy text-sm">₹{item.price * item.qty}</p>
                </div>
              ))}
              
              <div className="pt-6 border-t border-navy/5 space-y-3">
                <div className="flex justify-between text-xs font-medium text-navy/40 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-navy/40 uppercase tracking-widest">
                  <span>GST (18%)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Box */}
        <div className="bg-gold/10 rounded-3xl p-6 flex gap-4 border border-gold/20">
          <Info className="w-6 h-6 text-gold shrink-0" />
          <p className="text-xs text-navy/60 leading-relaxed">
            Approving this estimate allows the technician to proceed with the additional work immediately. All parts used are genuine and come with a 30-day warranty.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-navy/5 p-6 z-40">
        <div className="max-w-md mx-auto flex gap-3">
          <Button 
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-navy/10 text-navy font-bold"
            onClick={() => setShowDeclineDialog(true)}
          >
            Decline
          </Button>
          <Button 
            className="flex-1 h-14 rounded-2xl bg-navy text-gold font-bold shadow-xl shadow-navy/20"
            onClick={handleApprove}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Approve & Proceed"}
          </Button>
        </div>
      </div>

      {/* Decline Confirmation Dialog */}
      <AnimatePresence>
        {showDeclineDialog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-[40px] p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-display font-bold text-navy mb-2">Are you sure?</h2>
              <p className="text-navy/60 text-sm mb-8">Technician cannot proceed with additional work if you decline this estimate.</p>
              <div className="space-y-3">
                <Button 
                  className="w-full h-14 rounded-2xl bg-red-500 text-white font-bold"
                  onClick={handleDecline}
                >
                  Yes, Decline
                </Button>
                <Button 
                  variant="ghost"
                  className="w-full h-14 rounded-2xl text-navy/40 font-bold"
                  onClick={() => setShowDeclineDialog(false)}
                >
                  Go Back
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
