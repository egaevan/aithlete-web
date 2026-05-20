import { useQuery } from '@tanstack/react-query'
import { exerciseService } from '@/services/exercise.service'
import { QUERY_KEYS } from '@/lib/query-options'
import type { ExerciseFilter } from '@/types/exercise.types'

export function useExercises(filters?: ExerciseFilter) {
  return useQuery({
    queryKey: QUERY_KEYS.exercises.list(filters as Record<string, unknown> | undefined),
    queryFn: () => exerciseService.getExercises(filters),
  })
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.exercises.detail(id),
    queryFn: () => exerciseService.getExercise(id),
    enabled: !!id,
  })
}

export function useMuscleGroups() {
  return useQuery({
    queryKey: QUERY_KEYS.exercises.muscleGroups(),
    queryFn: () => exerciseService.getMuscleGroups(),
  })
}
