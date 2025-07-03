// Centralized API configuration
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  USER: `${API_BASE_URL}/user`,
  COURSE: `${API_BASE_URL}/course`,
  NOTIFICATION: `${API_BASE_URL}/notification`,
  PURCHASE: `${API_BASE_URL}/purchase`,
  PROGRESS: `${API_BASE_URL}/progress`,
  INSTRUCTOR: `${API_BASE_URL}`,
  ADMIN: `${API_BASE_URL}`,
  MEDIA: `${API_BASE_URL}/media`
};

console.log('API Base URL:', API_BASE_URL);
export default API_ENDPOINTS; 