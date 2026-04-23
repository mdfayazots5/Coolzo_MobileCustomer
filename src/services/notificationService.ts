import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';

interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface CustomerNotificationResponse {
  customerNotificationId: number;
  customerId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  link?: string | null;
}

interface CommunicationPreferenceResponse {
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsAppEnabled: boolean;
  pushEnabled: boolean;
  allowPromotionalContent: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  offers: boolean;
  updates: boolean;
}

function normalizeType(value?: string | null): Notification['type'] {
  const normalized = (value ?? '').toLowerCase();

  if (normalized.includes('success') || normalized.includes('confirmed')) {
    return 'success';
  }

  if (normalized.includes('warn') || normalized.includes('reminder')) {
    return 'warning';
  }

  if (normalized.includes('error') || normalized.includes('failed')) {
    return 'error';
  }

  return 'info';
}

function mapNotification(item: CustomerNotificationResponse): Notification {
  return {
    id: String(item.customerNotificationId),
    userId: String(item.customerId),
    title: item.title,
    message: item.message,
    type: normalizeType(item.type),
    isRead: item.isRead,
    createdAt: item.createdAt,
    link: item.link ?? undefined,
  };
}

export class NotificationService {
  static async getNotifications(_userId: string): Promise<Notification[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          userId: 'demo-user',
          title: 'Welcome to Coolzo!',
          message: 'Thank you for choosing us for your AC services.',
          type: 'success',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: 'demo-user',
          title: 'Summer Offer',
          message: 'Get 20% off on your first deep cleaning service.',
          type: 'info',
          isRead: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
    }

    const response = await apiClient.get<PagedResponse<CustomerNotificationResponse>>('/notifications/unread?pageNumber=1&pageSize=100');
    return (response.items ?? []).map(mapNotification);
  }

  static onNotificationsUpdate(userId: string, callback: (notifications: Notification[]) => void): () => void {
    let cancelled = false;

    const load = async () => {
      const notifications = await this.getNotifications(userId);

      if (!cancelled) {
        callback(notifications);
      }
    };

    void load();

    const intervalId = window.setInterval(() => {
      void load();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }

  static async markAsRead(notificationId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      return;
    }

    await apiClient.post(`/customer-notifications/${notificationId}/mark-read`, {});
  }

  static async markAllRead(): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      return;
    }

    await apiClient.request('/notifications/mark-read', { method: 'PATCH' });
  }

  static async getPreferences(_userId: string): Promise<NotificationPreferences> {
    if (API_CONFIG.IS_MOCK) {
      return { push: true, email: true, sms: false, whatsapp: true, offers: true, updates: true };
    }

    const response = await apiClient.get<CommunicationPreferenceResponse>('/communication-preferences/me');
    return {
      push: response.pushEnabled,
      email: response.emailEnabled,
      sms: response.smsEnabled,
      whatsapp: response.whatsAppEnabled,
      offers: response.allowPromotionalContent,
      updates: true,
    };
  }

  static async updatePreferences(_userId: string, prefs: NotificationPreferences): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      return;
    }

    await apiClient.put('/communication-preferences/me', {
      emailEnabled: prefs.email,
      smsEnabled: prefs.sms,
      whatsAppEnabled: prefs.whatsapp,
      pushEnabled: prefs.push,
      allowPromotionalContent: prefs.offers,
      emailAddress: null,
      mobileNumber: null,
    });
  }
}
