'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateWorkout } from '@/services/workout.queries'
import { useExercises } from '@/services/exercise.queries'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import type { WeightUnit } from '@/types/api.types'

const workoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  date: z.string().min(1, 'Date is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  calories: z.coerce.number().min(0, 'Calories must be 0 or more'),
  avgHeartRate: z.coerce.number().min(0).optional(),
  weightUnit: z.enum(['lbs', 'kg']),
  notes: z.string().optional(),
  exercises: z.array(
    z.object({
      exerciseId: z.string().min(1, 'Exercise is required'),
      sets: z.array(
        z.object({
          reps: z.coerce.number().min(1, 'Reps must be at least 1'),
          weight: z.coerce.number().min(0, 'Weight must be 0 or more'),
        }),
      ).min(1, 'At least one set is required'),
    }),
  ).min(1, 'At least one exercise is required'),
})

type WorkoutFormData = z.infer<typeof workoutSchema>

interface NewWorkoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewWorkoutDialog({ open, onOpenChange }: NewWorkoutDialogProps) {
  const createMutation = useCreateWorkout()
  const { data: exercisesData } = useExercises()
  const [exerciseForms, setExerciseForms] = useState<Array<{ exerciseId: string; sets: Array<{ reps: number; weight: number }> }>>([
    { exerciseId: '', sets: [{ reps: 10, weight: 0 }] },
  ])

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: '',
      date: new Date().toISOString().split('T')[0],
      duration: 30,
      calories: 0,
      avgHeartRate: undefined,
      weightUnit: 'lbs',
      notes: '',
      exercises: [],
    },
  })

  const weightUnit = form.watch('weightUnit')

  const addExercise = () => {
    setExerciseForms([...exerciseForms, { exerciseId: '', sets: [{ reps: 10, weight: 0 }] }])
  }

  const removeExercise = (index: number) => {
    setExerciseForms(exerciseForms.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: 'exerciseId' | 'sets', value: unknown) => {
    const updated = [...exerciseForms]
    updated[index] = { ...updated[index], [field]: value }
    setExerciseForms(updated)
  }

  const addSet = (exerciseIndex: number) => {
    const updated = [...exerciseForms]
    updated[exerciseIndex] = {
      ...updated[exerciseIndex],
      sets: [...updated[exerciseIndex].sets, { reps: 10, weight: 0 }],
    }
    setExerciseForms(updated)
  }

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...exerciseForms]
    updated[exerciseIndex] = {
      ...updated[exerciseIndex],
      sets: updated[exerciseIndex].sets.filter((_, i) => i !== setIndex),
    }
    setExerciseForms(updated)
  }

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    const updated = [...exerciseForms]
    updated[exerciseIndex].sets[setIndex] = { ...updated[exerciseIndex].sets[setIndex], [field]: value }
    setExerciseForms(updated)
  }

  const onSubmit = (data: WorkoutFormData) => {
    createMutation.mutate(
      {
        name: data.name,
        date: data.date,
        duration: data.duration,
        calories: data.calories,
        avgHeartRate: data.avgHeartRate || undefined,
        weightUnit: data.weightUnit,
        notes: data.notes,
        exercises: exerciseForms.map((ex) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets.map((s) => ({ reps: s.reps, weight: s.weight })),
        })),
      },
      {
        onSuccess: () => {
          toast.success('Workout created successfully!')
          onOpenChange(false)
          form.reset()
          setExerciseForms([{ exerciseId: '', sets: [{ reps: 10, weight: 0 }] }])
        },
        onError: () => {
          toast.error('Failed to create workout')
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Workout</DialogTitle>
          <DialogDescription>Log your workout session with exercises and sets.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input id="workout-name" placeholder="e.g. Upper Body Power" {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="workout-date">Date</Label>
              <Input id="workout-date" type="date" {...form.register('date')} />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="workout-duration">Duration (min)</Label>
              <Input id="workout-duration" type="number" min={1} {...form.register('duration')} />
              {form.formState.errors.duration && (
                <p className="text-sm text-destructive">{form.formState.errors.duration.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Weight Unit</Label>
              <RadioGroup
                value={weightUnit}
                onValueChange={(value: WeightUnit) => form.setValue('weightUnit', value)}
                className="flex gap-4 pt-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="lbs" id="unit-lbs" />
                  <Label htmlFor="unit-lbs" className="cursor-pointer text-sm">lbs</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="kg" id="unit-kg" />
                  <Label htmlFor="unit-kg" className="cursor-pointer text-sm">kg</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="workout-calories">Calories Burned</Label>
              <Input id="workout-calories" type="number" min={0} placeholder="kcal" {...form.register('calories')} />
              {form.formState.errors.calories && (
                <p className="text-sm text-destructive">{form.formState.errors.calories.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="workout-heart-rate">Avg Heart Rate (bpm)</Label>
              <Input id="workout-heart-rate" type="number" min={0} placeholder="optional" {...form.register('avgHeartRate')} />
              {form.formState.errors.avgHeartRate && (
                <p className="text-sm text-destructive">{form.formState.errors.avgHeartRate.message}</p>
              )}
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Exercises</Label>
              <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                <Plus className="mr-1 h-3 w-3" />
                Add Exercise
              </Button>
            </div>

            {exerciseForms.map((exerciseForm, exIndex) => (
              <div key={exIndex} className="rounded-xl border border-border/50 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Select
                    value={exerciseForm.exerciseId}
                    onValueChange={(value) => updateExercise(exIndex, 'exerciseId', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {exercisesData?.map((ex) => (
                        <SelectItem key={ex.id} value={ex.id}>
                          {ex.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {exerciseForms.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeExercise(exIndex)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                {/* Sets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sets</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => addSet(exIndex)}>
                      <Plus className="mr-1 h-3 w-3" />
                      Add Set
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {exerciseForm.sets.map((set, setIndex) => (
                      <div key={setIndex} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-8">Set {setIndex + 1}</span>
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={set.reps}
                          onChange={(e) => updateSet(exIndex, setIndex, 'reps', Number(e.target.value))}
                          className="w-20"
                        />
                        <Input
                          type="number"
                          placeholder="Weight"
                          value={set.weight}
                          onChange={(e) => updateSet(exIndex, setIndex, 'weight', Number(e.target.value))}
                          className="w-24"
                        />
                        <span className="text-xs text-muted-foreground w-8">{weightUnit}</span>
                        {exerciseForm.sets.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeSet(exIndex, setIndex)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="workout-notes">Notes (optional)</Label>
            <Textarea id="workout-notes" placeholder="How did the workout feel?" {...form.register('notes')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Workout
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
