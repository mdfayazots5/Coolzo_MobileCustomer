import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';

interface CustomerAddressResponse {
  customerAddressId: number;
  customerId: number;
  addressLabel: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  cityName: string;
  stateName: string;
  pincode: string;
  addressType: string;
  zoneId?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
}

interface ZoneLookupResponse {
  zoneId: number;
  zoneName: string;
  cityName: string;
  pincode: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
  type: 'Home' | 'Office' | 'Other';
  zoneId?: number | null;
  zoneName?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

function normalizeAddressType(value?: string | null): Address['type'] {
  const normalized = (value ?? '').trim().toLowerCase();

  if (normalized.includes('office')) {
    return 'Office';
  }

  if (normalized.includes('other')) {
    return 'Other';
  }

  return 'Home';
}

function mapAddress(address: CustomerAddressResponse): Address {
  return {
    id: String(address.customerAddressId),
    userId: String(address.customerId),
    label: address.addressLabel,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    landmark: address.landmark,
    city: address.cityName,
    state: address.stateName,
    pinCode: address.pincode,
    isDefault: address.isDefault,
    type: normalizeAddressType(address.addressType),
    zoneId: address.zoneId ?? null,
    latitude: address.latitude ?? null,
    longitude: address.longitude ?? null,
  };
}

export class AddressService {
  static async getAddresses(_userId: string): Promise<Address[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 'addr-1',
          userId: 'demo-user',
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

    const response = await apiClient.get<CustomerAddressResponse[]>('/customers/me/addresses');
    return response.map(mapAddress);
  }

  static async lookupZone(pinCode: string): Promise<ZoneLookupResponse | null> {
    const value = pinCode.trim();

    if (!value) {
      return null;
    }

    try {
      return await apiClient.get<ZoneLookupResponse>(`/booking-lookups/zones/by-pincode/${encodeURIComponent(value)}`);
    } catch {
      return null;
    }
  }

  static async saveAddress(_userId: string, address: Partial<Address>): Promise<Address> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        id: address.id ?? 'mock-address-id',
        userId: 'demo-user',
        label: address.label ?? 'Home',
        addressLine1: address.addressLine1 ?? '',
        addressLine2: address.addressLine2 ?? '',
        landmark: address.landmark ?? '',
        city: address.city ?? '',
        state: address.state ?? '',
        pinCode: address.pinCode ?? '',
        isDefault: !!address.isDefault,
        type: address.type ?? 'Home',
        zoneId: address.zoneId ?? null,
        latitude: address.latitude ?? null,
        longitude: address.longitude ?? null,
      };
    }

    const payload = {
      addressLabel: address.label ?? address.type ?? 'Home',
      addressLine1: address.addressLine1 ?? '',
      addressLine2: address.addressLine2 ?? '',
      landmark: address.landmark ?? '',
      cityName: address.city ?? '',
      pincode: address.pinCode ?? '',
      zoneId: address.zoneId ?? null,
      latitude: address.latitude ?? null,
      longitude: address.longitude ?? null,
      isDefault: !!address.isDefault,
      stateName: address.state ?? '',
      addressType: address.type ?? 'Home',
    };

    if (address.id) {
      const response = await apiClient.put<CustomerAddressResponse>(`/customers/me/addresses/${address.id}`, {
        customerAddressId: Number(address.id),
        ...payload,
      });
      return mapAddress(response);
    }

    const response = await apiClient.post<CustomerAddressResponse>('/customers/me/addresses', payload);
    return mapAddress(response);
  }

  static async deleteAddress(_userId: string, addressId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    await apiClient.delete(`/customers/me/addresses/${addressId}`);
  }
}
