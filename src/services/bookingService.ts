import { API_CONFIG } from '../config/apiConfig';
import { JOBS } from '../lib/mockData';
import { AddressService } from './addressService';
import { readStoredTokens } from './authStorage';
import { apiClient } from './apiClient';
import { CatalogService } from './catalogService';
import { EquipmentService } from './equipmentService';

export interface DashboardActiveJob {
  id: string;
  srNumber: string;
  serviceType: string;
  technicianName?: string | null;
  technicianId?: number | null;
  technicianPhotoUrl?: string | null;
  technicianRating?: number | null;
  currentStatus: string;
  status: string;
  eta?: string | null;
  lastUpdatedAt: string;
}

export interface DashboardData {
  activeJob: DashboardActiveJob | null;
  amcSummary: {
    contractName: string;
    planType: string;
    nextVisitDate?: string | null;
    visitsRemaining: number;
  } | null;
  recentBookings: {
    id: string;
    srNumber: string;
    date: string;
    serviceType: string;
    status: string;
  }[];
  promoBanner: {
    imageUrl: string;
    ctaText: string;
    ctaUrl: string;
  } | null;
}

export interface BookingWizardPayload {
  customerId?: string | null;
  serviceTypeId: string;
  brand: string;
  acType: string;
  tonnage: string;
  scheduledDate?: string | null;
  slotAvailabilityId?: number | null;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  addressLabel?: string;
  name: string;
  phone: string;
  email: string;
  specialInstructions?: string;
  isEmergency: boolean;
}

interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

interface BookingListItemResponse {
  bookingId: number;
  bookingReference: string;
  status: string;
  serviceName: string;
  slotDate: string;
  slotLabel: string;
  bookingDateUtc: string;
  operationalStatus?: string | null;
  assignedTechnicianName?: string | null;
  assignedTechnicianId?: number | null;
  estimatedPrice: number;
  invoiceGrandTotalAmount?: number | null;
}

interface BookingDetailResponse {
  bookingId: number;
  bookingReference: string;
  status: string;
  serviceName: string;
  addressSummary: string;
  slotDate: string;
  slotLabel: string;
  estimatedPrice: number;
  operationalStatus?: string | null;
  assignedTechnicianId?: number | null;
  assignedTechnicianName?: string | null;
  jobCardId?: number | null;
  jobCardNumber?: string | null;
  quotationId?: number | null;
  quotationNumber?: string | null;
  quotationStatus?: string | null;
  invoiceId?: number | null;
  invoiceNumber?: string | null;
  invoiceStatus?: string | null;
  completionSummary?: string | null;
  serviceRequestNumber?: string | null;
  statusHistory: {
    status: string;
    remarks?: string | null;
    changedAtUtc: string;
  }[];
  fieldTimeline: {
    title?: string | null;
    description?: string | null;
    createdAtUtc?: string | null;
    status?: string | null;
  }[];
}

interface QuotationDetailResponse {
  quotationId: number;
  quotationNumber: string;
  bookingId: number;
  bookingReference: string;
  currentStatus: string;
  subTotalAmount: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  grandTotalAmount: number;
  customerDecisionRemarks?: string | null;
  lines: {
    quotationLineId: number;
    lineType: string;
    lineDescription: string;
    quantity: number;
    unitPrice: number;
    lineAmount: number;
  }[];
}

export interface ServiceReportDetail {
  jobId: string;
  completionDate: string;
  workDone: string[];
  recommendations: string;
}

export interface EstimateApprovalDetail {
  bookingId: string;
  srNumber: string;
  estimateId: string;
  estimateNumber: string;
  status: string;
  subTotal: number;
  tax: number;
  total: number;
  remarks?: string;
  items: {
    id: string;
    name: string;
    type: string;
    qty: number;
    price: number;
  }[];
}

export interface BookingDraftSummary {
  id: string;
  serviceId: string | null;
  updatedAt: string;
}

interface CustomerAmcResponse {
  planName: string;
  currentStatus: string;
  endDateUtc: string;
  totalVisitCount: number;
  consumedVisitCount: number;
  visits: {
    scheduledDateUtc?: string | null;
  }[];
}

