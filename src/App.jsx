import React, { useState } from "react";
import './App.css';
import { CartProvider, useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';

const CATEGORIES = [
  { id: 'controls', name: 'Controles', icon: '🎮' },
  { id: 'headphones', name: 'Áudio', icon: '🎧' },
  { id: 'keyboards', name: 'Teclados', icon: '⌨️' },
  { id: 'mice', name: 'Mouses', icon: '🖱️' },
  { id: 'smartwatches', name: 'Wearables', icon: '⌚' },
  { id: 'figures', name: 'Colecionáveis', icon: '🦸' },
  { id: 'plants', name: 'Decoração', icon: '🪴' },
  { id: 'accessories', name: 'Acessórios', icon: '🔌' },
];

const PRODUCTS = [
  { 
    id: 1, 
    nome: 'Controle Wireless X1', 
    category: 'Controles', 
    price: 179.90, 
    preco: 179.90,
    badge: 'Mais vendido', 
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    imagem_url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=500",
    descricao: "Controle ergonômico com resposta tátil e bateria de longa duração.",
    opcoes: ["Preto Fosco", "Branco Gelo"]
  },
  { 
    id: 2, 
    nome: 'Fone Bluetooth AirTone', 
    category: 'Áudio', 
    price: 249.90,
    preco: 249.90,
    badge: 'Novo', 
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    imagem_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500",
    descricao: "Som de alta fidelidade com cancelamento de ruído ativo.",
    opcoes: []
  },
  { 
    id: 3, 
    nome: 'Teclado Mecânico Pro', 
    category: 'Teclados', 
    price: 349.90,
    preco: 349.90,
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    imagem_url: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=500",
    descricao: "Switches mecânicos Blue para máxima precisão e durabilidade.",
    opcoes: ["Switch Blue", "Switch Red", "Switch Brown"]
  },
  { 
    id: 4, 
    nome: 'Mouse Gamer Viper', 
    category: 'Mouses', 
    price: 129.90,
    preco: 129.90,
    badge: 'Promo', 
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    imagem_url: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=500",
    descricao: "Sensor óptico de 16000 DPI e design ultraleve.",
    opcoes: ["Preto", "Branco"]
  },
  { 
    id: 5, 
    nome: 'Smartwatch Pulse S3', 
    category: 'Wearables', 
    price: 399.90,
    preco: 399.90,
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
    imagem_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500",
    descricao: "Monitore saúde, sono e notificações direto no pulso.",
    opcoes: ["Pulseira Sport", "Pulseira Couro"]
  },
  { 
    id: 6, 
    nome: 'Estátua Hero Collector', 
    category: 'Colecionáveis', 
    price: 219.90,
    preco: 219.90,
    gradient: 'linear-gradient(135deg, #eab308, #d97706)',
    imagem_url: "https://images.unsplash.com/photo-1566576912904-600175811125?auto=format&fit=crop&q=80&w=500",
    descricao: "Figura de ação rica em detalhes, edição limitada.",
    opcoes: []
  },
];

function IconCart() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

function ProductImage({ src, gradient, alt }) {
  if (src) {
    return <img src={src} alt={alt} className="card-img-hover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
  }
  return (
    <div className="card-img-hover d-flex align-items-center justify-content-center text-center p-4" 
         style={{ background: gradient || '#333', width: '100%', height: '100%' }}>
      <div>
        <span className="text-white fw-bold fs-5 drop-shadow">{alt}</span>
      </div>
    </div>
  );
}

function StoreContent() {
  const { setIsCartOpen, totalItems } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg fixed-top navbar-glass py-3">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold fs-4" href="#">
            <div className="p-1 rounded d-flex align-items-center justify-content-center" style={{background: 'var(--neon-primary)', width: 32, height: 32}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            Geek Loop <span style={{color: 'var(--neon-primary)'}}>Store</span>
          </a>
          
          <div className="d-none d-md-flex gap-4 ms-auto me-4">
            <a href="#home" className="text-decoration-none text-light opacity-75 hover-opacity-100">Início</a>
            <a href="#categories" className="text-decoration-none text-light opacity-75 hover-opacity-100">Categorias</a>
            <a href="#products" className="text-decoration-none text-light opacity-75 hover-opacity-100">Produtos</a>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn-neon btn-pulse d-flex align-items-center gap-2"
              onClick={() => setIsCartOpen(true)}
            >
              <IconCart />
              <span>{totalItems}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container pt-5 mt-5 pb-5">
        
        <section id="categories" className="mb-5 py-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <h3 className="fw-bold text-white mb-0">Navegue por Categorias</h3>
            <div style={{height: '4px', width: '60px', background: 'var(--neon-primary)', borderRadius: '2px'}}></div>
          </div>
          
          <div className="horizontal-scroll px-1">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="category-pill">
                <span className="icon">{cat.icon}</span>
                <span className="text">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="products" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold text-white mb-0">Em Destaque</h3>
            <a href="#" className="text-decoration-none fw-bold" style={{color: 'var(--neon-primary)'}}>Ver tudo →</a>
          </div>

          <div className="row g-2 g-md-4">
            {PRODUCTS.map(p => (
              <div key={p.id} className="col-6 col-md-4 col-lg-3">
                <div 
                  className="card-geek h-100 d-flex flex-column cursor-pointer"
                  onClick={() => setSelectedProduct(p)}
                >
                  <div className="card-img-wrapper position-relative">
                    <ProductImage src={p.imagem_url} gradient={p.gradient} alt={p.nome} />
                    {p.badge && (
                      <span className="position-absolute top-0 start-0 m-2 m-md-3 badge bg-white text-dark shadow-sm" style={{fontSize: '0.7rem'}}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-3 p-md-4 d-flex flex-column flex-grow-1">
                    <span className="badge-category align-self-start mb-1 mb-md-2" style={{fontSize: '0.65rem'}}>{p.category}</span>
                    <h5 className="fw-bold text-white mb-1 text-truncate" style={{fontSize: '1rem'}}>{p.nome}</h5>
                    
                    <div className="mt-auto pt-2 pt-md-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-top border-secondary border-opacity-25">
                      <div className="mb-1 mb-md-0">
                        <div className="fs-6 fs-md-5 fw-bold text-white">R$ {p.price.toFixed(2)}</div>
                        <div className="small text-muted" style={{fontSize: '0.7rem'}}>10x s/ juros</div>
                      </div>
                      <button className="btn btn-sm btn-outline-light rounded-circle p-2 border-0 bg-dark text-white align-self-end align-self-md-center">
                         <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="promotions" className="mb-5">
          <div className="promo-card rounded-4 overflow-hidden position-relative">
            <div className="row g-0">
              <div className="col-lg-6 p-4 p-md-5 position-relative z-1 d-flex flex-column justify-content-center">
                <span className="promo-tag">Oferta Relâmpago</span>
                <h2 className="promo-title">Combo Gamer<br />Pro</h2>
                <p className="text-secondary mb-4" style={{maxWidth: '400px'}}>
                  Teclado Mecânico + Mouse Viper + Headset 7.1. O kit definitivo para sua vitória.
                </p>
                
                <div className="d-flex align-items-baseline gap-3 mb-4 promo-price-box">
                  <span className="promo-price-new">R$ 599,90</span>
                  <span className="promo-price-old">R$ 899,90</span>
                </div>
                
                <div>
                  <button className="btn-promo">Aproveitar Oferta</button>
                </div>
              </div>
              
              <div className="col-lg-6 d-flex align-items-center justify-content-center position-relative" style={{minHeight: '300px'}}>
                 <div className="position-absolute rounded-circle" style={{width: '200px', height: '200px', background: '#8b5cf6', filter: 'blur(80px)', opacity: 0.3}}></div>
                 <img 
                    src="https://images.unsplash.com/photo-1598550487031-0898b48521f3?q=80&w=800&auto=format&fit=crop" 
                    alt="Combo Gamer" 
                    className="img-fluid position-relative z-1 rounded-3 shadow-lg"
                    style={{maxWidth: '80%', transform: 'rotate(-5deg)'}}
                 />
              </div>
            </div>
          </div>
        </section>
        
        <section id="contact" className="text-center py-5 rounded-4 border border-secondary border-opacity-25" style={{background: 'linear-gradient(180deg, rgba(88, 28, 135, 0.2) 0%, rgba(15, 23, 42, 0.6) 100%)'}}>
          <h3 className="fw-bold text-white mb-3">Precisa de ajuda?</h3>
          <p className="text-secondary mb-4 col-lg-6 mx-auto">Fale com nossos especialistas no WhatsApp.</p>
          <button 
            className="btn btn-light rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2" 
            style={{color: 'var(--neon-primary)'}}
            onClick={() => window.open('https://wa.me/556499470317', '_blank')}
          >
            Chamar no Zap
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </button>
        </section>

      </main>
      
      <footer className="border-top border-secondary border-opacity-25 py-5 mt-5 bg-dark">
        <div className="container">
          <div className="row gy-4 text-center text-md-start">
            <div className="col-md-5">
              <h4 className="fw-bold text-white mb-3">Geek Loop</h4>
              <p className="text-secondary small">Loja especializada em tecnologia e artigos geek.</p>
            </div>
            <div className="col-md-3">
              <h5 className="text-white fw-bold mb-3">Links</h5>
              <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
                <li><a href="#" className="text-decoration-none text-secondary hover-text-white">Início</a></li>
                <li><a href="#" className="text-decoration-none text-secondary hover-text-white">Produtos</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="text-white fw-bold mb-3">Contato</h5>
              <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
                <li>contato@geekloop.com</li>
                <li>(64) 99947-0317</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-secondary small mt-5 pt-4 border-top border-secondary border-opacity-10 opacity-50">
            &copy; {new Date().getFullYear()} Geek Loop Store.
          </div>
        </div>
      </footer>

      <CartDrawer />
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <StoreContent />
    </CartProvider>
  );
}