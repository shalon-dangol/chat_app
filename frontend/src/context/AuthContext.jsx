import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      connectSocket(storedToken);
    }

    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { user: userData, token: userToken } = response.data.data;

    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
    connectSocket(userToken);
  };

  const register = async (username, email, password) => {
    const response = await authAPI.register({ username, email, password });
    const { user: userData, token: userToken } = response.data.data;

    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
    connectSocket(userToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    disconnectSocket();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};