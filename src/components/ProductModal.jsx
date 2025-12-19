import React, { useState, useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [localOptions, setLocalOptions] = useState([]);

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setActiveImage(product.image);

      let rawOpts = product.options || product.opcoes || [];

      let finalOptions = [];

      if (Array.isArray(rawOpts)) {
        finalOptions = rawOpts;
      } 
      else if (typeof rawOpts === 'string') {
        try {
          const cleanString = rawOpts.replace(/[{}"[\]]/g, ''); 
          finalOptions = cleanString.split(',').map(s => s.trim()).filter(Boolean);
        } catch (e) {
          console.error("Erro ao processar opções:", e);
          finalOptions = [];
        }
      }

      setLocalOptions(finalOptions);
      setSelectedOption(finalOptions.length > 0 ? finalOptions[0] : null);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const allImages = [...new Set([product.image, ...(product.gallery || [])])].filter(Boolean);

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCartClick = () => {
    const itemParaCarrinho = {
      ...product,
      quantity,
      selectedOption, 
      totalPrice: product.price * quantity,
      image: activeImage || product.image 
    };
    
    onAddToCart(itemParaCarrinho);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-body">
          <div className="image-column">
            <div className="main-image-wrapper">
               <img src={activeImage || product.image} alt={product.title} className="main-img" />
            </div>

            {allImages.length > 1 && (
              <div className="thumbnails-row">
                {allImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumb-box ${activeImage === img ? 'active' : ''}`}
                    onClick={() => {
                      setActiveImage(img);
                      if (localOptions[index]) setSelectedOption(localOptions[index]);
                    }}
                  >
                    <img src={img} alt={`thumb-${index}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="info-column">
            <span className="category-tag">
              {(product.category || product.categorias?.nome || 'PRODUTO').toUpperCase()}
            </span>
            
            <h2 className="product-title">{product.title}</h2>
            
            <div className="product-price">
              R$ {Number(product.price).toFixed(2)}
            </div>

            <div className="product-description">
              <p>{product.description || "Sem descrição disponível."}</p>
            </div>

            {localOptions.length > 0 && (
              <div className="options-selector">
                <label>Escolha a opção:</label>
                <div className="options-grid">
                  {localOptions.map((option) => (
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