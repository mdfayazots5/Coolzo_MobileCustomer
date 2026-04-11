import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Clock, Calendar, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ARTICLES } from '@/lib/mockData';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = ARTICLES.find(a => a.id === id);

  if (!article) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-[45vh] w-full">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
              <Bookmark className="w-5 h-5" />
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <Badge className="bg-gold text-navy border-none mb-4 font-bold">
            {article.category}
          </Badge>
          <h1 className="text-3xl font-display font-bold text-white leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-6 mb-10 pb-6 border-b border-navy/5">
          <div className="flex items-center gap-2 text-navy/40 text-[10px] font-bold uppercase tracking-widest">
            <Calendar className="w-4 h-4 text-gold" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-2 text-navy/40 text-[10px] font-bold uppercase tracking-widest">
            <Clock className="w-4 h-4 text-gold" />
            <span>{article.readTime} read</span>
          </div>
        </div>

        <div className="prose prose-navy max-w-none">
          <p className="text-lg text-navy/80 font-medium leading-relaxed mb-6 italic border-l-4 border-gold pl-6">
            {article.excerpt}
          </p>
          <div className="text-navy/70 leading-relaxed space-y-6">
            <p>{article.content}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h3 className="text-xl font-display font-bold text-navy mt-10 mb-4">Why regular maintenance matters</h3>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
            </p>
          </div>
        </div>

        {/* Related Articles Teaser */}
        <div className="mt-16 pt-10 border-t border-navy/5">
          <h3 className="text-xl font-display font-bold text-navy mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 gap-6">
            {ARTICLES.filter(a => a.id !== article.id).slice(0, 2).map(related => (
              <div 
                key={related.id} 
                className="flex gap-4 items-center group cursor-pointer"
                onClick={() => navigate(`/blog/${related.id}`)}
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                  <img src={related.image} alt={related.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm leading-snug group-hover:text-gold transition-colors">{related.title}</h4>
                  <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest mt-1">{related.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
