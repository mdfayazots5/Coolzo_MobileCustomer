import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Timer, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AuthService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';

const OTPScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const phone = location.state?.phone || '+91 98765 43210';

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    if (otp.some(digit => !digit)) {
      toast.error('Please enter the full 4-digit code');
      return;
    }
    
    setIsVerifying(true);
    try {
      const user = await AuthService.verifyOTP(phone, otp.join(''));
      setUser(user);
      toast.success('OTP Verified Successfully');
      navigate('/app');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await AuthService.loginWithPhone(phone);
      setTimeLeft(30);
      toast.success('New code sent to your phone');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white p-8">
      <button 
        onClick={() => navigate(-1)}
        className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-navy mb-12"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <div className="space-y-4 mb-12">
        <h1 className="text-3xl font-display font-bold text-navy">Verify Phone</h1>
        <p className="text-text-secondary leading-relaxed">
          We've sent a 4-digit verification code to <span className="text-navy font-bold">{phone}</span>
        </p>
      </div>

      <div className="flex justify-between gap-4 mb-12">
        {otp.map((digit, index) => (
          <Input
            key={index}
            id={`otp-${index}`}
            type="number"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isVerifying}
            className="w-16 h-20 text-center text-2xl font-display font-bold rounded-2xl border-border bg-white focus:ring-gold"
          />
        ))}
      </div>

      <div className="text-center space-y-8">
        <div className="flex items-center justify-center gap-2 text-text-secondary font-medium">
          <Timer className="w-4 h-4" />
          {timeLeft > 0 ? (
            <span>Resend code in <span className="text-navy font-bold">{timeLeft}s</span></span>
          ) : (
            <button 
              onClick={handleResend}
              disabled={isResending || isVerifying}
              className="text-gold font-bold flex items-center gap-2"
            >
              {isResending ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Resend Code'}
            </button>
          )}
        </div>

        <Button 
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-card"
        >
          {isVerifying ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
          {isVerifying ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default OTPScreen;
