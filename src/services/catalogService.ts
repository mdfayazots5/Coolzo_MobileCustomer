import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { SERVICES } from '../lib/mockData';

export const CatalogService = {
  async getServices(): Promise<any[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return SERVICES;
    }
    return apiClient.get<any[]>('/catalog/services');
  },

  async getServiceById(id: string): Promise<any> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return SERVICES.find(s => s.id === id);
    }
    return apiClient.get<any>(`/catalog/services/${id}`);
  },

  async searchServices(query: string): Promise<any[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return SERVICES.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) || 
        s.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    return apiClient.get<any[]>(`/catalog/search?q=${query}`);
  }
};
