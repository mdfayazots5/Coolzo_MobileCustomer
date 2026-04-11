import { API_CONFIG } from '../config/apiConfig';
import { apiClient, PagedResult } from './apiClient';
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

const normalizeInvoiceStatus = (status: string | undefined, balanceAmount = 0): Invoice['status'] => {
  const value = (status || '').toLowerCase();
  if (value.includes('paid') || balanceAmount <= 0) return 'Paid';
  if (value.includes('overdue')) return 'Overdue';
  return 'Pending';
};

const mapInvoice = (invoice: any): Invoice => {
  const balanceAmount = Number(invoice.balanceAmount ?? invoice.grandTotalAmount ?? invoice.amount ?? 0);
  const grandTotalAmount = Number(invoice.grandTotalAmount ?? invoice.total ?? balanceAmount);
  const lines = Array.isArray(invoice.lines) ? invoice.lines : [];

  return {
    id: String(invoice.invoiceId ?? invoice.id),
    userId: String(invoice.customerId ?? invoice.userId ?? ''),
    jobId: String(invoice.bookingId ?? invoice.quotationId ?? invoice.quotationNumber ?? invoice.jobId ?? ''),
    invoiceNumber: invoice.invoiceNumber || `INV-${invoice.invoiceId ?? invoice.id}`,
    amount: balanceAmount,
    date: invoice.invoiceDateUtc || invoice.date || new Date().toISOString(),
    status: normalizeInvoiceStatus(invoice.currentStatus || invoice.status, balanceAmount),
    items: lines.length > 0
      ? lines.map((line: any) => ({
        description: line.description || line.itemDescription || line.serviceName || line.lineDescription || 'Invoice item',
        amount: Number(line.lineTotalAmount ?? line.amount ?? line.totalAmount ?? 0),
      }))
      : [{ description: invoice.serviceName || 'Service invoice', amount: Number(invoice.subTotalAmount ?? grandTotalAmount) }],
    tax: Number(invoice.taxAmount ?? invoice.tax ?? 0),
    total: grandTotalAmount,
  };
};

const mapPaymentToReceipt = (payment: any, invoiceId: string) => ({
  invoiceId,
  receiptNumber: payment.receipt?.receiptNumber || payment.referenceNumber || `REC-${payment.paymentTransactionId ?? invoiceId}`,
  paymentDate: payment.paymentDateUtc || new Date().toISOString(),
  paymentMethod: payment.paymentMethod || 'Payment',
  transactionId: payment.referenceNumber || payment.gatewayTransactionId || String(payment.paymentTransactionId ?? ''),
  amount: Number(payment.paidAmount ?? 0),
  raw: payment,
});

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
    const result = await apiClient.get<PagedResult<any>>('/invoices/customer', { pageNumber: 1, pageSize: 50 });
    return result.items.map(mapInvoice);
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
    const invoice = await apiClient.get<any>(`/invoices/${id}`);
    return mapInvoice(invoice);
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
    const payments = await apiClient.get<any[]>(`/payments/invoice/${invoiceId}`);
    const latestPayment = payments[0];
    return latestPayment ? mapPaymentToReceipt(latestPayment, invoiceId) : null;
  }

  static async processPayment(data: any): Promise<any> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Processing payment...', data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { status: 'success', transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase() };
    }

    const transaction = await apiClient.post<any>('/payments/collect', {
      invoiceId: Number(data.invoiceId),
      paidAmount: Number(data.amount),
      paymentMethod: data.method,
      referenceNumber: data.referenceNumber,
      remarks: data.remarks || 'Customer mobile payment',
      idempotencyKey: `customer-mobile-payment-${data.invoiceId}-${Date.now()}`,
      gatewayTransactionId: data.gatewayTransactionId,
      signature: data.signature,
      expectedInvoiceAmount: Number(data.amount),
      isWebhookEvent: false,
      webhookReference: undefined,
    });

    return {
      status: 'success',
      transactionId: transaction.referenceNumber || transaction.paymentTransactionId,
      raw: transaction,
    };
  }
}
