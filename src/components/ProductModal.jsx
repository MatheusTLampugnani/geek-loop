import React, { useState, useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedOption(
        product.options && product.options.length > 0 ? product.options[0] : null
      );
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCartClick = () => {
    const itemParaCarrinho = {
      ...product,
      quantity: quantity,
      selectedOption: selectedOption, 
      totalPrice: product.price * quantity
    };

    console.log("Enviando para o carrinho:", itemParaCarrinho);
    
    onAddToCart(itemParaCarrinho);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-body">
          <div className="image-column">
            <img src={product.image} alt={product.title} />
          </div>

          <div className="info-column">
            <span className="category-tag">
              {(product.category || product.categorias?.nome || 'PRODUTO').toUpperCase()}
            </span>
            
            <h2 className="product-title">{product.title}</h2>
            
            <div className="product-price">
              R$ {Number(product.price).toFixed(2)}
              <span className="installment-info">em até 10x sem juros</span>
            </div>

            <div className="product-description">
              <p>{product.description || "Sem descrição disponível."}</p>
            </div>

            {product.options && product.options.length > 0 && (
              <div className="options-selector">
                <label>Escolha a opção:</label>
                <div className="options-grid">
                  {product.options.map((option) => (
                    <button
                      key={option}
                      className={`option-btn ${selectedOption === option ? 'active' : ''}`}
                      onClick={() => setSelectedOption(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="action-row">
              <div className="quantity-control">
                <button onClick={handleDecrease}>-</button>
                <span>{quantity}</span>
                <button onClick={handleIncrease}>+</button>
              </div>

              <button className="add-cart-btn" onClick={handleAddToCartClick}>
                ADICIONAR AO CARRINHO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;