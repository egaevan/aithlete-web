import { apiClient } from '@/lib/api-client'
import type {
  Schedule,
  CreateScheduleInput,
  UpdateScheduleInput,
  ScheduleFilters,
} from '@/types/schedule.types'
import type { ApiResponse } from '@/types/api.types'

export const scheduleService = {
  async getSchedules(filters?: ScheduleFilters): Promise<Schedule[]> {
    const params: Record<string, unknown> = {}
    if (filters?.dateFrom) params.dateFrom = filters.dateFrom
    if (filters?.dateTo) params.dateTo = filters.dateTo
    if (filters?.type) params.type = filters.type
    if (filters?.completed !== undefined) params.completed = filters.completed

    const response = await apiClient.get<ApiResponse<Schedule[]>>('/api/v1/schedules', params)
    return response.data
  },

  async getSchedule(id: string): Promise<Schedule> {
    const response = await apiClient.get<ApiResponse<Schedule>>(`/api/v1/schedules/${id}`)
    return response.data
  },

  async getTodaySchedule(): Promise<Schedule[]> {
    const today = new Date().toISOString().split('T')[0]
    const response = await apiClient.get<ApiResponse<Schedule[]>>('/api/v1/schedules/today', { date: today })
    return response.data
  },

  async createSchedule(data: CreateScheduleInput): Promise<Schedule> {
    const response = await apiClient.post<ApiResponse<Schedule>>('/api/v1/schedules', data)
    return response.data
  },

  async updateSchedule(id: string, data: UpdateScheduleInput): Promise<Schedule> {
    const response = await apiClient.put<ApiResponse<Schedule>>(`/api/v1/schedules/${id}`, data)
    return response.data
  },

  async deleteSchedule(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/schedules/${id}`)
  },

  async toggleComplete(id: string, completed: boolean): Promise<Schedule> {
    const response = await apiClient.patch<ApiResponse<Schedule>>(`/api/v1/schedules/${id}/toggle`, { completed })
    return response.data
  },
}
