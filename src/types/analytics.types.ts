export interface DashboardStats {
  caloriesBurned: number
  caloriesTrend: string
  activeMinutes: number
  activeMinutesTrend: string
  goalsCompleted: string
  goalsTotal: number
  goalsTrend: string
  avgHeartRate: number
  heartRateTrend: string
}

export interface WeeklyProgress {
  day: string
  calories: number
  duration: number
}

export interface WorkoutStreak {
  current: number
  personalBest: number
  history: boolean[]
}

export interface RecentActivity {
  id: string
  type: 'workout' | 'achievement' | 'milestone'
  title: string
  description: string
  timestamp: string
}

export interface MuscleRecoveryItem {
  name: string
  recovery: number
}

export interface ScheduleEntry {
  time: string
  title: string
  duration: string
  completed: boolean
  upcoming?: boolean
}

export interface DashboardOverview {
  stats: DashboardStats
  weeklyProgress: WeeklyProgress[]
  streak: WorkoutStreak
  recentActivity: RecentActivity[]
  muscleRecovery: MuscleRecoveryItem[]
  todaySchedule: ScheduleEntry[]
}
