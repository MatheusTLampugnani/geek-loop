import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductModal from '../components/ProductModal';
import { useCart } from '../context/CartContext';
import './CategoryPage.css'; 

export const AllProductsPage = ({ filterType }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');

  const BUCKET_NAME = 'imagens-produtos'; 

  useEffect(() => {
    fetchAllProducts();
  }, [filterType]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('produtos')
        .select(`*, categorias ( nome )`)
        .eq('ativo', true);

      if (filterType === 'destaques') {
        query = query.eq('destaque', true);
      } else if (filterType === 'promo') {
        query = query.eq('em_oferta', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedData = data.map(item => {
        const getFullUrl = (imgName) => {
          if (!imgName) return null;
          if (imgName.startsWith('http')) return imgName;
          const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(imgName);
          return data.publicUrl;
        };

        const mainImage = getFullUrl(item.imagem_url);
        const rawGallery = [item.imagem_url_2, item.imagem_url_3];
        const galleryProcessed = rawGallery
          .map(img => getFullUrl(img))
          .filter(link => link !== null);

        return {
          ...item,
          id: item.id,
          title: item.nome,
          price: item.preco,
          oldPrice: item.preco_antigo,
          description: item.descricao,
          image: mainImage,
          gallery: galleryProcessed,
          options: item.opcoes || [], 
          category: item.categorias?.nome || 'Geral',
          badge: item.badge
        };
      });

      setProducts(formattedData);

    } catch (error) {
      console.error("Erro ao carregar catálogo:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setSelectedProduct(null);
  };

  const getSortedProducts = () => {
    const list = [...products];
    if (sortOrder === 'asc') {
      return list.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    return list;
  };

  const displayedProducts = getSortedProducts();

  let pageTitle = "Catálogo Completo";
  if (filterType === 'destaques') pageTitle = "Produtos em Destaque";
  if (filterType === 'promo') pageTitle = "Ofertas Imperdíveis";

  if (loading) return <div style={{color: 'white', padding: 40, textAlign: 'center'}}>Carregando produtos...</div>;

  return (
    <div className="category-page">
      <div style={{display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <button 
              onClick={() => window.history.back()} 
              style={{background: 'none', border: '1px solid #333', color: 'white', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer'}}
            >
              ←
            </button>
            <div>
                <h1 style={{margin: 0, color: filterType === 'promo' ? '#ff4d4d' : filterType === 'destaques' ? 'var(--neon-primary)' : 'white'}}>
                    {pageTitle}
                </h1>
                <span style={{color: '#888', fontSize: '0.9rem'}}>{products.length} produtos encontrados</span>
            </div>
         </div>

         <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                background: '#111', 
                color: 'white', 
                border: '1px solid #333', 
                padding: '10px 15px', 
                borderRadius: '8px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="default">Ordenar por: Padrão</option>
              <option value="asc">Menor Preço 🡡</option>
              <option value="desc">Maior Preço 🡣</option>
            </select>
         </div>
      </div>
      
      <div className="products-grid">
        {displayedProducts.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="card-image">
              {product.badge && <span className="tag" style={{top: 10, left: 10, background: 'var(--neon-primary)', color:'black'}}>{product.badge}</span>}
              <img src={product.image || 'https://via.placeholder.com/300'} alt={product.title} />
            </div>
            <div className="card-info">
              <span className="tag">{product.category}</span>
              <h3>{product.title}</h3>
              <div className="card-footer">
                <div style={{display:'flex', flexDirection:'column'}}>
                    {product.oldPrice > 0 && (
                        <span style={{textDecoration: 'line-through', color: '#666', fontSize: '0.8rem'}}>
                            R$ {Number(product.oldPrice).toFixed(2)}
                        </span>
                    )}
                    <span className="price">R$ {Number(product.price).toFixed(2)}</span>
                </div>
                <button className="btn-plus">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductModal 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};