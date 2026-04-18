import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  Plus, 
  MoreVertical, 
  Home, 
  Briefcase, 
  Navigation,
  CheckCircle2,
  Trash2,
  Edit2,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AddressService, Address } from '@/services/addressService';
import { useAuthStore } from '@/store/useAuthStore';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';

const Addresses = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      try {
        const data = await AddressService.getAddresses(user.uid);
        setAddresses(data);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await AddressService.deleteAddress(user.uid, id);
      setAddresses(prev => prev.filter(a => a.id !== id));
      toast.success('Coordinate purged from registry');
    } catch (error) {
      toast.error('Purge sequence failure');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    try {
      const addr = addresses.find(a => a.id === id);
      if (!addr) return;
      
      const updates = addresses.map(a => 
        AddressService.saveAddress(user.uid, { ...a, isDefault: a.id === id })
      );
      await Promise.all(updates);
      
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
      toast.success('Primary vector re-aligned');
    } catch (error) {
      toast.error('Vector alignment failure');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center italic">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 animate-pulse">Syncing Matrix...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden italic">
      {/* Geolocation Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[140px] -ml-40 -mb-20 pointer-events-none" />

      {/* Institutional Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center justify-between relative z-10 mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <Button 
            onClick={() => navigate('/app/addresses/new')}
            className="w-18 h-18 rounded-[32px] bg-gold text-navy shadow-[0_20px_50px_-15px_rgba(201,162,74,0.4)] flex items-center justify-center p-0 active:scale-90 transition-all hover:bg-gold/90 group"
          >
            <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform duration-700" />
          </Button>
        </div>
        
        <div className="relative z-10 space-y-4">
          <h1 className="text-[44px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Geolocation Matrix</h1>
          <p className="text-warm-white/30 text-[12px] font-bold uppercase tracking-[0.5em] leading-none">Stored Sector Command Points</p>
        </div>
        
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
        <Navigation className="absolute -left-20 -bottom-20 w-[420px] h-[420px] text-warm-white/[0.02] -rotate-12 pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-12 pb-40 relative z-30">
        {/* Registry Metrics */}
        <div className="flex items-center justify-between px-6">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20">Archived Sectors</h3>
          <span className="text-[10px] font-bold text-gold/60 uppercase tracking-[0.4em] bg-gold/5 px-6 py-2.5 rounded-full border border-gold/10">Active Nodes: {addresses.length}</span>
        </div>

        <div className="space-y-10">
          {addresses.map((addr, index) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "bg-white rounded-[72px] p-12 border transition-all relative overflow-hidden group active:scale-[0.98] shadow-3xl shadow-black/[0.01] hover:shadow-3xl",
                addr.isDefault ? "border-gold/30 shadow-gold/[0.02]" : "border-navy/5"
              )}
            >
              {addr.isDefault && (
                <div className="absolute top-0 right-0 bg-gold text-navy text-[10px] font-bold uppercase tracking-[0.3em] px-8 py-3 rounded-bl-[32px] shadow-2xl z-20">
                  Primary Vector
                </div>
              )}

              <div className="flex items-start gap-10 mb-16 relative z-10">
                <div className={cn(
                  "w-20 h-20 rounded-[32px] flex items-center justify-center shrink-0 shadow-3xl group-hover:scale-110 transition-transform duration-700",
                  addr.type === 'Home' ? "bg-blue-500/10 text-blue-500 shadow-blue-500/10" :
                  addr.type === 'Office' ? "bg-purple-500/10 text-purple-500 shadow-purple-500/10" :
                  "bg-orange-500/10 text-orange-500 shadow-orange-500/10"
                )}>
                  {addr.type === 'Home' ? <Home className="w-10 h-10" /> :
                   addr.type === 'Office' ? <Briefcase className="w-10 h-10" /> :
                   <Navigation className="w-10 h-10" />}
                </div>
                <div className="flex-1 pr-12 space-y-3">
                  <h3 className="font-display font-bold text-navy text-[28px] tracking-tighter leading-none uppercase group-hover:text-gold transition-colors">{addr.label}</h3>
                  <p className="text-navy/40 text-[14px] font-bold uppercase tracking-[0.1em] leading-relaxed max-w-[280px]">
                    {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                    {addr.city} - {addr.pinCode}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-12 border-t border-dashed border-navy/10 relative z-10">
                {!addr.isDefault && (
                  <Button 
                    variant="ghost" 
                    className="flex-[2] text-navy/20 font-bold h-18 rounded-[28px] hover:bg-gold hover:text-navy transition-all text-[12px] uppercase tracking-[0.3em] border border-navy/5"
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    Align as Primary
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  className="flex-1 text-navy/20 font-bold h-18 rounded-[28px] hover:bg-navy hover:text-gold transition-all gap-4 text-[12px] uppercase tracking-[0.3em] border border-navy/5"
                  onClick={() => navigate(`/app/addresses/edit/${addr.id}`)}
                >
                  <Edit2 className="w-5 h-5" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-18 h-18 p-0 text-red-300 hover:text-white hover:bg-red-500 rounded-[24px] transition-all border border-navy/5 active:scale-90"
                  onClick={() => handleDelete(addr.id)}
                >
                  <Trash2 className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="absolute top-0 right-0 w-48 h-48 bg-navy/[0.01] rounded-bl-full pointer-events-none group-hover:bg-navy/[0.03] transition-colors duration-1000" />
            </motion.div>
          ))}

          {addresses.length === 0 && (
            <div className="py-32">
              <EmptyState 
                title="Sectors Nullified"
                description="Zero geolocations detected within current registry. Map your primary service points for high-priority dispatch."
                actionLabel="Log New Vector"
                onAction={() => navigate('/app/addresses/new')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Addresses;
