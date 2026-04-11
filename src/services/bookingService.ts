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
    return onSnapshot(doc(db, 'jobs', jobId), (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `jobs/${jobId}`);
    });
  },

  async getServiceReport(jobId: string): Promise<any> {
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
    try {
      // In a real app, this would update the job status and estimate status
      console.log(`Approving estimate ${estimateId} for job ${jobId}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `jobs/${jobId}/estimates/${estimateId}`);
      throw error;
    }
  },

  async rescheduleBooking(jobId: string, newSlot: any): Promise<void> {
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
    // Mock drafts
    return [
      { id: 'draft-1', serviceId: 'ac-service', subServiceId: 'deep-cleaning', createdAt: new Date().toISOString() }
    ];
  }
};
