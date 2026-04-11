import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ACBrand = 'Samsung' | 'LG' | 'Daikin' | 'Voltas' | 'Blue Star' | 'Mitsubishi' | 'Lloyd' | 'Other';
export type ACType = 'Split' | 'Window' | 'Cassette' | 'Centralized';
export type ACCapacity = '1T' | '1.5T' | '2T' | '3T+';

export interface BookingState {
  step: number;
  serviceId: string | null;
  subServiceId: string | null;
  equipment: {
    brand: ACBrand | '';
    type: ACType | '';
    capacity: ACCapacity | '';
    units: number;
  };
  location: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    pinCode: string;
    label: 'Home' | 'Office' | 'Other';
    saveToAccount: boolean;
  };
  slot: {
    date: string | null; // ISO date string
    timeWindow: 'Morning' | 'Afternoon' | 'Evening' | null;
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
  subServiceId: null,
  equipment: {
    brand: '',
    type: '',
    capacity: '',
    units: 1,
  },
  location: {
    addressLine1: '',
    addressLine2: '',
    city: 'Mumbai',
    pinCode: '',
    label: 'Home',
    saveToAccount: false,
  },
  slot: {
    date: null,
    timeWindow: null,
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
