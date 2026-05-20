import { apiClient } from '@/lib/api-client'
import type {
  Workout,
  CreateWorkoutInput,
  UpdateWorkoutInput,
  WorkoutHistoryFilters,
} from '@/types/workout.types'
import type { ApiResponse } from '@/types/api.types'

export const workoutService = {
  async getWorkouts(filters?: WorkoutHistoryFilters): Promise<Workout[]> {
    const params: Record<string, unknown> = {}
    if (filters?.dateFrom) params.dateFrom = filters.dateFrom
    if (filters?.dateTo) params.dateTo = filters.dateTo
    if (filters?.muscleGroup) params.muscleGroup = filters.muscleGroup
    if (filters?.limit) params.limit = filters.limit
    if (filters?.offset) params.offset = filters.offset

    const response = await apiClient.get<ApiResponse<Workout[]>>('/workouts', params)
    return response.data
  },

  async getWorkout(id: string): Promise<Workout> {
    const response = await apiClient.get<ApiResponse<Workout>>(`/workouts/${id}`)
    return response.data
  },

  async createWorkout(data: CreateWorkoutInput): Promise<Workout> {
    const response = await apiClient.post<ApiResponse<Workout>>('/workouts', data)
    return response.data
  },

  async updateWorkout(id: string, data: UpdateWorkoutInput): Promise<Workout> {
    const response = await apiClient.put<ApiResponse<Workout>>(`/workouts/${id}`, data)
    return response.data
  },

  async deleteWorkout(id: string): Promise<void> {
    await apiClient.delete(`/workouts/${id}`)
  },

  async getWorkoutStats(): Promise<{
    totalWorkouts: number
    totalVolume: number
    avgDuration: number
    currentStreak: number
  }> {
    const response = await apiClient.get<ApiResponse<{
      totalWorkouts: number
      totalVolume: number
      avgDuration: number
      currentStreak: number
    }>>('/workouts/stats')
    return response.data
  },
}
