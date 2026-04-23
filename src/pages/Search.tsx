import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, ArrowLeft, X, Clock, ChevronRight, Wrench, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CatalogService } from '@/services/catalogService';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [serviceResults, setServiceResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const results = await CatalogService.searchServices(query);
          setServiceResults(results);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setServiceResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const hasResults = query.length > 0 && serviceResults.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-40 relative overflow-hidden">
      {/* Search Header Cluster */}
      <div className="px-8 pt-16 pb-16 bg-navy rounded-b-[72px] relative overflow-hidden shadow-2xl shadow-navy/40 z-50">
        <div className="flex items-center gap-6 mb-12 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-95 transition-all shadow-2xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="space-y-1">
            <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none italic">Discovery</h1>
            <p className="text-warm-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">Querying the institutional grid</p>
          </div>
        </div>

        <div className="relative z-10 group">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors duration-500">
            <SearchIcon className="w-6 h-6" />
          </div>
          <Input 
            ref={inputRef}
            placeholder="Search services, tips, or operative guides..." 
            className="h-22 pl-20 pr-16 rounded-[36px] border-white/5 bg-white/10 text-white placeholder:text-white/20 text-[17px] font-bold focus-visible:ring-gold/30 transition-all shadow-2xl shadow-black/20 italic placeholder:italic"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.length > 0 && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/40 active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="absolute -right-32 -bottom-32 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-16 pb-40 relative z-30 no-scrollbar">
        <AnimatePresence mode="wait">
          {query.length === 0 ? (
            <motion.div 
              key="guidance"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-20"
            >
              {/* Temporal Recall Section */}
              <section className="space-y-10">
                <div className="flex items-end justify-between px-6">
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20">Temporal Recall</h3>
                    <h2 className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none italic">Recent Inquiries</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {['AC Repair', 'Elite Deep Cleaning', 'AMC Subscription Matrix'].map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => setQuery(item)}
                      className="w-full flex items-center justify-between p-8 bg-white border border-navy/5 rounded-[40px] group active:scale-[0.99] transition-all hover:border-gold/30 shadow-sm relative overflow-hidden"
                    >
                      <div className="flex items-center gap-8 relative z-10">
                        <div className="w-16 h-16 rounded-[24px] bg-navy/[0.02] flex items-center justify-center text-navy/20 group-hover:bg-navy group-hover:text-gold transition-all duration-700 shadow-inner">
                          <Clock className="w-7 h-7" />
                        </div>
                        <span className="text-[18px] font-bold text-navy/40 group-hover:text-navy transition-colors italic tracking-tight">{item}</span>
                      </div>
                      <ChevronRight className="w-6 h-6 text-navy/10 group-hover:text-gold transition-colors relative z-10" />
                      <div className="absolute inset-0 bg-gold/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </section>

              {/* Strategic Clusters */}
              <section className="space-y-10">
                <div className="flex items-end justify-between px-6">
                  <div className="space-y-3">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20">Strategic Clusters</h3>
                    <h2 className="text-[36px] font-display font-bold text-navy tracking-tighter leading-none italic">Popular Nodes</h2>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 px-2">
                  {['Repair', 'Cleaning', 'Refill', 'Installation', 'Diagnostic'].map((cat, i) => (
                    <button 
                      key={i}
                      onClick={() => navigate(`/services?category=${encodeURIComponent(cat)}`)}
                      className="px-10 py-5 bg-white border border-navy/5 rounded-[24px] text-[11px] font-bold text-navy uppercase tracking-[0.3em] shadow-sm hover:bg-navy hover:text-gold transition-all active:scale-95 hover:shadow-2xl hover:shadow-navy/10"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-16"
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-8">
                  <div className="w-20 h-20 bg-gold/5 rounded-[32px] flex items-center justify-center border border-gold/10 shadow-inner">
                    <Loader2 className="w-10 h-10 text-gold animate-spin" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 italic animate-pulse">Syncing Grid Telemetry...</p>
                </div>
              ) : (
                <>
                  {/* Service Artifacts */}
                  {serviceResults.length > 0 && (
                    <section className="space-y-10">
                      <div className="px-6">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 mb-4">Service Modules</h3>
                        <h2 className="text-[36px] font-display font-bold text-navy tracking-tighter italic">Identified Artifacts</h2>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {serviceResults.map((service, i) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                            className="bg-white p-8 rounded-[48px] border border-navy/5 shadow-2xl shadow-black/[0.01] flex items-center justify-between group active:scale-[0.99] transition-all hover:border-gold/30 hover:shadow-gold/5 relative overflow-hidden"
                            onClick={() => navigate(`/service/${service.id}`)}
                          >
                            <div className="flex items-center gap-8 relative z-10">
                              <div className="w-20 h-20 rounded-[28px] bg-gold/5 flex items-center justify-center text-gold shadow-inner group-hover:bg-gold group-hover:text-navy transition-all duration-700">
                                <Wrench className="w-10 h-10" />
                              </div>
                              <div className="space-y-1 font-bold italic">
                                <h4 className="text-navy text-[20px] tracking-tighter leading-none mb-1 group-hover:text-navy transition-colors">{service.name}</h4>
                                <p className="text-navy/20 text-[10px] uppercase tracking-[0.4em]">{service.category} • Dispatch Potential</p>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-8 relative z-10">
                              <div className="space-y-2 hidden sm:block">
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/10 leading-none">Mission Fee</p>
                                <p className="text-[22px] font-display font-bold text-gold italic leading-none">₹{service.price}</p>
                              </div>
                              <div className="w-12 h-12 rounded-[18px] bg-navy/5 flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-all text-navy/10">
                                <ChevronRight className="w-6 h-6 " />
                              </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.01] rounded-bl-full pointer-events-none group-hover:bg-gold/5 transition-colors duration-1000" />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {!hasResults && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-40 text-center space-y-12"
                    >
                      <div className="w-40 h-40 bg-navy/[0.02] rounded-[60px] flex items-center justify-center text-navy/5 relative group border border-navy/5 shadow-inner">
                        <SearchIcon className="w-20 h-20 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gold/5 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-[32px] font-display font-bold text-navy tracking-tighter italic">Artifacts Nullified</h3>
                        <p className="text-navy/30 text-[14px] font-bold uppercase tracking-[0.2em] max-w-[320px] mx-auto leading-relaxed">The query produced zero matches within current grid parameters.</p>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
