import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export const CartDrawer: React.FC = () => {
  const { cart, cartTotal, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout-page');
  };

  const handleGoToCart = () => {
    closeDrawer();
    navigate('/cart-page');
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeDrawer}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <ShoppingBag size={20} />
            <h3>Your Shopping Bag</h3>
          </div>
          <button className="cart-drawer-close" onClick={closeDrawer} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        <div className="cart-drawer-items">
          {cart.length === 0 ? (
            <div className="cart-drawer-empty">
              <ShoppingBag size={48} className="empty-icon" />
              <p>Your bag is empty.</p>
              <button className="btn btn-primary" onClick={closeDrawer} style={{ marginTop: '1.5rem' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.bindingStyle || ''}`} className="cart-drawer-item">
                <div className="cart-drawer-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-drawer-item-details">
                  <h4 className="item-name">{item.name}</h4>
                  {item.bindingStyle && <span className="item-binding">Style: {item.bindingStyle}</span>}
                  <span className="item-price">£{Number(item.price).toFixed(2)}</span>
                  
                  <div className="cart-drawer-item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.bindingStyle, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.bindingStyle, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id, item.bindingStyle)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-total">
              <span>Subtotal</span>
              <span className="total-price">£{cartTotal.toFixed(2)}</span>
            </div>
            <p className="footer-note">Shipping & taxes calculated at checkout.</p>
            <div className="cart-drawer-buttons">
              <button className="btn btn-dark" onClick={handleGoToCart}>
                View Full Bag
              </button>
              <button className="btn btn-primary" onClick={handleCheckout}>
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
