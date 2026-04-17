import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ShieldCheck, Zap, Crown, Building2, Info, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AMCService, AMCPlan } from '@/services/amcService';
import { cn } from '@/lib/utils';

export default function AMCPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<AMCPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;
      try {
        const data = await AMCService.getPlanById(id);
        setPlan(data);
      } catch (error) {
        console.error('Failed to fetch AMC plan:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-2xl font-display font-bold text-navy">Plan not found</h1>
        <Button onClick={() => navigate('/amc-plans')} className="mt-4 bg-gold text-navy">Back to Plans</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="px-6 pt-8 pb-12 bg-navy text-warm-white rounded-b-[40px] relative overflow-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gold text-navy flex items-center justify-center">
            {plan.name === 'Basic' && <ShieldCheck className="w-8 h-8" />}
            {plan.name === 'Standard' && <Zap className="w-8 h-8" />}
            {plan.name === 'Premium' && <Crown className="w-8 h-8" />}
            {plan.name === 'Enterprise' && <Building2 className="w-8 h-8" />}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-gold">{plan.name} Plan</h1>
            <p className="text-warm-white/40 text-xs font-bold uppercase tracking-widest">Annual Maintenance Contract</p>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-6">
          <span className="text-4xl font-bold text-white">
            ₹{plan.price}
          </span>
          <span className="text-warm-white/40 text-sm font-medium">/{plan.duration.toLowerCase()}</span>
        </div>

        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="px-6 py-10 space-y-10">
        {/* Features List */}
        <section>
          <h2 className="text-xl font-display font-bold text-navy mb-6">What's Covered</h2>
          <div className="grid grid-cols-1 gap-4">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-navy/5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-gold" />
                </div>
                <span className="text-sm font-bold text-navy/80">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Terms Summary */}
        <section className="bg-white rounded-[32px] p-8 border border-navy/5 shadow-sm">
          <h2 className="text-lg font-display font-bold text-navy mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-gold" />
            Terms & Conditions
          </h2>
          <div className="space-y-4 text-sm text-navy/60 leading-relaxed">
            <p>• Contract is valid for 12 months from the date of enrollment.</p>
            <p>• Spare parts discount applies to standard manufacturer parts only.</p>
            <p>• Emergency calls are subject to technician availability during peak seasons.</p>
            <p>• Gas top-up covers up to 200g of refrigerant per service.</p>
          </div>
        </section>

        {/* Help */}
        <div className="flex items-center justify-between p-6 bg-navy/5 rounded-2xl border border-navy/10">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-navy/40" />
            <span className="text-sm font-bold text-navy/60">Have questions?</span>
          </div>
          <Button variant="link" className="text-gold font-bold p-0 h-auto">Contact Support</Button>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-navy/5 p-6 z-40">
        <div className="max-w-md mx-auto">
          <Button 
            className="w-full h-14 rounded-2xl bg-gold text-navy hover:bg-gold/90 font-bold text-lg shadow-lg shadow-gold/20"
            onClick={() => navigate('/register')}
          >
            Enroll in {plan.name} Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
