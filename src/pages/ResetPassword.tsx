import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthService } from '@/services/authService';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginId, setLoginId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId) return;
    setIsLoading(true);
    try {
      await AuthService.resetPassword(loginId);
      setIsSuccess(true);
      toast.success('Password reset request submitted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to request password reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white p-6">
      {!isSuccess && (
        <button 
          onClick={() => navigate('/login')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-navy/5 text-navy mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <div className="flex-1 max-w-md mx-auto w-full">
        {!isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-navy mb-2">Reset Password</h1>
              <p className="text-navy/60">Enter your email or mobile number to start password reset.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="loginId">Email or Mobile Number</Label>
                <Input 
                  id="loginId" 
                  type="text" 
                  placeholder="name@example.com or 9876543210" 
                  className="h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                />
                <p className="text-[10px] text-navy/40 uppercase tracking-wider font-bold">A secure reset instruction will be sent if the account exists.</p>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-xl bg-navy text-warm-white hover:bg-navy/90 font-bold"
              >
                {isLoading ? 'Submitting...' : 'Request Reset'}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 pt-12"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-display font-bold text-navy">Reset Requested</h2>
            <p className="text-navy/60 max-w-xs mx-auto">
              If the account exists, Coolzo will send the configured reset instructions.
            </p>
            <div className="pt-8">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full h-14 rounded-xl bg-navy text-warm-white font-bold"
              >
                Log In Now
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
