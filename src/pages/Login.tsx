import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { MOCK_USERS } from '@/lib/mockData';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login(MOCK_USERS[0]);
      toast.success('Welcome back, John!');
      navigate('/app');
      setIsLoading(false);
    }, 1500);
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
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-xl bg-navy text-warm-white hover:bg-navy/90 font-bold"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="email">
            <form onSubmit={handleLogin} className="space-y-6">
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
