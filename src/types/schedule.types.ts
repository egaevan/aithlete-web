export interface Schedule {
  id: string
  date: string
  time: string
  title: string
  duration: string
  type: 'workout' | 'cardio' | 'rest' | 'stretching' | 'custom'
  completed: boolean
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateScheduleInput {
  date: string
  time: string
  title: string
  duration: string
  type: 'workout' | 'cardio' | 'rest' | 'stretching' | 'custom'
  notes?: string
}

export interface UpdateScheduleInput {
  date?: string
  time?: string
  title?: string
  duration?: string
  type?: 'workout' | 'cardio' | 'rest' | 'stretching' | 'custom'
  completed?: boolean
  notes?: string
}

export interface ScheduleFilters {
  dateFrom?: string
  dateTo?: string
  type?: string
  completed?: boolean
}
