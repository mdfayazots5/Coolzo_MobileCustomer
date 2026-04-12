import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';

export interface LoyaltyPoints {
  balance: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTierPoints: number;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  createdAt: any;
}

export class LoyaltyService {
  private static COLLECTION = 'loyalty';

  static async getLoyaltyPoints(userId: string): Promise<LoyaltyPoints> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const docSnap = await getDoc(doc(db, this.COLLECTION, userId));
        if (docSnap.exists()) {
          return docSnap.data() as LoyaltyPoints;
        }
        return { balance: 0, tier: 'Bronze', nextTierPoints: 500 };
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${this.COLLECTION}/${userId}`);
        throw error;
      }
    }
    return apiClient.get<LoyaltyPoints>('/loyalty/me');
  }

  static async getTransactions(userId: string): Promise<LoyaltyTransaction[]> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const q = query(
          collection(db, `${this.COLLECTION}/${userId}/transactions`),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LoyaltyTransaction));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${this.COLLECTION}/${userId}/transactions`);
        return [];
      }
    }
    return apiClient.get<LoyaltyTransaction[]>('/loyalty/me/transactions');
  }
}
