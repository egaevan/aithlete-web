import { apiClient } from '@/lib/api-client'
import type { User, UserProfile } from '@/types/auth.types'
import type { ApiResponse } from '@/types/api.types'

export const profileService = {
  async updateProfile(data: UserProfile): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('/api/v1/profile', data)
    return response.data
  },
}
