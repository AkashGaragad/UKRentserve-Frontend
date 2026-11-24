import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 Unauthorized
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export default api;

// --- Health ---
export const healthApi = {
  check: () => api.get('/health'),
};

// --- Auth ---
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  registerCustomer: (data) => api.post('/auth/register/customer', data),
  registerOwner: (data) => api.post('/auth/register/owner', data),
  registerDriver: (data) => api.post('/auth/register/driver', data),
  registerProvider: (data) => api.post('/providers/register', data),
  sendPhoneOtp: (phone) => api.post('/auth/phone/send-otp', { phone, phoneNumber: phone }),
  verifyPhoneOtp: (phone, otp) => api.post('/auth/phone/verify-otp', { phone, phoneNumber: phone, otp }),
  loginWithPhoneOtp: (phone, otp) => api.post('/auth/phone/login-with-otp', { phone, phoneNumber: phone, otp }),
  logout: () => api.post('/auth/logout'),
  googleLogin: (token) => api.post('/auth/google', { token }),
};

// --- User Profile ---
export const userApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.patch('/users/me', data),
};

// --- Services ---
export const servicesApi = {
  list: (params) => api.get('/services', { params }),
  get: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
};

// --- Categories ---
export const categoriesApi = {
  list: () => api.get('/categories'),
};

// --- Properties / Rentals ---
export const propertiesApi = {
  list: (params) => api.get('/properties', { params }),
  get: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  mine: () => api.get('/properties/mine'),
};

// --- Providers & Applications ---
export const providersApi = {
  list: (params) => api.get('/providers', { params }),
  get: (id) => api.get(`/providers/${id}`),
  me: () => api.get('/providers/me'),
  apply: (data) => api.post('/providers/register', data),
};

// --- Bookings (Services & Property Stays) ---
export const bookingsApi = {
  create: (data) => api.post('/bookings', data),
  mine: () => api.get('/bookings/mine'),
  received: () => api.get('/bookings/received'),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

// --- Transport Bookings (Rides & Cabs) ---
export const transportApi = {
  create: (data) => api.post('/transport-bookings', data),
  mine: () => api.get('/transport-bookings/mine'),
  available: () => api.get('/transport-bookings/available'),
  assigned: () => api.get('/transport-bookings/assigned'),
  updateLocation: (coords) => api.patch('/transport-bookings/location', coords),
  nearbyDrivers: (params) => api.get('/transport-bookings/nearby-drivers', { params }),
  getTracking: (id) => api.get(`/transport-bookings/${id}/tracking`),
  getMessages: (id) => api.get(`/transport-bookings/${id}/messages`),
  sendMessage: (id, text) => api.post(`/transport-bookings/${id}/messages`, { text, message: text }),
  updateStatus: (id, status) => api.patch(`/transport-bookings/${id}/status`, { status }),
};

// --- In-App Chat & Messaging ---
export const chatApi = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (bookingId) => api.get(`/chat/${bookingId}/messages`),
  sendMessage: (bookingId, text) => api.post(`/chat/${bookingId}/messages`, { text, message: text }),
};

// --- Notifications ---
export const notificationsApi = {
  list: () => api.get('/notifications'),
  markAllRead: () => api.patch('/notifications/read-all'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
};

// --- Support Tickets ---
export const supportApi = {
  mine: () => api.get('/support/mine'),
  create: (data) => api.post('/support', data),
  listAll: () => api.get('/support'),
  updateStatus: (id, status) => api.patch(`/support/${id}/status`, { status }),
};

// --- Enquiries ---
export const enquiriesApi = {
  create: (data) => api.post('/enquiries', data),
  my: () => api.get('/enquiries/my'),
  received: () => api.get('/enquiries/received'),
};

// --- Reviews ---
export const reviewsApi = {
  list: (params) => api.get('/reviews', { params }),
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// --- Document View / Resubmit ---
export const documentApi = {
  getMyApplication: () => api.get('/documents/my-application'),
};

// --- Admin ---
export const adminApi = {
  stats: () => api.get('/admin/stats'),
  applications: () => api.get('/admin/provider-applications'),
  decideApplication: (id, decision, note) =>
    api.patch(`/admin/provider-applications/${id}`, { decision, note }),
  users: () => api.get('/admin/users'),
  auditLogs: () => api.get('/admin/audit-logs'),
};
