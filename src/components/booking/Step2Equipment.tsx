import React, { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/useBookingStore';
import { cn } from '@/lib/utils';
import { 
  Monitor, 
  Layout, 
  Grid, 
  Box, 
  Plus, 
  Minus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { BookingLookupItem, CatalogService } from '@/services/catalogService';

const getTypeIcon = (label: string) => {
  const value = label.toLowerCase();
  if (value.includes('window')) return Layout;
  if (value.includes('cassette')) return Grid;
  if (value.includes('central')) return Box;
  return Monitor;
};

export default function Step2Equipment() {
  const { equipment, updateEquipment } = useBookingStore();
  const [brands, setBrands] = useState<BookingLookupItem[]>([]);
  const [types, setTypes] = useState<BookingLookupItem[]>([]);
  const [tonnages, setTonnages] = useState<BookingLookupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      CatalogService.getBrands(),
      CatalogService.getAcTypes(),
      CatalogService.getTonnages(),
    ])
      .then(([brandItems, typeItems, tonnageItems]) => {
        if (!isMounted) return;
        setBrands(brandItems);
        setTypes(typeItems);
        setTonnages(tonnageItems);
        setError('');
      })
      .catch((err) => {
        console.error('Failed to load equipment lookups:', err);
        if (isMounted) setError('Equipment options could not be loaded. Please try again.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">Equipment Details</h2>
        <p className="text-navy/60 text-sm">Tell us about your AC unit for better dispatch.</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10 text-gold">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600 flex items-center gap-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Brand Selection */}
      {!isLoading && !error && <section>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Select Brand</h3>
        <div className="grid grid-cols-4 gap-3">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => updateEquipment({ brand: brand.name, brandId: brand.id })}
              className={cn(
                "p-3 rounded-xl border text-[10px] font-bold transition-all",
                equipment.brandId === brand.id || equipment.brand === brand.name
                  ? "border-gold bg-gold/5 text-navy" 
                  : "border-navy/5 bg-white text-navy/40 hover:border-navy/10"
              )}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </section>}

      {/* AC Type */}
      {!isLoading && !error && <section>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">AC Type</h3>
        <div className="grid grid-cols-2 gap-4">
          {types.map((type) => {
            const Icon = getTypeIcon(type.name);
            return (
            <button
              key={type.id}
              onClick={() => updateEquipment({ type: type.name, acTypeId: type.id })}
              className={cn(
                "p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                equipment.acTypeId === type.id || equipment.type === type.name
                  ? "border-gold bg-gold/5 text-navy" 
                  : "border-navy/5 bg-white text-navy/40 hover:border-navy/10"
              )}
            >
              <Icon className={cn("w-8 h-8", equipment.acTypeId === type.id || equipment.type === type.name ? "text-gold" : "text-navy/20")} />
              <span className="text-xs font-bold">{type.name}</span>
            </button>
          )})}
        </div>
      </section>}

      {/* Capacity & Units */}
      {!isLoading && !error && <div className="grid grid-cols-2 gap-8">
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Capacity</h3>
          <div className="flex flex-wrap gap-2">
            {tonnages.map((cap) => (
              <button
                key={cap.id}
                onClick={() => updateEquipment({ capacity: cap.name, tonnageId: cap.id })}
                className={cn(
                  "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                  equipment.tonnageId === cap.id || equipment.capacity === cap.name
                    ? "border-gold bg-gold text-navy" 
                    : "border-navy/5 bg-white text-navy/40 hover:border-navy/10"
                )}
              >
                {cap.name}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2 text-right">Units</h3>
          <div className="flex items-center justify-end gap-4">
            <button 
              onClick={() => updateEquipment({ units: Math.max(1, equipment.units - 1) })}
              className="w-10 h-10 rounded-full border border-navy/10 flex items-center justify-center text-navy/40 hover:bg-navy/5"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-display font-bold text-navy w-6 text-center">{equipment.units}</span>
            <button 
              onClick={() => updateEquipment({ units: equipment.units + 1 })}
              className="w-10 h-10 rounded-full border border-navy/10 flex items-center justify-center text-navy/40 hover:bg-navy/5"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>}
    </div>
  );
}
