import type { Exercise } from './exercise.types'
import type { WeightUnit } from './api.types'

export interface Workout {
  id: string
  name: string
  date: string
  duration: number
  calories: number
  avgHeartRate?: number
  weightUnit: WeightUnit
  exercises: WorkoutExercise[]
  notes?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkoutExercise {
  id: string
  exercise: Exercise
  sets: Set[]
}

export interface Set {
  id: string
  reps: number
  weight: number
  completed: boolean
  rpe?: number
}

export interface CreateWorkoutInput {
  name: string
  date: string
  duration: number
  calories: number
  avgHeartRate?: number
  weightUnit: WeightUnit
  exercises: CreateWorkoutExerciseInput[]
  notes?: string
}

export interface CreateWorkoutExerciseInput {
  exerciseId: string
  sets: CreateSetInput[]
}

export interface CreateSetInput {
  reps: number
  weight: number
  rpe?: number
}

export interface UpdateWorkoutInput {
  name?: string
  date?: string
  duration?: number
  calories?: number
  avgHeartRate?: number
  weightUnit?: WeightUnit
  exercises?: CreateWorkoutExerciseInput[]
  notes?: string
  completed?: boolean
}

export interface WorkoutHistoryFilters {
  dateFrom?: string
  dateTo?: string
  muscleGroup?: string
  limit?: number
  offset?: number
}

export interface AddExerciseToWorkoutInput {
  exerciseId: string
  sets: SetInput[]
  notes?: string
}

export interface SetInput {
  setNumber: number
  reps: number
  weight: number
  completed?: boolean
  rpe?: number
}

export interface UpdateSetInput {
  reps?: number
  weight?: number
  completed?: boolean
  rpe?: number
}
