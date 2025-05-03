import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [currentUser, setCurrentUser] = useState(() => {
    const email = localStorage.getItem('userEmail');
    return email ? { email } : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('authToken', token);
    if (currentUser?.email) localStorage.setItem('userEmail', currentUser.email);
  }, [token, currentUser]);

  return (
    <AuthContext.Provider value={{ token, setToken, currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);