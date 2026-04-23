import { API_CONFIG } from '../config/apiConfig';
import { SERVICES } from '../lib/mockData';
import { apiClient } from './apiClient';

const SERVICE_CACHE_KEY = '@ce_service_types_cache';
const SERVICE_CACHE_TTL_MS = 60 * 60 * 1000;

export interface CatalogServiceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  durationMinutes: number;
  iconKey: string;
  image: string;
  included: string[];
  faqs: { question: string; answer: string }[];
}

interface ServiceTypeListItemResponse {
  id: number;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  estimatedDurationInMinutes: number;
  iconKey: string;
}

interface ServiceTypeDetailResponse extends ServiceTypeListItemResponse {
  subTypes: { id: string; name: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

function toDuration(durationMinutes: number) {
  if (!durationMinutes) {
    return '60 mins';
  }

  if (durationMinutes % 60 === 0) {
    return `${durationMinutes / 60} hr`;
  }

  return `${durationMinutes} mins`;
}

function createImageSeed(name: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(name)}/1200/800`;
}

function mapMockService(item: typeof SERVICES[number]): CatalogServiceItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    price: item.price,
    duration: item.duration,
    durationMinutes: 60,
    iconKey: item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    image: item.image,
    included: item.included,
    faqs: item.howItWorks
      ? [{ question: 'How it works', answer: item.howItWorks }]
      : [],
  };
}

function mapListItem(item: ServiceTypeListItemResponse): CatalogServiceItem {
  return {
    id: String(item.id),
    name: item.name,
    description: item.description,
    category: item.category || 'Service',
    price: item.basePrice,
    duration: toDuration(item.estimatedDurationInMinutes),
    durationMinutes: item.estimatedDurationInMinutes,
    iconKey: item.iconKey,
    image: createImageSeed(item.name),
    included: [],
    faqs: [],
  };
}

function mapDetailItem(item: ServiceTypeDetailResponse): CatalogServiceItem {
  const baseItem = mapListItem(item);

  return {
    ...baseItem,
    included: item.subTypes.map((subType) => subType.name),
    faqs: item.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  };
}

export const CatalogService = {
  async getServices(): Promise<CatalogServiceItem[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return SERVICES.map(mapMockService);
    }

    const cached = localStorage.getItem(SERVICE_CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as { savedAt: number; items: CatalogServiceItem[] };

        if (Date.now() - parsed.savedAt < SERVICE_CACHE_TTL_MS) {
          return parsed.items;
        }
      } catch {
        localStorage.removeItem(SERVICE_CACHE_KEY);
      }
    }

    const response = await apiClient.get<ServiceTypeListItemResponse[]>('/service-types?visibility=public');
    const items = response.map(mapListItem);
    localStorage.setItem(SERVICE_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), items }));
    return items;
  },

  async getServiceById(id: string): Promise<CatalogServiceItem | undefined> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const service = SERVICES.find((item) => item.id === id);
      return service ? mapMockService(service) : undefined;
    }

    const response = await apiClient.get<ServiceTypeDetailResponse>(`/service-types/${id}`);
    return mapDetailItem(response);
  },

  async searchServices(query: string): Promise<CatalogServiceItem[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return SERVICES.map(mapMockService).filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    const response = await apiClient.get<ServiceTypeListItemResponse[]>(`/service-types?visibility=public&search=${encodeURIComponent(query)}`);
    return response.map(mapListItem);
  }
};
