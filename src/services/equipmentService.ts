import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';

interface CustomerEquipmentResponse {
  customerEquipmentId: number;
  customerId: number;
  name: string;
  type: string;
  brand: string;
  capacity: string;
  location: string;
  purchaseDate?: string | null;
  lastServiceDate?: string | null;
  serialNumber?: string | null;
  isActive: boolean;
}

interface BrandLookupResponse {
  brandId: number;
  brandName: string;
  description: string;
}

interface ServiceHistoryItemResponse {
  historyType: string;
  referenceNumber: string;
  title: string;
  status: string;
  eventDateUtc: string;
  detail: string;
  amount?: number | null;
  bookingId?: number | null;
  serviceRequestId?: number | null;
}

export interface Equipment {
  id: string;
  userId: string;
  name: string;
  type: string;
  brand: string;
  capacity: string;
  location: string;
  purchaseDate?: string;
  lastServiceDate?: string;
  serialNumber?: string;
  isActive?: boolean;
}

export interface EquipmentBrand {
  id: string;
  name: string;
  description: string;
}

export interface ServiceHistoryItem {
  id: string;
  title: string;
  status: string;
  date: string;
  detail: string;
  referenceNumber: string;
}

function mapEquipment(item: CustomerEquipmentResponse): Equipment {
  return {
    id: String(item.customerEquipmentId),
    userId: String(item.customerId),
    name: item.name,
    type: item.type,
    brand: item.brand,
    capacity: item.capacity,
    location: item.location,
    purchaseDate: item.purchaseDate ?? undefined,
    lastServiceDate: item.lastServiceDate ?? undefined,
    serialNumber: item.serialNumber ?? undefined,
    isActive: item.isActive,
  };
}

export class EquipmentService {
  static async getEquipment(_userId: string): Promise<Equipment[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 'eq-1',
          userId: 'demo-user',
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

    const response = await apiClient.get<CustomerEquipmentResponse[]>('/customers/me/equipment');
    return response.map(mapEquipment);
  }

  static async getEquipmentById(userId: string, equipmentId: string): Promise<Equipment | null> {
    const equipment = await this.getEquipment(userId);
    return equipment.find((item) => item.id === equipmentId) ?? null;
  }

  static async getBrands(): Promise<EquipmentBrand[]> {
    if (API_CONFIG.IS_MOCK) {
      return [
        { id: '1', name: 'Daikin', description: '' },
        { id: '2', name: 'Samsung', description: '' },
        { id: '3', name: 'LG', description: '' },
      ];
    }

    const response = await apiClient.get<BrandLookupResponse[]>('/booking-lookups/brands');
    return response.map((item) => ({
      id: String(item.brandId),
      name: item.brandName,
      description: item.description,
    }));
  }

  static async getServiceHistory(): Promise<ServiceHistoryItem[]> {
    if (API_CONFIG.IS_MOCK) {
      return [];
    }

    const response = await apiClient.get<ServiceHistoryItemResponse[]>('/service-history/me');
    return response.map((item, index) => ({
      id: `${item.historyType}-${item.referenceNumber}-${index}`,
      title: item.title,
      status: item.status,
      date: item.eventDateUtc,
      detail: item.detail,
      referenceNumber: item.referenceNumber,
    }));
  }

  static async saveEquipment(_userId: string, equipment: Partial<Equipment>): Promise<Equipment> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        id: equipment.id ?? 'mock-equipment-id',
        userId: 'demo-user',
        name: equipment.name ?? '',
        type: equipment.type ?? 'Split',
        brand: equipment.brand ?? '',
        capacity: equipment.capacity ?? '',
        location: equipment.location ?? '',
        purchaseDate: equipment.purchaseDate,
        lastServiceDate: equipment.lastServiceDate,
        serialNumber: equipment.serialNumber,
      };
    }

    const payload = {
      name: equipment.name ?? '',
      type: equipment.type ?? 'Split',
      brand: equipment.brand ?? '',
      capacity: equipment.capacity ?? '',
      location: equipment.location ?? '',
      purchaseDate: equipment.purchaseDate || null,
      lastServiceDate: equipment.lastServiceDate || null,
      serialNumber: equipment.serialNumber || null,
    };

    if (equipment.id) {
      const response = await apiClient.put<CustomerEquipmentResponse>(`/customers/me/equipment/${equipment.id}`, {
        customerEquipmentId: Number(equipment.id),
        ...payload,
      });
      return mapEquipment(response);
    }

    const response = await apiClient.post<CustomerEquipmentResponse>('/customers/me/equipment', payload);
    return mapEquipment(response);
  }

  static async deleteEquipment(_userId: string, equipmentId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    await apiClient.delete(`/customers/me/equipment/${equipmentId}`);
  }
}
