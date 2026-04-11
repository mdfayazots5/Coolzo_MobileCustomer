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
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    try {
      const addr = addresses.find(a => a.id === id);
      if (!addr) return;
      
      // Reset all to false, set this to true
      const updates = addresses.map(a => 
        AddressService.saveAddress(user.uid, { ...a, isDefault: a.id === id })
      );
      await Promise.all(updates);
      
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
      toast.success('Default address updated');
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-bold text-navy">My Addresses</h1>
          </div>
          <Button 
            size="sm" 
            className="bg-gold text-navy rounded-xl font-bold h-10 px-4 gap-2"
            onClick={() => navigate('/app/addresses/new')}
          >
            <Plus className="w-4 h-4" />
            Add New
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4 pb-20">
        {addresses.map((addr) => (
          <motion.div
            key={addr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "bg-white rounded-[32px] p-6 border transition-all relative overflow-hidden group",
              addr.isDefault ? "border-gold shadow-lg shadow-gold/5" : "border-navy/5 shadow-sm"
            )}
          >
            {addr.isDefault && (
              <div className="absolute top-0 right-0 bg-gold text-navy text-[8px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                Default
              </div>
            )}

            <div className="flex items-start gap-4 mb-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                addr.type === 'Home' ? "bg-blue-50 text-blue-500" :
                addr.type === 'Office' ? "bg-purple-50 text-purple-500" :
                "bg-orange-50 text-orange-500"
              )}>
                {addr.type === 'Home' ? <Home className="w-6 h-6" /> :
                 addr.type === 'Office' ? <Briefcase className="w-6 h-6" /> :
                 <Navigation className="w-6 h-6" />}
              </div>
              <div className="flex-1 pr-8">
                <h3 className="font-bold text-navy text-lg mb-1">{addr.label}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">
                  {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                  {addr.city} - {addr.pinCode}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-navy/5">
              {!addr.isDefault && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 text-navy/40 font-bold h-10 rounded-xl hover:bg-navy/5"
                  onClick={() => handleSetDefault(addr.id)}
                >
                  Set Default
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-navy/40 font-bold h-10 rounded-xl hover:bg-navy/5 gap-2"
                onClick={() => navigate(`/app/addresses/edit/${addr.id}`)}
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-10 h-10 p-0 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl"
                onClick={() => handleDelete(addr.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}

        {addresses.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-navy/10" />
            </div>
            <h3 className="text-lg font-display font-bold text-navy mb-2">No Saved Addresses</h3>
            <p className="text-navy/40 text-sm">Add your service locations for faster bookings.</p>
            <Button 
              className="mt-8 bg-gold text-navy font-bold rounded-2xl h-14 px-8"
              onClick={() => navigate('/app/addresses/new')}
            >
              Add New Address
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
