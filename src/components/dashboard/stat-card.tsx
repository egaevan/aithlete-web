import { type ComponentType } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  trend: string
  color?: string
  unit?: string
  className?: string
}

export function StatCard({ icon: Icon, label, value, trend, color = 'text-primary', unit, className }: StatCardProps) {
  return (
    <div className={cn('rounded-2xl border border-border/50 bg-card p-4 lg:p-5', className)}>
      <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary', color)}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      <p className="mt-1 text-xs text-primary">{trend}</p>
    </div>
  )
}
