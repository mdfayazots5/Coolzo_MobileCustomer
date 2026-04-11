import { API_CONFIG } from '../config/apiConfig';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  jobId?: string;
  serviceId?: string;
  createdAt: any;
}

export class ReviewService {
  private static COLLECTION = 'reviews';

  static async getReviewsByService(serviceId: string): Promise<Review[]> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const q = query(
          collection(db, this.COLLECTION),
          where('serviceId', '==', serviceId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return [];
      }
    }
    return [];
  }

  static async getReviews(serviceType?: string): Promise<Review[]> {
    if (API_CONFIG.IS_MOCK) {
      try {
        let q = query(collection(db, this.COLLECTION), orderBy('createdAt', 'desc'));
        if (serviceType && serviceType !== 'All') {
          q = query(collection(db, this.COLLECTION), where('serviceType', '==', serviceType), orderBy('createdAt', 'desc'));
        }
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return [];
      }
    }
    return [];
  }

  static async submitReview(userId: string, review: Partial<Review>): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      try {
        await addDoc(collection(db, this.COLLECTION), {
          ...review,
          userId,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, this.COLLECTION);
      }
      return;
    }
    throw new Error('Customer review submission API is not defined in the current API contract.');
  }
}
