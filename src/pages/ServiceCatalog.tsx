import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, Filter, ArrowLeft, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SERVICE_CATEGORIES } from '@/lib/mockData';
import { CatalogService } from '@/services/catalogService';
import { cn } from '@/lib/utils';

export default function ServiceCatalog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await CatalogService.getServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center italic">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
        <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 animate-pulse">Scanning Grid...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-64 relative overflow-hidden italic">
      {/* Catalog Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />
      <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[140px] -ml-40 pointer-events-none" />

      {/* Institutional Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center gap-8 mb-16 relative z-10 transition-all">
          <button 
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-all shadow-3xl border border-white/5"
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          <div className="space-y-4">
            <h1 className="text-[44px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Service Catalog</h1>
            <p className="text-warm-white/30 text-[12px] font-bold uppercase tracking-[0.5em] leading-none">Institutional Deployment Registry</p>
          </div>
        </div>

        <div className="relative z-10 group max-w-xl">
          <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors duration-700">
            <SearchIcon className="w-8 h-8" />
          </div>
          <Input 
            placeholder="Search the operative grid..." 
            className="h-24 pl-24 pr-10 rounded-[48px] border-white/5 bg-white/10 text-white placeholder:text-white/20 text-[20px] font-display font-bold focus-visible:ring-gold/30 transition-all shadow-3xl shadow-black/20 italic placeholder:italic uppercase"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* Classification Matrix */}
      <div className="px-8 -mt-24 relative z-30">
        <div className="bg-white/80 backdrop-blur-3xl p-5 rounded-[52px] border border-navy/5 shadow-3xl shadow-black/[0.05] flex gap-4 overflow-x-auto no-scrollbar">
          {SERVICE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "h-16 px-10 rounded-[32px] text-[11px] font-bold whitespace-nowrap transition-all duration-700 uppercase tracking-[0.4em] border active:scale-95 relative overflow-hidden italic",
                activeCategory === category 
                  ? "bg-navy text-gold border-navy shadow-3xl shadow-navy/20" 
                  : "bg-transparent text-navy/30 border-navy/5 hover:border-gold/30"
              )}
            >
              <span className="relative z-10">{category}</span>
              {activeCategory === category && (
                <motion.div layoutId="cat-indicator-catalog" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold shadow-[0_0_12px_rgba(201,162,74,0.6)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Deployment Grid */}
      <div className="p-8 py-24 pb-64 max-w-6xl mx-auto w-full space-y-20">
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service, i) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 + 0.2 } }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[72px] overflow-hidden border border-navy/5 shadow-3xl shadow-black/[0.01] group active:scale-[0.99] transition-all cursor-pointer relative hover:border-gold/30 hover:shadow-3xl"
              onClick={() => navigate(`/service/${service.id}`)}
            >
              <div className="aspect-[21/9] w-full overflow-hidden relative shadow-inner">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
                
                <div className="absolute bottom-10 left-12 right-12 flex items-end justify-between z-10">
                  <div className="space-y-4">
                    <Badge className="bg-gold text-navy border-none font-bold text-[11px] uppercase tracking-[0.5em] px-8 py-3 rounded-full shadow-3xl shadow-black/40 italic">
                      {service.category} Protocol
                    </Badge>
                    <h3 className="text-[44px] font-display font-bold text-white tracking-tighter leading-none italic uppercase">{service.name}</h3>
                  </div>
                  <div className="bg-white/10 backdrop-blur-3xl border border-white/20 px-10 py-8 rounded-[42px] text-center min-w-[160px] shadow-3xl group-hover:bg-gold transition-colors duration-700 group-hover:border-gold">
                    <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/50 mb-2 group-hover:text-navy/40 transition-colors">Operative Fee</p>
                    <p className="text-[32px] font-display font-bold text-gold leading-none italic group-hover:text-navy transition-colors">₹{service.price}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-16 space-y-12 bg-gradient-to-b from-white to-navy/[0.01]">
                <p className="text-navy/40 text-[18px] font-bold leading-relaxed italic tracking-tight uppercase max-w-2xl">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-12 border-t border-dashed border-navy/10">
                  <div className="flex items-center gap-6 bg-navy/[0.03] px-10 py-5 rounded-[28px] border border-navy/5 shadow-inner group-hover:bg-navy group-hover:text-gold transition-colors duration-700">
                    <Clock className="w-6 h-6 text-gold" />
                    <span className="text-[13px] font-bold uppercase tracking-[0.4em] italic">{service.duration} Session Sync</span>
                  </div>
                  <div className="w-20 h-20 rounded-[32px] bg-navy flex items-center justify-center text-gold shadow-3xl shadow-navy/30 group-hover:bg-gold group-hover:text-navy transition-all duration-700 active:scale-90 group-hover:rotate-45">
                    <ChevronRight className="w-10 h-10" />
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.05] rounded-bl-full pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredServices.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-48 text-center space-y-16"
          >
            <div className="w-48 h-48 bg-navy/[0.02] rounded-[84px] flex items-center justify-center text-navy/5 relative group border border-navy/5 shadow-inner">
              <SearchIcon className="w-24 h-24 group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gold/5 rounded-[84px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="space-y-6">
              <h3 className="text-[44px] font-display font-bold text-navy tracking-tighter uppercase italic">Artifacts Nullified</h3>
              <p className="text-navy/30 text-[16px] font-bold uppercase tracking-[0.3em] max-w-[360px] mx-auto leading-relaxed">The query produced zero matches within historical grid parameters.</p>
            </div>
            <Button 
              variant="outline" 
              className="h-22 px-16 rounded-[42px] border-gold/20 text-gold font-bold text-[14px] uppercase tracking-[0.5em] hover:bg-navy hover:text-gold transition-all shadow-3xl hover:shadow-navy/20 active:scale-95 italic"
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            >
              Reset Dispatch Protocol
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
