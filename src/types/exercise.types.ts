export interface Exercise {
  id: string
  name: string
  description: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  difficulty: Difficulty
  instructions: string[]
  imageUrl?: string
  createdAt: string
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'glutes'
  | 'calves'
  | 'forearms'
  | 'traps'
  | 'full-body'

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'kettlebell'
  | 'resistance-band'
  | 'none'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface ExerciseFilter {
  muscleGroup?: MuscleGroup
  equipment?: Equipment
  difficulty?: Difficulty
  search?: string
}
