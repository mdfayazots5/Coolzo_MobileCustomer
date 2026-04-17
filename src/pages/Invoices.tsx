import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText
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
    .reduce((sum, inv) => sum + inv.amount, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <p className="text-gold font-bold uppercase tracking-widest animate-pulse text-xs">Loading Invoices...</p>
      </div>
    );
  }

  return (
    <div className="px-6 pt-2 pb-20 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-display font-bold text-navy mb-1">My Invoices</h1>
        <p className="text-navy/60 text-xs">Track and manage your service payments.</p>
      </div>

      {/* Outstanding Banner */}
      {totalOutstanding > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-[32px] p-6 border border-amber-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
              !
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/60">Outstanding</p>
              <p className="text-xl font-display font-bold text-amber-700">₹{totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
          <Button 
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold px-6 h-12"
            onClick={() => setActiveTab('Unpaid')}
          >
            Pay All
          </Button>
        </motion.div>
      )}

      {/* Tabs Filter - Only show if records > 10 */}
      {invoices.length > 10 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['All', 'Unpaid', 'Paid', 'Overdue'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                activeTab === tab 
                  ? "bg-navy text-gold shadow-lg shadow-navy/10" 
                  : "bg-white text-navy/40 border border-navy/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Invoice List */}
      <div className="space-y-4">
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
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-navy/20" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">{inv.invoiceNumber}</p>
                    <h3 className="font-bold text-navy text-sm">Service Job {inv.jobId}</h3>
                  </div>
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

              <div className="flex items-center justify-between py-4 border-y border-navy/5 mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Date</p>
                  <p className="text-xs font-bold text-navy">{new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Amount</p>
                  <p className="text-lg font-display font-bold text-navy text-gold">₹{inv.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {inv.status !== 'Paid' && (
                  <Button className="flex-1 bg-gold text-navy hover:bg-gold/90 font-bold rounded-2xl h-12">
                    Pay Now
                  </Button>
                )}
                <Button variant="outline" className="flex-1 border-navy/10 text-navy/60 font-bold rounded-2xl h-12">
                  View PDF
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <EmptyState 
            title="No Invoices Found"
            description="We couldn't find any invoices matching your criteria."
            actionLabel="Book a Service"
            onAction={() => navigate('/app/book')}
          />
        )}
      </div>
    </div>
  );
};

export default Invoices;
