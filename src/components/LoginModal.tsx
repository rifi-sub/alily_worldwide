import React, { useState } from 'react';
import { X } from 'lucide-react';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill out all fields.');
      return;
    }
    
    // Simulate login success
    onLoginSuccess(email);
    onClose();
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose} aria-label="Close login modal">
          <X size={24} />
        </button>
        
        <h3 className="login-title">Log In</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="loginEmail">Email</label>
            <input
              type="email"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
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
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Log In
          </button>
        </form>
        
        <p className="login-helper-text">
          Enter any email and password to log in for sandbox testing.
        </p>
      </div>
    </div>
  );
};
