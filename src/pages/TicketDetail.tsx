import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Send, 
  Paperclip, 
  MoreVertical, 
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SUPPORT_TICKETS } from '@/lib/mockData';
import { toast } from 'sonner';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = SUPPORT_TICKETS.find(t => t.id === id);
  
  const [newMessage, setNewMessage] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.messages]);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-2xl font-display font-bold text-navy mb-4">Ticket Not Found</h2>
        <Button onClick={() => navigate('/app/support')}>Back to Tickets</Button>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // In a real app, we'd update the store/API
    toast.success('Message sent');
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 z-30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-display font-bold text-navy leading-tight">{ticket.ticketNumber}</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">{ticket.category}</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge className={cn(
              "border-none font-bold text-[8px] uppercase tracking-widest px-3 py-1",
              ticket.status === 'Resolved' ? "bg-green-50 text-green-600" :
              ticket.status === 'In Progress' ? "bg-amber-50 text-amber-600" :
              "bg-blue-50 text-blue-600"
            )}>
              {ticket.status}
            </Badge>
            <Badge variant="outline" className="border-navy/10 text-navy/40 font-bold text-[8px] uppercase tracking-widest px-3 py-1">
              {ticket.priority} Priority
            </Badge>
          </div>
          {ticket.srNumber && (
            <button 
              onClick={() => navigate(`/app/job/${ticket.srNumber}`)}
              className="text-[10px] font-bold text-gold flex items-center gap-1"
            >
              Ref: {ticket.srNumber}
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar"
      >
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-navy/20">
            Ticket created on {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>

        {ticket.messages.map((msg) => (
          <div 
            key={msg.id}
            className={cn(
              "flex flex-col max-w-[85%]",
              msg.sender === 'Customer' ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div className={cn(
              "p-4 rounded-[24px] text-sm leading-relaxed shadow-sm",
              msg.sender === 'Customer' 
                ? "bg-navy text-warm-white rounded-tr-none" 
                : "bg-white text-navy border border-navy/5 rounded-tl-none"
            )}>
              {msg.text}
            </div>
            <div className="flex items-center gap-2 mt-2 px-1">
              <p className="text-[8px] font-bold uppercase tracking-widest text-navy/20">
                {msg.sender === 'Agent' ? 'Coolzo Support' : 'You'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {msg.sender === 'Customer' && (
                <CheckCircle2 className="w-2.5 h-2.5 text-gold" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-navy/5 p-6 pb-10">
        {ticket.status === 'Resolved' || ticket.status === 'Closed' ? (
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-xs font-bold text-green-600">This ticket has been resolved.</p>
            <button className="text-[10px] font-bold uppercase tracking-widest text-green-600/60 mt-1 underline">Reopen Ticket</button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <button 
              type="button"
              className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/40 active:scale-90 transition-transform"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full h-12 pl-5 pr-12 bg-navy/5 rounded-2xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gold text-navy flex items-center justify-center disabled:opacity-30 active:scale-90 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
