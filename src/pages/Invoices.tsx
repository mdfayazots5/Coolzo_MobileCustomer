import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  ChevronLeft,
  Search,
  Filter,
  CreditCard,
  ChevronRight,
  ArrowUpRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PaymentService, Invoice } from '@/services/paymentService';
import { useAuthStore } from '@/store/useAuthStore';
import EmptyState from '@/components/EmptyState';

const Invoices = () => {
  const navigate = useNavigate();
  const { user, isAuthReady } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Unpaid' | 'Paid' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!isAuthReady || !user) return;
      try {
        const data = await PaymentService.getInvoices(user.uid);
        setInvoices(data);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, [user, isAuthReady]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesTab = activeTab === 'All' || inv.status === activeTab || (activeTab === 'Unpaid' && inv.status === 'Pending');
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         inv.jobId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalOutstanding = invoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + (inv.balanceAmount ?? inv.amount), 0);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden italic">
      {/* Fiscal Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />

      {/* Institutional Header */}
      <div className="bg-navy px-8 pt-20 pb-40 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center justify-between relative z-10 mb-12">
          <button 
            onClick={() => navigate('/app')}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-3xl border border-white/5"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="flex gap-4">
             <button className="w-14 h-14 rounded-[22px] bg-white/10 flex items-center justify-center text-gold active:scale-90 transition-all border border-white/5">
                <Search className="w-6 h-6" />
             </button>
             <button className="w-14 h-14 rounded-[22px] bg-white/10 flex items-center justify-center text-gold active:scale-90 transition-all border border-white/5">
                <Filter className="w-6 h-6" />
             </button>
          </div>
        </div>
        
        <div className="relative z-10 space-y-4">
          <h1 className="text-[44px] font-display font-bold text-gold tracking-tighter leading-none uppercase italic">Fiscal Ledger</h1>
          <p className="text-warm-white/30 text-[12px] font-bold uppercase tracking-[0.5em] leading-none">Institutional Economic Grid</p>
        </div>
        
        <CreditCard className="absolute -right-20 -bottom-20 w-[420px] h-[420px] text-warm-white/[0.02] -rotate-12 pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-24 space-y-16 pb-40 relative z-30">
        {/* Liability Telemetry */}
        {totalOutstanding > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[72px] p-12 text-navy relative overflow-hidden shadow-3xl shadow-black/[0.02] border border-navy/5 group"
          >
            <div className="relative z-10 flex flex-col gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                   <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/30">Aggregate Liability</p>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[64px] font-display font-bold text-navy tracking-tighter leading-none italic">₹</span>
                  <span className="text-[72px] font-display font-bold text-navy tracking-tighter leading-none">{totalOutstanding.toLocaleString()}</span>
                </div>
              </div>
              <Button 
                className="bg-navy hover:bg-navy/95 text-gold rounded-[32px] font-bold px-12 h-22 text-[16px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/40 active:scale-95 transition-all w-full group relative overflow-hidden"
                onClick={() => setActiveTab('Unpaid')}
              >
                <span className="relative z-10">Authorize Settlement</span>
                <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-navy/[0.01] rounded-bl-full pointer-events-none group-hover:bg-navy/[0.03] transition-colors duration-1000" />
          </motion.div>
        )}

        {/* Ledger Matrix Nav */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 -mx-2 px-2">
          {['All', 'Unpaid', 'Paid', 'Overdue'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "h-16 px-10 rounded-full text-[11px] font-bold uppercase tracking-[0.4em] transition-all whitespace-nowrap border flex items-center relative active:scale-95 shadow-lg",
                activeTab === tab 
                  ? "bg-navy text-gold border-navy shadow-navy/30" 
                  : "bg-white text-navy/20 border-navy/5 shadow-black/5"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="tab-pulse" 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold shadow-[0_0_12px_rgba(201,162,74,0.6)]" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Statements Dossier */}
        <section className="space-y-12">
          <div className="flex items-end justify-between px-4">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20">Archived Statements</h3>
            <span className="text-[10px] font-bold text-gold/60 uppercase tracking-[0.4em] bg-gold/5 px-6 py-2.5 rounded-full border border-gold/10 italic">Ledger Sync: 2026.04</span>
          </div>

          <div className="space-y-10">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((inv) => (
                <motion.div
                  key={inv.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[72px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.01] group active:scale-[0.98] transition-all hover:border-gold/30 hover:shadow-3xl relative overflow-hidden"
                  onClick={() => navigate(`/app/invoices/${inv.id}`)}
                >
                  <div className="flex justify-between items-start mb-16">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-[32px] bg-navy text-gold flex items-center justify-center shadow-3xl shadow-navy/20 group-hover:rotate-6 transition-transform">
                        <FileText className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20 italic">{inv.invoiceNumber}</p>
                        <h3 className="font-display font-bold text-navy text-[28px] tracking-tighter leading-none uppercase group-hover:text-gold transition-colors">Deployment {inv.jobId}</h3>
                      </div>
                    </div>
                    <Badge className={cn(
                      "border-none font-bold text-[10px] uppercase tracking-[0.4em] px-6 py-3 rounded-full shadow-2xl",
                      inv.status === 'Paid' ? "bg-green-500/10 text-green-600 shadow-green-500/10" :
                      inv.status === 'Overdue' ? "bg-red-500/10 text-red-600 shadow-red-500/10" :
                      "bg-amber-500/10 text-amber-600 shadow-amber-500/10"
                    )}>
                      {inv.status} Protocol
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 py-12 border-y border-dashed border-navy/10 mb-16">
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/20">Archived Period</p>
                      <p className="text-[18px] font-bold text-navy tracking-tight italic uppercase">
                        {new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/20">Fiscal Valuation</p>
                      <div className="flex items-baseline justify-end gap-2">
                        <span className="text-[20px] font-display font-bold text-gold italic">₹</span>
                        <span className="text-[44px] font-display font-bold text-gold tracking-tighter leading-none">{inv.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    {inv.status !== 'Paid' && (
                      <Button 
                        className="flex-[2] bg-navy text-gold hover:bg-navy/95 font-bold rounded-[28px] h-20 text-[14px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/40 active:scale-95 transition-all group relative overflow-hidden"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/app/payment/${inv.id}`);
                        }}
                      >
                        <span className="relative z-10">Liquidate Record</span>
                        <div className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      className="flex-1 border border-navy/5 text-navy/20 hover:text-navy group-hover:text-navy active:text-navy font-bold rounded-[28px] h-20 text-[14px] uppercase tracking-[0.4em] hover:bg-navy/5 transition-all"
                    >
                      Audit
                    </Button>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gold/[0.02] rounded-bl-full pointer-events-none group-hover:bg-gold/5 transition-colors duration-1000" />
                </motion.div>
              ))
            ) : (
              <div className="py-32">
                <EmptyState 
                  title="Ledger Nullified"
                  description="Fiscal records and authenticated statements will manifest here upon system engagement."
                  actionLabel="Initiate Deployment"
                  onAction={() => navigate('/app/book')}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Invoices;
