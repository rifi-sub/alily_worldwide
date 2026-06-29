import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login fields
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');

  // Signup fields
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  if (!isOpen) return null;

  const resetFields = () => {
    setLoginValue('');
    setPassword('');
    setSignupEmail('');
    setSignupUsername('');
    setSignupPassword('');
    setSignupName('');
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(loginValue, password);
      resetFields();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(signupEmail, signupUsername, signupPassword, signupName || undefined);
      resetFields();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose} aria-label="Close login modal">
          <X size={24} />
        </button>
        
        <h3 className="login-title">{mode === 'login' ? 'Log In' : 'Create Account'}</h3>

        {error && <div className="login-error">{error}</div>}
        
        {mode === 'login' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="loginEmail">Email or Username</label>
              <input
                type="text"
                id="loginEmail"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                className="form-control"
                required
                autoComplete="username"
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
                autoComplete="current-password"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="signupName">Name (optional)</label>
              <input
                type="text"
                id="signupName"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="form-control"
                autoComplete="name"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="signupEmail">Email *</label>
              <input
                type="email"
                id="signupEmail"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="form-control"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="signupUsername">Username *</label>
              <input
                type="text"
                id="signupUsername"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                className="form-control"
                required
                autoComplete="username"
                placeholder="3-20 characters, letters/numbers/underscores"
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="signupPassword">Password *</label>
              <input
                type="password"
                id="signupPassword"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="form-control"
                required
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}
        
        <p className="login-helper-text">
          {mode === 'login' ? (
            <>Don't have an account? <button className="text-link" onClick={switchMode}>Sign up</button></>
          ) : (
            <>Already have an account? <button className="text-link" onClick={switchMode}>Log in</button></>
          )}
        </p>
      </div>
    </div>
  );
};
