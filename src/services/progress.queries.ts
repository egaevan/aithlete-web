import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { progressService } from '@/services/progress.service'
import { QUERY_KEYS } from '@/lib/query-options'

export function useBodyWeight() {
  return useQuery({
    queryKey: QUERY_KEYS.progress.bodyWeight(),
    queryFn: () => progressService.getBodyWeight(),
  })
}

export function useAddBodyWeightEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { weight: number; bodyFatPercentage?: number }) =>
      progressService.addBodyWeightEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.progress.bodyWeight() })
    },
  })
}

export function useStrength() {
  return useQuery({
    queryKey: QUERY_KEYS.progress.strength(),
    queryFn: () => progressService.getStrength(),
  })
}

export function useConsistency() {
  return useQuery({
    queryKey: QUERY_KEYS.progress.consistency(),
    queryFn: () => progressService.getConsistency(),
  })
}

export function useMuscleVolume() {
  return useQuery({
    queryKey: QUERY_KEYS.progress.muscleVolume(),
    queryFn: () => progressService.getMuscleVolume(),
  })
}

export function useProgressOverview() {
  return useQuery({
    queryKey: QUERY_KEYS.progress.overview(),
    queryFn: () => progressService.getOverview(),
  })
}
