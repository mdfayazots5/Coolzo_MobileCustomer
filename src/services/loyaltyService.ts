import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';

interface LoyaltyPointsResponse {
  balance: number;
  tier: string;
  nextTierPoints: number;
}

interface LoyaltyTransactionResponse {
  customerLoyaltyTransactionId: number;
  type: string;
  points: number;
  description: string;
  createdAt: string;
}

export interface LoyaltyPoints {
  balance: number;
  tier: string;
  nextTierPoints: number;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earn' | 'redeem' | 'expire';
  points: number;
  description: string;
  createdAt: string;
}

export class LoyaltyService {
  private static normalizeType(value: string): LoyaltyTransaction['type'] {
    const normalized = value.toLowerCase();

    if (normalized.includes('redeem')) {
      return 'redeem';
    }

    if (normalized.includes('expire')) {
      return 'expire';
    }

    return 'earn';
  }

  static async getLoyaltyPoints(userId: string): Promise<LoyaltyPoints> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { balance: 1250, tier: 'Silver', nextTierPoints: 2500 };
    }

    const response = await apiClient.get<LoyaltyPointsResponse>('/loyalty/me');

    return {
      balance: Number(response.balance),
      tier: response.tier || (userId ? 'Standard' : 'Member'),
      nextTierPoints: Number(response.nextTierPoints),
    };
  }

  static async getTransactions(userId: string): Promise<LoyaltyTransaction[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 't1', type: 'earn', points: 500, description: 'AC Deep Cleaning Service', createdAt: new Date().toISOString() },
        { id: 't2', type: 'redeem', points: 200, description: 'Discount Coupon', createdAt: new Date(Date.now() - 86400000).toISOString() }
      ];
    }

    const response = await apiClient.get<LoyaltyTransactionResponse[]>('/loyalty/me/transactions');

    return response.map((item) => ({
      id: String(item.customerLoyaltyTransactionId),
      type: this.normalizeType(item.type),
      points: Number(item.points),
      description: item.description,
      createdAt: item.createdAt,
    }));
  }
}
