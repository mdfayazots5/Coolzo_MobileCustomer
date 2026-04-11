import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Copy, 
  Share2, 
  Gift, 
  Users, 
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { USER_REFERRALS } from '@/lib/mockData';
import { toast } from 'sonner';

const ReferFriend = () => {
  const navigate = useNavigate();
  const referralCode = 'COOLZO2026';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const totalEarned = USER_REFERRALS.reduce((sum, r) => sum + r.reward, 0);

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
          <h1 className="text-xl font-display font-bold text-navy">Refer a Friend</h1>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Hero Card */}
        <div className="bg-navy rounded-[40px] p-8 text-warm-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold text-gold mb-2">Give ₹250, Get ₹250</h2>
            <p className="text-warm-white/60 text-sm leading-relaxed mb-8">
              Invite your friends to Coolzo. They get ₹250 off their first service, and you get ₹250 in credits when they complete it.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-widest text-warm-white/40 mb-1">Your Referral Code</p>
                <p className="text-xl font-display font-bold text-gold tracking-widest">{referralCode}</p>
              </div>
              <button 
                onClick={copyToClipboard}
                className="w-12 h-12 rounded-xl bg-gold text-navy flex items-center justify-center active:scale-90 transition-transform"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>
          <Gift className="absolute -right-10 -bottom-10 w-48 h-48 text-warm-white/5 rotate-12" />
        </div>

        {/* How it Works */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">How it Works</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Share2, label: 'Share Link', desc: 'Send your code to friends' },
              { icon: Users, label: 'Friend Joins', desc: 'They book their first service' },
              { icon: Gift, label: 'Get Reward', desc: 'You both get ₹250 credits' }
            ].map((step, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mx-auto">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-navy mb-1">{step.label}</p>
                  <p className="text-[8px] text-navy/40 leading-tight">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-white rounded-[32px] p-6 border border-navy/5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Total Credits Earned</p>
            <p className="text-2xl font-display font-bold text-navy">₹{totalEarned}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 mb-1">Friends Referred</p>
            <p className="text-2xl font-display font-bold text-navy">{USER_REFERRALS.length}</p>
          </div>
        </div>

        {/* My Referrals */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">My Referrals</h3>
          <div className="space-y-3">
            {USER_REFERRALS.map((ref) => (
              <div key={ref.id} className="bg-white rounded-2xl p-4 border border-navy/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40 font-bold">
                    {ref.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">{ref.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-navy/20">{ref.status}</p>
                  </div>
                </div>
                {ref.reward > 0 ? (
                  <p className="text-sm font-bold text-green-600">+₹{ref.reward}</p>
                ) : (
                  <Badge variant="outline" className="border-navy/10 text-navy/20 text-[8px] uppercase tracking-widest">Pending</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Share Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-navy/5 z-40">
          <div className="max-w-md mx-auto">
            <Button className="w-full h-16 rounded-[24px] bg-gold text-navy font-bold text-lg shadow-xl shadow-gold/20 gap-3">
              <MessageSquare className="w-5 h-5" />
              Share on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferFriend;
