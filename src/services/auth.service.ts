import { apiClient } from '@/lib/api-client'
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from '@/types/auth.types'
import type { ApiResponse } from '@/types/api.types'

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', data)
    const { accessToken, refreshToken } = response.data.tokens
    apiClient.setAuthToken(accessToken)
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', refreshToken)
    }
    return response.data
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/v1/auth/register', data)
    const { accessToken, refreshToken } = response.data.tokens
    apiClient.setAuthToken(accessToken)
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', refreshToken)
    }
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout')
    } finally {
      apiClient.clearAuth()
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/api/v1/auth/me')
    return response.data
  },

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
    if (!refreshToken) throw new Error('No refresh token available')

    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/api/v1/auth/refresh',
      { refreshToken },
    )
    const { accessToken, refreshToken: newRefreshToken } = response.data
    apiClient.setAuthToken(accessToken)
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', newRefreshToken)
    }
    return response.data
  },
}
