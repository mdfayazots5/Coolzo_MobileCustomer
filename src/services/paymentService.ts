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
    if (API_CONFIG.IS_MOCK) {
      try {
        const q = query(
          collection(db, this.COLLECTION), 
          where('userId', '==', userId),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
        
        // Mock fallback
        if (invoices.length === 0) {
          return [
            {
              id: 'inv-1',
              userId,
              jobId: 'job-1',
              invoiceNumber: 'INV-2024-001',
              amount: 499,
              date: '2024-03-15',
              status: 'Paid',
              items: [{ description: 'General AC Checkup', amount: 499 }],
              tax: 0,
              total: 499
            }
          ];
        }
        return invoices;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, this.COLLECTION);
        return [];
      }
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
        // Mock fallback
        const invoices = await this.getInvoices('mock-user');
        return invoices.find(inv => inv.id === id) || null;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${this.COLLECTION}/${id}`);
        return null;
      }
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
