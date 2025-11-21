/**
 * Utility functions
 */

import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'

/**
 * Format date to relative time (e.g., "il y a 2h")
 */
export const formatRelativeDate = (date: string | Date): string => {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: fr,
    })
  } catch {
    return 'date inconnue'
  }
}

/**
 * Format date to full date string
 */
export const formatFullDate = (date: string | Date): string => {
  try {
    return format(new Date(date), 'dd MMMM yyyy HH:mm', { locale: fr })
  } catch {
    return ''
  }
}

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Delay function for async operations
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Extract file extension
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * Check if file is image
 */
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const ext = getFileExtension(filename).toLowerCase()
  return imageExtensions.includes(ext)
}

/**
 * Compress image before upload (basic version)
 * In production, you might want to use expo-image-manipulator
 */
export const getImageMetadata = (uri: string): { uri: string; type: string; name: string } => {
  const filename = uri.split('/').pop() || 'image.jpg'
  return {
    uri,
    type: 'image/jpeg',
    name: filename,
  }
}
