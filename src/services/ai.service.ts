import { apiClient } from '@/lib/api-client'
import type {
  AIChatMessage,
  FatigueAnalysis,
  RecoveryScore,
  PlateauDetection,
} from '@/types/ai.types'
import type { ApiResponse } from '@/types/api.types'

export const aiService = {
  async sendChatMessage(sessionId: string, message: string): Promise<AIChatMessage[]> {
    const response = await apiClient.post<ApiResponse<AIChatMessage[]>>(`/api/v1/ai/chat/${sessionId}`, {
      message,
    })
    return response.data
  },

  async getChatHistory(sessionId: string): Promise<AIChatMessage[]> {
    const response = await apiClient.get<ApiResponse<AIChatMessage[]>>(`/api/v1/ai/chat/${sessionId}`)
    return response.data
  },

  async createChatSession(): Promise<{ sessionId: string }> {
    const response = await apiClient.post<ApiResponse<{ sessionId: string }>>('/api/v1/ai/chat')
    return response.data
  },

  async getFatigueAnalysis(): Promise<FatigueAnalysis> {
    const response = await apiClient.get<ApiResponse<FatigueAnalysis>>('/api/v1/ai/fatigue')
    return response.data
  },

  async getRecoveryScore(): Promise<RecoveryScore> {
    const response = await apiClient.get<ApiResponse<RecoveryScore>>('/api/v1/ai/recovery')
    return response.data
  },

  async getPlateauDetection(): Promise<PlateauDetection[]> {
    const response = await apiClient.get<ApiResponse<PlateauDetection[]>>('/api/v1/ai/plateau')
    return response.data
  },
}
