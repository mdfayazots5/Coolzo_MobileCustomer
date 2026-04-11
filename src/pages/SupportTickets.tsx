import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/EmptyState';
import { SupportService, SupportTicket } from '@/services/supportService';
import { useAuthStore } from '@/store/useAuthStore';

const SupportTickets = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      try {
        const data = await SupportService.getTickets(user.uid);
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [user]);

  const filteredTickets = tickets.filter(t => 
    activeTab === 'All' || t.status === activeTab
  );

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-bold text-navy">Support Tickets</h1>
          </div>
          <Button 
            size="sm" 
            className="bg-gold text-navy rounded-xl font-bold h-10 px-4 gap-2"
            onClick={() => navigate('/app/support/new')}
          >
            <Plus className="w-4 h-4" />
            New
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['All', 'Open', 'In Progress', 'Resolved'].map((tab) => (
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
      </div>

      {/* Ticket List */}
      <div className="px-6 py-8 space-y-4 pb-20">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm group active:scale-[0.98] transition-all"
              onClick={() => navigate(`/app/support/${ticket.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <Badge className={cn(
                  "border-none font-bold text-[8px] uppercase tracking-widest px-3 py-1",
                  ticket.status === 'Resolved' ? "bg-green-50 text-green-600" :
                  ticket.status === 'In Progress' ? "bg-amber-50 text-amber-600" :
                  "bg-blue-50 text-blue-600"
                )}>
                  {ticket.status}
                </Badge>
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/20">#{ticket.id.slice(0, 6)}</p>
              </div>

              <h3 className="font-bold text-navy mb-2 leading-tight">{ticket.subject}</h3>
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-navy/5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-navy/40">
                  <Clock className="w-3 h-3" />
                  {ticket.createdAt?.toDate ? ticket.createdAt.toDate().toLocaleDateString() : new Date(ticket.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-navy/40">
                  <MessageSquare className="w-3 h-3" />
                  {ticket.messages.length} Messages
                </div>
                {ticket.status === 'In Progress' && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <EmptyState 
            icon={MessageSquare}
            title="No Tickets Yet"
            description="All good! No support tickets at the moment. Need help? Raise a ticket and our team will assist you."
            actionLabel="Raise New Ticket"
            onAction={() => navigate('/app/support/new')}
          />
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
