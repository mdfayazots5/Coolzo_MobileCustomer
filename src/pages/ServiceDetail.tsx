import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, CheckCircle2, ChevronDown, ShieldCheck, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useBookingStore } from '@/store/useBookingStore';
import { FAQ_ITEMS } from '@/lib/mockData';
import { CatalogService } from '@/services/catalogService';
import { cn } from '@/lib/utils';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [service, setService] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateBooking, setStep, resetBooking } = useBookingStore();

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const data = await CatalogService.getServiceById(id);
        setService(data);
      } catch (error) {
        console.error('Failed to fetch service:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleBook = () => {
    if (!service) return;
    resetBooking();
    updateBooking({ 
      serviceId: service.id, 
      subServiceId: 'Standard Deployment' 
    });
    setStep(2);
    navigate('/app/book');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center space-y-8">
        <h1 className="text-[28px] font-display font-bold text-navy tracking-tight leading-none">Intelligence Void</h1>
        <p className="text-navy/40 text-[14px]">The requested service artifact does not exist in our active grid.</p>
        <Button onClick={() => navigate('/app/services')} className="bg-gold text-navy font-bold rounded-2xl h-16 px-12 shadow-2xl shadow-gold/20 active:scale-95 transition-all">Recall Catalog</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-40">
      {/* Parallax Hero Section */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover scale-110 active:scale-100 transition-transform duration-[3000ms]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent shadow-inner" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-2xl text-white active:scale-90 transition-transform shadow-2xl"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-10 left-8 right-8 space-y-4">
          <Badge className="bg-gold text-navy border-none mb-2 text-[10px] font-bold uppercase tracking-[0.3em] px-5 py-2 rounded-full shadow-2xl">
            {service.category}
          </Badge>
          <h1 className="text-[40px] font-display font-bold text-white mb-2 leading-none tracking-tighter">{service.name}</h1>
          <div className="flex items-center gap-6 text-white/60 text-[11px] font-bold uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
              <Clock className="w-4 h-4 text-gold" />
              <span>{service.duration} Session</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span>4.9 / 5.0 Precision</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-12 space-y-16">
        {/* About Service Narrative */}
        <section className="space-y-6">
          <h2 className="text-[12px] font-bold uppercase tracking-[0.4em] text-navy/20 ml-2">Service Concept</h2>
          <div className="bg-white p-10 rounded-[48px] border border-navy/5 shadow-2xl shadow-black/[0.01] relative overflow-hidden group">
            <p className="text-navy/70 leading-relaxed text-[15px] font-medium italic relative z-10">
              "{service.description} {service.howItWorks}"
            </p>
            <ShieldCheck className="absolute -right-10 -bottom-10 w-40 h-40 text-navy/[0.02] -rotate-12 pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
          </div>
        </section>

        {/* Mission Deliverables Grid */}
        <section className="space-y-8">
          <div className="flex items-end justify-between px-4">
            <div className="space-y-2">
              <h2 className="text-[12px] font-bold uppercase tracking-[0.4em] text-navy/20">Operational Protocol</h2>
              <h3 className="text-[28px] font-display font-bold text-navy tracking-tighter leading-none flex items-center gap-4">
                Mission Deliverables
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {service.included.map((item: string, index: number) => (
              <div key={index} className="bg-white p-6 rounded-[32px] border border-navy/5 flex items-center gap-6 shadow-sm active:scale-[0.99] transition-all hover:border-gold/30 group">
                <div className="w-12 h-12 rounded-2xl bg-gold/5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-inner">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-navy/70 text-[14px] font-bold tracking-tight">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tactical Trust Matrix */}
        <div className="grid grid-cols-2 gap-8">
          {[
            { icon: ShieldCheck, label: 'Masters Only', desc: 'Elite Technicians' },
            { icon: Lock, label: 'Standardized', desc: 'Secure Logistics' }
          ].map((trust, i) => (
            <div key={i} className="bg-gold/5 p-8 rounded-[40px] border border-gold/10 flex flex-col items-center text-center shadow-2xl shadow-gold/5 group hover:bg-gold transition-all duration-500">
              <trust.icon className="w-8 h-8 text-gold mb-3 group-hover:text-navy transition-colors scale-110" />
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-navy/40 group-hover:text-navy/60">{trust.label}</p>
                <p className="text-[14px] font-bold text-navy tracking-tight">{trust.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Intelligence Ledger (FAQ) */}
        <section className="space-y-8">
          <div className="px-4">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.4em] text-navy/20 mb-2">Technical Guidance</h2>
            <h3 className="text-[28px] font-display font-bold text-navy tracking-tighter">Intelligence Ledger</h3>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-[36px] border border-navy/5 overflow-hidden shadow-2xl shadow-black/[0.01] hover:border-gold/30 transition-all group"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-8 py-8 flex items-center justify-between text-left"
                >
                  <span className="font-bold text-[15px] text-navy pr-6 tracking-tight group-hover:text-gold transition-colors">{faq.question}</span>
                  <div className={cn("w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center transition-all duration-500", expandedFaq === index && "bg-gold text-navy rotate-180")}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 overflow-hidden"
                    >
                      <p className="text-navy/40 text-[14px] pb-8 leading-relaxed font-medium italic border-t border-navy/5 pt-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Deployment Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-navy/5 p-8 pb-10 z-50 rounded-t-[50px] shadow-2xl">
        <div className="max-w-[440px] mx-auto flex items-center justify-between gap-10">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/20">Operational Fee</span>
            <span className="text-[32px] font-display font-bold text-navy tracking-tighter leading-none">₹{service.price}</span>
          </div>
          <Button 
            className="flex-1 h-20 rounded-[28px] bg-navy text-gold hover:bg-navy/95 font-bold text-[18px] shadow-2xl shadow-navy/40 uppercase tracking-[0.25em] active:scale-95 transition-all"
            onClick={handleBook}
          >
            Deploy Operative
          </Button>
        </div>
      </div>
    </div>
  );
}
