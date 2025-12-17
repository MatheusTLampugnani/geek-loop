import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { CATEGORIES } from '../data/db';
import ProductModal from '../components/ProductModal';

const PlusIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);

function ProductImage({ src, alt }) {
  if (src) return <img src={src} alt={alt} className="card-img-hover" style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
  return <div className="card-img-hover bg-secondary" style={{width: '100%', height: '100%'}}></div>;
}

export function CategoryPage() {
  const { id } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const categoryInfo = CATEGORIES.find(c => c.id === id) || { name: 'Categoria', icon: '📦' };

  useEffect(() => {
    async function fetchCategoryProducts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*, categorias(nome)')
          .eq('categoria', id);

        if (error) throw error;

        if (data) {
          const formatted = data.map(item => ({
            ...item,
            nome: item.nome,
            preco: Number(item.preco),
            category: item.categorias?.nome || 'Geral'
          }));
          setProducts(formatted);
        }
      } catch (error) {
        console.error("Erro ao buscar categoria:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [id]);

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      
      <div className="d-flex align-items-center gap-3 mb-5">
        <Link to="/" className="btn btn-sm btn-outline-light rounded-circle p-2" style={{width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>←</Link>
        <div>
           <div className="d-flex align-items-center gap-2">
             <span className="fs-2">{categoryInfo.icon}</span>
             <h2 className="fw-bold text-white mb-0">{categoryInfo.name}</h2>
           </div>
           <p className="text-secondary small m-0 ms-1">
             {loading ? 'Carregando...' : `${products.length} produtos encontrados`}
           </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white py-5">Carregando...</div>
      ) : (
        <div className="row g-2 g-md-4">
          {products.length > 0 ? products.map(p => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <div className="card-geek h-100 cursor-pointer" onClick={() => setSelectedProduct(p)}>
                <div className="card-img-wrapper position-relative">
                  {p.badge && <span className="product-tag">{p.badge}</span>}
                  <ProductImage src={p.imagem_url} alt={p.nome} />
                </div>
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <h6 className="fw-bold text-white mb-1 text-truncate">{p.nome}</h6>
                  <div className="mt-auto pt-2 d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25">
                    <div>
                      <div className="fw-bold text-white">R$ {p.preco.toFixed(2)}</div>
                      <div className="text-muted" style={{fontSize: '0.65rem'}}>10x s/ juros</div>
                    </div>
                    <button className="btn-quick-add"><PlusIcon /></button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 text-center text-white opacity-50">
              Nenhum produto encontrado nesta categoria.
            </div>
          )}
        </div>
      )}

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}