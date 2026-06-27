import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
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

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Restore session
  useEffect(() => {
    const savedUser = localStorage.getItem('alilly_worldwide_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleLoginSuccess = (email: string) => {
    setCurrentUser(email);
    localStorage.setItem('alilly_worldwide_user', email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('alilly_worldwide_user');
  };

  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header 
            onLoginClick={() => setIsLoginOpen(true)} 
            currentUser={currentUser}
            onLogout={handleLogout}
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
            </Routes>
          </main>
          
          <Footer />

          <LoginModal 
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
