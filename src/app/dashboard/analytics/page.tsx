'use client'

import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { ContentContainer } from '@/components/layout/content-container'
import { StatCard } from '@/components/dashboard/stat-card'
import { useAnalyticsOverview, useWeeklyVolume, useMuscleVolume } from '@/services/analytics.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const defaultWeeklyVolume = [
  { week: 'W1', volume: 12500 },
  { week: 'W2', volume: 14200 },
  { week: 'W3', volume: 13800 },
  { week: 'W4', volume: 15600 },
  { week: 'W5', volume: 16200 },
  { week: 'W6', volume: 17800 },
]

const defaultMuscleVolume = [
  { muscle: 'Chest', volume: 4200 },
  { muscle: 'Back', volume: 3800 },
  { muscle: 'Legs', volume: 5100 },
  { muscle: 'Shoulders', volume: 2800 },
  { muscle: 'Arms', volume: 3200 },
]

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useAnalyticsOverview()
  const { data: weeklyVolume, isLoading: volumeLoading } = useWeeklyVolume()
  const { data: muscleVolume, isLoading: muscleLoading } = useMuscleVolume()

  if (overviewLoading) {
    return (
      <ContentContainer>
        <div className="mb-6">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </ContentContainer>
    )
  }

  if (overviewError) {
    return (
      <ContentContainer>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load analytics data. Make sure the API server is running.
          </AlertDescription>
        </Alert>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Deep insights into your training data</p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={BarChart3}
          label="Total Volume"
          value={overview ? `${(overview.totalVolume / 1000).toFixed(1)}K` : '80.1K'}
          trend={overview?.totalVolumeTrend || '+15%'}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Session"
          value={overview?.avgSession.toString() || '58'}
          trend={overview?.avgSessionTrend || '+5 min'}
          unit="min"
        />
        <StatCard
          icon={Calendar}
          label="Sessions/Month"
          value={overview?.sessionsPerMonth.toString() || '22'}
          trend={overview?.sessionsPerMonthTrend || '+3'}
        />
        <StatCard
          icon={Target}
          label="Goal Completion"
          value={overview ? `${overview.goalCompletion}%` : '87%'}
          trend={overview?.goalCompletionTrend || '+4%'}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="volume" className="space-y-6">
        <TabsList>
          <TabsTrigger value="volume">Weekly Volume</TabsTrigger>
          <TabsTrigger value="muscle">Muscle Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="volume">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Weekly Training Volume</CardTitle>
              <CardDescription>Total volume (sets x reps x weight) per week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeLoading ? defaultWeeklyVolume : weeklyVolume || defaultWeeklyVolume}>
                    <defs>
                      <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4adeaf" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4adeaf" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a35', borderRadius: '8px' }}
                      labelStyle={{ color: '#9ca3af' }}
                      itemStyle={{ color: '#4adeaf' }}
                      formatter={(value: number) => [`${(value / 1000).toFixed(1)}K lbs`, 'Volume']}
                    />
                    <Area type="monotone" dataKey="volume" stroke="#4adeaf" strokeWidth={2} fill="url(#volumeGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="muscle">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Muscle Group Volume</CardTitle>
              <CardDescription>Training volume distribution by muscle group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={muscleLoading ? defaultMuscleVolume : muscleVolume || defaultMuscleVolume}>
                    <XAxis dataKey="muscle" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a35', borderRadius: '8px' }}
                      labelStyle={{ color: '#9ca3af' }}
                      itemStyle={{ color: '#4adeaf' }}
                      formatter={(value: number) => [`${(value / 1000).toFixed(1)}K lbs`, 'Volume']}
                    />
                    <Bar dataKey="volume" fill="#4adeaf" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ContentContainer>
  )
}
