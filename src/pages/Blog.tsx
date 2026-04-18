import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ContentService, Blog as BlogType } from '@/services/contentService';
import { cn } from '@/lib/utils';

export default function Blog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await ContentService.getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const categories = ['All', 'Maintenance', 'Tips', 'Guides'];
  const filteredArticles = blogs.filter(article => 
    activeCategory === 'All' || article.category === activeCategory
  );

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-8 border-b border-navy/5 sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-white/90">
        <div className="flex items-center gap-5 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full bg-navy/5 flex items-center justify-center text-navy active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-[20px] font-display font-bold text-navy tracking-tight">Intelligence</h1>
            <p className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.2em] mt-0.5">Insights & Expert Guides</p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-full text-[10px] font-bold whitespace-nowrap transition-all duration-300 uppercase tracking-widest border shadow-inner",
                activeCategory === cat 
                  ? "bg-navy text-gold border-navy shadow-lg shadow-navy/20" 
                  : "bg-white text-navy/30 border-navy/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article List */}
      <div className="px-6 py-12 space-y-12 pb-32">
        {/* Featured Article */}
        {activeCategory === 'All' && filteredArticles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-[40px] overflow-hidden aspect-[4/5] group shadow-2xl shadow-navy/20 active:scale-[0.98] transition-all"
            onClick={() => navigate(`/blog/${filteredArticles[0].id}`)}
          >
            <img 
              src={filteredArticles[0].image} 
              alt={filteredArticles[0].title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <Badge className="bg-gold text-navy border-none mb-4 text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">Featured Insight</Badge>
              <h2 className="text-[28px] font-display font-bold text-white mb-6 leading-tight tracking-tight">
                {filteredArticles[0].title}
              </h2>
              <div className="flex items-center gap-6 text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold/60" />
                  <span>{filteredArticles[0].date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold/60" />
                  <span>5 Min Reading Time</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* List of Articles */}
        <div className="space-y-10">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/30">Recent Dispatches</h3>
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] bg-gold/5 px-3 py-1 rounded-full">Archive View</span>
          </div>
          <div className="space-y-8">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-6 group active:scale-[0.98] transition-all hover:translate-x-2"
                onClick={() => navigate(`/blog/${article.id}`)}
              >
                <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-navy/5 group-hover:border-gold/30 transition-colors">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col justify-center gap-2.5">
                  <Badge variant="outline" className="w-fit text-[8px] font-bold uppercase tracking-[0.2em] border-navy/10 text-navy/30 px-3 py-1">
                    {article.category}
                  </Badge>
                  <h4 className="font-bold text-navy text-[16px] leading-tight tracking-tight group-hover:text-gold transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-4 text-navy/20 text-[10px] font-bold uppercase tracking-[0.15em]">
                    <span>{article.date}</span>
                    <span className="w-1 h-1 rounded-full bg-gold/30" />
                    <span>5 Min Read</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
