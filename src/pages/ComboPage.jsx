import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; 
import './Combo.css';

export const ComboBuilderPage = () => {
  const { addToCart, setIsCartOpen } = useCart(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [allProducts, setAllProducts] = useState([]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selection, setSelection] = useState({
    keyboard: null,
    mouse: null,
    headset: null
  });

  const CATEGORY_IDS = {
    KEYBOARD: 3,
    MOUSE: 2,
    HEADSET: 4
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true)
      .in('id_categoria', [CATEGORY_IDS.KEYBOARD, CATEGORY_IDS.MOUSE, CATEGORY_IDS.HEADSET]);

    if (!error && data) {
        const formatted = data.map(p => ({
            ...p,
            price: p.preco,
            title: p.nome,
            image: p.imagem_url && p.imagem_url.startsWith('http') 
                ? p.imagem_url 
                : null 
        }));
        setAllProducts(formatted);
    }
    setLoading(false);
  };

  const getProductsByCategory = (catId) => allProducts.filter(p => p.id_categoria === catId);
  
  const handleSelect = (product, type) => {
    setSelection({ ...selection, [type]: product });
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalize = () => {
    const applyDiscount = (item) => ({
        ...item,
        quantity: 1,
        price: item.price * 0.9, 
        combo: true 
    });

    if (selection.keyboard) addToCart(applyDiscount(selection.keyboard));
    if (selection.mouse) addToCart(applyDiscount(selection.mouse));
    if (selection.headset) addToCart(applyDiscount(selection.headset));
    
    setIsCartOpen(true); 
    navigate('/'); 
  };

  const subtotal = (selection.keyboard?.price || 0) + (selection.mouse?.price || 0) + (selection.headset?.price || 0);
  const discount = subtotal * 0.10; 
  const total = subtotal - discount;

  if (loading) return <div className="text-white text-center p-5">Carregando montador...</div>;

  return (
    <div className="combo-container">
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{color: 'white', fontWeight: 'bold'}}>Monte seu <span style={{color: 'var(--neon-primary)'}}>Combo Gamer</span></h1>
        <p style={{color: '#aaa'}}>Escolha seus periféricos e ganhe 10% de desconto no kit completo!</p>
      </div>

      <div className="steps-indicator">
        <div className={`step-pill ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>1. Teclado</div>
        <div className={`step-pill ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>2. Mouse</div>
        <div className={`step-pill ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>3. Headset</div>
        <div className={`step-pill ${currentStep === 4 ? 'active' : ''}`}>4. Resumo</div>
      </div>

      {currentStep === 1 && (
        <div className="selection-grid fade-in">
          {getProductsByCategory(CATEGORY_IDS.KEYBOARD).map(p => (
            <div key={p.id} className="combo-item-card" onClick={() => handleSelect(p, 'keyboard')}>
              <img src={p.image || 'https://via.placeholder.com/150'} alt={p.nome} />
              <div className="info">
                <h5 style={{fontSize: '0.9rem', marginBottom: 5}}>{p.nome}</h5>
                <span style={{color: 'var(--neon-primary)', fontWeight: 'bold'}}>R$ {p.price}</span>
                <button className="select-btn">Selecionar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <div className="selection-grid fade-in">
          {getProductsByCategory(CATEGORY_IDS.MOUSE).map(p => (
            <div key={p.id} className="combo-item-card" onClick={() => handleSelect(p, 'mouse')}>
              <img src={p.image || 'https://via.placeholder.com/150'} alt={p.nome} />
              <div className="info">
                <h5 style={{fontSize: '0.9rem', marginBottom: 5}}>{p.nome}</h5>
                <span style={{color: 'var(--neon-primary)', fontWeight: 'bold'}}>R$ {p.price}</span>
                <button className="select-btn">Selecionar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentStep === 3 && (
        <div className="selection-grid fade-in">
          {getProductsByCategory(CATEGORY_IDS.HEADSET).map(p => (
            <div key={p.id} className="combo-item-card" onClick={() => handleSelect(p, 'headset')}>
              <img src={p.image || 'https://via.placeholder.com/150'} alt={p.nome} />
              <div className="info">
                <h5 style={{fontSize: '0.9rem', marginBottom: 5}}>{p.nome}</h5>
                <span style={{color: 'var(--neon-primary)', fontWeight: 'bold'}}>R$ {p.price}</span>
                <button className="select-btn">Selecionar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentStep === 4 && (
        <div className="summary-box fade-in">
           <h2>Seu Combo Supremo</h2>
           
           <div className="selected-items-list">
              <div className="mini-card">
                 <img src={selection.keyboard?.image} style={{width:'100%', height: 60, objectFit:'contain'}} alt="Teclado" />
                 <p style={{fontSize:'0.7rem', margin: '5px 0'}}>Teclado</p>
              </div>
              <div className="mini-card">
                 <img src={selection.mouse?.image} style={{width:'100%', height: 60, objectFit:'contain'}} alt="Mouse" />
                 <p style={{fontSize:'0.7rem', margin: '5px 0'}}>Mouse</p>
              </div>
              <div className="mini-card">
                 <img src={selection.headset?.image} style={{width:'100%', height: 60, objectFit:'contain'}} alt="Fone" />
                 <p style={{fontSize:'0.7rem', margin: '5px 0'}}>Headset</p>
              </div>
           </div>

           <div className="total-price-box">
             <div style={{fontSize: '1rem', color: '#888', textDecoration: 'line-through'}}>De: R$ {subtotal.toFixed(2)}</div>
             <div style={{color: 'white', fontWeight: 'bold'}}>
               Por: <span style={{color: 'var(--neon-primary)'}}>R$ {total.toFixed(2)}</span>
               <span className="discount-tag">-10% OFF</span>
             </div>
           </div>

           <div style={{display: 'flex', gap: 10, justifyContent: 'center'}}>
             <button 
               onClick={() => {setSelection({keyboard:null, mouse:null, headset:null}); setCurrentStep(1);}} 
               style={{padding: '12px 20px', background: '#333', color:'white', border:'none', borderRadius: 8, cursor:'pointer'}}
             >
               Refazer
             </button>
             <button 
               className="btn-neon" 
               style={{padding: '12px 40px', fontSize: '1.1rem'}}
               onClick={handleFinalize}
             >
               COMPRAR COMBO AGORA 🛒
             </button>
           </div>
        </div>
      )}

      {currentStep > 1 && currentStep < 4 && (
         <div style={{textAlign: 'center', marginTop: 30}}>
            <button onClick={() => setCurrentStep(prev => prev - 1)} style={{background: 'none', border:'none', color: '#888', textDecoration: 'underline', cursor: 'pointer'}}>
               ← Voltar passo anterior
            </button>
         </div>
      )}
    </div>
  );
};