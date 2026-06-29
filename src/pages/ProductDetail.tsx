import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../lib/api';
import './ProductDetail.css';

export const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [bindingStyle, setBindingStyle] = useState<'Case Bound' | 'Layflat'>('Case Bound');
  const [quantity, setQuantity] = useState(1);
  const [readMore, setReadMore] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/worldwide/products/${id}`)
      .then((res) => {
        setProduct({
          id: res.data.id,
          name: res.data.title,
          price: res.data.price,
          image: res.data.image_url,
          description: res.data.description,
          category: res.data.category
        });
      })
      .catch((err) => {
        console.error(err);
        setError('Product not found');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleIncrement = () => {
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, bindingStyle);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, bindingStyle);
    navigate('/checkout-page');
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
          <h3>Loading product details...</h3>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-page">
        <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
          <h3 style={{ color: 'var(--primary-accent)' }}>{error || 'Product not found'}</h3>
          <Link to="/category/all-products" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="container detail-grid">
        {/* Left Side: Product Image */}
        <div className="detail-img-card">
          <img src={product.image} alt={product.name} className="detail-img" />
        </div>

        {/* Right Side: Product Actions & Info */}
        <div className="detail-info">
          <div>
            <h2 className="detail-title">{product.name}</h2>
            <span className="detail-price">£{product.price.toFixed(2)}</span>
          </div>

          {/* Binding options */}
          <div className="options-section">
            <span className="options-label">Binding Style *</span>
            <div className="binding-options">
              <button
                className={`binding-btn ${bindingStyle === 'Case Bound' ? 'selected' : ''}`}
                onClick={() => setBindingStyle('Case Bound')}
              >
                Case Bound
              </button>
              <button
                className={`binding-btn ${bindingStyle === 'Layflat' ? 'selected' : ''}`}
                onClick={() => setBindingStyle('Layflat')}
              >
                Layflat
              </button>
            </div>
          </div>

          {/* Quantity selector */}
          <div className="options-section">
            <span className="options-label">Quantity *</span>
            <div className="quantity-counter">
              <button className="counter-btn" onClick={handleDecrement} aria-label="Decrease quantity">
                -
              </button>
              <span className="counter-value">{quantity}</span>
              <button className="counter-btn" onClick={handleIncrement} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="actions-group">
            <button className="btn btn-primary" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn btn-dark" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          {/* Description */}
          <div className="detail-desc">
            <span className="options-label" style={{ display: 'block', marginBottom: '0.8rem' }}>Description</span>
            <p className="desc-text">
              An e-book by Goddess A Lilly. When I first stepped into the findom world, I had no clue what I was doing—and definitely wasn't seeing results. Over time, I learned what actually works, built real experience, and figured out how to turn this into something profitable.
            </p>
            
            {readMore && (
              <p className="desc-text" style={{ marginTop: '1rem' }}>
                Through this blueprint guide, I share the exact templates, scripts, and psychological triggers that helped me go from struggle to success. You'll learn how to establish boundaries, how to communicate with authority, and how to command respect while building a premium brand. Ready to take control of your financial destiny?
              </p>
            )}

            <button className="read-more-btn" onClick={() => setReadMore(!readMore)}>
              {readMore ? 'Read less' : 'Read more'}
            </button>
          </div>

          {/* Sharing */}
          <div className="social-share">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="share-btn" aria-label="Share on Facebook">
              <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="share-btn" aria-label="Share on Twitter">
              <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="share-btn" aria-label="Share on WhatsApp">
              <MessageCircle size={18} />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="share-btn" aria-label="Share on Pinterest">
              <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.396-5.897 1.396-5.897s-.356-.71-.356-1.758c0-1.646.955-2.87 2.138-2.87 1.008 0 1.495.757 1.495 1.666 0 1.014-.646 2.531-.979 3.935-.279 1.177.59 2.137 1.75 2.137 2.099 0 3.712-2.211 3.712-5.397 0-2.822-2.029-4.8-4.93-4.8-3.357 0-5.328 2.518-5.328 5.12 0 1.014.39 2.102.879 2.695.097.118.11.221.082.336-.09.373-.29 1.18-.33 1.341-.052.212-.172.257-.397.153-1.482-.69-2.407-2.858-2.407-4.597 0-3.743 2.72-7.18 7.842-7.18 4.116 0 7.314 2.932 7.314 6.852 0 4.09-2.576 7.38-6.149 7.38-1.2 0-2.327-.624-2.713-1.361l-.74 2.82c-.267 1.02-.99 2.298-1.474 3.084 1.127.348 2.322.536 3.563.536 6.62 0 11.988-5.367 11.988-11.987C23.999 5.367 18.634 0 12.017 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Added to cart Toast */}
      {showToast && (
        <div className="toast-message">
          <span>Added to cart successfully!</span>
          <Link to="/cart-page" className="toast-link">
            View Cart
          </Link>
        </div>
      )}
    </div>
  );
};
