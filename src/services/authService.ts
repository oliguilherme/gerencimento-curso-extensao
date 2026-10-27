import { clearTokens, getRefreshToken } from '../lib/auth'

const API_URL = import.meta.env.VITE_API_URL

export async function logout() {
  const refreshToken = getRefreshToken()

  try {
    if (refreshToken) {
      await fetch(`${API_URL}/autenticacao/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
    }
  } finally {
    // mesmo que a API falhe, o usuário sai no front
    clearTokens()
  }
}