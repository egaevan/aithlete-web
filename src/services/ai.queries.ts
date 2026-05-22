import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { aiService } from '@/services/ai.service'
import { QUERY_KEYS } from '@/lib/query-options'
import { useAIStore } from '@/stores/ai.store'

export function useAIRecommendations() {
  return useQuery({
    queryKey: QUERY_KEYS.ai.recommendations(),
    queryFn: () => aiService.getAIRecommendations(),
  })
}

export function useFatigueAnalysis() {
  return useQuery({
    queryKey: QUERY_KEYS.ai.fatigue(),
    queryFn: () => aiService.getFatigueAnalysis(),
  })
}

export function useRecoveryScore() {
  return useQuery({
    queryKey: QUERY_KEYS.ai.recovery(),
    queryFn: () => aiService.getRecoveryScore(),
  })
}

export function usePlateauDetection() {
  return useQuery({
    queryKey: QUERY_KEYS.ai.plateau(),
    queryFn: () => aiService.getPlateauDetection(),
  })
}

export function useAIChat(sessionId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.ai.chat(sessionId || ''),
    queryFn: () => aiService.getChatHistory(sessionId!),
    enabled: !!sessionId,
  })
}

export function useSendAIMessage() {
  const queryClient = useQueryClient()
  const addMessage = useAIStore((s) => s.addMessage)
  const setStreaming = useAIStore((s) => s.setStreaming)

  return useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: string; message: string }) =>
      aiService.sendChatMessage(sessionId, message),
    onMutate: ({ message }) => {
      setStreaming(true)
      addMessage({
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      })
    },
    onSuccess: (messages) => {
      setStreaming(false)
      const assistantMessage = messages[messages.length - 1]
      if (assistantMessage) {
        addMessage(assistantMessage)
      }
    },
    onError: () => {
      setStreaming(false)
    },
    onSettled: (_, __, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ai.chat(sessionId) })
    },
  })
}

export function useCreateChatSession() {
  const queryClient = useQueryClient()
  const setChatSessionId = useAIStore((s) => s.setChatSessionId)

  return useMutation({
    mutationFn: () => aiService.createChatSession(),
    onSuccess: (data) => {
      setChatSessionId(data.sessionId)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ai.all })
    },
  })
}
