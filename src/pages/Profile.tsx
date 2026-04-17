import { AuthService } from '@/services/authService';
import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const updatedData = {
        name,
        phone,
      };
      
      await AuthService.updateProfile(user.uid, updatedData);
      
      setUser({ ...user, ...updatedData });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">My Profile</h1>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-20">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-[40px] bg-gold/10 border-4 border-white shadow-xl overflow-hidden">
              <img src={`https://i.pravatar.cc/300?u=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-navy text-gold flex items-center justify-center shadow-lg border-2 border-white">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mt-6">Member ID: CZ-88291</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/20" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 pl-14 pr-5 bg-white border border-navy/5 rounded-2xl text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/20" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-14 pr-5 bg-white border border-navy/5 rounded-2xl text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/20" />
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-14 pl-14 pr-5 bg-white border border-navy/5 rounded-2xl text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className="space-y-3 pt-4">
          <button 
            onClick={() => navigate('/app/change-password')}
            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-navy/5 group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40 group-hover:text-gold transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <span className="font-bold text-navy text-sm">Change Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-navy/20" />
          </button>

          <button 
            onClick={() => navigate('/app/delete-account')}
            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-navy/5 group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-navy text-sm">Delete Account</span>
            </div>
            <ChevronRight className="w-4 h-4 text-navy/20" />
          </button>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-16 rounded-[24px] bg-gold text-navy font-bold text-lg shadow-xl shadow-gold/20 disabled:opacity-50"
          >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
