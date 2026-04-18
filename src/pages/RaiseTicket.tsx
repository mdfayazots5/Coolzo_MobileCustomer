import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Upload, 
  X, 
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Loader2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { JOBS } from '@/lib/mockData';
import { SupportService } from '@/services/supportService';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const CATEGORIES = [
  'Booking Issue',
  'Technician Concern',
  'Invoice Query',
  'AMC Query',
  'App Issue',
  'General'
];

const RaiseTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const initialSrNumber = location.state?.srNumber || '';

  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [srNumber, setSrNumber] = useState(initialSrNumber);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (attachments.length + newFiles.length > 3) {
        toast.error('Maximum allocation: 3 artifacts');
        return;
      }
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Identity required for inquiry protocol');
      return;
    }
    if (!category || !subject || !description) {
      toast.error('Protocol fields incomplete');
      return;
    }

    setIsSubmitting(true);
    try {
      await SupportService.createTicket(user.uid, {
        category,
        subject,
        description,
        priority: 'Medium',
        status: 'Open'
      });
      setShowSuccess(true);
    } catch (error) {
      toast.error('Transmission failure');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-12 text-center bg-warm-white relative overflow-hidden italic">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.02] rounded-full blur-[120px] -mr-40 -mt-20 pointer-events-none" />
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-gold/10 rounded-[48px] flex items-center justify-center mb-16 shadow-3xl shadow-gold/20 relative"
        >
          <div className="absolute inset-0 bg-gold/20 rounded-[48px] animate-ping opacity-25" />
          <CheckCircle2 className="w-16 h-16 text-gold relative z-10" />
        </motion.div>
        <h2 className="text-[52px] font-display font-bold text-navy tracking-tighter leading-none mb-8 uppercase">Inquiry <span className="text-gold">Initialized</span></h2>
        <p className="text-[16px] text-navy/40 mb-16 leading-relaxed font-bold uppercase tracking-[0.3em] max-w-[360px]">
          Protocol submitted to the liaison hub. Institutional feedback expected within 4-6 operational hours. Authorized mastery.
        </p>
        <div className="w-full space-y-6 max-w-sm">
          <Button 
            className="w-full h-24 rounded-[32px] bg-navy text-gold font-bold text-[18px] uppercase tracking-[0.4em] shadow-3xl shadow-navy/40 active:scale-95 transition-all"
            onClick={() => navigate('/app/support')}
          >
            Access Registry
          </Button>
          <Button 
            variant="ghost"
            className="w-full h-18 rounded-[32px] text-navy/20 font-bold text-[14px] uppercase tracking-[0.4em] active:scale-95 transition-all hover:text-gold"
            onClick={() => navigate('/app')}
          >
            Return to Node
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-48 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/[0.03] rounded-full blur-[160px] -mr-40 -mt-20 pointer-events-none" />

      {/* Inquiry Header */}
      <div className="bg-navy px-8 pt-16 pb-28 text-warm-white rounded-b-[84px] relative overflow-hidden shadow-3xl shadow-navy/60 z-20">
        <div className="flex items-center gap-8 relative z-10 italic">
          <button 
            onClick={() => navigate(-1)}
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform shadow-3xl"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="space-y-2">
            <h1 className="text-[36px] font-display font-bold text-gold tracking-tighter leading-none uppercase">Raise Ticket</h1>
            <p className="text-warm-white/30 text-[11px] font-bold uppercase tracking-[0.4em] leading-none">Intelligence Initiation Profile</p>
          </div>
        </div>
        
        <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <form onSubmit={handleSubmit} className="px-8 -mt-16 space-y-20 pb-40 relative z-30 italic">
        <div className="bg-white p-12 rounded-[72px] shadow-3xl shadow-black/[0.01] border border-navy/5 space-y-20">
          {/* Objective Cluster */}
          <div className="space-y-10">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-2">Objective Class</h3>
            <div className="grid grid-cols-2 gap-6">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    if (!subject) setSubject(`Query regarding ${cat}`);
                  }}
                  className={cn(
                    "h-20 rounded-[32px] border text-[11px] font-bold uppercase tracking-[0.4em] transition-all relative overflow-hidden active:scale-95 group shadow-lg shadow-black/[0.02] flex items-center justify-center",
                    category === cat 
                      ? "bg-navy text-gold border-navy shadow-3xl shadow-navy/30" 
                      : "bg-navy/[0.02] text-navy/40 border-navy/5 hover:border-gold/30"
                  )}
                >
                  <span className="relative z-10">{cat.split(' ')[0]} Registry</span>
                  {category === cat && (
                    <motion.div 
                      layoutId="cat-indicator" 
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold shadow-3xl shadow-gold/40" 
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-16">
            {/* Asset Telemetry */}
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-6">Target Asset ID</label>
              <div className="relative group">
                <select 
                  value={srNumber}
                  onChange={(e) => setSrNumber(e.target.value)}
                  className="w-full h-22 pl-10 pr-20 bg-navy/[0.03] border border-navy/5 rounded-[40px] text-[18px] font-display font-bold text-navy appearance-none focus:outline-none focus:bg-white focus:ring-4 focus:ring-gold/10 transition-all shadow-inner focus:shadow-3xl focus:shadow-gold/5 uppercase"
                >
                  <option value="">General Institutional Inquiry</option>
                  {JOBS.slice(0, 5).map(job => (
                    <option key={job.id} value={job.srNumber}>
                      {job.srNumber} — {job.serviceType.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center pointer-events-none group-focus-within:bg-gold/10 transition-colors">
                  <ChevronDown className="w-5 h-5 text-navy/20 group-focus-within:text-gold" />
                </div>
              </div>
            </div>

            {/* Narrative Subject */}
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-6">Registry Subject</label>
              <input 
                type="text"
                placeholder="Core Subject of Dispatch"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-22 px-10 bg-navy/[0.03] border border-navy/5 rounded-[40px] text-[18px] font-bold text-navy focus:outline-none focus:bg-white focus:ring-4 focus:ring-gold/10 transition-all shadow-inner focus:shadow-3xl focus:shadow-gold/5 uppercase placeholder:text-navy/5"
              />
            </div>

            {/* Comprehensive Documentation */}
            <div className="space-y-6">
              <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-6">Detailed Narrative</label>
              <textarea 
                placeholder="Provide comprehensive details regarding the protocol anomaly..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full p-10 bg-navy/[0.03] border border-navy/5 rounded-[56px] text-[18px] font-bold text-navy focus:outline-none focus:bg-white focus:ring-4 focus:ring-gold/10 transition-all shadow-inner focus:shadow-3xl focus:shadow-gold/5 uppercase placeholder:text-navy/5 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Asset Evidence */}
          <div className="space-y-10">
            <label className="text-[12px] font-bold uppercase tracking-[0.6em] text-navy/20 ml-6">Supporting Artifacts</label>
            <div className="flex gap-8 overflow-x-auto no-scrollbar py-6 px-2">
              {attachments.map((file, i) => (
                <div key={i} className="flex-shrink-0 w-32 h-32 relative rounded-[40px] bg-navy/[0.05] border border-navy/5 flex items-center justify-center overflow-hidden shadow-inner group transition-all hover:border-gold/30">
                  <FileText className="w-10 h-10 text-gold/20" />
                  <button 
                    type="button"
                    onClick={() => removeAttachment(i)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-3xl active:scale-90 transition-transform opacity-0 group-hover:opacity-100 duration-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {attachments.length < 3 && (
                <label className="flex-shrink-0 w-32 h-32 rounded-[40px] border-2 border-dashed border-navy/10 flex flex-col items-center justify-center cursor-pointer hover:bg-gold/5 transition-all bg-navy/[0.01] active:scale-95 group hover:border-gold/30 shadow-inner">
                  <Upload className="w-10 h-10 text-navy/10 mb-3 group-hover:text-gold transition-all duration-1000 group-hover:rotate-12" />
                  <span className="text-[10px] font-bold uppercase text-navy/30 group-hover:text-gold transition-colors tracking-widest leading-none">Attach</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
                </label>
              )}
            </div>
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full h-26 rounded-[48px] bg-navy text-gold hover:bg-navy/95 font-bold text-[22px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] uppercase tracking-[0.45em] disabled:opacity-50 active:scale-95 transition-all group overflow-hidden relative shadow-3xl shadow-navy/40"
          >
            <span className="relative z-10">{isSubmitting ? 'Syncing...' : 'Dispatch Protocol'}</span>
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-[2000ms] origin-left" />
          </Button>
        </div>

        {/* Support Matrix Banner */}
        <section className="bg-gold rounded-[72px] p-12 flex items-center gap-10 shadow-3xl shadow-gold/30 relative overflow-hidden group active:scale-[0.99] transition-all">
          <div className="w-24 h-24 rounded-[36px] bg-white/30 flex items-center justify-center text-navy shadow-inner backdrop-blur-3xl group-hover:rotate-12 transition-transform duration-1000 shrink-0">
            <AlertCircle className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <p className="font-display font-bold text-navy text-[32px] tracking-tighter leading-none uppercase">Response Matrix</p>
            <p className="text-navy/50 text-[11px] uppercase font-bold tracking-[0.4em] leading-relaxed">Intelligence feedback within <br />2-4 business cycles. Authorized.</p>
          </div>
          <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-white/10 rounded-full blur-[60px] pointer-events-none group-hover:scale-125 transition-transform duration-[3000ms]" />
        </section>
      </form>
    </div>
  );
};

export default RaiseTicket;
