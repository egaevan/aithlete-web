import { apiClient } from '@/lib/api-client'
import type { DashboardOverview } from '@/types/analytics.types'
import type { AnalyticsOverview, WeeklyVolumeData, MuscleVolumeEntry } from '@/types/analytics-overview.types'
import type { ApiResponse } from '@/types/api.types'

export const analyticsService = {
  async getDashboardOverview(): Promise<DashboardOverview> {
    const response = await apiClient.get<ApiResponse<DashboardOverview>>('/api/v1/analytics/dashboard')
    return response.data
  },

  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const response = await apiClient.get<ApiResponse<AnalyticsOverview>>('/api/v1/analytics/overview')
    return response.data
  },

  async getWeeklyVolume(): Promise<WeeklyVolumeData[]> {
    const response = await apiClient.get<ApiResponse<WeeklyVolumeData[]>>('/api/v1/analytics/volume/weekly')
    return response.data
  },

  async getMuscleVolume(): Promise<MuscleVolumeEntry[]> {
    const response = await apiClient.get<ApiResponse<MuscleVolumeEntry[]>>('/api/v1/analytics/volume/muscle')
    return response.data
  },
}
