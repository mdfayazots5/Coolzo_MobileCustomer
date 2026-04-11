import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, X, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const AppRatingPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-warm-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[40px] p-10 border border-border shadow-xl shadow-navy/5 relative max-w-sm w-full"
      >
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 right-6 text-navy/20"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-20 h-20 bg-gold/10 rounded-[32px] flex items-center justify-center text-gold mx-auto mb-8">
          <Heart className="w-10 h-10 fill-gold" />
        </div>

        <h2 className="text-2xl font-display font-bold text-navy mb-4">Enjoying Coolzo?</h2>
        <p className="text-navy/40 text-sm leading-relaxed mb-10">
          Your feedback helps us improve and provide the best AC service experience.
        </p>

        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-8 h-8 text-gold fill-gold" />
          ))}
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full h-16 rounded-[24px] bg-gold text-navy font-bold text-lg shadow-xl shadow-gold/20"
            onClick={() => {}}
          >
            Rate on App Store
          </Button>
          <Button 
            variant="ghost"
            className="w-full h-14 rounded-2xl text-text-secondary font-bold"
            onClick={() => navigate(-1)}
          >
            Maybe Later
          </Button>
        </div>
      </motion.div>

      <div className="mt-12 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-navy/20">
        <Star className="w-3 h-3" />
        Trusted by 50,000+ Users
      </div>
    </div>
  );
};

export default AppRatingPrompt;
