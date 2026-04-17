import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc, query, where, orderBy, updateDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: any;
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

export class NotificationService {
  private static COLLECTION = 'notifications';
  private static PREFS_COLLECTION = 'notification_preferences';

  static async getNotifications(userId: string): Promise<Notification[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          userId,
          title: 'Welcome to Coolzo!',
          message: 'Thank you for choosing us for your AC services.',
          type: 'success',
          isRead: false,
          createdAt: new Date(),
        },
        {
          id: '2',
          userId,
          title: 'Summer Offer',
          message: 'Get 20% off on your first deep cleaning service.',
          type: 'info',
          isRead: true,
          createdAt: new Date(Date.now() - 86400000),
        }
      ];
    }
    return apiClient.get<Notification[]>(`/users/${userId}/notifications`);
  }

  static onNotificationsUpdate(userId: string, callback: (notifications: Notification[]) => void): Unsubscribe {
    if (API_CONFIG.IS_MOCK) {
      // Return static data immediately for demo
      this.getNotifications(userId).then(callback);
      return () => {};
    }
    // For real API, we might use WebSockets or polling, but for now we'll just return a dummy unsubscribe
    return () => {};
  }

  static async markAsRead(notificationId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Marking notification as read', notificationId);
      return;
    }
    return apiClient.put(`/notifications/${notificationId}/read`, {});
  }

  static async getPreferences(userId: string): Promise<NotificationPreferences> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const docSnap = await getDoc(doc(db, this.PREFS_COLLECTION, userId));
        if (docSnap.exists()) {
          return docSnap.data() as NotificationPreferences;
        }
        return { push: true, email: true, sms: false, whatsapp: true, offers: true, updates: true };
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${this.PREFS_COLLECTION}/${userId}`);
        throw error;
      }
    }
    return apiClient.get<NotificationPreferences>(`/users/${userId}/notifications/preferences`);
  }

  static async updatePreferences(userId: string, prefs: NotificationPreferences): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      try {
        await setDoc(doc(db, this.PREFS_COLLECTION, userId), prefs, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${this.PREFS_COLLECTION}/${userId}`);
      }
      return;
    }
    return apiClient.put(`/users/${userId}/notifications/preferences`, prefs);
  }
}
