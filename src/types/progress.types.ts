export interface BodyWeightEntry {
  id: string
  date: string
  weight: number
  bodyFatPercentage?: number
}

export interface StrengthMetric {
  exercise: string
  date: string
  oneRepMax: number
  volume: number
}

export interface ConsistencyMetric {
  week: string
  workoutsCompleted: number
  workoutsPlanned: number
  streak: number
}

export interface MuscleVolumeData {
  muscleGroup: string
  volume: number
  sessions: number
  trend: 'up' | 'down' | 'stable'
}

export interface ProgressOverview {
  bodyWeight: BodyWeightEntry[]
  strength: StrengthMetric[]
  consistency: ConsistencyMetric[]
  muscleVolume: MuscleVolumeData[]
}
