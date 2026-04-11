import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, Filter, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { REVIEWS, SERVICE_CATEGORIES } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function Reviews() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredReviews = REVIEWS.filter(review => 
    activeFilter === 'All' || review.serviceType === activeFilter
  );

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="px-6 py-6 bg-white border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-navy/5 text-navy"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Customer Reviews</h1>
        </div>

        {/* Aggregate Rating */}
        <div className="flex items-center gap-6 mb-2">
          <div className="text-center">
            <div className="text-4xl font-display font-bold text-navy">4.9</div>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-gold fill-gold" />)}
            </div>
            <p className="text-[10px] text-navy/40 font-bold uppercase tracking-wider mt-2">1,240 Reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-navy/40 w-2">{rating}</span>
                <div className="flex-1 h-1.5 bg-navy/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold rounded-full" 
                    style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : 5}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 overflow-x-auto flex gap-2 no-scrollbar bg-warm-white">
        {SERVICE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300",
              activeFilter === category 
                ? "bg-navy text-gold shadow-md shadow-navy/10" 
                : "bg-white text-navy/40 border border-navy/5"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="px-6 pb-12 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 border border-navy/5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-bold text-gold">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">{review.userName}</h4>
                    <p className="text-[10px] text-navy/40 font-medium">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-3 h-3",
                        i < review.rating ? "text-gold fill-gold" : "text-navy/10"
                      )} 
                    />
                  ))}
                </div>
              </div>

              <p className="text-navy/70 text-sm leading-relaxed mb-4">
                "{review.comment}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-navy/5">
                <Badge variant="secondary" className="bg-gold/5 text-gold border-none text-[10px] font-bold">
                  {review.serviceType}
                </Badge>
                <button className="flex items-center gap-1.5 text-navy/40 hover:text-navy transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Helpful</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredReviews.length === 0 && (
          <div className="text-center py-20">
            <MessageSquare className="w-12 h-12 text-navy/10 mx-auto mb-4" />
            <p className="text-navy/40 font-medium">No reviews for this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
