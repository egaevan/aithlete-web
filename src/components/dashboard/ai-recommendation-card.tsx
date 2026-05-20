'use client'

import { Sparkles, Dumbbell, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { AIRecommendation } from '@/types/ai.types'

const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === 'true'

const defaultRec: AIRecommendation = {
  id: '1',
  type: 'workout',
  title: 'Upper Body Power',
  description: '45 min • Intermediate • 380 cal',
  confidence: 0.92,
  createdAt: new Date().toISOString(),
}

export function AIRecommendationCard({ recommendation }: { recommendation?: AIRecommendation }) {
  const router = useRouter()
  const data = recommendation || defaultRec

  if (!AI_ENABLED) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-muted-foreground">AI Recommendation</h3>
          </div>
          <div className="mb-4 rounded-xl bg-secondary/30 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Coming Soon</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Personalized workout recommendations powered by AI will be available soon.
            </p>
          </div>
          <Button className="w-full" variant="outline" disabled>
            <Sparkles className="mr-2 h-4 w-4" />
            Coming Soon
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Recommendation</h3>
        </div>
        <div className="mb-4 rounded-xl bg-secondary/50 p-4">
          <p className="mb-1 text-sm font-medium text-foreground">{data.title}</p>
          <p className="mb-3 text-xs text-muted-foreground">{data.description}</p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="h-6 w-6 rounded-full border-2 border-card bg-primary/30" />
              <div className="h-6 w-6 rounded-full border-2 border-card bg-blue-400/30" />
              <div className="h-6 w-6 rounded-full border-2 border-card bg-orange-400/30" />
            </div>
            <span className="text-xs text-muted-foreground">+128 completed today</span>
          </div>
        </div>
        <Button className="w-full" onClick={() => router.push('/dashboard/ai')}>
          <Dumbbell className="mr-2 h-4 w-4" />
          Start Workout
        </Button>
      </div>
    </div>
  )
}
