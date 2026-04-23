export const IS_MOCK = false; // Single source of truth for demo/mock mode

export const FEATURE_FLAGS = {
  SHOW_WHATS_NEW: false,
  SHOW_APP_PERMISSIONS: false,
  SHOW_REFER_FRIEND: false,
  SHOW_LOYALTY_REWARDS: false,
  SHOW_SPECIAL_OFFERS: false,
};

function normalizeApiBaseUrl(rawValue?: string) {
  const fallbackOrigin = 'http://localhost:5217';
  const trimmed = (rawValue || fallbackOrigin).trim().replace(/\/+$/, '');

  return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
}

export const API_CONFIG = {
  BASE_URL: normalizeApiBaseUrl((import.meta as any).env?.VITE_API_BASE_URL),
  IS_MOCK: IS_MOCK,
};
