import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Image as ImageIcon, Wind, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { EquipmentService, Equipment, EquipmentBrand, ServiceHistoryItem } from '@/services/equipmentService';
import { AddressService, Address } from '@/services/addressService';
import { useAuthStore } from '@/store/useAuthStore';

const AddEditEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState<EquipmentBrand[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [history, setHistory] = useState<ServiceHistoryItem[]>([]);

  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
    brand: '',
    type: 'Split',
    capacity: '1.5 Ton',
    location: '',
    purchaseDate: '',
    serialNumber: '',
  });

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const [brandOptions, savedAddresses, serviceHistory] = await Promise.all([
          EquipmentService.getBrands(),
          AddressService.getAddresses(user.uid),
          EquipmentService.getServiceHistory(),
        ]);

        setBrands(brandOptions);
        setAddresses(savedAddresses);
        setHistory(serviceHistory.slice(0, 5));

        if (id) {
          const equipment = await EquipmentService.getEquipmentById(user.uid, id);
          if (equipment) {
            setFormData(equipment);
          }
        }
      } catch (error) {
        console.error('Failed to load equipment screen data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return;
    if (!formData.name || !formData.brand || !formData.location) {
      toast.error('Identification gap detected. Complete all required fields.');
      return;
    }
    
    try {
      await EquipmentService.saveEquipment(user.uid, formData);
      toast.success(isEdit ? 'Hardware re-aligned in registry' : 'New artifact logged successfully');
      navigate(-1);
    } catch (error) {
      toast.error('Hardware registry failure');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center italic">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 animate-pulse">Scanning Blueprint...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-64 relative overflow-hidden italic">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[140px] -ml-40 pointer-events-none" />

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
              {isEdit ? 'Asset Override' : 'New Registry'}
            </h1>
            <p className="text-warm-white/30 text-[11px] font-bold uppercase tracking-[0.5em] leading-none">Hardware Identification Registry</p>
          </div>
        </div>
        
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
        <Wind className="absolute -left-20 -bottom-20 w-[420px] h-[420px] text-warm-white/[0.02] -rotate-12 pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-16 pb-64 relative z-30">
        <div className="bg-white rounded-[72px] p-12 flex flex-col items-center justify-center border border-navy/5 relative overflow-hidden group shadow-3xl shadow-black/[0.01] hover:border-gold/30 transition-all cursor-pointer bg-gradient-to-b from-white to-navy/[0.01]">
          <div className="w-24 h-24 rounded-[36px] bg-navy/[0.03] flex items-center justify-center text-navy/10 mb-8 shadow-inner group-hover:bg-navy group-hover:text-gold transition-all duration-700 group-hover:rotate-12 border border-navy/5">
            <ImageIcon className="w-10 h-10" />
          </div>
          <p className="text-[12px] font-bold text-navy/40 uppercase tracking-[0.4em] mb-4">Capture Visual Spec</p>
          <p className="text-[10px] text-navy/20 font-bold uppercase tracking-[0.2em]">Helper Identification Protocol</p>
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        <div className="space-y-12">
          <div className="space-y-6">
            <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Model *</label>
            <Input 
              placeholder="e.g. FTKD 1.5T Inverter"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="h-24 rounded-[48px] border-navy/5 bg-white px-10 font-display font-bold text-[20px] focus-visible:ring-gold/30 transition-all shadow-3xl shadow-black/[0.01] uppercase tracking-tighter"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Brand Trace *</label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full h-24 rounded-[48px] border border-navy/5 bg-white px-10 font-display font-bold text-[20px] focus:outline-none focus:ring-4 focus:ring-gold/10 appearance-none shadow-3xl shadow-black/[0.01] text-navy cursor-pointer uppercase tracking-tighter"
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Architecture</label>
              <div className="relative group">
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full h-24 rounded-[48px] border border-navy/5 bg-white px-10 font-display font-bold text-[20px] focus:outline-none focus:ring-4 focus:ring-gold/10 appearance-none shadow-3xl shadow-black/[0.01] text-navy cursor-pointer uppercase tracking-tighter"
                >
                  <option value="Split">Split</option>
                  <option value="Window">Window</option>
                  <option value="Cassette">Cassette</option>
                  <option value="Tower">Tower</option>
                  <option value="Other">Other</option>
                </select>
                <Wind className="absolute right-10 top-1/2 -translate-y-1/2 w-8 h-8 text-navy/10 pointer-events-none group-active:text-gold transition-colors" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Tonnage Capacity</label>
              <select 
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                className="w-full h-24 rounded-[48px] border border-navy/5 bg-white px-10 font-display font-bold text-[20px] focus:outline-none focus:ring-4 focus:ring-gold/10 appearance-none shadow-3xl shadow-black/[0.01] text-navy cursor-pointer uppercase tracking-tighter"
              >
                <option value="1.0 Ton">1.0 Ton</option>
                <option value="1.5 Ton">1.5 Ton</option>
                <option value="2.0 Ton">2.0 Ton</option>
                <option value="3.0 Ton">3.0 Ton</option>
              </select>
            </div>
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Saved Address</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full h-24 rounded-[48px] border border-navy/5 bg-white px-10 font-display font-bold text-[20px] focus:outline-none focus:ring-4 focus:ring-gold/10 appearance-none shadow-3xl shadow-black/[0.01] text-navy cursor-pointer uppercase tracking-tighter"
              >
                <option value="">Select saved address</option>
                {addresses.map((address) => (
                  <option key={address.id} value={`${address.label} • ${address.addressLine1}`}>
                    {address.label} • {address.addressLine1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Installation Date</label>
              <Input 
                type="date"
                value={formData.purchaseDate ?? ''}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="h-24 rounded-[48px] border-navy/5 bg-white px-10 font-display font-bold text-[20px] focus-visible:ring-gold/30 transition-all shadow-3xl shadow-black/[0.01] uppercase tracking-tighter"
              />
            </div>
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-8 italic">Serial Number</label>
              <Input 
                placeholder="e.g. SN-AC-2045"
                value={formData.serialNumber ?? ''}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="h-24 rounded-[48px] border-navy/5 bg-white px-10 font-display font-bold text-[20px] focus-visible:ring-gold/30 transition-all shadow-3xl shadow-black/[0.01] uppercase tracking-tighter"
              />
            </div>
          </div>
        </div>

        <div className="bg-navy rounded-[48px] p-10 flex gap-8 shadow-3xl shadow-navy/60 relative overflow-hidden group border border-white/5">
          <div className="w-16 h-16 rounded-[22px] bg-white/10 flex items-center justify-center text-gold shrink-0 relative z-10 group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-3xl">
            <Info className="w-8 h-8" />
          </div>
          <div className="space-y-2 relative z-10 transition-transform duration-700">
             <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold/40">Audit Protocol Agent</p>
             <p className="text-[13px] text-warm-white/40 leading-relaxed font-bold uppercase tracking-[0.2em] group-hover:text-warm-white transition-colors">
               Systemic records facilitate predictive maintenance and proactive intervention protocols within the operative grid.
             </p>
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {isEdit && history.length > 0 && (
          <div className="bg-white rounded-[48px] p-10 border border-navy/5 shadow-3xl shadow-black/[0.01] space-y-8">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-gold/60">Recent Service History</p>
              <h3 className="text-[24px] font-display font-bold text-navy tracking-tight uppercase">Customer Activity Feed</h3>
            </div>
            <div className="space-y-5">
              {history.map((item) => (
                <div key={item.id} className="rounded-[32px] border border-navy/5 bg-navy/[0.02] p-7 shadow-inner">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-[15px] font-bold text-navy uppercase tracking-tight">{item.title}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/20 mt-2">{item.referenceNumber}</p>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">{item.status}</p>
                  </div>
                  <p className="text-[12px] font-bold text-navy/40 uppercase tracking-[0.2em] mt-4">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-12 bg-white/95 backdrop-blur-3xl border-t border-navy/5 z-50 rounded-t-[84px] shadow-[0_-30px_90px_-20px_rgba(0,0,0,0.15)] border-t border-white shadow-inner">
        <div className="max-w-[540px] mx-auto">
          <Button 
            onClick={handleSave}
            className="w-full h-24 rounded-[42px] bg-navy text-gold font-bold text-[20px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/60 active:scale-95 transition-all hover:bg-navy/95 group relative overflow-hidden active:shadow-inner"
          >
            <span className="relative z-10">{isEdit ? 'Authorize Registry Sync' : 'Commit New Artifact'}</span>
            <div className="absolute inset-y-0 left-0 w-2 bg-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEditEquipment;
