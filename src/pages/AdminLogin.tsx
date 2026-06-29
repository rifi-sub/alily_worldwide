import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { setAdminToken } from '../lib/auth';
import './AdminLogin.css';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/admin/login', { password });
      const token = res.data?.token;
      if (token) {
        setAdminToken(token);
        navigate('/admin/dashboard');
      } else {
        setError('Authentication response did not contain a token.');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.error || 'Invalid password or login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <h2 className="admin-login-title">Worldwide Access</h2>
        <div className="admin-login-divider"></div>
        <p className="admin-login-subtitle">Enter admin password to manage products and orders.</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="adminPassword">Password</label>
            <input
              type="password"
              id="adminPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••••••"
              required
            />
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button type="submit" className="btn btn-dark admin-login-btn" disabled={loading}>
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </form>
      </div>
    </div>
  );
};
