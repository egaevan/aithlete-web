import { apiClient } from '@/lib/api-client'
import type {
  BodyWeightEntry,
  StrengthMetric,
  ConsistencyMetric,
  MuscleVolumeData,
  ProgressOverview,
} from '@/types/progress.types'
import type { ApiResponse } from '@/types/api.types'

export const progressService = {
  async getBodyWeight(): Promise<BodyWeightEntry[]> {
    const response = await apiClient.get<ApiResponse<BodyWeightEntry[]>>('/progress/body-weight')
    return response.data
  },

  async addBodyWeightEntry(data: { weight: number; bodyFatPercentage?: number }): Promise<BodyWeightEntry> {
    const response = await apiClient.post<ApiResponse<BodyWeightEntry>>('/progress/body-weight', data)
    return response.data
  },

  async getStrength(): Promise<StrengthMetric[]> {
    const response = await apiClient.get<ApiResponse<StrengthMetric[]>>('/progress/strength')
    return response.data
  },

  async getConsistency(): Promise<ConsistencyMetric[]> {
    const response = await apiClient.get<ApiResponse<ConsistencyMetric[]>>('/progress/consistency')
    return response.data
  },

  async getMuscleVolume(): Promise<MuscleVolumeData[]> {
    const response = await apiClient.get<ApiResponse<MuscleVolumeData[]>>('/progress/muscle-volume')
    return response.data
  },

  async getOverview(): Promise<ProgressOverview> {
    const response = await apiClient.get<ApiResponse<ProgressOverview>>('/progress/overview')
    return response.data
  },
}
