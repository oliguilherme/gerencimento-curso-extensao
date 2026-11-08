import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { AccessTokenPayload, LoginCredentials } from "../types/auth";
import { getAccessTokenPayload, clearTokens } from "../lib/auth";
import {
  login as loginRequest,
  logout as logoutRequest,
} from "../services/authService";
import { AuthContext } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AccessTokenPayload | null>(() =>
    getAccessTokenPayload(),
  );

  const login = useCallback(async (credentials: LoginCredentials) => {
    await loginRequest(credentials);

    const payload = getAccessTokenPayload();

    if (!payload) {
      clearTokens();
      throw new Error("Não foi possível recuperar os dados do usuário.");
    }

    setUser(payload);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const hasRole = useCallback(
    (role: string) => user?.roles.includes(role) ?? false,
    [user],
  );

  const isAuthenticated = user !== null;

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      hasRole,
      login,
      logout,
    }),
    [user, isAuthenticated, hasRole, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
