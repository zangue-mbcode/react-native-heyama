/**
 * TypeScript types for the Heyama application
 */

export interface HeyamaObject {
  id: string
  title: string
  description: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface CreateObjectPayload {
  title: string
  description: string
  image?: {
    uri: string
    type: string
    name: string
  }
}

export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
}

export interface ApiError {
  response?: {
    status: number
    data?: {
      message?: string
      error?: string
    }
  }
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SocketEvents {
  objectCreated: (object: HeyamaObject) => void
  objectDeleted: (id: string) => void
  objectUpdated: (object: HeyamaObject) => void
}
