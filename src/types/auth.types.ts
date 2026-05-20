export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  birthday?: string
  gender?: 'male' | 'female' | 'other'
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  name: string
  birthday: string
  gender: 'male' | 'female' | 'other'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}
