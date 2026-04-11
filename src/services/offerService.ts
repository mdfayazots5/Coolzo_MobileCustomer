import { API_CONFIG } from '../config/apiConfig';
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
      try {
        const querySnapshot = await getDocs(collection(db, this.COLLECTION));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return [];
      }
    }
    return [];
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
    return null;
  }
}
