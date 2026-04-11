import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { SERVICES } from '../lib/mockData';

export interface CatalogServiceItem {
  id: string;
  serviceId?: number;
  serviceCategoryId?: number;
  category: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  included: string[];
  howItWorks: string;
}

export interface BookingLookupItem {
  id: string;
  name: string;
  description?: string;
}

export interface ZoneLookup {
  zoneId: number;
  zoneName: string;
  cityName: string;
  pincode: string;
}

export interface SlotAvailability {
  slotAvailabilityId: number;
  zoneId: number;
  slotDate: string;
  slotLabel: string;
  startTime: string;
  endTime: string;
  availableCapacity: number;
  reservedCapacity: number;
  isAvailable: boolean;
}

interface ServiceLookupResponse {
  serviceId: number;
  serviceCategoryId: number;
  serviceName: string;
  summary: string;
  basePrice: number;
  pricingModelName: string;
}

const mapService = (service: ServiceLookupResponse): CatalogServiceItem => ({
  id: String(service.serviceId),
  serviceId: service.serviceId,
  serviceCategoryId: service.serviceCategoryId,
  category: service.pricingModelName || 'Service',
  name: service.serviceName,
  description: service.summary,
  duration: 'As per slot',
  price: Number(service.basePrice || 0),
  image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
  included: [service.pricingModelName || 'Service visit'],
  howItWorks: service.summary,
});

const mapLookup = (idKey: string, nameKey: string) => (item: any): BookingLookupItem => ({
  id: String(item[idKey]),
  name: item[nameKey],
  description: item.description,
});

export const CatalogService = {
  async getServices(search?: string): Promise<CatalogServiceItem[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return SERVICES;
    }
    const services = await apiClient.get<ServiceLookupResponse[]>('/booking-lookups/services', { search });
    return services.map(mapService);
  },

  async getServiceById(id: string): Promise<CatalogServiceItem | undefined> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return SERVICES.find(s => s.id === id);
    }
    const services = await this.getServices();
    return services.find((service) => service.id === id);
  },

  async searchServices(query: string): Promise<CatalogServiceItem[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return SERVICES.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) || 
        s.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    return this.getServices(query);
  },

  async getAcTypes(search?: string): Promise<BookingLookupItem[]> {
    if (API_CONFIG.IS_MOCK) {
      return [
        { id: 'Split', name: 'Split AC' },
        { id: 'Window', name: 'Window AC' },
        { id: 'Cassette', name: 'Cassette' },
        { id: 'Centralized', name: 'Centralized' },
      ];
    }
    const items = await apiClient.get<any[]>('/booking-lookups/ac-types', { search });
    return items.map(mapLookup('acTypeId', 'acTypeName'));
  },

  async getBrands(search?: string): Promise<BookingLookupItem[]> {
    if (API_CONFIG.IS_MOCK) {
      return ['Samsung', 'LG', 'Daikin', 'Voltas', 'Blue Star', 'Mitsubishi', 'Lloyd', 'Other'].map((name) => ({ id: name, name }));
    }
    const items = await apiClient.get<any[]>('/booking-lookups/brands', { search });
    return items.map(mapLookup('brandId', 'brandName'));
  },

  async getTonnages(search?: string): Promise<BookingLookupItem[]> {
    if (API_CONFIG.IS_MOCK) {
      return ['1T', '1.5T', '2T', '3T+'].map((name) => ({ id: name, name }));
    }
    const items = await apiClient.get<any[]>('/booking-lookups/tonnage', { search });
    return items.map(mapLookup('tonnageId', 'tonnageName'));
  },

  async getZoneByPincode(pincode: string): Promise<ZoneLookup | null> {
    if (API_CONFIG.IS_MOCK) {
      return { zoneId: 1, zoneName: 'Demo Zone', cityName: 'Mumbai', pincode };
    }
    return apiClient.get<ZoneLookup>(`/booking-lookups/zones/by-pincode/${encodeURIComponent(pincode)}`);
  },

  async getSlots(zoneId: number, slotDate: string): Promise<SlotAvailability[]> {
    if (API_CONFIG.IS_MOCK) {
      return [
        { slotAvailabilityId: 1, zoneId, slotDate, slotLabel: 'Morning', startTime: '08:00', endTime: '12:00', availableCapacity: 4, reservedCapacity: 0, isAvailable: true },
        { slotAvailabilityId: 2, zoneId, slotDate, slotLabel: 'Afternoon', startTime: '12:00', endTime: '16:00', availableCapacity: 4, reservedCapacity: 0, isAvailable: true },
        { slotAvailabilityId: 3, zoneId, slotDate, slotLabel: 'Evening', startTime: '16:00', endTime: '19:00', availableCapacity: 3, reservedCapacity: 0, isAvailable: true },
      ];
    }
    return apiClient.get<SlotAvailability[]>('/booking-lookups/slots', { zoneId, slotDate });
  }
};
