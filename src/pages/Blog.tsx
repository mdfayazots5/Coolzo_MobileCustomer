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
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-navy/5 text-navy"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Knowledge Center</h1>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300",
                activeCategory === cat 
                  ? "bg-gold text-navy shadow-md shadow-gold/10" 
                  : "bg-navy/5 text-navy/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article List */}
      <div className="px-6 py-8 space-y-8 pb-24">
        {/* Featured Article */}
        {activeCategory === 'All' && filteredArticles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[32px] overflow-hidden aspect-[4/5] group"
            onClick={() => navigate(`/blog/${filteredArticles[0].id}`)}
          >
            <img 
              src={filteredArticles[0].image} 
              alt={filteredArticles[0].title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <Badge className="bg-gold text-navy border-none mb-3 font-bold">Featured</Badge>
              <h2 className="text-2xl font-display font-bold text-white mb-3 leading-tight">
                {filteredArticles[0].title}
              </h2>
              <div className="flex items-center gap-4 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>{filteredArticles[0].date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>5 min read</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* List of Articles */}
        <div className="space-y-6">
          <h3 className="text-lg font-display font-bold text-navy px-2">Latest Articles</h3>
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 group"
              onClick={() => navigate(`/blog/${article.id}`)}
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center">
                <Badge variant="outline" className="w-fit text-[8px] font-bold uppercase tracking-widest border-navy/10 text-navy/40 mb-1.5">
                  {article.category}
                </Badge>
                <h4 className="font-bold text-navy text-sm leading-snug mb-2 group-hover:text-gold transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-3 text-navy/30 text-[9px] font-bold uppercase tracking-widest">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
