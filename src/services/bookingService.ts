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
import { apiClient } from './apiClient';

export interface BookingData {
  userId: string;
  serviceId: string;
  subServiceId: string;
  equipment: any;
  location: any;
  slot: any;
  contact: any;
  status: string;
  srNumber: string;
  price: number;
}

export const BookingService = {
  async createBooking(data: BookingData): Promise<string> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return 'mock-job-id-' + Math.random().toString(36).substr(2, 9);
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
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id,
        userId: 'demo-user-id',
        serviceId: 'ac-service',
        subServiceId: 'deep-cleaning',
        status: 'Scheduled',
        srNumber: 'SR123456',
        price: 499,
        createdAt: new Date().toISOString(),
        slot: { date: '2024-04-15', time: '10:00 AM' },
        equipment: { name: 'Master Bedroom AC', brand: 'Daikin' },
        location: { label: 'Home', addressLine1: 'Apartment 402, Block B' }
      };
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
    if (API_CONFIG.IS_MOCK) {
      const mockJobs = [
        {
          id: 'mock-job-1',
          userId,
          serviceId: 'ac-service',
          status: 'In Progress',
          srNumber: 'SR987654',
          price: 599,
          createdAt: new Date().toISOString(),
          slot: { date: '2024-04-12', time: '02:00 PM' }
        }
      ];
      callback(mockJobs);
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
    if (API_CONFIG.IS_MOCK) {
      const mockJob = {
        id: jobId,
        userId: 'demo-user-id',
        serviceId: 'ac-service',
        status: 'Technician on the way',
        srNumber: 'SR123456',
        price: 499,
        createdAt: new Date().toISOString(),
        technician: { name: 'Rahul Sharma', photo: 'https://picsum.photos/seed/tech1/200' }
      };
      callback(mockJob);
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
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
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
    }
    try {
      const docSnap = await getDoc(doc(db, 'service_reports', jobId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `service_reports/${jobId}`);
      return null;
    }
  },

  async createEmergencyBooking(data: any): Promise<string> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return 'mock-emergency-job-id';
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
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
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
    if (API_CONFIG.IS_MOCK) {
      return [
        { id: 'draft-1', serviceId: 'ac-service', subServiceId: 'deep-cleaning', createdAt: new Date().toISOString() }
      ];
    }
    return apiClient.get<any[]>(`/users/${userId}/bookings/drafts`);
  }
};
