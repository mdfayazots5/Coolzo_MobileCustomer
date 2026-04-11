import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, ArrowRight, X, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { BookingService } from '@/services/bookingService';
import { useAuthStore } from '@/store/useAuthStore';

const BookingDraftResume = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [draft, setDraft] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const drafts = await BookingService.getDrafts(user.uid);
        if (drafts.length > 0) {
          setDraft(drafts[0]);
        }
      } catch (error) {
        console.error('Failed to fetch drafts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDrafts();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-warm-white">
        <p className="text-navy/40">No drafts found.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-warm-white">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[40px] p-10 border border-border shadow-xl shadow-navy/5 relative max-w-sm w-full"
      >
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 text-navy/20"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-20 h-20 bg-gold/10 rounded-[32px] flex items-center justify-center text-gold mx-auto mb-8">
          <History className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-display font-bold text-navy mb-4">Resume Booking?</h2>
        <p className="text-navy/40 text-sm leading-relaxed mb-10">
          You have an unfinished booking for <span className="text-navy font-bold">{draft.serviceId.replace('-', ' ').toUpperCase()}</span>. Would you like to continue?
        </p>

        <div className="bg-navy/5 rounded-2xl p-4 mb-10 flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Last saved</p>
            <p className="text-xs font-bold text-navy">{new Date(draft.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-card flex items-center justify-center gap-3"
            onClick={() => navigate('/book')}
          >
            Resume Now
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost"
            className="w-full h-14 rounded-2xl text-red-500 font-bold"
            onClick={() => navigate(-1)}
          >
            Discard Draft
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingDraftResume;
