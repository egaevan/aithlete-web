'use client'

import { ScheduleItem } from '@/components/dashboard/schedule-item'
import { useTodaySchedule } from '@/services/schedule.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const defaultSchedule = [
  { time: '6:30 AM', title: 'Morning Run', duration: '30 min', completed: true },
  { time: '12:00 PM', title: 'Core Workout', duration: '20 min', completed: true },
  { time: '6:00 PM', title: 'Upper Body', duration: '45 min', completed: false, upcoming: true },
]

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

export function TodaySchedule() {
  const { data: schedules, isLoading } = useTodaySchedule()

  const items = isLoading
    ? null
    : (schedules || []).map((s) => ({
        time: formatTime(s.time),
        title: s.title,
        duration: s.duration,
        completed: s.completed,
        upcoming: !s.completed,
      }))

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const data = items && items.length > 0 ? items : defaultSchedule

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Today&apos;s Schedule</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/schedule" className="text-xs">
            View All
          </Link>
        </Button>
      </div>
      <div className="space-y-3">
        {data.map((item, index) => (
          <ScheduleItem key={index} {...item} />
        ))}
      </div>
    </div>
  )
}
