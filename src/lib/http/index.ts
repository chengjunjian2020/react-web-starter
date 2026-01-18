import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { HttpResponseCode } from './constants'
import { toast } from 'sonner'
import { useAuthStore } from '../../store'
/**
 * 后端统一响应结构
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/**
 * 业务错误类型（可选）
 */
export interface ApiError extends Error {
  status?: number
  code?: number
  response?: unknown
}

/**
 * 创建 axios 实例
 */
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 30_000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/* =========================
 * 响应拦截器（核心）
 * ========================= */
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const body = response.data as ApiResponse<unknown>
    // 如果不是统一响应结构，直接透传（极少数接口）
    if (!body || typeof body !== 'object' || !('code' in body) || !('data' in body)) {
      return response.data
    }

    // 业务错误
    if (body.code !== HttpResponseCode.SUCCESS) {
      const err: ApiError = new Error(body.message || 'Business Error')
      console.log(body)
      toast.error(body.message || 'Business Error')
      err.code = body.code
      err.status = response.status
      err.response = body
      return Promise.reject(err)
    }

    // ✅ 关键：直接返回 data
    return body
  },
  (error: AxiosError) => {
    toast.error('Network Error. Please try again later.')
    const err: ApiError = new Error(error.response?.statusText || error.message || 'Network Error')
    err.status = error.response?.status
    err.response = error.response?.data
    return Promise.reject(err)
  },
)

export default http
