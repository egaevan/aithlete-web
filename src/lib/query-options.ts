import { QUERY_KEYS } from '@/services/query-keys'
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'

export const defaultQueryOptions = {
  staleTime: 1000 * 60 * 5,
  retry: 1,
  refetchOnWindowFocus: false,
}

export const defaultMutationOptions = {
  retry: false,
}

export function queryOptions<TQueryFnData, TError, TData>(
  options: UseQueryOptions<TQueryFnData, TError, TData>,
): UseQueryOptions<TQueryFnData, TError, TData> {
  return {
    ...defaultQueryOptions,
    ...options,
  }
}

export function mutationOptions<TData, TError, TVariables, TContext>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationOptions<TData, TError, TVariables, TContext> {
  return {
    ...defaultMutationOptions,
    ...options,
  }
}

export { QUERY_KEYS }
