import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/services/authService';
import { toast } from 'sonner';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.new.length < 8 || !/\d/.test(passwords.new)) {
      toast.error('Password must be at least 8 characters and include a digit');
      return;
    }

    setIsSaving(true);
    try {
      await AuthService.changePassword(passwords.current, passwords.new);
      toast.success('Password changed successfully');
      navigate(-1);
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Change Password</h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Current Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20" />
            <input 
              type={showCurrent ? 'text' : 'password'}
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full h-12 pl-12 pr-12 bg-white border border-navy/5 rounded-lg text-[14px] font-bold text-navy focus:outline-none focus:ring-1 focus:ring-gold transition-all"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/20 active:scale-90 transition-transform">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20" />
            <input 
              type={showNew ? 'text' : 'password'}
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full h-12 pl-12 pr-12 bg-white border border-navy/5 rounded-lg text-[14px] font-bold text-navy focus:outline-none focus:ring-1 focus:ring-gold transition-all"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/20 active:scale-90 transition-transform">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/20" />
            <input 
              type={showNew ? 'text' : 'password'}
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full h-12 pl-12 pr-5 bg-white border border-navy/5 rounded-lg text-[14px] font-bold text-navy focus:outline-none focus:ring-1 focus:ring-gold transition-all"
            />
          </div>
        </div>

        <div className="pt-6">
          <Button type="submit" disabled={isSaving} className="w-full h-14 rounded-lg bg-navy text-gold font-bold text-[16px] shadow-card">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
