import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { API_CONFIG } from '../config/apiConfig';

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

  async loginWithPhone(phone: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Sending OTP to', phone);
      await new Promise(resolve => setTimeout(resolve, 800));
      return;
    }
    // Real implementation would use Firebase Phone Auth or a custom SMS gateway
    console.log('Real: Sending OTP to', phone);
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
    // Real implementation would verify OTP with backend/Firebase
    throw new Error('Real OTP verification not implemented');
  },

  async register(data: any): Promise<UserProfile> {
    if (API_CONFIG.IS_MOCK) {
      return {
        id: 'demo-user-id',
        uid: 'demo-user-id',
        name: data.name || 'Demo User',
        email: data.email || 'demo@coolzo.app',
        phone: data.phone || '+91 9876543210',
        membershipStatus: 'none',
        role: 'user',
        createdAt: new Date(),
      };
    }
    // This would typically be a REST call, but using Firebase for now
    console.log('Registering user with data:', data);
    // Mocking a successful registration for now as we use Google Auth mostly
    return {} as UserProfile;
  },

  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Updating profile', uid, data);
      return;
    }
    try {
      await updateDoc(doc(db, 'users', uid), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      return;
    }
    await firebaseSignOut(auth);
  },

  async deleteAccount(uid: string): Promise<void> {
    if (API_CONFIG.IS_MOCK) {
      console.log('Mock: Deleting account', uid);
      return;
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
    // Mock implementation
    console.log('Changing password...');
    await new Promise(resolve => setTimeout(resolve, 1500));
  },

  async resetPassword(email: string): Promise<void> {
    // Mock implementation
    console.log(`Sending reset link to ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  onAuthChange(callback: (user: UserProfile | null) => void) {
    if (API_CONFIG.IS_MOCK) {
      // In mock mode, we call the callback immediately with null to signal auth is ready
      // The user can then proceed to login or browse as guest
      setTimeout(() => callback(null), 0);
      return () => {};
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
