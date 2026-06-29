import axios from 'axios';

const userApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`,
  headers: { 'Content-Type': 'application/json' },
});

userApi.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('worldwide_user_token');
  if (token) {
    cfg.headers = { ...cfg.headers, Authorization: `Bearer ${token}` } as any;
  }
  return cfg;
});

userApi.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('worldwide_user_token');
      localStorage.removeItem('worldwide_user');
    }
    return Promise.reject(err);
  }
);

export default userApi;
