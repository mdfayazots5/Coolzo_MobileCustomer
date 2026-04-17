import { API_CONFIG } from '../config/apiConfig';
import { apiClient } from './apiClient';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy } from 'firebase/firestore';

export interface Invoice {
  id: string;
  userId: string;
  jobId: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: { description: string; amount: number }[];
  tax: number;
  total: number;
}

export class PaymentService {
  private static COLLECTION = 'invoices';

  static async getInvoices(userId: string): Promise<Invoice[]> {
    const mockInvoices: Invoice[] = [
      {
        id: 'inv-1',
        userId,
        jobId: 'J-8812',
        invoiceNumber: 'INV-2024-012',
        amount: 5499,
        date: '2024-04-10',
        status: 'Overdue',
        items: [{ description: 'Deep Cleaning & Gas Refill', amount: 5499 }],
        tax: 0,
        total: 5499
      },
      {
        id: 'inv-2',
        userId,
        jobId: 'J-8790',
        invoiceNumber: 'INV-2024-011',
        amount: 899,
        date: '2024-04-05',
        status: 'Pending',
        items: [{ description: 'Wet Servicing', amount: 899 }],
        tax: 0,
        total: 899
      },
      {
        id: 'inv-3',
        userId,
        jobId: 'J-8755',
        invoiceNumber: 'INV-2024-010',
        amount: 1499,
        date: '2024-03-28',
        status: 'Paid',
        items: [{ description: 'Installation Service', amount: 1499 }],
        tax: 0,
        total: 1499
      },
      ...Array.from({ length: 9 }).map((_, i) => ({
        id: `inv-old-${i}`,
        userId,
        jobId: `J-old-${i}`,
        invoiceNumber: `INV-2024-00${9-i}`,
        amount: 499 + (i * 100),
        date: `2024-02-${10 + i}`,
        status: 'Paid' as const,
        items: [{ description: 'Regular Maintenance', amount: 499 + (i * 100) }],
        tax: 0,
        total: 499 + (i * 100)
      }))
    ];

    if (API_CONFIG.IS_MOCK) {
      try {
        const q = query(
          collection(db, this.COLLECTION), 
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
        
        if (invoices.length > 0) {
          invoices.sort((a, b) => b.date.localeCompare(a.date));
          return invoices;
        }
      } catch (error) {
        console.warn('Firestore fetch failed in mock mode, using static fallback.', error);
      }
      return mockInvoices;
    }
    return apiClient.get<Invoice[]>(`/users/${userId}/invoices`);
  }

  static async getInvoiceById(id: string): Promise<Invoice | null> {
    if (API_CONFIG.IS_MOCK) {
      try {
        const docSnap = await getDoc(doc(db, this.COLLECTION, id));
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Invoice;
        }
      } catch (error) {
        console.warn('Firestore fetch failed in mock mode, falling back to static list.', error);
      }
      
      // Mock fallback from list
      const invoices = await this.getInvoices('mock-user');
      return invoices.find(inv => inv.id === id) || null;
    }
    return apiClient.get<Invoice>(`/invoices/${id}`);
  }

  static async getReceipt(invoiceId: string): Promise<any> {
    if (API_CONFIG.IS_MOCK) {
      return {
        invoiceId,
        receiptNumber: `REC-${invoiceId}`,
        paymentDate: '2024-03-15',
        paymentMethod: 'UPI',
        transactionId: 'TXN123456789',
        amount: 499
      };
    }
    return apiClient.get<any>(`/payments/receipt/${invoiceId}`);
  }

  static async processPayment(data: any): Promise<any> {
    // Mock payment processing
    console.log('Processing payment...', data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { status: 'success', transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase() };
  }
}
