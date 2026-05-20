import { apiClient } from '@/lib/api-client'
import type {
  AIRecommendation,
  AIChatMessage,
  FatigueAnalysis,
  RecoveryScore,
  PlateauDetection,
} from '@/types/ai.types'
import type { ApiResponse } from '@/types/api.types'

export const aiService = {
  async getRecommendations(): Promise<AIRecommendation[]> {
    const response = await apiClient.get<ApiResponse<AIRecommendation[]>>('/ai/recommendations')
    return response.data
  },

  async getRecommendedWorkout(): Promise<AIRecommendation | null> {
    const recommendations = await this.getRecommendations()
    return recommendations.find((r) => r.type === 'workout') || null
  },

  async sendChatMessage(sessionId: string, message: string): Promise<AIChatMessage[]> {
    const response = await apiClient.post<ApiResponse<AIChatMessage[]>>(`/ai/chat/${sessionId}`, {
      message,
    })
    return response.data
  },

  async getChatHistory(sessionId: string): Promise<AIChatMessage[]> {
    const response = await apiClient.get<ApiResponse<AIChatMessage[]>>(`/ai/chat/${sessionId}`)
    return response.data
  },

  async createChatSession(): Promise<{ sessionId: string }> {
    const response = await apiClient.post<ApiResponse<{ sessionId: string }>>('/ai/chat')
    return response.data
  },

  async getFatigueAnalysis(): Promise<FatigueAnalysis> {
    const response = await apiClient.get<ApiResponse<FatigueAnalysis>>('/ai/fatigue')
    return response.data
  },

  async getRecoveryScore(): Promise<RecoveryScore> {
    const response = await apiClient.get<ApiResponse<RecoveryScore>>('/ai/recovery')
    return response.data
  },

  async getPlateauDetection(): Promise<PlateauDetection[]> {
    const response = await apiClient.get<ApiResponse<PlateauDetection[]>>('/ai/plateau')
    return response.data
  },
}
