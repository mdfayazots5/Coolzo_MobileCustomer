import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Download, CheckCircle2, Thermometer, Zap, Droplets, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JOBS } from '@/lib/mockData';

const ServiceReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = JOBS.find(j => j.id === id) || JOBS[0];

  const metrics = [
    { icon: Thermometer, label: 'Cooling Temp', val: '18°C', status: 'Optimal' },
    { icon: Zap, label: 'Power Draw', val: '6.2A', status: 'Normal' },
    { icon: Droplets, label: 'Gas Level', val: '140 PSI', status: 'Full' }
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
            <div>
              <h1 className="text-xl font-display font-bold text-navy">Service Report</h1>
              <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{job.srNumber}</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-100 rounded-[32px] p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-green-700">Service Successful</h3>
            <p className="text-xs text-green-600/80">Completed on {new Date(job.date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">AC Health Metrics</h3>
          <div className="grid grid-cols-3 gap-3">
            {metrics.map((m, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-border text-center">
                <m.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                <p className="text-lg font-display font-bold text-navy">{m.val}</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-green-500">{m.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Work Done */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Work Performed</h3>
          <div className="bg-white rounded-[32px] border border-border p-6 space-y-4">
            {[
              'Deep cleaning of indoor & outdoor units',
              'Filter replacement (HEPA Grade)',
              'Drain pipe blockage cleared',
              'Electrical wiring safety check',
              'Refrigerant pressure optimization'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                <span className="text-xs font-medium text-navy/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Notes */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Expert Recommendations</h3>
          <div className="bg-navy/5 rounded-[32px] p-6 flex gap-4">
            <Info className="w-5 h-5 text-navy/40 shrink-0" />
            <p className="text-xs text-navy/60 leading-relaxed italic">
              "The unit is in excellent condition now. Recommend cleaning the filters every 15 days due to high dust area. Next service due in 6 months."
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-border z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={() => navigate('/app/review/' + job.id)}
              className="w-full h-16 rounded-[24px] bg-gold text-navy font-bold text-lg shadow-xl shadow-gold/20"
            >
              Rate this Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceReport;
