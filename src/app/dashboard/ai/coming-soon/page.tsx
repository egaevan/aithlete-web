'use client'

import { Brain, Sparkles, Clock } from 'lucide-react'
import { ContentContainer } from '@/components/layout/content-container'
import { Card, CardContent } from '@/components/ui/card'

export default function ComingSoonPage() {
  return (
    <ContentContainer>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Card className="border-border/50 bg-card">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <div className="mb-2 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">AI Coach</h1>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <p className="mb-6 text-lg text-muted-foreground">Coming Soon</p>
            <p className="mx-auto mb-8 max-w-md text-sm text-muted-foreground">
              Our AI-powered fitness coach is currently in development. Soon you&apos;ll get personalized workout recommendations,
              real-time fatigue analysis, recovery scoring, and intelligent plateau detection.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Estimated launch: Q3 2026</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">AI Recommendations</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Smart Chat</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Fatigue Analysis</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Recovery Scoring</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Plateau Detection</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentContainer>
  )
}
