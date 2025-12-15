export const CATEGORIES = [
  { id: 'controls', name: 'Controles', icon: '🎮' },
  { id: 'audio', name: 'Áudio', icon: '🎧' },
  { id: 'keyboard', name: 'Teclados', icon: '⌨️' },
  { id: 'mouse', name: 'Mouses', icon: '🖱️' },
  { id: 'decoration', name: 'Decoração', icon: '🪴' },
  { id: 'figures', name: 'Colecionáveis', icon: '🦸' },
  { id: 'others', name: 'Diversos', icon: '🔌' },
];

export const PRODUCTS = [
  { id: 1, nome: 'Controle Wireless X1', category: 'Controles', price: 179.90, preco: 179.90, badge: 'Mais vendido', gradient: 'linear-gradient(135deg, #FFD700, #FFA500)', imagem_url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=500", descricao: "Controle ergonômico com resposta tátil e bateria de longa duração.", opcoes: ["Preto Fosco", "Branco Gelo"] },
  { id: 2, nome: 'Fone AirTone BT', category: 'Áudio', price: 249.90, preco: 249.90, badge: 'Novo', gradient: 'linear-gradient(135deg, #FFD700, #FFA500)', imagem_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500", descricao: "Som de alta fidelidade com cancelamento de ruído ativo.", opcoes: [] },
  { id: 3, nome: 'Teclado Mecânico Pro', category: 'Teclados', price: 349.90, preco: 349.90, gradient: 'linear-gradient(135deg, #FFD700, #FFA500)', imagem_url: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=500", descricao: "Switches mecânicos Blue para máxima precisão e durabilidade.", opcoes: ["Switch Blue", "Switch Red", "Switch Brown"] },
  { id: 4, nome: 'Mouse Viper Ultra', category: 'Mouses', price: 129.90, preco: 129.90, badge: 'Promo', gradient: 'linear-gradient(135deg, #FFD700, #FFA500)', imagem_url: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=500", descricao: "Sensor óptico de 16000 DPI e design ultraleve.", opcoes: ["Preto", "Branco"] },
  { id: 5, nome: 'Smartwatch S3', category: 'Wearables', price: 399.90, preco: 399.90, gradient: 'linear-gradient(135deg, #FFD700, #FFA500)', imagem_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500", descricao: "Monitore saúde, sono e notificações direto no pulso.", opcoes: ["Pulseira Sport", "Pulseira Couro"] },
  { id: 6, nome: 'Action Figure Hero', category: 'Colecionáveis', price: 219.90, preco: 219.90, gradient: 'linear-gradient(135deg, #FFD700, #FFA500)', imagem_url: "https://imgs.search.brave.com/CUmdnGwKrsNpFKOVXBZMRsoCsIkY19pc30IOAYr2VSU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zaW1w/bGVzcHJhdGkuY29t/LmJyL2Nkbi9zaG9w/L2ZpbGVzL3Zlbm9t/LWJvbmVjby0zMGNt/LWFjdGlvbi1maWd1/cmVfMTAyNHgud2Vi/cD92PTE3MjQ3MTU5/MzE", descricao: "Figura de ação rica em detalhes, edição limitada.", opcoes: [] },
  { id: 7, nome: 'Power Bank', category: 'Diversos', price: 219.90, preco: 219.90, gradient: 'linear-gradient(135deg, #FFD700, #FFA500)', imagem_url: "https://imgs.search.brave.com/RtR1F2AfmqtihBAFvUTTo_xcsEyGcsFzFlIKwvtx2HM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/XzkzNDc4My1NTEI3/Njc4OTQzOTMyMF8w/NjIwMjQtVi1wb3dl/ci1iYW5rLTUwMDAt/bWFoLWluZHVjby1t/YWduZXRpY2EtcC1p/cGhvbmUtMTItMTMt/MTQtMTUud2VicA", descricao: "Carregador portátil de alta capacidade.", opcoes: [] },
];

export const PROMO_ITEMS = [
  { id: 7, nome: 'Cadeira Gamer Royale', category: 'Cadeiras', price: 899.90, preco: 899.90, badge: '20% OFF', imagem_url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=500", descricao: "Conforto supremo para longas sessões de jogatina.", opcoes: ["Preta/Vermelha", "Total Black"] },
  { id: 8, nome: 'Webcam Stream 1080p', category: 'Acessórios', price: 229.90, preco: 229.90, badge: 'Live', imagem_url: "https://imgs.search.brave.com/TICBvtqN-6nhT5m4OCD9gaaBoFs2g_1ArF1iwlD0PvU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFuTzZOMUhsb0wu/anBn", descricao: "Qualidade Full HD com anel de luz integrado.", opcoes: [] },
  { id: 9, nome: 'Microfone Studio Pro', category: 'Áudio', price: 159.90, preco: 159.90, badge: 'Oferta', imagem_url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=500", descricao: "Captura de áudio cristalina para podcasts e streams.", opcoes: [] },
  { id: 10, nome: 'Luminária Geek Retro', category: 'Decoração', price: 79.90, preco: 79.90, badge: 'Decor', imagem_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=500", descricao: "Iluminação ambiente temática estilo Cyberpunk.", opcoes: ["Neon Azul", "Neon Roxo"] },
];