'use client'

import { useState, useRef, useEffect } from 'react'
import { Brain, Send, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContentContainer } from '@/components/layout/content-container'
import { useAIStore } from '@/stores/ai.store'
import {
  useFatigueAnalysis,
  useRecoveryScore,
  usePlateauDetection,
  useSendAIMessage,
  useCreateChatSession,
} from '@/services/ai.queries'
import { cn } from '@/lib/utils'

const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === 'true'

export default function AIPage() {
  if (!AI_ENABLED) {
    return null
  }

  return <AICoachContent />
}

function AICoachContent() {
  const { messages, chatSessionId, setChatSessionId } = useAIStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: fatigue } = useFatigueAnalysis()
  const { data: recovery } = useRecoveryScore()
  const { data: plateaus } = usePlateauDetection()
  const createSessionMutation = useCreateChatSession()
  const sendMessageMutation = useSendAIMessage()

  useEffect(() => {
    if (!chatSessionId) {
      createSessionMutation.mutate(undefined, {
        onSuccess: (data) => setChatSessionId(data.sessionId),
      })
    }
  }, [chatSessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || !chatSessionId) return
    sendMessageMutation.mutate({ sessionId: chatSessionId, message: input.trim() })
    setInput('')
  }

  const mockFatigue = fatigue || {
    overall: 35,
    central: 40,
    peripheral: 30,
    status: 'moderate' as const,
    factors: [
      { name: 'Sleep Quality', value: 85, impact: 'positive' as const },
      { name: 'Training Volume', value: 65, impact: 'negative' as const },
      { name: 'Nutrition', value: 70, impact: 'positive' as const },
    ],
  }

  const mockRecovery = recovery || {
    overall: 78,
    sleep: 85,
    nutrition: 72,
    stress: 68,
    muscleRecovery: [
      { muscleGroup: 'Chest', recovery: 92, readyForTraining: true },
      { muscleGroup: 'Back', recovery: 78, readyForTraining: true },
      { muscleGroup: 'Legs', recovery: 45, readyForTraining: false },
      { muscleGroup: 'Arms', recovery: 88, readyForTraining: true },
    ],
    status: 'good' as const,
  }

  return (
    <ContentContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">AI Coach</h1>
        <p className="text-muted-foreground">Your intelligent fitness companion</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Chat */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Coach Chat
              </CardTitle>
              <CardDescription>Ask questions about your training, recovery, or nutrition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex h-80 flex-col overflow-y-auto rounded-xl bg-secondary/30 p-4">
                {messages.length === 0 && (
                  <div className="flex flex-1 items-center justify-center text-center">
                    <div>
                      <Sparkles className="mx-auto mb-2 h-8 w-8 text-primary/50" />
                      <p className="text-sm text-muted-foreground">
                        Start a conversation with your AI coach
                      </p>
                    </div>
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'mb-3 max-w-[80%] rounded-xl px-4 py-2 text-sm',
                      msg.role === 'user'
                        ? 'ml-auto bg-primary/20 text-foreground'
                        : 'mr-auto bg-card text-muted-foreground',
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
                {sendMessageMutation.isPending && (
                  <div className="mr-auto rounded-xl bg-card px-4 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Ask your AI coach..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={sendMessageMutation.isPending}
                />
                <Button onClick={handleSend} disabled={sendMessageMutation.isPending || !input.trim()}>
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recovery Score */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recovery Score</CardTitle>
              <CardDescription>Overall readiness to train</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-center">
                <span className="text-5xl font-bold text-primary">{mockRecovery.overall}</span>
                <p className="text-sm text-muted-foreground">
                  {mockRecovery.status.charAt(0).toUpperCase() + mockRecovery.status.slice(1)}
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Sleep', value: mockRecovery.sleep },
                  { label: 'Nutrition', value: mockRecovery.nutrition },
                  { label: 'Stress', value: mockRecovery.stress },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-foreground">{item.value}%</span>
                    </div>
                    <div className="overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fatigue Analysis */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Fatigue Analysis</CardTitle>
              <CardDescription>Current fatigue levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall</span>
                <Badge
                  variant={
                    mockFatigue.status === 'low'
                      ? 'default'
                      : mockFatigue.status === 'moderate'
                        ? 'secondary'
                        : 'destructive'
                  }
                >
                  {mockFatigue.status.charAt(0).toUpperCase() + mockFatigue.status.slice(1)}
                </Badge>
              </div>
              <div className="space-y-3">
                {mockFatigue.factors.map((factor) => (
                  <div key={factor.name} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{factor.name}</span>
                    <span className={factor.impact === 'positive' ? 'text-primary' : 'text-amber-400'}>
                      {factor.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plateau Detection */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Plateau Detection</CardTitle>
              <CardDescription>Stalled progress alerts</CardDescription>
            </CardHeader>
            <CardContent>
              {!plateaus?.length ? (
                <p className="text-sm text-primary">No plateaus detected. Keep going!</p>
              ) : (
                <div className="space-y-3">
                  {plateaus.map((p, i) => (
                    <div key={i} className="rounded-lg bg-secondary/50 p-3">
                      <p className="text-sm font-medium text-foreground">{p.exercise}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.metric} stalled for {p.weeksStalled} weeks
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentContainer>
  )
}
