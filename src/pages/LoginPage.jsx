import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error('Erro de acesso: Usuário ou senha incorretos.', { theme: "dark" });
    } else {
      toast.success('Bem-vindo ao Painel Admin! 🚀', { theme: "dark" });
      navigate('/admin');
    }
  };

  return (
    <div className="login-wrapper">
      <style>{`
        .login-wrapper {
          min-height: 75vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 20px;
        }

        /* Efeito de Luz Neon no Fundo */
        .login-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: var(--neon-primary);
          filter: blur(150px);
          opacity: 0.15;
          z-index: 0;
          border-radius: 50%;
        }

        /* Caixa de Login Premium */
        .login-card {
          background: rgba(20, 20, 20, 0.85);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-top: 3px solid var(--neon-primary);
          border-radius: 20px;
          padding: 40px 30px;
          width: 100%;
          max-width: 420px;
          z-index: 1;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          animation: slideUpFade 0.4s ease-out;
        }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-title {
          color: #fff;
          font-weight: 800;
          text-align: center;
          margin-bottom: 30px;
          font-size: 1.8rem;
          letter-spacing: -0.5px;
        }

        .login-title span {
          color: var(--neon-primary);
        }

        /* Inputs Escuros */
        .login-input {
          background: #111 !important;
          border: 1px solid #333 !important;
          color: #fff !important;
          padding: 15px;
          border-radius: 10px;
          transition: all 0.3s ease;
          width: 100%;
          margin-bottom: 15px;
        }

        .login-input:focus {
          border-color: var(--neon-primary) !important;
          box-shadow: 0 0 15px rgba(255, 193, 7, 0.15) !important;
          outline: none;
        }

        .login-input::placeholder {
          color: #666 !important;
        }

        .login-label {
          color: #aaa;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Botão Moderno */
        .login-btn {
          background: var(--neon-primary);
          color: #000;
          font-weight: 900;
          border: none;
          padding: 16px;
          border-radius: 10px;
          width: 100%;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 15px;
          box-shadow: 0 5px 15px rgba(255, 193, 7, 0.2);
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 193, 7, 0.4);
        }

        .login-btn:disabled {
          background: #555;
          color: #888;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>

      <div className="login-glow"></div>
      <div className="login-card">
        <h2 className="login-title">
          <span>Admin</span> Login
        </h2>
        
        <form onSubmit={handleLogin}>
          <div>
            <label className="login-label">E-mail de Acesso</label>
            <input
              type="email"
              className="login-input"
              placeholder="contato@geekloop.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="login-label">Senha</label>
            <input
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'AUTENTICANDO...' : 'ENTRAR NO PAINEL'}
          </button>
        </form>

        <div className="text-center mt-4">
           <p className="small text-secondary m-0">
             Acesso restrito a administradores.
           </p>
        </div>
      </div>
    </div>
  );
}