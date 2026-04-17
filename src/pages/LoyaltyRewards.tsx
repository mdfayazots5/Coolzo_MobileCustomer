import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Trophy, 
  Star, 
  History, 
  ArrowUpRight,
  Gift,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LoyaltyService, LoyaltyPoints, LoyaltyTransaction } from '@/services/loyaltyService';
import { useAuthStore } from '@/store/useAuthStore';

const LoyaltyRewards = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [pointsData, setPointsData] = useState<LoyaltyPoints | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [points, history] = await Promise.all([
          LoyaltyService.getLoyaltyPoints(user.uid),
          LoyaltyService.getTransactions(user.uid)
        ]);
        setPointsData(points);
        setTransactions(history);
      } catch (error) {
        console.error('Failed to fetch loyalty data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

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
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-display font-bold text-navy">Loyalty Rewards</h1>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-32">
        {/* Tier Card */}
        <div className="bg-gradient-to-br from-navy to-navy/80 rounded-[40px] p-8 text-warm-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <Badge className="bg-gold/20 text-gold border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1 mb-2">
                  {pointsData?.tier} Tier
                </Badge>
                <h2 className="text-4xl font-display font-bold text-gold">{pointsData?.balance}</h2>
                <p className="text-warm-white/40 text-[10px] font-bold uppercase tracking-widest">Available Points</p>
              </div>
              <div className="w-16 h-16 rounded-[24px] bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <Trophy className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-warm-white/40">Next Tier</span>
                <span className="text-gold">{pointsData?.nextTierPoints} points to go</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (pointsData?.balance || 0) / ((pointsData?.balance || 0) + (pointsData?.nextTierPoints || 1)) * 100)}%` }}
                  className="h-full bg-gold"
                />
              </div>
            </div>
          </div>
          <Star className="absolute -right-10 -top-10 w-48 h-48 text-warm-white/5 rotate-12" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm text-center space-y-3 active:scale-95 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mx-auto">
              <Gift className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-navy">Redeem Points</p>
          </button>
          <button className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm text-center space-y-3 active:scale-95 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy/40 mx-auto">
              <History className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-navy">Points History</p>
          </button>
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40 ml-1">Your Benefits</h3>
          <div className="space-y-3">
            {[
              '5% Discount on all services',
              'Priority booking slots',
              'Free AC health checkup once a year'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-navy/5">
                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                  <Star className="w-3 h-3 fill-green-500" />
                </div>
                <span className="text-sm font-bold text-navy">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Recent Activity</h3>
            <button className="text-[10px] font-bold text-gold uppercase tracking-widest">View All</button>
          </div>
          <div className="space-y-3">
            {transactions.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-navy/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    item.type === 'earn' ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
                  )}>
                    <ArrowUpRight className={cn("w-5 h-5", item.type === 'redeem' && "rotate-180")} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">{item.description}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-navy/20">
                      {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className={cn(
                  "text-sm font-bold",
                  item.type === 'earn' ? "text-green-600" : "text-red-600"
                )}>
                  {item.type === 'earn' ? '+' : '-'}{item.points} pts
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyRewards;
