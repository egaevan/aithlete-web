'use client'

import { Flame } from 'lucide-react'
import type { WorkoutStreak } from '@/types/analytics.types'

const defaultStreak: WorkoutStreak = {
  current: 14,
  personalBest: 21,
  history: Array.from({ length: 14 }, () => true),
}

export function WorkoutStreakCard({ streak }: { streak?: WorkoutStreak }) {
  const data = streak || defaultStreak

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20">
          <Flame className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Workout Streak</h3>
          <p className="text-xs text-muted-foreground">Keep it going!</p>
        </div>
      </div>
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-5xl font-bold text-foreground">{data.current}</span>
        <span className="text-muted-foreground">days</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {data.history.map((active, i) => (
          <div
            key={i}
            className={`h-8 rounded-md ${active ? 'bg-primary/30' : 'bg-secondary'}`}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Personal best: {data.personalBest} days</p>
    </div>
  )
}
