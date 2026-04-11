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

interface CommunicationPreferenceResponse {
  emailAddress: string;
  mobileNumber: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsAppEnabled: boolean;
  pushEnabled: boolean;
  allowPromotionalContent: boolean;
}

const mapPreferences = (prefs: CommunicationPreferenceResponse): NotificationPreferences => ({
  push: prefs.pushEnabled,
  email: prefs.emailEnabled,
  sms: prefs.smsEnabled,
  whatsapp: prefs.whatsAppEnabled,
  offers: prefs.allowPromotionalContent,
  updates: true,
});

export class NotificationService {
  private static COLLECTION = 'notifications';
  private static PREFS_COLLECTION = 'notification_preferences';

  static async getNotifications(userId: string): Promise<Notification[]> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const q = query(
          collection(db, this.COLLECTION), 
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return [];
      }
    }
    return [];
  }

  static onNotificationsUpdate(userId: string, callback: (notifications: Notification[]) => void): Unsubscribe {
    if (API_CONFIG.IS_MOCK) {
      const q = query(
        collection(db, this.COLLECTION), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        callback(notifications);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
      });
    }
    void this.getNotifications(userId)
      .then(callback)
      .catch((error) => {
        console.error('Failed to fetch notifications:', error);
        callback([]);
      });
    return () => {};
  }

  static async markAsRead(notificationId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      const path = `${this.COLLECTION}/${notificationId}`;
      try {
        await updateDoc(doc(db, this.COLLECTION, notificationId), { isRead: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
      return;
    }
    return;
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
    const prefs = await apiClient.get<CommunicationPreferenceResponse>('/communication-preferences/me');
    return mapPreferences(prefs);
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
    await apiClient.put<CommunicationPreferenceResponse>('/communication-preferences/me', {
      emailEnabled: prefs.email,
      smsEnabled: prefs.sms,
      whatsAppEnabled: prefs.whatsapp,
      pushEnabled: prefs.push,
      allowPromotionalContent: prefs.offers,
    });
  }
}
