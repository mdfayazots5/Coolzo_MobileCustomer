import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Download, 
  CreditCard, 
  AlertCircle,
  Search,
  Filter,
  FileText,
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
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Unpaid' | 'Paid' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;
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
  }, [user]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesTab = activeTab === 'All' || inv.status === activeTab || (activeTab === 'Unpaid' && inv.status === 'Pending');
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         inv.jobId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalOutstanding = invoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

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
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">My Invoices</h1>
        </div>

        {/* Outstanding Banner */}
        {totalOutstanding > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/60">Outstanding Balance</p>
                <p className="text-lg font-display font-bold text-amber-700">₹{totalOutstanding.toLocaleString()}</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold h-9"
              onClick={() => setActiveTab('Unpaid')}
            >
              Pay All
            </Button>
          </motion.div>
        )}

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
            <input 
              type="text"
              placeholder="Search invoice or SR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-navy/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            />
          </div>
          <button className="w-11 h-11 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 py-4 overflow-x-auto no-scrollbar">
        {['All', 'Unpaid', 'Paid', 'Overdue'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
              activeTab === tab 
                ? "bg-navy text-gold" 
                : "bg-white text-navy/40 border border-navy/5"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invoice List */}
      <div className="px-6 pb-10 space-y-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((inv) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm group active:scale-[0.98] transition-all"
              onClick={() => navigate(`/app/invoice/${inv.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">{inv.invoiceNumber}</p>
                  <h3 className="font-bold text-navy">Service Job {inv.jobId}</h3>
                </div>
                <Badge className={cn(
                  "border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1",
                  inv.status === 'Paid' ? "bg-green-50 text-green-600" :
                  inv.status === 'Overdue' ? "bg-red-50 text-red-600" :
                  "bg-amber-50 text-amber-600"
                )}>
                  {inv.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-navy/5 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Date</p>
                  <p className="text-sm font-bold text-navy">{new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Amount</p>
                  <p className="text-lg font-display font-bold text-navy">₹{inv.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {inv.status !== 'Paid' && (
                  <Button className="flex-1 bg-gold text-navy font-bold rounded-xl h-11 gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </Button>
                )}
                <Button variant="outline" className="flex-1 border-navy/10 text-navy/60 font-bold rounded-xl h-11 gap-2">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <EmptyState 
            icon={FileText}
            title="No Invoices Found"
            description="We couldn't find any invoices matching your criteria. Invoices appear after your first completed service."
            actionLabel="Book a Service"
            onAction={() => navigate('/app/book')}
          />
        )}
      </div>
    </div>
  );
};

export default Invoices;
