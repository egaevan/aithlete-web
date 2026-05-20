'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import type { WeeklyProgress } from '@/types/analytics.types'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const defaultData: WeeklyProgress[] = [
  { day: 'Mon', calories: 420, duration: 45 },
  { day: 'Tue', calories: 580, duration: 62 },
  { day: 'Wed', calories: 350, duration: 38 },
  { day: 'Thu', calories: 620, duration: 70 },
  { day: 'Fri', calories: 480, duration: 52 },
  { day: 'Sat', calories: 720, duration: 85 },
  { day: 'Sun', calories: 280, duration: 30 },
]

export function WeeklyAnalytics({ data }: { data?: WeeklyProgress[] }) {
  const chartData = data || defaultData
  const todayIndex = new Date().getDay()
  const todayName = dayNames[todayIndex]

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const idx = chartData.findIndex((d) => d.day === todayName)
    return idx >= 0 ? idx : chartData.length - 1
  })

  const selectedDay = chartData[selectedIndex]
  const totalDuration = chartData.reduce((sum, d) => sum + d.duration, 0)
  const totalCalories = chartData.reduce((sum, d) => sum + d.calories, 0)

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Weekly Analytics</h2>
        <Link href="/dashboard/analytics" className="flex items-center gap-1 text-sm text-primary hover:underline">
          View Details <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {selectedDay && (
        <div className="mb-4 flex items-center justify-between rounded-xl bg-secondary/30 px-4 py-2">
          <div>
            <p className="text-sm font-medium text-foreground">{selectedDay.day}</p>
            <p className="text-xs text-muted-foreground">
              {selectedDay.duration} min &bull; {selectedDay.calories} cal
            </p>
          </div>
          <p className="text-sm text-primary font-medium">
            {Math.round(selectedDay.calories / Math.max(selectedDay.duration, 1) * 10) / 10} cal/min
          </p>
        </div>
      )}

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={24}>
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
            <Bar
              dataKey="duration"
              radius={[6, 6, 0, 0]}
              onClick={(entry) => {
                if (entry) {
                  const idx = chartData.findIndex((d) => d.day === entry.day)
                  if (idx >= 0) setSelectedIndex(idx)
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === selectedIndex ? '#4adeaf' : '#2a2a35'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border/50 pt-4 text-center">
        <div>
          <p className="text-2xl font-bold text-foreground">{chartData.length}</p>
          <p className="text-xs text-muted-foreground">Total Workouts</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{totalDuration}</p>
          <p className="text-xs text-muted-foreground">Active Minutes</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">{totalCalories.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Calories Burned</p>
        </div>
      </div>
    </div>
  )
}
