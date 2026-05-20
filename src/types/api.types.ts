export interface TransactionInfo {
  status_code: string
  status_desc: string
}

export interface ApiResponse<T> {
  transaction: TransactionInfo
  data: T
  meta?: PaginationMeta
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  total_pages: number
}

export type WeightUnit = 'lbs' | 'kg'
