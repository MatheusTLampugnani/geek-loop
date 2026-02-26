import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify'; 
import './ProductModal.css';

const StarRating = ({ rating, setRating, editable = false }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''} ${editable ? 'editable' : ''}`}
          onClick={() => editable && setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const maskName = (name) => {
  if (!name) return '';
  const str = name.trim();
  if (str.length <= 2) return str; 
  const asteriscos = '*'.repeat(str.length - 2);
  return `${str.charAt(0)}${asteriscos}${str.charAt(str.length - 1)}`;
};

export default function ProductModal({ isOpen, product, onClose, onAddToCart }) {
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ nome: '', nota: 5, texto: '' });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.imagem_url);
      setQuantity(1);
      setSelectedOption(null);
      setShowReviewForm(false);
      fetchReviews(product.id);
    }
  }, [product]);

  const fetchReviews = async (productId) => {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .eq('produto_id', productId)
      .order('created_at', { ascending: false });
    
    if (!error) setReviews(data || []);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.nome || !newReview.texto) {
        return toast.warning("Preencha seu nome e o que achou do produto!", { theme: "dark" });
    }

    const payload = {
        produto_id: product.id,
        nome_usuario: newReview.nome,
        nota: newReview.nota,
        comentario: newReview.texto
    };

    const { error } = await supabase.from('avaliacoes').insert([payload]);

    if (error) {
        toast.error("Erro ao enviar avaliação. Tente novamente.", { theme: "dark" });
    } else {
        setReviews([payload, ...reviews]);
        setShowReviewForm(false);
        setNewReview({ nome: '', nota: 5, texto: '' });
        toast.success("Obrigado pela sua avaliação! 🚀", { theme: "dark" });
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?p=${product.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link do produto copiado com sucesso! 🔗", { theme: "dark" });
  };

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-overlay') onClose();
  };

  const handleAddToCartClick = () => {
    let parsedOptions = [];
    if (Array.isArray(product.opcoes)) parsedOptions = product.opcoes;
    else if (typeof product.opcoes === 'string' && product.opcoes.includes(',')) parsedOptions = product.opcoes.split(',');

    if (parsedOptions.length > 0 && !selectedOption) {
        toast.warning("Por favor, selecione uma opção (cor/modelo) antes de adicionar!", { theme: "dark" }); 
        return;
    }
    onAddToCart({ ...product, quantity, selectedOption });
    onClose();
  };

  let parsedOptions = [];
  if (Array.isArray(product.opcoes)) parsedOptions = product.opcoes;
  else if (typeof product.opcoes === 'string' && product.opcoes.includes(',')) parsedOptions = product.opcoes.split(',');

  const visibleReviews = reviews.slice(0, 2);
  const overflowReviews = reviews.slice(2);
  const infiniteMarqueeItems = [...overflowReviews, ...overflowReviews, ...overflowReviews];

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.nota, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      
      {overflowReviews.length > 0 && (
        <div className="overflow-reviews-container">
          <div className="marquee-track">
            {infiniteMarqueeItems.map((rev, idx) => (
              <div key={`overflow-${idx}`} className="overflow-review-item">
                <span className="fw-bold text-white me-2" style={{fontSize: '0.8rem', whiteSpace: 'nowrap'}}>
                  {maskName(rev.nome_usuario)}
                </span>
                <StarRating rating={rev.nota} />
                <span className="ms-2 text-secondary text-truncate" style={{maxWidth: '180px', fontSize: '0.8rem'}}>
                  - {rev.comentario}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="modal-content animate-pop">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        
        <div className="product-layout">
          <div className="image-section">
            <img src={activeImage} alt={product.nome} className="main-image" />
            <div className="gallery-thumbs">
              <img src={product.imagem_url} className={`thumb ${activeImage === product.imagem_url ? 'active' : ''}`} onClick={() => setActiveImage(product.imagem_url)} />
              {product.imagem_url_2 && <img src={product.imagem_url_2} className={`thumb ${activeImage === product.imagem_url_2 ? 'active' : ''}`} onClick={() => setActiveImage(product.imagem_url_2)} />}
              {product.imagem_url_3 && <img src={product.imagem_url_3} className={`thumb ${activeImage === product.imagem_url_3 ? 'active' : ''}`} onClick={() => setActiveImage(product.imagem_url_3)} />}
            </div>
          </div>

          <div className="info-section">
            {product.badge && <span className="product-badge">{product.badge}</span>}
            
            <div className="d-flex justify-content-between align-items-start gap-2" style={{marginBottom: reviews.length > 0 ? '5px' : '15px'}}>
                <h2 className="product-title m-0">{product.nome}</h2>
                <button 
                    onClick={handleCopyLink} 
                    className="btn btn-sm btn-outline-light d-flex align-items-center justify-content-center"
                    style={{ whiteSpace: 'nowrap', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 10px' }}
                    title="Copiar link direto do produto"
                >
                    🔗 Link
                </button>
            </div>
            
            {reviews.length > 0 && (
                <div className="d-flex align-items-center gap-2 mb-3">
                    <StarRating rating={Math.round(averageRating)} />
                    <span className="text-warning fw-bold" style={{fontSize: '0.9rem'}}>{averageRating}</span>
                    <span className="text-secondary small">({reviews.length} avaliações)</span>
                </div>
            )}
            
            <div className="product-price">
              {product.preco_antigo > 0 && <span className="old-price">R$ {Number(product.preco_antigo).toFixed(2)}</span>}
              R$ {Number(product.preco).toFixed(2)}
            </div>

            <p className="product-description">{product.descricao}</p>

            {parsedOptions.length > 0 && (
                <div className="options-container">
                    <p className="options-label">Escolha uma opção:</p>
                    <div className="options-grid">
                        {parsedOptions.map((opt, idx) => (
                            <button key={idx} className={`option-btn ${selectedOption === opt ? 'selected' : ''}`} onClick={() => setSelectedOption(opt)}>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="reviews-section" style={{ position: 'relative', minHeight: showReviewForm ? '280px' : 'auto' }}>
                <div className="reviews-header">
                    <h5 className="m-0 text-white" style={{fontSize: '1rem'}}>
                      Avaliações ({reviews.length})
                    </h5>
                    <button className="btn-write-review" onClick={() => setShowReviewForm(!showReviewForm)}>
                        {showReviewForm ? 'Fechar' : '+ Avaliar'}
                    </button>
                </div>

                {showReviewForm && (
                    <div className="review-form-overlay">
                        <form className="review-form" onSubmit={handleSubmitReview}>
                            <input 
                                type="text" placeholder="Seu Nome" required
                                className="form-control mb-2 bg-dark text-white border-secondary"
                                value={newReview.nome} onChange={e => setNewReview({...newReview, nome: e.target.value})}
                            />
                            <div className="mb-2 d-flex align-items-center gap-2">
                                <span className="text-secondary small">Sua nota:</span>
                                <StarRating rating={newReview.nota} setRating={(n) => setNewReview({...newReview, nota: n})} editable={true} />
                            </div>
                            <textarea 
                                placeholder="O que achou do produto?" required
                                className="form-control mb-3 bg-dark text-white border-secondary" rows="2"
                                value={newReview.texto} onChange={e => setNewReview({...newReview, texto: e.target.value})}
                            ></textarea>
                            <button type="submit" className="btn btn-sm btn-success w-100 fw-bold py-2">Enviar</button>
                        </form>
                    </div>
                )}

                <div className="reviews-list">
                    {visibleReviews.length === 0 ? (
                        <p className="text-secondary small mt-2">Ninguém avaliou ainda. Seja o primeiro!</p>
                    ) : (
                        visibleReviews.map((rev, idx) => (
                            <div key={idx} className="review-item">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="fw-bold text-white small">
                                      {maskName(rev.nome_usuario)}
                                    </span>
                                    <StarRating rating={rev.nota} />
                                </div>
                                <p className="text-secondary small m-0">{rev.comentario}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="actions">
              <div className="qty-selector">
                <button className="qty-btn" onClick={() => setQuantity(q => (q > 1 ? q - 1 : 1))}>-</button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
              <button className="add-cart-btn" onClick={handleAddToCartClick}>
                CARRINHO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}