import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const PlusIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const StarSmallIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>);

function ProductCard({ p }) {
  return (
    <Link to={`/?p=${p.id}`} style={{ textDecoration: 'none' }}>
        <div className="card-geek">
        <div className="card-img-wrapper" style={{ position: 'relative' }}>
            {p.badge && <span className="product-tag">{p.badge}</span>}
            
            {p.averageRating && (
            <span style={{
                position: 'absolute', top: '10px', right: '10px', zIndex: 10,
                background: 'rgba(0,0,0,0.85)', color: '#ffc107', padding: '4px 8px',
                borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,193,7,0.3)', display: 'flex', alignItems: 'center', gap: '4px'
            }}>
                <StarSmallIcon /> {p.averageRating}
            </span>
            )}
            <img src={p.imagem_url} alt={p.nome} className="card-img-hover" loading="lazy" />
        </div>
        <div className="p-3 d-flex flex-column flex-grow-1">
            <span className="badge-category align-self-start mb-1" style={{fontSize: '0.6rem'}}>{p.category}</span>
            <h6 className="fw-bold text-white mb-1 text-truncate" style={{fontSize: '0.95rem'}}>{p.nome}</h6>
            <div className="mt-auto pt-2 d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25">
            <div>
                <div className="fw-bold text-white" style={{fontSize: '1rem'}}>
                {p.preco_antigo > 0 && p.preco_antigo > p.preco && (
                    <span style={{textDecoration: 'line-through', color: '#666', fontSize: '0.8rem', marginRight: '5px'}}>
                    R$ {Number(p.preco_antigo).toFixed(2)}
                    </span>
                )}
                R$ {p.preco.toFixed(2)}
                </div>
            </div>
            <button className="btn-quick-add"><PlusIcon /></button>
            </div>
        </div>
        </div>
    </Link>
  );
}

export function AllProductsPage({ filterType }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [filterType]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select(`*, categorias ( nome ), avaliacoes ( nota )`)
        .eq('ativo', true)
        .order('id', { ascending: false });

      if (error) throw error;

      if (data) {
        const BUCKET_NAME = 'imagens-produtos';
        let formattedData = data.map(item => {
          const getFullUrl = (imgName) => {
            if (!imgName) return null;
            if (imgName.startsWith('http')) return imgName;
            return supabase.storage.from(BUCKET_NAME).getPublicUrl(imgName).data.publicUrl;
          };

          const avaliacoes = item.avaliacoes || [];
          const media = avaliacoes.length > 0 ? (avaliacoes.reduce((a, c) => a + c.nota, 0) / avaliacoes.length).toFixed(1) : null;

          return {
            ...item,
            imagem_url: getFullUrl(item.imagem_url),
            category: item.categorias?.nome || 'Geral',
            averageRating: media
          };
        });

        if (filterType === 'destaques') {
          formattedData = formattedData.filter(p => p.destaque === true);
        } else if (filterType === 'promo') {
          formattedData = formattedData.filter(p => p.preco_antigo && p.preco_antigo > p.preco);
        }

        setProducts(formattedData);
      }
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  }

  let title = "Todos os Produtos";
  if (filterType === 'destaques') title = "Destaques";
  if (filterType === 'promo') title = "Ofertas Imperdíveis";

  return (
    <div className="container py-5 mt-4">
      <div className="d-flex align-items-center mb-4">
        <Link to="/" className="btn btn-sm btn-outline-light me-3" style={{borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>←</Link>
        <div>
            <h2 className="fw-bold text-white m-0" style={{color: filterType === 'promo' ? '#ff4d4d' : 'white'}}>{title}</h2>
            <span className="text-secondary small">{products.length} produtos encontrados</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white py-5 mt-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="mt-3">Buscando produtos...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="row g-3 g-md-4">
          {products.map(p => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 mt-5 border border-secondary rounded-4" style={{background: '#111'}}>
           <h5 className="text-secondary mb-0">Nenhum produto encontrado nesta seção.</h5>
        </div>
      )}
    </div>
  );
}