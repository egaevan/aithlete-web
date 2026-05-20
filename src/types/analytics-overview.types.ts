export interface AnalyticsOverview {
  totalVolume: number
  totalVolumeTrend: string
  avgSession: number
  avgSessionTrend: string
  sessionsPerMonth: number
  sessionsPerMonthTrend: string
  goalCompletion: number
  goalCompletionTrend: string
}

export interface WeeklyVolumeData {
  week: string
  volume: number
}

export interface MuscleVolumeEntry {
  muscle: string
  volume: number
}
