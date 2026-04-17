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
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id,
        name: 'Rahul Sharma',
        photoUrl: 'https://picsum.photos/seed/tech1/200/200',
        rating: 4.8,
        totalJobs: 156,
        experience: '5 Years',
        specialization: ['Split AC', 'Window AC', 'Inverter AC'],
        languages: ['English', 'Hindi', 'Marathi'],
        verified: true
      };
    }
    return apiClient.get<Technician>(`/technicians/${id}`);
  }
}
