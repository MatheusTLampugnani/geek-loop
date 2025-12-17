import React from 'react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    cartTotal 
  } = useCart();

  const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  return (
    <>
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>}

      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Seu Carrinho ({cartItems.length})</h3>
          <button className="close-drawer" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>

        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Seu carrinho está vazio :(</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="item-details">
                  <h4>{item.title}</h4>
                  {item.selectedOption && <span className="item-option">Opção: {item.selectedOption}</span>}
                  <div className="item-price-row">
                    <span className="item-qty">{item.quantity}x</span>
                    <span className="item-price">R$ {Number(item.price).toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  className="btn-remove" 
                  onClick={() => removeFromCart(item.id)}
                  title="Remover item"
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="total-row">
            <span>Total:</span>
            <span className="total-value">R$ {cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            className="btn-whatsapp-checkout"
            onClick={() => {
              let msg = "Olá! Gostaria de finalizar meu pedido:\n\n";
              cartItems.forEach(i => {
                msg += `${i.quantity}x ${i.title} - R$ ${(i.price * i.quantity).toFixed(2)}\n`;
                if(i.selectedOption) msg += `   (Opção: ${i.selectedOption})\n`;
              });
              msg += `\n*Total: R$ ${cartTotal.toFixed(2)}*`;
              window.open(`https://wa.me/556499470317?text=${encodeURIComponent(msg)}`, '_blank');
            }}
          >
            Finalizar no WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}