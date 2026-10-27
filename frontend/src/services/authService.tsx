import type { LoginCredentials, LoginResponse } from "../types/auth";
import { API_URL } from "../config/api";
import {clearTokens, getRefreshToken, saveTokens,
} from "../lib/auth";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch (
    `${API_URL}/autenticacao/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    },
  );

  const result: unknown = await response
      .json()
      .catch(() => null);

    if (!response.ok) {
      let message = 'Não foi possível realizar login';

      if (typeof result === 'object' && result !== null) {
        const body = result as Record<string, unknown>;

        if (typeof body.error === 'string') {
          message = body.error;
        } else if (typeof body.message === 'string') {
          message = body.message;
        }
      }

      throw new Error(message);
    }

    if (
      typeof result !== 'object' ||
      result === null ||
      !('accessToken' in result) ||
      typeof result.accessToken !== 'string' ||
      !('refreshToken' in result) ||
      typeof result.refreshToken !== 'string'
    ) {
      throw new Error('A API retornou uma resposta inesperada.')
    }

    saveTokens(result.accessToken, result.refreshToken);

  return {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
}

export async function logout() {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await fetch(`${API_URL}/autenticacao/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } finally {
    clearTokens();
  }
}