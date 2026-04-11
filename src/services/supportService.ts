import { API_CONFIG } from '../config/apiConfig';
import { apiClient, PagedResult } from './apiClient';
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

export interface LookupItem {
  value: number;
  label: string;
}

const normalizeTicketStatus = (status: string | undefined): SupportTicket['status'] => {
  const value = (status || 'Open').toLowerCase();
  if (value.includes('close')) return 'Closed';
  if (value.includes('resolve')) return 'Resolved';
  if (value.includes('progress') || value.includes('assign')) return 'In Progress';
  return 'Open';
};

const normalizePriority = (priority: string | undefined): SupportTicket['priority'] => {
  const value = (priority || 'Medium').toLowerCase();
  if (value.includes('high')) return 'High';
  if (value.includes('low')) return 'Low';
  return 'Medium';
};

const mapReply = (reply: any): SupportTicket['messages'][number] => ({
  id: String(reply.supportTicketReplyId ?? reply.id),
  sender: reply.isFromCustomer ? 'User' : 'Support',
  text: reply.replyText || '',
  timestamp: reply.replyDateUtc || reply.createdAt || new Date().toISOString(),
});

const mapTicket = (ticket: any): SupportTicket => ({
  id: String(ticket.supportTicketId ?? ticket.id),
  userId: String(ticket.customerId ?? ticket.userId ?? ''),
  subject: ticket.subject || ticket.ticketNumber || 'Support ticket',
  description: ticket.description || ticket.linkedEntitySummary || '',
  status: normalizeTicketStatus(ticket.status),
  priority: normalizePriority(ticket.priorityName || ticket.priority),
  category: ticket.categoryName || ticket.category || 'General',
  createdAt: ticket.dateCreated || ticket.createdAt || new Date().toISOString(),
  updatedAt: ticket.lastUpdated || ticket.updatedAt || ticket.dateCreated || new Date().toISOString(),
  messages: Array.isArray(ticket.replies) ? ticket.replies.map(mapReply).filter((message: any) => message.text) : [],
});

const pickLookup = (items: LookupItem[], label: string | undefined, preferredFallback: string) => {
  if (items.length === 0) {
    throw new Error('Support ticket lookup values are unavailable.');
  }
  const normalized = (label || preferredFallback).toLowerCase();
  return (
    items.find((item) => item.label.toLowerCase() === normalized) ||
    items.find((item) => item.label.toLowerCase().includes(normalized)) ||
    items.find((item) => item.label.toLowerCase().includes(preferredFallback.toLowerCase())) ||
    items[0]
  );
};

export class SupportService {
  private static COLLECTION = 'support_tickets';

  static async getCategories(): Promise<LookupItem[]> {
    if (API_CONFIG.IS_MOCK) {
      return [
        { value: 1, label: 'Booking Issue' },
        { value: 2, label: 'Technician Concern' },
        { value: 3, label: 'Invoice Query' },
        { value: 4, label: 'AMC Query' },
        { value: 5, label: 'App Issue' },
        { value: 6, label: 'General' },
      ];
    }
    return apiClient.get<LookupItem[]>('/support-ticket-lookups/categories');
  }

  static async getPriorities(): Promise<LookupItem[]> {
    if (API_CONFIG.IS_MOCK) {
      return [
        { value: 1, label: 'Low' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'High' },
      ];
    }
    return apiClient.get<LookupItem[]>('/support-ticket-lookups/priorities');
  }

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
    const result = await apiClient.get<PagedResult<any>>('/support-tickets/my-tickets', { pageNumber: 1, pageSize: 50 });
    return result.items.map(mapTicket);
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
    const ticket = await apiClient.get<any>(`/support-tickets/${id}`);
    return mapTicket(ticket);
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
    void this.getTicketById(id)
      .then((ticket) => {
        if (ticket) callback(ticket);
      })
      .catch((error) => console.error('Failed to fetch support ticket:', error));
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
    const [categories, priorities] = await Promise.all([
      this.getCategories(),
      this.getPriorities(),
    ]);

    const category = pickLookup(categories, ticket.category, 'General');
    const priority = pickLookup(priorities, ticket.priority, 'Medium');
    const response = await apiClient.post<any>('/support-tickets', {
      customerId: undefined,
      subject: ticket.subject || 'Customer support request',
      categoryId: category.value,
      priorityId: priority.value,
      description: ticket.description || '',
      links: [],
    });
    return String(response.supportTicketId);
  }

  static async addMessage(ticketId: string, replyText: string): Promise<SupportTicket['messages'][number]> {
    if (API_CONFIG.IS_MOCK) {
      return {
        id: `local-${Date.now()}`,
        sender: 'User',
        text: replyText,
        timestamp: new Date().toISOString(),
      };
    }

    const reply = await apiClient.post<any>(`/support-tickets/${ticketId}/replies`, {
      replyText,
      isInternalOnly: false,
    });
    return mapReply(reply);
  }
}
