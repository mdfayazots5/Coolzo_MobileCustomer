import { API_CONFIG } from '../config/apiConfig';
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
      try {
        const q = query(collection(db, this.COLLECTION), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return [];
      }
    }
    return [];
  }

  static async saveEquipment(userId: string, equipment: Partial<Equipment>): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      const equipmentId = equipment.id || doc(collection(db, this.COLLECTION)).id;
      const path = `${this.COLLECTION}/${equipmentId}`;
      try {
        await setDoc(doc(db, this.COLLECTION, equipmentId), {
          ...equipment,
          userId,
          id: equipmentId,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
      return;
    }
    throw new Error('Customer equipment save API is not defined in the current API contract.');
  }

  static async deleteEquipment(userId: string, equipmentId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      const path = `${this.COLLECTION}/${equipmentId}`;
      try {
        await deleteDoc(doc(db, this.COLLECTION, equipmentId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
      return;
    }
    throw new Error('Customer equipment delete API is not defined in the current API contract.');
  }
}
