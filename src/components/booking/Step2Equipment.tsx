import React from 'react';
import { motion } from 'motion/react';
import { useBookingStore, ACBrand, ACType, ACCapacity } from '@/store/useBookingStore';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Monitor, 
  Layout, 
  Grid, 
  Box, 
  Plus, 
  Minus,
  Check
} from 'lucide-react';

const BRANDS: ACBrand[] = ['Samsung', 'LG', 'Daikin', 'Voltas', 'Blue Star', 'Mitsubishi', 'Lloyd', 'Other'];
const TYPES: { id: ACType; icon: any; label: string }[] = [
  { id: 'Split', icon: Monitor, label: 'Split AC' },
  { id: 'Window', icon: Layout, label: 'Window AC' },
  { id: 'Cassette', icon: Grid, label: 'Cassette' },
  { id: 'Centralized', icon: Box, label: 'Centralized' },
];
const CAPACITIES: ACCapacity[] = ['1T', '1.5T', '2T', '3T+'];

export default function Step2Equipment() {
  const { equipment, updateEquipment } = useBookingStore();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">Equipment Details</h2>
        <p className="text-navy/60 text-sm">Tell us about your AC unit for better dispatch.</p>
      </div>

      {/* Brand Selection */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Select Brand</h3>
        <div className="grid grid-cols-4 gap-3">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => updateEquipment({ brand })}
              className={cn(
                "p-3 rounded-xl border text-[10px] font-bold transition-all",
                equipment.brand === brand 
                  ? "border-gold bg-gold/5 text-navy" 
                  : "border-navy/5 bg-white text-navy/40 hover:border-navy/10"
              )}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      {/* AC Type */}
      <section>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">AC Type</h3>
        <div className="grid grid-cols-2 gap-4">
          {TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => updateEquipment({ type: type.id })}
              className={cn(
                "p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                equipment.type === type.id 
                  ? "border-gold bg-gold/5 text-navy" 
                  : "border-navy/5 bg-white text-navy/40 hover:border-navy/10"
              )}
            >
              <type.icon className={cn("w-8 h-8", equipment.type === type.id ? "text-gold" : "text-navy/20")} />
              <span className="text-xs font-bold">{type.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Capacity & Units */}
      <div className="grid grid-cols-2 gap-8">
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Capacity</h3>
          <div className="flex flex-wrap gap-2">
            {CAPACITIES.map((cap) => (
              <button
                key={cap}
                onClick={() => updateEquipment({ capacity: cap })}
                className={cn(
                  "px-4 py-2 rounded-full border text-xs font-bold transition-all",
                  equipment.capacity === cap 
                    ? "border-gold bg-gold text-navy" 
                    : "border-navy/5 bg-white text-navy/40 hover:border-navy/10"
                )}
              >
                {cap}
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
      </div>
    </div>
  );
}
