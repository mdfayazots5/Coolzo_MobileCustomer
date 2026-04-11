import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, query, where, deleteDoc, serverTimestamp } from 'firebase/firestore';

export interface Address {
  id: string;
  userId: string;
  label: string; // Home, Office, etc.
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
  type: 'Home' | 'Office' | 'Other';
}

export class AddressService {
  private static COLLECTION = 'addresses';

  static async getAddresses(userId: string): Promise<Address[]> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const q = query(collection(db, this.COLLECTION), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return [];
      }
    }
    return apiClient.get<Address[]>(`/users/${userId}/addresses`);
  }

  static async saveAddress(userId: string, address: Partial<Address>): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      const addressId = address.id || doc(collection(db, this.COLLECTION)).id;
      const path = `${this.COLLECTION}/${addressId}`;
      try {
        await setDoc(doc(db, this.COLLECTION, addressId), {
          ...address,
          userId,
          id: addressId,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
      return;
    }
    return apiClient.post(`/users/${userId}/addresses`, address);
  }

  static async deleteAddress(userId: string, addressId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      const path = `${this.COLLECTION}/${addressId}`;
      try {
        await deleteDoc(doc(db, this.COLLECTION, addressId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
      return;
    }
    return apiClient.delete(`/users/${userId}/addresses/${addressId}`);
  }
}
