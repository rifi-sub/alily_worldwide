import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const handleCheckout = () => {
    navigate('/checkout-page');
  };

  if (cart.length === 0) {
    return (
      <div className="container empty-cart-view">
        <h2 className="empty-cart-title">My Cart is empty</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse our store to find your next mentorship tools and guides.
        </p>
        <Link to="/category/all-products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h2 className="cart-title">Shopping Cart</h2>
        
        <div className="cart-grid">
          {/* Cart Items List */}
          <div className="cart-items-section">
            {cart.map((item, idx) => (
              <div key={`${item.id}-${item.bindingStyle || idx}`} className="cart-item-row">
                <div className="cart-item-img-wrapper">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  {item.bindingStyle && (
                    <span className="cart-item-meta">Style: {item.bindingStyle}</span>
                  )}
                  <span className="cart-item-price">£{item.price.toFixed(2)}</span>
                </div>
                
                <div className="cart-item-actions">
                  {/* Quantity selector */}
                  <div className="quantity-counter" style={{ height: '38px' }}>
                    <button 
                      className="counter-btn" 
                      onClick={() => updateQuantity(item.id, item.bindingStyle, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="counter-value">{item.quantity}</span>
                    <button 
                      className="counter-btn" 
                      onClick={() => updateQuantity(item.id, item.bindingStyle, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCart(item.id, item.bindingStyle)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Card */}
          <div className="cart-summary-card">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>£{cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery</span>
              <span>FREE (Digital Delivery)</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>£{cartTotal.toFixed(2)}</span>
            </div>
            
            <button className="btn btn-primary" onClick={handleCheckout} style={{ marginTop: '1rem' }}>
              Checkout
            </button>
            
            <Link 
              to="/category/all-products" 
              style={{ textAlign: 'center', fontSize: '0.85rem', textDecoration: 'underline', color: 'var(--text-muted)' }}
            >
              Or Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
