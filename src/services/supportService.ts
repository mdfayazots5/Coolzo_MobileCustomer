import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, addDoc, updateDoc, serverTimestamp, onSnapshot, Unsubscribe } from 'firebase/firestore';

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
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 'ticket-1',
          userId,
          subject: 'AC not cooling',
          description: 'My AC is not cooling properly since yesterday.',
          status: 'Open',
          priority: 'High',
          category: 'Repair',
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [
            { id: 'm1', sender: 'User', text: 'My AC is not cooling properly.', timestamp: new Date() }
          ]
        }
      ];
    }
    return apiClient.get<SupportTicket[]>(`/users/${userId}/tickets`);
  }

  static async getTicketById(id: string): Promise<SupportTicket | null> {
    if (API_CONFIG.IS_MOCK) {
      const tickets = await this.getTickets('demo-user');
      return tickets.find(t => t.id === id) || null;
    }
    return apiClient.get<SupportTicket>(`/tickets/${id}`);
  }

  static onTicketUpdate(id: string, callback: (ticket: SupportTicket) => void): Unsubscribe {
    if (API_CONFIG.IS_MOCK) {
      this.getTicketById(id).then(ticket => ticket && callback(ticket));
      return () => {};
    }
    return () => {};
  }

  static async createTicket(userId: string, ticket: Partial<SupportTicket>): Promise<string> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return 'mock-ticket-id';
    }
    const response = await apiClient.post<{ id: string }>(`/users/${userId}/tickets`, ticket);
    return response.id;
  }

  static async addMessage(ticketId: string, sender: 'User' | 'Support', text: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Adding message to ticket', ticketId, text);
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    return apiClient.post(`/tickets/${ticketId}/messages`, { sender, text });
  }
}
