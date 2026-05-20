'use client'

import { Brain, Dumbbell, Sparkles, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { AIRecommendation } from '@/types/ai.types'

const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === 'true'

const defaultRecommendation: AIRecommendation = {
  id: '1',
  type: 'workout',
  title: 'Upper Body Power',
  description:
    'Based on your recovery data, I recommend focusing on upper body today. Your legs need another 24-48 hours of recovery. Consider a chest and back superset workout for maximum efficiency.',
  confidence: 0.92,
  createdAt: new Date().toISOString(),
}

export function AICoachPanel({ recommendation }: { recommendation?: AIRecommendation }) {
  const router = useRouter()
  const data = recommendation || defaultRecommendation

  if (!AI_ENABLED) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-semibold text-foreground">AI Coach</h3>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">Coming Soon</span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Our AI-powered fitness coach is currently in development. Soon you&apos;ll get personalized workout recommendations,
              real-time fatigue analysis, and recovery scoring.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Estimated launch: Q3 2026</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">AI Recommendations</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Smart Chat</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Fatigue Analysis</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-card p-6 shadow-[0_0_40px_rgba(74,222,178,0.15)]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/20">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="font-semibold text-foreground">AI Coach</h3>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">Live</span>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{data.description}</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => router.push('/dashboard/ai')}>
              <Dumbbell className="mr-2 h-4 w-4" />
              Start Recommended Workout
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/ai')}>
              View Alternatives
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
