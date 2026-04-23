import { AuthService } from '@/services/authService';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Image as ImageIcon, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  ChevronRight,
  Lock,
  Trash2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void AuthService.getProfile()
      .then((profile) => {
        setUser(profile);
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
      })
      .catch(() => undefined);
  }, [setUser]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const updatedData = {
        name,
        email,
        phone,
      };

      if (phone !== user.phone) {
        await AuthService.loginWithPhone(phone);
        navigate('/otp', {
          state: {
            phone,
            displayPhone: `+91 ${phone}`,
            mode: 'profile-update',
            pendingProfile: updatedData,
          },
        });
        toast.success('Verify the new phone number to complete the profile update');
      } else {
        const profile = await AuthService.updateProfile(user.uid, updatedData);
        setUser(profile);
        toast.success('Identity synchronized successfully');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Identity synchronization sequence failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-64 relative overflow-hidden italic">
      {/* Identity Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[140px] -ml-40 pointer-events-none" />

      {/* Protocol Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center gap-8 relative z-10 transition-all">
          <button 
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all shadow-3xl border border-white/5"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="space-y-2">
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Identity Protocol</h1>
            <p className="text-warm-white/30 text-[11px] font-bold uppercase tracking-[0.5em] leading-none">Executive Account Node</p>
          </div>
        </div>
        
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
        <User className="absolute -left-20 -bottom-20 w-[420px] h-[420px] text-warm-white/[0.02] -rotate-12 pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-20 relative z-30 pb-40">
        {/* Avatar Telemetry */}
        <div className="flex flex-col items-center py-10 group">
          <div className="relative">
            <div className="w-48 h-48 rounded-[72px] bg-white border-2 border-gold/30 p-2 shadow-3xl shadow-gold/20 overflow-hidden transform group-hover:scale-105 transition-all duration-1000 group-hover:rotate-2 relative z-10">
              <div className="w-full h-full rounded-[64px] overflow-hidden border-2 border-navy relative">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-navy/5" />
              </div>
            </div>
            <button className="absolute -bottom-4 -right-4 w-18 h-18 rounded-[28px] bg-navy text-gold flex items-center justify-center shadow-3xl border-[6px] border-warm-white active:scale-90 transition-all hover:bg-gold hover:text-navy active:rotate-90 z-20">
              <ImageIcon className="w-8 h-8" />
            </button>
            <div className="absolute inset-0 bg-gold/20 rounded-[72px] blur-2xl group-hover:blur-3xl transition-all duration-700 -z-10 opacity-0 group-hover:opacity-100" />
          </div>
          <div className="mt-12 text-center space-y-4">
            <h2 className="text-[40px] font-display font-bold text-navy tracking-tighter leading-none uppercase truncate max-w-[320px]">{name || 'Patron Affiliate'}</h2>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-gold/10 text-gold border border-gold/10 font-bold text-[10px] uppercase tracking-[0.4em] px-8 py-2.5 rounded-full shadow-3xl shadow-gold/10">CZ-UNIT-8829</Badge>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-navy/20 text-[10px] font-bold uppercase tracking-[0.5em]">Elite Level Active</span>
            </div>
          </div>
        </div>

        {/* Configuration Matrix */}
        <section className="space-y-12">
          <div className="space-y-6">
            <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8">Patron Identifier</label>
            <div className="relative group">
              <User className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-navy/10 group-focus-within:text-gold transition-all duration-700" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name Registry"
                className="w-full h-24 pl-24 pr-10 bg-white border border-navy/5 rounded-[48px] text-[20px] font-display font-bold text-navy focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all shadow-3xl shadow-black/[0.01] focus:shadow-gold/20 focus:border-gold/30 placeholder:text-navy/5 uppercase tracking-tight"
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8">Secure Channel</label>
            <div className="relative group opacity-40 grayscale">
              <Mail className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-navy/10" />
              <input 
                type="email"
                disabled
                value={email}
                className="w-full h-24 pl-24 pr-10 bg-navy/[0.02] border border-navy/5 rounded-[48px] text-[20px] font-display font-bold text-navy focus:outline-none transition-all shadow-inner uppercase tracking-tight"
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8">Response Telemetry</label>
            <div className="relative group">
              <Phone className="absolute left-10 top-1/2 -translate-y-1/2 w-6 h-6 text-navy/10 group-focus-within:text-gold transition-all duration-700" />
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Secure Line Registry"
                className="w-full h-24 pl-24 pr-10 bg-white border border-navy/5 rounded-[48px] text-[20px] font-display font-bold text-navy focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all shadow-3xl shadow-black/[0.01] focus:shadow-gold/20 focus:border-gold/30 placeholder:text-navy/5 uppercase tracking-tight"
              />
            </div>
          </div>
        </section>

        {/* Protocol Directives */}
        <section className="space-y-10 pt-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-navy/5 to-transparent mb-16" />
          
          <button 
            onClick={() => navigate('/app/change-password')}
            className="w-full flex items-center justify-between p-12 bg-white rounded-[72px] border border-navy/5 group active:scale-[0.98] transition-all hover:bg-gold/[0.02] hover:border-gold/30 shadow-3xl shadow-black/[0.01] hover:shadow-3xl"
          >
            <div className="flex items-center gap-10">
              <div className="w-18 h-18 rounded-[32px] bg-navy/[0.03] flex items-center justify-center text-navy/10 group-hover:bg-navy group-hover:text-gold transition-all duration-700 shadow-inner group-hover:rotate-6 border border-navy/5">
                <Lock className="w-8 h-8" />
              </div>
              <div className="text-left space-y-2">
                <span className="font-display font-bold text-navy text-[24px] tracking-tighter uppercase group-hover:text-gold transition-colors">Access Credentials</span>
                <p className="text-[11px] font-bold text-navy/30 uppercase tracking-[0.4em]">Master Security Key Rotation</p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-navy/[0.02] flex items-center justify-center text-navy/10 group-hover:bg-gold group-hover:text-navy transition-all duration-700 shadow-sm border border-navy/5 group-hover:rotate-45">
              <ChevronRight className="w-8 h-8" />
            </div>
          </button>

          <button 
            onClick={() => navigate('/app/delete-account')}
            className="w-full flex items-center justify-between p-12 bg-white rounded-[72px] border border-navy/5 group active:scale-[0.98] transition-all hover:bg-red-500/[0.02] hover:border-red-500/30 shadow-3xl shadow-black/[0.01] hover:shadow-3xl"
          >
            <div className="flex items-center gap-10">
              <div className="w-18 h-18 rounded-[32px] bg-red-500/5 flex items-center justify-center text-red-500/10 group-hover:bg-red-500 group-hover:text-white transition-all duration-700 shadow-inner border border-red-500/5">
                <Trash2 className="w-8 h-8" />
              </div>
              <div className="text-left space-y-2">
                <span className="font-display font-bold text-navy text-[24px] tracking-tighter uppercase group-hover:text-red-500 transition-colors">Node Deletion</span>
                <p className="text-[11px] font-bold text-navy/30 uppercase tracking-[0.4em]">Permanent Termination Sequence</p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-navy/[0.02] flex items-center justify-center text-navy/10 group-hover:bg-red-500 group-hover:text-white transition-all duration-700 shadow-sm border border-navy/5 group-hover:-rotate-45">
              <ChevronRight className="w-8 h-8" />
            </div>
          </button>
        </section>

        {/* Persistence Module */}
        <div className="fixed bottom-0 left-0 right-0 p-12 bg-white/95 backdrop-blur-3xl border-t border-navy/5 z-50 rounded-t-[84px] shadow-[0_-30px_90px_-20px_rgba(0,0,0,0.15)] border-t border-white shadow-inner">
          <div className="max-w-[540px] mx-auto">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-24 rounded-[42px] bg-navy text-gold font-bold text-[20px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/60 active:scale-95 transition-all hover:bg-navy/95 group relative overflow-hidden active:shadow-inner"
            >
              <span className="relative z-10">{isSaving ? <Loader2 className="w-10 h-10 animate-spin" /> : 'Commit Identity Sync'}</span>
              <div className="absolute inset-0 bg-gold/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out" />
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
