import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { JOBS, TECHNICIANS } from '@/lib/mockData';
import { toast } from 'sonner';

const ReviewSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = JOBS.find(j => j.id === id) || JOBS[0];
  const technician = TECHNICIANS.find(t => t.id === job.technicianId);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const subRatings = [
    { label: 'Punctuality', value: 0 },
    { label: 'Professionalism', value: 0 },
    { label: 'Work Quality', value: 0 }
  ];

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-warm-white">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </motion.div>
        <h2 className="text-3xl font-display font-bold text-navy mb-4">Thank You!</h2>
        <p className="text-navy/60 mb-10 leading-relaxed">
          Your feedback helps us maintain our premium service standards. We've credited 50 loyalty points to your account.
        </p>
        <div className="w-full space-y-3">
          <Button 
            className="w-full h-14 rounded-2xl bg-gold text-navy font-bold"
            onClick={() => navigate('/app/book')}
          >
            Book Next Service
          </Button>
          <Button 
            variant="ghost"
            className="w-full h-14 rounded-2xl text-navy/40 font-bold"
            onClick={() => navigate('/app')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Rate Service</h1>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Context Card */}
        <div className="bg-white rounded-[32px] p-6 border border-navy/5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-navy/5 overflow-hidden">
            <img src={technician?.photo} alt={technician?.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-navy">{technician?.name}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
              {job.serviceType} • {new Date(job.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Main Rating */}
        <div className="text-center space-y-4">
          <h2 className="text-lg font-display font-bold text-navy">How was your experience?</h2>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform active:scale-90"
              >
                <Star 
                  className={cn(
                    "w-10 h-10 transition-colors",
                    (hoverRating || rating) >= star ? "text-gold fill-gold" : "text-navy/10"
                  )} 
                />
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-gold uppercase tracking-widest">
            {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : rating === 1 ? 'Poor' : 'Select Rating'}
          </p>
        </div>

        {/* Sub Ratings */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Detailed Feedback</h3>
          <div className="space-y-3">
            {subRatings.map((sub) => (
              <div key={sub.label} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-navy/5">
                <span className="text-sm font-bold text-navy">{sub.label}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className={cn("w-2 h-2 rounded-full", s <= 4 ? "bg-gold" : "bg-navy/5")} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Would you recommend Coolzo?</h3>
          <div className="flex gap-4">
            <button 
              onClick={() => setRecommend(true)}
              className={cn(
                "flex-1 h-14 rounded-2xl border flex items-center justify-center gap-3 transition-all",
                recommend === true ? "bg-gold/10 border-gold text-gold" : "bg-white border-navy/5 text-navy/40"
              )}
            >
              <ThumbsUp className="w-5 h-5" />
              <span className="font-bold">Yes</span>
            </button>
            <button 
              onClick={() => setRecommend(false)}
              className={cn(
                "flex-1 h-14 rounded-2xl border flex items-center justify-center gap-3 transition-all",
                recommend === false ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-navy/5 text-navy/40"
              )}
            >
              <ThumbsDown className="w-5 h-5" />
              <span className="font-bold">No</span>
            </button>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Write a Review</h3>
          <div className="relative">
            <MessageSquare className="absolute left-5 top-5 w-5 h-5 text-navy/20" />
            <textarea 
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full p-5 pl-14 bg-white border border-navy/5 rounded-[24px] text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-16 rounded-[24px] bg-gold text-navy font-bold text-lg shadow-xl shadow-gold/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmission;
