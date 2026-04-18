import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare,
  Loader2,
  Clock,
  ShieldCheck,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { JOBS, TECHNICIANS } from '@/lib/mockData';
import { ReviewService } from '@/services/reviewService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function ReviewSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const job = JOBS.find(j => j.id === id) || JOBS[0];
  const technician = TECHNICIANS.find(t => t.id === job.technicianId);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Identity verification required for audit submission');
      return;
    }
    if (rating === 0) {
      toast.error('Numeric evaluation required');
      return;
    }
    setIsSubmitting(true);
    try {
      await ReviewService.submitReview(user.uid, {
        rating,
        comment,
        jobId: id,
        userName: user.name || 'Anonymous Operative',
        userPhoto: user.photoURL || undefined,
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Audit submission failure:', error);
      toast.error('Audit transmission failed. Retry protocol.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-12 text-center bg-warm-white relative overflow-hidden italic">
        {/* Success Ambience */}
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-green-500/[0.03] to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-40 h-40 bg-navy rounded-[48px] flex items-center justify-center mb-12 shadow-3xl shadow-navy/40 relative group"
        >
          <CheckCircle2 className="w-16 h-16 text-gold transition-transform group-hover:scale-110 duration-1000" />
          <div className="absolute inset-0 bg-gold rounded-[48px] animate-ping opacity-10" />
        </motion.div>
        
        <div className="space-y-4 mb-16">
          <h2 className="text-[44px] font-display font-bold text-navy tracking-tighter leading-none uppercase italic">Audit <span className="text-gold">Synchronized.</span></h2>
          <p className="text-navy/30 text-[12px] font-bold uppercase tracking-[0.4em] max-w-[320px] mx-auto leading-loose">
            Intelligence recorded. 50 Elite Loyalty Credits authorized for your profile.
          </p>
        </div>

        <div className="w-full max-w-[400px] space-y-6">
          <Button 
            className="w-full h-22 rounded-[32px] bg-navy text-gold hover:bg-navy/95 font-bold text-[18px] uppercase tracking-[0.3em] shadow-3xl shadow-navy/40 active:scale-95 transition-all group relative overflow-hidden"
            onClick={() => navigate('/app/book')}
          >
            <span className="relative z-10">Authorize New Mission</span>
            <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Button>
          <Button 
            variant="ghost"
            className="w-full h-18 rounded-[32px] text-navy/20 hover:text-navy/40 font-bold uppercase tracking-[0.4em] text-[12px] active:scale-95 transition-all"
            onClick={() => navigate('/app')}
          >
            Return to Command Centre
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden italic">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />

      {/* Audit Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center gap-8 relative z-10 mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="space-y-1">
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase italic">Institutional Audit</h1>
            <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.5em] leading-none">Engagement Feedback Protocol</p>
          </div>
        </div>

        {/* Target Context Terminal */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-8 border border-white/10 flex items-center gap-8 relative z-10 shadow-3xl group active:scale-[0.99] transition-all">
          <div className="w-20 h-20 rounded-[28px] bg-gold/10 overflow-hidden border border-gold/20 shadow-inner shrink-0 rotate-3 group-hover:rotate-0 transition-transform duration-700">
            <img src={technician?.photo} alt={technician?.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="flex items-center gap-4 mb-2">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
               <h3 className="font-display font-bold text-[24px] text-gold tracking-tighter italic uppercase">{technician?.name}</h3>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/20">
              {job.serviceType} • {new Date(job.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.02] rounded-bl-full pointer-events-none" />
        </div>

        <div className="absolute -right-20 -top-20 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-20 relative z-30 pb-48">
        {/* Performance Matrix */}
        <section className="bg-white rounded-[72px] p-16 border border-navy/5 text-center shadow-3xl shadow-black/[0.01] space-y-12 relative overflow-hidden group">
          <h2 className="text-[28px] font-display font-bold text-navy tracking-tighter uppercase italic">Performance Matrix</h2>
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-all active:scale-75 hover:scale-110"
              >
                <Star 
                  className={cn(
                    "w-14 h-14 transition-all duration-500",
                    (hoverRating || rating) >= star ? "text-gold fill-gold drop-shadow-[0_0_15px_rgba(201,162,74,0.5)]" : "text-navy/[0.03]"
                  )} 
                />
              </button>
            ))}
          </div>
          <div className="h-12 flex items-center justify-center">
            {rating > 0 && (
              <p className="text-[12px] font-bold text-gold uppercase tracking-[0.5em] animate-in fade-in zoom-in duration-500 italic">
                {rating === 5 ? 'Elite Tier Excellence' : rating === 4 ? 'Professional Mastery' : rating === 3 ? 'Standard Alignment' : rating === 2 ? 'Metric Discrepancy' : 'Operational Failure'}
              </p>
            )}
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-navy/[0.01] rounded-bl-full pointer-events-none group-hover:bg-navy/[0.02] transition-colors duration-1000" />
        </section>

        {/* Audit Variables */}
        <section className="space-y-10">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-6">Audit Variables</h3>
          <div className="space-y-6">
            {[
              { label: 'Tactical Punctuality', icon: Clock },
              { label: 'Institutional Decorum', icon: ShieldCheck },
              { label: 'Technical Specification', icon: Target }
            ].map((metric, idx) => (
              <div key={metric.label} className="flex items-center justify-between p-8 bg-white rounded-[40px] border border-navy/5 shadow-3xl shadow-black/[0.01] group active:scale-[0.99] transition-all">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-navy/[0.02] flex items-center justify-center text-navy/10 group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-inner">
                      <metric.icon className="w-6 h-6" />
                   </div>
                   <span className="text-[16px] font-bold text-navy tracking-tight group-hover:text-gold transition-colors italic uppercase">{metric.label}</span>
                </div>
                <div className="flex gap-2.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.div 
                      key={s} 
                      animate={{ 
                        scale: rating >= idx + 3 ? [1, 1.2, 1] : 1,
                        opacity: rating >= idx + 3 ? 1 : 0.1
                      }}
                      className={cn("w-2.5 h-2.5 rounded-full", rating >= idx + 3 ? "bg-gold shadow-[0_0_8px_rgba(201,162,74,0.6)]" : "bg-navy")} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Net Promoter */}
        <section className="space-y-10">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-6">Net Promoter Protocol</h3>
          <div className="flex gap-8">
            <button 
              onClick={() => setRecommend(true)}
              className={cn(
                "flex-1 h-28 rounded-[40px] border flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden group/opt active:scale-90",
                recommend === true ? "bg-gold text-navy border-gold shadow-3xl shadow-gold/40" : "bg-white border-navy/5 text-navy/20"
              )}
            >
              <ThumbsUp className={cn("w-8 h-8 transition-transform group-hover/opt:-translate-y-1", recommend === true ? "text-navy" : "text-navy/10")} />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Authorize</span>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />
            </button>
            <button 
              onClick={() => setRecommend(false)}
              className={cn(
                "flex-1 h-28 rounded-[40px] border flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden group/opt active:scale-90",
                recommend === false ? "bg-red-500 text-white border-red-500 shadow-3xl shadow-red-500/40" : "bg-white border-navy/5 text-navy/20"
              )}
            >
              <ThumbsDown className={cn("w-8 h-8 transition-transform group-hover/opt:translate-y-1", recommend === false ? "text-white" : "text-navy/10")} />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Escalate</span>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20" />
            </button>
          </div>
        </section>

        {/* Qualitative Commentary */}
        <section className="space-y-10">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-6">Qualitative Analysis</h3>
          <div className="relative group/input">
            <MessageSquare className="absolute left-10 top-11 w-8 h-8 text-navy/10 group-focus-within/input:text-gold transition-colors duration-500" />
            <textarea 
              placeholder="Provide tactical field observations..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="w-full p-10 pl-24 bg-white border border-navy/5 rounded-[56px] text-[18px] font-bold italic text-navy uppercase tracking-tight focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all resize-none shadow-3xl shadow-black/[0.01]"
            />
          </div>
        </section>
      </div>

      {/* Synchronize Terminal */}
      <div className="fixed bottom-0 left-0 right-0 p-10 z-50 bg-gradient-to-t from-warm-white via-warm-white/95 to-transparent flex justify-center">
        <div className="max-w-[480px] w-full">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-24 rounded-[40px] bg-navy text-gold hover:bg-navy/95 font-bold text-[20px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/60 active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden group/sync"
          >
            <span className="relative z-10">{isSubmitting ? 'Transmitting...' : 'Finalize Audit'}</span>
            <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover/sync:translate-y-0 transition-transform duration-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
