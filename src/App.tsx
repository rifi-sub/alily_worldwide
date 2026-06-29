import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';

// Pages
import { Home } from './pages/Home';
import { AboutMe } from './pages/AboutMe';
import { SuccessStories } from './pages/SuccessStories';
import { FAQs } from './pages/FAQs';
import { Contact } from './pages/Contact';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { BookOnline } from './pages/BookOnline';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { MembersArea } from './pages/MembersArea';

function AppInner() {
  const { isAuthenticated, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header 
          onLoginClick={() => setIsLoginOpen(true)} 
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/fa-qs" element={<FAQs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/category/all-products" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/book-online" element={<BookOnline />} />
            <Route path="/cart-page" element={<CartPage />} />
            <Route path="/checkout-page" element={<CheckoutPage />} />
            <Route path="/members" element={<MembersArea />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        <Footer />

        <LoginModal 
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
