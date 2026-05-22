'use client'

import { useState } from 'react'
import { Search, Dumbbell, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContentContainer } from '@/components/layout/content-container'
import { useExercises, useMuscleGroups } from '@/services/exercise.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { MuscleGroup } from '@/types/exercise.types'

const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  legs: 'Legs',
  shoulders: 'Shoulders',
  arms: 'Arms',
  core: 'Core',
  glutes: 'Glutes',
  calves: 'Calves',
  forearms: 'Forearms',
  traps: 'Traps',
  'full-body': 'Full Body',
}

export default function ExercisesPage() {
  const [search, setSearch] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null)

  const { data: exercises, isLoading: exercisesLoading, error: exercisesError } = useExercises({
    search: search || undefined,
    muscleGroup: selectedMuscle || undefined,
  })
  const { data: muscleGroups } = useMuscleGroups()

  return (
    <ContentContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Exercise Library</h1>
        <p className="text-muted-foreground">Browse and search exercises by muscle group</p>
      </div>

      {exercisesError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load exercises. Make sure the API server is running.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={!selectedMuscle ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMuscle(null)}
          >
            <Filter className="mr-2 h-4 w-4" />
            All
          </Button>
          {Array.isArray(muscleGroups) && muscleGroups.map((mg, i) => (
            <Button
              key={i}
              variant={selectedMuscle === mg ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMuscle(selectedMuscle === mg ? null : mg)}
            >
              {muscleGroupLabels[mg as MuscleGroup]}
            </Button>
          ))}
        </div>
      </div>

      {/* Exercise List */}
      {exercisesLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !exercises?.length ? (
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <Empty>
              <Dumbbell className="h-12 w-12 text-muted-foreground" />
              <EmptyTitle>No exercises found</EmptyTitle>
              <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="border-border/50 transition-colors hover:bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-lg">{exercise.name}</CardTitle>
                <CardDescription className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{muscleGroupLabels[exercise.muscleGroup]}</Badge>
                  <Badge variant="outline">{exercise.equipment}</Badge>
                  <Badge variant={exercise.difficulty === 'beginner' ? 'default' : exercise.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                    {exercise.difficulty}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ContentContainer>
  )
}
