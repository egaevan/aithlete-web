export const QUERY_KEYS = {
  health: {
    all: ['health'] as const,
    check: () => [...QUERY_KEYS.health.all, 'check'] as const,
  },
  auth: {
    all: ['auth'] as const,
    user: () => [...QUERY_KEYS.auth.all, 'user'] as const,
    session: () => [...QUERY_KEYS.auth.all, 'session'] as const,
  },
  workouts: {
    all: ['workouts'] as const,
    list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.workouts.all, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.workouts.all, 'detail', id] as const,
    history: (filters?: Record<string, unknown>) => [...QUERY_KEYS.workouts.all, 'history', filters] as const,
    exercises: (workoutId: string) => [...QUERY_KEYS.workouts.all, 'exercises', workoutId] as const,
    set: (workoutId: string, exerciseId: string, setId: string) =>
      [...QUERY_KEYS.workouts.all, 'sets', workoutId, exerciseId, setId] as const,
  },
  exercises: {
    all: ['exercises'] as const,
    list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.exercises.all, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.exercises.all, 'detail', id] as const,
    muscleGroups: () => [...QUERY_KEYS.exercises.all, 'muscle-groups'] as const,
  },
  progress: {
    all: ['progress'] as const,
    overview: () => [...QUERY_KEYS.progress.all, 'overview'] as const,
    bodyWeight: () => [...QUERY_KEYS.progress.all, 'body-weight'] as const,
    strength: () => [...QUERY_KEYS.progress.all, 'strength'] as const,
    consistency: () => [...QUERY_KEYS.progress.all, 'consistency'] as const,
    muscleVolume: () => [...QUERY_KEYS.progress.all, 'muscle-volume'] as const,
  },
  ai: {
    all: ['ai'] as const,
    recommendations: () => [...QUERY_KEYS.ai.all, 'recommendations'] as const,
    chat: (sessionId: string) => [...QUERY_KEYS.ai.all, 'chat', sessionId] as const,
    fatigue: () => [...QUERY_KEYS.ai.all, 'fatigue'] as const,
    recovery: () => [...QUERY_KEYS.ai.all, 'recovery'] as const,
    plateau: () => [...QUERY_KEYS.ai.all, 'plateau'] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...QUERY_KEYS.analytics.all, 'dashboard'] as const,
    weekly: () => [...QUERY_KEYS.analytics.all, 'weekly'] as const,
    streak: () => [...QUERY_KEYS.analytics.all, 'streak'] as const,
    overview: () => [...QUERY_KEYS.analytics.all, 'overview'] as const,
    weeklyVolume: () => [...QUERY_KEYS.analytics.all, 'volume', 'weekly'] as const,
    muscleVolume: () => [...QUERY_KEYS.analytics.all, 'volume', 'muscle'] as const,
  },
  schedules: {
    all: ['schedules'] as const,
    list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.schedules.all, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.schedules.all, 'detail', id] as const,
    today: () => [...QUERY_KEYS.schedules.all, 'today'] as const,
  },
  goals: {
    all: ['goals'] as const,
    list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.goals.all, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.goals.all, 'detail', id] as const,
  },
}
