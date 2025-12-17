import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProductModal from '../components/ProductModal';
import './CategoryPage.css';

const CategoryPage = () => {
  const { id } = useParams();
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
        query = query.eq('categoria_id', id);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0 && data[0].categorias) {
        setCategoryName(data[0].categorias.nome);
      } else if (id) {
        setCategoryName("Categoria");
      }

      const formattedData = data.map(item => {
        let imageUrl = item.imagem_url;
        
        if (imageUrl && !imageUrl.startsWith('http')) {
          const { data: imageData } = supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(imageUrl);
          imageUrl = imageData.publicUrl;
        }

        return {
          ...item,
          id: item.id,
          title: item.nome,
          price: item.preco,
          description: item.descricao, 
          image: imageUrl,
          options: item.options || [] 
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
    const savedCart = JSON.parse(localStorage.getItem('geek_cart')) || [];
    
    const existingIndex = savedCart.findIndex(i => i.id === item.id);
    let newCart;
    
    if (existingIndex > -1) {
      newCart = [...savedCart];
      newCart[existingIndex].quantity += item.quantity;
    } else {
      newCart = [...savedCart, item];
    }
    
    localStorage.setItem('geek_cart', JSON.stringify(newCart));
    alert(`Produto adicionado ao carrinho!`);
    
    window.dispatchEvent(new Event("storage")); 
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