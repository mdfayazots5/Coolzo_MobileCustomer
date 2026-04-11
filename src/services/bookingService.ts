import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { API_CONFIG } from '../config/apiConfig';
import { apiClient, PagedResult } from './apiClient';

export interface BookingData {
  userId: string;
  serviceId: string;
  subServiceId: string;
  equipment: {
    brand?: string;
    brandId?: string | number | null;
    type?: string;
    acTypeId?: string | number | null;
    capacity?: string;
    tonnageId?: string | number | null;
    units?: number;
  };
  location: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    pinCode?: string;
    label?: string;
    zoneId?: string | number | null;
  };
  slot: {
    date?: string | null;
    timeWindow?: string | null;
    slotAvailabilityId?: string | number | null;
    isEmergency?: boolean;
  };
  contact: {
    fullName?: string;
    mobile?: string;
    email?: string;
    instructions?: string;
  };
  status: string;
  srNumber: string;
  price: number;
}

const toRequiredNumber = (value: unknown, field: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${field} is required before creating a booking.`);
  }
  return parsed;
};

const normalizeStatus = (status: string | undefined) => {
  const value = (status || 'Booked').toLowerCase();
  if (value.includes('cancel')) return 'Cancelled';
  if (value.includes('complete') || value.includes('closed')) return 'Completed';
  if (value.includes('progress')) return 'In Progress';
  if (value.includes('arrived') || value.includes('reached')) return 'Arrived';
  if (value.includes('route')) return 'En Route';
  if (value.includes('assign')) return 'Assigned';
  return 'Booked';
};

const mapBookingResponseToJob = (booking: any) => ({
  id: String(booking.bookingId),
  srNumber: booking.serviceRequestNumber || booking.bookingReference || `BK-${booking.bookingId}`,
  serviceType: booking.serviceName,
  status: normalizeStatus(booking.operationalStatus || booking.status),
  date: booking.slotDate,
  timeSlot: booking.slotLabel || '',
  technicianId: booking.assignedTechnicianId ? String(booking.assignedTechnicianId) : undefined,
  address: booking.addressSummary || '',
  price: Number(booking.invoiceGrandTotalAmount ?? booking.estimatedPrice ?? 0),
  isEmergency: false,
  hasEstimate: Boolean(booking.quotationId && booking.quotationStatus !== 'Approved'),
  estimateApproved: booking.quotationStatus === 'Approved',
  raw: booking,
});

export const BookingService = {
  async createBooking(data: BookingData): Promise<string> {
    if (!API_CONFIG.IS_MOCK) {
      if (data.slot.isEmergency) {
        throw new Error('Emergency-specific booking fields are not defined in the current API contract.');
      }

      const request = {
        serviceId: toRequiredNumber(data.serviceId, 'serviceId'),
        acTypeId: toRequiredNumber(data.equipment.acTypeId, 'acTypeId'),
        tonnageId: toRequiredNumber(data.equipment.tonnageId, 'tonnageId'),
        brandId: toRequiredNumber(data.equipment.brandId, 'brandId'),
        slotAvailabilityId: toRequiredNumber(data.slot.slotAvailabilityId, 'slotAvailabilityId'),
        customerName: data.contact.fullName || '',
        mobileNumber: data.contact.mobile || '',
        emailAddress: data.contact.email || undefined,
        addressLine1: data.location.addressLine1 || '',
        addressLine2: data.location.addressLine2 || undefined,
        cityName: data.location.city || 'Mumbai',
        pincode: data.location.pinCode || '',
        addressLabel: data.location.label || undefined,
        modelName: [data.equipment.brand, data.equipment.type, data.equipment.capacity].filter(Boolean).join(' ') || undefined,
        issueNotes: data.contact.instructions || data.subServiceId || undefined,
        sourceChannel: 'MobileCustomer',
      };
      const result = await apiClient.post<any>('/bookings/customer', request, {
        headers: { 'X-Idempotency-Key': `customer-mobile-${Date.now()}-${Math.random().toString(36).slice(2)}` },
      });
      return String(result.bookingReference || result.bookingId);
    }

    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'jobs');
      throw error;
    }
  },

  async getBookingById(id: string): Promise<any> {
    if (!API_CONFIG.IS_MOCK) {
      const booking = await apiClient.get<any>(`/customer-bookings/${id}`);
      return mapBookingResponseToJob(booking);
    }

    try {
      const docSnap = await getDoc(doc(db, 'jobs', id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `jobs/${id}`);
      throw error;
    }
  },

  getLiveJobs(userId: string, callback: (jobs: any[]) => void) {
    if (!API_CONFIG.IS_MOCK) {
      apiClient.get<PagedResult<any>>('/customer-bookings', { pageNumber: 1, pageSize: 50 })
        .then((result) => callback(result.items.map(mapBookingResponseToJob)))
        .catch((error) => {
          console.error('Failed to fetch customer bookings:', error);
          callback([]);
        });
      return () => {};
    }

    const q = query(
      collection(db, 'jobs'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(jobs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'jobs');
    });
  },

  getJobStream(jobId: string, callback: (job: any) => void) {
    if (!API_CONFIG.IS_MOCK) {
      this.getBookingById(jobId)
        .then(callback)
        .catch((error) => console.error('Failed to fetch booking detail:', error));
      return () => {};
    }

    return onSnapshot(doc(db, 'jobs', jobId), (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `jobs/${jobId}`);
    });
  },

  async getServiceReport(jobId: string): Promise<any> {
    if (!API_CONFIG.IS_MOCK) {
      const booking = await apiClient.get<any>(`/customer-bookings/${jobId}`);
      return {
        jobId,
        technicianName: booking.assignedTechnicianName || 'Coolzo technician',
        completionDate: booking.completionDateUtc || booking.bookingDateUtc,
        workDone: booking.lines?.map((line: any) => line.description || line.serviceName).filter(Boolean) || [],
        recommendations: booking.completionSummary || 'Service report details will appear after job completion.',
        rating: null,
        raw: booking,
      };
    }

    try {
      const docSnap = await getDoc(doc(db, 'service_reports', jobId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      // Mock fallback
      return {
        jobId,
        technicianName: 'Rahul Sharma',
        completionDate: '2024-04-10',
        workDone: [
          'Deep cleaning of indoor unit',
          'Outdoor unit pressure wash',
          'Refrigerant level check',
          'Electrical safety audit'
        ],
        recommendations: 'Replace air filter in next 3 months.',
        rating: 5
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `service_reports/${jobId}`);
      return null;
    }
  },

  async createEmergencyBooking(data: any): Promise<string> {
    if (!API_CONFIG.IS_MOCK) {
      throw new Error('Emergency booking-only request fields are not defined in the current API contract.');
    }

    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...data,
        isEmergency: true,
        status: 'Priority',
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'jobs');
      throw error;
    }
  },

  async approveEstimate(jobId: string, estimateId: string): Promise<void> {
    if (!API_CONFIG.IS_MOCK) {
      const quotationId = toRequiredNumber(estimateId, 'quotationId');
      await apiClient.post(`/quotations/${quotationId}/approve`, { remarks: `Approved from customer mobile booking ${jobId}` });
      return;
    }

    try {
      // In a real app, this would update the job status and estimate status
      console.log(`Approving estimate ${estimateId} for job ${jobId}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `jobs/${jobId}/estimates/${estimateId}`);
      throw error;
    }
  },

  async rescheduleBooking(jobId: string, newSlot: any): Promise<void> {
    if (!API_CONFIG.IS_MOCK) {
      throw new Error('Customer booking reschedule API is not defined in the current API contract.');
    }

    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        slot: newSlot,
        status: 'Rescheduled',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `jobs/${jobId}`);
      throw error;
    }
  },

  async getDrafts(userId: string): Promise<any[]> {
    if (!API_CONFIG.IS_MOCK) {
      return [];
    }

    // Mock drafts
    return [
      { id: 'draft-1', serviceId: 'ac-service', subServiceId: 'deep-cleaning', createdAt: new Date().toISOString() }
    ];
  }
};
