import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';

interface TechnicianPublicResponse {
  technicianId: number;
  name: string;
  photoUrl: string;
  rating: number;
  totalJobs: number;
  experience: string;
  specialization: string[];
  languages: string[];
  verified: boolean;
}

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

    const response = await apiClient.get<TechnicianPublicResponse>(`/technicians/${id}/public`, undefined, true);

    return {
      id: String(response.technicianId),
      name: response.name,
      photoUrl: response.photoUrl,
      rating: Number(response.rating),
      totalJobs: Number(response.totalJobs),
      experience: response.experience,
      specialization: response.specialization ?? [],
      languages: response.languages ?? [],
      verified: response.verified,
    };
  }
}
