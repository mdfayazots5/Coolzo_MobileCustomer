import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ONBOARDING_STEPS } from '@/lib/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { ChevronRight } from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { setHasCompletedOnboarding } = useAuthStore();

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    navigate('/auth-gate');
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className="flex flex-col min-h-screen bg-navy text-warm-white relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[160px] -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/[0.03] rounded-full blur-[120px] -ml-20 -mb-20 pointer-events-none" />
      
      <div className="flex justify-between items-center p-10 relative z-20">
        <LOGO_SVG className="w-12 h-12 text-gold animate-pulse" />
        <Button 
          variant="ghost" 
          className="text-gold/40 hover:text-gold hover:bg-gold/10 font-bold text-[11px] uppercase tracking-[0.4em] px-8 rounded-full border border-gold/10"
          onClick={completeOnboarding}
        >
          Bypass
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-10 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center space-y-16"
          >
            <div className="relative group">
              <div className="w-full max-w-[340px] aspect-[4/5] rounded-[72px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(212,175,55,0.15)] border border-gold/20 relative">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy/20 to-navy/80" />
              </div>
              <div className="absolute -inset-4 border border-gold/5 rounded-[84px] pointer-events-none animate-pulse" />
            </div>

            <div className="max-w-xs space-y-6">
              <h2 className="text-[44px] font-display font-bold text-gold tracking-tighter leading-none italic">
                {step.title}
              </h2>
              <p className="text-warm-white/60 leading-relaxed text-[16px] font-medium italic">
                {step.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-16 flex flex-col items-center space-y-12 relative z-20 bg-gradient-to-t from-navy to-transparent">
        <div className="flex gap-4">
          {ONBOARDING_STEPS.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all duration-700 ${
                index === currentStep ? 'w-16 bg-gold shadow-[0_0_20px_rgba(212,175,55,0.5)]' : 'w-4 bg-gold/10'
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={handleNext}
          className="w-full max-w-sm h-22 rounded-[40px] bg-gold text-navy hover:bg-gold/95 font-bold text-[18px] uppercase tracking-[0.4em] shadow-[0_20px_60px_-15px_rgba(212,175,55,0.4)] active:scale-95 transition-all group overflow-hidden relative"
        >
          <span className="relative z-10">{currentStep === ONBOARDING_STEPS.length - 1 ? 'Go Operational' : 'Next Protocol'}</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </Button>

        <div className="text-warm-white/20 text-[9px] font-bold uppercase tracking-[0.5em] flex items-center gap-4">
          <div className="w-12 h-px bg-warm-white/10" />
          System Initialization Sequence
          <div className="w-12 h-px bg-warm-white/10" />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

const LOGO_SVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10L90 30V70L50 90L10 70V30L50 10Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M50 30L70 40V60L50 70L30 60V40L50 30Z" fill="currentColor" opacity="0.5"/>
  </svg>
);