interface PublicHomeCmsResponse {
  banners: {
    imageUrl: string;
    redirectUrl: string;
    bannerTitle: string;
  }[];
}

interface TechnicianResponse {
  technicianId: number;
  name: string;
  photoUrl: string;
  rating: number;
}

interface BookingSummaryResponse {
  bookingId: number;
  bookingReference: string;
  slotDate: string;
  estimatedPrice: number;
}

interface BrandResponse {
  brandId: number;
  brandName: string;
}

interface AcTypeResponse {
  acTypeId: number;
  acTypeName: string;
}

interface TonnageResponse {
  tonnageId: number;
  tonnageName: string;
}

interface ZoneLookupResponse {
  zoneId: number;
  zoneName: string;
  cityName: string;
  pincode: string;
}

interface SlotAvailabilityResponse {
  slotAvailabilityId: number;
  zoneId: number;
  slotDate: string;
  slotLabel: string;
  startTime: string;
  endTime: string;
  availableCapacity: number;
  reservedCapacity: number;
  isAvailable: boolean;
}

interface CustomerEquipmentResponse {
  customerEquipmentId: number;
  name: string;
  type: string;
  brand: string;
  capacity: string;
  location: string;
  serialNumber?: string | null;
}

function formatBookingDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isTerminalStatus(status?: string | null) {
  const normalized = (status || '').toLowerCase();
  return ['completed', 'closed', 'cancelled'].includes(normalized);
}

