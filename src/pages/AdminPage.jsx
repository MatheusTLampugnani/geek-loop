import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ImagePreview = ({ url, label }) => {
  if (!url) return null;
  return (
    <div className="mt-2 mb-3">
      <p className="small text-secondary mb-1">Prévia de {label}:</p>
      <img src={url} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #333', borderRadius: 4, background: '#000' }} />
    </div>
  );
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    preco_antigo: '',
    id_categoria: 1, 
    imagem_url: '',
    imagem_url_2: '',
    imagem_url_3: '',
    destaque: false,
    ativo: true,
    badge: ''
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('produtos').select('*').order('id', { ascending: false });
    if (!error) setProducts(data);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e, fieldName) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('imagens-produtos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('imagens-produtos')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        [fieldName]: data.publicUrl
      }));

    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload. Verifique o bucket.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      preco: parseFloat(formData.preco),
      preco_antigo: formData.preco_antigo ? parseFloat(formData.preco_antigo) : null,
      id_categoria: parseInt(formData.id_categoria)
    };

    let error;
    if (editingId) {
      const { error: err } = await supabase.from('produtos').update(payload).eq('id', editingId);
      error = err;
    } else {
      const { error: err } = await supabase.from('produtos').insert([payload]);
      error = err;
    }

    setLoading(false);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      alert('Produto salvo com sucesso!');
      closeModal();
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      nome: product.nome,
      descricao: product.descricao || '',
      preco: product.preco,
      preco_antigo: product.preco_antigo || '',
      id_categoria: product.id_categoria,
      imagem_url: product.imagem_url || '',
      imagem_url_2: product.imagem_url_2 || '',
      imagem_url_3: product.imagem_url_3 || '',
      destaque: product.destaque,
      ativo: product.ativo,
      badge: product.badge || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return;
    const { error } = await supabase.from('produtos').delete().eq('id', id);
    if (!error) fetchProducts();
  };

  const openNewProductModal = () => {
    setEditingId(null);
    setFormData({
      nome: '', descricao: '', preco: '', preco_antigo: '', id_categoria: 1,
      imagem_url: '', imagem_url_2: '', imagem_url_3: '',
      destaque: false, ativo: true, badge: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  return (
    <div className="container py-5 mt-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2>Painel Administrativo</h2>
        <div className="d-flex gap-2">
            <button onClick={() => navigate('/')} className="btn btn-outline-light">
                Voltar ao Site
            </button>
            <button onClick={openNewProductModal} className="btn btn-success">
                + Novo Produto
            </button>
        </div>
      </div>

      {showModal && (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 10000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '20px', overflowY: 'auto'
        }}>
            <div className="card p-4 bg-dark border-secondary" style={{
                width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'
            }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-white m-0">{editingId ? 'Editar Produto' : 'Criar Novo Produto'}</h4>
                    <button onClick={closeModal} className="btn btn-sm btn-outline-secondary">X</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Nome</label>
                            <input type="text" className="form-control bg-secondary text-white border-0" name="nome" value={formData.nome} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Preço</label>
                            <input type="number" step="0.01" className="form-control bg-secondary text-white border-0" name="preco" value={formData.preco} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Preço Antigo</label>
                            <input type="number" step="0.01" className="form-control bg-secondary text-white border-0" name="preco_antigo" value={formData.preco_antigo} onChange={handleInputChange} />
                        </div>

                        <div className="col-md-8">
                            <label className="form-label">Descrição</label>
                            <textarea className="form-control bg-secondary text-white border-0" rows="2" name="descricao" value={formData.descricao} onChange={handleInputChange}></textarea>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Categoria</label>
                            <select className="form-select bg-secondary text-white border-0" name="id_categoria" value={formData.id_categoria} onChange={handleInputChange}>
                                <option value="1">Geral</option>
                                <option value="2">Mouses</option>
                                <option value="3">Teclados</option>
                                <option value="4">Áudio</option>
                                <option value="5">Decoração</option>
                                <option value="6">Colecionáveis</option>
                                <option value="7">Diversos</option>
                            </select>
                        </div>

                        <div className="col-12 border-top border-secondary pt-3">
                            <h6 className="text-warning">Imagens (Upload Automático)</h6>
                            {uploading && <div className="text-info small mb-2">Enviando imagem... aguarde...</div>}
                            
                            <div className="row g-2">
                                <div className="col-md-4">
                                    <label className="small">Capa</label>
                                    <input type="file" accept="image/*" className="form-control form-control-sm bg-secondary text-white border-0" onChange={(e) => handleImageUpload(e, 'imagem_url')} />
                                    <ImagePreview url={formData.imagem_url} label="Capa" />
                                </div>
                                <div className="col-md-4">
                                    <label className="small">Galeria 1</label>
                                    <input type="file" accept="image/*" className="form-control form-control-sm bg-secondary text-white border-0" onChange={(e) => handleImageUpload(e, 'imagem_url_2')} />
                                    <ImagePreview url={formData.imagem_url_2} label="Galeria 1" />
                                </div>
                                <div className="col-md-4">
                                    <label className="small">Galeria 2</label>
                                    <input type="file" accept="image/*" className="form-control form-control-sm bg-secondary text-white border-0" onChange={(e) => handleImageUpload(e, 'imagem_url_3')} />
                                    <ImagePreview url={formData.imagem_url_3} label="Galeria 2" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Badge (Etiqueta)</label>
                            <input type="text" className="form-control bg-secondary text-white border-0" name="badge" value={formData.badge} onChange={handleInputChange} />
                        </div>

                        <div className="col-md-4 d-flex align-items-center pt-4">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" name="destaque" checked={formData.destaque} onChange={handleInputChange} />
                                <label className="form-check-label">Destaque</label>
                            </div>
                        </div>
                        
                        <div className="col-md-4 d-flex align-items-center pt-4">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" name="ativo" checked={formData.ativo} onChange={handleInputChange} />
                                <label className="form-check-label">Ativo</label>
                            </div>
                        </div>

                        <div className="col-12 mt-4 d-flex gap-2">
                            <button type="submit" className="btn btn-success flex-grow-1" disabled={loading || uploading}>
                                {loading ? 'Salvando...' : 'Salvar Produto'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}

      <h4 className="mb-3">Produtos Cadastrados ({products.length})</h4>
      <div className="table-responsive">
        <table className="table table-dark table-hover border-secondary align-middle">
          <thead>
            <tr>
              <th>Img</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                    <img src={p.imagem_url || 'https://via.placeholder.com/40'} alt="" style={{width: 40, height: 40, objectFit: 'cover', borderRadius: 4}} />
                </td>
                <td>
                    <div className="fw-bold text-truncate" style={{maxWidth: '150px'}}>{p.nome}</div>
                    <small className="text-secondary">{p.ativo ? '🟢 Ativo' : '🔴 Inativo'}</small>
                </td>
                <td>R$ {p.preco}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(p)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
