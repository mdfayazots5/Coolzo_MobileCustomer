import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';

interface PromotionalOfferResponse {
  promotionalOfferId: number;
  code: string;
  title: string;
  description: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  expiryDate?: string | null;
  category?: string | null;
}

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
  private static mapOffer(item: PromotionalOfferResponse): Offer {
    return {
      id: String(item.promotionalOfferId),
      code: item.code,
      title: item.title,
      description: item.description,
      discountType: item.discountType.toLowerCase().includes('percent') ? 'percentage' : 'fixed',
      discountValue: Number(item.discountValue),
      minOrderValue: Number(item.minOrderValue),
      expiryDate: item.expiryDate ?? '',
      category: item.category ?? undefined,
    };
  }

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

    const response = await apiClient.get<PromotionalOfferResponse[]>('/offers');
    return response.map(this.mapOffer);
  }

  static async validateCoupon(code: string, _userId: string): Promise<Offer | null> {
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

    const response = await apiClient.post<PromotionalOfferResponse | null>('/offers/validate-coupon', { code });
    return response ? this.mapOffer(response) : null;
  }
}
