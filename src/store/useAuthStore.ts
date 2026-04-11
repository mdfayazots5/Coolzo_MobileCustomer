import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService, UserProfile } from '../services/authService';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  hasCompletedOnboarding: boolean;
  hasSeenNotificationPrompt: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  setHasSeenNotificationPrompt: (value: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  setAuthReady: (value: boolean) => void;
  logout: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAuthReady: false,
      hasCompletedOnboarding: false,
      hasSeenNotificationPrompt: false,
      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
      setHasSeenNotificationPrompt: (value) => set({ hasSeenNotificationPrompt: value }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthReady: (value) => set({ isAuthReady: value }),
      logout: async () => {
        await AuthService.signOut();
        set({ user: null, isAuthenticated: false });
      },
      initialize: () => {
        return AuthService.onAuthChange((user) => {
          set({ user, isAuthenticated: !!user, isAuthReady: true });
        });
      },
    }),
    {
      name: 'coolzo-auth-storage',
      partialize: (state) => ({ 
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        hasSeenNotificationPrompt: state.hasSeenNotificationPrompt 
      }),
    }
  )
);
