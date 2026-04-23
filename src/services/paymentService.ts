import { API_CONFIG } from '../config/apiConfig';
import { readStoredTokens } from './authStorage';
import { apiClient } from './apiClient';

interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface InvoiceListItemResponse {
  invoiceId: number;
  invoiceNumber: string;
  quotationId: number;
  quotationNumber: string;
  customerName: string;
  currentStatus: string;
  grandTotalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  invoiceDateUtc: string;
}

interface InvoiceLineResponse {
  description: string;
  lineTotalAmount: number;
  quantity?: number;
  unitPriceAmount?: number;
  taxAmount?: number;
}

interface PaymentTransactionResponse {
  paymentTransactionId?: number;
  paymentMethod?: string | null;
  transactionReference?: string | null;
  paidAmount: number;
  paymentStatus?: string | null;
  paidOnUtc?: string | null;
}

interface InvoiceDetailResponse {
  invoiceId: number;
  invoiceNumber: string;
  quotationId: number;
  quotationNumber: string;
  customerId: number;
  customerName: string;
  mobileNumber: string;
  addressSummary: string;
  serviceName: string;
  currentStatus: string;
  invoiceDateUtc: string;
  subTotalAmount: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  grandTotalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  lastPaymentDateUtc?: string | null;
  lines: InvoiceLineResponse[];
  payments?: PaymentTransactionResponse[];
  billingHistory?: {
    status: string;
    changedOnUtc?: string | null;
    remarks?: string | null;
  }[];
}

export interface Invoice {
  id: string;
  userId: string;
  jobId: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: { description: string; amount: number; quantity?: number; unitPrice?: number; taxAmount?: number }[];
  tax: number;
  total: number;
  subTotal?: number;
  discountAmount?: number;
  paidAmount?: number;
  balanceAmount?: number;
  customerName?: string;
  mobileNumber?: string;
  addressSummary?: string;
  serviceName?: string;
  lastPaymentDate?: string | null;
  payments?: {
    amount: number;
    method: string;
    reference?: string;
    status?: string;
    paidOn?: string | null;
  }[];
}

interface ReceiptResponse {
  paymentReceiptId: number;
  receiptNumber: string;
  invoiceId: number;
  paymentTransactionId: number;
  receiptDateUtc: string;
  receivedAmount: number;
  balanceAmount: number;
  receiptRemarks: string;
}

interface PaymentGatewaySessionResponse {
  paymentId: string;
  paymentUrl: string;
  status: string;
}

interface PaymentStatusResponse {
  paymentId: string;
  invoiceId: string;
  status: 'Pending' | 'Confirmed' | 'Failed';
  paymentUrl?: string;
}

export interface ReceiptDetail {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  transactionId: string;
  paymentDate: string;
  paymentMethod: string;
  amount: number;
  balanceAmount: number;
  remarks?: string;
  jobId?: string;
}

function normalizeStatus(value?: string | null): Invoice['status'] {
  const normalized = (value ?? '').toLowerCase();

  if (normalized.includes('paid')) {
    return 'Paid';
  }

  if (normalized.includes('overdue')) {
    return 'Overdue';
  }

  return 'Pending';
}

function mapInvoiceListItem(item: InvoiceListItemResponse): Invoice {
  return {
    id: String(item.invoiceId),
    userId: '',
    jobId: item.quotationNumber || `Q-${item.quotationId}`,
    invoiceNumber: item.invoiceNumber,
    amount: Number(item.balanceAmount > 0 ? item.balanceAmount : item.grandTotalAmount),
    date: item.invoiceDateUtc,
    status: normalizeStatus(item.currentStatus),
    items: [],
    tax: 0,
    total: Number(item.grandTotalAmount),
    balanceAmount: Number(item.balanceAmount),
  };
}

