import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(product.opcoes ? product.opcoes[0] : null);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity, selectedOption);
    onClose();
  };

  return (
    <>
      <div className="custom-backdrop" onClick={onClose}></div>
      <div className="custom-modal p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
            <h4 className="fw-bold text-white mb-0">{product.nome}</h4>
            <button onClick={onClose} className="btn btn-sm btn-outline-secondary text-white border-0">✕</button>
        </div>

        <div className="row g-4">
            <div className="col-md-6">
                <img src={product.imagem_url} alt={product.nome} className="img-fluid rounded-3 w-100" style={{objectFit: 'cover', maxHeight: '250px'}} />
            </div>
            
            <div className="col-md-6 d-flex flex-column">
                <p className="text-secondary small mb-3">{product.descricao}</p>
                
                {product.opcoes && product.opcoes.length > 0 && (
                  <div className="mb-3">
                    <label className="text-white small fw-bold mb-1">Opção:</label>
                    <select 
                      className="form-select form-select-dark form-select-sm"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    >
                      {product.opcoes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                )}

                <div className="mt-auto pt-3 border-top border-secondary border-opacity-25">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center bg-dark rounded border border-secondary border-opacity-25">
                            <button className="btn btn-sm text-white px-3" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span className="fw-bold text-white">{quantity}</span>
                            <button className="btn btn-sm text-white px-3" onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                        <div className="text-end">
                            <small className="text-muted d-block">Total</small>
                            <span className="fw-bold text-primary fs-5">R$ {(product.price * quantity).toFixed(2)}</span>
                        </div>
                    </div>
                    <button className="btn btn-neon w-100" onClick={handleAdd}>
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}