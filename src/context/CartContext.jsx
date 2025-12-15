import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, quantity, selectedOption) => {
    setCartItems(prev => {
      const cartItemId = selectedOption ? `${product.id}-${selectedOption}` : `${product.id}`;

      const existing = prev.find(item => item.cartItemId === cartItemId);

      if (existing) {
        return prev.map(item => 
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }

      return [...prev, { 
        ...product, 
        cartItemId,
        quantity, 
        selectedOption
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.preco * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, cartTotal, totalItems, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);