import { create } from 'zustand'
import type { Workout, CreateWorkoutInput, Set } from '@/types/workout.types'

interface WorkoutState {
  activeWorkout: Workout | null
  isWorkoutActive: boolean
  setActiveWorkout: (workout: Workout | null) => void
  startWorkout: (input: CreateWorkoutInput) => void
  endWorkout: () => void
  addSet: (exerciseIndex: number, set: Set) => void
  removeSet: (exerciseIndex: number, setIndex: number) => void
  updateSet: (exerciseIndex: number, setIndex: number, set: Partial<Set>) => void
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  activeWorkout: null,
  isWorkoutActive: false,
  setActiveWorkout: (workout) => set({ activeWorkout: workout, isWorkoutActive: !!workout }),
  startWorkout: (input) => {
    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      name: input.name,
      date: input.date,
      duration: 0,
      calories: 0,
      avgHeartRate: undefined,
      weightUnit: input.weightUnit,
      exercises: input.exercises.map((ex) => ({
        id: crypto.randomUUID(),
        exercise: {
          id: ex.exerciseId,
          name: '',
          description: '',
          muscleGroup: 'full-body',
          equipment: 'none',
          difficulty: 'beginner',
          instructions: [],
          createdAt: new Date().toISOString(),
        },
        sets: ex.sets.map((s) => ({
          id: crypto.randomUUID(),
          reps: s.reps,
          weight: s.weight,
          completed: false,
          rpe: s.rpe,
        })),
      })),
      notes: input.notes,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set({ activeWorkout: newWorkout, isWorkoutActive: true })
  },
  endWorkout: () => set({ activeWorkout: null, isWorkoutActive: false }),
  addSet: (exerciseIndex, setToAdd) =>
    set((state) => {
      if (!state.activeWorkout) return state
      const exercises = [...state.activeWorkout.exercises]
      exercises[exerciseIndex] = {
        ...exercises[exerciseIndex],
        sets: [...exercises[exerciseIndex].sets, setToAdd],
      }
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises,
          updatedAt: new Date().toISOString(),
        },
      }
    }),
  removeSet: (exerciseIndex, setIndex) =>
    set((state) => {
      if (!state.activeWorkout) return state
      const exercises = [...state.activeWorkout.exercises]
      const sets = exercises[exerciseIndex].sets.filter((_, i) => i !== setIndex)
      exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets }
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises,
          updatedAt: new Date().toISOString(),
        },
      }
    }),
  updateSet: (exerciseIndex, setIndex, updates) =>
    set((state) => {
      if (!state.activeWorkout) return state
      const exercises = [...state.activeWorkout.exercises]
      const sets = [...exercises[exerciseIndex].sets]
      sets[setIndex] = { ...sets[setIndex], ...updates }
      exercises[exerciseIndex] = { ...exercises[exerciseIndex], sets }
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises,
          updatedAt: new Date().toISOString(),
        },
      }
    }),
}))
