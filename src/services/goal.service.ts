import { apiClient } from '@/lib/api-client'
import type { Goal, CreateGoalInput, UpdateGoalInput, GoalFilters } from '@/types/goal.types'
import type { ApiResponse } from '@/types/api.types'

export const goalService = {
  async getGoals(filters?: GoalFilters): Promise<Goal[]> {
    const params: Record<string, unknown> = {}
    if (filters?.type) params.type = filters.type
    if (filters?.period) params.period = filters.period
    if (filters?.completed !== undefined) params.completed = filters.completed

    const response = await apiClient.get<ApiResponse<Goal[]>>('/goals', params)
    return response.data
  },

  async getGoal(id: string): Promise<Goal> {
    const response = await apiClient.get<ApiResponse<Goal>>(`/goals/${id}`)
    return response.data
  },

  async createGoal(data: CreateGoalInput): Promise<Goal> {
    const response = await apiClient.post<ApiResponse<Goal>>('/goals', data)
    return response.data
  },

  async updateGoal(id: string, data: UpdateGoalInput): Promise<Goal> {
    const response = await apiClient.put<ApiResponse<Goal>>(`/goals/${id}`, data)
    return response.data
  },

  async deleteGoal(id: string): Promise<void> {
    await apiClient.delete(`/goals/${id}`)
  },

  async toggleComplete(id: string, completed: boolean): Promise<Goal> {
    const response = await apiClient.patch<ApiResponse<Goal>>(`/goals/${id}/toggle`, { completed })
    return response.data
  },

  async updateProgress(id: string, current: number): Promise<Goal> {
    const response = await apiClient.patch<ApiResponse<Goal>>(`/goals/${id}/progress`, { current })
    return response.data
  },
}
