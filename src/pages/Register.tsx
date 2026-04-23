import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { AuthService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await AuthService.register(form);
      await AuthService.loginWithPhone(form.phone);
      setStep('otp');
      toast.info('Transmission successful. Check signals (OTP)');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (value: string) => {
    setOtpValue(value);
    if (value.length === 6) {
      setIsLoading(true);
      try {
        const user = await AuthService.verifyOTP(form.phone, value);
        setUser(user);
          toast.success('Patron account successfully initialized');
          navigate('/app');
      } catch (error) {
        toast.error('Identity verification failed.');
        setOtpValue('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/[0.03] rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

      {/* Enrollment Header */}
      <div className="bg-navy px-8 pt-16 pb-24 text-warm-white rounded-b-[72px] relative overflow-hidden shadow-2xl shadow-navy/40">
        <button 
          onClick={() => step === 'otp' ? setStep('details') : navigate(-1)}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-16 active:scale-95 transition-all shadow-2xl"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            <Logo className="h-10 text-gold" />
            <div className="h-8 w-px bg-white/10" />
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Node Registry 1.0</span>
          </div>
          <h1 className="text-[44px] font-display font-bold text-warm-white tracking-tighter leading-none italic">Patron <span className="text-gold">Enrollment</span></h1>
          <p className="text-warm-white/40 text-[11px] font-bold uppercase tracking-[0.3em] max-w-xs">{step === 'details' ? 'Initializing executive membership protocol for elite service access.' : 'Awaiting identity confirmation via secure channel transmission.'}</p>
        </div>
      </div>

      <div className="px-8 -mt-12 space-y-12 pb-40 relative z-20">
        <div className="bg-white p-10 rounded-[56px] shadow-2xl shadow-black/[0.02] border border-navy/5">
          <AnimatePresence mode="wait">
            {step === 'details' ? (
              <motion.form
                key="details"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onSubmit={handleSendOTP}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-4">Full Identity</Label>
                  <Input 
                    id="name" 
                    placeholder="Full Name Registry" 
                    className="h-20 px-8 rounded-[32px] border-navy/5 bg-navy/[0.02] focus:bg-white focus:ring-2 focus:ring-gold/30 text-[17px] font-bold text-navy shadow-inner focus:shadow-2xl transition-all"
                    value={form.name}
                    onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-4">Response Telemetry</Label>
                  <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[15px] font-bold text-navy/20">+91</span>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="98765 43210" 
                      className="pl-20 h-20 rounded-[32px] border-navy/5 bg-navy/[0.02] focus:bg-white focus:ring-2 focus:ring-gold/30 text-[17px] font-bold text-navy shadow-inner focus:shadow-2xl transition-all"
                      value={form.phone}
                      onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-4">Digital Signal</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@executive.com" 
                    className="h-20 px-8 rounded-[32px] border-navy/5 bg-navy/[0.02] focus:bg-white focus:ring-2 focus:ring-gold/30 text-[17px] font-bold text-navy shadow-inner focus:shadow-2xl transition-all"
                    value={form.email}
                    onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-4">Access Key</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-20 px-8 rounded-[32px] border-navy/5 bg-navy/[0.02] focus:bg-white focus:ring-2 focus:ring-gold/30 text-[17px] font-bold text-navy shadow-inner focus:shadow-2xl transition-all"
                    value={form.password}
                    onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-20 rounded-[32px] bg-navy text-gold hover:bg-navy/95 font-bold text-[18px] uppercase tracking-[0.3em] shadow-2xl shadow-navy/40 active:scale-95 transition-all group overflow-hidden relative"
                  >
                    <span className="relative z-10">{isLoading ? 'Initializing...' : 'Initialize Registry'}</span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-12 text-center py-4"
              >
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-navy/20 uppercase tracking-[0.4em]">Signal Verification</p>
                  <h2 className="text-[28px] font-display font-bold text-navy italic">Input <span className="text-gold">Cipher</span></h2>
                </div>

                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={6} 
                    value={otpValue}
                    onChange={handleVerifyOTP}
                    disabled={isLoading}
                  >
                    <InputOTPGroup className="gap-4">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot 
                          key={i} 
                          index={i} 
                          className="w-12 h-16 rounded-[20px] bg-navy/[0.02] border-navy/5 text-2xl font-bold text-navy focus:border-gold focus:ring-2 focus:ring-gold/30 shadow-inner"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="space-y-6">
                  <p className="text-[12px] text-navy/40 font-bold uppercase tracking-[0.2em]">
                    Signal Lost?{' '}
                    <button
                      className="text-gold font-bold hover:underline"
                      onClick={() => {
                        void AuthService.loginWithPhone(form.phone);
                      }}
                    >
                      Resend Cipher (30s)
                    </button>
                  </p>
                  
                  {isLoading && (
                    <div className="flex items-center justify-center gap-4 text-navy/60 bg-navy/5 p-4 rounded-full">
                      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Validating Registry...</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center">
          <p className="text-[12px] text-navy/40 font-bold uppercase tracking-widest">
            Registered Node?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-gold font-bold hover:underline ml-2"
            >
              Authorize Access
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
