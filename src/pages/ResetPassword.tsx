import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
      toast.success('Password reset successfully');
    }, 1500);
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
              <p className="text-navy/60">Create a new secure password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className="h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="h-1 w-full bg-navy/5 rounded-full overflow-hidden mt-2">
                  <div className="h-full w-3/4 bg-gold rounded-full" />
                </div>
                <p className="text-[10px] text-navy/40 uppercase tracking-wider font-bold">Password Strength: Strong</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-xl bg-navy text-warm-white hover:bg-navy/90 font-bold"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
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
            <h2 className="text-2xl font-display font-bold text-navy">Password Reset</h2>
            <p className="text-navy/60 max-w-xs mx-auto">
              Your password has been successfully updated. You can now log in with your new password.
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
