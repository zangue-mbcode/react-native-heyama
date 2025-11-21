/**
 * Custom hook for image selection with permissions handling
 */

import { useState, useCallback } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'

interface PickedImage {
  uri: string
  type: string
  name: string
  width?: number
  height?: number
  fileSize?: number
}

interface UseImagePickerReturn {
  image: PickedImage | null
  loading: boolean
  error: string | null
  pickFromGallery: () => Promise<void>
  pickFromCamera: () => Promise<void>
  reset: () => void
}

export const useImagePicker = (): UseImagePickerReturn => {
  const [image, setImage] = useState<PickedImage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestPermissions = async (type: 'camera' | 'library') => {
    try {
      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert(
            'Permission refusée',
            'Nous avons besoin de votre permission pour accéder à la caméra.'
          )
          return false
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert(
            'Permission refusée',
            'Nous avons besoin de votre permission pour accéder à votre galerie.'
          )
          return false
        }
      }
      return true
    } catch (err) {
      setError('Erreur lors de la demande de permission')
      return false
    }
  }

  const pickFromGallery = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const hasPermission = await requestPermissions('library')
      if (!hasPermission) return

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0]
        const filename = asset.uri.split('/').pop() || 'image.jpg'

        setImage({
          uri: asset.uri,
          type: 'image/jpeg',
          name: filename,
          width: asset.width,
          height: asset.height,
        })
      }
    } catch (err: any) {
      setError('Erreur lors de la sélection de l\'image')
      console.error('Error picking image from gallery:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const pickFromCamera = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const hasPermission = await requestPermissions('camera')
      if (!hasPermission) return

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0]
        const filename = `photo_${Date.now()}.jpg`

        setImage({
          uri: asset.uri,
          type: 'image/jpeg',
          name: filename,
          width: asset.width,
          height: asset.height,
        })
      }
    } catch (err: any) {
      setError('Erreur lors de la prise de photo')
      console.error('Error picking image from camera:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setImage(null)
    setError(null)
  }, [])

  return {
    image,
    loading,
    error,
    pickFromGallery,
    pickFromCamera,
    reset,
  }
}
