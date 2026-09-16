import { createContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { ENDPOINTS, ROLES, STORAGE_KEYS } from "../utils/constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(ROLES.GUEST);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await api.get(ENDPOINTS.USERS.ME);
        const userData = response.data?.user;

        setUser(userData);
        setRole(userData.role || ROLES.MEMBER);

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      } catch (err) {
        console.warn("Session expired or invalid");
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
        setRole(ROLES.GUEST);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (credentials) => {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    const data = response.data;
    const userData = data?.user || data?.data?.user || {};

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
    setRole(userData.role || ROLES.MEMBER);
    return data;
  };

  const register = async (registerData) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, registerData);
    return response.data;
  };

  const verifyEmail = async (verifyData) => {
    const response = await api.post(ENDPOINTS.AUTH.VERIFY_EMAIL, verifyData);
    return response.data;
  };

  const forgotPassword = async (emailData) => {
    const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, emailData);
    return response.data;
  };

  const resetPassword = async (resetData) => {
    const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
    return response.data;
  };

  const resendOtp = async (emailData) => {
    const response = await api.post(ENDPOINTS.AUTH.RESEND_OTP, emailData);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.USER);
      setUser(null);
      setRole(ROLES.GUEST);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
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
