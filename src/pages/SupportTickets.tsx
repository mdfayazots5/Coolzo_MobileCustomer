import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  MessageSquare,
  ArrowRight,
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
    fetchInquiryLog();
  }, [user]);

  const fetchInquiryLog = async () => {
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

  const filteredTickets = tickets.filter(t => 
    activeTab === 'All' || t.status === activeTab
  );

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Intelligence Header */}
      <div className="bg-navy px-8 pt-16 pb-28 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center justify-between gap-8 relative z-10 italic">
          <div className="space-y-2">
            <h1 className="text-[36px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Intelligence Log</h1>
            <p className="text-warm-white/30 text-[11px] font-bold uppercase tracking-[0.4em] leading-none">Support & Liaison Registry</p>
          </div>
          <Button 
            onClick={() => navigate('/app/support/new')}
            className="w-18 h-18 rounded-[32px] bg-gold text-navy shadow-[0_20px_50px_-15px_rgba(201,162,74,0.4)] flex items-center justify-center p-0 active:scale-90 transition-all hover:bg-gold/90 group"
          >
            <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform duration-700" />
          </Button>
        </div>
        
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -left-40 -bottom-40 w-[500px] h-[500px] bg-white/5 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="px-8 -mt-16 space-y-20 pb-40 relative z-30">
        {/* Navigation Matrix */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 -mx-2 px-2">
          {['All', 'Open', 'In Progress', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "h-16 px-10 rounded-full text-[11px] font-bold uppercase tracking-[0.4em] transition-all whitespace-nowrap border flex items-center relative active:scale-95 shadow-lg shadow-black/[0.02] italic",
                activeTab === tab 
                  ? "bg-navy text-gold border-navy shadow-3xl shadow-navy/30" 
                  : "bg-white text-navy/30 border-navy/5 hover:border-gold/30"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="tab-indicator" 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold shadow-3xl shadow-gold/40" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Liaison Registry */}
        <section className="space-y-12">
          <div className="flex items-center justify-between px-6 italic">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 leading-none">Archived Inquiries</h3>
            <Badge className="bg-gold/5 text-gold/60 border border-gold/10 font-bold text-[10px] uppercase tracking-[0.3em] px-6 py-2 rounded-full italic animate-pulse">
              Liaison Sync: Active
            </Badge>
          </div>

          <div className="space-y-10">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-[72px] p-12 border border-navy/5 shadow-3xl shadow-black/[0.01] group active:scale-[0.98] transition-all hover:border-gold/30 hover:shadow-3xl hover:shadow-gold/[0.02] relative overflow-hidden italic"
                  onClick={() => navigate(`/app/support/tickets/${ticket.id}`)}
                >
                  <div className="flex justify-between items-start mb-16">
                    <div className="space-y-4">
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/20">Protocol Artifact</span>
                        <div className="h-px w-10 bg-gold/30" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/60">TRACE: {(ticket.ticketNumber || ticket.id).toUpperCase()}</span>
                      </div>
                      <h3 className="font-display font-bold text-navy text-[32px] tracking-tighter leading-tight uppercase group-hover:text-gold transition-colors duration-700">{ticket.subject}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/20">Last reply {new Date(ticket.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <Badge className={cn(
                      "border-none font-bold text-[11px] uppercase tracking-[0.4em] px-8 py-3 rounded-full shadow-3xl shadow-black/[0.05]",
                      ticket.status === 'Resolved' ? "bg-green-500/10 text-green-600" :
                      ticket.status === 'In Progress' ? "bg-amber-500/10 text-amber-600" :
                      "bg-blue-500/10 text-blue-600"
                    )}>
                      {ticket.status}
                    </Badge>
                    {ticket.hasUnreadReply && (
                      <div className="absolute top-12 right-12 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.55)]" />
                    )}
                  </div>

                  <div className="grid grid-cols-3 py-12 border-y border-dashed border-navy/10 mb-16 gap-10">
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/20">Registry Date</p>
                      <p className="text-[16px] font-display font-bold text-navy tracking-tight uppercase leading-none">
                        {ticket.createdAt?.toDate 
                          ? ticket.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) 
                          : new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div className="space-y-3 text-center border-x border-navy/5 px-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/20">Classification</p>
                      <p className="text-[16px] font-display font-bold text-navy tracking-tight uppercase leading-none">{ticket.category}</p>
                    </div>
                    <div className="space-y-3 text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-navy/20">Priority</p>
                      <p className={cn(
                        "text-[16px] font-display font-bold tracking-tight uppercase leading-none",
                        ticket.priority === 'High' ? "text-red-500" : "text-navy"
                      )}>{ticket.priority || 'Normal'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex -space-x-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-14 h-14 rounded-[22px] border-[4px] border-white bg-navy/5 flex items-center justify-center shadow-3xl group-hover:translate-x-4 transition-transform duration-700 overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gold/20 to-navy/5 flex items-center justify-center">
                            <MessageSquare className="w-7 h-7 text-gold/60" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="px-10 h-18 rounded-[32px] text-[12px] font-bold uppercase tracking-[0.4em] text-gold group-hover:gap-10 transition-all flex items-center gap-6 bg-gold/5 border border-gold/10 hover:bg-gold hover:text-navy hover:border-gold shadow-3xl shadow-gold/5"
                    >
                      Analyze Interaction
                      <ArrowRight className="w-6 h-6" />
                    </Button>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gold/[0.02] rounded-bl-full pointer-events-none group-hover:bg-gold/[0.05] transition-colors duration-1000" />
                </motion.div>
              ))
            ) : (
              <div className="py-32">
                <EmptyState 
                  title="Registry Nullified"
                  description="Intelligence logs and liaison records will manifest here upon system engagement. Initial dispatch protocol recommended."
                  actionLabel="Initialize Dispatch"
                  onAction={() => navigate('/app/support/new')}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupportTickets;
