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
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, hasCompletedOnboarding]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-navy text-warm-white overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,74,0.05)_0%,transparent_70%)]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative group">
          <Logo variant="white" className="scale-[1.8] mb-12 shadow-2xl transition-transform duration-1000 group-hover:scale-[1.9]" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute -inset-8 bg-gold/10 rounded-full blur-3xl"
          />
        </div>

        <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold to-transparent"
          />
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold/40"
          >
            Institutional AC Care
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/10"
          >
            Initializing Global Grid
          </motion.p>
        </div>
      </motion.div>

      {/* Grid Pattern Element */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gold/5 to-transparent pointer-events-none" />
    </div>
  );
}
