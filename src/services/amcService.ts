import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

export interface AMCPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  category: string;
  image: string;
}

export interface AMCSubscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  remainingVisits: number;
  totalVisits: number;
}

export class AMCService {
  private static COLLECTION = 'amc_plans';
  private static SUBS_COLLECTION = 'amc_subscriptions';

  static async getPlans(): Promise<AMCPlan[]> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const querySnapshot = await getDocs(collection(db, this.COLLECTION));
        const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AMCPlan));
        
        // Fallback to mock data if Firestore is empty
        if (plans.length === 0) {
          return [
            {
              id: 'basic-amc',
              name: 'Coolzo Basic',
              price: 1499,
              duration: '1 Year',
              description: 'Essential maintenance for your AC.',
              features: ['2 Preventive Maintenances', 'Unlimited Breakdown Calls', '10% Discount on Spare Parts'],
              category: 'Residential',
              image: 'https://picsum.photos/seed/amc1/800/600'
            },
            {
              id: 'premium-amc',
              name: 'Coolzo Premium',
              price: 2999,
              duration: '1 Year',
              description: 'Comprehensive protection for total peace of mind.',
              features: ['3 Preventive Maintenances', 'Unlimited Breakdown Calls', 'Free Spare Parts (Selected)', 'Priority Support'],
              category: 'Residential',
              image: 'https://picsum.photos/seed/amc2/800/600'
            }
          ];
        }
        return plans;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return [];
      }
    }
    return apiClient.get<AMCPlan[]>('/amc/plans');
  }

  static async getPlanById(id: string): Promise<AMCPlan | null> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const docSnap = await getDoc(doc(db, this.COLLECTION, id));
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as AMCPlan;
        }
        // Mock fallback
        const plans = await this.getPlans();
        return plans.find(p => p.id === id) || null;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${this.COLLECTION}/${id}`);
        return null;
      }
    }
    return apiClient.get<AMCPlan>(`/amc/plans/${id}`);
  }

  static async getSubscription(userId: string): Promise<AMCSubscription | null> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const q = query(collection(db, this.SUBS_COLLECTION), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as AMCSubscription;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.SUBS_COLLECTION);
        return null;
      }
    }
    return apiClient.get<AMCSubscription>(`/users/${userId}/amc/subscription`);
  }

  static async getVisitDetail(visitId: string): Promise<any> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const docSnap = await getDoc(doc(db, 'amc_visits', visitId));
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : {
          id: visitId,
          date: '2024-05-15',
          status: 'Scheduled',
          technicianId: 'tech-1',
          notes: 'Regular maintenance visit.',
          checklist: [
            { item: 'Filter Cleaning', status: 'Pending' },
            { item: 'Gas Pressure Check', status: 'Pending' },
            { item: 'Electrical Connection Check', status: 'Pending' }
          ]
        };
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `amc_visits/${visitId}`);
        return null;
      }
    }
    return apiClient.get<any>(`/amc/visits/${visitId}`);
  }
}
