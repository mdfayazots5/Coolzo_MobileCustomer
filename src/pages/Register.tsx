import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuthStore } from '@/store/useAuthStore';
import { MOCK_USERS } from '@/lib/mockData';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setStep('otp');
      setIsLoading(false);
      toast.info('OTP sent to your mobile number');
    }, 1500);
  };

  const handleVerifyOTP = (value: string) => {
    setOtpValue(value);
    if (value.length === 6) {
      setIsLoading(true);
      setTimeout(() => {
        if (value === '123456') {
          setUser(MOCK_USERS[0] as any);
          toast.success('Account created successfully!');
          navigate('/app');
        } else {
          toast.error('Invalid OTP. Try 123456');
          setOtpValue('');
        }
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white p-6">
      <button 
        onClick={() => step === 'otp' ? setStep('details') : navigate(-1)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-navy/5 text-navy mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 'details' ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-display font-bold text-navy mb-2">Create Account</h1>
                <p className="text-navy/60">Join Coolzo for premium AC services.</p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 font-medium">+91</span>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="98765 43210" 
                      className="pl-14 h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold"
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl bg-navy text-warm-white hover:bg-navy/90 font-bold"
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 text-center"
            >
              <div>
                <h1 className="text-3xl font-display font-bold text-navy mb-2">Verify Phone</h1>
                <p className="text-navy/60">Enter the 6-digit code sent to your phone.</p>
              </div>

              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={otpValue}
                  onChange={handleVerifyOTP}
                  disabled={isLoading}
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot 
                        key={i} 
                        index={i} 
                        className="w-12 h-14 rounded-xl border-navy/10 text-xl font-bold focus:border-gold focus:ring-gold"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-navy/40">
                  Didn't receive the code?{' '}
                  <button className="text-gold font-bold hover:underline">Resend in 30s</button>
                </p>
                
                {isLoading && (
                  <div className="flex items-center justify-center gap-2 text-navy/60">
                    <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Verifying...</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center">
          <p className="text-sm text-navy/60">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-gold font-bold hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
