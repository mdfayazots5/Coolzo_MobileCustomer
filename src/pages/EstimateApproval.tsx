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
import { Badge } from '@/components/ui/badge';
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
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl px-6 pt-16 pb-8 flex items-center justify-between border-b border-navy/5 shadow-sm">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate(-1)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-navy/5 text-navy active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[20px] font-display font-bold text-navy tracking-tight leading-none">Fiscal Synopsis</h1>
            <p className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] mt-1.5">{job.srNumber} • Engineering Review</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-10 space-y-10 pb-44">
        {/* Summary Card */}
        <section className="bg-navy rounded-[40px] p-10 text-warm-white shadow-2xl shadow-navy/40 relative overflow-hidden active:scale-[0.99] transition-transform">
          <div className="relative z-10 text-center space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20">Aggregated Estimate</p>
            <h2 className="text-[48px] font-display font-bold text-gold tracking-tighter leading-none mb-4">₹{total.toFixed(0)}</h2>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/5 px-6 py-2.5 rounded-full backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-warm-white/60">Coolzo Performance Guarantee</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-20 -mr-16 -mt-16" />
          <FileText className="absolute bottom-[-10%] left-[-5%] w-40 h-40 text-white/5 -rotate-12 pointer-events-none" />
        </section>

        {/* Itemized Table */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-navy/20">Artifact Breakdown</h3>
            <Badge className="bg-navy/5 text-navy/40 border-none font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">3 Delta Units</Badge>
          </div>
          <div className="bg-white rounded-[40px] overflow-hidden border border-navy/5 shadow-2xl shadow-black/[0.02]">
            <div className="p-10 space-y-8">
              {ESTIMATE_ITEMS.map((item) => (
                <div key={item.id} className="flex items-start justify-between group">
                  <div className="flex-1 space-y-1.5">
                    <p className="font-bold text-navy text-[16px] tracking-tight uppercase group-hover:text-gold transition-colors">{item.name}</p>
                    <p className="text-[10px] text-navy/30 font-bold uppercase tracking-[0.1em]">
                      Class: {item.type} • {item.qty} Multiplier{item.qty > 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="font-bold text-navy text-[16px] tracking-tight">₹{item.price * item.qty}</p>
                </div>
              ))}
              
              <div className="pt-8 border-t border-navy/5 space-y-4">
                <div className="flex justify-between text-[11px] font-bold text-navy/20 uppercase tracking-[0.2em]">
                  <span>Sub-Calculated</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-navy/20 uppercase tracking-[0.2em]">
                  <span>Fiscal Levy (18%)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Box */}
        <div className="bg-gold/5 rounded-[32px] p-8 flex gap-6 border border-gold/10 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0 shadow-inner group-hover:bg-navy transition-colors duration-500">
            <Info className="w-6 h-6" />
          </div>
          <p className="text-[12px] text-navy/50 leading-relaxed font-bold uppercase tracking-[0.1em]">
            Authorization initiates immediate engineering execution. Verified components include a <span className="text-navy/80 underline decoration-gold/30">30-day structural warranty</span> protocol.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-warm-white/80 backdrop-blur-2xl border-t border-navy/5 p-8 pt-4 z-40">
        <div className="max-w-md mx-auto flex gap-5">
          <Button 
            variant="outline"
            className="flex-1 h-18 rounded-[24px] border-navy/5 bg-white text-navy/40 font-bold text-[13px] uppercase tracking-[0.3em] shadow-sm active:scale-95 transition-all hover:bg-navy/5"
            onClick={() => setShowDeclineDialog(true)}
          >
            Veto
          </Button>
          <Button 
            className="flex-[1.5] h-18 rounded-[24px] bg-navy text-gold font-bold shadow-2xl shadow-navy/30 text-[13px] uppercase tracking-[0.3em] active:scale-95 transition-all hover:bg-navy/95"
            onClick={handleApprove}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Syncing..." : "Authorize"}
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
            className="fixed inset-0 z-[100] bg-navy/90 backdrop-blur-md flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-[340px] bg-white rounded-[48px] p-10 text-center shadow-2xl border border-navy/5 overflow-hidden"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner border border-red-500/10 text-red-500">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h2 className="text-[24px] font-display font-bold text-navy mb-3 tracking-tight">Abort Sequence?</h2>
              <p className="text-navy/40 text-[11px] font-bold uppercase tracking-[0.25em] mb-10 leading-relaxed mx-auto max-w-[240px]">This will terminate the active engineering dispatch protocol immediately.</p>
              <div className="space-y-4">
                <Button 
                  className="w-full h-16 rounded-[24px] bg-red-600 text-white font-bold text-[13px] uppercase tracking-[0.3em] shadow-2xl shadow-red-500/20 active:scale-95 transition-all hover:bg-red-700"
                  onClick={handleDecline}
                >
                  Yes, Abort
                </Button>
                <Button 
                  variant="ghost"
                  className="w-full h-14 rounded-[20px] text-navy/30 font-bold text-[11px] uppercase tracking-[0.4em] active:scale-90 transition-all hover:text-navy"
                  onClick={() => setShowDeclineDialog(false)}
                >
                  Return to Summary
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/[0.02] rounded-bl-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
