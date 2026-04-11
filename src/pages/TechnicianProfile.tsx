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
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-white items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-navy mb-2">Technician not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {/* Hero Header */}
      <div className="bg-navy p-8 pt-12 text-warm-white rounded-b-[40px] relative overflow-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-8"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-[32px] bg-gold/20 border-2 border-gold/30 overflow-hidden">
            <img src={technician.photoUrl} alt={technician.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gold">{technician.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="font-bold text-sm">{technician.rating}</span>
              <span className="text-warm-white/40 text-xs">• {technician.totalJobs} Jobs</span>
            </div>
            <Badge className="mt-3 bg-gold/10 text-gold border-none font-bold text-[10px] uppercase tracking-widest">
              {technician.verified ? 'Verified Expert' : 'Expert'}
            </Badge>
          </div>
        </div>
        
        <Award className="absolute -right-10 -bottom-10 w-48 h-48 text-warm-white/5" />
      </div>

      <div className="p-8 space-y-8 pb-32">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Briefcase, label: 'Experience', val: technician.experience },
            { icon: ShieldCheck, label: 'Verified', val: technician.verified ? 'Yes' : 'No' },
            { icon: MessageSquare, label: 'Language', val: technician.languages.join(', ') }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-border text-center space-y-2">
              <stat.icon className="w-5 h-5 text-gold mx-auto" />
              <div>
                <p className="text-[8px] font-bold uppercase tracking-widest text-text-secondary">{stat.label}</p>
                <p className="text-[10px] font-bold text-navy truncate">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary ml-1">Specialization</h3>
          <div className="flex flex-wrap gap-2">
            {technician.specialization.map((spec, i) => (
              <Badge key={i} variant="outline" className="border-navy/10 text-navy/60">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Recent Reviews</h3>
            <button className="text-[10px] font-bold text-gold uppercase tracking-widest">View All</button>
          </div>
          <div className="space-y-3">
            {REVIEWS.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-white p-5 rounded-[28px] border border-border shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center text-navy/20 font-bold text-xs">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy">{review.userName}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-2 h-2 ${i < review.rating ? 'text-gold fill-gold' : 'text-navy/10'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-navy/20 uppercase tracking-widest">{review.date}</span>
                </div>
                <p className="text-[11px] text-navy/60 leading-relaxed italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfile;
