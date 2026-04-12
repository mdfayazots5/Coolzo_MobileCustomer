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

  private static mapAddress(address: any): Address {
    return {
      id: String(address.customerAddressId),
      userId: String(address.customerId),
      label: address.addressLabel || address.addressType || 'Saved Address',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || undefined,
      landmark: address.landmark || undefined,
      city: address.cityName || '',
      state: address.stateName || '',
      pinCode: address.pincode || '',
      isDefault: Boolean(address.isDefault),
      type: (address.addressType || address.addressLabel || 'Other') as Address['type'],
    };
  }

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
    const addresses = await apiClient.get<any[]>('/customers/me/addresses');
    return addresses.map(this.mapAddress);
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
    const request = {
      addressLabel: address.label || address.type || 'Saved Address',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      landmark: address.landmark || '',
      cityName: address.city || '',
      stateName: address.state || '',
      pincode: address.pinCode || '',
      zoneId: null,
      latitude: null,
      longitude: null,
      isDefault: Boolean(address.isDefault),
      addressType: address.type || address.label || 'Other',
    };
    if (address.id) {
      await apiClient.put(`/customers/me/addresses/${address.id}`, { customerAddressId: Number(address.id), ...request });
      return;
    }
    await apiClient.post('/customers/me/addresses', request);
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
    await apiClient.delete(`/customers/me/addresses/${addressId}`);
  }
}
