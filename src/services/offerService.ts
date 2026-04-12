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

  private static mapOffer(offer: any): Offer {
    return {
      id: String(offer.promotionalOfferId),
      code: offer.code,
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: Number(offer.discountValue ?? 0),
      minOrderValue: Number(offer.minOrderValue ?? 0),
      expiryDate: offer.expiryDate || '',
      category: offer.category || undefined,
    };
  }

  static async getOffers(): Promise<Offer[]> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const querySnapshot = await getDocs(collection(db, this.COLLECTION));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return [];
      }
    }
    const offers = await apiClient.get<any[]>('/offers');
    return offers.map(this.mapOffer);
  }

  static async validateCoupon(code: string, userId: string): Promise<Offer | null> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const q = query(collection(db, this.COLLECTION), where('code', '==', code));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Offer;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return null;
      }
    }
    const offer = await apiClient.post<any | null>('/offers/validate-coupon', { code });
    return offer ? this.mapOffer(offer) : null;
  }
}
