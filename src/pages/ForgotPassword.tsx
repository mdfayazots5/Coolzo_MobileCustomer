import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthService } from '@/services/authService';
import { toast } from 'sonner';
import { ArrowLeft, MailCheck, Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await AuthService.resetPassword(email);
      setIsSubmitted(true);
      toast.success('Reset link sent to your email');
      
      // Auto navigate back to login after 5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      toast.error('Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white p-6">
      <button 
        onClick={() => navigate(-1)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-navy/5 text-navy mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-md mx-auto w-full">
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-navy mb-2">Forgot Password</h1>
              <p className="text-navy/60">Enter your email to receive a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-xl bg-navy text-warm-white hover:bg-navy/90 font-bold"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send Reset Link'}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 pt-12"
          >
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <MailCheck className="w-10 h-10 text-gold" />
            </div>
            <h2 className="text-2xl font-display font-bold text-navy">Check your email</h2>
            <p className="text-navy/60 max-w-xs mx-auto">
              We've sent a password reset link to your email address.
            </p>
            <div className="pt-8">
              <Button 
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full h-14 rounded-xl border-navy/10 text-navy font-bold"
              >
                Back to Login
              </Button>
            </div>
            <p className="text-xs text-navy/40">Redirecting to login in 5 seconds...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
