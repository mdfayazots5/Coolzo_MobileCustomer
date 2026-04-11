export const API_CONFIG = {
  BASE_URL: ((import.meta as any).env?.VITE_API_BASE_URL || 'https://api.coolzo.app/api/v1').replace(/\/$/, ''),
  IS_MOCK: ((import.meta as any).env?.VITE_USE_MOCK_API ?? 'true') !== 'false',
};
