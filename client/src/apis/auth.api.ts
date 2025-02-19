import { AuthResponse, RefreshAccessToken } from 'src/types/auth.type'
import http from 'src/utils/http'

export const URL_LOGIN = 'users/login'
export const URL_REGISTER = 'users/register'
export const URL_LOGOUT = 'users/logout'
export const URL_REFRESH_TOKEN = 'users/refresh-token'

export const authApi = {
  registerAccount(body: { email: string; password: string; name: string }) {
    return http.post<AuthResponse>(URL_REGISTER, body)
  },
  login(body: { email: string; password: string }) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  },
  logout(body: { refresh_token: string }) {
    return http.post(URL_LOGOUT, body)
  },
  refreshAccessToken(body: { refresh_token: string }) {
    return http.post<RefreshAccessToken>(URL_REFRESH_TOKEN, body)
  }
}

// export const registerAccount = (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body)
// export const login = (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body)
// export const logout = () => http.post('/logout')
