import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

export default function AuthGate() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-navy text-warm-white p-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-display font-bold text-gold mb-2">COOLZO</h1>
          <p className="text-gold/60 tracking-widest uppercase text-xs">Premium AC Services</p>
        </motion.div>

        <div className="w-full max-w-xs space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              onClick={() => navigate('/register')}
              className="w-full h-14 rounded-2xl bg-gold text-navy hover:bg-gold/90 font-bold text-lg"
            >
              Create Account
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full h-14 rounded-2xl border-gold/30 text-gold hover:bg-gold/10 hover:text-gold font-bold text-lg bg-transparent"
            >
              Log In
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pb-8"
      >
        <button 
          onClick={() => navigate('/app')}
          className="text-warm-white/40 hover:text-gold transition-colors text-sm font-medium underline underline-offset-4"
        >
          Browse as Guest
        </button>
      </motion.div>
    </div>
  );
}
