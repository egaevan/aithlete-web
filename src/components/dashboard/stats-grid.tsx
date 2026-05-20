'use client'

import { Flame, Timer, Target, Heart } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import type { DashboardStats } from '@/types/analytics.types'

const defaultStats: DashboardStats = {
  caloriesBurned: 2847,
  caloriesTrend: '+12%',
  activeMinutes: 382,
  activeMinutesTrend: '+8%',
  goalsCompleted: '12',
  goalsTotal: 15,
  goalsTrend: '80%',
  avgHeartRate: 72,
  heartRateTrend: 'Normal',
}

export function StatsGrid({ stats }: { stats?: DashboardStats }) {
  const data = stats || defaultStats

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard icon={Flame} label="Calories Burned" value={data.caloriesBurned.toLocaleString()} trend={data.caloriesTrend} color="text-orange-400" />
      <StatCard icon={Timer} label="Active Minutes" value={data.activeMinutes.toString()} trend={data.activeMinutesTrend} />
      <StatCard icon={Target} label="Goals Completed" value={`${data.goalsCompleted}/${data.goalsTotal}`} trend={data.goalsTrend} color="text-blue-400" />
      <StatCard icon={Heart} label="Avg Heart Rate" value={data.avgHeartRate.toString()} trend={data.heartRateTrend} color="text-red-400" unit="bpm" />
    </div>
  )
}
