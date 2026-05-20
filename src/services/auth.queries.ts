import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { authService } from '@/services/auth.service'
import { QUERY_KEYS } from '@/lib/query-options'
import { useAuthStore } from '@/stores/auth.store'
import type { LoginInput, RegisterInput } from '@/types/auth.types'

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser)

  const { data, error } = useQuery({
    queryKey: QUERY_KEYS.auth.user(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 1000 * 60 * 30,
    retry: false,
  })

  useEffect(() => {
    if (data) setUser(data)
  }, [data, setUser])

  useEffect(() => {
    if (error) setUser(null)
  }, [error, setUser])

  return { data, error }
}

export function useLogin() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.all })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.all })
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear()
      router.push('/login')
    },
  })
}
