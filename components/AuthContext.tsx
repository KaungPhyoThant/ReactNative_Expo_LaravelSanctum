import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn as authSignIn, signOut as authSignOut, signUp as authSignUp, getCurrentUser, initializeAuth } from '../lib/auth';

interface User {
  id: number;
  name: string;
  username: string;
  user_role?: string;
  gender?: string;
  address?: string;
  dob: string | Date;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (name: string, username: string, password: string, passwordConfirmation: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuthState();
  }, []);

  const initializeAuthState = async () => {
    try {
      await initializeAuth();
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const { user: userData } = await authSignIn(username, password);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (name: string, username: string, password: string, passwordConfirmation: string) => {
    try {
      const { user: userData } = await authSignUp(name, username, password, passwordConfirmation);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authSignOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear user state even if API call fails
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Refresh user failed:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
