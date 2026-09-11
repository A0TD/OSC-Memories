import { createContext, useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { ENDPOINTS, ROLES, STORAGE_KEYS } from '../utils/constants';
import axios from 'axios';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(ROLES.GUEST);
  const [loading, setLoading] = useState(true);
  const { request } = useApi();

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedToken = localStorage.getItem('token');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // دمج التوكن داخل كائن المستخدم لضمان توفره عبر user.token
        const userWithToken = {
          ...parsedUser,
          token: parsedUser.token || savedToken || '',
        };
        setUser(userWithToken);
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

    const userData = data?.data?.user || data?.user || {};
    const token = data?.data?.token || data?.token || userData?.token;

    // دمج التوكن مع بيانات المستخدم
    const userWithToken = { ...userData, token };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithToken));
    if (token) {
      localStorage.setItem('token', token);
    }

    setUser(userWithToken);
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

  const forgotPassword = async (emailData) => {
    const data = await request({
      url: ENDPOINTS.AUTH.FORGOT_PASSWORD,
      method: 'POST',
      data: emailData,
    });
    return data;
  };

  const resetPassword = async (resetData) => {
    const data = await request({
      url: ENDPOINTS.AUTH.RESET_PASSWORD,
      method: 'POST',
      data: resetData,
    });
    return data;
  };

  const resendOtp = async (emailData) => {
    const data = await request({
      url: ENDPOINTS.AUTH.RESEND_OTP,
      method: 'POST',
      data: emailData,
    });
    return data;
  };

const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:3000/api/auth/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error(error);
  } finally {
    localStorage.removeItem("osc_user");
    setUser(null);
  }
};

  const token = user?.token || localStorage.getItem('token') || '';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        login,
        register,
        verifyEmail,
        forgotPassword,
        resetPassword,
        resendOtp,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};