import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';

interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface CountResponse {
  count: number;
}

interface LookupItemResponse {
  value: number;
  label: string;
}

interface CreateTicketInput {
  category: string;
  subject: string;
  description: string;
  priority?: SupportTicket['priority'];
  relatedBookingId?: string;
}

interface SupportTicketListItemResponse {
  supportTicketId: number;
  ticketNumber: string;
  subject: string;
  customerName: string;
  customerMobile: string;
  linkedEntityType?: string | null;
  linkedEntitySummary: string;
  categoryName: string;
  priorityName: string;
  status: string;
  assignedUserId?: number | null;
  assignedOwnerName?: string | null;
  dateCreated: string;
  lastUpdated?: string | null;
}

interface SupportTicketReplyResponse {
  supportTicketReplyId: number;
  replyText: string;
  isInternalOnly: boolean;
  isFromCustomer: boolean;
  createdBy: string;
  replyDateUtc: string;
}

interface SupportTicketDetailResponse {
  supportTicketId: number;
  ticketNumber: string;
  subject: string;
  description: string;
  customerId: number;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  supportTicketCategoryId: number;
  categoryName: string;
  supportTicketPriorityId: number;
  priorityName: string;
  status: string;
  assignedUserId?: number | null;
  assignedOwnerName?: string | null;
  dateCreated: string;
  lastUpdated?: string | null;
  canCustomerClose: boolean;
  replies: SupportTicketReplyResponse[];
}

export interface SupportMessage {
  id: string;
  sender: 'User' | 'Support';
  text: string;
  timestamp: string;
  createdBy?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  ticketNumber?: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
  canCustomerClose?: boolean;
  assignedOwnerName?: string | null;
  linkedEntitySummary?: string;
  hasUnreadReply?: boolean;
}

function normalizeStatus(value?: string | null): SupportTicket['status'] {
  const normalized = (value ?? '').toLowerCase();

  if (normalized.includes('resolved')) {
    return 'Resolved';
  }

  if (normalized.includes('closed')) {
    return 'Closed';
  }

  if (normalized.includes('progress') || normalized.includes('responded') || normalized.includes('assigned')) {
    return 'In Progress';
  }

  return 'Open';
}

function normalizePriority(value?: string | null): SupportTicket['priority'] {
  const normalized = (value ?? '').toLowerCase();

  if (normalized.includes('high')) {
    return 'High';
  }

  if (normalized.includes('low')) {
    return 'Low';
  }

  return 'Medium';
}

function mapReply(reply: SupportTicketReplyResponse): SupportMessage {
  return {
    id: String(reply.supportTicketReplyId),
    sender: reply.isFromCustomer ? 'User' : 'Support',
    text: reply.replyText,
    timestamp: reply.replyDateUtc,
    createdBy: reply.createdBy,
  };
}

function mapTicketListItem(ticket: SupportTicketListItemResponse): SupportTicket {
  return {
    id: String(ticket.supportTicketId),
    userId: '',
    ticketNumber: ticket.ticketNumber,
    subject: ticket.subject,
    description: ticket.linkedEntitySummary || ticket.subject,
    status: normalizeStatus(ticket.status),
    priority: normalizePriority(ticket.priorityName),
    category: ticket.categoryName,
    createdAt: ticket.dateCreated,
    updatedAt: ticket.lastUpdated ?? ticket.dateCreated,
    messages: [],
    assignedOwnerName: ticket.assignedOwnerName,
    linkedEntitySummary: ticket.linkedEntitySummary,
    hasUnreadReply: !!ticket.lastUpdated && ticket.lastUpdated !== ticket.dateCreated && normalizeStatus(ticket.status) !== 'Closed',
  };
}

