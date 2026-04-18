import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Wind, History, Settings, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const history = [
    { date: '12 Jan 2026', type: 'Deep Sanitization', tech: 'Rahul S.', status: 'Verified' },
    { date: '15 Aug 2025', type: 'Technical Refill', tech: 'Amit K.', status: 'Verified' },
    { date: '10 Mar 2025', type: 'Initial Integration', tech: 'Coolzo Elite', status: 'Verified' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Header */}
      <div className="px-6 pt-12 pb-16 bg-navy text-warm-white rounded-b-[48px] relative overflow-hidden shadow-2xl shadow-navy/30">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-[28px] font-display font-bold text-gold tracking-tight leading-none mb-3">Asset Registry</h1>
              <p className="text-warm-white/40 text-[12px] font-bold uppercase tracking-[0.2em]">Artifact Telemetry • #{id?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-gold active:rotate-90 transition-transform">
            <Settings className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="p-6 py-10 space-y-12 pb-32">
        {/* Hero Card */}
        <div className="bg-white rounded-[48px] p-12 border border-navy/5 shadow-2xl shadow-black/[0.01] text-center relative overflow-hidden active:scale-[0.99] transition-transform">
          <div className="w-20 h-20 rounded-[28px] bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/20 mx-auto mb-8 shadow-inner">
            <Wind className="w-10 h-10" />
          </div>
          <Badge className="bg-green-500/10 text-green-600 border border-green-500/10 font-bold text-[10px] uppercase tracking-[0.3em] px-6 py-2 mb-6 rounded-full shadow-lg">
            Optimal Health 
          </Badge>
          <div className="mb-10">
            <h2 className="text-[32px] font-display font-bold text-navy tracking-tighter leading-none mb-4 uppercase">Living Room Master</h2>
            <p className="text-[11px] text-navy/30 font-bold uppercase tracking-[0.4em]">Samsung 1.5 Ton • Elite Inverter</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-10 border-t border-dashed border-navy/10">
            <div className="text-left space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/20">Last Interaction</p>
              <p className="text-[16px] font-bold text-navy tracking-tight">12 Jan 2026</p>
            </div>
            <div className="text-right space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/20">Next Protocol</p>
              <p className="text-[16px] font-bold text-gold tracking-tight">12 Jul 2026</p>
            </div>
          </div>
          <div className="absolute left-0 top-0 w-32 h-32 bg-navy/[0.01] rounded-br-[120px]" />
        </div>

        {/* AMC Status */}
        <div className="bg-navy rounded-[40px] p-10 text-warm-white flex items-center justify-between shadow-2xl shadow-navy/40 relative overflow-hidden group active:scale-[0.98] transition-all" onClick={() => navigate('/app/amc-plans')}>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shadow-lg group-hover:bg-gold group-hover:text-navy transition-all duration-500">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-warm-white/30 mb-1">Contract Protection</p>
              <p className="text-[17px] font-bold text-gold tracking-tight leading-none">Active through Jan 2027</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-gold relative z-10" />
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gold/5 rounded-full blur-2xl" />
        </div>

        {/* History */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="space-y-1">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.35em] text-navy/30">Engagement Archive</h3>
              <p className="text-[9px] font-bold text-gold/60 uppercase tracking-widest">Procedural History</p>
            </div>
            <History className="w-5 h-5 text-navy/10" />
          </div>
          <div className="space-y-5">
            {history.map((h, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-navy/5 flex items-center justify-between shadow-2xl shadow-black/[0.01] hover:border-gold/30 transition-all group active:scale-[0.99]">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-[18px] bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/20 group-hover:bg-navy group-hover:text-gold transition-all duration-500">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-navy tracking-tight leading-none mb-2 group-hover:text-navy transition-colors">{h.type}</h4>
                    <p className="text-[10px] text-navy/30 font-bold uppercase tracking-[0.2em]">Deployment by {h.tech}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] mb-1">{h.date}</p>
                  <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Verified</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/95 backdrop-blur-2xl border-t border-navy/5 z-50 rounded-t-[40px] shadow-2xl">
          <div className="max-w-[440px] mx-auto min-h-[72px] flex items-center">
            <Button 
              onClick={() => navigate('/app/book')}
              className="w-full h-18 rounded-[24px] bg-navy text-gold hover:bg-navy/95 font-bold text-[16px] uppercase tracking-[0.25em] shadow-2xl shadow-navy/40 active:scale-95 transition-all"
            >
              Initialize Maintenance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
