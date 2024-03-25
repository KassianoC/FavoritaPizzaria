import { useEffect, createContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api, createSession } from '../utils/api';

export const AuthContext = createContext('');

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [admin, setAdmin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [onn, setOnn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        try {
          const response = await api.get('/users/checkuser', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const isAdmin = response.data.isAdmin;
          if (isAdmin) {
            setAdmin(true);
          } else {
            setAuthenticated(true);
            setAdmin(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    checkUser();
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await createSession(email, password);
    console.log(response);
    const token = response.data.token;
    setMsg(response.data.msgLogin || response.data.msg);

    setTimeout(() => {
      setMsg('');
    }, 3000);

    if (!token) {
      setAuthenticated(false);
      return;
    }

    if (token && response.data.user.isAdmin === true) {
      setAuthenticated(true);
      setAdmin(true);
      navigate('/orders');
    }

    localStorage.setItem('token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  };

  const logout = () => {
    api.defaults.headers.Authorization = null;
    localStorage.removeItem('token');
    setAuthenticated(false);
    setAdmin(false);
    navigate('/', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ onn, setOnn, authenticated, admin, loading, msg, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
