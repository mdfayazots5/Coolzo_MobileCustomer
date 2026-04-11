import { API_CONFIG } from '../config/apiConfig';
import { apiClient, PagedResult } from './apiClient';
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
  recommended?: boolean;
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
  nextVisitDate?: string | null;
  visits?: any[];
}

const mapPlan = (plan: any, index = 0): AMCPlan => {
  const durationInMonths = Number(plan.durationInMonths ?? 12);
  const visitCount = Number(plan.visitCount ?? 0);
  const terms = plan.termsAndConditions ? [plan.termsAndConditions] : [];

  return {
    id: String(plan.amcPlanId ?? plan.id),
    name: plan.planName || plan.name || 'AMC Plan',
    price: Number(plan.priceAmount ?? plan.price ?? 0),
    duration: durationInMonths >= 12 ? '1 Year' : `${durationInMonths} Months`,
    description: plan.planDescription || plan.description || '',
    features: [
      `${visitCount} preventive visits`,
      ...terms,
    ].filter(Boolean),
    category: 'Annual Maintenance',
    image: plan.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
    recommended: index === 1,
  };
};

const normalizeSubscriptionStatus = (status: string | undefined): AMCSubscription['status'] => {
  const value = (status || 'Active').toLowerCase();
  if (value.includes('cancel')) return 'Cancelled';
  if (value.includes('expire') || value.includes('inactive')) return 'Expired';
  return 'Active';
};

const mapSubscription = (subscription: any): AMCSubscription => {
  const visits = Array.isArray(subscription.visits) ? subscription.visits : [];
  const nextVisit = visits.find((visit: any) => {
    const visitDate = visit.visitDateUtc || visit.scheduledDateUtc || visit.visitDate;
    return visitDate && new Date(visitDate).getTime() >= Date.now();
  }) || visits[0];
  const totalVisits = Math.max(Number(subscription.totalVisitCount ?? subscription.totalVisits ?? visits.length), 1);
  const consumedVisits = Number(subscription.consumedVisitCount ?? 0);

  return {
    id: String(subscription.customerAmcId ?? subscription.id),
    userId: String(subscription.customerId ?? subscription.userId ?? ''),
    planId: String(subscription.amcPlanId ?? subscription.planId ?? ''),
    planName: subscription.planName || 'AMC Plan',
    startDate: subscription.startDateUtc || subscription.startDate || new Date().toISOString(),
    expiryDate: subscription.endDateUtc || subscription.expiryDate || new Date().toISOString(),
    status: normalizeSubscriptionStatus(subscription.currentStatus || subscription.status),
    remainingVisits: Math.max(totalVisits - consumedVisits, 0),
    totalVisits,
    nextVisitDate: nextVisit?.visitDateUtc || nextVisit?.scheduledDateUtc || nextVisit?.visitDate || null,
    visits,
  };
};

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
    const result = await apiClient.get<PagedResult<any>>('/amc/plans', { isActive: true, pageNumber: 1, pageSize: 50 });
    return result.items.map(mapPlan);
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
    const plans = await this.getPlans();
    return plans.find((plan) => plan.id === id) || null;
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
    const subscriptions = await apiClient.get<any[]>('/amc/customer/me');
    const activeSubscription = subscriptions.find((item) => normalizeSubscriptionStatus(item.currentStatus || item.status) === 'Active') || subscriptions[0];
    return activeSubscription ? mapSubscription(activeSubscription) : null;
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
    const subscriptions = await apiClient.get<any[]>('/amc/customer/me');
    const visits = subscriptions.flatMap((subscription) => subscription.visits || []);
    return visits.find((visit) => String(visit.amcVisitScheduleId ?? visit.id) === visitId) || null;
  }
}
