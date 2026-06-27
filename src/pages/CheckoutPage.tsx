import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  
  // Checkout Form Details
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postCode: '',
    country: 'United Kingdom'
  });

  // Simulated PayPal Flow States
  const [showPortal, setShowPortal] = useState(false);
  const [portalStep, setPortalStep] = useState<'login' | 'confirm' | 'processing'>('login');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerMockPayPal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.address) {
      alert('Please fill out all required shipping fields.');
      return;
    }
    
    // Set up portal initial state
    setPaypalEmail(formData.email);
    setPortalStep('login');
    setShowPortal(true);
  };

  const handlePaypalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPortalStep('confirm');
  };

  const handlePaypalPay = () => {
    setPortalStep('processing');
    
    // Generate simulated order code
    const uniqueNum = Math.floor(100000 + Math.random() * 900000);
    const code = `ALW-${uniqueNum}`;
    
    setTimeout(() => {
      setOrderCode(code);
      setShowPortal(false);
      setIsSuccess(true);
      clearCart(); // Clear cart state
    }, 2500);
  };

  // Render Success screen
  if (isSuccess) {
    return (
      <div className="container" style={{ padding: '5rem 0' }}>
        <div className="success-card">
          <div className="success-icon">
            <Check size={40} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Order Confirmed</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Thank you for your order, <strong>{formData.fullName}</strong>.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            Your digital guide will be sent shortly to <strong>{formData.email}</strong>.
          </p>
          
          <div className="order-code-box">
            ORDER CODE: {orderCode}
          </div>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
            A copy of this confirmation has been sent to your inbox. For any support or inquiries, please mention your order code to us at <a href="mailto:alilyworldwide@gmail.com" style={{ color: 'var(--primary-accent)', fontWeight: 500 }}>alilyworldwide@gmail.com</a>.
          </p>
          
          <Link to="/category/all-products" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Render Empty state
  if (cart.length === 0) {
    return (
      <div className="container empty-cart-view">
        <h2 className="empty-cart-title">Your checkout is empty</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Please add items to your cart from the shop to proceed.
        </p>
        <Link to="/category/all-products" className="btn btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container checkout-grid">
        {/* Left Side: Shipping form */}
        <div>
          <h2 className="checkout-section-title">Shipping Information</h2>
          <form className="billing-form" onSubmit={triggerMockPayPal}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="postCode">Post Code *</label>
                <input
                  type="text"
                  id="postCode"
                  name="postCode"
                  value={formData.postCode}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Spain">Spain</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            <div className="paypal-trigger-container">
              <button type="submit" className="paypal-btn-mock">
                <span>Pay with </span>
                <span className="paypal-logo-text">
                  <span className="paypal-blue">Pay</span>
                  <span className="paypal-light-blue">Pal</span>
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Order summary */}
        <div>
          <h2 className="checkout-section-title">Your Order</h2>
          <div className="cart-summary-card">
            {cart.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}
              >
                <div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-color)' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} {item.bindingStyle && `(${item.bindingStyle})`}
                  </span>
                </div>
                <span style={{ fontWeight: 500, color: 'var(--primary-accent)' }}>
                  £{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>£{cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>£{cartTotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--primary-accent)' }} />
              <span>Secure Checkout simulated via PayPal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated PayPal Portal Overlay */}
      {showPortal && (
        <div className="paypal-portal-overlay">
          <div className="paypal-portal-window">
            <div className="paypal-portal-header">
              <span style={{ fontWeight: 800, fontSize: '1.2rem', fontStyle: 'italic' }}>PayPal Secure Sandbox</span>
              <button onClick={() => setShowPortal(false)} style={{ color: '#FFFFFF', fontSize: '1.1rem' }}>✕</button>
            </div>

            {portalStep === 'login' && (
              <form className="paypal-portal-body" onSubmit={handlePaypalLogin}>
                <h3 style={{ fontSize: '1.25rem', color: '#333333', textAlign: 'center', fontWeight: 600 }}>
                  Pay with PayPal
                </h3>
                <div className="paypal-input-group">
                  <label htmlFor="paypalEmail">Email address</label>
                  <input
                    type="email"
                    id="paypalEmail"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="paypal-input"
                    required
                  />
                </div>
                <div className="paypal-input-group">
                  <label htmlFor="paypalPassword">Password</label>
                  <input
                    type="password"
                    id="paypalPassword"
                    value="••••••••••••"
                    readOnly
                    className="paypal-input"
                  />
                </div>
                <button type="submit" className="paypal-login-btn">
                  Log In
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666666' }}>
                  This is a secure simulation for development testing.
                </div>
              </form>
            )}

            {portalStep === 'confirm' && (
              <div className="paypal-portal-body">
                <h3 style={{ fontSize: '1.25rem', color: '#333333', fontWeight: 600 }}>
                  Review Your Payment
                </h3>
                
                <div className="confirm-details">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#555555' }}>Pay to:</span>
                    <strong style={{ color: '#333333' }}>Alilly Worldwide</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#555555' }}>Total amount:</span>
                    <strong style={{ color: '#333333', fontSize: '1.1rem' }}>£{cartTotal.toFixed(2)} GBP</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #DDD', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ color: '#555555' }}>Funding Source:</span>
                    <span style={{ color: '#333333' }}>PayPal Balance (Sandbox)</span>
                  </div>
                </div>

                <div className="paypal-confirm-section">
                  <button className="paypal-pay-btn" onClick={handlePaypalPay}>
                    Pay Now
                  </button>
                  <button 
                    style={{ color: '#0070BA', textAlign: 'center', fontSize: '0.9rem', fontWeight: 500 }}
                    onClick={() => setPortalStep('login')}
                  >
                    Cancel and return
                  </button>
                </div>
              </div>
            )}

            {portalStep === 'processing' && (
              <div className="paypal-portal-body" style={{ alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #F3F3F3', borderTop: '4px solid #0070BA', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }}></div>
                <h3 style={{ fontSize: '1.1rem', color: '#333333', fontWeight: 600 }}>Processing payment...</h3>
                <p style={{ fontSize: '0.85rem', color: '#666666', marginTop: '0.5rem' }}>Please do not close this window</p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
