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

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ userNameOrEmail: '', password: '' });

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await AuthService.loginWithGoogle();
      setUser(user);
      toast.success('Successfully logged in!');
      navigate('/app');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.userNameOrEmail || !credentials.password) {
      toast.error('Enter your email or username and password');
      return;
    }

    setIsLoading(true);
    try {
      const user = await AuthService.login(credentials.userNameOrEmail, credentials.password);
      setUser(user);
      toast.success('Successfully logged in!');
      navigate('/app');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to log in');
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
        <h1 className="text-3xl font-display font-bold text-navy mb-2">Welcome Back</h1>
        <p className="text-navy/60 mb-8">Log in to manage your AC services.</p>

        <div className="space-y-6">
          {API_CONFIG.IS_MOCK && (
            <>
              <Button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-14 rounded-xl border-navy/10 text-navy font-bold flex items-center justify-center gap-3 bg-white"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                {isLoading ? 'Connecting...' : 'Continue with Google'}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-navy/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-warm-white px-2 text-navy/40 font-bold tracking-widest">Or continue with</span>
                </div>
              </div>
            </>
          )}

          {!API_CONFIG.IS_MOCK && (
            <div className="rounded-2xl bg-navy/5 p-4 text-xs font-medium text-navy/60">
              Use the email or username password issued for your Coolzo customer account.
            </div>
          )}

          <Tabs defaultValue="phone" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-navy/5 p-1 rounded-xl">
              <TabsTrigger value="phone" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm">Phone</TabsTrigger>
              <TabsTrigger value="email" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm">Email</TabsTrigger>
            </TabsList>

            <TabsContent value="phone">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 font-medium">+91</span>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="98765 43210" 
                      className="pl-14 h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold"
                      disabled
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={true}
                  className="w-full h-14 rounded-xl bg-navy text-warm-white hover:bg-navy/90 font-bold opacity-50"
                >
                  OTP API Pending
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="text" 
                    placeholder="name@example.com" 
                    className="h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold"
                    value={credentials.userNameOrEmail}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, userNameOrEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <button 
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-xs text-gold font-semibold hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="h-14 rounded-xl border-navy/10 focus:border-gold focus:ring-gold pr-12"
                      value={credentials.password}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 rounded-xl bg-navy text-warm-white hover:bg-navy/90 font-bold"
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-navy/60">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-gold font-bold hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
