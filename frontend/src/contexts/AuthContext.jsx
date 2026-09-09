import { createContext, useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { ENDPOINTS, ROLES, STORAGE_KEYS } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(ROLES.GUEST);
  const [loading, setLoading] = useState(true);
  const { request } = useApi();

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(parsedUser.role || ROLES.MEMBER);
      } catch (err) {
        console.error('Failed to parse user from localStorage:', err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await request({
      url: ENDPOINTS.AUTH.LOGIN,
      method: 'POST',
      data: credentials,
    });
    const userData = data.data.user;

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
    setRole(userData.role || ROLES.MEMBER);
    return data;
  };

  const register = async (registerData) => {
    const data = await request({
      url: ENDPOINTS.AUTH.REGISTER,
      method: 'POST',
      data: registerData,
    });
    return data;
  };

  const verifyEmail = async (verifyData) => {
    const data = await request({
      url: ENDPOINTS.AUTH.VERIFY_EMAIL,
      method: 'POST',
      data: verifyData,
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setRole(ROLES.GUEST);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, register, verifyEmail, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};