/**
 * Empty state component
 */

import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionButton?: React.ReactNode
}

export const EmptyState = React.memo(function EmptyState({
  icon = 'cube-outline',
  title,
  description,
  actionButton,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={icon as any}
        size={64}
        color={Colors.text.tertiary}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      {actionButton && (
        <View style={styles.actionContainer}>
          {actionButton}
        </View>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxxl,
    minHeight: 400,
  },

  icon: {
    marginBottom: Spacing.lg,
    opacity: 0.5,
  },

  title: {
    ...Typography.title2,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },

  description: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  actionContainer: {
    marginTop: Spacing.md,
  },
})
