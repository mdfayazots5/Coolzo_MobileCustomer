export const API_CONFIG = {
  BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.coolzo.app/v1',
  IS_MOCK: true, // Toggle this to switch between real API and mock/Firebase
};
