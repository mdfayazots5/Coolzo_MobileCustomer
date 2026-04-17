import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Logo } from '@/components/Logo';
import { useAuthStore } from '@/store/useAuthStore';

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        navigate('/onboarding');
      } else if (isAuthenticated) {
        navigate('/app');
      } else {
        navigate('/auth-gate');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, hasCompletedOnboarding]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-navy text-warm-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <Logo variant="white" className="scale-150" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 1, duration: 1 }}
          className="h-1 bg-gold mt-6 rounded-full"
        />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="mt-8 text-sm uppercase tracking-[0.3em] font-medium text-gold/60"
      >
        Premium AC Care
      </motion.p>
    </div>
  );
}
