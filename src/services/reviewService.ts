import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { CatalogService } from './catalogService';

interface CustomerReviewResponse {
  customerReviewId: number;
  customerId: number;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  bookingId?: number | null;
  serviceId?: number | null;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  jobId?: string;
  serviceId?: string;
  serviceName?: string;
  createdAt: string;
}

interface SubmitReviewPayload {
  rating: number;
  comment?: string;
  bookingId?: number;
  serviceId?: number;
  customerPhotoUrl?: string;
}

export class ReviewService {
  private static async getServiceMap() {
    const services = await CatalogService.getServices();
    return new Map(services.map((service) => [service.id, service]));
  }

  private static async mapReviews(items: CustomerReviewResponse[]): Promise<Review[]> {
    const serviceMap = await this.getServiceMap();

    return items.map((item) => {
      const service = item.serviceId ? serviceMap.get(String(item.serviceId)) : undefined;

      return {
        id: String(item.customerReviewId),
        userId: String(item.customerId),
        userName: item.userName,
        userPhoto: item.userPhoto || undefined,
        rating: Number(item.rating),
        comment: item.comment,
        jobId: item.bookingId ? String(item.bookingId) : undefined,
        serviceId: item.serviceId ? String(item.serviceId) : undefined,
        serviceName: service?.name,
        createdAt: item.createdAt,
      };
    });
  }

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
          createdAt: new Date().toISOString()
        }
      ];
    }

    const response = await apiClient.get<CustomerReviewResponse[]>(`/customer-reviews?serviceId=${serviceId}`, undefined, true);
    return this.mapReviews(response);
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
          createdAt: new Date().toISOString()
        }
      ];
    }

    const response = await apiClient.get<CustomerReviewResponse[]>('/customer-reviews', undefined, true);
    const mapped = await this.mapReviews(response);

    if (!serviceType || serviceType === 'All') {
      return mapped;
    }

    const filterValue = serviceType.toLowerCase();

    return mapped.filter((review) => {
      const serviceName = review.serviceName?.toLowerCase() ?? '';
      return serviceName.includes(filterValue);
    });
  }

  static async submitReview(_userId: string, review: SubmitReviewPayload): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Submitting review', review);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    await apiClient.post('/customer-reviews', {
      rating: review.rating,
      comment: review.comment || '',
      bookingId: review.bookingId ?? null,
      serviceId: review.serviceId ?? null,
      customerPhotoUrl: review.customerPhotoUrl || null,
    });
  }
}
