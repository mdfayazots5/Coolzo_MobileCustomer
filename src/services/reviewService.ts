import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
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

  private static mapReview(review: any): Review {
    return {
      id: String(review.customerReviewId),
      userId: String(review.customerId),
      userName: review.userName || '',
      userPhoto: review.userPhoto || undefined,
      rating: Number(review.rating ?? 0),
      comment: review.comment || '',
      jobId: review.bookingId ? String(review.bookingId) : undefined,
      serviceId: review.serviceId ? String(review.serviceId) : undefined,
      createdAt: review.createdAt,
    };
  }

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
    const reviews = await apiClient.get<any[]>('/customer-reviews', { serviceId });
    return reviews.map(this.mapReview);
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
    const reviews = await apiClient.get<any[]>('/customer-reviews');
    return reviews.map(this.mapReview);
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
    await apiClient.post('/customer-reviews', {
      rating: review.rating || 0,
      comment: review.comment || '',
      bookingId: review.jobId ? Number(review.jobId) : null,
      serviceId: review.serviceId ? Number(review.serviceId) : null,
      customerPhotoUrl: review.userPhoto || null,
    });
  }
}
