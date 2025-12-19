import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css';
import logo from './assets/logo1.jpeg';
import comboImg from './assets/combo-gamer.png';
import { CartProvider, useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import { supabase } from './supabaseClient';
import { CATEGORIES } from './data/db'; 
import CategoryPage from './pages/CategoryPage';
import { AllProductsPage } from './pages/AllProductsPage';

const PlusIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const CartIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>);
const InstagramIcon = () => (<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>);
const FacebookIcon = () => (<svg viewBox="0 0 16 16" fill="currentColor"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.81h-1.01c-1.181 0-1.55.75-1.55 1.55v1.11h2.147l-.278 1.95h-1.87v5.609c4.921-.592 8.46-4.825 8.46-9.991z"/></svg>);

function ProductImage({ src, gradient, alt }) {
  if (src) return <img src={src} alt={alt} className="card-img-hover" />;
  return (
    <div className="card-img-hover d-flex align-items-center justify-content-center text-center p-4" 
         style={{ background: gradient || '#333', width: '100%', height: '100%' }}>
      <div><span className="text-white fw-bold fs-5 drop-shadow">{alt}</span></div>
    </div>
  );
}

function ProductCard({ p, onSelect }) {
  return (
    <div className="card-geek" onClick={() => onSelect(p)}>
      <div className="card-img-wrapper">
        {p.badge && <span className="product-tag">{p.badge}</span>}
        <ProductImage src={p.imagem_url} gradient={p.gradient} alt={p.nome}/>
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <span className="badge-category align-self-start mb-1" style={{fontSize: '0.6rem'}}>{p.category}</span>
        <h6 className="fw-bold text-white mb-1 text-truncate" style={{fontSize: '0.95rem'}}>{p.nome}</h6>
        <div className="mt-auto pt-2 d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25">
          <div>
            <div className="fw-bold text-white" style={{fontSize: '1rem'}}>
              {p.oldPrice > 0 && p.oldPrice > p.price && (
                <span style={{textDecoration: 'line-through', color: '#666', fontSize: '0.8rem', marginRight: '5px'}}>
                   R$ {Number(p.oldPrice).toFixed(2)}
                </span>
              )}
              R$ {p.preco.toFixed(2)}
            </div>
          </div>
          <button className="btn-quick-add"><PlusIcon /></button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ setSelectedProduct }) {
  const [products, setProducts] = useState([]);
  const BUCKET_NAME = 'imagens-produtos';

  useEffect(() => {
    fetchHomeData();
  }, []);

  async function fetchHomeData() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select(`*, categorias ( nome )`)
        .limit(50); 

      if (error) throw error;

      if (data) {
        const formattedData = data.map(item => {
          const getFullUrl = (imgName) => {
            if (!imgName) return null;
            if (imgName.startsWith('http')) return imgName;
            const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(imgName);
            return data.publicUrl;
          };

          const mainImage = getFullUrl(item.imagem_url);
          const rawGallery = [item.imagem_2, item.imagem_3];
          const galleryProcessed = rawGallery
             .map(img => getFullUrl(img))
             .filter(link => link !== null);

          return {
            ...item,
            image: mainImage, 
            imagem_url: mainImage,
            gallery: galleryProcessed,
            options: item.options || item.opcoes || [],
            title: item.nome, 
            price: item.preco, 
            description: item.descricao,
            category: item.categorias?.nome || 'Geral',
            isFeatured: item.destaque, 
            oldPrice: item.preco_antigo,
            badge: item.badge 
          };
        });
        
        setProducts(formattedData);
      }
    } catch (error) {
      console.error("Erro ao carregar home:", error);
    }
  }

  const destaques = products
    .filter(p => p.isFeatured === true)
    .slice(0, 4); 

  const ofertas = products
    .filter(p => p.oldPrice && p.oldPrice > 0)
    .slice(0, 4);

  return (
    <>
      <section id="home" className="hero-gradient rounded-4 p-4 text-center position-relative overflow-hidden mb-4 mt-3">
         <div className="position-relative z-1">
            <span className="badge-category mb-2">🚗 PRODUTOS À PRONTA ENTREGA</span>
            <span className="badge-category mb-2">⚡ ENTREGA RÁPIDA</span>
            <h2 className="fw-bold text-white my-2">Onde o mundo geek nunca para!</h2>
            <h2 className="text-secondary small mb-3">Tecnologia e cultura em um só lugar.</h2>
            <button className="btn-neon px-4 py-2" onClick={() => document.getElementById('products').scrollIntoView({behavior: 'smooth'})}>VER CATÁLOGO</button>
         </div>
      </section>

      <section id="categories" className="mb-4">
        <div className="d-flex justify-content-between align-items-end mb-3 px-1">
          <div className="section-title-container">
            <h5 className="fw-bold text-white mb-0">Categorias</h5>
            <div className="section-title-line"></div>
          </div>
        </div>
        
        <div className="horizontal-scroll">
          <Link to="/todos-produtos" className="text-decoration-none">
             <div className="category-pill" style={{background: 'var(--neon-primary)', color: '#000', borderColor: 'var(--neon-primary)'}}>
                <span className="text fw-bold" style={{ color: '#000' }}>Todas categorias</span>
             </div>
          </Link>

          {CATEGORIES.map(cat => (
            <Link to={`/categoria/${cat.id}`} key={cat.id} className="text-decoration-none">
              <div className="category-pill">
                <span className="fs-5">{cat.icon}</span>
                <span className="text">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="products" className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
          <h5 className="fw-bold text-white mb-0">Destaques</h5>
          <Link to="/todos-produtos" style={{ color: 'var(--neon-primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>Ver tudo →</Link>
        </div>
        <div className="row g-2 g-md-4">
          {destaques.length > 0 ? (
            destaques.map(p => (
              <div key={p.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard p={p} onSelect={setSelectedProduct} />
              </div>
            ))
          ) : (
            <div className="text-white text-center w-100 py-4" style={{opacity: 0.5}}>
               Nenhum destaque.
            </div>
          )}
        </div>
      </section>

      <section id="promo-list" className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3 px-1">
          <div className="section-title-container">
             <h5 className="fw-bold text-white mb-0" style={{color: '#ff4d4d'}}>Ofertas da Semana</h5>
             <div className="section-title-line" style={{background: 'linear-gradient(90deg, #ff4d4d, transparent)'}}></div>
          </div>
          <Link to="/todos-produtos" style={{ color: '#ff4d4d', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>Ver todas →</Link>
        </div>
        <div className="row g-2 g-md-4">
          {ofertas.length > 0 ? (
             ofertas.map(p => (
               <div key={p.id} className="col-6 col-md-4 col-lg-3">
                 <ProductCard p={p} onSelect={setSelectedProduct} />
               </div>
             ))
          ) : (
             <div className="text-white text-center w-100 py-4 opacity-50 small">
               Nenhuma oferta encontrada.
             </div>
          )}
        </div>
      </section>

      <section id="promotions" className="mb-5">
        <div className="promo-card rounded-4 overflow-hidden position-relative">
          <div className="row g-0">
            <div className="col-lg-6 p-4 p-md-5 position-relative z-1 d-flex flex-column justify-content-center text-center text-lg-start">
              <span className="promo-tag">OFERTA RELÂMPAGO</span>
              <h2 className="promo-title">Combo Gamer<br />Supreme</h2>
              <p className="text-secondary mb-4 small">Teclado Mecânico + Mouse + Headset. O kit definitivo para sua vitória.</p>
              <div className="d-flex align-items-baseline justify-content-center justify-content-lg-start gap-3 mb-4">
                <span className="promo-price-new">R$ 599,90</span>
                <span className="promo-price-old">R$ 899,90</span>
              </div>
              <div><button className="btn-promo">GARANTIR AGORA</button></div>
            </div>
            <div className="col-lg-6 d-flex align-items-center justify-content-center position-relative py-4" style={{minHeight: '250px'}}>
               <div className="position-absolute rounded-circle" style={{width: '200px', height: '200px', background: 'var(--neon-primary)', filter: 'blur(90px)', opacity: 0.2}}></div>
               <img src={comboImg} alt="Combo Gamer" className="img-fluid position-relative z-1 rounded-3 shadow-lg" style={{maxWidth: '80%', transform: 'rotate(-5deg)', border: '1px solid rgba(255,255,255,0.1)'}} />
            </div>
          </div>
        </div>
      </section>
      
      <section id="contact" className="contact-card rounded-4 p-4 text-center">
        <h3 className="fw-bold text-white mb-2">Ficou com dúvida?</h3>
        <p className="text-secondary mb-4 mx-auto small" style={{maxWidth: '400px'}}>Chame a gente no WhatsApp. Nosso time te ajuda a escolher o melhor equipamento.</p>
        <button className="btn-whatsapp" onClick={() => window.open('https://wa.me/556499470317', '_blank')}>Falar no WhatsApp</button>
      </section>
    </>
  );
}

function StoreContent() {
  const { setIsCartOpen, totalItems, addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (item) => {
    addToCart(item);
    setSelectedProduct(null);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navbar fixed-top navbar-glass flex-column justify-content-center">
          <div className="container d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <Link to="/" className="navbar-brand p-0 m-0 d-flex align-items-center">
                <img src={logo} alt="Geek Loop Store" style={{ height: '45px', objectFit: 'contain', borderRadius: '8px' }} />
                <span className="ms-2 fw-bold" style={{ fontSize: '1.1rem', color: '#fff' }}>
                  <span style={{ color: 'var(--neon-primary)' }}>Geek Loop</span> Store
                </span>
              </Link>
              <div className="nav-social-group d-none d-sm-flex">
                <a href="https://instagram.com" target="_blank" className="nav-social-icon"><InstagramIcon /></a>
                <a href="https://facebook.com" target="_blank" className="nav-social-icon"><FacebookIcon /></a>
              </div>
            </div>

            <div className="d-none d-md-flex align-items-center gap-4 position-absolute start-50 translate-middle-x">
              <a href="/#home" className="nav-link-custom">Início</a>
              <a href="/#products" className="nav-link-custom">Destaques</a>
              <a href="/#promo-list" className="nav-link-custom">Promos</a>
              <a href="/#promotions" className="nav-link-custom">Combo</a>
            </div>
            
            <button className="btn-neon d-flex align-items-center gap-2" onClick={() => setIsCartOpen(true)}>
              <CartIcon />
              <span style={{ fontSize: '0.9rem' }}>{totalItems}</span>
            </button>
          </div>

          <div className="container d-md-none mt-2 w-100">
             <div className="mobile-nav-scroll">
                <a href="/#home" className="mobile-nav-link">Início</a>
                <a href="/#products" className="mobile-nav-link">Destaques</a>
                <a href="/#promo-list" className="mobile-nav-link">Promos</a>
                <a href="/#promotions" className="mobile-nav-link">Combo</a>
             </div>
          </div>
        </nav>

        <div className="container pb-5">
           <Routes>
              <Route path="/" element={<HomePage setSelectedProduct={setSelectedProduct} />} />
              <Route path="/todos-produtos" element={<AllProductsPage />} />
              <Route path="/categoria/:id" element={<CategoryPage />} />
           </Routes>
        </div>

        <footer className="mt-5">
          <div className="container">
            <div className="row gy-4 text-center text-md-start">
              <div className="col-md-5">
                <h4 className="mb-3" style={{color: '#fff'}}>
                  <span style={{color: 'var(--neon-primary)', fontWeight: '800'}}>Geek Loop</span> Store
                </h4>
                <p className="small mb-4" style={{maxWidth: '300px', margin: '0 auto 0 0'}}>Sua loja especializada em tecnologia e artigos geek.</p>
                <div className="social-links justify-content-center justify-content-md-start">
                  <a href="https://instagram.com" target="_blank" className="social-icon"><InstagramIcon /></a>
                  <a href="https://facebook.com" target="_blank" className="social-icon"><FacebookIcon /></a>
                </div>
              </div>
              <div className="col-md-3">
                <h5 className="mb-3">Navegação</h5>
                <ul className="list-unstyled small d-flex flex-column gap-2">
                  <li><a href="/#home" className="text-decoration-none">Início</a></li>
                  <li><Link to="/todos-produtos" className="text-decoration-none">Catálogo Completo</Link></li>
                  <li><a href="/#products" className="text-decoration-none">Destaques</a></li>
                </ul>
              </div>
              <div className="col-md-4">
                <h5 className="mb-3">Fale Conosco</h5>
                <ul className="list-unstyled small d-flex flex-column gap-2">
                  <li>contato@geekloop.com</li>
                  <li>(64) 99947-0317</li>
                  <li>Goiás, Brasil</li>
                </ul>
              </div>
            </div>
            <div className="text-center small mt-5 pt-4 border-top" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
              <p className="m-0 opacity-75">© 2025 Geek Loop Store. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>

        <CartDrawer />
        
        {selectedProduct && (
          <ProductModal 
            isOpen={!!selectedProduct} 
            product={selectedProduct} 
            onClose={() => ssetSelectedProduct(null)}
            onAddToCart={handleAddToCart} 
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <CartProvider>
      <StoreContent />
    </CartProvider>
  );
}