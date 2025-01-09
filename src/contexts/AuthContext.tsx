import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, USERS } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user && user.role !== 'guest') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const login = (username: string, password: string) => {
    const userEntry = Object.values(USERS).find(
      u => u.username === username && u.password === password
    );

    if (userEntry) {
      setUser({ username: userEntry.username, role: userEntry.role });
      // For guest users, don't save to localStorage
      if (userEntry.role !== 'guest') {
        localStorage.setItem('user', JSON.stringify({ 
          username: userEntry.username, 
          role: userEntry.role 
        }));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    const isGuest = user?.role === 'guest';
    setUser(null);
    localStorage.removeItem('user');
    
    // If it's a guest user, clear all application data
    if (isGuest) {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear IndexedDB databases
      window.indexedDB.databases().then((databases) => {
        databases.forEach((database) => {
          if (database.name) {
            window.indexedDB.deleteDatabase(database.name);
          }
        });
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};