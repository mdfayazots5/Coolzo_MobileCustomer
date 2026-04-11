import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { API_CONFIG } from '../config/apiConfig';
import { apiClient, tokenStorage } from './apiClient';

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
  userId?: number;
  customerId?: number;
  roles?: string[];
  permissions?: string[];
  mustChangePassword?: boolean;
  isTemporaryPassword?: boolean;
}

export interface CurrentUserResponse {
  userId: number;
  userName: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  customerId?: number | null;
  mustChangePassword: boolean;
  isTemporaryPassword: boolean;
  passwordExpiryOnUtc?: string | null;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAtUtc: string;
  currentUser: CurrentUserResponse;
}

export interface RegisterCustomerRequest {
  customerName: string;
  mobileNumber: string;
  emailAddress: string;
  password?: string;
}

export interface CustomerAccountResponse extends RegisterCustomerRequest {
  customerId: number;
  userId: number;
  passwordGenerated: boolean;
  requiresPasswordDelivery: boolean;
  mustChangePassword: boolean;
  isTemporaryPassword: boolean;
  passwordExpiryOnUtc?: string | null;
}

const mapCurrentUser = (user: CurrentUserResponse): UserProfile => ({
  id: String(user.customerId ?? user.userId),
  uid: String(user.customerId ?? user.userId),
  userId: user.userId,
  customerId: user.customerId ?? undefined,
  name: user.fullName || user.userName,
  email: user.email,
  phone: '',
  membershipStatus: 'none',
  role: user.roles?.includes('Admin') ? 'admin' : 'user',
  roles: user.roles || [],
  permissions: user.permissions || [],
  mustChangePassword: user.mustChangePassword,
  isTemporaryPassword: user.isTemporaryPassword,
  createdAt: null,
});

export const AuthService = {
  async login(userNameOrEmail: string, password: string): Promise<UserProfile> {
    const tokenResponse = await apiClient.post<AuthTokenResponse>('/auth/login', {
      userNameOrEmail,
      password,
    });
    tokenStorage.setTokens(tokenResponse.accessToken, tokenResponse.refreshToken, tokenResponse.expiresAtUtc);
    return mapCurrentUser(tokenResponse.currentUser);
  },

  async getCurrentUser(): Promise<UserProfile> {
    const user = await apiClient.get<CurrentUserResponse>('/auth/me');
    return mapCurrentUser(user);
  },

  async loginWithGoogle(): Promise<UserProfile> {
    if (!API_CONFIG.IS_MOCK) {
      throw new Error('Google login is not defined in the current API contract.');
    }

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
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

  async register(data: RegisterCustomerRequest): Promise<CustomerAccountResponse> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Registering user with data:', data);
      return {
        ...data,
        customerId: Date.now(),
        userId: Date.now(),
        passwordGenerated: !data.password,
        requiresPasswordDelivery: false,
        mustChangePassword: false,
        isTemporaryPassword: false,
      };
    }

    return apiClient.post<CustomerAccountResponse>('/customer-auth/register', data);
  },

  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    if (!API_CONFIG.IS_MOCK) {
      throw new Error('Customer profile update API is not defined in the current API contract.');
    }

    try {
      await updateDoc(doc(db, 'users', uid), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    tokenStorage.clear();
    if (API_CONFIG.IS_MOCK) {
      await firebaseSignOut(auth);
    }
  },

  async deleteAccount(uid: string): Promise<void> {
    if (!API_CONFIG.IS_MOCK) {
      throw new Error('Customer account deletion API is not defined in the current API contract.');
    }

    try {
      // In a real app, this would trigger a cloud function to delete all user data
      // and then delete the auth user.
      console.log(`Deleting account for user ${uid}`);
      await updateDoc(doc(db, 'users', uid), {
        status: 'deleted',
        deletedAt: serverTimestamp()
      });
      await auth.currentUser?.delete();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
      throw error;
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Changing password...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return;
    }

    await apiClient.post('/customer-auth/change-password', {
      currentPassword: oldPassword,
      newPassword,
    });
  },

  async requestPasswordReset(loginId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log(`Sending reset link to ${loginId}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    await apiClient.post('/customer-auth/forgot-password', { loginId });
  },

  async resetPassword(loginId: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log(`Resetting password for ${loginId}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    await apiClient.post('/customer-auth/reset-password', { loginId });
  },

  onAuthChange(callback: (user: UserProfile | null) => void) {
    if (!API_CONFIG.IS_MOCK) {
      let isActive = true;

      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        callback(null);
        return () => {
          isActive = false;
        };
      }

      this.getCurrentUser()
        .then((user) => {
          if (isActive) callback(user);
        })
        .catch(() => {
          tokenStorage.clear();
          if (isActive) callback(null);
        });

      return () => {
        isActive = false;
      };
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as UserProfile);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
};
