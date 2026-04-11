import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, ArrowLeft, X, Clock, ChevronRight, BookOpen, Wrench } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SERVICES, ARTICLES } from '@/lib/mockData';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const serviceResults = SERVICES.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) || 
    s.description.toLowerCase().includes(query.toLowerCase())
  );

  const articleResults = ARTICLES.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults = query.length > 0 && (serviceResults.length > 0 || articleResults.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Search Header */}
      <div className="px-6 py-4 bg-white border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-navy/5 text-navy"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
            <Input 
              ref={inputRef}
              placeholder="Search services, tips, guides..." 
              className="pl-10 pr-10 h-12 rounded-xl border-navy/10 bg-warm-white/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query.length > 0 && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-navy/5 text-navy/40"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {query.length === 0 ? (
          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Recent Searches</h3>
              <div className="space-y-2">
                {['AC Repair', 'Deep Cleaning', 'AMC Plans'].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setQuery(item)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-navy/5 rounded-xl transition-colors text-left"
                  >
                    <Clock className="w-4 h-4 text-navy/20" />
                    <span className="text-sm font-medium text-navy/60">{item}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Popular Categories</h3>
              <div className="flex flex-wrap gap-2">
                {['Repair', 'Cleaning', 'Gas Refill', 'Installation'].map((cat, i) => (
                  <button 
                    key={i}
                    onClick={() => navigate(`/services?category=${cat}`)}
                    className="px-4 py-2 bg-white border border-navy/5 rounded-full text-xs font-bold text-navy shadow-sm"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Service Results */}
            {serviceResults.length > 0 && (
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Services</h3>
                <div className="space-y-3">
                  {serviceResults.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 rounded-2xl border border-navy/5 shadow-sm flex items-center gap-4 group"
                      onClick={() => navigate(`/service/${service.id}`)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-navy text-sm">{service.name}</h4>
                        <p className="text-navy/40 text-[10px] font-medium">{service.category} • ₹{service.price}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-navy/20 group-hover:text-gold transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Article Results */}
            {articleResults.length > 0 && (
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-4 px-2">Articles & Guides</h3>
                <div className="space-y-3">
                  {articleResults.map((article) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 rounded-2xl border border-navy/5 shadow-sm flex items-center gap-4 group"
                      onClick={() => navigate(`/blog/${article.id}`)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40 shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-navy text-sm line-clamp-1">{article.title}</h4>
                        <p className="text-navy/40 text-[10px] font-medium">{article.category} • {article.readTime}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-navy/20 group-hover:text-gold transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {!hasResults && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-navy/10" />
                </div>
                <h3 className="font-display font-bold text-navy">No results found</h3>
                <p className="text-navy/40 text-sm mt-1">Try searching for something else.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
