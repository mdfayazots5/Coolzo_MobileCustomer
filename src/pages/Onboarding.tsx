import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ONBOARDING_STEPS } from '@/lib/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { ChevronRight } from 'lucide-react';

export default function Onboarding() {
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
    <div className="flex flex-col min-h-screen bg-navy text-warm-white">
      <div className="flex justify-end p-6">
        <Button 
          variant="ghost" 
          className="text-gold hover:text-gold/80 hover:bg-gold/10"
          onClick={completeOnboarding}
        >
          Skip
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-gold/10 border border-gold/20">
              <img 
                src={step.image} 
                alt={step.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-gold">
              {step.title}
            </h2>
            <p className="text-warm-white/70 leading-relaxed max-w-xs">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-12 flex flex-col items-center">
        <div className="flex gap-2 mb-8">
          {ONBOARDING_STEPS.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentStep ? 'w-8 bg-gold' : 'w-2 bg-gold/30'
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={handleNext}
          className="w-full max-w-xs h-14 rounded-2xl bg-gold text-navy hover:bg-gold/90 font-bold text-lg group"
        >
          {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
