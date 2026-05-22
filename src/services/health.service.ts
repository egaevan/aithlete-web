import { apiClient } from '@/lib/api-client'
import type { HealthStatus } from '@/types/health.types'
import type { ApiResponse } from '@/types/api.types'

export const healthService = {
  async check(): Promise<HealthStatus> {
    const response = await apiClient.get<ApiResponse<HealthStatus>>('/health')
    return response.data
  },
}
