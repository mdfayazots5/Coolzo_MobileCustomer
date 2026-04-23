export const AUTH_STORAGE_KEYS = {
  accessToken: '@ce_access_token',
  refreshToken: '@ce_refresh_token',
  userProfile: '@ce_user_profile',
  customerId: '@ce_customer_id',
} as const;

export interface StoredUserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL?: string;
  membershipStatus: 'none' | 'residential' | 'corporate';
  role: 'user' | 'admin';
  createdAt: string;
}

export function persistAuthSession(profile: StoredUserProfile, accessToken: string, refreshToken: string, customerId?: string | null) {
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.userProfile, JSON.stringify(profile));

  if (customerId) {
    localStorage.setItem(AUTH_STORAGE_KEYS.customerId, customerId);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEYS.customerId);
  }
}

export function readStoredProfile(): StoredUserProfile | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEYS.userProfile);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredUserProfile;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function readStoredTokens() {
  return {
    accessToken: localStorage.getItem(AUTH_STORAGE_KEYS.accessToken),
    refreshToken: localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken),
    customerId: localStorage.getItem(AUTH_STORAGE_KEYS.customerId),
  };
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.userProfile);
  localStorage.removeItem(AUTH_STORAGE_KEYS.customerId);
}
