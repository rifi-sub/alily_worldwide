import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';
import logo from '../assets/logo.png';

interface HeaderProps {
  onLoginClick: () => void;
  currentUser: string | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, currentUser, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link to="/" className="logo-link" onClick={closeMobileMenu}>
          <img src={logo} alt="ALILY WORLDWIDE" className="logo-img" />
        </Link>

        <nav>
          <ul className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                end
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about-me"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={closeMobileMenu}
              >
                About Me
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/success-stories"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={closeMobileMenu}
              >
                Success Stories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/fa-qs"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={closeMobileMenu}
              >
                FAQ's
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={closeMobileMenu}
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category/all-products"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={closeMobileMenu}
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/book-online"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={closeMobileMenu}
              >
                Book Online
              </NavLink>
            </li>
            {isMobileMenuOpen && (
              <li style={{ marginTop: '1rem' }}>
                {currentUser ? (
                  <button className="login-btn" onClick={() => { onLogout(); closeMobileMenu(); }}>
                    <User size={18} />
                    Logout ({currentUser})
                  </button>
                ) : (
                  <button className="login-btn" onClick={() => { onLoginClick(); closeMobileMenu(); }}>
                    <User size={18} />
                    Log In
                  </button>
                )}
              </li>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          {currentUser ? (
            <button className="login-btn" onClick={onLogout}>
              <User size={18} />
              Logout
            </button>
          ) : (
            <button className="login-btn" onClick={onLoginClick}>
              <User size={18} />
              Log In
            </button>
          )}

          <Link to="/cart-page" className="icon-btn" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          <button className="menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};
