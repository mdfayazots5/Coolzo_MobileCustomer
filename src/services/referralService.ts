import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';

interface ReferralResponse {
  customerReferralId: number;
  name: string;
  status: 'Pending' | 'Completed';
  reward: number;
  date: string;
}

interface ReferralStatsResponse {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingReferrals: number;
  referrals: ReferralResponse[];
}

export interface Referral {
  id: string;
  name: string;
  status: 'Pending' | 'Completed';
  reward: number;
  date: string;
}

export interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingReferrals: number;
  referrals: Referral[];
}

export class ReferralService {
  static async getReferralStats(userId: string): Promise<ReferralStats> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        referralCode: `COOL${userId.slice(0, 5).toUpperCase()}`,
        totalReferrals: 3,
        totalEarnings: 1500,
        pendingReferrals: 1,
        referrals: [
          { id: 'ref-1', name: 'John Doe', status: 'Completed', reward: 500, date: '2024-03-10' },
          { id: 'ref-2', name: 'Jane Smith', status: 'Pending', reward: 500, date: '2024-03-12' }
        ]
      };
    }

    const response = await apiClient.get<ReferralStatsResponse>('/referrals/me');

    return {
      referralCode: response.referralCode || `COOL${userId.slice(0, 5).toUpperCase()}`,
      totalReferrals: Number(response.totalReferrals),
      totalEarnings: Number(response.totalEarnings),
      pendingReferrals: Number(response.pendingReferrals),
      referrals: (response.referrals ?? []).map((item) => ({
        id: String(item.customerReferralId),
        name: item.name,
        status: item.status,
        reward: Number(item.reward),
        date: item.date,
      })),
    };
  }
}
