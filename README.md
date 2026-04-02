# Geek Loop Store

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Uma plataforma de e-commerce completa e responsiva, focada no nicho de periféricos gamers e cultura geek. O projeto foi desenvolvido de ponta a ponta (Front-end e Back-end as a Service) para entregar uma experiência de usuário imersiva, com alto apelo visual e gerenciamento de dados em tempo real.

## Sobre o Projeto

O objetivo da Geek Loop Store foi criar muito mais do que uma vitrine virtual, mas sim uma aplicação web robusta com regras de negócio reais de um e-commerce. A interface adota uma identidade visual "Dark/Neon" utilizando conceitos de *Glassmorphism*, garantindo um design moderno, fluido e totalmente adaptado para dispositivos móveis (Mobile First).

Além da interface do cliente, o projeto conta com um **Painel Administrativo completo e protegido**, permitindo a gestão total da loja sem a necessidade de intervenção direta no banco de dados.

---

## Funcionalidades em Destaque

### Experiência do Cliente (Storefront)
* **Construtor de Combos Dinâmico:** Uma ferramenta interativa onde o cliente seleciona peças específicas (Teclado + Mouse + Headset) para formar um "Setup". O sistema calcula a matemática em tempo real e aplica uma porcentagem de desconto global configurada no banco de dados.
* **Sistema de Avaliações com Mídia:** Os usuários podem deixar reviews com notas e anexar fotos reais dos produtos. As imagens sofrem compressão e otimização automaticamente no próprio navegador (Client-side) antes do upload, poupando banda e armazenamento.
* **Carrinho de Compras Reativo:** Gerenciamento de estado global utilizando a Context API do React, com um menu lateral (Drawer) deslizante.
* **Filtros e Tags Inteligentes:** Produtos em oferta calculam a exibição do desconto automaticamente com base no "Preço Antigo" vs "Preço Atual", além de letreiros animados de destaques.

### Gestão da Loja (Painel Admin)
* **Autenticação e Rota Protegida:** Acesso restrito via sistema de Auth do Supabase, bloqueando usuários não autorizados.
* **CRUD Completo de Produtos:** Interface em cards responsivos para cadastro, edição e inativação de produtos.
* **Moderação de Comentários:** O administrador pode visualizar detalhes das avaliações e excluir comentários/fotos inadequadas.
* **Gerenciamento de Storage Inteligente:** A exclusão de um produto aciona um gatilho que faz a "limpeza profunda", rastreando os links das imagens vinculadas e deletando-as do Bucket (Storage), evitando arquivos órfãos e custos desnecessários de servidor.
* **Configurações Globais:** Alteração de variáveis do sistema (como a % de desconto do combo promocional) direto pelo painel, refletindo instantaneamente no Front-end para os clientes.

---

## Arquitetura e Tecnologias

* **Frontend:** React (construído com Vite para HMR ultrarrápido).
* **Roteamento:** React Router Dom (Single Page Application).
* **Gerenciamento de Estado:** React Context API (Carrinho e Sessão de Usuário).
* **Estilização:** CSS3 puro e customizado (variáveis CSS, animações `@keyframes`, flexbox e CSS Grid), focado na performance sem dependência excessiva de frameworks pesados.
* **Backend as a Service (BaaS):** Supabase
  * **PostgreSQL:** Banco de dados relacional (Tabelas para produtos, categorias, avaliações e configurações).
  * **Storage:** Buckets para armazenamento de imagens.
  * **Autenticação:** Gerenciamento de credenciais do admin.
  * **Segurança (RLS):** *Row Level Security* configurado para permitir leitura pública da loja, mas restringindo modificações, inserções e exclusões exclusivamente para o cargo *Authenticated*.
* **Bibliotecas Auxiliares:** `browser-image-compression` (otimização de imagens) e `react-toastify` (feedback visual não intrusivo).

---

## Aprendizados e Soluções Técnicas

Durante o desenvolvimento deste projeto, alguns dos principais desafios técnicos superados foram:
1. **Otimização de Imagens:** Implementação de compressão *Client-side* via Web Workers, reduzindo imagens de 5MB para menos de 300KB antes de atingirem a rede, melhorando a UX e economizando Storage.
2. **Sincronia de Dados Relacionais:** Queries complexas no Supabase para buscar produtos já com suas respectivas categorias e cálculo de média de avaliações em uma única requisição.
3. **Prevenção de Memory Leaks:** Uso correto de *cleanup functions* em `useEffect` para listeners de autenticação.
4. **UI/UX Avançada:** Abandono de tabelas HTML tradicionais no Admin em prol de uma lista de *Cards Flexíveis*, garantindo que o lojista possa gerenciar o e-commerce perfeitamente da tela de um celular.
