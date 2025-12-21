import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    nome: '', preco: '', preco_antigo: '', descricao: '',
    imagem_url: '', imagem_url_2: '', imagem_url_3: '',
    destaque: false, em_oferta: false, ativo: true,
    badge: '', id_categoria: '', options: '' 
  });

  useEffect(() => {
    checkUser();
    fetchData();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) navigate('/login');
  };

  const fetchData = async () => {
    setLoading(true);
    
    const { data: productsData, error: prodError } = await supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .order('id', { ascending: false });

    if (prodError) console.error("Erro produtos:", prodError);
    setProducts(productsData || []);

    const { data: catData, error: catError } = await supabase
      .from('categorias')
      .select('*')
      .order('nome', { ascending: true });
    
    if (catError) {
        console.error("Erro categorias:", catError);
    } else {
        console.log("Categorias carregadas:", catData); 
    }
    setCategories(catData || []);

    setLoading(false);
  };

  const handleOpenModal = (product = null) => {
    setErrorMessage('');
    if (product) {
      setEditingProduct(product);
      setFormData({
        nome: product.nome,
        preco: product.preco,
        preco_antigo: product.preco_antigo || '',
        descricao: product.descricao || '',
        imagem_url: product.imagem_url || '',
        imagem_url_2: product.imagem_url_2 || product.imagem_2 || '',
        imagem_url_3: product.imagem_url_3 || product.imagem_3 || '',
        destaque: product.destaque || false,
        em_oferta: product.em_oferta || false,
        ativo: product.ativo !== false,
        badge: product.badge || '',
        id_categoria: product.id_categoria ? String(product.id_categoria) : "", 
        
        options: (product.opcoes || []).join(', ') 
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nome: '', preco: '', preco_antigo: '', descricao: '',
        imagem_url: '', imagem_url_2: '', imagem_url_3: '',
        destaque: false, em_oferta: false, ativo: true,
        badge: '', id_categoria: '', options: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      let catId = null;
      if (formData.id_categoria && formData.id_categoria !== "") {
         catId = parseInt(formData.id_categoria);
      }

      const payload = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        preco_antigo: formData.preco_antigo ? parseFloat(formData.preco_antigo) : null,
        id_categoria: catId, 
        imagem_url: formData.imagem_url,
        imagem_url_2: formData.imagem_url_2,
        imagem_url_3: formData.imagem_url_3,
        destaque: formData.destaque,
        em_oferta: formData.em_oferta,
        ativo: formData.ativo,
        badge: formData.badge,
        opcoes: formData.options.split(',').map(s => s.trim()).filter(Boolean)
      };

      console.log("Enviando Payload:", payload);

      let error;
      if (editingProduct) {
        const { error: err } = await supabase
          .from('produtos')
          .update(payload)
          .eq('id', editingProduct.id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('produtos')
          .insert([payload]);
        error = err;
      }

      if (error) throw error;

      setIsModalOpen(false);
      fetchData(); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setErrorMessage(error.message || "Erro desconhecido ao salvar.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const { error } = await supabase.from('produtos').update({ ativo: !currentStatus }).eq('id', id);
    if (!error) fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return <div style={{color:'white', padding: 20}}>Carregando painel...</div>;

  return (
    <div className="admin-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1 style={{color: 'var(--neon-primary)', margin: 0}}>Painel Admin</h1>
        <div>
          <button className="btn-neon" onClick={() => handleOpenModal()} style={{marginRight: '10px'}}>+ NOVO PRODUTO</button>
          <button onClick={handleLogout} className="action-btn" style={{background: '#333', color: '#fff', padding: '10px 20px'}}>Sair</button>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Img</th>
              <th>Nome</th>
              <th>Preço</th>
              <th style={{textAlign: 'center'}}>Destaque</th>
              <th style={{textAlign: 'center'}}>Promo</th>
              <th style={{textAlign: 'center'}}>Status</th>
              <th style={{textAlign: 'right'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{opacity: p.ativo ? 1 : 0.5}}>
                <td><img src={p.imagem_url} style={{width: 40, height: 40, objectFit: 'cover', borderRadius: 4}} alt="" /></td>
                <td>{p.nome}</td>
                <td>R$ {p.preco}</td>
                <td style={{textAlign: 'center'}}>{p.destaque ? '⭐' : '-'}</td>
                <td style={{textAlign: 'center'}}>{p.em_oferta ? '🔥' : '-'}</td>
                <td style={{textAlign: 'center'}}>
                  <span className={p.ativo ? 'status-active' : 'status-inactive'}>
                    {p.ativo ? 'ATIVO' : 'INATIVO'}
                  </span>
                </td>
                <td style={{textAlign: 'right'}}>
                  <button className="action-btn btn-edit" onClick={() => handleOpenModal(p)}>Editar</button>
                  <button 
                    className="action-btn btn-toggle" 
                    style={{background: p.ativo ? '#dc3545' : '#28a745', color: 'white'}}
                    onClick={() => handleToggleStatus(p.id, p.ativo)}
                  >
                    {p.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container">
            <div className="modal-header">
               <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
               <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            {errorMessage && (
              <div style={{background: '#ff4d4d', color: 'white', padding: '10px', borderRadius: '4px', marginBottom: '15px'}}>
                <strong>Erro:</strong> {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div style={{flex: 2}}>
                  <label className="form-label">Nome do Produto</label>
                  <input required className="form-input" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                </div>
                
                <div style={{flex: 1}}>
                  <label className="form-label">Categoria</label>
                  <select 
                    required 
                    className="form-input" 
                    value={formData.id_categoria} 
                    onChange={e => setFormData({...formData, id_categoria: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat, index) => (
                      <option key={cat.id_categoria || index} value={cat.id_categoria}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div style={{flex: 1}}>
                  <label className="form-label">Preço (R$)</label>
                  <input required type="number" step="0.01" className="form-input" value={formData.preco} onChange={e => setFormData({...formData, preco: e.target.value})} />
                </div>
                <div style={{flex: 1}}>
                  <label className="form-label">Preço Antigo (Opc)</label>
                  <input type="number" step="0.01" className="form-input" value={formData.preco_antigo} onChange={e => setFormData({...formData, preco_antigo: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                 <label className="form-label">Badge/Etiqueta (ex: NOVO)</label>
                 <input className="form-input" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} />
              </div>

              <div className="form-group">
                 <label className="form-label">Imagem Principal (URL ou Nome no Storage)</label>
                 <input required className="form-input" value={formData.imagem_url} onChange={e => setFormData({...formData, imagem_url: e.target.value})} />
              </div>

              <div className="form-row">
                <input placeholder="Imagem 2 (URL)" className="form-input" value={formData.imagem_url_2} onChange={e => setFormData({...formData, imagem_url_2: e.target.value})} />
                <input placeholder="Imagem 3 (URL)" className="form-input" value={formData.imagem_url_3} onChange={e => setFormData({...formData, imagem_url_3: e.target.value})} />
              </div>

              <div className="form-group">
                 <label className="form-label">Descrição</label>
                 <textarea className="form-input" rows="4" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
              </div>

              <div className="form-group">
                 <label className="form-label">Opções/Cores (Separar por vírgula)</label>
                 <input className="form-input" value={formData.options} onChange={e => setFormData({...formData, options: e.target.value})} />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={formData.destaque} onChange={e => setFormData({...formData, destaque: e.target.checked})} />
                  É Destaque?
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={formData.em_oferta} onChange={e => setFormData({...formData, em_oferta: e.target.checked})} />
                  Em Oferta?
                </label>
                 <label className="checkbox-label">
                  <input type="checkbox" checked={formData.ativo} onChange={e => setFormData({...formData, ativo: e.target.checked})} />
                  Ativo?
                </label>
              </div>

              <button type="submit" className="btn-neon" style={{marginTop: 20, width: '100%', padding: 15}}>
                {editingProduct ? 'SALVAR ALTERAÇÕES' : 'CRIAR PRODUTO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;