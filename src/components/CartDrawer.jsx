import { useState } from 'react';
import { useCart } from '../context/CartContext';

export function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCart();
  const [observacao, setObservacao] = useState("");

  const gerarIdPedido = () => {
    return `#PED-${Math.floor(Math.random() * 10000)}`;
  };

  const handleFinalizarZap = () => {
    const telefone = "556499470317"; 
    const idPedido = gerarIdPedido();
    
    let mensagem = `Olá! Gostaria de finalizar o *Pedido ${idPedido}*:\n\n`;
    
    cartItems.forEach(item => {
      // Mostra a variação se tiver
      const detalhe = item.selectedOption ? `(${item.selectedOption})` : '';
      mensagem += `📦 *${item.quantity}x ${item.nome}* ${detalhe}\n`;
      mensagem += `   R$ ${(item.preco * item.quantity).toFixed(2)}\n`;
    });
    
    mensagem += `\n💰 *TOTAL: R$ ${cartTotal.toFixed(2)}*`;
    
    if (observacao) {
      mensagem += `\n\n📝 *Obs:* ${observacao}`;
    }

    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fundo escuro atrás */}
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
      
      <div className="relative w-full max-w-sm bg-[#0f0f0f] text-white h-full shadow-2xl flex flex-col p-4 border-l border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Seu Carrinho</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400">Fechar</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {cartItems.length === 0 && <p className="text-center text-gray-500 mt-10">Carrinho vazio...</p>}
          
          {cartItems.map(item => (
            <div key={item.cartItemId} className="bg-gray-800 p-3 rounded flex justify-between">
              <div>
                <p className="font-bold">{item.nome}</p>
                {item.selectedOption && <p className="text-xs text-purple-400">{item.selectedOption}</p>}
                <p className="text-sm text-gray-300">{item.quantity}x R$ {item.preco}</p>
              </div>
              <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-400 text-sm">Remover</button>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-gray-700 pt-4">
          <textarea 
            placeholder="Alguma observação para o pedido?"
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white mb-4 resize-none"
            rows="2"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
          
          <div className="flex justify-between text-xl font-bold mb-4 text-green-400">
            <span>Total:</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            disabled={cartItems.length === 0}
            onClick={handleFinalizarZap}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white py-3 rounded-lg font-bold transition-colors"
          >
            Finalizar no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}