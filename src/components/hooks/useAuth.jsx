import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "./useSessionStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useSessionStorage("user", null);
  const navigate = useNavigate();

  const login = async (data) => {
    setUser(data);
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
