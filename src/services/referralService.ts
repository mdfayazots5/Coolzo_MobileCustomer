import { API_CONFIG } from '../config/apiConfig';
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
      try {
        const docSnap = await getDoc(doc(db, this.COLLECTION, userId));
        if (docSnap.exists()) {
          return docSnap.data() as ReferralStats;
        }
        // Mock fallback
        return {
          referralCode: `COOL${userId.slice(0, 5).toUpperCase()}`,
          totalReferrals: 0,
          totalEarnings: 0,
          pendingReferrals: 0,
          referrals: []
        };
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${this.COLLECTION}/${userId}`);
        throw error;
      }
    }
    return {
      referralCode: '',
      totalReferrals: 0,
      totalEarnings: 0,
      pendingReferrals: 0,
      referrals: []
    };
  }
}
