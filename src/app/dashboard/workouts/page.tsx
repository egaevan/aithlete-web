'use client'

import { Dumbbell, Plus, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContentContainer } from '@/components/layout/content-container'
import { useWorkouts } from '@/services/workout.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { NewWorkoutDialog } from '@/components/workout/new-workout-dialog'

export default function WorkoutsPage() {
  const { data, isLoading, error } = useWorkouts()
  const [showNewWorkout, setShowNewWorkout] = useState(false)

  return (
    <ContentContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workouts</h1>
          <p className="text-muted-foreground">Track and manage your workout sessions</p>
        </div>
        <Button onClick={() => setShowNewWorkout(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Workout
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load workouts. Make sure the API server is running.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !data?.length ? (
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <Empty>
              <Dumbbell className="h-12 w-12 text-muted-foreground" />
              <EmptyTitle>No workouts yet</EmptyTitle>
              <EmptyDescription>Start tracking your workouts to see them here.</EmptyDescription>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((workout) => (
            <Card key={workout.id} className="border-border/50 transition-colors hover:bg-secondary/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{workout.name}</CardTitle>
                  <Badge variant={workout.completed ? 'default' : 'secondary'}>
                    {workout.completed ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(workout.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {workout.duration} min
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {workout.weightUnit}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {workout.exercises.length} exercises &bull; {workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)} sets
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewWorkoutDialog open={showNewWorkout} onOpenChange={setShowNewWorkout} />
    </ContentContainer>
  )
}
