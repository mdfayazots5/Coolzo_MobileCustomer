import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';

interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface BackendAmcPlanResponse {
  amcPlanId: number;
  planName: string;
  planDescription: string;
  durationInMonths: number;
  visitCount: number;
  priceAmount: number;
  isActive: boolean;
  termsAndConditions?: string | null;
}

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
  planId: string;
  planName: string;
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  invoiceId?: string;
  invoiceNumber?: string;
  jobCardNumber?: string;
  remainingVisits: number;
  totalVisits: number;
  usedVisits: number;
  priceAmount: number;
  nextVisitDate?: string | null;
  visits: {
    id: string;
    visitNumber: number;
    scheduledDate: string;
    status: string;
    serviceRequestId?: string;
    serviceRequestNumber?: string;
    completedDate?: string | null;
    remarks?: string;
  }[];
}

export interface AMCVisitDetail {
  id: string;
  subscriptionId?: string;
  planName?: string;
  visitNumber?: number;
  date: string;
  status: string;
  technicianId?: string;
  notes: string;
  checklist: { item: string; status: 'Completed' | 'Pending' }[];
  serviceRequestId?: string;
  serviceRequestNumber?: string;
  completedDate?: string | null;
}

interface BackendAmcVisitResponse {
  amcVisitScheduleId: number;
  visitNumber: number;
  scheduledDate: string;
  currentStatus: string;
  serviceRequestId?: number | null;
  serviceRequestNumber?: string | null;
  completedDateUtc?: string | null;
  visitRemarks?: string | null;
}

interface BackendCustomerAmcResponse {
  customerAmcId: number;
  customerId: number;
  amcPlanId: number;
  planName: string;
  jobCardId: number;
  jobCardNumber: string;
  invoiceId: number;
  invoiceNumber: string;
  currentStatus: string;
  startDateUtc: string;
  endDateUtc: string;
  totalVisitCount: number;
  consumedVisitCount: number;
  priceAmount: number;
  visits: BackendAmcVisitResponse[];
}

function toDuration(durationInMonths: number): string {
  return `${durationInMonths} Month${durationInMonths === 1 ? '' : 's'}`;
}

