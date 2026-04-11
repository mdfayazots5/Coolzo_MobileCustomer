import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Shield, Lock, ScrollText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentService } from '@/services/contentService';

const LegalContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');
  const type = isPrivacy ? 'privacy' : 'terms';
  
  const [legal, setLegal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLegal = async () => {
      try {
        const data = await ContentService.getLegalContent(type);
        setLegal(data);
      } catch (error) {
        console.error('Failed to fetch legal content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLegal();
  }, [type]);

  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';
  const Icon = isPrivacy ? Shield : ScrollText;

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
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">{title}</h1>
        </div>
      </div>

      <div className="p-8 space-y-8 pb-20">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-[32px] bg-gold/10 flex items-center justify-center text-gold mb-6">
            <Icon className="w-10 h-10" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Last Updated: {legal?.lastUpdated || 'March 2026'}</p>
        </div>

        <div className="prose prose-navy max-w-none">
          {legal?.content ? (
            <div dangerouslySetInnerHTML={{ __html: legal.content }} className="text-navy/60 text-sm leading-relaxed" />
          ) : (
            <>
              <section className="mb-8">
                <h2 className="text-lg font-display font-bold text-navy mb-4">1. Introduction</h2>
                <p className="text-navy/60 text-sm leading-relaxed">
                  Welcome to Coolzo. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-lg font-display font-bold text-navy mb-4">2. Information We Collect</h2>
                <p className="text-navy/60 text-sm leading-relaxed">
                  We collect personal information that you voluntarily provide to us when registering at the App, expressing an interest in obtaining information about us or our products and services, when participating in activities on the App or otherwise contacting us.
                </p>
              </section>
            </>
          )}
        </div>

        <div className="pt-10 border-t border-navy/5 text-center">
          <p className="text-[10px] text-navy/30 font-medium">
            For any legal queries, please reach out to <br />
            <span className="text-gold font-bold">legal@coolzo.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalContent;
