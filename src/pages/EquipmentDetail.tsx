import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Wind, History, Settings, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const history = [
    { date: '12 Jan 2026', type: 'Deep Cleaning', tech: 'Rahul S.' },
    { date: '15 Aug 2025', type: 'Gas Refill', tech: 'Amit K.' },
    { date: '10 Mar 2025', type: 'Installation', tech: 'Coolzo Team' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-border sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-bold text-navy">Equipment Info</h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy/40">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Hero Card */}
        <div className="bg-white rounded-[40px] p-8 border border-border shadow-sm text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-[32px] bg-navy/5 flex items-center justify-center text-navy/20 mx-auto mb-6">
            <Wind className="w-10 h-10" />
          </div>
          <Badge className="bg-green-50 text-green-600 border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1 mb-4">
            Healthy
          </Badge>
          <h2 className="text-2xl font-display font-bold text-navy mb-1">Living Room AC</h2>
          <p className="text-xs text-text-secondary font-medium">Samsung 1.5 Ton • Split Inverter</p>
          
          <div className="mt-8 grid grid-cols-2 gap-4 pt-8 border-t border-navy/5">
            <div className="text-left">
              <p className="text-[8px] font-bold uppercase tracking-widest text-text-secondary mb-1">Last Service</p>
              <p className="text-sm font-bold text-navy">12 Jan 2026</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-bold uppercase tracking-widest text-text-secondary mb-1">Next Due</p>
              <p className="text-sm font-bold text-gold">12 Jul 2026</p>
            </div>
          </div>
        </div>

        {/* AMC Status */}
        <div className="bg-navy rounded-[32px] p-6 text-warm-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-warm-white/40">AMC Protection</p>
              <p className="text-sm font-bold text-gold">Active until Jan 2027</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-warm-white/20" />
        </div>

        {/* History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Service History</h3>
            <History className="w-4 h-4 text-navy/10" />
          </div>
          <div className="space-y-3">
            {history.map((h, i) => (
              <div key={i} className="bg-white p-5 rounded-[28px] border border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">{h.type}</p>
                    <p className="text-[10px] text-text-secondary">by {h.tech}</p>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-navy/20 uppercase tracking-widest">{h.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-border z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={() => navigate('/book')}
              className="w-full h-16 rounded-[24px] bg-gold text-navy font-bold text-lg shadow-xl shadow-gold/20"
            >
              Book Maintenance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
