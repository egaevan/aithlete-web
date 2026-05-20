import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { goalService } from '@/services/goal.service'
import { QUERY_KEYS } from '@/lib/query-options'
import type { CreateGoalInput, UpdateGoalInput, GoalFilters } from '@/types/goal.types'

export function useGoals(filters?: GoalFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.goals.list(filters as Record<string, unknown> | undefined),
    queryFn: () => goalService.getGoals(filters),
  })
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.goals.detail(id),
    queryFn: () => goalService.getGoal(id),
    enabled: !!id,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateGoalInput) => goalService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalInput }) =>
      goalService.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => goalService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals.all })
    },
  })
}

export function useToggleGoalComplete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      goalService.toggleComplete(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all })
    },
  })
}
