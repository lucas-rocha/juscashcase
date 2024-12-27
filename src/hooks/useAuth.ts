import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};