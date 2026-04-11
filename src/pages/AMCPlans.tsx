import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ShieldCheck, Zap, Crown, Building2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AMC_PLANS } from '@/lib/mockData';
import { useBookingStore } from '@/store/useBookingStore';
import { cn } from '@/lib/utils';

const PlanIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'Basic': return <ShieldCheck className="w-6 h-6" />;
    case 'Standard': return <Zap className="w-6 h-6" />;
    case 'Premium': return <Crown className="w-6 h-6" />;
    case 'Enterprise': return <Building2 className="w-6 h-6" />;
    default: return <ShieldCheck className="w-6 h-6" />;
  }
};

export default function AMCPlans() {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState(1); // Standard plan by default
  const { updateBooking, setStep, resetBooking } = useBookingStore();

  const handleBookAMC = (planId: string) => {
    resetBooking();
    updateBooking({ 
      serviceId: 'amc', // Special ID for AMC
      subServiceId: planId 
    });
    setStep(2);
    navigate('/book');
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-12">
      {/* Header */}
      <div className="px-6 py-8 bg-navy text-warm-white rounded-b-[40px] relative overflow-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <h1 className="text-3xl font-display font-bold text-gold mb-2">AMC Plans</h1>
        <p className="text-warm-white/60 text-sm max-w-xs">
          Protect your AC all year round with our Annual Maintenance Contracts.
        </p>

        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
      </div>

      {/* Plan Cards Horizontal Scroll */}
      <div className="px-6 -mt-8 mb-12">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory">
          {AMC_PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={cn(
                "snap-center shrink-0 w-[280px] bg-white rounded-[32px] p-6 shadow-xl border-2 transition-all duration-500",
                plan.recommended ? "border-gold" : "border-transparent"
              )}
              onClick={() => setActivePlan(index)}
            >
              {plan.recommended && (
                <div className="bg-gold text-navy text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                  Most Popular
                </div>
              )}
              
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                plan.recommended ? "bg-gold text-navy" : "bg-navy/5 text-navy"
              )}>
                <PlanIcon name={plan.name} />
              </div>

              <h3 className="text-2xl font-display font-bold text-navy mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-navy">
                  {typeof plan.price === 'number' ? `₹${plan.price}` : plan.price}
                </span>
                {typeof plan.price === 'number' && (
                  <span className="text-navy/40 text-xs font-medium">/{plan.period.toLowerCase()}</span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-navy/60">
                    <Check className="w-4 h-4 text-gold shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  className="h-12 rounded-xl border-navy/10 text-navy font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/amc-plan/${plan.id}`);
                  }}
                >
                  Details
                </Button>
                <Button 
                  className={cn(
                    "h-12 rounded-xl font-bold transition-all duration-300",
                    plan.recommended 
                      ? "bg-navy text-warm-white hover:bg-navy/90" 
                      : "bg-gold text-navy hover:bg-gold/90"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookAMC(plan.id);
                  }}
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Matrix Teaser */}
      <div className="px-6 space-y-8">
        <section>
          <h2 className="text-xl font-display font-bold text-navy mb-6">Why choose AMC?</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { title: 'Priority Service', desc: 'Get technician at your doorstep within 4-24 hours.' },
              { title: 'Cost Savings', desc: 'Save up to 40% on regular maintenance and spare parts.' },
              { title: 'Peace of Mind', desc: 'Automated scheduling so you never miss a service.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-navy/5">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm">{item.title}</h4>
                  <p className="text-navy/60 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-navy rounded-3xl p-8 text-warm-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => <Crown key={i} className="w-4 h-4 text-gold fill-gold" />)}
            </div>
            <p className="italic text-sm leading-relaxed text-warm-white/80 mb-4">
              "The Standard AMC plan is perfect for my home. I don't have to worry about calling them; they just show up every 3 months for service."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center font-bold text-gold">M</div>
              <div>
                <p className="text-sm font-bold">Mahesh Kumar</p>
                <p className="text-[10px] text-warm-white/40 uppercase tracking-widest">Standard Plan Member</p>
              </div>
            </div>
          </div>
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
        </section>
      </div>
    </div>
  );
}
