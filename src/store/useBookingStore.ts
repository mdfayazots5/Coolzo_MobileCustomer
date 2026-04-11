import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ACBrand = string;
export type ACType = string;
export type ACCapacity = string;

export interface BookingState {
  step: number;
  serviceId: string | null;
  serviceName: string;
  servicePrice: number;
  subServiceId: string | null;
  equipment: {
    brand: ACBrand | '';
    brandId: string | number | null;
    type: ACType | '';
    acTypeId: string | number | null;
    capacity: ACCapacity | '';
    tonnageId: string | number | null;
    units: number;
  };
  location: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    pinCode: string;
    label: 'Home' | 'Office' | 'Other';
    saveToAccount: boolean;
    zoneId: string | number | null;
  };
  slot: {
    date: string | null; // ISO date string
    timeWindow: string | null;
    slotAvailabilityId: string | number | null;
    slotLabel: string;
    isEmergency: boolean;
  };
  contact: {
    fullName: string;
    mobile: string;
    email: string;
    instructions: string;
    couponCode: string;
  };
  pricing: {
    basePrice: number;
    discount: number;
    emergencySurcharge: number;
    estimatedTotal: number;
  };
  isDraft: boolean;
}

interface BookingStore extends BookingState {
  setStep: (step: number) => void;
  updateBooking: (data: Partial<BookingState>) => void;
  updateEquipment: (data: Partial<BookingState['equipment']>) => void;
  updateLocation: (data: Partial<BookingState['location']>) => void;
  updateSlot: (data: Partial<BookingState['slot']>) => void;
  updateContact: (data: Partial<BookingState['contact']>) => void;
  resetBooking: () => void;
}

const initialState: BookingState = {
  step: 1,
  serviceId: null,
  serviceName: '',
  servicePrice: 0,
  subServiceId: null,
  equipment: {
    brand: '',
    brandId: null,
    type: '',
    acTypeId: null,
    capacity: '',
    tonnageId: null,
    units: 1,
  },
  location: {
    addressLine1: '',
    addressLine2: '',
    city: 'Mumbai',
    pinCode: '',
    label: 'Home',
    saveToAccount: false,
    zoneId: null,
  },
  slot: {
    date: null,
    timeWindow: null,
    slotAvailabilityId: null,
    slotLabel: '',
    isEmergency: false,
  },
  contact: {
    fullName: '',
    mobile: '',
    email: '',
    instructions: '',
    couponCode: '',
  },
  pricing: {
    basePrice: 0,
    discount: 0,
    emergencySurcharge: 0,
    estimatedTotal: 0,
  },
  isDraft: false,
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      updateBooking: (data) => set((state) => ({ ...state, ...data, isDraft: true })),
      updateEquipment: (equipment) => set((state) => ({ 
        equipment: { ...state.equipment, ...equipment },
        isDraft: true 
      })),
      updateLocation: (location) => set((state) => ({ 
        location: { ...state.location, ...location },
        isDraft: true 
      })),
      updateSlot: (slot) => set((state) => ({ 
        slot: { ...state.slot, ...slot },
        isDraft: true 
      })),
      updateContact: (contact) => set((state) => ({ 
        contact: { ...state.contact, ...contact },
        isDraft: true 
      })),
      resetBooking: () => set(initialState),
    }),
    {
      name: 'coolzo-booking-draft',
    }
  )
);
