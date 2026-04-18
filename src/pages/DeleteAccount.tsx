import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthService } from '@/services/authService';
import { toast } from 'sonner';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE' || !user) return;
    
    setIsDeleting(true);
    try {
      await AuthService.deleteAccount(user.uid);
      toast.success('Account deleted successfully');
      logout();
      navigate('/auth-gate');
    } catch (error) {
      toast.error('Failed to delete account. Please try again.');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Delete Account</h1>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center text-red-500 mx-auto mb-6 shadow-sm border border-red-100">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-[20px] font-display font-bold text-navy">Are you sure?</h2>
          <p className="text-navy/60 text-[13px] leading-relaxed font-medium max-w-[280px] mx-auto">
            This action is permanent. Your data will be anonymised per legal requirements.
          </p>
        </div>

        <div className="bg-red-50/50 border border-red-100 rounded-xl p-6 space-y-4">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center">Type 'DELETE' to confirm</p>
          <input 
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full h-12 px-5 bg-white border border-red-200 rounded-lg text-center font-bold text-red-600 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-red-100 placeholder:tracking-widest"
          />
        </div>

        <div className="space-y-3 pt-4">
          <Button 
            disabled={confirmText !== 'DELETE' || isDeleting}
            onClick={handleDelete}
            className="w-full h-14 rounded-lg bg-red-500 text-white font-bold text-[16px] shadow-xl shadow-red-500/20 disabled:opacity-30"
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete My Account'}
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full h-12 rounded-lg text-navy/40 font-bold uppercase tracking-widest text-[12px]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