function normalizeLookupValue(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

async function getTechnician(technicianId?: number | null) {
  if (!technicianId) {
    return null;
  }

  try {
    return await apiClient.get<TechnicianResponse>(`/customer-technicians/${technicianId}`);
  } catch {
    return null;
  }
}

async function getBookingsPage(pageNumber = 1, pageSize = 20) {
  return apiClient.get<PagedResponse<BookingListItemResponse>>(`/bookings/my-bookings?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

async function buildDashboard(): Promise<DashboardData> {
  const [bookings, amcSubscriptions, cmsHome] = await Promise.all([
    getBookingsPage(1, 20),
    apiClient.get<CustomerAmcResponse[]>('/amc/customer/me').catch(() => []),
    apiClient.get<PublicHomeCmsResponse>('/cms/public/home', undefined, true).catch(() => ({ banners: [] })),
  ]);

  const activeBooking = bookings.items.find((booking) => !isTerminalStatus(booking.operationalStatus || booking.status)) || null;
  const activeTechnician = await getTechnician(activeBooking?.assignedTechnicianId);
  const activeAmc = amcSubscriptions.find((subscription) => subscription.currentStatus.toLowerCase() === 'active') || amcSubscriptions[0] || null;
  const promoBanner = cmsHome.banners?.[0] || null;

  return {
    activeJob: activeBooking ? {
      id: String(activeBooking.bookingId),
      srNumber: activeBooking.bookingReference,
      serviceType: activeBooking.serviceName,
      technicianName: activeBooking.assignedTechnicianName,
      technicianId: activeBooking.assignedTechnicianId,
      technicianPhotoUrl: activeTechnician?.photoUrl || null,
      technicianRating: activeTechnician?.rating || null,
      currentStatus: activeBooking.operationalStatus || activeBooking.status,
      status: activeBooking.operationalStatus || activeBooking.status,
      eta: null,
      lastUpdatedAt: activeBooking.bookingDateUtc,
    } : null,
    amcSummary: activeAmc ? {
      contractName: activeAmc.planName,
      planType: activeAmc.currentStatus,
      nextVisitDate: activeAmc.visits?.[0]?.scheduledDateUtc || null,
      visitsRemaining: Math.max(activeAmc.totalVisitCount - activeAmc.consumedVisitCount, 0),
    } : null,
    recentBookings: bookings.items.slice(0, 3).map((booking) => ({
      id: String(booking.bookingId),
      srNumber: booking.bookingReference,
      date: formatBookingDate(booking.slotDate),
      serviceType: booking.serviceName,
      status: booking.operationalStatus || booking.status,
    })),
    promoBanner: promoBanner ? {
      imageUrl: promoBanner.imageUrl,
      ctaText: promoBanner.bannerTitle,
      ctaUrl: promoBanner.redirectUrl,
    } : null,
  };
}

export const BookingService = {
  async getDashboard(): Promise<DashboardData> {
    if (API_CONFIG.IS_MOCK) {
      return {
        activeJob: null,
        amcSummary: null,
        recentBookings: [],
        promoBanner: null,
      };
    }

    return buildDashboard();
  },

  getLiveJobs(_: string, callback: (jobs: DashboardActiveJob[]) => void) {
    if (API_CONFIG.IS_MOCK) {
      callback(JOBS as unknown as DashboardActiveJob[]);
      return () => {};
    }

    let cancelled = false;
    let intervalId: number | undefined;

    const run = async () => {
      const dashboard = await buildDashboard();

      if (!cancelled) {
        callback(dashboard.activeJob ? [dashboard.activeJob] : []);
      }
    };

    void run();
    intervalId = window.setInterval(run, 60000);

    return () => {
      cancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  },

  async getBookings(): Promise<BookingListItemResponse[]> {
    if (API_CONFIG.IS_MOCK) {
      return JOBS as unknown as BookingListItemResponse[];
    }

    const response = await getBookingsPage(1, 20);
    return response.items;
  },

  async getBookingById(id: string): Promise<BookingDetailResponse | null> {
    if (API_CONFIG.IS_MOCK) {
      return null;
    }

    return apiClient.get<BookingDetailResponse>(`/customer-bookings/${id}`);
  },

  async getServiceReport(id: string): Promise<ServiceReportDetail | null> {
    if (API_CONFIG.IS_MOCK) {
      return {
        jobId: id,
        completionDate: new Date().toISOString(),
        workDone: ['Inspection completed', 'Cooling restored'],
        recommendations: 'Schedule preventive servicing in 90 days.',
      };
    }

    const response = await apiClient.get<BookingDetailResponse>(`/customer-bookings/${id}/service-report`);
    const workDone = (response.fieldTimeline ?? [])
      .map((item) => item.title || item.description || '')
      .filter(Boolean);
    const completionEntry = [...(response.statusHistory ?? [])]
      .reverse()
      .find((item) => (item.status || '').toLowerCase().includes('complete'));

    return {
      jobId: response.serviceRequestNumber || response.bookingReference,
      completionDate: completionEntry?.changedAtUtc || response.slotDate,
      workDone: workDone.length > 0 ? workDone : [response.serviceName],
      recommendations: response.completionSummary || 'Your service report is available in the booking timeline.',
    };
  },

  async downloadServiceReportPdf(id: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      return;
    }

    const { accessToken } = readStoredTokens();
    const response = await fetch(`${API_CONFIG.BASE_URL}/customer-bookings/${id}/service-report/pdf`, {
      method: 'GET',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Unable to download service report PDF.');
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = `service-report-${id}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(objectUrl);
  },

  async getEstimateApproval(id: string): Promise<EstimateApprovalDetail | null> {
    const booking = await this.getBookingById(id);

    if (!booking?.quotationId) {
      return null;
    }

    const quotation = await apiClient.get<QuotationDetailResponse>(`/quotations/${booking.quotationId}`);

    return {
      bookingId: String(booking.bookingId),
      srNumber: booking.serviceRequestNumber || booking.bookingReference,
      estimateId: String(quotation.quotationId),
      estimateNumber: quotation.quotationNumber,
      status: quotation.currentStatus,
      subTotal: Number(quotation.subTotalAmount),
      tax: Number(quotation.taxAmount),
      total: Number(quotation.grandTotalAmount),
      remarks: quotation.customerDecisionRemarks ?? undefined,
      items: (quotation.lines ?? []).map((line) => ({
        id: String(line.quotationLineId),
        name: line.lineDescription,
        type: line.lineType,
        qty: Number(line.quantity),
        price: Number(line.unitPrice),
      })),
    };
  },

  async approveEstimate(bookingId: string, estimateId: string, remarks?: string): Promise<void> {
    await apiClient.post(`/quotations/${estimateId}/approve`, { remarks: remarks || `Approved from booking ${bookingId}` });
  },

  async rejectEstimate(bookingId: string, estimateId: string, remarks?: string): Promise<void> {
    await apiClient.post(`/quotations/${estimateId}/reject`, { remarks: remarks || `Rejected from booking ${bookingId}` });
  },

  async rescheduleBooking(bookingId: string, data: { requestedDate: string; timeWindow: string; reason?: string }): Promise<void> {
    const persistedRaw = localStorage.getItem('coolzo-booking-draft');
    const persisted = persistedRaw
      ? JSON.parse(persistedRaw) as { state?: { location?: { zoneId?: number | null } } }
      : null;
    const zoneId = persisted?.state?.location?.zoneId ?? null;

    if (!zoneId) {
      throw new Error('Booking zone is unavailable for reschedule.');
    }

    const slots = await this.getSlots(zoneId, data.requestedDate);
    const matchedSlot =
      slots.find((slot) => slot.slotLabel.toLowerCase() === data.timeWindow.toLowerCase() && slot.isAvailable) ||
      slots.find((slot) => slot.isAvailable);

    if (!matchedSlot) {
      throw new Error('No slot available for the selected date.');
    }

    await apiClient.post(`/bookings/${bookingId}/reschedule`, {
      requestedDate: data.requestedDate,
      timeWindow: data.timeWindow,
      reason: data.reason || null,
      slotAvailabilityId: matchedSlot.slotAvailabilityId,
      remarks: data.reason || null,
    });
  },

  getJobStream(jobId: string, callback: (job: any) => void) {
    const load = async () => {
      const booking = await this.getBookingById(jobId);

      if (!booking) {
        callback(null);
        return;
      }

      const technician = await getTechnician(booking.assignedTechnicianId);
      callback({
        id: String(booking.bookingId),
        srNumber: booking.serviceRequestNumber || booking.bookingReference,
        serviceType: booking.serviceName,
        status: booking.operationalStatus || booking.status,
        address: booking.addressSummary,
        price: booking.estimatedPrice,
        technicianId: booking.assignedTechnicianId,
        technician,
        estimateStatus: booking.quotationStatus,
      });
    };

    void load();
    const intervalId = window.setInterval(load, 60000);

    return () => window.clearInterval(intervalId);
  },

  async createBooking(data: BookingWizardPayload): Promise<BookingSummaryResponse> {
    const brands = await apiClient.get<BrandResponse[]>('/booking-lookups/brands');
    const acTypes = await apiClient.get<AcTypeResponse[]>('/booking-lookups/ac-types');
    const tonnages = await apiClient.get<TonnageResponse[]>('/booking-lookups/tonnage');
    const brandKey = normalizeLookupValue(data.brand);
    const acTypeKey = normalizeLookupValue(data.acType);
    const tonnageKey = normalizeLookupValue(data.tonnage);
    const brand = brands.find((item) => normalizeLookupValue(item.brandName) === brandKey);
    const acType = acTypes.find((item) => normalizeLookupValue(item.acTypeName) === acTypeKey);
    const tonnage = tonnages.find((item) => normalizeLookupValue(item.tonnageName) === tonnageKey);

    if (!brand || !acType || !tonnage || !data.slotAvailabilityId) {
      throw new Error('Booking payload is incomplete.');
    }

    const basePayload = {
      serviceId: Number(data.serviceTypeId),
      acTypeId: acType.acTypeId,
      tonnageId: tonnage.tonnageId,
      brandId: brand.brandId,
      slotAvailabilityId: data.slotAvailabilityId,
      customerName: data.name,
      mobileNumber: data.phone,
      emailAddress: data.email,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || '',
      landmark: '',
      cityName: data.city,
      pincode: data.postalCode,
      addressLabel: data.addressLabel || 'Home',
      modelName: '',
      issueNotes: data.specialInstructions || '',
      sourceChannel: 'mobile',
    };
    const payload = {
      ...basePayload,
      isEmergency: data.isEmergency,
      emergencySurchargeAmount: data.isEmergency ? 499 : 0,
    };

    if (!data.customerId) {
      return apiClient.post<BookingSummaryResponse>('/bookings/guest', basePayload, undefined, true);
    }

    return apiClient.post<BookingSummaryResponse>('/bookings/customer', payload);
  },

  async createEmergencyBooking(customerId: string): Promise<BookingSummaryResponse> {
    const [profile, addresses, equipment, services] = await Promise.all([
      apiClient.get<{ customerName: string; mobileNumber: string; emailAddress: string }>('/customers/me/profile'),
      AddressService.getAddresses(customerId),
      EquipmentService.getEquipment(customerId),
      CatalogService.getServices(),
    ]);

    const primaryAddress = addresses.find((item) => item.isDefault) || addresses[0];
    const primaryEquipment = equipment[0];
    const emergencyService =
      services.find((item) => /repair|breakdown|emergency/i.test(`${item.name} ${item.description}`)) ||
      services[0];

    if (!primaryAddress?.zoneId || !primaryEquipment || !emergencyService) {
      throw new Error('Emergency booking prerequisites are incomplete.');
    }

    const slotDate = new Date().toISOString().slice(0, 10);
    const slots = await this.getSlots(primaryAddress.zoneId, slotDate);
    const slot = slots.find((item) => item.isAvailable) || slots[0];

    if (!slot) {
      throw new Error('No emergency slot is currently available.');
    }

    return this.createBooking({
      customerId,
      serviceTypeId: emergencyService.id,
      brand: primaryEquipment.brand,
      acType: primaryEquipment.type,
      tonnage: primaryEquipment.capacity,
      scheduledDate: slot.slotDate,
      slotAvailabilityId: slot.slotAvailabilityId,
      addressLine1: primaryAddress.addressLine1,
      addressLine2: primaryAddress.addressLine2,
      city: primaryAddress.city,
      postalCode: primaryAddress.pinCode,
      addressLabel: primaryAddress.label,
      name: profile.customerName,
      phone: profile.mobileNumber,
      email: profile.emailAddress,
      specialInstructions: 'Emergency booking requested from customer app.',
      isEmergency: true,
    });
  },

  async getBrands() {
    return apiClient.get<BrandResponse[]>('/booking-lookups/brands');
  },

  async getCustomerEquipment(): Promise<CustomerEquipmentResponse[]> {
    return apiClient.get<CustomerEquipmentResponse[]>('/customers/me/equipment');
  },

  async lookupZone(pin: string): Promise<ZoneLookupResponse> {
    return apiClient.get<ZoneLookupResponse>(`/booking-lookups/zones/by-pincode/${pin}`, undefined, true);
  },

  async getSlots(zoneId: number, slotDate: string): Promise<SlotAvailabilityResponse[]> {
    return apiClient.get<SlotAvailabilityResponse[]>(`/booking-lookups/slots?zoneId=${zoneId}&slotDate=${slotDate}`);
  },

  async validateCoupon(code: string) {
    return apiClient.post('/offers/validate-coupon', { code });
  },

  async getDrafts(_userId: string): Promise<BookingDraftSummary[]> {
    const persistedRaw = localStorage.getItem('coolzo-booking-draft');

    if (!persistedRaw) {
      return [];
    }

    try {
      const persisted = JSON.parse(persistedRaw) as {
        state?: {
          serviceId?: string | null;
          isDraft?: boolean;
          updatedAt?: string;
        };
      };
      const state = persisted.state;

      if (!state?.isDraft || !state.serviceId) {
        return [];
      }

      return [{
        id: 'local-draft',
        serviceId: state.serviceId,
        updatedAt: state.updatedAt || new Date().toISOString(),
      }];
    } catch {
      return [];
    }
  },
};
