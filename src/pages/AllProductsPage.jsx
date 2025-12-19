import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductModal from '../components/ProductModal';
import { useCart } from '../context/CartContext';
import './CategoryPage.css';

export const AllProductsPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const BUCKET_NAME = 'imagens-produtos'; 

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('produtos')
        .select(`*, categorias ( nome )`);

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
          description: item.descricao,
          image: mainImage,
          gallery: galleryProcessed,
          options: item.options || item.opcoes || [], 
          category: item.categorias?.nome || 'Geral'
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
  };

  if (loading) return <div style={{color: 'white', padding: 40, textAlign: 'center'}}>Carregando catálogo...</div>;

  return (
    <div className="category-page">
      <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
         <button 
           onClick={() => window.history.back()} 
           style={{background: 'none', border: '1px solid #333', color: 'white', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer'}}
         >
           ←
         </button>
         <div>
            <h1 style={{margin: 0}}>Catálogo Completo</h1>
            <span style={{color: '#888', fontSize: '0.9rem'}}>{products.length} produtos disponíveis</span>
         </div>
      </div>
      
      <div className="products-grid">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="card-image">
              <img src={product.image || 'https://via.placeholder.com/300'} alt={product.title} />
            </div>
            <div className="card-info">
              <span className="tag">{product.category}</span>
              <h3>{product.title}</h3>
              <div className="card-footer">
                <span className="price">R$ {Number(product.price).toFixed(2)}</span>
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