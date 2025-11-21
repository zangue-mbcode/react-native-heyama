/**
 * Object details screen
 */

import React, { useState, useEffect } from 'react'
import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

import { useObjects } from '@/hooks/useObjects'
import { HeyamaObject } from '@/types'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants'
import { formatFullDate } from '@/lib/utils'

export default function ObjectDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { getObjectById, deleteObject } = useObjects()

  const [object, setObject] = useState<HeyamaObject | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch object details
  useEffect(() => {
    const fetchObject = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        const data = await getObjectById(id)
        setObject(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Impossible de charger l\'objet')
        console.error('Error fetching object:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchObject()
  }, [id, getObjectById])

  const handleDelete = () => {
    if (!id) return

    Alert.alert(
      'Supprimer cet objet?',
      'Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true)
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              )
              await deleteObject(id)
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              )
              router.back()
            } catch (err: any) {
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error
              )
              Alert.alert('Erreur', 'Impossible de supprimer l\'objet')
              console.error('Error deleting object:', err)
            } finally {
              setDeleting(false)
            }
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          <LoadingSkeleton width="100%" height={250} variant="card" />
          <View style={styles.skeletonLoadingContent}>
            <LoadingSkeleton width="80%" height={24} />
            <LoadingSkeleton width="100%" height={16} style={{ marginTop: Spacing.md }} />
            <LoadingSkeleton width="100%" height={16} style={{ marginTop: Spacing.sm }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  if (error || !object) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content} contentContainerStyle={styles.errorContent}>
          <EmptyState
            icon="alert-circle-outline"
            title="Objet introuvable"
            description={error || 'L\'objet que vous cherchez n\'existe pas ou a été supprimé'}
            actionButton={
              <Button
                title="Retour"
                onPress={() => router.back()}
                variant="primary"
              />
            }
          />
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <Image
          source={{ uri: object.imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Title and metadata */}
        <View style={styles.metadataSection}>
          <Text style={styles.title}>{object.title}</Text>

          <View style={styles.badgeContainer}>
            <Badge
              label={formatFullDate(object.createdAt)}
              variant="secondary"
              size="small"
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.description}>{object.description}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Colors.text.secondary}
              style={styles.infoIcon}
            />
            <View>
              <Text style={styles.infoLabel}>Créé</Text>
              <Text style={styles.infoValue}>
                {formatFullDate(object.createdAt)}
              </Text>
            </View>
          </View>

          {object.updatedAt !== object.createdAt && (
            <View style={styles.infoItem}>
              <Ionicons
                name="pencil-outline"
                size={20}
                color={Colors.text.secondary}
                style={styles.infoIcon}
              />
              <View>
                <Text style={styles.infoLabel}>Modifié</Text>
                <Text style={styles.infoValue}>
                  {formatFullDate(object.updatedAt)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Delete button */}
        <Button
          title={deleting ? 'Suppression...' : 'Supprimer'}
          onPress={handleDelete}
          variant="danger"
          size="large"
          loading={deleting}
          disabled={deleting}
          fullWidth
          hapticFeedback={false}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: Spacing.lg,
  },

  errorContent: {
    flexGrow: 1,
  },

  skeletonLoadingContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },

  heroImage: {
    width: '100%',
    height: 280,
    backgroundColor: Colors.border.light,
  },

  metadataSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },

  title: {
    ...Typography.title1,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },

  badgeContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  descriptionSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  sectionTitle: {
    ...Typography.title3,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },

  description: {
    ...Typography.body,
    color: Colors.text.secondary,
    lineHeight: 24,
  },

  infoSection: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },

  infoItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },

  infoIcon: {
    marginRight: Spacing.md,
    marginTop: 2,
  },

  infoLabel: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginBottom: 2,
  },

  infoValue: {
    ...Typography.body,
    color: Colors.text.primary,
  },

  spacer: {
    flexGrow: 1,
  },
})
