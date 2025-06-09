import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);

  useEffect(() => {
    const parentId = localStorage.getItem('parentId');
    if (parentId) {
        setIsParentLoggedIn(true);
      } else {
        setIsParentLoggedIn(false);
      }
  }, []);

  const login = (id) => {
    localStorage.setItem('parentId', id);
    setIsParentLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('parentId');
    setIsParentLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isParentLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}