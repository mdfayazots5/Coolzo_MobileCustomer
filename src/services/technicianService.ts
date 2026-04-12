import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface Technician {
  id: string;
  name: string;
  photoUrl: string;
  rating: number;
  totalJobs: number;
  experience: string;
  specialization: string[];
  languages: string[];
  verified: boolean;
}

export class TechnicianService {
  private static COLLECTION = 'technicians';

  static async getTechnicianById(id: string): Promise<Technician | null> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const docSnap = await getDoc(doc(db, this.COLLECTION, id));
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Technician;
        }
        return null;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${this.COLLECTION}/${id}`);
        return null;
      }
    }
    const technician = await apiClient.get<any>(`/customer-technicians/${id}`);
    return {
      id: String(technician.technicianId),
      name: technician.name,
      photoUrl: technician.photoUrl || '',
      rating: Number(technician.rating ?? 0),
      totalJobs: Number(technician.totalJobs ?? 0),
      experience: technician.experience || '',
      specialization: technician.specialization || [],
      languages: technician.languages || [],
      verified: Boolean(technician.verified),
    };
  }
}
