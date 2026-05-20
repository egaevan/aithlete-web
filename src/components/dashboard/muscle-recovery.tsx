'use client'

import { cn } from '@/lib/utils'

interface MuscleRecoveryData {
  name: string
  recovery: number
}

const defaultMuscles: MuscleRecoveryData[] = [
  { name: 'Chest', recovery: 92 },
  { name: 'Back', recovery: 78 },
  { name: 'Legs', recovery: 45 },
  { name: 'Arms', recovery: 88 },
  { name: 'Core', recovery: 65 },
]

export function MuscleRecovery({ muscles }: { muscles?: MuscleRecoveryData[] }) {
  const data = muscles || defaultMuscles
  const needsRecovery = data.find((m) => m.recovery < 60)

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Muscle Recovery</h3>
        <span className="text-xs text-muted-foreground">Updated 2h ago</span>
      </div>
      <div className="space-y-4">
        {data.map((muscle) => (
          <div key={muscle.name}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-muted-foreground">{muscle.name}</span>
              <span className={cn(muscle.recovery < 60 ? 'text-amber-400' : 'text-primary')}>
                {muscle.recovery}%
              </span>
            </div>
            <div className="overflow-hidden rounded-full bg-secondary">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${muscle.recovery}%`,
                  backgroundColor: muscle.recovery < 60 ? '#f59e0b' : '#4adeaf',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {needsRecovery && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
          <p className="text-xs text-amber-400">
            <strong>Note:</strong> {needsRecovery.name} need more recovery time before intense training.
          </p>
        </div>
      )}
    </div>
  )
}
