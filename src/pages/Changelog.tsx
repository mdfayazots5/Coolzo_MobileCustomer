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

const Changelog = () => {
  const navigate = useNavigate();
  const [changelog, setChangelog] = useState<any[]>([]);
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
      title: 'Live Job Tracking',
      desc: 'Track your technician in real-time with live GPS updates and ETA.',
      color: 'bg-blue-50 text-blue-500'
    },
    {
      icon: Shield,
      title: 'AMC Protection',
      desc: 'Manage your annual maintenance plans and service history in one place.',
      color: 'bg-green-50 text-green-500'
    },
    {
      icon: Smartphone,
      title: 'Secure Payments',
      desc: 'Pay for services instantly via UPI, Cards, or Wallets with tax-compliant receipts.',
      color: 'bg-gold/10 text-gold'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">What's New</h1>
        </div>
      </div>

      <div className="p-8 space-y-10 pb-32">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-[32px] bg-gold/10 flex items-center justify-center text-gold mx-auto mb-6">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold text-navy">Version {changelog[0]?.version || '2.0'}</h2>
          <p className="text-navy/40 text-[10px] font-bold uppercase tracking-widest">Released {changelog[0]?.date || 'April 2026'}</p>
        </div>

        <div className="space-y-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6"
            >
              <div className={cn("w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center", feature.color)}>
                <feature.icon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-navy text-lg">{feature.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-navy/5 rounded-3xl p-6 space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Other Improvements</h4>
          <ul className="space-y-3">
            {(changelog[0]?.changes || [
              'Improved app load time by 40%',
              'Offline support for job history',
              'New support ticket attachment system',
              'Bug fixes and performance optimizations'
            ]).map((item: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-xs font-medium text-navy/60">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-navy/5 z-40">
          <div className="max-w-md mx-auto">
            <Button 
              onClick={() => navigate('/app')}
              className="w-full h-16 rounded-[24px] bg-gold text-navy font-bold text-lg shadow-xl shadow-gold/20 flex items-center justify-center gap-3"
            >
              Explore New Features
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changelog;
