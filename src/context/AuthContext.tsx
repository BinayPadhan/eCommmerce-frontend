"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getToken, removeToken } from "@/utils/authCookies";
import { getCurrentUser } from "@/lib/api/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  user: any;
  loading: boolean;
  token: string | null;
  logout: () => void;
  login: (userData: any) => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const currentToken = getToken();
    setToken(currentToken || null);
    
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    getCurrentUser(currentToken)
      .then((res) => {
        setUser(res);
      })
      .catch(() => {
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    removeToken(); 
    setUser(null);
    setToken(null);
    window.location.reload();
  };

  const login = (userData: any) => {
    setUser(userData);
    setToken(getToken() || null);
  };

  const getCurrentToken = () => {
    return getToken() || null;
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn: !!user, 
      user, 
      loading, 
      token,
      logout, 
      login,
      getToken: getCurrentToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
