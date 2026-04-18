import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Plus, 
  ChevronRight, 
  Calendar, 
  Settings, 
  Trash2, 
  Edit3,
  Monitor,
  Wind,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EquipmentService, Equipment } from '@/services/equipmentService';
import EmptyState from '@/components/EmptyState';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function EquipmentList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!user) return;
      try {
        const data = await EquipmentService.getEquipment(user.uid);
        setEquipment(data);
      } catch (error) {
        console.error('Failed to fetch equipment:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEquipment();
  }, [user]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await EquipmentService.deleteEquipment(user.uid, id);
      setEquipment(prev => prev.filter(eq => eq.id !== id));
      toast.success('Artifact decommissioned from registry');
    } catch (error) {
       console.error('Decommissioning failure:', error);
      toast.error('Decommissioning sequence failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center italic">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 animate-pulse">Scanning Grid...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden italic">
      {/* Asset Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[140px] -ml-40 -mb-20 pointer-events-none" />

      {/* Institutional Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center justify-between relative z-10 mb-12">
          <button 
            onClick={() => navigate('/app')}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          <Button 
            onClick={() => navigate('/app/add-edit-equipment')}
            className="w-18 h-18 rounded-[32px] bg-gold text-navy shadow-[0_20px_50px_-15px_rgba(201,162,74,0.4)] flex items-center justify-center p-0 active:scale-90 transition-all hover:bg-gold/90 group"
          >
            <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform duration-700" />
          </Button>
        </div>
        
        <div className="relative z-10 space-y-4">
          <h1 className="text-[44px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Asset Registry</h1>
          <p className="text-warm-white/30 text-[12px] font-bold uppercase tracking-[0.5em] leading-none">Climate Control Artifact Inventory</p>
        </div>
        
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
        <Wind className="absolute -left-20 -bottom-20 w-[420px] h-[420px] text-warm-white/[0.02] -rotate-12 pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-12 pb-40 relative z-30">
        {/* Registry Metrics */}
        <div className="flex items-center justify-between px-6">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20">Operational Units</h3>
          <span className="text-[10px] font-bold text-gold/60 uppercase tracking-[0.4em] bg-gold/5 px-6 py-2.5 rounded-full border border-gold/10">Inventory Size: {equipment.length}</span>
        </div>

        <div className="space-y-10">
          {equipment.length === 0 ? (
            <div className="py-32">
              <EmptyState 
                title="Registry Nullified"
                description="Zero assets detected within current archival grid. Initialize your first artifact to enable institutional predictive telemetry."
                actionLabel="Initialize Artifact"
                onAction={() => navigate('/app/add-edit-equipment')}
              />
            </div>
          ) : (
            equipment.map((eq, idx) => (
              <motion.div
                key={eq.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.1 } }}
                className="bg-white rounded-[72px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.01] group active:scale-[0.99] transition-all hover:border-gold/30 hover:shadow-3xl relative overflow-hidden"
                onClick={() => navigate(`/app/equipment-detail/${eq.id}`)}
              >
                <div className="flex items-start justify-between mb-16 relative z-10">
                  <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-[32px] bg-navy text-gold flex items-center justify-center shadow-3xl shadow-navy/20 group-hover:rotate-6 transition-transform duration-700">
                      <Wind className="w-10 h-10" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-display font-bold text-navy text-[32px] tracking-tighter leading-none uppercase group-hover:text-gold transition-colors truncate max-w-[200px]">{eq.name}</h3>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-gold/10 text-gold border-none font-bold text-[10px] uppercase tracking-[0.4em] px-5 py-2 rounded-full">{eq.type} Protocol</Badge>
                        <span className="text-[11px] font-bold tracking-[0.3em] text-navy/20 uppercase">{eq.brand}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/add-edit-equipment/${eq.id}`);
                      }}
                      className="w-16 h-16 rounded-[24px] bg-navy/[0.03] flex items-center justify-center text-navy/10 hover:text-navy hover:bg-navy/10 transition-all active:scale-95 shadow-inner border border-navy/5"
                    >
                      <Edit3 className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, eq.id)}
                      className="w-16 h-16 rounded-[24px] bg-red-500/5 flex items-center justify-center text-red-500/10 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95 shadow-inner border border-red-500/5"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-16 relative z-10">
                  <div className="bg-navy/[0.02] rounded-[42px] p-10 border border-navy/5 backdrop-blur-xl group-hover:border-gold/20 transition-all shadow-inner group-hover:shadow-3xl group-hover:shadow-black/[0.02]">
                    <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 mb-4">Deployment Sector</p>
                    <p className="text-[20px] font-bold text-navy tracking-tight truncate uppercase italic">{eq.location}</p>
                  </div>
                  <div className="bg-navy/[0.02] rounded-[42px] p-10 border border-navy/5 backdrop-blur-xl group-hover:border-gold/20 transition-all shadow-inner group-hover:shadow-3xl group-hover:shadow-black/[0.02]">
                    <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 mb-4">Energy capacity</p>
                    <div className="flex items-baseline gap-2">
                       <p className="text-[40px] font-display font-bold text-gold tracking-tighter leading-none italic">{eq.capacity}</p>
                       <p className="text-[12px] font-bold text-navy/40 uppercase tracking-[0.2em]">Tonnage</p>
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-dashed border-navy/10 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-[18px] bg-navy/5 flex items-center justify-center shadow-inner group-hover:bg-navy group-hover:text-gold transition-colors duration-700">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/20">Init. Registry</p>
                      <p className="text-[15px] font-bold uppercase tracking-[0.2em] text-navy/40 italic">{eq.purchaseDate || 'Temporal Gap'}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="h-16 px-10 rounded-[32px] text-gold font-bold text-[13px] uppercase tracking-[0.4em] gap-6 active:scale-95 transition-all bg-gold/5 hover:bg-gold hover:text-navy border border-gold/10 shadow-3xl shadow-gold/5"
                  >
                    Analyze Telemetry <ChevronRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                  </Button>
                </div>
                
                <div className="absolute right-0 top-0 w-64 h-64 bg-gold/[0.01] rounded-bl-[160px] pointer-events-none group-hover:bg-gold/[0.03] transition-colors duration-1000" />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
