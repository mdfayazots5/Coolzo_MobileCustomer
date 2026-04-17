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
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 'addr-1',
          userId,
          label: 'Home',
          addressLine1: 'Apartment 402, Block B',
          addressLine2: 'Green Valley Apartments',
          landmark: 'Near Central Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001',
          isDefault: true,
          type: 'Home'
        }
      ];
    }
    return apiClient.get<Address[]>(`/users/${userId}/addresses`);
  }

  static async saveAddress(userId: string, address: Partial<Address>): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Saving address', address);
      await new Promise(resolve => setTimeout(resolve, 800));
      return;
    }
    return apiClient.post(`/users/${userId}/addresses`, address);
  }

  static async deleteAddress(userId: string, addressId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Deleting address', addressId);
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    return apiClient.delete(`/users/${userId}/addresses/${addressId}`);
  }
}
