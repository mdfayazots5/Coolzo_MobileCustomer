import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

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
  private static COLLECTION = 'referrals';

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
    return apiClient.get<ReferralStats>(`/users/${userId}/referrals`);
  }
}
