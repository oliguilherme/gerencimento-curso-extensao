import { getAccessToken, getRefreshToken, clearTokens } from "./auth";

import { refreshAccessToken } from "../services/authService";
import { notifySessionExpired } from "./authEvents";

function createAuthenticatedRequest(
  originalRequest: Request,
  accessToken: string,
): Request {
  const headers = new Headers(originalRequest.headers);

  headers.set("Authorization", `Bearer ${accessToken}`);

  return new Request(originalRequest.clone(), { headers });
}

export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const originalRequest = new Request(input, init);

  let accessToken = getAccessToken();

  if (!accessToken) {
    if (!getRefreshToken()) {
      notifySessionExpired();
      throw new Error("Sessão não encontrada. Faça login novamente.");
    }

    try {
      accessToken = await refreshAccessToken();
    } catch (error) {
      if (!getRefreshToken()) {
        notifySessionExpired();
      }

      throw error;
    }
  }

  let response = await fetch(
    createAuthenticatedRequest(originalRequest, accessToken),
  );

  if (response.status !== 401) {
    return response;
  }

  try {
    const latestToken = getAccessToken();

    const newAccessToken =
      latestToken && latestToken !== accessToken
        ? latestToken
        : await refreshAccessToken();

    response = await fetch(
      createAuthenticatedRequest(originalRequest, newAccessToken),
    );

    if (response.status === 401) {
      clearTokens();
      notifySessionExpired();
    }

    return response;
  } catch (error) {
    if (!getRefreshToken()) {
      notifySessionExpired();
    }

    throw error;
  }
}
