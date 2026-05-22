import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workoutService } from '@/services/workout.service'
import { QUERY_KEYS } from '@/lib/query-options'
import type {
  CreateWorkoutInput,
  UpdateWorkoutInput,
  WorkoutHistoryFilters,
  AddExerciseToWorkoutInput,
  UpdateSetInput,
} from '@/types/workout.types'

export function useWorkouts(filters?: WorkoutHistoryFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.workouts.list(filters as Record<string, unknown> | undefined),
    queryFn: () => workoutService.getWorkouts(filters),
  })
}

export function useWorkout(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.workouts.detail(id),
    queryFn: () => workoutService.getWorkout(id),
    enabled: !!id,
  })
}

export function useCreateWorkout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateWorkoutInput) => workoutService.createWorkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all })
    },
  })
}

export function useUpdateWorkout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkoutInput }) =>
      workoutService.updateWorkout(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.detail(id) })
    },
  })
}

export function useDeleteWorkout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => workoutService.deleteWorkout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.all })
    },
  })
}

export function useAddExerciseToWorkout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ workoutId, data }: { workoutId: string; data: AddExerciseToWorkoutInput }) =>
      workoutService.addExerciseToWorkout(workoutId, data),
    onSuccess: (_, { workoutId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.detail(workoutId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.exercises(workoutId) })
    },
  })
}

export function useCompleteWorkout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workoutId: string) => workoutService.completeWorkout(workoutId),
    onSuccess: (_, workoutId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.detail(workoutId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all })
    },
  })
}

export function useUpdateSet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workoutId,
      exerciseId,
      setId,
      data,
    }: {
      workoutId: string
      exerciseId: string
      setId: string
      data: UpdateSetInput
    }) => workoutService.updateSet(workoutId, exerciseId, setId, data),
    onSuccess: (_, { workoutId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workouts.detail(workoutId) })
    },
  })
}
