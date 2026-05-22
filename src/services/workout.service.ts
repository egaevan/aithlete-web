import { apiClient } from '@/lib/api-client'
import type {
  Workout,
  CreateWorkoutInput,
  UpdateWorkoutInput,
  WorkoutHistoryFilters,
  AddExerciseToWorkoutInput,
  UpdateSetInput,
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

    const response = await apiClient.get<ApiResponse<Workout[]>>('/api/v1/workouts', params)
    return response.data
  },

  async getWorkout(id: string): Promise<Workout> {
    const response = await apiClient.get<ApiResponse<Workout>>(`/api/v1/workouts/${id}`)
    return response.data
  },

  async createWorkout(data: CreateWorkoutInput): Promise<Workout> {
    const response = await apiClient.post<ApiResponse<Workout>>('/api/v1/workouts', data)
    return response.data
  },

  async updateWorkout(id: string, data: UpdateWorkoutInput): Promise<Workout> {
    const response = await apiClient.put<ApiResponse<Workout>>(`/api/v1/workouts/${id}`, data)
    return response.data
  },

  async deleteWorkout(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/workouts/${id}`)
  },

  async addExerciseToWorkout(workoutId: string, data: AddExerciseToWorkoutInput): Promise<Workout> {
    const response = await apiClient.post<ApiResponse<Workout>>(`/api/v1/workouts/${workoutId}/exercises`, data)
    return response.data
  },

  async completeWorkout(workoutId: string): Promise<Workout> {
    const response = await apiClient.post<ApiResponse<Workout>>(`/api/v1/workouts/${workoutId}/complete`)
    return response.data
  },

  async updateSet(workoutId: string, exerciseId: string, setId: string, data: UpdateSetInput): Promise<{ id: string; reps: number; weight: number; completed: boolean }> {
    const response = await apiClient.put<ApiResponse<{ id: string; reps: number; weight: number; completed: boolean }>>(
      `/api/v1/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`,
      data,
    )
    return response.data
  },
}
