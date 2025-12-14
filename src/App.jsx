import React from "react";
import './App.css';

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
  { id: 1, title: 'Controle Wireless X1', category: 'Controles', price: 'R$ 179,90', badge: 'Mais vendido', gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)' },
  { id: 2, title: 'Fone Bluetooth AirTone', category: 'Áudio', price: 'R$ 249,90', badge: 'Novo', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
  { id: 3, title: 'Teclado Mecânico Pro', category: 'Teclados', price: 'R$ 349,90', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
  { id: 4, title: 'Mouse Gamer Viper', category: 'Mouses', price: 'R$ 129,90', badge: 'Promo', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { id: 5, title: 'Smartwatch Pulse S3', category: 'Wearables', price: 'R$ 399,90', gradient: 'linear-gradient(135deg, #f97316, #ef4444)' },
  { id: 6, title: 'Estátua Hero Collector', category: 'Colecionáveis', price: 'R$ 219,90', gradient: 'linear-gradient(135deg, #eab308, #d97706)' },
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

function PlaceholderImage({ label = 'Produto', gradient }) {
  return (
    <div className="card-img-hover d-flex align-items-center justify-content-center text-center p-4" 
         style={{ background: gradient || '#333', width: '100%', height: '100%' }}>
      <div>
        <span className="text-white fw-bold fs-5 drop-shadow">{label}</span>
      </div>
    </div>
  );
}

export default function App() {
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
            <a href="#promotions" className="text-decoration-none text-light opacity-75 hover-opacity-100">Ofertas</a>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button className="btn-neon btn-pulse d-flex align-items-center gap-2">
              <IconCart />
              <span>0</span>
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
          
          <div className="row g-3">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="col-6 col-md-3 col-lg-auto flex-fill">
                <div className="card-geek h-100 p-3 d-flex flex-column align-items-center justify-content-center text-center cursor-pointer" style={{cursor: 'pointer'}}>
                  <div className="fs-2 mb-2">{cat.icon}</div>
                  <div className="small fw-bold text-muted">{cat.name}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="products" className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold text-white mb-0">Em Destaque</h3>
            <a href="#" className="text-decoration-none fw-bold" style={{color: 'var(--neon-primary)'}}>Ver tudo →</a>
          </div>

          <div className="row g-4">
            {PRODUCTS.map(p => (
              <div key={p.id} className="col-md-6 col-lg-4">
                <div className="card-geek h-100 d-flex flex-column">
                  <div className="card-img-wrapper position-relative">
                    <PlaceholderImage label={p.title} gradient={p.gradient} />
                    {p.badge && (
                      <span className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <span className="badge-category align-self-start mb-2">{p.category}</span>
                    <h5 className="fw-bold text-white mb-1">{p.title}</h5>
                    
                    <div className="mt-auto pt-3 d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25">
                      <div>
                        <div className="fs-5 fw-bold text-white">{p.price}</div>
                        <div className="small text-muted">10x sem juros</div>
                      </div>
                      <button className="btn btn-sm btn-outline-light rounded-circle p-2 border-0 bg-dark">
                         <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="promotions" className="hero-gradient rounded-4 overflow-hidden mb-5 position-relative">
          <div className="row g-0">
            <div className="col-lg-6 p-5 position-relative z-1">
              <span className="text-uppercase fw-bold text-danger ls-1 small">Oferta Relâmpago</span>
              <h2 className="display-5 fw-bold text-white mt-2 mb-3">Combo Gamer Pro</h2>
              <p className="text-secondary mb-4">Teclado Mecânico + Mouse Viper + Headset 7.1. Leve seu setup para o próximo nível com 30% de desconto.</p>
              
              <div className="d-flex align-items-baseline gap-3 mb-4">
                <span className="fs-2 fw-bold text-white">R$ 599,90</span>
                <span className="text-sdecoration-line-through text-muted fs-5">R$ 899,90</span>
              </div>
              
              <button className="btn-neon">Aproveitar Oferta</button>
            </div>
            <div className="col-lg-6 d-none d-lg-block" style={{background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(0,0,0,0) 70%)'}}></div>
          </div>
        </section>

        <section id="contact" className="text-center py-5 rounded-4 border border-secondary border-opacity-25" style={{background: 'linear-gradient(180deg, rgba(88, 28, 135, 0.2) 0%, rgba(15, 23, 42, 0.6) 100%)'}}>
          <h3 className="fw-bold text-white mb-3">Precisa de ajuda para montar seu setup?</h3>
          <p className="text-secondary mb-4 col-lg-6 mx-auto">Nossos especialistas estão prontos para te atender via WhatsApp e tirar todas as suas dúvidas.</p>
          <button className="btn btn-light rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2" style={{color: 'var(--neon-primary)'}}>
            Falar com Especialista
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </button>
        </section>

      </main>
      
      <footer className="border-top border-secondary border-opacity-25 py-5 mt-5 bg-dark">
        <div className="container">
          <div className="row gy-4">
            <div className="col-md-5">
              <h4 className="fw-bold text-white mb-3">Geek Loop</h4>
              <p className="text-secondary small">Loja especializada em tecnologia e artigos geek. Qualidade, garantia e paixão pelo que fazemos.</p>
            </div>
            <div className="col-md-3">
              <h5 className="text-white fw-bold mb-3">Institucional</h5>
              <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
                <li><a href="#" className="text-decoration-none text-secondary hover-text-white">Sobre nós</a></li>
                <li><a href="#" className="text-decoration-none text-secondary hover-text-white">Política de Troca</a></li>
                <li><a href="#" className="text-decoration-none text-secondary hover-text-white">Termos de Uso</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="text-white fw-bold mb-3">Contato</h5>
              <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
                <li>contato@GeekLoop.com</li>
                <li>(11) 99999-9999</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-secondary small mt-5 pt-4 border-top border-secondary border-opacity-10 opacity-50">
            &copy; {new Date().getFullYear()} Geek Loop Store. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}