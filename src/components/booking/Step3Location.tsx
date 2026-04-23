import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookingService } from '@/services/bookingService';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Map as MapIcon, Check, Home, Briefcase, MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function Step3Location() {
  const navigate = useNavigate();
  const { location, updateLocation } = useBookingStore();
  const { isAuthenticated } = useAuthStore();
  const [zoneStatus, setZoneStatus] = useState<string>('');

  const labels = [
    { id: 'Home', icon: Home },
    { id: 'Office', icon: Briefcase },
    { id: 'Other', icon: MoreHorizontal },
  ] as const;

  useEffect(() => {
    if (location.pinCode.length < 6) {
      setZoneStatus('');
      return;
    }

    void BookingService.lookupZone(location.pinCode)
      .then((zone) => {
        updateLocation({
          city: zone.cityName,
          zoneId: zone.zoneId,
        });
        setZoneStatus(`Service available in ${zone.zoneName}`);
      })
      .catch(() => {
        updateLocation({ zoneId: null });
        setZoneStatus('Selected PIN code is outside the current service zone.');
      });
  }, [location.pinCode, updateLocation]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">Service Location</h2>
        <p className="text-navy/60 text-sm">Where should our technician arrive?</p>
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => navigate('/app/addresses/new')}
            className="mt-3 text-[10px] font-bold uppercase tracking-widest text-gold"
          >
            Add Address To Account
          </button>
        )}
      </div>

      {/* Map Placeholder */}
      <div className="aspect-video w-full bg-navy/5 rounded-[32px] relative overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-navy/10 group">
        <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gold mb-3 group-hover:scale-110 transition-transform">
          <MapPin className="w-6 h-6" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Confirm Location on Map</p>
        <div className="absolute inset-0 bg-gradient-to-t from-navy/5 to-transparent" />
      </div>

      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Address Line 1</Label>
            <Input 
              placeholder="House/Flat No, Building Name" 
              className="h-14 rounded-2xl border-navy/10 bg-white"
              value={location.addressLine1}
              onChange={(e) => updateLocation({ addressLine1: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Address Line 2 (Optional)</Label>
            <Input 
              placeholder="Landmark, Area, Floor" 
              className="h-14 rounded-2xl border-navy/10 bg-white"
              value={location.addressLine2}
              onChange={(e) => updateLocation({ addressLine2: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">City</Label>
              <Input 
                placeholder="Mumbai" 
                className="h-14 rounded-2xl border-navy/10 bg-navy/5 text-navy/40"
                value={location.city}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">PIN Code</Label>
              <div className="relative">
                <Input 
                  placeholder="400001" 
                  className="h-14 rounded-2xl border-navy/10 bg-white pr-10"
                  value={location.pinCode}
                  onChange={(e) => updateLocation({ pinCode: e.target.value })}
                />
                {location.pinCode.length === 6 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Save Address As</h3>
          <div className="flex gap-3">
            {labels.map((label) => (
              <button
                key={label.id}
                onClick={() => updateLocation({ label: label.id })}
                className={cn(
                  "flex-1 p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all",
                  location.label === label.id 
                    ? "border-gold bg-gold/5 text-navy" 
                    : "border-navy/5 bg-white text-navy/40 hover:border-navy/10"
                )}
              >
                <label.icon className={cn("w-5 h-5", location.label === label.id ? "text-gold" : "text-navy/20")} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{label.id}</span>
              </button>
            ))}
          </div>
        </section>

        {zoneStatus ? (
          <div className={cn(
            "rounded-2xl px-4 py-3 text-xs font-bold",
            location.zoneId ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {zoneStatus}
          </div>
        ) : null}

        {isAuthenticated && (
          <div className="flex items-center space-x-3 p-4 bg-navy/5 rounded-2xl">
            <Checkbox 
              id="save-address" 
              checked={location.saveToAccount}
              onCheckedChange={(checked) => updateLocation({ saveToAccount: !!checked })}
              className="border-navy/20 data-[state=checked]:bg-navy data-[state=checked]:border-navy"
            />
            <Label htmlFor="save-address" className="text-xs font-bold text-navy/60 cursor-pointer">
              Save this address to my account for future bookings
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}
