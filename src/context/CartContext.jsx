import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('geek_cart');
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      return parsed.filter(i => i && typeof i.price === 'number' && !isNaN(i.price));
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('geek_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product || typeof product.price !== 'number' || isNaN(product.price)) {
        toast.error("Erro: Produto inválido."); 
        return;
    }

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += (product.quantity || 1);
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity: (product.quantity || 1) }];
      }
    });
    
    toast.success(`"${product.title || product.nome}" adicionado!`, {
      style: { background: '#111', color: '#fff', borderLeft: '4px solid #00ff88' }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    toast.info("Item removido.");
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const cartTotal = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const qty = item.quantity || 1;
    return total + (price * qty);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      isCartOpen, 
      setIsCartOpen,
      totalItems,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);