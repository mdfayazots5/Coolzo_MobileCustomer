import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, query, where, deleteDoc, serverTimestamp } from 'firebase/firestore';

export interface Equipment {
  id: string;
  userId: string;
  name: string;
  type: string; // Split, Window, etc.
  brand: string;
  capacity: string; // 1 Ton, 1.5 Ton, etc.
  location: string; // Living Room, Bedroom, etc.
  purchaseDate?: string;
  lastServiceDate?: string;
  serialNumber?: string;
}

export class EquipmentService {
  private static COLLECTION = 'equipment';

  static async getEquipment(userId: string): Promise<Equipment[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 'eq-1',
          userId,
          name: 'Master Bedroom AC',
          type: 'Split',
          brand: 'Daikin',
          capacity: '1.5 Ton',
          location: 'Master Bedroom',
          purchaseDate: '2023-05-10',
          lastServiceDate: '2023-11-15'
        }
      ];
    }
    return apiClient.get<Equipment[]>(`/users/${userId}/equipment`);
  }

  static async saveEquipment(userId: string, equipment: Partial<Equipment>): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Saving equipment', equipment);
      await new Promise(resolve => setTimeout(resolve, 800));
      return;
    }
    return apiClient.post(`/users/${userId}/equipment`, equipment);
  }

  static async deleteEquipment(userId: string, equipmentId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Deleting equipment', equipmentId);
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    return apiClient.delete(`/users/${userId}/equipment/${equipmentId}`);
  }
}
