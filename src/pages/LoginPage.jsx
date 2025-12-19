import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Erro ao entrar: " + error.message);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>
      <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', padding: '20px', border: '1px solid #333', borderRadius: '8px'}}>
        <h2 style={{textAlign: 'center', color: 'var(--neon-primary)'}}>Admin Login</h2>
        <input 
          type="email" 
          placeholder="Seu Email" 
          value={email} onChange={e => setEmail(e.target.value)}
          style={{padding: '10px', borderRadius: '4px', border: 'none'}}
        />
        <input 
          type="password" 
          placeholder="Sua Senha" 
          value={password} onChange={e => setPassword(e.target.value)}
          style={{padding: '10px', borderRadius: '4px', border: 'none'}}
        />
        <button type="submit" className="btn-neon">ENTRAR</button>
      </form>
    </div>
  );
};

export default LoginPage;