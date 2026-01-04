import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

export const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      
      if (!session) {
        toast.error("Acesso negado. Faça login primeiro!", {
            theme: "dark"
        });
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
        <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#fff'}}>
            Verificando permissões...
        </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};