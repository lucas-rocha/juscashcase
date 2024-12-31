import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { api } from "../services/api";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useNavigate } from 'react-router-dom';


interface AuthContextType {
  isAuthenticated: boolean;
  login: (data: LogInData) => void;
  logout: () => void;
  loading: boolean;
}

type LogInData = {
  email: string;
  password: string;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    const { "@juscash.token": token } = parseCookies();
    console.log("meu token", token)
    if (token) {
      api.defaults.headers["x-access-token"] = token;
      setIsAuthenticated(true); // Se o token existir, considera o usuário autenticado
    }

    setLoading(false)
  }, []);

  const login = async ({ email, password }: LogInData ) => {
    const response = await api.post('users/login', {
      email,
      password
    })
    
    const { token } = await response.data.user
    
    setCookie(undefined, '@juscash.token', token, {
      maxAge: 60 * 60 * 1
    })
    
    api.defaults.headers['x-access-token'] = token
    
    setIsAuthenticated(true);
    navigate('/')
  }

  const logout = () => {
    destroyCookie(undefined, "@juscash.token")
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