function mapTicketDetail(ticket: SupportTicketDetailResponse): SupportTicket {
  return {
    id: String(ticket.supportTicketId),
    userId: String(ticket.customerId),
    ticketNumber: ticket.ticketNumber,
    subject: ticket.subject,
    description: ticket.description,
    status: normalizeStatus(ticket.status),
    priority: normalizePriority(ticket.priorityName),
    category: ticket.categoryName,
    createdAt: ticket.dateCreated,
    updatedAt: ticket.lastUpdated ?? ticket.dateCreated,
    messages: (ticket.replies ?? []).map(mapReply),
    canCustomerClose: ticket.canCustomerClose,
    assignedOwnerName: ticket.assignedOwnerName,
  };
}

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export class SupportService {
  private static categoryCache: LookupItemResponse[] | null = null;
  private static priorityCache: LookupItemResponse[] | null = null;

  private static async getCategories(): Promise<LookupItemResponse[]> {
    if (!this.categoryCache) {
      this.categoryCache = await apiClient.get<LookupItemResponse[]>('/support/categories');
    }

    return this.categoryCache;
  }

  static async getCategoryOptions(): Promise<string[]> {
    if (API_CONFIG.IS_MOCK) {
      return ['Booking Issue', 'Technician Complaint', 'Billing Dispute', 'AMC Enquiry', 'General Enquiry'];
    }

    const categories = await this.getCategories();
    return categories.map((item) => item.label);
  }

  private static async getPriorities(): Promise<LookupItemResponse[]> {
    if (!this.priorityCache) {
      this.priorityCache = await apiClient.get<LookupItemResponse[]>('/support-ticket-lookups/priorities');
    }

    return this.priorityCache;
  }

  private static resolveLookupId(options: LookupItemResponse[], preferredLabel: string, fallbackLabel?: string): number {
    const preferred = normalizeLabel(preferredLabel);
    const fallback = fallbackLabel ? normalizeLabel(fallbackLabel) : null;

    return (
      options.find((item) => normalizeLabel(item.label) === preferred)?.value ??
      (fallback ? options.find((item) => normalizeLabel(item.label) === fallback)?.value : undefined) ??
      options[0]?.value ??
      0
    );
  }

  static async getTickets(_userId: string): Promise<SupportTicket[]> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: 'ticket-1',
          userId: 'demo-user',
          ticketNumber: 'SUP-0001',
          subject: 'AC not cooling',
          description: 'My AC is not cooling properly since yesterday.',
          status: 'Open',
          priority: 'High',
          category: 'Repair',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [
            { id: 'm1', sender: 'User', text: 'My AC is not cooling properly.', timestamp: new Date().toISOString() }
          ]
        }
      ];
    }

    const response = await apiClient.get<PagedResponse<SupportTicketListItemResponse>>('/support-tickets/my-tickets?pageNumber=1&pageSize=50');
    return (response.items ?? []).map(mapTicketListItem);
  }

  static async getTicketById(id: string): Promise<SupportTicket | null> {
    if (API_CONFIG.IS_MOCK) {
      const tickets = await this.getTickets('demo-user');
      return tickets.find(t => t.id === id) || null;
    }

    const response = await apiClient.get<SupportTicketDetailResponse>(`/support-tickets/${id}`);
    return mapTicketDetail(response);
  }

  static onTicketUpdate(id: string, callback: (ticket: SupportTicket) => void): () => void {
    let cancelled = false;

    const load = async () => {
      const ticket = await this.getTicketById(id);

      if (!cancelled && ticket) {
        callback(ticket);
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

  static async createTicket(_userId: string, ticket: CreateTicketInput): Promise<string> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return 'mock-ticket-id';
    }

    const [categories, priorities] = await Promise.all([
      this.getCategories(),
      this.getPriorities(),
    ]);
    const categoryId = this.resolveLookupId(categories, ticket.category ?? 'General Enquiry', 'Booking Issue');
    const priorityId = this.resolveLookupId(priorities, ticket.priority ?? 'Medium', 'Medium');

    const response = await apiClient.post<SupportTicketDetailResponse>('/support-tickets', {
      customerId: null,
      subject: ticket.subject,
      categoryId,
      priorityId,
      description: ticket.description,
      links: ticket.relatedBookingId ? [{
        linkedEntityType: 'Booking',
        linkedEntityId: Number(ticket.relatedBookingId),
      }] : [],
    });

    return String(response.supportTicketId);
  }

  static async addMessage(ticketId: string, _sender: 'User' | 'Support', text: string, attachmentIds?: string[]): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    await apiClient.post(`/support-tickets/${ticketId}/replies`, {
      replyText: text,
      isInternalOnly: false,
      attachmentIds: attachmentIds ?? [],
    });
  }

  static async getUnreadCount(): Promise<number> {
    if (API_CONFIG.IS_MOCK) {
      return 0;
    }

    const response = await apiClient.get<CountResponse>('/support-tickets/my-tickets?unread=true&countOnly=true');
    return response.count ?? 0;
  }

  static async closeTicket(ticketId: string, remarks: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      return;
    }

    await apiClient.post(`/support-tickets/${ticketId}/close`, { remarks });
  }
}
