import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, Filter, ArrowLeft, Clock, ChevronRight } from 'lucide-react';
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
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-warm-white/80 backdrop-blur-md px-6 py-4 border-bottom border-navy/5">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-navy/5 text-navy"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Service Catalog</h1>
        </div>
        
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
          <Input 
            placeholder="Search for services..." 
            className="pl-10 h-12 rounded-xl border-navy/10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 py-4 overflow-x-auto flex gap-2 no-scrollbar">
        {SERVICE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300",
              activeCategory === category 
                ? "bg-navy text-gold shadow-lg shadow-navy/10" 
                : "bg-white text-navy/40 border border-navy/5"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Service Grid */}
      <div className="px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-4 shadow-sm border border-navy/5 flex flex-col group"
                onClick={() => navigate(`/service/${service.id}`)}
              >
                <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <Badge className="absolute top-3 right-3 bg-navy/80 backdrop-blur-md text-gold border-none">
                    {service.category}
                  </Badge>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-display font-bold text-navy">{service.name}</h3>
                    <span className="text-gold font-bold">₹{service.price}</span>
                  </div>
                  <p className="text-navy/60 text-xs line-clamp-2 mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-navy/40">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{service.duration}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="rounded-xl bg-gold text-navy hover:bg-gold/90 font-bold h-8 px-4"
                  >
                    Book
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredServices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-8 h-8 text-navy/20" />
            </div>
            <h3 className="font-display font-bold text-navy">No services found</h3>
            <p className="text-navy/40 text-sm mt-1">Try adjusting your search or category.</p>
            <Button 
              variant="link" 
              className="text-gold mt-4"
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
