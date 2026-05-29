import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from '../services/api';
import ws from '../services/websocket';

interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<string | null>;
  register: (nome: string, email: string, senha: string, role?: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, senha: string): Promise<string | null> => {
    setLoading(true);
    const response = await api.login(email, senha);
    setLoading(false);

    if (response.error) {
      return response.error;
    }

    if (response.data) {
      const { user: userData, token: newToken } = response.data;
      setUser(userData);
      setToken(newToken);
      api.setToken(newToken);
      ws.connect(newToken);
      return null;
    }

    return 'Erro desconhecido';
  }, []);

  const register = useCallback(async (nome: string, email: string, senha: string, role: string = 'usuario'): Promise<string | null> => {
    setLoading(true);
    const response = await api.register(nome, email, senha, role);
    setLoading(false);

    if (response.error) {
      return response.error;
    }

    if (response.data) {
      const { user: userData, token: newToken } = response.data;
      setUser(userData);
      setToken(newToken);
      api.setToken(newToken);
      ws.connect(newToken);
      return null;
    }

    return 'Erro desconhecido';
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    api.setToken(null);
    ws.disconnect();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
