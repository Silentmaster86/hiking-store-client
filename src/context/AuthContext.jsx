import { useEffect, useState, useCallback, useRef } from "react";
import * as authApi from "../api/auth";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const revision = useRef(0);
  const accept = useCallback((data) => { setUser(data?.user || null); setStatus("ready"); }, []);
  const reject = useCallback((error) => {
    if (error.status === 401) { setUser(null); setStatus("ready"); }
    else setStatus("error");
  }, []);
  const refresh = useCallback(async () => {
    const version = ++revision.current;
    setStatus("loading");
    try { const data = await authApi.getMe(); if (version === revision.current) accept(data); }
    catch (error) { if (version === revision.current) reject(error); }
  }, [accept, reject]);
  useEffect(() => {
    const controller = new AbortController(), version = ++revision.current;
    authApi.getMe({ signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted && version === revision.current) accept(data);
    }).catch((error) => { if (!controller.signal.aborted && version === revision.current) reject(error); });
    return () => controller.abort();
  }, [accept, reject]);
  async function authenticate(operation, payload) {
    const data = await operation(payload);
    ++revision.current; accept(data); return data;
  }
  const login = (payload) => authenticate(authApi.login, payload);
  const register = (payload) => authenticate(authApi.register, payload);
  async function logout() {
    await authApi.logout();
    ++revision.current; accept({ user: null });
  }
  return <AuthContext.Provider value={{ user, status, login, register, logout, refresh }}>{children}</AuthContext.Provider>;
}