function mapInvoiceDetail(item: InvoiceDetailResponse): Invoice {
  return {
    id: String(item.invoiceId),
    userId: String(item.customerId),
    jobId: item.quotationNumber || `Q-${item.quotationId}`,
    invoiceNumber: item.invoiceNumber,
    amount: Number(item.balanceAmount > 0 ? item.balanceAmount : item.grandTotalAmount),
    date: item.invoiceDateUtc,
    status: normalizeStatus(item.currentStatus),
    items: (item.lines ?? []).map((line) => ({
      description: line.description,
      amount: Number(line.lineTotalAmount),
      quantity: line.quantity,
      unitPrice: line.unitPriceAmount,
      taxAmount: line.taxAmount,
    })),
    tax: Number(item.taxAmount),
    total: Number(item.grandTotalAmount),
    subTotal: Number(item.subTotalAmount),
    discountAmount: Number(item.discountAmount),
    paidAmount: Number(item.paidAmount),
    balanceAmount: Number(item.balanceAmount),
    customerName: item.customerName,
    mobileNumber: item.mobileNumber,
    addressSummary: item.addressSummary,
    serviceName: item.serviceName,
    lastPaymentDate: item.lastPaymentDateUtc ?? null,
    payments: (item.payments ?? []).map((payment) => ({
      amount: Number(payment.paidAmount),
      method: payment.paymentMethod || 'Payment',
      reference: payment.transactionReference ?? undefined,
      status: payment.paymentStatus ?? undefined,
      paidOn: payment.paidOnUtc ?? null,
    })),
  };
}

export class PaymentService {
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
      }
    ];

    if (API_CONFIG.IS_MOCK) {
      return mockInvoices;
    }

    const response = await apiClient.get<PagedResponse<InvoiceListItemResponse>>('/invoices/customer?pageNumber=1&pageSize=20');
    return (response.items ?? []).map(mapInvoiceListItem);
  }

  static async getInvoiceById(id: string): Promise<Invoice | null> {
    if (API_CONFIG.IS_MOCK) {
      const invoices = await this.getInvoices('mock-user');
      return invoices.find(inv => inv.id === id) || null;
    }

    const response = await apiClient.get<InvoiceDetailResponse>(`/invoices/${id}`);
    return mapInvoiceDetail(response);
  }

  static async downloadInvoicePdf(invoiceId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      return;
    }

    const { accessToken } = readStoredTokens();
    const response = await fetch(`${API_CONFIG.BASE_URL}/invoices/${invoiceId}/pdf`, {
      method: 'GET',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Unable to download invoice PDF.');
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = `invoice-${invoiceId}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(objectUrl);
  }

  static async getReceipt(invoiceId: string): Promise<ReceiptDetail | null> {
    if (API_CONFIG.IS_MOCK) {
      return {
        id: invoiceId,
        invoiceId,
        receiptNumber: `REC-${invoiceId}`,
        paymentDate: '2024-03-15',
        paymentMethod: 'UPI',
        transactionId: 'TXN123456789',
        amount: 499,
        balanceAmount: 0,
      };
    }

    const [receipt, invoice] = await Promise.all([
      apiClient.get<ReceiptResponse>(`/payments/receipt/${invoiceId}`),
      this.getInvoiceById(invoiceId),
    ]);

    return {
      id: String(receipt.paymentReceiptId),
      receiptNumber: receipt.receiptNumber,
      invoiceId: String(receipt.invoiceId),
      transactionId: String(receipt.paymentTransactionId),
      paymentDate: receipt.receiptDateUtc,
      paymentMethod: invoice?.payments?.[0]?.method || 'Payment',
      amount: Number(receipt.receivedAmount),
      balanceAmount: Number(receipt.balanceAmount),
      remarks: receipt.receiptRemarks,
      jobId: invoice?.jobId,
    };
  }

  static async downloadReceiptPdf(invoiceId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      return;
    }

    const { accessToken } = readStoredTokens();
    const response = await fetch(`${API_CONFIG.BASE_URL}/payments/receipt/${invoiceId}/pdf`, {
      method: 'GET',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Unable to download receipt PDF.');
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = `receipt-${invoiceId}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(objectUrl);
  }

  static async processPayment(data: { invoiceId: string; method: string }): Promise<PaymentStatusResponse> {
    if (API_CONFIG.IS_MOCK) {
      return {
        paymentId: data.invoiceId,
        invoiceId: data.invoiceId,
        status: 'Confirmed',
      };
    }

    const initiated = await apiClient.post<PaymentGatewaySessionResponse>('/payments', {
      invoiceId: Number(data.invoiceId),
      method: data.method,
    });

    const deadline = Date.now() + 5 * 60 * 1000;

    while (Date.now() < deadline) {
      const status = await apiClient.get<PaymentStatusResponse>(`/payments/${initiated.paymentId}`);

      if (status.status === 'Confirmed' || status.status === 'Failed') {
        return status;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    return {
      paymentId: initiated.paymentId,
      invoiceId: data.invoiceId,
      status: 'Failed',
      paymentUrl: initiated.paymentUrl,
    };
  }
}
