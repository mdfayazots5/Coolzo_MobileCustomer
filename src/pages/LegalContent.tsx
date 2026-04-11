import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Shield, Lock, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LegalContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');
  
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';
  const Icon = isPrivacy ? Shield : ScrollText;

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
          <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Last Updated: March 2026</p>
        </div>

        <div className="prose prose-navy max-w-none">
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
            <ul className="list-disc list-inside mt-4 text-navy/60 text-sm space-y-2">
              <li>Name and Contact Data</li>
              <li>Credentials</li>
              <li>Payment Data</li>
              <li>Social Media Login Data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-display font-bold text-navy mb-4">3. How We Use Your Information</h2>
            <p className="text-navy/60 text-sm leading-relaxed">
              We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-display font-bold text-navy mb-4">4. Sharing Your Information</h2>
            <p className="text-navy/60 text-sm leading-relaxed">
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>
          </section>
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
