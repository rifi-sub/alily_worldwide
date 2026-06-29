import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../lib/api';
import './CheckoutPage.css';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  // Checkout Form Details
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email
      });
    }
  }, [user]);

  const [paypalConfig, setPaypalConfig] = useState<{ clientId: string; mode: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  useEffect(() => {
    api.get('/worldwide/payments/config')
      .then((res) => {
        setPaypalConfig(res.data);
      })
      .catch((err) => {
        console.error('Failed to load PayPal config', err);
        setErrorMsg('Failed to load payment configuration.');
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      alert('Please fill out all contact fields.');
      return false;
    }
    return true;
  };

  const createPayPalOrder = async () => {
    setErrorMsg(null);
    const resolvedOrderCode = `ALW-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    try {
      const response = await api.post('/worldwide/payments/create-order', {
        amount: cartTotal.toFixed(2),
        orderCode: resolvedOrderCode,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          bindingStyle: item.bindingStyle
        }))
      });

      const pendingOrder = {
        orderId: response.data.orderId,
        orderCode: resolvedOrderCode,
        customerEmail: formData.email.trim(),
        customerName: formData.fullName.trim(),
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          bindingStyle: item.bindingStyle
        })),
        shippingAddress: null
      };
      sessionStorage.setItem('alw_pending_order', JSON.stringify(pendingOrder));

      return response.data.orderId;
    } catch (err: any) {
      console.error('Create PayPal order failed:', err);
      const msg = err.response?.data?.error || 'Failed to create PayPal transaction.';
      setErrorMsg(msg);
      throw err;
    }
  };

  const onApprovePayPal = async (data: any) => {
    setLoading(true);
    try {
      const pendingOrderStr = sessionStorage.getItem('alw_pending_order');
      if (!pendingOrderStr) {
        alert('Order session expired. Please refresh the page and try again.');
        setLoading(false);
        return;
      }

      const pendingOrder = JSON.parse(pendingOrderStr);

      const captureResponse = await api.post('/worldwide/payments/capture-order', {
        orderId: data.orderID,
        customerEmail: pendingOrder.customerEmail,
        customerName: pendingOrder.customerName,
        items: pendingOrder.items,
        orderCode: pendingOrder.orderCode,
        shippingAddress: null
      });

      if (captureResponse.data.success) {
        setOrderCode(captureResponse.data.orderCode);
        clearCart();
        sessionStorage.removeItem('alw_pending_order');
        setIsSuccess(true);
      }
    } catch (err: any) {
      console.error('Payment capture error:', err);
      setErrorMsg(err.response?.data?.error || 'Payment capture failed. Please contact support.');
    } finally {
      setLoading(false);
    }
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
          <h2 className="checkout-section-title">Contact Information</h2>
          <div className="billing-form">
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

            <div className="paypal-trigger-container" style={{ marginTop: '2rem' }}>
              {errorMsg && (
                <div style={{ color: '#D9383A', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  {errorMsg}
                </div>
              )}
              {loading || !paypalConfig ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                  <div style={{ width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--primary-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              ) : (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalConfig.clientId,
                    currency: 'GBP',
                    intent: 'capture',
                    environment: paypalConfig.mode === 'live' ? 'production' : 'sandbox',
                  }}
                >
                  <PayPalButtons
                    style={{ layout: 'vertical', shape: 'rect', color: 'gold' }}
                    onClick={(_, actions) => {
                      if (!validateForm()) {
                        return actions.reject();
                      }
                      return actions.resolve();
                    }}
                    createOrder={createPayPalOrder}
                    onApprove={onApprovePayPal}
                    onError={(err) => {
                      console.error('PayPal button error:', err);
                      setErrorMsg('There was an issue processing the payment with PayPal.');
                    }}
                  />
                </PayPalScriptProvider>
              )}
            </div>
          </div>
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
    </div>
  );
};
