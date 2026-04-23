import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, MessageSquare, ThumbsUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CatalogService } from '@/services/catalogService';
import { ReviewService, Review } from '@/services/reviewService';
import { cn } from '@/lib/utils';

export default function Reviews() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [filters, setFilters] = useState<string[]>(['All']);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const services = await CatalogService.getServices();
        const categories = [...new Set(services.map((service) => service.category).filter(Boolean))];
        setFilters(['All', ...categories]);
      } catch {
        setFilters(['All']);
      }
    };

    void fetchFilters();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const data = await ReviewService.getReviews(activeFilter);
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [activeFilter]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => reviews.filter((review) => review.rating === stars).length);
  const totalReviews = reviews.length || 1;

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-40 relative overflow-hidden italic">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />

      {/* Legacy Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-30">
        <div className="flex items-center gap-8 relative z-10 mb-12">
          <button 
            onClick={() => navigate('/app')}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-90 transition-all shadow-3xl border border-white/5"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          <div className="space-y-1">
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase italic">Patron Registry</h1>
            <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.5em] leading-none">Institutional Quality Metrics</p>
          </div>
        </div>

        {/* Aggregate Sentiment Matrix */}
        <div className="flex items-center gap-12 relative z-10 px-4">
          <div className="text-center group active:scale-95 transition-all">
            <div className="text-[72px] font-display font-bold text-warm-white tracking-tighter leading-none mb-4 group-hover:text-gold transition-colors italic">{averageRating}</div>
            <div className="flex justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-gold fill-gold drop-shadow-[0_0_12px_rgba(201,162,74,0.6)]" />)}
            </div>
            <p className="text-[11px] text-warm-white/20 font-bold uppercase tracking-[0.4em] leading-none">{reviews.length} Published Reviews</p>
          </div>
          <div className="flex-1 space-y-4 max-w-[320px]">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={rating} className="flex items-center gap-6 group/row">
                <span className="text-[10px] font-bold text-warm-white/20 w-3 group-hover/row:text-gold transition-colors">{rating}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(ratingCounts[index] / totalReviews) * 100}%` }}
                    className="h-full bg-gold rounded-full shadow-[0_0_15px_rgba(201,162,74,0.4)]" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <MessageSquare className="absolute -right-20 -bottom-20 w-[420px] h-[420px] text-warm-white/[0.02] rotate-12 pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Filter Matrix */}
      <div className="px-8 -mt-16 py-8 overflow-x-auto flex gap-4 no-scrollbar bg-transparent relative z-40">
        {filters.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={cn(
              "h-14 px-10 rounded-full text-[11px] font-bold uppercase tracking-[0.4em] transition-all whitespace-nowrap border flex items-center relative active:scale-95 shadow-xl",
              activeFilter === category 
                ? "bg-navy text-gold border-navy shadow-navy/30" 
                : "bg-white text-navy/30 border-navy/5 shadow-black/5"
            )}
          >
            {category}
            {activeFilter === category && (
              <motion.div 
                layoutId="filter-indicator" 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Intelligence Registry */}
      <div className="px-8 pb-32 space-y-10 relative z-30">
        <AnimatePresence mode="popLayout">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[72px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.01] hover:border-gold/30 hover:shadow-3xl transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[24px] bg-navy text-gold flex items-center justify-center font-display font-bold text-[24px] shadow-3xl shadow-navy/20 group-hover:scale-110 transition-transform">
                    {review.userName.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-navy text-[20px] tracking-tighter italic uppercase">{review.userName}</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <p className="text-[10px] text-navy/20 font-bold uppercase tracking-[0.3em]">
                        {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 bg-gold/5 px-4 py-2 rounded-full border border-gold/10">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-4 h-4 transition-all duration-500",
                        i < review.rating ? "text-gold fill-gold" : "text-navy/5"
                      )} 
                    />
                  ))}
                </div>
              </div>

              <p className="text-navy/60 text-[18px] leading-relaxed italic font-bold uppercase tracking-tight mb-12 pl-8 border-l-4 border-gold/20">
                "{review.comment}"
              </p>

              <div className="flex items-center justify-between pt-10 border-t border-navy/5">
                <Badge variant="secondary" className="bg-navy/5 text-navy/30 border-none text-[10px] font-bold uppercase tracking-[0.4em] px-6 py-2 rounded-full">
                  {review.serviceName || 'Institutional Feedback'}
                </Badge>
                <button className="flex items-center gap-3 text-gold/40 hover:text-gold transition-all active:scale-90 group/like">
                  <ThumbsUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Authorize Engagement</span>
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.01] rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </AnimatePresence>

        {!isLoading && reviews.length === 0 && (
          <div className="py-40 text-center">
            <div className="w-24 h-24 bg-navy/5 rounded-[48px] flex items-center justify-center mx-auto mb-10 shadow-inner">
               <MessageSquare className="w-12 h-12 text-navy/10" />
            </div>
            <h3 className="text-[20px] font-display font-bold text-navy uppercase italic mb-4">Registry Nullified</h3>
            <p className="text-[11px] font-bold text-navy/20 uppercase tracking-[0.3em] max-w-[240px] mx-auto mb-10 leading-loose">No feedback signatures detected within this specific operational category.</p>
            <Button 
               variant="outline"
               onClick={() => setActiveFilter('All')}
               className="rounded-full border-navy/10 text-navy font-bold text-[10px] uppercase tracking-[0.3em] px-10 h-14 hover:bg-navy hover:text-gold transition-all"
            >
               Reset Matrix
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
