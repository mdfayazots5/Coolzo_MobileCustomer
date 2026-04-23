import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { API_CONFIG } from '../config/apiConfig';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { apiClient } from './apiClient';
import { AUTH_STORAGE_KEYS, clearAuthSession, persistAuthSession, readStoredProfile, readStoredTokens, StoredUserProfile } from './authStorage';

export interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL?: string;
  membershipStatus: 'none' | 'residential' | 'corporate';
  role: 'user' | 'admin';
  createdAt: any;
}

interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
  currentUser: {
    userId: number;
    email: string;
    fullName: string;
    customerId?: number | null;
  };
}

interface CustomerProfileResponse {
  customerId: number;
  customerName: string;
  mobileNumber: string;
  emailAddress: string;
  photoUrl: string;
  membershipStatus: string;
  dateCreated: string;
}

interface RegisterRequest {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface AuthActionResponse {
  success: boolean;
  message: string;
}

function toMembershipStatus(value?: string | null): UserProfile['membershipStatus'] {
  if (!value) {
    return 'none';
  }

  const normalized = value.toLowerCase();

  if (normalized.includes('corporate')) {
    return 'corporate';
  }

  if (normalized.includes('residential') || normalized.includes('active') || normalized.includes('amc')) {
    return 'residential';
  }

  return 'none';
}

function toStoredProfile(currentUser: AuthTokenResponse['currentUser'], profile?: CustomerProfileResponse | null, fallbackPhone?: string): StoredUserProfile {
  return {
    id: String(profile?.customerId ?? currentUser.customerId ?? currentUser.userId),
    uid: String(currentUser.userId),
    name: profile?.customerName || currentUser.fullName || 'Customer',
    email: profile?.emailAddress || currentUser.email || '',
    phone: profile?.mobileNumber || fallbackPhone || '',
    photoURL: profile?.photoUrl || '',
    membershipStatus: toMembershipStatus(profile?.membershipStatus),
    role: 'user',
    createdAt: profile?.dateCreated || new Date().toISOString(),
  };
}

function toUserProfile(profile: StoredUserProfile): UserProfile {
  return {
    ...profile,
    createdAt: profile.createdAt,
  };
}

export const AuthService = {
  async loginWithGoogle(): Promise<UserProfile> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: 'demo-user-id',
        uid: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@coolzo.app',
        phone: '+91 9876543210',
        photoURL: 'https://picsum.photos/seed/user/200',
        membershipStatus: 'residential',
        role: 'user',
        createdAt: new Date(),
      };
    }

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        const newUser: UserProfile = {
          id: user.uid,
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email || '',
          phone: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          membershipStatus: 'none',
          role: 'user',
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, 'users', user.uid), newUser);
        return newUser;
      }

      return userDoc.data() as UserProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
      throw error;
    }
  },

  async loginWithPhone(phone: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return;
    }

    await apiClient.post('/auth/otp/send', { phone }, undefined, true);
  },

  async verifyOTP(phone: string, otp: string): Promise<UserProfile> {
    if (API_CONFIG.IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: 'demo-user-id',
        uid: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@coolzo.app',
        phone: phone,
        photoURL: 'https://picsum.photos/seed/user/200',
        membershipStatus: 'residential',
        role: 'user',
        createdAt: new Date(),
      };
    }

    const authResponse = await apiClient.post<AuthTokenResponse>('/auth/otp/verify', { phone, otp }, undefined, true);
    const customerProfile = authResponse.currentUser.customerId
      ? await apiClient.get<CustomerProfileResponse>('/customers/me/profile')
      : null;
    const profile = toStoredProfile(authResponse.currentUser, customerProfile, phone);

    persistAuthSession(profile, authResponse.accessToken, authResponse.refreshToken, authResponse.currentUser.customerId?.toString());

    return toUserProfile(profile);
  },

  async register(data: RegisterRequest): Promise<{ customerId: string; profile: UserProfile }> {
    if (API_CONFIG.IS_MOCK) {
      return {
        customerId: 'demo-customer-id',
        profile: {
          id: 'demo-user-id',
          uid: 'demo-user-id',
          name: data.name || 'Demo User',
          email: data.email || 'demo@coolzo.app',
          phone: data.phone || '+91 9876543210',
          membershipStatus: 'none',
          role: 'user',
          createdAt: new Date(),
        },
      };
    }

    const response = await apiClient.post<{
      customerId: number;
      userId: number;
      customerName: string;
      mobileNumber: string;
      emailAddress: string;
    }>('/customer-auth/register', {
      customerName: data.name,
      mobileNumber: data.phone,
      emailAddress: data.email,
      password: data.password,
    }, undefined, true);

    return {
      customerId: String(response.customerId),
      profile: {
        id: String(response.customerId),
        uid: String(response.userId),
        name: response.customerName,
        email: response.emailAddress,
        phone: response.mobileNumber,
        membershipStatus: 'none',
        role: 'user',
        createdAt: new Date().toISOString(),
      },
    };
  },

  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<CustomerProfileResponse>('/customers/me/profile');
    const storedProfile = readStoredProfile();
    const profile = toStoredProfile({
      userId: Number(storedProfile?.uid ?? response.customerId),
      email: response.emailAddress,
      fullName: response.customerName,
      customerId: response.customerId,
    }, response, response.mobileNumber);

    localStorage.setItem(AUTH_STORAGE_KEYS.userProfile, JSON.stringify(profile));

    return toUserProfile(profile);
  },

  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<UserProfile> {
    if (API_CONFIG.IS_MOCK) {
      return {
        id: uid,
        uid,
        name: data.name || 'Demo User',
        email: data.email || 'demo@coolzo.app',
        phone: data.phone || '+91 9876543210',
        membershipStatus: data.membershipStatus || 'none',
        role: data.role || 'user',
        createdAt: new Date().toISOString(),
      };
    }

    const currentProfile = await this.getProfile();
    const response = await apiClient.put<CustomerProfileResponse>('/customers/me/profile', {
      customerName: data.name || currentProfile.name,
      mobileNumber: data.phone || currentProfile.phone,
      emailAddress: data.email || currentProfile.email,
      photoUrl: data.photoURL || currentProfile.photoURL || '',
      membershipStatus: currentProfile.membershipStatus,
    });
    const profile = toStoredProfile({
      userId: Number(currentProfile.uid),
      email: response.emailAddress,
      fullName: response.customerName,
      customerId: response.customerId,
    }, response, response.mobileNumber);

    localStorage.setItem(AUTH_STORAGE_KEYS.userProfile, JSON.stringify(profile));

    return toUserProfile(profile);
  },

  async signOut(): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      clearAuthSession();
      return;
    }

    const { refreshToken } = readStoredTokens();

    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } finally {
      clearAuthSession();
      await firebaseSignOut(auth);
    }
  },

  async deleteAccount(_uid: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      return;
    }

    await apiClient.delete('/auth/account');
    clearAuthSession();
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      return;
    }

    await apiClient.post('/auth/change-password', {
      currentPassword: oldPassword,
      newPassword: newPassword,
    });
  },

  async requestPasswordReset(loginId: string): Promise<AuthActionResponse> {
    if (API_CONFIG.IS_MOCK) {
      return {
        success: true,
        message: 'OTP sent successfully.',
      };
    }

    return apiClient.post<AuthActionResponse>('/auth/forgot-password', {
      phone: loginId,
      loginId,
    }, undefined, true);
  },

  async resetPassword(loginId: string, otp: string, newPassword: string): Promise<AuthActionResponse> {
    if (API_CONFIG.IS_MOCK) {
      return {
        success: true,
        message: 'Password reset successfully.',
      };
    }

    return apiClient.post<AuthActionResponse>('/auth/reset-password', {
      token: otp,
      password: newPassword,
      phone: loginId,
      otp,
      newPassword,
    }, undefined, true);
  },

  onAuthChange(callback: (user: UserProfile | null) => void) {
    if (API_CONFIG.IS_MOCK) {
      setTimeout(() => callback(null), 0);
      return () => {};
    }

    const storedProfile = readStoredProfile();
    callback(storedProfile ? toUserProfile(storedProfile) : null);

    return () => {};
  }
};
