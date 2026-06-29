import axios from 'axios';

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('worldwide_admin_token');
  if (token) {
    cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` } as any;
  }
  return cfg;
});

adminApi.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('worldwide_admin_token');
      try {
        window.location.href = '/admin/login';
      } catch {
        // noop
      }
    }
    return Promise.reject(err);
  }
);

export default adminApi;
