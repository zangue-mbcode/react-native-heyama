/**
 * Custom hook for managing objects
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import * as objectApi from '../lib/api'
import { getSocket, initSocket } from '../lib/socket'
import { CreateObjectPayload, HeyamaObject } from '../types'

interface UseObjectsReturn {
  objects: HeyamaObject[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createObject: (payload: CreateObjectPayload) => Promise<HeyamaObject>
  deleteObject: (id: string) => Promise<void>
  getObjectById: (id: string) => Promise<HeyamaObject>
}

export const useObjects = (): UseObjectsReturn => {
  const [objects, setObjects] = useState<HeyamaObject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef(getSocket())

  // Initialize Socket.IO on mount
  useEffect(() => {
    const socket = initSocket()
    socketRef.current = socket

    // Listen for real-time updates
    socket.on('objectCreated', (newObject: HeyamaObject) => {
      setObjects((prev) => [newObject, ...prev])
    })

    socket.on('objectDeleted', (id: string) => {
      setObjects((prev) => prev.filter((obj) => obj.id !== id))
    })

    socket.on('objectUpdated', (updatedObject: HeyamaObject) => {
      setObjects((prev) =>
        prev.map((obj) => (obj.id === updatedObject.id ? updatedObject : obj))
      )
    })

    return () => {
      socket.off('objectCreated')
      socket.off('objectDeleted')
      socket.off('objectUpdated')
    }
  }, [])

  // Fetch objects on mount
  const fetchObjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching objects...')
      const data = await objectApi.getObjects()
      setObjects(data)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Une erreur est survenue'
      setError(errorMessage)
      console.error('Error errorMessage:', errorMessage)
      console.error('Error fetching objects:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchObjects()
  }, [fetchObjects])

  // Refresh objects
  const refresh = useCallback(async () => {
    await fetchObjects()
  }, [fetchObjects])

  // Create object
  const handleCreateObject = useCallback(
    async (payload: CreateObjectPayload): Promise<HeyamaObject> => {
      try {
        setError(null)
        const newObject = await objectApi.createObject(payload)
        // Object will be added via socket event, but we add it here for immediate feedback
        setObjects((prev) => [newObject, ...prev])
        return newObject
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la création'
        setError(errorMessage)
        throw err
      }
    },
    []
  )

  // Delete object
  const handleDeleteObject = useCallback(async (id: string) => {
    try {
      setError(null)
      await objectApi.deleteObject(id)
      // Object will be removed via socket event, but we remove it here for immediate feedback
      setObjects((prev) => prev.filter((obj) => obj.id !== id))
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la suppression'
      setError(errorMessage)
      throw err
    }
  }, [])

  // Get object by ID
  const handleGetObjectById = useCallback(async (id: string): Promise<HeyamaObject> => {
    try {
      // First check if object is already in local cache
      const cachedObject = objects.find((obj) => obj.id === id)
      if (cachedObject) {
        return cachedObject
      }

      // If not in cache, fetch from API
      const object = await objectApi.getObject(id)
      return object
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la récupération'
      setError(errorMessage)
      throw err
    }
  }, [objects])

  return {
    objects,
    loading,
    error,
    refresh,
    createObject: handleCreateObject,
    deleteObject: handleDeleteObject,
    getObjectById: handleGetObjectById,
  }
}
