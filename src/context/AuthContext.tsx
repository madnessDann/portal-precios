import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState } from '../types';
import {
  validateClientCode,
  validateAdminPassword,
  getStoredClient,
  isAdminAuthenticated,
  logoutClient,
  logoutAdmin,
} from '../services/auth';

interface AuthContextType extends AuthState {
  loginClient: (codigo: string) => Promise<boolean>;
  loginAdmin: (password: string) => boolean;
  logout: () => void;
  logoutFromAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    client: null,
    isAdmin: false,
  });

  useEffect(() => {
    const storedClient = getStoredClient();
    const adminAuth = isAdminAuthenticated();

    setState({
      isAuthenticated: !!storedClient,
      client: storedClient,
      isAdmin: adminAuth,
    });
  }, []);

  const loginClient = async (codigo: string): Promise<boolean> => {
    const client = await validateClientCode(codigo);

    if (client) {
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        client,
      }));
      return true;
    }

    return false;
  };

  const loginAdmin = (password: string): boolean => {
    const isValid = validateAdminPassword(password);

    if (isValid) {
      setState(prev => ({
        ...prev,
        isAdmin: true,
      }));
    }

    return isValid;
  };

  const logout = () => {
    logoutClient();
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      client: null,
    }));
  };

  const logoutFromAdmin = () => {
    logoutAdmin();
    setState(prev => ({
      ...prev,
      isAdmin: false,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginClient,
        loginAdmin,
        logout,
        logoutFromAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
