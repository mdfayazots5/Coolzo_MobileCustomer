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
    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters');
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
            <input 
              type={showCurrent ? 'text' : 'password'}
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full h-14 px-5 bg-white border border-navy/5 rounded-2xl text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-5 top-1/2 -translate-y-1/2 text-navy/20">
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">New Password</label>
          <div className="relative">
            <input 
              type={showNew ? 'text' : 'password'}
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full h-14 px-5 bg-white border border-navy/5 rounded-2xl text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-5 top-1/2 -translate-y-1/2 text-navy/20">
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Confirm New Password</label>
          <input 
            type={showNew ? 'text' : 'password'}
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className="w-full h-14 px-5 bg-white border border-navy/5 rounded-2xl text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
          />
        </div>

        <Button type="submit" disabled={isSaving} className="w-full h-16 rounded-[24px] bg-gold text-navy font-bold text-lg shadow-xl shadow-gold/20 mt-10">
          {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Update Password'}
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
