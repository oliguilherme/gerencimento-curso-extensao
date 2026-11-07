const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export interface AccessTokenPayload {
  sub: string;
  roles: string[];
  exp: number;
}

export function getAccessTokenPayload(): AccessTokenPayload | null {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");

    if (parts.length !== 3 || !parts[1]) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    const binary = atob(paddedBase64);

    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));

    if (typeof payload !== "object" || payload === null) {
      return null;
    }

    const data = payload as Record<string, unknown>;

    if (
      typeof data.sub !== "string" ||
      !Array.isArray(data.roles) ||
      !data.roles.every((role) => typeof role === "string") ||
      typeof data.exp !== "number"
    ) {
      return null;
    }

    if (Date.now() >= data.exp * 1000) {
      return null;
    }

    return {
      sub: data.sub,
      roles: data.roles,
      exp: data.exp,
    };
  } catch {
    return null;
  }
}
