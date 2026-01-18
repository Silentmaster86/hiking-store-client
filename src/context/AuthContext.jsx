import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready

  async function refresh() {
    try {
      const data = await authApi.getMe();
      setUser(data?.user || null);
    } finally {
      setStatus("ready");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(payload) {
    const data = await authApi.login(payload);
    setUser(data?.user || null);
    return data;
  }

  async function register(payload) {
    const data = await authApi.register(payload);
    setUser(data?.user || null);
    return data;
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
    await refresh(); // bo logout tworzy guest cart w sesji
  }

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
