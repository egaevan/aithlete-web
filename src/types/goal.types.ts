export interface Goal {
  id: string
  title: string
  type: 'workouts' | 'volume' | 'calories' | 'streak' | 'custom'
  target: number
  current: number
  unit: string
  period: 'weekly' | 'monthly' | 'one-time'
  deadline?: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateGoalInput {
  title: string
  type: 'workouts' | 'volume' | 'calories' | 'streak' | 'custom'
  target: number
  unit: string
  period: 'weekly' | 'monthly' | 'one-time'
  deadline?: string
}

export interface UpdateGoalInput {
  title?: string
  type?: 'workouts' | 'volume' | 'calories' | 'streak' | 'custom'
  target?: number
  unit?: string
  period?: 'weekly' | 'monthly' | 'one-time'
  deadline?: string
  completed?: boolean
  current?: number
}

export interface GoalFilters {
  type?: string
  period?: string
  completed?: boolean
}
