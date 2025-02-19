import { User } from './user.type'
import { SuccessResponseApi } from './utils.type'

export type AuthResponse = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  // expires_refresh_token: string
  // expires: string
  user: User
}>

export type RefreshAccessToken = SuccessResponseApi<{ access_token: string }>
