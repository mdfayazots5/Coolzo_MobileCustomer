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

  static async getReviewsByService(serviceId: string): Promise<Review[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 'rev-1',
          userId: 'u1',
          userName: 'Amit Kumar',
          rating: 5,
          comment: 'Excellent service, very professional.',
          serviceId,
          createdAt: new Date()
        }
      ];
    }
    return apiClient.get<Review[]>(`/services/${serviceId}/reviews`);
  }

  static async getReviews(serviceType?: string): Promise<Review[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 'rev-1',
          userId: 'u1',
          userName: 'Amit Kumar',
          rating: 5,
          comment: 'Excellent service, very professional.',
          createdAt: new Date()
        }
      ];
    }
    const url = serviceType && serviceType !== 'All' ? `/reviews?serviceType=${serviceType}` : '/reviews';
    return apiClient.get<Review[]>(url);
  }

  static async submitReview(userId: string, review: Partial<Review>): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Submitting review', review);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }
    return apiClient.post('/reviews', { ...review, userId });
  }
}
