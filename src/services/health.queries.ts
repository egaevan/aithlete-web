import { useQuery } from '@tanstack/react-query'
import { healthService } from '@/services/health.service'
import { QUERY_KEYS } from '@/lib/query-options'

export function useHealthCheck() {
  return useQuery({
    queryKey: QUERY_KEYS.health.check(),
    queryFn: () => healthService.check(),
    staleTime: 1000 * 60,
    retry: false,
  })
}
