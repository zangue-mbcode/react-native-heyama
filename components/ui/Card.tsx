/**
 * Card component for displaying content
 */

import React from 'react'
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native'
import { Colors, Spacing, BorderRadius, Shadows } from '@/lib/constants'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  onPress?: (event: GestureResponderEvent) => void
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: keyof typeof Spacing
}

export const Card = React.memo(function Card({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'lg',
}: CardProps) {
  const Component = onPress ? TouchableOpacity : View

  return (
    <Component
      style={[
        styles.card,
        styles[`variant_${variant}`],
        { padding: Spacing[padding] },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </Component>
  )
})

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },

  // Variants
  variant_default: {
    backgroundColor: Colors.surface,
    ...Shadows.small,
  },
  variant_elevated: {
    backgroundColor: Colors.surface,
    ...Shadows.medium,
  },
  variant_outlined: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
})
