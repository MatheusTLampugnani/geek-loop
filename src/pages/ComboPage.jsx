import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Combo.css';

export function ComboBuilderPage() {
  const [teclados, setTeclados] = useState([]);
  const [mouses, setMouses] = useState([]);
  const [headsets, setHeadsets] = useState([]);
  
  const [selectedTeclado, setSelectedTeclado] = useState(null);
  const [selectedMouse, setSelectedMouse] = useState(null);
  const [selectedHeadset, setSelectedHeadset] = useState(null);
  
  const [discountPercent, setDiscountPercent] = useState(10);
  const [loading, setLoading] = useState(true);

  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchComboData();
  }, []);

  async function fetchComboData() {
    setLoading(true);
    try {
      const { data: configData } = await supabase.from('configuracoes').select('desconto_combo').eq('id', 1).single();
      if (configData && configData.desconto_combo) {
          setDiscountPercent(configData.desconto_combo);
      }

      const { data: prodData, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .in('id_categoria', [2, 3, 4]);

      if (error) throw error;

      if (prodData) {
        const BUCKET_NAME = 'imagens-produtos';
        const getFullUrl = (imgName) => {
          if (!imgName) return null;
          if (imgName.startsWith('http')) return imgName;
          const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(imgName);
          return data.publicUrl;
        };

        const formattedData = prodData.map(item => ({
            ...item,
            imagem_url: getFullUrl(item.imagem_url)
        }));

        setMouses(formattedData.filter(p => p.id_categoria === 2));
        setTeclados(formattedData.filter(p => p.id_categoria === 3));
        setHeadsets(formattedData.filter(p => p.id_categoria === 4));
      }
    } catch (err) {
      console.error("Erro ao carregar itens do combo:", err);
      toast.error("Erro ao carregar os produtos.", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  }

  const subtotal = (selectedTeclado?.preco || 0) + (selectedMouse?.preco || 0) + (selectedHeadset?.preco || 0);
  const isComplete = selectedTeclado && selectedMouse && selectedHeadset;
  const totalWithDiscount = isComplete ? subtotal * (1 - discountPercent / 100) : subtotal;
  const economia = subtotal - totalWithDiscount;

  const handleAddToCart = () => {
    if (!isComplete) {
        toast.warning("Selecione os 3 itens para montar o combo!", { theme: "dark" });
        return;
    }

    const comboItem = {
        id: `combo-${Date.now()}`,
        nome: `Kit Gamer (${selectedTeclado.nome} + ${selectedMouse.nome} + ${selectedHeadset.nome})`,
        preco: totalWithDiscount,
        imagem_url: selectedTeclado.imagem_url,
        quantity: 1,
        categoria: 'Combo Customizado'
    };

    addToCart(comboItem);
    toast.success("Combo adicionado ao carrinho! 🛒", { theme: "dark" });
    setIsCartOpen(true);
    navigate('/');
  };

  const ComboCard = ({ product, type, selectedItem, onSelect }) => {
    const isSelected = selectedItem?.id === product.id;
    return (
      <div className="col-6 col-md-4 mb-4">
        <div className={`combo-product-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(product)}>
          <div className="combo-img-wrapper">
             <img src={product.imagem_url} alt={product.nome} />
          </div>
          <div className="combo-card-body">
             <span className="combo-card-category">{type}</span>
             <h6 className="combo-card-title text-truncate">{product.nome}</h6>
             <div className="combo-card-price">R$ {product.preco.toFixed(2)}</div>
             <button className={`btn-select-combo mt-2 ${isSelected ? 'selected' : ''}`}>
                 {isSelected ? 'SELECIONADO ✓' : 'ESCOLHER'}
             </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
      return <div className="text-center text-white mt-5 pt-5 fw-bold fs-4">Carregando equipamentos... ⚡</div>;
  }

  return (
    <div className="combo-builder-container rounded-4 mt-3">
      <div className="container px-4">
        <div className="text-center mb-5">
            <h1 className="fw-bold text-white mb-2" style={{fontSize: '2.5rem'}}>Monte seu <span style={{color: 'var(--neon-primary)'}}>Combo Gamer</span></h1>
            <p className="text-secondary fs-5">Selecione 1 Teclado, 1 Mouse e 1 Headset para desbloquear <b>{discountPercent}% de desconto</b> no kit!</p>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <h4 className="combo-section-title">1. Escolha seu Teclado</h4>
            <div className="row g-3 mb-5">
               {teclados.map(p => <ComboCard key={p.id} product={p} type="Teclado" selectedItem={selectedTeclado} onSelect={setSelectedTeclado} />)}
            </div>

            <h4 className="combo-section-title">2. Escolha seu Mouse</h4>
            <div className="row g-3 mb-5">
               {mouses.map(p => <ComboCard key={p.id} product={p} type="Mouse" selectedItem={selectedMouse} onSelect={setSelectedMouse} />)}
            </div>

            <h4 className="combo-section-title">3. Escolha seu Headset</h4>
            <div className="row g-3 mb-5">
               {headsets.map(p => <ComboCard key={p.id} product={p} type="Áudio" selectedItem={selectedHeadset} onSelect={setSelectedHeadset} />)}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="combo-summary-col">
              <div className="combo-summary-card">
                 <h4 className="combo-summary-title">Seu Setup</h4>
                 
                 <ul className="combo-items-list">
                    <li className="combo-item-entry">
                        <span className="label">Teclado:</span>
                        <span className="value text-truncate ms-3" style={{maxWidth: '150px'}}>{selectedTeclado ? selectedTeclado.nome : 'Pendente...'}</span>
                    </li>
                    <li className="combo-item-entry">
                        <span className="label">Mouse:</span>
                        <span className="value text-truncate ms-3" style={{maxWidth: '150px'}}>{selectedMouse ? selectedMouse.nome : 'Pendente...'}</span>
                    </li>
                    <li className="combo-item-entry">
                        <span className="label">Headset:</span>
                        <span className="value text-truncate ms-3" style={{maxWidth: '150px'}}>{selectedHeadset ? selectedHeadset.nome : 'Pendente...'}</span>
                    </li>
                 </ul>

                 <div className="border-top border-secondary pt-3 mb-3">
                     <div className="d-flex justify-content-between text-secondary mb-2">
                         <span>Subtotal:</span>
                         <span>R$ {subtotal.toFixed(2)}</span>
                     </div>
                     {isComplete && (
                         <div className="d-flex justify-content-between mb-2" style={{color: '#00e676'}}>
                             <span>Desconto Combo ({discountPercent}%):</span>
                             <span>- R$ {economia.toFixed(2)}</span>
                         </div>
                     )}
                 </div>

                 <div className="combo-total-price">
                     R$ {totalWithDiscount.toFixed(2)}
                 </div>

                 <button 
                    className="btn-checkout-combo d-flex align-items-center justify-content-center gap-2" 
                    onClick={handleAddToCart}
                    disabled={!isComplete}
                 >
                    {isComplete ? 'ADICIONAR AO CARRINHO' : `FALTA ${(!selectedTeclado ? 1 : 0) + (!selectedMouse ? 1 : 0) + (!selectedHeadset ? 1 : 0)} ITEM(S)`}
                 </button>
                 
                 {!isComplete && (
                     <p className="text-center text-secondary small mt-3 m-0">Preencha todos os passos para liberar o botão.</p>
                 )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}