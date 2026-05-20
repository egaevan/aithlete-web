import { cn } from '@/lib/utils'

interface ScheduleItemProps {
  time: string
  title: string
  duration: string
  completed: boolean
  upcoming?: boolean
  className?: string
}

export function ScheduleItem({ time, title, duration, completed, upcoming, className }: ScheduleItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl p-3 transition-colors',
        upcoming ? 'border border-primary/20 bg-primary/10' : 'bg-secondary/30',
        className,
      )}
    >
      <div
        className={cn(
          'h-3 w-3 shrink-0 rounded-full',
          completed ? 'bg-primary' : upcoming ? 'animate-pulse bg-primary' : 'bg-muted',
        )}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium',
            completed ? 'text-muted-foreground line-through' : 'text-foreground',
          )}
        >
          {title}
        </p>
        <p className="text-xs text-muted-foreground">
          {time} &bull; {duration}
        </p>
      </div>
      {upcoming && <span className="text-xs font-medium text-primary">Next</span>}
    </div>
  )
}
