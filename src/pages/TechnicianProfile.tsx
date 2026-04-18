import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Star, ShieldCheck, Award, MessageSquare, Briefcase, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TechnicianService, Technician } from '@/services/technicianService';
import { REVIEWS } from '@/lib/mockData';

const TechnicianProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTechnician = async () => {
      if (!id) return;
      try {
        const data = await TechnicianService.getTechnicianById(id);
        setTechnician(data);
      } catch (error) {
        console.error('Failed to fetch technician:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTechnician();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-navy/[0.02] rounded-bl-full blur-[60px]" />
        <h2 className="text-[40px] font-display font-bold text-navy tracking-tighter leading-none mb-8">Identity <span className="text-gold italic">Nullified.</span></h2>
        <Button onClick={() => navigate(-1)} className="bg-navy text-gold font-bold rounded-[24px] px-12 h-18 shadow-2xl shadow-navy/40 uppercase tracking-widest active:scale-95 transition-all">Return to Grid</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white pb-40">
      {/* Elite Hero Header */}
      <div className="bg-navy px-8 pt-16 pb-24 text-warm-white rounded-b-[72px] relative overflow-hidden shadow-2xl shadow-navy/40">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-12 active:scale-95 transition-all shadow-2xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
          <div className="w-32 h-32 rounded-[48px] bg-gold/10 border-2 border-gold/30 p-1.5 relative shadow-inner group">
            <div className="w-full h-full rounded-[44px] overflow-hidden border-2 border-navy relative">
              <img src={technician.photoUrl} alt={technician.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gold flex items-center justify-center text-navy shadow-2xl border-4 border-navy group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-[44px] font-display font-bold text-warm-white tracking-tighter leading-none italic">{technician.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
              <div className="flex items-center gap-2.5 bg-gold/10 px-5 py-2 rounded-full border border-gold/30 shadow-2xl shadow-gold/10">
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="font-bold text-[14px] text-gold tracking-tight">{technician.rating}</span>
              </div>
              <span className="text-warm-white/40 text-[11px] font-bold uppercase tracking-[0.3em]">• {technician.totalJobs} Elite Deployments</span>
            </div>
            <Badge className="bg-gold text-navy border-none font-bold text-[10px] uppercase tracking-[0.4em] px-6 py-2 rounded-full shadow-2xl shadow-gold/30">
              {technician.verified ? 'Institutional Elite' : 'Certified Operative'}
            </Badge>
          </div>
        </div>
        
        <Award className="absolute -right-20 -bottom-20 w-80 h-80 text-warm-white/[0.03] rotate-12 pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="px-8 py-16 space-y-20 pb-40">
        {/* Precision Stats Grid */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: Briefcase, label: 'Mastery Phase', val: technician.experience },
            { icon: ShieldCheck, label: 'Identity Status', val: technician.verified ? 'Verified' : 'Active' },
            { icon: MessageSquare, label: 'Comm. Vector', val: technician.languages[0] }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] border border-navy/5 text-center space-y-4 shadow-2xl shadow-black/[0.01] hover:border-gold/30 transition-all group relative overflow-hidden active:scale-95">
              <div className="w-12 h-12 rounded-[18px] bg-navy/5 flex items-center justify-center text-navy/10 mx-auto group-hover:bg-navy group-hover:text-gold transition-all duration-700 shadow-inner group-hover:rotate-6">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-navy/20">{stat.label}</p>
                <p className="text-[14px] font-bold text-navy truncate tracking-tighter">{stat.val}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-gold/[0.02] rounded-full group-hover:bg-gold/5 transition-colors duration-700" />
            </div>
          ))}
        </div>

        {/* Master Specialization */}
        <section className="space-y-8">
          <div className="flex items-end justify-between px-2">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20">Operational Domain</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {technician.specialization.map((spec, i) => (
              <div key={i} className="h-12 px-8 rounded-full border border-navy/5 text-navy/60 bg-white font-bold text-[14px] shadow-sm flex items-center hover:border-gold/30 hover:text-navy transition-all cursor-default">
                {spec}
              </div>
            ))}
          </div>
        </section>

        {/* Session Echoes Archive */}
        <section className="space-y-12">
          <div className="flex items-end justify-between px-4">
            <div className="space-y-2">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.5em] text-navy/20">Patron Audit</h3>
              <h2 className="text-[32px] font-display font-bold text-navy tracking-tighter leading-none italic">Session <span className="text-gold">Echoes</span></h2>
            </div>
            <button className="text-[11px] font-bold text-gold uppercase tracking-[0.4em] bg-gold/5 px-8 py-3.5 rounded-full border border-gold/10 active:scale-90 transition-all hover:bg-gold/10 shadow-sm">Archive</button>
          </div>
          <div className="space-y-8">
            {REVIEWS.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-white p-10 rounded-[56px] border border-navy/5 shadow-2xl shadow-black/[0.01] relative overflow-hidden group active:scale-[0.99] transition-all hover:border-gold/30 lg:px-12">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-[22px] bg-navy text-gold flex items-center justify-center font-display font-bold text-[22px] shadow-2xl shadow-navy/30 group-hover:rotate-3 transition-transform">
                      {review.userName.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[18px] font-bold text-navy tracking-tight group-hover:text-gold transition-colors">{review.userName}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-gold fill-gold' : 'text-navy/10'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.3em]">{new Date(review.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
                <p className="text-[15px] text-navy/60 leading-relaxed italic font-medium">"{review.comment}"</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.02] rounded-bl-full pointer-events-none group-hover:bg-gold/5 transition-colors duration-1000" />
              </div>
            ))}
          </div>
        </section>

        {/* Global Action Terminal */}
        <div className="fixed bottom-0 left-0 right-0 p-10 bg-white/95 backdrop-blur-3xl border-t border-navy/5 z-50 rounded-t-[56px] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)]">
          <div className="max-w-[480px] mx-auto">
            <Button 
              onClick={() => navigate('/app/book')}
              className="w-full h-20 rounded-[32px] bg-navy text-gold hover:bg-navy/95 font-bold text-[18px] uppercase tracking-[0.3em] shadow-2xl shadow-navy/40 active:scale-95 transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Request Operative</span>
              <div className="absolute inset-0 bg-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfile;
