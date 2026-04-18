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
      <div className="relative h-[45vh] w-full group overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent shadow-inner" />
        
        <div className="absolute top-16 left-6 right-6 flex justify-between items-center z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl text-white active:scale-90 transition-all border border-white/10 shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl text-white active:scale-90 transition-all border border-white/10 shadow-lg">
              <Bookmark className="w-6 h-6" />
            </button>
            <button 
              onClick={handleShare}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl text-white active:scale-90 transition-all border border-white/10 shadow-lg"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 right-10">
          <Badge className="bg-gold text-navy border-none mb-4 text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
            {article.category} Awareness
          </Badge>
          <h1 className="text-[32px] font-display font-bold text-white leading-tight tracking-tight shadow-text">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-12 pb-32 max-w-3xl mx-auto">
        <div className="flex items-center gap-8 mb-12 pb-10 border-b border-navy/5">
          <div className="flex items-center gap-3 text-navy/40 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Calendar className="w-4 h-4 text-gold/60" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-3 text-navy/40 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Clock className="w-4 h-4 text-gold/60" />
            <span>5 Minute Synthesis</span>
          </div>
        </div>

        <div className="space-y-10">
          <p className="text-[18px] text-navy font-bold leading-relaxed italic border-l-[6px] border-gold pl-10 bg-gold/5 py-8 rounded-r-3xl shadow-inner mb-12">
            "{article.excerpt}"
          </p>
          <div className="text-navy/70 leading-relaxed text-[16px] font-medium space-y-8 prose prose-navy prose-lg max-w-none">
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-24 p-10 bg-navy rounded-[40px] text-warm-white relative overflow-hidden shadow-2xl shadow-navy/30 group">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="text-[22px] font-display font-bold text-gold mb-3">Questions about this topic?</h3>
            <p className="text-warm-white/40 text-[13px] font-medium mb-8 max-w-[280px]">Our expert consultants are available for personalized advice.</p>
            <Button className="h-14 px-10 rounded-xl bg-gold text-navy font-bold uppercase tracking-widest text-[13px] hover:bg-gold/90 transition-all active:scale-95 shadow-xl shadow-gold/20">
              Speak to Agent
            </Button>
          </div>
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
