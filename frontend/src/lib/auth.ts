const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_KEY, accessToken)
  localStorage.setItem(REFRESH_KEY, refreshToken)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}
