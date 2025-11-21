/**
 * Create object modal component with form validation
 */

import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { TextArea } from './ui/TextArea'
import { ImagePickerField } from './ImagePickerField'
import { CreateObjectPayload } from '@/types'
import { useObjects } from '@/hooks/useObjects'
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants'

interface CreateObjectModalProps {
  visible: boolean
  onClose: () => void
}

// Validation schema
const createObjectSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  image: z.object({
    uri: z.string(),
    type: z.string(),
    name: z.string(),
  }).nullable().optional() as any,
})

type CreateObjectFormData = {
  title: string
  description: string
  image?: {
    uri: string
    type: string
    name: string
  } | null
}

export const CreateObjectModal = React.memo(function CreateObjectModal({
  visible,
  onClose,
}: CreateObjectModalProps) {
  const { createObject } = useObjects()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateObjectFormData>({
    resolver: zodResolver(createObjectSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      image: null,
    },
  })

  const onSubmit = useCallback(
    async (data: CreateObjectFormData) => {
      try {
        setIsSubmitting(true)
        await Haptics.selectionAsync()

        const payload: CreateObjectPayload = {
          title: data.title,
          description: data.description,
          image: data.image || undefined,
        }

        await createObject(payload)

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

        // Reset form and close modal
        reset()
        onClose()

        // Show success message
        Alert.alert('Succès', 'Objet créé avec succès')
      } catch (error: any) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        Alert.alert(
          'Erreur',
          error?.response?.data?.message || 'Erreur lors de la création'
        )
      } finally {
        setIsSubmitting(false)
      }
    },
    [createObject, reset, onClose]
  )

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Annuler</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Nouvel Objet</Text>

          <Button
            title="Créer"
            onPress={handleSubmit(onSubmit)}
            variant={isValid && !isSubmitting ? 'primary' : 'primary'}
            size="small"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            hapticFeedback={false}
          />
        </View>

        {/* Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Title field */}
            <Controller
              control={control}
              name="title"
              render={({ field: { value, onChange } }) => (
                <Input
                  label="Titre"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Nom de l'objet"
                  error={errors.title?.message}
                  editable={!isSubmitting}
                />
              )}
            />

            {/* Description field */}
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange } }) => (
                <TextArea
                  label="Description"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Décrivez votre objet..."
                  minHeight={120}
                  error={errors.description?.message}
                  editable={!isSubmitting}
                />
              )}
            />

            {/* Image field */}
            <Controller
              control={control}
              name="image"
              render={({ field: { value, onChange } }) => (
                <ImagePickerField
                  value={value || null}
                  onChange={(img) => onChange(img)}
                  label="Image"
                  error={errors.image?.message}
                />
              )}
            />

            {/* Submit button (bottom) */}
            <Button
              title={isSubmitting ? 'Création en cours...' : 'Créer'}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="large"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
              fullWidth
              style={styles.submitButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.surface,
  },

  cancelButton: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600' as const,
  },

  headerTitle: {
    ...Typography.title3,
    color: Colors.text.primary,
  },

  keyboardAvoid: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },

  submitButton: {
    marginTop: Spacing.lg,
  },
})
