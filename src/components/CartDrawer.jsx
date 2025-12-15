import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();
  const [observacao, setObservacao] = useState("");

  const gerarIdPedido = () => `#PED-${Math.floor(Math.random() * 10000)}`;

  const handleFinalizarZap = () => {
    const telefone = "556499470317";
    const idPedido = gerarIdPedido();
    let mensagem = `Olá! Gostaria de finalizar o *Pedido ${idPedido}*:\n\n`;
    
    cartItems.forEach(item => {
      const detalhe = item.selectedOption ? `(${item.selectedOption})` : '';
      mensagem += `*${item.quantity}x ${item.nome}* ${detalhe}\n`;
      mensagem += `R$ ${(item.preco * item.quantity).toFixed(2)}\n`;
    });
    
    mensagem += `\n*TOTAL: R$ ${cartTotal.toFixed(2)}*`;
    if (observacao) mensagem += `\n\n*Obs:* ${observacao}`;

    window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="custom-backdrop" onClick={() => setIsCartOpen(false)}></div>
      <div className="custom-drawer p-3">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
          <h5 className="fw-bold text-white mb-0">Seu Carrinho</h5>
          <button onClick={() => setIsCartOpen(false)} className="btn btn-sm text-secondary">✕</button>
        </div>

        <div className="flex-grow-1 overflow-auto" style={{scrollbarWidth: 'thin'}}>
          {cartItems.length === 0 ? (
            <div className="text-center text-muted mt-5">
                <p style={{ color: '#ffffffff' }}>O carrinho está vazio.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.cartItemId} className="d-flex justify-content-between align-items-center mb-3 bg-dark p-2 rounded border border-secondary border-opacity-25">
                <div>
                  <div className="fw-bold text-white small">{item.nome}</div>
                  <div className="text-primary" style={{fontSize: '0.7rem'}}>{item.selectedOption}</div>
                  <div className="text-secondary" style={{fontSize: '0.7rem'}}>{item.quantity}x R$ {item.preco.toFixed(2)}</div>
                </div>
                <button onClick={() => removeFromCart(item.cartItemId)} className="btn btn-sm text-danger p-0 px-2">✕</button>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
          <textarea 
            placeholder="Observações? (Ex: Presente)"
            className="form-control form-control-dark mb-3 text-white small"
            rows="2"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
          <div className="d-flex justify-content-between fw-bold text-white mb-3">
            <span>Total:</span>
            <span className="text-primary">R$ {cartTotal.toFixed(2)}</span>
          </div>
          <button 
            disabled={cartItems.length === 0}
            onClick={handleFinalizarZap}
            className="btn btn-neon w-100"
          >
            Finalizar no WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}