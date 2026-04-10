import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [requirePasswordChange, setRequirePasswordChange] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.firstLogin) {
        setRequirePasswordChange(true);
      }
    }
  }, []);

  const login = (data: any) => {
    localStorage.setItem("token", data.token.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    if (data.user.firstLogin) {
      setRequirePasswordChange(true);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRequirePasswordChange(false);
  };

  const markPasswordChanged = () => {
    setRequirePasswordChange(false);
    const updatedUser = { ...user, firstLogin: false };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, requirePasswordChange, markPasswordChanged }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);