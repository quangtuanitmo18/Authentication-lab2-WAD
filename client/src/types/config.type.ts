import { AxiosResponseHeaders } from 'axios'

export interface Config {
  baseURL?: string
  data?: any
  url?: string
  headers?: AxiosResponseHeaders
}
