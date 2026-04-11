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
import { EquipmentService, Equipment } from '@/services/equipmentService';
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
      toast.success('Equipment deleted');
    } catch (error) {
      toast.error('Failed to delete equipment');
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
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="px-6 py-8 bg-navy text-warm-white rounded-b-[40px] relative overflow-hidden">
        <button 
          onClick={() => navigate('/app')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <h1 className="text-3xl font-display font-bold text-gold mb-2">My Equipment</h1>
        <p className="text-warm-white/60 text-sm max-w-xs">
          Manage all your registered AC units and their service history.
        </p>

        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
      </div>

      {/* List */}
      <div className="px-6 py-8 space-y-4">
        {equipment.map((eq) => (
          <motion.div
            key={eq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm group active:scale-[0.98] transition-transform"
            onClick={() => navigate(`/equipment-detail/${eq.id}`)}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/40 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
                  <Monitor className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-lg">{eq.brand} {eq.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-navy/40 bg-navy/5 px-2 py-0.5 rounded-full">
                      {eq.type}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                      {eq.capacity}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/add-edit-equipment/${eq.id}`);
                  }}
                  className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/20 hover:text-navy transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => handleDelete(e, eq.id)}
                  className="w-10 h-10 rounded-xl bg-red-500/5 flex items-center justify-center text-red-500/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-navy/5 rounded-2xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Location</p>
                <p className="text-xs font-bold text-navy">{eq.location}</p>
              </div>
              <div className="bg-navy/5 rounded-2xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Last Service</p>
                <p className="text-xs font-bold text-navy">{eq.lastServiceDate}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-navy/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-navy/40">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Purchased {eq.purchaseDate || 'N/A'}</span>
              </div>
              <Button 
                variant="ghost" 
                className="h-10 px-4 rounded-xl text-gold font-bold text-xs gap-1 group-hover:translate-x-1 transition-transform"
              >
                Full History <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAB */}
      <div className="fixed bottom-10 right-6 z-50">
        <Button 
          onClick={() => navigate('/add-edit-equipment')}
          className="w-16 h-16 rounded-full bg-navy text-gold shadow-2xl shadow-navy/40 flex items-center justify-center p-0 active:scale-90 transition-transform"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}
