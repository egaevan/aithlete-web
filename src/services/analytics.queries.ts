import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'
import { QUERY_KEYS } from '@/lib/query-options'

export function useDashboardOverview() {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.dashboard(),
    queryFn: () => analyticsService.getDashboardOverview(),
  })
}

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.overview(),
    queryFn: () => analyticsService.getAnalyticsOverview(),
  })
}

export function useWeeklyVolume() {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.weeklyVolume(),
    queryFn: () => analyticsService.getWeeklyVolume(),
  })
}

export function useMuscleVolume() {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.muscleVolume(),
    queryFn: () => analyticsService.getMuscleVolume(),
  })
}

export function useWeeklyProgress() {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.weekly(),
    queryFn: () => analyticsService.getWeeklyProgress(),
  })
}

export function useStreak() {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.streak(),
    queryFn: () => analyticsService.getStreak(),
  })
}
