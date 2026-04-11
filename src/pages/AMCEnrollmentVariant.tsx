import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AMCEnrollmentVariant = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-navy p-8 pt-12 text-warm-white rounded-b-[40px] relative overflow-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-8"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative z-10">
          <Badge className="bg-gold/20 text-gold border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1 mb-4">
            Step 1 of 3
          </Badge>
          <h1 className="text-3xl font-display font-bold text-gold mb-2">Select AMC Plan</h1>
          <p className="text-warm-white/60 text-sm">Choose the protection that fits your home.</p>
        </div>
        
        <ShieldCheck className="absolute -right-10 -bottom-10 w-48 h-48 text-warm-white/5" />
      </div>

      <div className="p-8 space-y-6 pb-32">
        {[
          { name: 'Basic', price: '1,999', visits: '2 Visits/yr', color: 'bg-white' },
          { name: 'Premium', price: '3,499', visits: '4 Visits/yr', color: 'bg-gold/5 border-gold', popular: true },
          { name: 'Elite', price: '5,999', visits: 'Unlimited', color: 'bg-white' }
        ].map((plan, i) => (
          <div 
            key={i}
            className={cn(
              "p-6 rounded-[32px] border border-border relative transition-all active:scale-[0.98]",
              plan.color
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-6 bg-gold text-navy border-none font-bold text-[10px] uppercase tracking-widest">
                Most Popular
              </Badge>
            )}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-display font-bold text-navy">{plan.name}</h3>
                <p className="text-xs text-text-secondary font-medium">{plan.visits}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-bold text-navy">₹{plan.price}</p>
                <p className="text-[10px] font-bold text-navy/20 uppercase tracking-widest">per year</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              {['Free Labor', 'Priority Support', 'Gas Top-up'].map((feat, j) => (
                <div key={j} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                  <span className="text-xs font-medium text-navy/60">{feat}</span>
                </div>
              ))}
            </div>

            <Button 
              className={cn(
                "w-full h-12 rounded-xl font-bold text-sm",
                plan.popular ? "bg-navy text-gold" : "bg-navy/5 text-navy"
              )}
            >
              Select Plan
            </Button>
          </div>
        ))}

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-lg border-t border-border z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={() => navigate('/book')}
              className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-card flex items-center justify-center gap-3"
            >
              Continue to Details
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
export default AMCEnrollmentVariant;
