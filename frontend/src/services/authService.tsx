import type { LoginCredentials, LoginResponse } from "../types/auth";
import { API_URL } from "../config/api";
import { clearTokens, getRefreshToken, saveTokens } from "../lib/auth";

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/autenticacao/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let message = "Não foi possível realizar login";

    if (typeof result === "object" && result !== null) {
      const body = result as Record<string, unknown>;

      if (typeof body.error === "string") {
        message = body.error;
      } else if (typeof body.message === "string") {
        message = body.message;
      }
    }

    throw new Error(message);
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("accessToken" in result) ||
    typeof result.accessToken !== "string" ||
    !("refreshToken" in result) ||
    typeof result.refreshToken !== "string"
  ) {
    throw new Error("A API retornou uma resposta inesperada.");
  }

  saveTokens(result.accessToken, result.refreshToken);

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
}

let refreshPromise: Promise<string> | null = null;

async function performRefreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearTokens();
    throw new Error("Não existe refresh token disponível.");
  }

  const response = await fetch(`${API_URL}/autenticacao/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearTokens();
    }

    let message = "Não foi possível renovar a sessão.";

    if (typeof result === "object" && result !== null) {
      const body = result as Record<string, unknown>;

      if (typeof body.error === "string") {
        message = body.error;
      } else if (typeof body.message === "string") {
        message = body.message;
      }
    }

    throw new Error(message);
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("accessToken" in result) ||
    typeof result.accessToken !== "string"
  ) {
    throw new Error("A API retornou uma resposta inesperada.");
  }

  saveTokens(result.accessToken, refreshToken);

  return result.accessToken;
}

export async function logout() {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await fetch(`${API_URL}/autenticacao/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } finally {
    clearTokens();
  }
}

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = performRefreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
