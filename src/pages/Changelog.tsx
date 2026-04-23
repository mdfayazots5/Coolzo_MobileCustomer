import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Sparkles, 
  Zap, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ContentService } from '@/services/contentService';
import { cn } from '@/lib/utils';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export default function Changelog() {
  const navigate = useNavigate();
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const data = await ContentService.getChangelog();
        setChangelog(data);
      } catch (error) {
        console.error('Failed to fetch changelog:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChangelog();
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Precision Tracking',
      desc: 'Institutional-grade GPS telemetry for real-time technician movement synchronization.',
      color: 'bg-blue-50 text-blue-500'
    },
    {
      icon: Shield,
      title: 'Governance Vectors',
      desc: 'Enhanced AMC asset protection protocols and multi-layer verification registries.',
      color: 'bg-green-50 text-green-500'
    },
    {
      icon: Smartphone,
      title: 'Settlement Engines',
      desc: 'Optimized fiscal reconciliation with executive-grade UPI and card-based settlements.',
      color: 'bg-gold/10 text-gold'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden italic">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/[0.03] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />

      {/* System Evolution Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center gap-8 relative z-10">
          <button 
            onClick={() => navigate('/app')}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="text-left">
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase italic">System Evolution</h1>
            <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.5em] mt-2">Active Development Dispatches</p>
          </div>
        </div>
        
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-12 relative z-30 pb-40 text-left">
        {/* Release Artifact */}
        <div className="bg-white rounded-[72px] p-16 border border-navy/5 shadow-3xl shadow-black/[0.02] relative overflow-hidden group">
          <div className="text-center space-y-4 mb-20">
            <div className="w-24 h-24 rounded-[32px] bg-gold/5 flex items-center justify-center text-gold mx-auto mb-8 shadow-inner border border-gold/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
              <Sparkles className="w-12 h-12" />
            </div>
            <h2 className="text-[40px] font-display font-bold text-navy leading-none tracking-tighter uppercase italic">Vento {changelog[0]?.version || '2.0'}</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-[1px] bg-gold/30" />
              <p className="text-navy/20 text-[11px] font-bold uppercase tracking-[0.5em]">Depl: {changelog[0]?.date || 'April 2026'}</p>
              <div className="w-12 h-[1px] bg-gold/30" />
            </div>
          </div>

          <div className="space-y-12 text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/20 mb-8 px-4 border-l-4 border-gold">Primary Logic Enhancements</h4>
            <div className="grid gap-10">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 group/item"
                >
                  <div className={cn("w-16 h-16 rounded-[24px] shrink-0 flex items-center justify-center shadow-inner group-hover/item:scale-110 transition-transform duration-500", feature.color)}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-navy text-[20px] leading-tight tracking-tighter uppercase italic">{feature.title}</h3>
                    <p className="text-navy/40 text-[14px] leading-relaxed italic max-w-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-20 bg-navy rounded-[48px] p-12 space-y-8 relative overflow-hidden shadow-3xl shadow-navy/20">
            <div className="flex items-center justify-between relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold/60">Optimization Matrix</h4>
              <Zap className="w-5 h-5 text-gold/40 animate-pulse" />
            </div>
            <ul className="space-y-5 relative z-10">
              {(changelog[0]?.changes || [
                'Enhanced app load-time protocols by 40% using advanced asset caching.',
                'Offline synchronization for architectural job history state.',
                'New executive support ticket attachment synthesis system.',
                'Refined bug-tracking registries and performance calibration.'
              ]).map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-4 text-[14px] font-medium text-warm-white/60 italic leading-snug">
                  <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5 shadow-2xl shadow-gold/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
          </div>

          {changelog.slice(1).length > 0 && (
            <div className="mt-12 space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/20 mb-6 px-4 border-l-4 border-gold">
                Previous Releases
              </h4>
              <div className="space-y-4">
                {changelog.slice(1).map((entry) => (
                  <div key={`${entry.version}-${entry.date}`} className="rounded-[32px] border border-navy/5 bg-white p-8">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[18px] font-display font-bold text-navy uppercase italic">Vento {entry.version}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/30">{entry.date}</p>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {entry.changes.slice(0, 3).map((item) => (
                        <li key={item} className="text-[12px] text-navy/50">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.01] rounded-bl-full pointer-events-none" />
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-10 bg-white/80 backdrop-blur-2xl border-t border-navy/5 z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={() => navigate('/app')}
              className="w-full h-18 rounded-[32px] bg-navy text-gold font-bold text-[15px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/30 flex items-center justify-center gap-6 group active:scale-95 transition-all"
            >
              Initialize Interaction
              <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
