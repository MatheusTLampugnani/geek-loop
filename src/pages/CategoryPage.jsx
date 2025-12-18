import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProductModal from '../components/ProductModal';
import { useCart } from '../context/CartContext';
import './CategoryPage.css';

const CategoryPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryName, setCategoryName] = useState('Destaques');

  const BUCKET_NAME = 'imagens-produtos'; 

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('produtos')
        .select(`*, categorias ( nome )`);
      if (id) {
        query = query.eq('id_categoria', id); 
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0 && data[0].categorias) {
        setCategoryName(data[0].categorias.nome);
      } else if (id) {
        setCategoryName("Categoria");
      }

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
      console.error("Erro ao carregar categoria:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  if (loading) return <div style={{color: 'white', padding: 40, textAlign: 'center'}}>Carregando...</div>;

  return (
    <div className="category-page">
      <h1>{categoryName}</h1>
      
      {products.length === 0 ? (
        <div style={{color: '#888', padding: 20}}>Nenhum produto encontrado nesta categoria.</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              <div className="card-image">
                <img src={product.image || 'https://via.placeholder.com/300'} alt={product.title} />
              </div>
              <div className="card-info">
                <span className="tag">{categoryName}</span>
                <h3>{product.title}</h3>
                <div className="card-footer">
                  <span className="price">R$ {Number(product.price).toFixed(2)}</span>
                  <button className="btn-plus">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default CategoryPage;