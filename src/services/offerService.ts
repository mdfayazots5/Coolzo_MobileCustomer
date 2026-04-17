import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  category?: string;
}

export class OfferService {
  private static COLLECTION = 'offers';

  static async getOffers(): Promise<Offer[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 'offer-1',
          code: 'WELCOME20',
          title: 'Welcome Offer',
          description: 'Get 20% off on your first service.',
          discountType: 'percentage',
          discountValue: 20,
          minOrderValue: 500,
          expiryDate: '2024-12-31'
        }
      ];
    }
    return apiClient.get<Offer[]>('/offers');
  }

  static async validateCoupon(code: string, userId: string): Promise<Offer | null> {
    if (API_CONFIG.IS_MOCK) {
      if (code === 'WELCOME20') {
        return {
          id: 'offer-1',
          code: 'WELCOME20',
          title: 'Welcome Offer',
          description: 'Get 20% off on your first service.',
          discountType: 'percentage',
          discountValue: 20,
          minOrderValue: 500,
          expiryDate: '2024-12-31'
        };
      }
      return null;
    }
    return apiClient.post<Offer | null>('/offers/validate', { code, userId });
  }
}
