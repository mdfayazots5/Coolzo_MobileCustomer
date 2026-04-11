import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, CheckCircle2, ChevronDown, ShieldCheck, Star } from 'lucide-react';
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
      serviceName: service.name,
      servicePrice: service.price,
      subServiceId: 'General Checkup' 
    });
    setStep(2);
    navigate('/book');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-2xl font-display font-bold text-navy">Service not found</h1>
        <Button onClick={() => navigate('/services')} className="mt-4 bg-gold text-navy">Back to Catalog</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-32">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-8 left-8 right-8">
          <Badge className="bg-gold text-navy border-none mb-3 font-bold">
            {service.category}
          </Badge>
          <h1 className="text-3xl font-display font-bold text-white mb-2">{service.name}</h1>
          <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold" />
              <span>{service.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span>4.9 (120+ reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-10">
        {/* Description */}
        <section>
          <h2 className="text-xl font-display font-bold text-navy mb-3">About Service</h2>
          <p className="text-navy/60 leading-relaxed">
            {service.description} {service.howItWorks}
          </p>
        </section>

        {/* What's Included */}
        <section className="bg-white rounded-3xl p-6 border border-navy/5 shadow-sm">
          <h2 className="text-lg font-display font-bold text-navy mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-gold" />
            What's Included
          </h2>
          <ul className="space-y-3">
            {service.included.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-navy/70 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Trust Factors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gold/10 p-4 rounded-2xl border border-gold/20 flex flex-col items-center text-center">
            <ShieldCheck className="w-6 h-6 text-gold mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-navy">Certified Experts</span>
          </div>
          <div className="bg-gold/10 p-4 rounded-2xl border border-gold/20 flex flex-col items-center text-center">
            <Star className="w-6 h-6 text-gold mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-navy">Service Warranty</span>
          </div>
        </div>

        {/* FAQ Section */}
        <section>
          <h2 className="text-xl font-display font-bold text-navy mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-navy/5 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-bold text-sm text-navy pr-4">{faq.question}</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-navy/40 transition-transform duration-300",
                    expandedFaq === index && "rotate-180"
                  )} />
                </button>
                <div className={cn(
                  "px-5 overflow-hidden transition-all duration-300 ease-in-out",
                  expandedFaq === index ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
                )}>
                  <p className="text-navy/60 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-navy/5 p-6 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Starting from</span>
            <span className="text-2xl font-display font-bold text-navy">₹{service.price}</span>
          </div>
          <Button 
            className="flex-1 h-14 rounded-2xl bg-gold text-navy hover:bg-gold/90 font-bold text-lg shadow-lg shadow-gold/20"
            onClick={handleBook}
          >
            Book This Service
          </Button>
        </div>
      </div>
    </div>
  );
}
