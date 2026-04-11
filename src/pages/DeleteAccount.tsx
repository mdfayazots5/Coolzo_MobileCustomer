import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText !== 'DELETE') return;
    toast.error('Account deleted successfully');
    logout();
    navigate('/auth-gate');
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
        <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center text-red-500 mx-auto mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-display font-bold text-navy">Are you absolutely sure?</h2>
          <p className="text-navy/60 text-sm leading-relaxed">
            This action is permanent. Your booking history, AMC data, and invoices will be archived for 7 years per legal requirements, but your personal data will be anonymised.
          </p>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-3xl p-6 space-y-4">
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest text-center">Type 'DELETE' to confirm</p>
          <input 
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full h-14 px-5 bg-white border border-red-200 rounded-2xl text-center font-bold text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>

        <div className="space-y-3">
          <Button 
            disabled={confirmText !== 'DELETE'}
            onClick={handleDelete}
            className="w-full h-16 rounded-[24px] bg-red-500 text-white font-bold text-lg shadow-xl shadow-red-500/20 disabled:opacity-30"
          >
            Delete My Account
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full h-14 rounded-2xl text-navy/40 font-bold"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
