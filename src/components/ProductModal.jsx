import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify'; 
import imageCompression from 'browser-image-compression'; 
import './ProductModal.css';

const LinkIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>);
const CartIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>);
const CameraIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>);

const StarRating = ({ rating, setRating, editable = false, size = "normal" }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${star <= rating ? 'filled' : ''} ${editable ? 'editable' : ''} ${size === 'large' ? 'star-large' : ''}`} onClick={() => editable && setRating(star)}>
          ★
        </span>
      ))}
    </div>
  );
};

export default function ProductModal({ isOpen, product, onClose, onAddToCart }) {
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ nome: '', nota: 5, texto: '', imagem_url: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'; 
    else document.body.style.overflow = ''; 
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.imagem_url);
      setQuantity(1); setSelectedOption(null); setShowReviewForm(false);
      fetchReviews(product.id);
    }
  }, [product]);

  const fetchReviews = async (productId) => {
    const { data, error } = await supabase.from('avaliacoes').select('*').eq('produto_id', productId).order('created_at', { ascending: false });
    if (!error) setReviews(data || []);
  };

  const handleReviewImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingImage(true);
      toast.info("Otimizando foto...", { theme: "dark", autoClose: 2000 });

      const options = { maxSizeMB: 0.3, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `review_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('imagens-produtos').upload(fileName, compressedFile);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('imagens-produtos').getPublicUrl(fileName);
      setNewReview(prev => ({ ...prev, imagem_url: data.publicUrl }));
      toast.success("Foto anexada com sucesso!", { theme: "dark" });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao subir imagem.", { theme: "dark" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.nome || !newReview.texto) {
        return toast.warning("Preencha seu nome e o que achou do produto!", { theme: "dark" });
    }

    const payload = { produto_id: product.id, nome_usuario: newReview.nome, nota: newReview.nota, comentario: newReview.texto, imagem_url: newReview.imagem_url };
    const { error } = await supabase.from('avaliacoes').insert([payload]);

    if (error) {
        toast.error("Erro ao enviar avaliação. Tente novamente.", { theme: "dark" });
    } else {
        setReviews([payload, ...reviews]);
        setShowReviewForm(false); 
        setNewReview({ nome: '', nota: 5, texto: '', imagem_url: '' });
        toast.success("Obrigado pela sua avaliação!", { theme: "dark" });
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?p=${product.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link do produto copiado com sucesso!", { theme: "dark" });
  };

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => { if (e.target.className === 'modal-overlay') onClose(); };

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
  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, rev) => acc + rev.nota, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      
      {overflowReviews.length > 0 && !showReviewForm && (
        <div className="overflow-reviews-container">
          <div className="marquee-track">
            {infiniteMarqueeItems.map((rev, idx) => (
              <div key={`overflow-${idx}`} className="overflow-review-item">
                <span className="fw-bold text-white me-2" style={{fontSize: '0.8rem', whiteSpace: 'nowrap'}}>
                  {rev.nome_usuario} 
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
        {!showReviewForm && <button className="close-modal-btn" onClick={onClose}>&times;</button>}

        {showReviewForm && (
            <div className="write-review-screen animate-slide-up">
                <div className="write-review-header d-flex justify-content-between align-items-center">
                    <button className="btn btn-sm btn-outline-light border-0" onClick={() => setShowReviewForm(false)}>← Voltar</button>
                    <h5 className="m-0 text-white fw-bold">Avaliar Produto</h5>
                    <div style={{width: '60px'}}></div> 
                </div>

                <div className="write-review-body">
                    <div className="d-flex align-items-center gap-3 p-3 rounded-3 mb-4" style={{background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.05)'}}>
                        <img src={product.imagem_url} alt={product.nome} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 8}} />
                        <div>
                            <p className="text-secondary small m-0 mb-1 fw-bold text-uppercase">Como estava o produto?</p>
                            <h6 className="text-white m-0 fw-bold">{product.nome}</h6>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitReview}>
                        <div className="mb-4 text-center py-3">
                            <p className="text-white fw-bold mb-2">Sua nota geral</p>
                            <div className="d-flex justify-content-center">
                                <StarRating rating={newReview.nota} setRating={(n) => setNewReview({...newReview, nota: n})} editable={true} size="large" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="text-secondary small fw-bold mb-2 d-block">Seu Nome ou Apelido</label>
                            <input type="text" placeholder="Ex: Matheus" required className="form-control bg-dark text-white border-secondary p-3" value={newReview.nome} onChange={e => setNewReview({...newReview, nome: e.target.value})} />
                        </div>

                        <div className="mb-4">
                            <label className="text-secondary small fw-bold mb-2 d-block">Compartilhe uma foto (Opcional)</label>
                            <div className="review-image-upload-box">
                                {newReview.imagem_url ? (
                                    <div className="position-relative w-100 text-center">
                                        <img src={newReview.imagem_url} alt="Sua foto" className="review-image-preview" />
                                        <button type="button" className="btn btn-sm btn-danger position-absolute" style={{top: '-10px', right: '0px', borderRadius: '50%', width: '30px', height: '30px', padding: 0}} onClick={() => setNewReview({...newReview, imagem_url: ''})}>X</button>
                                    </div>
                                ) : (
                                    <>
                                        <input type="file" accept="image/*" onChange={handleReviewImageUpload} disabled={uploadingImage} />
                                        <div className="text-secondary fw-bold d-flex align-items-center justify-content-center">
                                            {uploadingImage ? 'Aguarde...' : <><CameraIcon /> <span className="ms-2">Clique para enviar foto</span></>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="text-secondary small fw-bold mb-2 d-block d-flex justify-content-between">
                                <span>Escreva sua avaliação</span><span>(obrigatório)</span>
                            </label>
                            <textarea placeholder="O que os outros clientes precisam saber?" required className="form-control bg-dark text-white border-secondary p-3" rows="4" value={newReview.texto} onChange={e => setNewReview({...newReview, texto: e.target.value})}></textarea>
                        </div>
                        
                        <button type="submit" className="btn btn-warning w-100 fw-bold py-3 fs-5 mt-auto" disabled={uploadingImage}>Enviar Avaliação</button>
                    </form>
                </div>
            </div>
        )}

        <div className="product-layout" style={{ display: showReviewForm ? 'none' : 'flex' }}>
          
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
                <button onClick={handleCopyLink} className="btn btn-sm btn-outline-light d-flex align-items-center justify-content-center" style={{ whiteSpace: 'nowrap', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', padding: '5px 10px' }} title="Copiar link direto do produto">
                    <LinkIcon /> <span className="ms-1">Link</span>
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
                            <button key={idx} className={`option-btn ${selectedOption === opt ? 'selected' : ''}`} onClick={() => setSelectedOption(opt)}>{opt}</button>
                        ))}
                    </div>
                </div>
            )}

            <div className="reviews-section">
                <div className="reviews-header">
                    <h5 className="m-0 text-white" style={{fontSize: '1rem'}}>Avaliações ({reviews.length})</h5>
                    <button className="btn-write-review" onClick={() => setShowReviewForm(true)}>+ Avaliar</button>
                </div>

                <div className="reviews-list">
                    {visibleReviews.length === 0 ? (
                        <p className="text-secondary small mt-2">Ninguém avaliou ainda. Seja o primeiro!</p>
                    ) : (
                        visibleReviews.map((rev, idx) => (
                            <div key={idx} className="review-item">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 'bold' }}>
                                        {(rev.nome_usuario || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="fw-bold text-white small" style={{lineHeight: 1}}>{rev.nome_usuario || 'Cliente Anônimo'}</div>
                                        <StarRating rating={rev.nota} />
                                    </div>
                                </div>
                                <p className="text-secondary small m-0 pt-1" style={{borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                                    {rev.comentario || 'Nenhum comentário informado.'}
                                </p>
                                {rev.imagem_url && (
                                    <div className="mt-2"><img src={rev.imagem_url} alt="Foto do Cliente" className="customer-review-photo" /></div>
                                )}
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
                CARRINHO <CartIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}