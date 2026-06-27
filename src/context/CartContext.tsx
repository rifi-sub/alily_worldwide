import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  bindingStyle?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number, bindingStyle?: string) => void;
  removeFromCart: (id: string, bindingStyle?: string) => void;
  updateQuantity: (id: string, bindingStyle: string | undefined, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const localData = localStorage.getItem('alilly_worldwide_cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('alilly_worldwide_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number, bindingStyle?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.bindingStyle === bindingStyle
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { ...product, quantity, bindingStyle }];
    });
  };

  const removeFromCart = (id: string, bindingStyle?: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.bindingStyle === bindingStyle))
    );
  };

  const updateQuantity = (id: string, bindingStyle: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, bindingStyle);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.bindingStyle === bindingStyle ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
