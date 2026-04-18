import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthService } from '@/services/authService';
import { API_CONFIG } from '@/config/apiConfig';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await AuthService.loginWithGoogle();
      setUser(user);
      toast.success('Access keys validated. Synchronizing...');
      navigate('/app');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Authentication protocols failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Invalid telemetry coordinates (Phone Number)');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.loginWithPhone(phone);
      toast.success('Transmission successful. Check signals (OTP)');
      navigate('/otp', { state: { phone: `+91 ${phone}` } });
    } catch (error) {
      toast.error('Signal transmission failure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (API_CONFIG.IS_MOCK) {
      handleGoogleLogin();
      return;
    }
    toast.info('Legacy email channels are suppressed. Use Google Authorization.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/[0.03] rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

      {/* Access Header */}
      <div className="bg-navy px-8 pt-16 pb-24 text-warm-white rounded-b-[72px] relative overflow-hidden shadow-2xl shadow-navy/40">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-16 active:scale-95 transition-all shadow-2xl"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            <Logo className="h-10 text-gold" />
            <div className="h-8 w-px bg-white/10" />
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Auth Layer 2.4</span>
          </div>
          <h1 className="text-[44px] font-display font-bold text-warm-white tracking-tighter leading-none italic">Authorized <span className="text-gold">Entry</span></h1>
          <p className="text-warm-white/40 text-[11px] font-bold uppercase tracking-[0.3em] max-w-xs">Synchronizing executive credentials with the central command grid.</p>
        </div>
        <div className="absolute right-[-10%] bottom-[-10%] w-64 h-64 border-[32px] border-white/[0.02] rounded-full pointer-events-none" />
      </div>

      <div className="px-8 -mt-12 space-y-12 pb-40 relative z-20">
        <div className="bg-white p-10 rounded-[56px] shadow-2xl shadow-black/[0.02] border border-navy/5 space-y-10">
          <Tabs defaultValue="phone" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-2 bg-navy/5 rounded-[28px] h-18">
              <TabsTrigger value="phone" className="rounded-[22px] data-[state=active]:bg-navy data-[state=active]:text-gold font-bold text-[12px] uppercase tracking-widest transition-all">Mobile Telemetry</TabsTrigger>
              <TabsTrigger value="email" className="rounded-[22px] data-[state=active]:bg-navy data-[state=active]:text-gold font-bold text-[12px] uppercase tracking-widest transition-all">Secure Mail</TabsTrigger>
            </TabsList>

            <TabsContent value="phone" className="mt-10">
              <form onSubmit={handlePhoneLogin} className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/20 ml-4">Terminal Coordinates</Label>
                  <div className="relative group">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[15px] font-bold text-navy/20">+91</span>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="98765 43210" 
                      className="pl-20 h-20 rounded-[32px] border-navy/5 bg-navy/[0.02] focus:bg-white focus:ring-2 focus:ring-gold/30 text-[17px] font-bold text-navy shadow-inner focus:shadow-2xl transition-all"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-20 rounded-[32px] bg-navy text-gold hover:bg-navy/95 font-bold text-[18px] uppercase tracking-[0.3em] shadow-2xl shadow-navy/40 active:scale-95 transition-all group overflow-hidden relative"
                >
                  <span className="relative z-10">{isLoading ? 'Transmitting...' : 'Dispatch OTP'}</span>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="email" className="mt-10">
              <form onSubmit={handleEmailLogin} className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/20 ml-4">Mail Identifier</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@executive.com" 
                    className="h-20 px-8 rounded-[32px] border-navy/5 bg-navy/[0.02] focus:bg-white focus:ring-2 focus:ring-gold/30 text-[17px] font-bold text-navy shadow-inner focus:shadow-2xl transition-all"
                    disabled={!API_CONFIG.IS_MOCK || isLoading}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/20">Security Key</Label>
                    <button 
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-[10px] text-gold font-bold uppercase tracking-widest hover:underline"
                    >
                      Bypass Key?
                    </button>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="h-20 px-8 rounded-[32px] border-navy/5 bg-navy/[0.02] focus:bg-white focus:ring-2 focus:ring-gold/30 text-[17px] font-bold text-navy shadow-inner focus:shadow-2xl transition-all pr-16"
                      disabled={!API_CONFIG.IS_MOCK || isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-8 top-1/2 -translate-y-1/2 text-navy/20 hover:text-navy transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-20 rounded-[32px] bg-navy text-gold hover:bg-navy/95 font-bold text-[18px] uppercase tracking-[0.3em] shadow-2xl shadow-navy/40 active:scale-95 transition-all group overflow-hidden relative"
                >
                  <span className="relative z-10">{isLoading ? 'Validating...' : 'Authorize Access'}</span>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy/5"></div>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.5em] font-bold text-navy/20">
              <span className="bg-white px-6">Proprietary Vectors</span>
            </div>
          </div>

          <Button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full h-18 rounded-[28px] border-navy/5 bg-white text-navy font-bold flex items-center justify-center gap-4 shadow-sm hover:border-gold/30 active:scale-[0.98] transition-all"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0" />
            <span className="text-[13px] uppercase tracking-[0.2em]">{isLoading ? 'Syncing...' : 'Logon with Google Workspace'}</span>
          </Button>
        </div>

        <div className="text-center space-y-4">
          <p className="text-[12px] text-navy/40 font-bold uppercase tracking-widest">
            Identity Null?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-gold font-bold hover:underline ml-2"
            >
              Enroll as Patron
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
