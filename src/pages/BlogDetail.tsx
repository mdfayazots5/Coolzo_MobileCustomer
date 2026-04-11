import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Clock, Calendar, Bookmark, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentService, Blog as BlogType } from '@/services/contentService';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        const data = await ContentService.getBlogById(id);
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!article) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h2 className="text-2xl font-display font-bold text-navy mb-4">Article Not Found</h2>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );

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
            <span>5 min read</span>
          </div>
        </div>

        <div className="prose prose-navy max-w-none">
          <p className="text-lg text-navy/80 font-medium leading-relaxed mb-6 italic border-l-4 border-gold pl-6">
            {article.excerpt}
          </p>
          <div className="text-navy/70 leading-relaxed space-y-6">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>

        {/* Related Articles Teaser */}
        <div className="mt-16 pt-10 border-t border-navy/5">
          <h3 className="text-xl font-display font-bold text-navy mb-6">Related Articles</h3>
          <p className="text-navy/40 text-xs italic">More articles coming soon...</p>
        </div>
      </div>
    </div>
  );
}
