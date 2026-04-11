import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Upload, 
  X, 
  CheckCircle2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { JOBS } from '@/lib/mockData';
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
        toast.error('Maximum 3 attachments allowed');
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
    if (!category || !subject || !description) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-warm-white">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </motion.div>
        <h2 className="text-3xl font-display font-bold text-navy mb-4">Ticket Raised!</h2>
        <p className="text-navy/60 mb-10 leading-relaxed">
          Your ticket has been submitted successfully. Our support team will review it and get back to you within 4-6 business hours.
        </p>
        <div className="w-full space-y-3">
          <Button 
            className="w-full h-14 rounded-2xl bg-navy text-gold font-bold"
            onClick={() => navigate('/app/support')}
          >
            View My Tickets
          </Button>
          <Button 
            variant="ghost"
            className="w-full h-14 rounded-2xl text-navy/40 font-bold"
            onClick={() => navigate('/app')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-navy/5 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Raise New Ticket</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8 pb-20">
        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Category *</label>
          <div className="relative">
            <select 
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (!subject) setSubject(`Query regarding ${e.target.value}`);
              }}
              className="w-full h-14 pl-5 pr-12 bg-white border border-navy/5 rounded-2xl text-sm font-bold text-navy appearance-none focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/20 pointer-events-none" />
          </div>
        </div>

        {/* Related Booking */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Related Booking (Optional)</label>
          <div className="relative">
            <select 
              value={srNumber}
              onChange={(e) => setSrNumber(e.target.value)}
              className="w-full h-14 pl-5 pr-12 bg-white border border-navy/5 rounded-2xl text-sm font-bold text-navy appearance-none focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            >
              <option value="">None</option>
              {JOBS.slice(0, 5).map(job => (
                <option key={job.id} value={job.srNumber}>
                  {job.srNumber} - {job.serviceType} ({new Date(job.date).toLocaleDateString()})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/20 pointer-events-none" />
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Subject *</label>
          <input 
            type="text"
            placeholder="Briefly describe the issue"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-14 px-5 bg-white border border-navy/5 rounded-2xl text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Description *</label>
          <textarea 
            placeholder="Tell us more about the problem..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full p-5 bg-white border border-navy/5 rounded-2xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none"
          />
        </div>

        {/* Attachments */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Attachments (Max 3)</label>
          <div className="grid grid-cols-3 gap-4">
            {attachments.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-center overflow-hidden">
                <div className="text-center p-2">
                  <p className="text-[8px] font-bold text-navy/40 truncate w-full px-2">{file.name}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {attachments.length < 3 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-navy/10 flex flex-col items-center justify-center cursor-pointer hover:bg-navy/5 transition-colors">
                <Upload className="w-6 h-6 text-navy/20 mb-2" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-navy/40">Add File</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
              </label>
            )}
          </div>
          <p className="text-[10px] text-navy/30 font-medium italic">Max 5MB per file. Images or documents only.</p>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 rounded-[24px] bg-gold text-navy font-bold text-lg shadow-xl shadow-gold/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-navy/20 border-t-navy rounded-full animate-spin" />
                Submitting...
              </div>
            ) : 'Submit Ticket'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RaiseTicket;
