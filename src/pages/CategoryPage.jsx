import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import ProductModal from '../components/ProductModal';
import './CategoryPage.css';

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BUCKET_NAME = 'imagens-produtos'; 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let { data, error } = await supabase
        .from('produtos')
        .select('*');

      if (error) throw error;

      const productsWithImages = data.map(item => {
        
        let imageUrl = item.image; 
        
        if (item.image && !item.image.startsWith('http')) {
          const { data: imageData } = supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(item.image);
          
          imageUrl = imageData.publicUrl;
        }

        return {
          ...item,
          image: imageUrl,
          options: item.options || [] 
        };
      });

      setProducts(productsWithImages);

    } catch (error) {
      console.error("Erro ao buscar do Supabase:", error.message);
      alert("Erro ao carregar produtos!");
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (item) => {
    alert(`Adicionado: ${item.title}`);
  };

  if (loading) return <div className="loading-msg">Carregando loja...</div>;

  return (
    <div className="category-page">
      <h1>Destaques</h1>
      
      <div className="products-grid">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product)}
          >
            <div className="card-image">
              <img 
                src={product.image || 'https://via.placeholder.com/300'} 
                alt={product.title} 
              />
            </div>
            <div className="card-info">
              <span className="tag">Destaque</span>
              <h3>{product.title}</h3>
              <div className="card-footer">
                <span className="price">R$ {Number(product.price).toFixed(2)}</span>
                <button className="btn-plus">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default CategoryPage;