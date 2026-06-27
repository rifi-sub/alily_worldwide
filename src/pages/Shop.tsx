import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';
import productImg from '../assets/product.jpg';

export const Shop: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'books' | 'graphics'>('all');

  const products = [
    {
      id: 'the-art-of-control',
      name: 'The Art Of Control',
      price: 85.00,
      image: productImg,
      category: 'books',
      description: 'An e-book by Goddess A Lilly. Learn how to navigate the findom space, establish bulletproof boundaries, and build a highly profitable business model.'
    }
  ];

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="shop-page">
      <div className="container">
        {/* Banner image using unsplash luxury clothes mockup */}
        <div 
          className="shop-banner" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80')` }}
        >
          <h2 className="shop-banner-title">Store</h2>
        </div>

        <div className="shop-layout">
          {/* Sidebar */}
          <aside className="shop-sidebar">
            <div>
              <h3 className="sidebar-title">Browse by</h3>
              <ul className="category-list">
                <li className={`category-item ${activeCategory === 'all' ? 'active' : ''}`}>
                  <button onClick={() => setActiveCategory('all')}>All Products</button>
                </li>
                <li className={`category-item ${activeCategory === 'books' ? 'active' : ''}`}>
                  <button onClick={() => setActiveCategory('books')}>Books</button>
                </li>
                <li className={`category-item ${activeCategory === 'graphics' ? 'active' : ''}`}>
                  <button onClick={() => setActiveCategory('graphics')}>Graphics Service</button>
                </li>
              </ul>
            </div>
          </aside>

          {/* Product Catalog */}
          <main className="shop-main">
            <div className="shop-content-header">
              <span className="products-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
              
              <select className="sort-select" aria-label="Sort products">
                <option value="recommended">Sort by: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.id}`}
                    className="product-card"
                  >
                    <div className="product-img-wrapper">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="product-img" 
                      />
                    </div>
                    <div className="product-info">
                      <h4 className="product-title">{product.name}</h4>
                      <span className="product-price">£{product.price.toFixed(2)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No products here yet...</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  In the meantime, you can choose a different category to continue shopping.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
