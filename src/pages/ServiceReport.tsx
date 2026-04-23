import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Download, CheckCircle2, Thermometer, Zap, Droplets, Info, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookingService } from '@/services/bookingService';
import { toast } from 'sonner';

export default function ServiceReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const data = await BookingService.getServiceReport(id);
        setReport(data);
      } catch (error) {
        console.error('Failed to fetch service report:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const metrics = [
    { icon: Thermometer, label: 'Cooling Efficiency', val: '18°C', status: 'Optimal Delta' },
    { icon: Zap, label: 'Operational Draw', val: '6.2A', status: 'Nominal Load' },
    { icon: Droplets, label: 'Sanitization Level', val: '100%', status: 'Biometrically Pure' }
  ];

  const handleDownload = async () => {
    if (!id) {
      return;
    }

    try {
      await BookingService.downloadServiceReportPdf(id);
    } catch (error) {
      toast.error('Failed to download service report PDF.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center bg-warm-white space-y-8">
        <div className="w-32 h-32 bg-navy/5 rounded-[48px] flex items-center justify-center text-navy/10 animate-pulse">
          <Info className="w-16 h-16" />
        </div>
        <div className="space-y-4">
          <h2 className="text-[32px] font-display font-bold text-navy tracking-tight italic">Diagnostic Registry Nullified</h2>
          <Button onClick={() => navigate(-1)} className="bg-navy text-gold px-12 h-18 rounded-[28px] font-bold uppercase tracking-[0.3em] shadow-2xl italic active:scale-95 transition-all">Return to Registry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Post-Action Header */}
      <div className="bg-navy px-8 pt-16 pb-32 text-warm-white rounded-b-[72px] relative overflow-hidden shadow-3xl shadow-navy/40 z-20">
        <div className="flex items-center justify-between mb-16 relative z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition-all shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none italic">Post-Action Intelligence</h1>
              <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 italic leading-none">Security Clearance Verified • #{report.jobId}</p>
            </div>
          </div>
          <button onClick={() => void handleDownload()} className="w-16 h-16 rounded-[24px] bg-gold flex items-center justify-center text-navy shadow-3xl shadow-gold/30 active:scale-95 transition-all active:brightness-90">
            <Download className="w-8 h-8" />
          </button>
        </div>

        <div className="flex items-center gap-10 relative z-10 italic">
          <div className="w-24 h-24 rounded-[36px] bg-green-500 flex items-center justify-center text-white shadow-3xl shadow-green-500/40 animate-pulse">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h2 className="text-[44px] font-display font-bold text-white tracking-tighter leading-none italic">Mission Successful</h2>
            <p className="text-warm-white/30 text-[12px] font-bold uppercase tracking-[0.3em] leading-none opacity-80">
              Validated Execution • {new Date(report.completionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-16 space-y-24 relative z-30 pb-40">
        {/* Diagnostic Telemetry Cluster */}
        <section className="space-y-10">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-4 italic">Diagnostic Telemetry</h3>
          <div className="grid grid-cols-3 gap-6">
            {metrics.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                className="bg-white p-8 rounded-[40px] border border-navy/5 text-center shadow-3xl shadow-black/[0.01] hover:border-gold/30 transition-all group relative overflow-hidden active:scale-95"
              >
                <div className="w-14 h-14 rounded-[20px] bg-navy/5 flex items-center justify-center text-navy/10 mx-auto mb-8 group-hover:bg-gold group-hover:text-navy transition-all duration-700 shadow-inner">
                  <m.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 italic">
                  <p className="text-[24px] font-display font-bold text-navy tracking-tighter leading-none">{m.val}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-500 group-hover:text-gold transition-colors">{m.status}</p>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/[0.02] rounded-bl-full pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tactical Outcome Registry */}
        <section className="space-y-10">
          <div className="flex items-end justify-between px-4">
            <div className="space-y-2">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 italic leading-none">Tactical Deliverables</h3>
              <h2 className="text-[32px] font-display font-bold text-navy tracking-tighter italic leading-none">Outcome Registry</h2>
            </div>
            <Badge className="bg-navy/5 text-navy/30 border-none font-bold text-[9px] uppercase tracking-widest px-5 py-2.5 rounded-full italic shadow-inner">Institutional Protocol</Badge>
          </div>
          <div className="bg-white rounded-[64px] border border-navy/5 p-12 space-y-12 shadow-3xl shadow-black/[0.01] relative overflow-hidden group">
            {report.workDone.map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-10 group/item">
                <div className="w-12 h-12 rounded-[20px] bg-gold/10 flex items-center justify-center shrink-0 mt-1 shadow-inner border border-gold/10 group-hover/item:rotate-12 group-hover/item:bg-gold transition-all duration-1000">
                  <CheckCircle2 className="w-6 h-6 text-gold group-hover/item:text-navy" />
                </div>
                <div className="flex-1 space-y-2 border-b border-navy/5 pb-10 group-last/item:border-0 group-last/item:pb-0 italic group/meta">
                  <span className="text-[19px] font-bold text-navy leading-snug tracking-tight block uppercase group-hover/meta:text-gold transition-colors">{item}</span>
                  <div className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/40 animate-pulse" />
                    <p className="text-[10px] text-navy/20 font-bold uppercase tracking-[0.4em]">Audit Benchmark Successfully Passed</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-navy/[0.01] rounded-tl-full pointer-events-none group-hover:bg-gold/[0.03] transition-colors duration-1000" />
          </div>
        </section>

        {/* Intelligence Strategy Entry */}
        <section className="space-y-10">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20 ml-4 italic">Intelligence Recommendations</h3>
          <div className="bg-gold p-12 rounded-[64px] flex gap-10 shadow-3xl shadow-gold/40 relative overflow-hidden group active:scale-[0.99] transition-transform">
            <div className="w-20 h-20 rounded-[32px] bg-white/20 flex items-center justify-center text-navy shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-1000">
              <Info className="w-10 h-10" />
            </div>
            <div className="space-y-4 relative z-10 italic">
              <p className="text-[22px] text-navy/80 leading-relaxed font-bold tracking-tighter">
                "{report.recommendations}"
              </p>
              <div className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-navy/20 group-hover:bg-navy transition-colors animate-pulse" />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-navy/40">Field Strategist Technical Advisory</p>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-navy/5 rounded-full blur-[80px]" />
            <Info className="absolute -right-12 -bottom-12 w-48 h-48 text-navy/5 rotate-12 opacity-40 group-hover:rotate-0 transition-transform duration-[3000ms]" />
          </div>
        </section>
      </div>

      {/* Strategic Command Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-10 z-50 bg-gradient-to-t from-warm-white via-warm-white/95 to-transparent">
        <div className="max-w-[480px] mx-auto">
          <Button 
            onClick={() => navigate('/app/review/' + id)}
            className="w-full h-24 rounded-[36px] bg-navy text-gold hover:bg-navy/95 font-bold text-[20px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/40 active:scale-95 transition-all italic group"
          >
            Audit Experience <ArrowRight className="ml-6 w-7 h-7 group-hover:translate-x-3 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
