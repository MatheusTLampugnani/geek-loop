import { useState } from 'react';
import { useCart } from '../context/CartContext';

export function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  // Se tiver opções, a primeira vem selecionada por padrão, senão null
  const [selectedOption, setSelectedOption] = useState(product.opcoes ? product.opcoes[0] : null);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity, selectedOption);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] text-white p-6 rounded-xl max-w-md w-full relative border border-purple-900">
        <button onClick={onClose} className="absolute top-2 right-4 text-2xl text-gray-400">×</button>
        
        <img src={product.imagem_url} alt={product.nome} className="w-full h-48 object-cover rounded-lg mb-4"/>
        
        <h2 className="text-2xl font-bold mb-2">{product.nome}</h2>
        <p className="text-gray-400 text-sm mb-4">{product.descricao}</p>
        
        {/* Seletor de Variações */}
        {product.opcoes && product.opcoes.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-bold text-purple-400 mb-1">Escolha o modelo:</label>
            <select 
              className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              {product.opcoes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-3 bg-gray-800 rounded px-2">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 py-1">-</button>
            <span className="font-bold">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-2 py-1">+</button>
          </div>
          
          <button 
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition-all"
          >
            Adicionar R$ {(product.preco * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}