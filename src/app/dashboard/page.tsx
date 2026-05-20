'use client'

import { StatsGrid } from '@/components/dashboard/stats-grid'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { AICoachPanel } from '@/components/dashboard/ai-coach-panel'
import { WeeklyAnalytics } from '@/components/dashboard/weekly-analytics'
import { WorkoutStreakCard } from '@/components/dashboard/workout-streak'
import { MuscleRecovery } from '@/components/dashboard/muscle-recovery'
import { AIRecommendationCard } from '@/components/dashboard/ai-recommendation-card'
import { TodaySchedule } from '@/components/dashboard/today-schedule'
import { ContentContainer } from '@/components/layout/content-container'
import { useDashboardOverview } from '@/services/analytics.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardOverview()

  if (isLoading) {
    return (
      <ContentContainer>
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/50 bg-card p-4 lg:p-5">
              <Skeleton className="mb-3 h-10 w-10 rounded-xl" />
              <Skeleton className="mb-1 h-3 w-20" />
              <Skeleton className="mb-1 h-7 w-16" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </ContentContainer>
    )
  }

  if (error) {
    return (
      <ContentContainer>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Make sure the API server is running.
          </AlertDescription>
        </Alert>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <StatsGrid stats={data?.stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          <ProgressChart data={data?.weeklyProgress} />
          <AICoachPanel />
          <WeeklyAnalytics data={data?.weeklyProgress} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <WorkoutStreakCard streak={data?.streak} />
          <MuscleRecovery muscles={data?.muscleRecovery} />
          <AIRecommendationCard />
          <TodaySchedule />
        </div>
      </div>
    </ContentContainer>
  )
}