function extractFeatures(plan: BackendAmcPlanResponse): string[] {
  const rawTerms = (plan.termsAndConditions ?? '')
    .split(/\r?\n|[.;]/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (rawTerms.length > 0) {
    return rawTerms.slice(0, 6);
  }

  return [
    `${plan.visitCount} scheduled visit${plan.visitCount === 1 ? '' : 's'}`,
    `${toDuration(plan.durationInMonths)} coverage`,
    'Priority support access',
  ];
}

function toPlanImage(planName: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(planName.toLowerCase())}/800/600`;
}

function mapPlan(plan: BackendAmcPlanResponse, highestPrice: number): AMCPlan {
  return {
    id: String(plan.amcPlanId),
    name: plan.planName,
    price: Number(plan.priceAmount),
    duration: toDuration(plan.durationInMonths),
    description: plan.planDescription,
    features: extractFeatures(plan),
    category: 'AMC',
    image: toPlanImage(plan.planName),
    recommended: Number(plan.priceAmount) === highestPrice,
  };
}

export class AMCService {
  static async getPlans(): Promise<AMCPlan[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
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
          image: 'https://picsum.photos/seed/amc2/800/600',
          recommended: true
        }
      ];
    }

    const response = await apiClient.get<PagedResponse<BackendAmcPlanResponse>>('/amc/plans?isActive=true&pageNumber=1&pageSize=50');
    const plans = response.items ?? [];
    const highestPrice = plans.reduce((max, item) => Math.max(max, Number(item.priceAmount)), 0);

    return plans.map((item) => mapPlan(item, highestPrice));
  }

  static async getPlanById(id: string): Promise<AMCPlan | null> {
    if (API_CONFIG.IS_MOCK) {
      const plans = await this.getPlans();
      return plans.find(p => p.id === id) || null;
    }

    const plan = await apiClient.get<BackendAmcPlanResponse>(`/amc/plans/${id}`);
    return mapPlan(plan, Number(plan.priceAmount));
  }

  static async getSubscription(userId: string): Promise<AMCSubscription | null> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: 'sub-1',
        planId: 'premium-amc',
        planName: 'Coolzo Premium',
        startDate: '2024-01-01',
        expiryDate: '2024-12-31',
        status: 'Active',
        invoiceId: 'inv-1',
        invoiceNumber: 'INV-001',
        jobCardNumber: 'JC-001',
        remainingVisits: 2,
        totalVisits: 3,
        usedVisits: 1,
        priceAmount: 2999,
        nextVisitDate: '2024-05-15',
        visits: []
      };
    }

    const subscriptions = await apiClient.get<BackendCustomerAmcResponse[]>('/amc/customer/me');

    if (!subscriptions.length) {
      return null;
    }

    const sorted = [...subscriptions].sort((left, right) => {
      const leftIsActive = left.currentStatus.toLowerCase() === 'active' ? 0 : 1;
      const rightIsActive = right.currentStatus.toLowerCase() === 'active' ? 0 : 1;

      if (leftIsActive !== rightIsActive) {
        return leftIsActive - rightIsActive;
      }

      return new Date(right.endDateUtc).getTime() - new Date(left.endDateUtc).getTime();
    });

    const selected = sorted[0];
    const visits = [...(selected.visits ?? [])].sort((left, right) =>
      new Date(left.scheduledDate).getTime() - new Date(right.scheduledDate).getTime()
    );
    const nextVisit = visits.find((visit) => !visit.currentStatus.toLowerCase().includes('completed'));

    return {
      id: String(selected.customerAmcId),
      planId: String(selected.amcPlanId),
      planName: selected.planName,
      startDate: selected.startDateUtc,
      expiryDate: selected.endDateUtc,
      status: selected.currentStatus.toLowerCase().includes('cancel') ? 'Cancelled' : selected.currentStatus.toLowerCase().includes('expire') ? 'Expired' : 'Active',
      invoiceId: String(selected.invoiceId),
      invoiceNumber: selected.invoiceNumber,
      jobCardNumber: selected.jobCardNumber,
      remainingVisits: Math.max(Number(selected.totalVisitCount) - Number(selected.consumedVisitCount), 0),
      totalVisits: Number(selected.totalVisitCount),
      usedVisits: Number(selected.consumedVisitCount),
      priceAmount: Number(selected.priceAmount),
      nextVisitDate: nextVisit?.scheduledDate ?? null,
      visits: visits.map((visit) => ({
        id: String(visit.amcVisitScheduleId),
        visitNumber: Number(visit.visitNumber),
        scheduledDate: visit.scheduledDate,
        status: visit.currentStatus,
        serviceRequestId: visit.serviceRequestId ? String(visit.serviceRequestId) : undefined,
        serviceRequestNumber: visit.serviceRequestNumber ?? undefined,
        completedDate: visit.completedDateUtc ?? null,
        remarks: visit.visitRemarks ?? undefined,
      })),
    };
  }

  static async getVisitDetail(visitId: string): Promise<AMCVisitDetail | null> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
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
    }

    const subscription = await this.getSubscription('me');

    if (!subscription) {
      return null;
    }

    const visit = subscription.visits.find((item) => item.id === visitId);

    if (!visit) {
      return null;
    }

    const isCompleted = visit.status.toLowerCase().includes('complete');

    return {
      id: visit.id,
      subscriptionId: subscription.id,
      planName: subscription.planName,
      visitNumber: visit.visitNumber,
      date: visit.scheduledDate,
      status: visit.status,
      notes: visit.remarks || `${subscription.planName} AMC visit ${visit.visitNumber}`,
      checklist: [
        { item: 'Visual inspection', status: isCompleted ? 'Completed' : 'Pending' },
        { item: 'Cooling performance check', status: isCompleted ? 'Completed' : 'Pending' },
        { item: 'Cleaning and preventive maintenance', status: isCompleted ? 'Completed' : 'Pending' }
      ],
      serviceRequestId: visit.serviceRequestId,
      serviceRequestNumber: visit.serviceRequestNumber,
      completedDate: visit.completedDate ?? null,
    };
  }
}
