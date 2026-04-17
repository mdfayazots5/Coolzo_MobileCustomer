import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Image as ImageIcon, Wind, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { EquipmentService, Equipment } from '@/services/equipmentService';
import { useAuthStore } from '@/store/useAuthStore';

const AddEditEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(isEdit);

  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
    brand: '',
    type: 'Split',
    capacity: '1.5 Ton',
    location: 'Living Room'
  });

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!id || !user) return;
      try {
        const equipmentList = await EquipmentService.getEquipment(user.uid);
        const eq = equipmentList.find(e => e.id === id);
        if (eq) {
          setFormData(eq);
        }
      } catch (error) {
        console.error('Failed to fetch equipment:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (isEdit) fetchEquipment();
  }, [id, user, isEdit]);

  const handleSave = async () => {
    if (!user) return;
    if (!formData.name || !formData.brand) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await EquipmentService.saveEquipment(user.uid, formData);
      toast.success(isEdit ? 'Equipment updated' : 'Equipment added to your register');
      navigate(-1);
    } catch (error) {
      toast.error('Failed to save equipment');
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
      <div className="bg-white px-6 pt-12 pb-6 border-b border-border sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">
            {isEdit ? 'Edit Equipment' : 'Add New AC'}
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Photo Upload */}
        <div className="flex flex-col items-center justify-center py-10 bg-white rounded-[40px] border border-dashed border-navy/10">
          <div className="w-20 h-20 rounded-[32px] bg-navy/5 flex items-center justify-center text-navy/20 mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <p className="text-xs font-bold text-navy/40 uppercase tracking-widest">Upload AC Photo</p>
          <p className="text-[10px] text-navy/20 mt-1">Help technicians identify the unit</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">AC Nickname *</label>
            <Input 
              placeholder="e.g. Master Bedroom AC"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="h-14 rounded-2xl border-border bg-white px-5 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Brand *</label>
              <Input 
                placeholder="e.g. Daikin"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="h-14 rounded-2xl border-border bg-white px-5 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full h-14 rounded-2xl border border-border bg-white px-5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option>Split</option>
                <option>Window</option>
                <option>Cassette</option>
                <option>Tower</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Tonnage</label>
              <select 
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                className="w-full h-14 rounded-2xl border border-border bg-white px-5 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option>1.0 Ton</option>
                <option>1.5 Ton</option>
                <option>2.0 Ton</option>
                <option>3.0 Ton+</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Room/Location</label>
              <Input 
                placeholder="e.g. Guest Room"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="h-14 rounded-2xl border-border bg-white px-5 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-navy/5 rounded-3xl p-6 flex gap-4">
          <Info className="w-5 h-5 text-navy/40 shrink-0" />
          <p className="text-[10px] text-navy/60 leading-relaxed font-medium">
            Adding your equipment helps us maintain a digital health record and send timely maintenance reminders.
          </p>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-border z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={handleSave}
              className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-card"
            >
              {isEdit ? 'Save Changes' : 'Add to Register'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditEquipment;
