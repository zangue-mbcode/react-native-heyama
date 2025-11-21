/**
 * API client configuration with Axios
 */

import axios, { AxiosInstance } from 'axios'
import { CreateObjectPayload, HeyamaObject } from '../types'

const API_URL = 'https://nestjs-heyama-api-test.onrender.com'

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds for HTTPS requests
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Fetch all objects
 */
export const getObjects = async (params?: { page?: number; limit?: number }) => {
  try {
    console.log('Fetching from:', API_URL + '/objects')
    const response = await api.get<HeyamaObject[]>('/objects', { params })
    console.log('Fetched objects:', response.data)
    return response.data
  } catch (error: any) {
    console.error('getObjects error:', {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      url: error?.config?.url,
    })
    throw error
  }
}

/**
 * Get a single object by ID
 */
export const getObject = async (id: string) => {
  try {
    const response = await api.get<HeyamaObject>(`/objects/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Create a new object
 */
export const createObject = async (payload: CreateObjectPayload) => {
  try {
    const formData = new FormData()
    formData.append('title', payload.title)
    formData.append('description', payload.description)

    if (payload.image) {
      const uri = payload.image.uri
      const filename = payload.image.name || 'image.jpg'
      const type = payload.image.type || 'image/jpeg'

      formData.append('file', {
        uri,
        type,
        name: filename,
      } as any)
    }

    const response = await api.post<HeyamaObject>('/objects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Delete an object
 */
export const deleteObject = async (id: string) => {
  try {
    const response = await api.delete(`/objects/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Update an object
 */
export const updateObject = async (id: string, payload: Partial<CreateObjectPayload>) => {
  try {
    const response = await api.patch<HeyamaObject>(`/objects/${id}`, payload)
    return response.data
  } catch (error) {
    throw error
  }
}

export default api
