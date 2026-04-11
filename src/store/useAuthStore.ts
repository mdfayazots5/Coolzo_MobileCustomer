import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipStatus: 'none' | 'residential' | 'corporate';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  hasSeenNotificationPrompt: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  setHasSeenNotificationPrompt: (value: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      hasSeenNotificationPrompt: false,
      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
      setHasSeenNotificationPrompt: (value) => set({ hasSeenNotificationPrompt: value }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'coolzo-auth-storage',
    }
  )
);
