import type { Workout } from './workout.types'

export interface AIRecommendation {
  id: string
  type: 'workout' | 'recovery' | 'nutrition' | 'rest'
  title: string
  description: string
  confidence: number
  workout?: Workout
  createdAt: string
}

export interface AIChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface FatigueAnalysis {
  overall: number
  central: number
  peripheral: number
  status: 'low' | 'moderate' | 'high' | 'critical'
  factors: FatigueFactor[]
}

export interface FatigueFactor {
  name: string
  value: number
  impact: 'positive' | 'negative' | 'neutral'
}

export interface RecoveryScore {
  overall: number
  sleep: number
  nutrition: number
  stress: number
  muscleRecovery: MuscleRecovery[]
  status: 'poor' | 'fair' | 'good' | 'excellent'
}

export interface MuscleRecovery {
  muscleGroup: string
  recovery: number
  readyForTraining: boolean
}

export interface PlateauDetection {
  detected: boolean
  exercise: string
  metric: string
  currentTrend: 'stalled' | 'declining'
  weeksStalled: number
  suggestions: string[]
}
