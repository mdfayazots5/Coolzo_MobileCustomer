import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, addDoc, serverTimestamp, onSnapshot, Unsubscribe } from 'firebase/firestore';

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  createdAt: any;
  updatedAt: any;
  messages: {
    id: string;
    sender: 'User' | 'Support';
    text: string;
    timestamp: any;
  }[];
}

export class SupportService {
  private static COLLECTION = 'support_tickets';

  static async getTickets(userId: string): Promise<SupportTicket[]> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const q = query(
          collection(db, this.COLLECTION), 
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return [];
      }
    }
    return apiClient.get<SupportTicket[]>(`/users/${userId}/tickets`);
  }

  static async getTicketById(id: string): Promise<SupportTicket | null> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const docSnap = await getDoc(doc(db, this.COLLECTION, id));
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as SupportTicket;
        }
        return null;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${this.COLLECTION}/${id}`);
        return null;
      }
    }
    return apiClient.get<SupportTicket>(`/tickets/${id}`);
  }

  static onTicketUpdate(id: string, callback: (ticket: SupportTicket) => void): Unsubscribe {
    if (API_CONFIG.IS_MOCK) {
      return onSnapshot(doc(db, this.COLLECTION, id), (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() } as SupportTicket);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `${this.COLLECTION}/${id}`);
      });
    }
    return () => {};
  }

  static async createTicket(userId: string, ticket: Partial<SupportTicket>): Promise<string> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const docRef = await addDoc(collection(db, this.COLLECTION), {
          ...ticket,
          userId,
          status: 'Open',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          messages: []
        });
        return docRef.id;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, this.COLLECTION);
        throw error;
      }
    }
    const response = await apiClient.post<{ id: string }>(`/users/${userId}/tickets`, ticket);
    return response.id;
  }
}
