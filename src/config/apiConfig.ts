export const IS_MOCK = false; // Single source of truth for demo/mock mode

export const FEATURE_FLAGS = {
  SHOW_WHATS_NEW: false,
  SHOW_APP_PERMISSIONS: false,
  SHOW_REFER_FRIEND: false,
  SHOW_LOYALTY_REWARDS: false,
  SHOW_SPECIAL_OFFERS: false,
};

export const API_CONFIG = {
  BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL || 'https://localhost:7001/api/v1',
  IS_MOCK: IS_MOCK,
};
