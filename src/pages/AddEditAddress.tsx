import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, Navigation, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AddressService, Address } from '@/services/addressService';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const AddEditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isCheckingZone, setIsCheckingZone] = useState(false);
  const [zoneError, setZoneError] = useState('');
  const [zoneLabel, setZoneLabel] = useState('');

  const [formData, setFormData] = useState<Partial<Address>>({
    label: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Gurugram',
    pinCode: '',
    isDefault: false,
    type: 'Home'
  });

  useEffect(() => {
    const fetchAddress = async () => {
      if (!id || !user) return;
      try {
        const addresses = await AddressService.getAddresses(user.uid);
        const addr = addresses.find(a => a.id === id);
        if (addr) {
          setFormData(addr);
        }
      } catch (error) {
        console.error('Failed to fetch address:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isEdit) fetchAddress();
  }, [id, user, isEdit]);

  useEffect(() => {
    let cancelled = false;

    const lookupZone = async () => {
      const pin = formData.pinCode?.trim() ?? '';

      if (pin.length < 6) {
        setZoneError('');
        setZoneLabel('');
        return;
      }

      setIsCheckingZone(true);
      const zone = await AddressService.lookupZone(pin);

      if (cancelled) {
        return;
      }

      if (!zone) {
        setZoneLabel('');
        setZoneError('Selected PIN is currently outside the active service zone.');
        setFormData((current) => ({ ...current, zoneId: null }));
      } else {
        setZoneError('');
        setZoneLabel(`${zone.zoneName} • ${zone.cityName}`);
        setFormData((current) => ({
          ...current,
          city: zone.cityName,
          zoneId: zone.zoneId,
          pinCode: zone.pincode,
        }));
      }

      setIsCheckingZone(false);
    };

    void lookupZone();

    return () => {
      cancelled = true;
    };
  }, [formData.pinCode]);

  const handleSave = async () => {
    if (!user) return;
    if (!formData.label || !formData.addressLine1 || !formData.pinCode) {
      toast.error('Identification gap detected. Complete all required fields.');
      return;
    }

    if (!formData.zoneId) {
      toast.error('Active service zone validation is required before saving this address.');
      return;
    }
    
    try {
      await AddressService.saveAddress(user.uid, formData);
      toast.success(isEdit ? 'Vector re-aligned successfully' : 'Satellite coordinate logged');
      navigate(-1);
    } catch (error) {
      toast.error('Registry save failure');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center italic">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 animate-pulse">Syncing Vector...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-64 relative overflow-hidden italic">
      {/* Geolocation Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[140px] -ml-40 pointer-events-none" />

      {/* Institutional Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center gap-8 relative z-10 transition-all">
          <button 
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition-all shadow-3xl border border-white/5"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="space-y-2">
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase">
              {isEdit ? 'Vector Sync' : 'Coordinate Log'}
            </h1>
            <p className="text-warm-white/30 text-[11px] font-bold uppercase tracking-[0.5em] leading-none">Geolocation Identification Registry</p>
          </div>
        </div>
        
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
        <Navigation className="absolute -left-20 -bottom-20 w-[420px] h-[420px] text-warm-white/[0.02] -rotate-12 pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-16 pb-40 relative z-30">
        {/* Map Telemetry */}
        <div className="bg-white rounded-[72px] p-10 flex flex-col items-center justify-center border border-navy/5 relative overflow-hidden group shadow-3xl shadow-black/[0.01] hover:border-gold/30 transition-all cursor-pointer bg-gradient-to-b from-white to-navy/[0.01]">
          <div className="w-24 h-24 rounded-[36px] bg-navy/[0.03] flex items-center justify-center text-navy/10 mb-8 shadow-inner group-hover:bg-navy group-hover:text-gold transition-all duration-700 group-hover:rotate-12 border border-navy/5">
            <MapPin className="w-10 h-10" />
          </div>
          <p className="text-[12px] font-bold text-navy/40 uppercase tracking-[0.4em] mb-4">Matrix Intersection Select</p>
          <Button 
            className="bg-gold text-navy font-bold rounded-[28px] h-18 px-12 shadow-3xl shadow-gold/20 text-[13px] uppercase tracking-[0.3em] active:scale-95 transition-all hover:bg-gold/90 border border-white/20 group/btn"
          >
            <Navigation className="w-5 h-5 mr-4 group-hover/btn:-rotate-45 transition-transform" />
            Initialize GPS Vector
          </Button>
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        {/* Configuration Matrix */}
        <div className="space-y-12">
          <div className="space-y-6">
            <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Sector Classification *</label>
            <div className="flex gap-4">
              {['Home', 'Office', 'Other'].map((l) => (
                <button
                  key={l}
                  onClick={() => setFormData({...formData, label: l, type: l as any})}
                  className={cn(
                    "flex-1 h-18 rounded-[32px] border font-bold text-[11px] uppercase tracking-[0.4em] transition-all active:scale-95 italic group relative overflow-hidden shadow-lg",
                    formData.label === l 
                      ? "bg-navy border-navy text-gold shadow-3xl shadow-navy/30" 
                      : "bg-white border-navy/5 text-navy/20 hover:border-gold/30 hover:text-navy"
                  )}
                >
                  <span className="relative z-10">{l} Node</span>
                  {formData.label === l && (
                    <motion.div layoutId="addr-label-pill" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Coordinate Line 01 *</label>
            <Input 
              placeholder="e.g. Protocol Apt 402, Block B"
              value={formData.addressLine1}
              onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
              className="h-24 rounded-[48px] border-navy/5 bg-white px-10 font-display font-bold text-[20px] focus-visible:ring-gold/30 transition-all shadow-3xl shadow-black/[0.01] uppercase tracking-tighter"
            />
          </div>

          <div className="space-y-6">
            <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Coordinate Line 02</label>
            <Input 
              placeholder="e.g. Cyber City Sector Matrix"
              value={formData.addressLine2}
              onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
              className="h-24 rounded-[48px] border-navy/5 bg-white px-10 font-display font-bold text-[20px] focus-visible:ring-gold/30 transition-all shadow-3xl shadow-black/[0.01] uppercase tracking-tighter"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Operational City</label>
              <div className="relative group">
                <Input 
                  value={formData.city}
                  disabled
                  className="h-24 rounded-[48px] border-navy/5 bg-navy/[0.04] px-10 font-display font-bold text-[20px] cursor-not-allowed shadow-inner uppercase tracking-tighter"
                />
              </div>
            </div>
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Access PIN *</label>
              <Input 
                placeholder="122002"
                type="number"
                value={formData.pinCode}
                onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
                className="h-24 rounded-[48px] border-navy/5 bg-white px-10 font-display font-bold text-[20px] focus-visible:ring-gold/30 transition-all shadow-3xl shadow-black/[0.01] uppercase tracking-tighter"
              />
              {isCheckingZone && (
                <p className="px-6 text-[10px] font-bold uppercase tracking-[0.4em] text-navy/20">Validating zone availability...</p>
              )}
              {!isCheckingZone && zoneLabel && (
                <p className="px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">{zoneLabel}</p>
              )}
              {!isCheckingZone && zoneError && (
                <p className="px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">{zoneError}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-10 px-6">
            <div className="relative flex items-center group cursor-pointer" onClick={() => setFormData({...formData, isDefault: !formData.isDefault})}>
              <div className={cn(
                "w-12 h-12 rounded-[18px] border-2 transition-all flex items-center justify-center shadow-inner",
                formData.isDefault ? "bg-navy border-navy text-gold" : "bg-white border-navy/10 text-transparent"
              )}>
                <Navigation className="w-6 h-6 rotate-45" />
              </div>
              <label className="text-[13px] font-bold text-navy/30 uppercase tracking-[0.3em] ml-6 cursor-pointer group-hover:text-navy transition-colors italic">Set as Master Sector Point</label>
            </div>
          </div>
        </div>

        {/* Persistence Module */}
        <div className="fixed bottom-0 left-0 right-0 p-12 bg-white/95 backdrop-blur-3xl border-t border-navy/5 z-50 rounded-t-[84px] shadow-[0_-30px_90px_-20px_rgba(0,0,0,0.15)] border-t border-white shadow-inner">
          <div className="max-w-[540px] mx-auto">
            <Button 
              onClick={handleSave}
              className="w-full h-24 rounded-[42px] bg-navy text-gold font-bold text-[20px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/60 active:scale-95 transition-all hover:bg-navy/95 group relative overflow-hidden active:shadow-inner"
            >
              <span className="relative z-10">{isEdit ? 'Authorize Matrix Sync' : 'Commit Vector Change'}</span>
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditAddress;
