'use client'

import { TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import type { WeeklyProgress } from '@/types/analytics.types'

const defaultData: WeeklyProgress[] = [
  { day: 'Mon', calories: 420, duration: 45 },
  { day: 'Tue', calories: 580, duration: 62 },
  { day: 'Wed', calories: 350, duration: 38 },
  { day: 'Thu', calories: 620, duration: 70 },
  { day: 'Fri', calories: 480, duration: 52 },
  { day: 'Sat', calories: 720, duration: 85 },
  { day: 'Sun', calories: 280, duration: 30 },
]

export function ProgressChart({ data }: { data?: WeeklyProgress[] }) {
  const chartData = data || defaultData

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Weekly Progress</h2>
          <p className="text-sm text-muted-foreground">Calories burned this week</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
          <TrendingUp className="h-4 w-4" />
          <span>+18%</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4adeaf" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4adeaf" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="calories"
              stroke="#4adeaf"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCalories)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
