import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('auth/profile');
          setUser(data);
        } catch (error) {
          console.error("Token invalid or expired");
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await api.post('auth/register', { name, email, password, role });
    localStorage.setItem('token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Show fullscreen spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF]">
        <div className="flex flex-col items-center gap-3 animate-fade-in-up">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
          <span className="text-sm font-semibold text-[var(--color-text-tertiary)]">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
