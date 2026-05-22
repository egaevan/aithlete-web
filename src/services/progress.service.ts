import { apiClient } from '@/lib/api-client'
import type {
  BodyWeightEntry,
  StrengthMetric,
  ConsistencyMetric,
  ProgressOverview,
  MuscleVolumeData,
} from '@/types/progress.types'
import type { ApiResponse } from '@/types/api.types'

export const progressService = {
  async getBodyWeight(): Promise<BodyWeightEntry[]> {
    const response = await apiClient.get<ApiResponse<BodyWeightEntry[]>>('/api/v1/progress/body-weight')
    return response.data
  },

  async addBodyWeightEntry(data: { weight: number; bodyFatPercentage?: number }): Promise<BodyWeightEntry> {
    const response = await apiClient.post<ApiResponse<BodyWeightEntry>>('/api/v1/progress/body-weight', data)
    return response.data
  },

  async getStrength(): Promise<StrengthMetric[]> {
    const response = await apiClient.get<ApiResponse<StrengthMetric[]>>('/api/v1/progress/strength')
    return response.data
  },

  async getConsistency(): Promise<ConsistencyMetric[]> {
    const response = await apiClient.get<ApiResponse<ConsistencyMetric[]>>('/api/v1/progress/consistency')
    return response.data
  },

  async getProgressOverview(): Promise<ProgressOverview> {
    const response = await apiClient.get<ApiResponse<ProgressOverview>>('/api/v1/progress/overview')
    return response.data
  },

  async getMuscleVolume(): Promise<MuscleVolumeData[]> {
    const response = await apiClient.get<ApiResponse<MuscleVolumeData[]>>('/api/v1/progress/muscle-volume')
    return response.data
  },
}
