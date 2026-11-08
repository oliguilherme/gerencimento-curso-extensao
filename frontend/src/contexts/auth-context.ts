import { createContext } from "react";
import type { AccessTokenPayload, LoginCredentials } from "../types/auth";

export interface AuthContextType {
  user: AccessTokenPayload | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  hasRole: (role: string) => boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
