import { apiClient } from '@/lib/api-client'
import type { Exercise, ExerciseFilter, MuscleGroup } from '@/types/exercise.types'
import type { ApiResponse } from '@/types/api.types'

export const exerciseService = {
  async getExercises(filters?: ExerciseFilter): Promise<Exercise[]> {
    const params: Record<string, unknown> = {}
    if (filters?.muscleGroup) params.muscleGroup = filters.muscleGroup
    if (filters?.equipment) params.equipment = filters.equipment
    if (filters?.difficulty) params.difficulty = filters.difficulty
    if (filters?.search) params.search = filters.search

    const response = await apiClient.get<ApiResponse<Exercise[]>>('/exercises', params)
    return response.data
  },

  async getExercise(id: string): Promise<Exercise> {
    const response = await apiClient.get<ApiResponse<Exercise>>(`/exercises/${id}`)
    return response.data
  },

  async getMuscleGroups(): Promise<MuscleGroup[]> {
    const response = await apiClient.get<ApiResponse<MuscleGroup[]>>('/exercises/muscle-groups')
    return response.data
  },
}
