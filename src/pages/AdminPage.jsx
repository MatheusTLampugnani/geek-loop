import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

const SettingsIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>);
const EditIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const TrashIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);
const EyeIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>);
const BoxIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>);
const PlusIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const LogOutIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>);
const StatusDot = ({ active }) => (<span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: active ? '#28a745' : '#dc3545', marginRight: 6 }}></span>);

const ImagePreview = ({ url, label }) => {
  if (!url) return null;
  return (
    <div className="mt-2 mb-3">
      <p className="small text-secondary mb-1">Prévia de {label}:</p>
      <img src={url} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid #333', borderRadius: '8px', background: '#000' }} />
    </div>
  );
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const [comboDiscount, setComboDiscount] = useState(10);
  const [savingConfig, setSavingConfig] = useState(false);

  const [formData, setFormData] = useState({
    nome: '', descricao: '', preco: '', preco_antigo: '', id_categoria: 1, 
    imagem_url: '', imagem_url_2: '', imagem_url_3: '',
    destaque: false, ativo: true, badge: '', opcoes: ''
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (showModal || selectedReview) document.body.style.overflow = 'hidden'; 
    else document.body.style.overflow = ''; 
    return () => { document.body.style.overflow = ''; };
  }, [showModal, selectedReview]);

  useEffect(() => {
    fetchProducts(); fetchAllReviews(); fetchConfig(); 
  }, []);

  const fetchConfig = async () => {
    const { data } = await supabase.from('configuracoes').select('*').eq('id', 1).single();
    if (data && data.desconto_combo) setComboDiscount(data.desconto_combo);
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    const { error } = await supabase.from('configuracoes').upsert({ id: 1, desconto_combo: parseInt(comboDiscount) });
    setSavingConfig(false);
    
    if (error) toast.error("Erro ao salvar configuração.", { theme: "dark" });
    else toast.success("Desconto atualizado com sucesso!", { theme: "dark" });
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('produtos').select('*').order('id', { ascending: false });
    if (!error) setProducts(data);
    setLoading(false);
  };

  const fetchAllReviews = async () => {
    const { data, error } = await supabase.from('avaliacoes').select(`*, produtos (nome)`).order('created_at', { ascending: false });
    if (!error) setReviews(data || []);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e, fieldName) => {
    try {
      const imageFile = e.target.files[0];
      if (!imageFile) return;

      setUploading(true);
      toast.info("Otimizando imagem...", { theme: "dark", autoClose: 2000 });

      const options = { maxSizeMB: 0.3, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressedFile = await imageCompression(imageFile, options);
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('imagens-produtos').upload(fileName, compressedFile);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('imagens-produtos').getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, [fieldName]: data.publicUrl }));
      toast.success("Imagem salva com sucesso!", { theme: "dark", autoClose: 2000 });

    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload. Tente novamente.', { theme: "dark" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let opcoesArray = null;
    if (formData.opcoes && formData.opcoes.trim() !== '') opcoesArray = formData.opcoes.split(',').map(opt => opt.trim()).filter(opt => opt !== '');

    const payload = {
      nome: formData.nome, descricao: formData.descricao, preco: parseFloat(formData.preco),
      preco_antigo: formData.preco_antigo ? parseFloat(formData.preco_antigo) : null,
      id_categoria: parseInt(formData.id_categoria), imagem_url: formData.imagem_url,
      imagem_url_2: formData.imagem_url_2, imagem_url_3: formData.imagem_url_3,
      destaque: formData.destaque, ativo: formData.ativo, badge: formData.badge, opcoes: opcoesArray 
    };

    let error;
    if (editingId) {
      const { error: err } = await supabase.from('produtos').update(payload).eq('id', editingId); error = err;
    } else {
      const { error: err } = await supabase.from('produtos').insert([payload]); error = err;
    }

    setLoading(false);

    if (error) {
      toast.error('Erro ao salvar: ' + error.message, { theme: "dark" });
    } else {
      toast.success(editingId ? 'Produto atualizado!' : 'Produto criado com sucesso!', { theme: "dark" });
      closeModal(); 
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    let opcoesString = '';
    if (Array.isArray(product.opcoes)) opcoesString = product.opcoes.join(', ');

    setFormData({
      nome: product.nome, descricao: product.descricao || '', preco: product.preco,
      preco_antigo: product.preco_antigo || '', id_categoria: product.id_categoria,
      imagem_url: product.imagem_url || '', imagem_url_2: product.imagem_url_2 || '',
      imagem_url_3: product.imagem_url_3 || '', destaque: product.destaque, ativo: product.ativo,
      badge: product.badge || '', opcoes: opcoesString
    });
    setShowModal(true); 
  };

  const handleDelete = async (product) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto E todas as imagens dele?')) return;
    setLoading(true);
    try {
        const pathsToDelete = [];
        const extractFileName = (url) => {
            if (!url) return null;
            const parts = url.split('/');
            return parts[parts.length - 1]; 
        };
        const img1 = extractFileName(product.imagem_url);
        const img2 = extractFileName(product.imagem_url_2);
        const img3 = extractFileName(product.imagem_url_3);

        if (img1) pathsToDelete.push(img1);
        if (img2) pathsToDelete.push(img2);
        if (img3) pathsToDelete.push(img3);

        if (pathsToDelete.length > 0) {
            await supabase.storage.from('imagens-produtos').remove(pathsToDelete);
        }

        const { error: dbError } = await supabase.from('produtos').delete().eq('id', product.id);
        if (dbError) throw dbError;

        toast.info("Produto e imagens removidos com sucesso! 🧹", { theme: "dark" });
        fetchProducts(); 
    } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir produto.", { theme: "dark" });
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) return;
    const { error } = await supabase.from('avaliacoes').delete().eq('id', id);
    if (!error) { toast.info("Avaliação removida.", { theme: "dark" }); fetchAllReviews(); } 
    else { toast.error("Erro ao excluir avaliação.", { theme: "dark" }); }
  };

  const openNewProductModal = () => {
    setEditingId(null);
    setFormData({ nome: '', descricao: '', preco: '', preco_antigo: '', id_categoria: 1, imagem_url: '', imagem_url_2: '', imagem_url_3: '', destaque: false, ativo: true, badge: '', opcoes: '' });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingId(null); };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Você saiu do painel.", { theme: "dark" });
    navigate('/');
  };

  return (
    <div className="container py-5 mt-5 text-white">
      <style>{`
        .admin-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 10000; display: flex; justify-content: center; align-items: center; padding: 15px; }
        .admin-modal-content { background: #121212; width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto; border-radius: 16px; border: 1px solid #333; box-shadow: 0 10px 40px rgba(0,0,0,0.7); display: flex; flex-direction: column; }
        .admin-modal-content::-webkit-scrollbar { width: 6px; } .admin-modal-content::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
        .admin-input { background-color: #1a1a1a !important; border: 1px solid #333 !important; color: #fff !important; border-radius: 8px; padding: 12px 15px; transition: all 0.2s; }
        .admin-input:focus { border-color: var(--neon-primary) !important; box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.15) !important; }
        .admin-label { font-size: 0.8rem; color: #bbb; margin-bottom: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .admin-file-input::file-selector-button { background: #333; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; margin-right: 10px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
        .admin-file-input::file-selector-button:hover { background: var(--neon-primary); color: #000; }
        
        /* NOVO: ESTILO DAS LISTAS (SUBSTITUI AS TABELAS) */
        .admin-card-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 3rem; }
        .admin-list-item {
            background: #151515; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
            padding: 15px; display: flex; align-items: center; justify-content: space-between; gap: 15px;
            transition: border-color 0.2s, background 0.2s;
        }
        .admin-list-item:hover { border-color: rgba(255, 193, 7, 0.4); background: #1a1a1a; }
        .item-img { width: 55px; height: 55px; border-radius: 8px; object-fit: cover; background: #080808; border: 1px solid #333; flex-shrink: 0; }
        .item-info { flex-grow: 1; min-width: 0; }
        .item-title { color: #fff; font-weight: 700; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
        .item-meta { font-size: 0.8rem; color: #aaa; display: flex; align-items: center; }
        .item-actions { display: flex; gap: 8px; flex-shrink: 0; }

        @media (max-width: 768px) { 
            .admin-modal-overlay { padding: 0; align-items: flex-end; } 
            .admin-modal-content { border-radius: 20px 20px 0 0; max-height: 92vh; border-bottom: none; } 
            .admin-modal-header { position: sticky; top: 0; background: rgba(18, 18, 18, 0.95); backdrop-filter: blur(10px); z-index: 10; padding: 20px !important; border-bottom: 1px solid #222 !important; } 
            
            /* Ajuste da lista pro Celular (Os botões descem) */
            .admin-list-item { flex-direction: column; align-items: stretch; gap: 12px; padding: 12px; }
            .item-actions { justify-content: flex-end; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); width: 100%; }
            .item-actions .btn { padding: 8px 16px; } /* Botões maiores pra clicar com o dedo */
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2>Painel Admin</h2>
        <div className="d-flex gap-2">
            <button onClick={() => navigate('/')} className="btn btn-outline-light">Ver Loja</button>
            <button onClick={openNewProductModal} className="btn btn-success fw-bold d-flex align-items-center gap-1"><PlusIcon /> Novo</button>
            <button onClick={handleLogout} className="btn btn-outline-danger fw-bold d-flex align-items-center gap-1"><LogOutIcon /> Sair</button>
        </div>
      </div>

      <div className="card bg-dark border-secondary mb-5 p-4 rounded-4 shadow-sm">
        <h5 className="text-warning mb-3 d-flex align-items-center gap-2"><SettingsIcon /> Configurações da Loja</h5>
        <div className="row align-items-end g-3">
            <div className="col-md-4 col-8">
                <label className="admin-label text-white">Desconto do Combo (%)</label>
                <div className="input-group">
                    <input type="number" className="form-control admin-input" value={comboDiscount} onChange={(e) => setComboDiscount(e.target.value)} min="0" max="100" />
                    <span className="input-group-text bg-secondary border-secondary text-white">%</span>
                </div>
            </div>
            <div className="col-md-3 col-4">
                <button className="btn btn-warning w-100 py-2 fw-bold" onClick={handleSaveConfig} disabled={savingConfig}>
                    {savingConfig ? 'Salvo!' : 'Salvar'}
                </button>
            </div>
        </div>
        <small className="text-secondary mt-2 d-block">Este valor altera automaticamente a promoção da Home e o carrinho do cliente.</small>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={(e) => { if(e.target.className === 'admin-modal-overlay') closeModal(); }}>
            <div className="admin-modal-content animate-pop">
                <div className="admin-modal-header d-flex justify-content-between align-items-center p-4 border-bottom border-secondary">
                    <h4 className="text-white m-0 fw-bold">{editingId ? 'Editar Produto' : 'Criar Novo Produto'}</h4>
                    <button onClick={closeModal} className="btn btn-sm btn-dark border-secondary" style={{width: '36px', height: '36px', borderRadius: '50%'}}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="row g-4">
                        <div className="col-12">
                            <label className="admin-label">Nome do Produto</label>
                            <input type="text" className="form-control admin-input" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Ex: Headset Gamer 7.1" required />
                        </div>
                        <div className="col-6">
                            <label className="admin-label">Preço (R$)</label>
                            <input type="number" step="0.01" className="form-control admin-input" name="preco" value={formData.preco} onChange={handleInputChange} placeholder="0.00" required />
                        </div>
                        <div className="col-6">
                            <label className="admin-label">Preço Antigo (R$)</label>
                            <input type="number" step="0.01" className="form-control admin-input" name="preco_antigo" value={formData.preco_antigo} onChange={handleInputChange} placeholder="Opcional" />
                        </div>
                        <div className="col-12">
                            <label className="admin-label">Categoria</label>
                            <select className="form-select admin-input" name="id_categoria" value={formData.id_categoria} onChange={handleInputChange}>
                                <option value="1">Geral</option><option value="2">Mouses</option><option value="3">Teclados</option>
                                <option value="4">Áudio</option><option value="5">Decoração</option><option value="6">Colecionáveis</option><option value="7">Diversos</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="admin-label">Opções (Separado por vírgula)</label>
                            <input type="text" className="form-control admin-input" name="opcoes" value={formData.opcoes} onChange={handleInputChange} placeholder="Ex: Verde, Roxo, P, M, G" />
                            <small className="text-secondary mt-1 d-block" style={{fontSize: '0.75rem'}}>Cria botões de escolha no carrinho.</small>
                        </div>
                        <div className="col-12">
                            <label className="admin-label">Descrição</label>
                            <textarea className="form-control admin-input" rows="4" name="descricao" value={formData.descricao} onChange={handleInputChange} placeholder="Detalhes do produto..."></textarea>
                        </div>

                        <div className="col-12 border-top border-secondary pt-4 mt-2">
                            <h6 className="text-warning fw-bold mb-3">Imagens (Envio Automático)</h6>
                            {uploading && <div className="text-info small mb-3">Aguarde, processando...</div>}
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="admin-label">Capa Principal</label>
                                    <input type="file" accept="image/*" className="form-control admin-input admin-file-input p-2" onChange={(e) => handleImageUpload(e, 'imagem_url')} />
                                    <ImagePreview url={formData.imagem_url} label="Capa" />
                                </div>
                                <div className="col-md-4">
                                    <label className="admin-label">Galeria 1</label>
                                    <input type="file" accept="image/*" className="form-control admin-input admin-file-input p-2" onChange={(e) => handleImageUpload(e, 'imagem_url_2')} />
                                    <ImagePreview url={formData.imagem_url_2} label="Galeria 1" />
                                </div>
                                <div className="col-md-4">
                                    <label className="admin-label">Galeria 2</label>
                                    <input type="file" accept="image/*" className="form-control admin-input admin-file-input p-2" onChange={(e) => handleImageUpload(e, 'imagem_url_3')} />
                                    <ImagePreview url={formData.imagem_url_3} label="Galeria 2" />
                                </div>
                            </div>
                        </div>

                        <div className="col-12 border-top border-secondary pt-4">
                             <label className="admin-label">Badge (Etiqueta Flutuante)</label>
                             <input type="text" className="form-control admin-input" name="badge" value={formData.badge} onChange={handleInputChange} placeholder="Ex: LANÇAMENTO, 50% OFF" />
                        </div>

                        <div className="col-12 d-flex gap-4 pt-2 pb-3">
                            <div className="form-check form-switch fs-5">
                                <input className="form-check-input" type="checkbox" name="destaque" checked={formData.destaque} onChange={handleInputChange} />
                                <label className="form-check-label text-white ms-2" style={{fontSize: '1rem'}}>Produto Destaque</label>
                            </div>
                            <div className="form-check form-switch fs-5">
                                <input className="form-check-input" type="checkbox" name="ativo" checked={formData.ativo} onChange={handleInputChange} />
                                <label className="form-check-label text-white ms-2" style={{fontSize: '1rem'}}>Ativo na Loja</label>
                            </div>
                        </div>

                        <div className="col-12 mt-2">
                            <button type="submit" className="btn btn-success w-100 py-3 fw-bold fs-5 shadow" disabled={loading || uploading}>
                                {loading ? 'Salvando...' : 'SALVAR PRODUTO'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}

      {selectedReview && (
        <div className="admin-modal-overlay" onClick={(e) => { if(e.target.className === 'admin-modal-overlay') setSelectedReview(null); }}>
            <div className="admin-modal-content animate-pop" style={{ maxWidth: '500px', height: 'auto', maxHeight: '85vh' }}>
                <div className="admin-modal-header d-flex justify-content-between align-items-center p-4 border-bottom border-secondary">
                    <h5 className="text-white m-0 fw-bold">Detalhes da Avaliação</h5>
                    <button onClick={() => setSelectedReview(null)} className="btn btn-sm btn-dark border-secondary" style={{width: '36px', height: '36px', borderRadius: '50%'}}>&times;</button>
                </div>
                
                <div className="p-4 text-white">
                    <div className="mb-4">
                        <span className="admin-label">Cliente</span>
                        <div className="fs-5 fw-bold">{selectedReview.nome_usuario || 'Anônimo'}</div>
                    </div>
                    <div className="mb-4">
                        <span className="admin-label">Produto</span>
                        <div className="fs-6 text-info fw-bold">{selectedReview.produtos?.nome || 'Produto não encontrado'}</div>
                    </div>
                    <div className="mb-4">
                        <span className="admin-label">Nota</span>
                        <div className="text-warning fs-5">
                            {'★'.repeat(selectedReview.nota)}{'☆'.repeat(5 - selectedReview.nota)} 
                            <span className="text-secondary ms-2" style={{fontSize: '0.9rem'}}>({selectedReview.nota}/5)</span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <span className="admin-label">Data</span>
                        <div className="text-light">
                            {new Date(selectedReview.created_at).toLocaleDateString('pt-BR')} às {new Date(selectedReview.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                    <div className="mb-4">
                        <span className="admin-label">Comentário Completo</span>
                        <div className="p-3 bg-dark rounded border border-secondary mt-2 text-light" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {selectedReview.comentario || 'Nenhum comentário.'}
                        </div>
                    </div>
                    
                    {selectedReview.imagem_url && (
                        <div className="mb-4">
                            <span className="admin-label">Foto Anexada</span>
                            <div className="mt-2 text-center bg-dark rounded border border-secondary p-2">
                                <img src={selectedReview.imagem_url} alt="Foto da Avaliação" style={{maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', objectFit: 'contain'}} />
                            </div>
                        </div>
                    )}
                    
                    <button className="btn btn-danger w-100 fw-bold py-3 mt-3 d-flex align-items-center justify-content-center gap-2" onClick={() => { handleDeleteReview(selectedReview.id); setSelectedReview(null); }}>
                        <TrashIcon /> APAGAR AVALIAÇÃO
                    </button>
                </div>
            </div>
        </div>
      )}

      <h4 className="mb-3 mt-4">Produtos Cadastrados ({products.length})</h4>
      <div className="admin-card-list">
        {products.map(p => (
            <div key={p.id} className="admin-list-item">
                <div className="d-flex align-items-center gap-3 w-100" style={{minWidth: 0}}>
                    <img src={p.imagem_url || 'https://via.placeholder.com/60'} alt={p.nome} className="item-img" />
                    <div className="item-info">
                        <div className="item-title" title={p.nome}>{p.nome}</div>
                        <div className="item-meta">
                            <StatusDot active={p.ativo} /> {p.ativo ? 'Ativo' : 'Inativo'}
                            <span className="ms-3 text-warning fw-bold">R$ {p.preco.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="item-actions">
                    <button className="btn btn-sm btn-primary" onClick={() => handleEdit(p)} title="Editar"><EditIcon /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p)} title="Excluir"><TrashIcon /></button>
                </div>
            </div>
        ))}
        {products.length === 0 && <div className="text-center text-secondary py-4">Nenhum produto cadastrado.</div>}
      </div>

      <h4 className="mb-3 mt-5 pt-3 border-top border-secondary">Avaliações dos Clientes ({reviews.length})</h4>
      <div className="admin-card-list">
        {reviews.map(rev => (
            <div key={rev.id} className="admin-list-item">
                <div className="item-info w-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <div className="item-title">{rev.nome_usuario || 'Anônimo'}</div>
                            <div className="text-warning small">{'★'.repeat(rev.nota)}{'☆'.repeat(5 - rev.nota)}</div>
                        </div>
                        <div className="d-none d-md-flex gap-2">
                            <button className="btn btn-sm btn-info" onClick={() => setSelectedReview(rev)} title="Ver Detalhes"><EyeIcon /></button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteReview(rev.id)} title="Apagar"><TrashIcon /></button>
                        </div>
                    </div>
                    
                    <div className="text-secondary small mb-2 d-flex align-items-center gap-1 text-truncate">
                        <BoxIcon /> {rev.produtos?.nome || 'Produto apagado'}
                    </div>
                    
                    <div className="p-2 bg-dark rounded border border-secondary text-light small text-truncate">
                        "{rev.comentario}"
                    </div>
                    
                    {rev.imagem_url && (
                        <img src={rev.imagem_url} alt="Anexo" className="mt-2 rounded" style={{width: '40px', height: '40px', objectFit: 'cover', border: '1px solid #444'}} />
                    )}

                    <div className="item-actions d-md-none mt-2 pt-2 border-top border-secondary w-100 justify-content-end">
                         <button className="btn btn-sm btn-info px-3" onClick={() => setSelectedReview(rev)}><EyeIcon /></button>
                         <button className="btn btn-sm btn-danger px-3" onClick={() => handleDeleteReview(rev.id)}><TrashIcon /></button>
                    </div>
                </div>
            </div>
        ))}
        {reviews.length === 0 && <div className="text-center text-secondary py-4">Nenhuma avaliação encontrada.</div>}
      </div>

    </div>
  );
}