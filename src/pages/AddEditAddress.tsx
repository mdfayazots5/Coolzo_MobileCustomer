import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, Navigation, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AddEditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    label: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Gurugram',
    pinCode: '',
    isDefault: false
  });

  const handleSave = async () => {
    if (!formData.label || !formData.addressLine1 || !formData.pinCode) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(isEdit ? 'Address updated' : 'Address added successfully');
    navigate(-1);
  };

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
            {isEdit ? 'Edit Address' : 'Add New Address'}
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Map Placeholder */}
        <div className="bg-navy/5 rounded-[40px] h-48 flex flex-col items-center justify-center border border-navy/5 relative overflow-hidden">
          <MapPin className="w-10 h-10 text-navy/10 mb-2" />
          <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Select on Map</p>
          <Button 
            size="sm" 
            className="mt-4 bg-white text-navy font-bold rounded-xl h-10 px-6 shadow-sm"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Locate Me
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Address Label *</label>
            <div className="flex gap-3">
              {['Home', 'Office', 'Other'].map((l) => (
                <button
                  key={l}
                  onClick={() => setFormData({...formData, label: l})}
                  className={cn(
                    "flex-1 h-12 rounded-xl border font-bold text-xs transition-all",
                    formData.label === l ? "bg-navy border-navy text-gold" : "bg-white border-border text-navy/40"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Flat / House / Office No. *</label>
            <Input 
              placeholder="e.g. Apartment 402, Block B"
              value={formData.addressLine1}
              onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
              className="h-14 rounded-2xl border-border bg-white px-5 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Street / Area / Landmark</label>
            <Input 
              placeholder="e.g. Cyber City, Near Metro Station"
              value={formData.addressLine2}
              onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
              className="h-14 rounded-2xl border-border bg-white px-5 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">City</label>
              <Input 
                value={formData.city}
                disabled
                className="h-14 rounded-2xl border-border bg-navy/5 px-5 font-medium opacity-60"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Pin Code *</label>
              <Input 
                placeholder="122002"
                type="number"
                value={formData.pinCode}
                onChange={(e) => setFormData({...formData, pinCode: e.target.value})}
                className="h-14 rounded-2xl border-border bg-white px-5 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="default-addr"
              checked={formData.isDefault}
              onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
              className="w-5 h-5 rounded border-border text-gold focus:ring-gold"
            />
            <label htmlFor="default-addr" className="text-xs font-bold text-navy/60">Set as default address</label>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-border z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={handleSave}
              className="w-full h-16 rounded-[24px] bg-navy text-gold font-bold text-lg shadow-card"
            >
              {isEdit ? 'Update Address' : 'Save Address'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
export default AddEditAddress;
