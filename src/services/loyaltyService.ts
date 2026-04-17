import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

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
      await new Promise(resolve => setTimeout(resolve, 500));
      return { balance: 1250, tier: 'Silver', nextTierPoints: 2500 };
    }
    return apiClient.get<LoyaltyPoints>(`/users/${userId}/loyalty`);
  }

  static async getTransactions(userId: string): Promise<LoyaltyTransaction[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 't1', type: 'earn', points: 500, description: 'AC Deep Cleaning Service', createdAt: new Date() },
        { id: 't2', type: 'redeem', points: 200, description: 'Discount Coupon', createdAt: new Date(Date.now() - 86400000) }
      ];
    }
    return apiClient.get<LoyaltyTransaction[]>(`/users/${userId}/loyalty/transactions`);
  }
}
