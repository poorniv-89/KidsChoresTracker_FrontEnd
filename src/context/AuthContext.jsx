import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);
  const [parentId, setParentId] = useState(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem('parentId'); 
    if (storedId) {
      setParentId(storedId);
      setIsParentLoggedIn(true);
    }
  }, []);

  const login = (id) => {
    sessionStorage.setItem('parentId', id); 
    setParentId(id);
    setIsParentLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('parentId');
    setParentId(null);
    setIsParentLoggedIn(false);
    window.location.href = '/'; 
  };

  return (
    <AuthContext.Provider value={{ isParentLoggedIn, parentId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}