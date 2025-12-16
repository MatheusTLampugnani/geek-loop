import React, { useState, useEffect } from 'react';

export function ProductModal({ product, onClose }) {
  const [activeImage, setActiveImage] = useState(product.imagem_url);

  useEffect(() => {
    if (product) {
      setActiveImage(product.imagem_url);
    }
  }, [product]);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-geek" onClick={e => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose}>&times;</button>
        <div className="modal-body-content row">
          <div className="col-md-7 mb-3 mb-md-0">
            <div className="main-image-container mb-3 rounded-3 overflow-hidden border border-secondary border-opacity-25 bg-dark">
               <img 
                 src={activeImage} 
                 alt={product.nome} 
                 className="img-fluid w-100" 
                 style={{ objectFit: 'contain', maxHeight: '400px', minHeight: '300px' }}
               />
            </div>

            {(product.imagem_url_2 || product.imagem_url_3) && (
              <div className="d-flex gap-2 justify-content-center">
                 <img 
                   src={product.imagem_url} 
                   onClick={() => setActiveImage(product.imagem_url)}
                   className={`rounded-2 cursor-pointer border ${activeImage === product.imagem_url ? 'border-warning' : 'border-secondary'}`} 
                   style={{width: '70px', height: '70px', objectFit: 'cover'}} 
                 />
                 
                 {product.imagem_url_2 && (
                   <img 
                     src={product.imagem_url_2} 
                     onClick={() => setActiveImage(product.imagem_url_2)}
                     className={`rounded-2 cursor-pointer border ${activeImage === product.imagem_url_2 ? 'border-warning' : 'border-secondary'}`} 
                     style={{width: '70px', height: '70px', objectFit: 'cover'}} 
                   />
                 )}
                 
                 {product.imagem_url_3 && (
                   <img 
                     src={product.imagem_url_3} 
                     onClick={() => setActiveImage(product.imagem_url_3)}
                     className={`rounded-2 cursor-pointer border ${activeImage === product.imagem_url_3 ? 'border-warning' : 'border-secondary'}`} 
                     style={{width: '70px', height: '70px', objectFit: 'cover'}} 
                   />
                 )}
              </div>
            )}
          </div>

          <div className="col-md-5 text-white d-flex flex-column">
             <span className="badge-category mb-2 align-self-start">{product.category || 'Geral'}</span>
             <h3 className="fw-bold mb-3">{product.nome}</h3>
             
             <div className="price-tag mb-4">
                <span className="fs-2 fw-bold text-warning">R$ {Number(product.preco).toFixed(2)}</span>
                <div className="text-secondary small">em até 10x sem juros</div>
             </div>

             <p className="text-gray-300 mb-4" style={{lineHeight: '1.6'}}>
               {product.especificacao || "Produto original Geek Loop com garantia de qualidade e performance."}
             </p>

             <div className="mt-auto">
                <button className="btn-neon w-100 py-3 fw-bold">
                  ADICIONAR AO CARRINHO
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}