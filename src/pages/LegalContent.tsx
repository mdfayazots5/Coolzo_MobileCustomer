import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Shield, Lock, ScrollText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentService } from '@/services/contentService';

export default function LegalContent() {
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

  const title = isPrivacy ? 'Privacy Protocol' : 'Operational Terms';
  const Icon = isPrivacy ? Shield : ScrollText;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32 relative overflow-hidden italic">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[160px] -ml-40 -mt-20 pointer-events-none" />

      {/* Compliance Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center gap-8 relative z-10">
          <button 
            onClick={() => navigate('/app')}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="text-left">
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase italic">{title}</h1>
            <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.5em] mt-2">Regulatory and Compliance Framework</p>
          </div>
        </div>
        
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-16 relative z-30 pb-40">
        <div className="bg-white rounded-[72px] p-16 border border-navy/5 shadow-3xl shadow-black/[0.02] relative overflow-hidden group active:scale-[0.99] transition-all">
          <div className="flex flex-col items-center text-center relative z-10 mb-16">
            <div className="w-24 h-24 rounded-[32px] bg-gold/5 flex items-center justify-center text-gold mb-8 shadow-inner border border-gold/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
              <Icon className="w-12 h-12" />
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/20">Protocol Authorization Document</p>
              <p className="text-[14px] font-bold text-gold uppercase tracking-[0.4em] italic leading-none">Last Verification: {legal?.lastUpdated || 'April 2026'}</p>
            </div>
          </div>

          <div className="space-y-12 max-w-none">
            {legal?.content ? (
              <div 
                dangerouslySetInnerHTML={{ __html: legal.content }} 
                className="text-navy text-[16px] leading-relaxed font-medium prose prose-navy prose-lg max-w-none legal-prose italic" 
              />
            ) : (
              <div className="space-y-16">
                <section className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy/20 font-display font-bold text-[14px]">01</div>
                    <h2 className="text-[24px] font-display font-bold text-navy tracking-tighter uppercase italic">Institutional Intent</h2>
                  </div>
                  <p className="text-navy/40 text-[15px] leading-relaxed font-medium pl-16 italic border-l-2 border-gold/20">
                    Coolzo is committed to maintaining the highest standards of data integrity and user privacy. This document outlines our operational frameworks and the legal parameters governing your strategic engagement with our curated services.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy/20 font-display font-bold text-[14px]">02</div>
                    <h2 className="text-[24px] font-display font-bold text-navy tracking-tighter uppercase italic">Information Synthesis</h2>
                  </div>
                  <p className="text-navy/40 text-[15px] leading-relaxed font-medium pl-16 italic border-l-2 border-gold/20">
                    Data points are consolidated during interaction phases to optimize your executive home maintenance experience. We employ sophisticated protocols to ensure all telemetry is handled with absolute discretion and institutional security.
                  </p>
                </section>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold/[0.01] rounded-tl-full pointer-events-none" />
        </div>

        <div className="pt-16 text-center space-y-8 relative">
          <div className="w-16 h-1.5 bg-gold/20 mx-auto rounded-full" />
          <p className="text-[11px] text-navy/20 font-bold uppercase tracking-[0.4em] leading-loose italic">
            Direct institutional legal inquiries to our compliance division <br />
            <span className="text-gold mt-3 block select-all tracking-[0.2em] underline underline-offset-8 decoration-2">COMPLIANCE@COOLZO.COM</span>
          </p>
        </div>
      </div>
    </div>
  );
}
