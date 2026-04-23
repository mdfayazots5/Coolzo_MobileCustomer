import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Star,
  CheckCircle2,
  Clock,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SupportService, SupportTicket } from '@/services/supportService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [pendingMessageId, setPendingMessageId] = useState<string | null>(null);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = SupportService.onTicketUpdate(id, (data) => {
      setTicket(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !id) return;
    const optimisticMessageId = `pending-${Date.now()}`;
    const optimisticMessage = {
      id: optimisticMessageId,
      sender: 'User' as const,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setPendingMessageId(optimisticMessageId);
    setTicket((current) => current ? {
      ...current,
      messages: [...current.messages, optimisticMessage],
      updatedAt: optimisticMessage.timestamp,
    } : current);

    try {
      await SupportService.addMessage(id, 'User', optimisticMessage.text);
      toast.success('Transmission successful');
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      setTicket((current) => current ? {
        ...current,
        messages: current.messages.filter((message) => message.id !== optimisticMessageId),
      } : current);
      toast.error('Signal failure');
    } finally {
      setPendingMessageId(null);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []) as File[];
    const invalid = files.find((file) => file.size > 5 * 1024 * 1024);

    if (invalid) {
      toast.error('Attachments must be 5 MB or less.');
      return;
    }

    setAttachments((current) => [...current, ...files].slice(0, 3));
  };

  const handleCloseTicket = async () => {
    if (!id) return;

    try {
      await SupportService.closeTicket(id, 'Closed by customer from mobile app.');
      setShowRatingPrompt(true);
      const refreshedTicket = await SupportService.getTicketById(id);
      setTicket(refreshedTicket);
      toast.success('Ticket closed successfully');
    } catch (error) {
      toast.error('Unable to close the ticket');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-16 h-16 text-gold animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center p-12 text-center relative overflow-hidden italic">
        <div className="absolute top-0 right-0 w-80 h-80 bg-navy/[0.02] rounded-bl-full blur-[60px]" />
        <h2 className="text-[48px] font-display font-bold text-navy tracking-tighter leading-none mb-10 uppercase">Inquiry <span className="text-gold">Nullified.</span></h2>
        <Button onClick={() => navigate('/app/support/tickets')} className="bg-navy text-gold font-bold rounded-[32px] px-16 h-22 shadow-3xl shadow-navy/40 uppercase tracking-[0.4em] active:scale-95 transition-all">Return to Registry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-warm-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-navy/[0.02] rounded-full blur-[160px] -mr-60 -mt-60 pointer-events-none" />

      <div className="bg-navy px-8 pt-16 pb-16 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-50">
        <div className="flex items-center justify-between gap-8 mb-12 relative z-10 italic">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate(-1)}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform shadow-3xl"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="space-y-2">
              <h1 className="text-[32px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Trace: {(ticket.ticketNumber || ticket.id).slice(0, 8).toUpperCase()}</h1>
              <p className="text-warm-white/30 text-[11px] font-bold uppercase tracking-[0.4em] leading-none">{ticket.category} Protocol</p>
            </div>
          </div>
          <button className="w-14 h-14 rounded-[22px] bg-white/5 flex items-center justify-center text-gold/40 active:scale-90 transition-all hover:bg-gold hover:text-navy shadow-inner border border-white/5">
            <MoreVertical className="w-7 h-7" />
          </button>
        </div>

        <div className="flex items-center justify-between relative z-10 italic">
          <div className="flex gap-6">
            <Badge className={cn(
              "border-none font-bold text-[11px] uppercase tracking-[0.4em] px-8 py-3 rounded-full shadow-3xl shadow-black/20",
              ticket.status === 'Resolved' ? "bg-green-500/20 text-green-400" :
              ticket.status === 'In Progress' ? "bg-amber-500/20 text-amber-400" :
              ticket.status === 'Closed' ? "bg-slate-500/20 text-slate-200" :
              "bg-blue-500/20 text-blue-400"
            )}>
              {ticket.status}
            </Badge>
            <div className="h-12 px-8 rounded-full border border-white/10 flex items-center gap-4 bg-white/5 shadow-inner">
              <Clock className="w-5 h-5 text-gold/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">{ticket.priority || 'Normal'} Priority</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/20">Secure Liaison Hub</span>
          </div>
        </div>
      </div>

      {showRatingPrompt && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-navy/30 px-8">
          <div className="w-full max-w-md rounded-[40px] bg-white p-10 shadow-3xl shadow-black/20">
            <h3 className="text-[24px] font-display font-bold text-navy uppercase tracking-tight">Rate Your Support Experience</h3>
            <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.3em] text-navy/20">Closure feedback helps improve response quality.</p>
            <div className="mt-8 flex items-center justify-center gap-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className="active:scale-95 transition-transform"
                >
                  <Star className={cn('w-8 h-8', selectedRating && rating <= selectedRating ? 'fill-gold text-gold' : 'text-navy/20')} />
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <Button className="flex-1 bg-navy text-gold" onClick={() => setShowRatingPrompt(false)}>Done</Button>
            </div>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-12 space-y-16 no-scrollbar relative z-10 pb-48 italic"
      >
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-10 py-4 bg-navy/[0.03] rounded-full border border-navy/5 shadow-inner"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-navy/20">
              Protocol Document Generated • {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </motion.div>
        </div>

        {ticket.messages.map((msg, index) => (
          <motion.div 
            key={msg.id || index}
            initial={{ opacity: 0, x: msg.sender === 'User' ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "flex flex-col max-w-[85%] relative group",
              msg.sender === 'User' ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div className={cn(
              "p-10 text-[18px] leading-relaxed shadow-3xl font-bold tracking-tight uppercase transition-all duration-700 active:scale-[0.98]",
              msg.sender === 'User' 
                ? "bg-navy text-warm-white rounded-[56px] rounded-tr-none shadow-navy/30" 
                : "bg-white text-navy border border-navy/5 rounded-[56px] rounded-tl-none shadow-black/[0.02] group-hover:border-gold/30"
            )}>
              {msg.text}
            </div>
            <div className={cn(
              "flex items-center gap-4 mt-6 px-6 transition-opacity duration-1000",
              msg.sender === 'User' ? "flex-row-reverse" : "flex-row"
            )}>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-navy/30">
                {msg.sender === 'Support' ? 'Institutional Intelligence' : 'Executive Directive'}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-gold/30" />
              <span className="text-[11px] font-bold text-navy/30 uppercase tracking-[0.3em]">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {msg.sender === 'User' && (
                <div className="flex gap-0.5">
                  <CheckCircle2 className={cn("w-4 h-4", msg.id === pendingMessageId ? "text-navy/20" : "text-gold/40")} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-3xl border-t border-navy/5 p-10 pb-20 relative z-50 rounded-t-[72px] shadow-3xl italic">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        {(ticket.status === 'Resolved' || ticket.status === 'Closed') ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/5 rounded-[48px] p-12 text-center border border-green-500/10 flex flex-col items-center gap-6 shadow-3xl shadow-green-500/5"
          >
            <div className="w-16 h-16 rounded-[24px] bg-green-500/10 flex items-center justify-center text-green-600 mb-2 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <p className="text-[18px] font-display font-bold text-green-600 uppercase tracking-[0.4em] leading-none">Protocol Success: {ticket.status}</p>
              <p className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.4em]">Archived System Interaction</p>
            </div>
            {ticket.canCustomerClose && ticket.status !== 'Closed' && (
              <button
                className="text-[12px] font-bold uppercase tracking-[0.4em] text-navy/40 hover:text-gold transition-all border-b border-transparent hover:border-gold pb-1 italic underline-offset-8 decoration-gold decoration-2"
                onClick={handleCloseTicket}
              >
                Confirm Ticket Closure
              </button>
            )}
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {ticket.canCustomerClose && (
              <Button variant="outline" className="w-full border-navy/10 text-navy" onClick={handleCloseTicket}>
                Close Ticket
              </Button>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-8">
              <label className="w-20 h-20 rounded-[32px] bg-navy/[0.04] flex items-center justify-center text-navy/20 active:scale-95 transition-all hover:bg-gold/10 hover:text-gold shadow-inner border border-navy/5 cursor-pointer">
                <Paperclip className="w-8 h-8" />
                <input type="file" className="hidden" multiple onChange={handleAttachmentChange} />
              </label>
              <div className="flex-1 relative group">
                <input 
                  type="text"
                  placeholder="Transmission details..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full h-20 pl-10 pr-24 bg-navy/[0.03] rounded-[40px] text-[18px] font-bold text-navy focus:outline-none focus:bg-white focus:ring-4 focus:ring-gold/10 transition-all border border-navy/5 shadow-inner focus:shadow-3xl focus:shadow-gold/5 placeholder:text-navy/10"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-[28px] bg-navy text-gold flex items-center justify-center shadow-3xl shadow-navy/40 disabled:grayscale disabled:opacity-20 active:scale-95 transition-all hover:bg-gold hover:text-navy group/send overflow-hidden"
                >
                  <Send className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </button>
              </div>
            </form>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {attachments.map((file) => (
                  <div key={file.name} className="rounded-full bg-navy/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-navy/40">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
