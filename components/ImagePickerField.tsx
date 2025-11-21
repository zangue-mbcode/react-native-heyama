/**
 * Image picker field component for form usage
 */

import React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActionSheetIOS,
  Platform,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants'
import { useImagePicker } from '@/hooks/useImagePicker'

interface ImagePickerFieldProps {
  value: { uri: string; type: string; name: string } | null
  onChange: (image: { uri: string; type: string; name: string } | null) => void
  error?: string
  label?: string
}

export const ImagePickerField = React.memo(function ImagePickerField({
  value,
  onChange,
  error,
  label = 'Image',
}: ImagePickerFieldProps) {
  const { image, loading, pickFromGallery, pickFromCamera, reset } =
    useImagePicker()

  React.useEffect(() => {
    if (image) {
      onChange(image)
    }
  }, [image])

  const handleShowOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', 'Prendre une photo', 'Choisir dans la galerie'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: undefined,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickFromCamera()
          } else if (buttonIndex === 2) {
            pickFromGallery()
          }
        }
      )
    } else {
      Alert.alert('Sélectionner une image', undefined, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Prendre une photo', onPress: pickFromCamera },
        { text: 'Choisir dans la galerie', onPress: pickFromGallery },
      ])
    }
  }

  const displayImage = value || image

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={handleShowOptions}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Card variant="outlined" padding="md">
          {displayImage ? (
            <View>
              <Image
                source={{ uri: displayImage.uri }}
                style={styles.preview}
                resizeMode="cover"
              />
              <Button
                title="Changer l'image"
                onPress={handleShowOptions}
                variant="secondary"
                size="small"
                style={{ marginTop: Spacing.md }}
                loading={loading}
              />
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons
                name="camera-outline"
                size={40}
                color={Colors.text.tertiary}
                style={styles.placeholderIcon}
              />
              <Text style={styles.placeholderText}>
                Tap pour ajouter une image
              </Text>
              <Text style={styles.placeholderSubtext}>
                16:9 ratio recommandé
              </Text>
            </View>
          )}
        </Card>
      </TouchableOpacity>

      {displayImage && (
        <Button
          title="Supprimer"
          onPress={() => {
            onChange(null)
            reset()
          }}
          variant="danger"
          size="small"
          style={{ marginTop: Spacing.md }}
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },

  label: {
    ...Typography.body,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },

  labelError: {
    color: Colors.danger,
  },

  preview: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.border.light,
  },

  placeholder: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderIcon: {
    marginBottom: Spacing.md,
  },

  placeholderText: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },

  placeholderSubtext: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },

  error: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: Spacing.sm,
  },
})
