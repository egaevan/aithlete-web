import { create } from 'zustand'
import type { AIChatMessage } from '@/types/ai.types'

interface AIState {
  chatSessionId: string | null
  messages: AIChatMessage[]
  isStreaming: boolean
  setChatSessionId: (sessionId: string | null) => void
  addMessage: (message: AIChatMessage) => void
  setMessages: (messages: AIChatMessage[]) => void
  setStreaming: (isStreaming: boolean) => void
  clearChat: () => void
}

export const useAIStore = create<AIState>((set) => ({
  chatSessionId: null,
  messages: [],
  isStreaming: false,
  setChatSessionId: (sessionId) => set({ chatSessionId: sessionId }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  clearChat: () => set({ messages: [] }),
}))
