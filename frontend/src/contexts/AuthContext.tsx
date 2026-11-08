import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AccessTokenPayload, LoginCredentials } from "../types/auth";

import {
  getAccessTokenPayload,
  getRefreshToken,
  clearTokens,
} from "../lib/auth";

import {
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken as refreshAccessTokenRequest,
} from "../services/authService";

import { AuthContext } from "./auth-context";

import { AUTH_SESSION_EXPIRED_EVENT } from "../lib/authEvents";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AccessTokenPayload | null>(() =>
    getAccessTokenPayload(),
  );

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
    }

    window.addEventListener(
      AUTH_SESSION_EXPIRED_EVENT,
      handleSessionExpired,
    );

    return () => {
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleSessionExpired,
      );
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        if (getAccessTokenPayload()) {
          return;
        }

        if (!getRefreshToken()) {
          clearTokens();
          return;
        }

        await refreshAccessTokenRequest();

        const payload = getAccessTokenPayload();

        if (!payload) {
          clearTokens();
          return;
        }

        if (isMounted) {
          setUser(payload);
        }
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    await loginRequest(credentials);

    const payload = getAccessTokenPayload();

    if (!payload) {
      clearTokens();
      throw new Error("Não foi possível recuperar os dados do usuário.");
    }

    setUser(payload);
    setIsInitializing(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setIsInitializing(false);
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
      isInitializing,
      hasRole,
      login,
      logout,
    }),
    [user, isAuthenticated, isInitializing, hasRole, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
