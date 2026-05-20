import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduleService } from '@/services/schedule.service'
import { QUERY_KEYS } from '@/lib/query-options'
import type { CreateScheduleInput, UpdateScheduleInput, ScheduleFilters } from '@/types/schedule.types'

export function useSchedules(filters?: ScheduleFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.schedules.list(filters as Record<string, unknown> | undefined),
    queryFn: () => scheduleService.getSchedules(filters),
  })
}

export function useSchedule(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.schedules.detail(id),
    queryFn: () => scheduleService.getSchedule(id),
    enabled: !!id,
  })
}

export function useTodaySchedule() {
  return useQuery({
    queryKey: QUERY_KEYS.schedules.today(),
    queryFn: () => scheduleService.getTodaySchedule(),
  })
}

export function useCreateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateScheduleInput) => scheduleService.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all })
    },
  })
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleInput }) =>
      scheduleService.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all })
    },
  })
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => scheduleService.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules.all })
    },
  })
}

export function useToggleScheduleComplete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      scheduleService.toggleComplete(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.schedules.all })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.analytics.all })
    },
  })
}
