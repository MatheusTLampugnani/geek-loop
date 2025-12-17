import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProductModal from '../components/ProductModal';

const PlusIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);

function ProductImage({ src, gradient, alt }) {
  if (src) return <img src={src} alt={alt} className="card-img-hover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
  return <div className="card-img-hover" style={{ background: gradient || '#333', width: '100%', height: '100%' }}></div>;
}

export function AllProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          *,
          categorias ( nome )
        `);

      if (error) throw error;

      if (data) {
        const formattedData = data.map(item => ({
          ...item,
          nome: item.nome,
          preco: item.preco,
          category: item.categorias?.nome || 'Geral'
        }));
        setProducts(formattedData);
      }
    } catch (error) {
      console.error("Erro:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="d-flex align-items-center gap-3 mb-5">
        <Link to="/" className="btn btn-sm btn-outline-light rounded-circle p-2" style={{width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>←</Link>
        <div>
           <h2 className="fw-bold text-white mb-0">Catálogo Completo</h2>
           <p className="text-secondary small m-0">{loading ? 'Carregando...' : `${products.length} produtos disponíveis`}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white py-5"><div className="spinner-border text-warning" role="status"></div></div>
      ) : (
        <div className="row g-2 g-md-4">
          {products.map(p => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <div className="card-geek h-100 cursor-pointer" onClick={() => setSelectedProduct(p)}>
                <div className="card-img-wrapper position-relative">
                  {p.badge && <span className="product-tag">{p.badge}</span>}
                  <ProductImage src={p.imagem_url} alt={p.nome} />
                </div>
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <span className="badge-category align-self-start mb-1" style={{fontSize: '0.6rem'}}>{p.category}</span>
                  <h6 className="fw-bold text-white mb-1 text-truncate" style={{fontSize: '0.95rem'}}>{p.nome}</h6>
                  <div className="mt-auto pt-2 d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25">
                    <div>
                      <div className="fw-bold text-white" style={{fontSize: '1rem'}}>R$ {p.preco.toFixed(2)}</div>
                      <div className="text-muted" style={{fontSize: '0.65rem'}}>10x s/ juros</div>
                    </div>
                    <button className="btn-quick-add"><PlusIcon /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}