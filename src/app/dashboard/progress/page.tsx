'use client'

import { TrendingUp, Weight, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { ContentContainer } from '@/components/layout/content-container'
import { useBodyWeight, useStrength, useConsistency } from '@/services/progress.queries'
import { Skeleton } from '@/components/ui/skeleton'

const mockBodyWeight = [
  { date: 'Week 1', weight: 180 },
  { date: 'Week 2', weight: 179.5 },
  { date: 'Week 3', weight: 178.8 },
  { date: 'Week 4', weight: 178.2 },
  { date: 'Week 5', weight: 177.5 },
  { date: 'Week 6', weight: 177.0 },
]

const mockStrength = [
  { exercise: 'Bench Press', weight: 185 },
  { exercise: 'Squat', weight: 225 },
  { exercise: 'Deadlift', weight: 275 },
  { exercise: 'Overhead Press', weight: 115 },
]

const mockConsistency = [
  { week: 'W1', completed: 4, planned: 5 },
  { week: 'W2', completed: 5, planned: 5 },
  { week: 'W3', completed: 3, planned: 5 },
  { week: 'W4', completed: 5, planned: 5 },
  { week: 'W5', completed: 4, planned: 5 },
  { week: 'W6', completed: 5, planned: 5 },
]

function transformBodyWeight(raw: { id: string; date: string; weight: number; bodyFatPercentage?: number }[]) {
  return raw.map((entry, i) => ({
    date: `W${i + 1}`,
    weight: entry.weight,
  }))
}

function transformStrength(raw: { exercise: string; date: string; oneRepMax: number; volume: number }[]) {
  return raw.map((entry) => ({
    exercise: entry.exercise,
    weight: entry.oneRepMax,
  }))
}

function transformConsistency(raw: { week: string; workoutsCompleted: number; workoutsPlanned: number; streak: number }[]) {
  return raw.map((entry) => ({
    week: entry.week,
    completed: entry.workoutsCompleted,
    planned: entry.workoutsPlanned,
  }))
}

export default function ProgressPage() {
  const { data: bodyWeightData, isLoading: bwLoading } = useBodyWeight()
  const { data: strengthData, isLoading: strLoading } = useStrength()
  const { data: consistencyData, isLoading: conLoading } = useConsistency()

  const bwData = bodyWeightData?.length ? transformBodyWeight(bodyWeightData) : mockBodyWeight
  const strData = strengthData?.length ? transformStrength(strengthData) : mockStrength
  const conData = consistencyData?.length ? transformConsistency(consistencyData) : mockConsistency

  return (
    <ContentContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Progress Tracking</h1>
        <p className="text-muted-foreground">Monitor your fitness journey and improvements</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Current Weight</CardDescription>
            <CardTitle className="text-2xl">
              {bwLoading ? <Skeleton className="h-8 w-20" /> : `${bwData[bwData.length - 1]?.weight || 177} lbs`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>-3 lbs this month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Bench Press 1RM</CardDescription>
            <CardTitle className="text-2xl">{strLoading ? <Skeleton className="h-8 w-20" /> : '185 lbs'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>+10 lbs this month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Workout Rate</CardDescription>
            <CardTitle className="text-2xl">{conLoading ? <Skeleton className="h-8 w-20" /> : '87%'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-primary">
              <Activity className="h-4 w-4" />
              <span>26/30 completed</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-2xl">14 days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>Personal best: 21</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="body-weight" className="space-y-6">
        <TabsList>
          <TabsTrigger value="body-weight">Body Weight</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="consistency">Consistency</TabsTrigger>
        </TabsList>

        <TabsContent value="body-weight">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="h-5 w-5" />
                Body Weight Trend
              </CardTitle>
              <CardDescription>Your body weight over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bwData}>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a35', borderRadius: '8px' }}
                      labelStyle={{ color: '#9ca3af' }}
                      itemStyle={{ color: '#4adeaf' }}
                      formatter={(value: number) => [`${value} lbs`, 'Weight']}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#4adeaf"
                      strokeWidth={2}
                      dot={{ fill: '#4adeaf', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strength">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Strength Progression
              </CardTitle>
              <CardDescription>Your current 1-rep max for key lifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={strData}>
                    <XAxis dataKey="exercise" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a35', borderRadius: '8px' }}
                      labelStyle={{ color: '#9ca3af' }}
                      itemStyle={{ color: '#4adeaf' }}
                      formatter={(value: number) => [`${value} lbs`, '1RM']}
                    />
                    <Bar dataKey="weight" radius={[6, 6, 0, 0]}>
                      {strData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill="#4adeaf" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consistency">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Workout Consistency
              </CardTitle>
              <CardDescription>Completed vs planned workouts per week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conData}>
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      domain={[0, 'auto']}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #2a2a35', borderRadius: '8px' }}
                      labelStyle={{ color: '#9ca3af' }}
                    />
                    <Bar dataKey="completed" name="Completed" fill="#4adeaf" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="planned" name="Planned" fill="#2a2a35" radius={[6, 6, 0, 0]} />
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
