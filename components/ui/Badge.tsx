/**
 * Badge component
 */

import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants'

interface BadgeProps {
  label: string
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'small' | 'medium'
  style?: ViewStyle
}

export const Badge = React.memo(function Badge({
  label,
  variant = 'primary',
  size = 'medium',
  style,
}: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`textVariant_${variant}`],
          styles[`textSize_${size}`],
        ]}
      >
        {label}
      </Text>
    </View>
  )
})

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sizes
  size_small: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  size_medium: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  // Variants
  variant_primary: {
    backgroundColor: Colors.primary,
  },
  variant_secondary: {
    backgroundColor: Colors.secondary,
  },
  variant_danger: {
    backgroundColor: Colors.danger,
  },
  variant_success: {
    backgroundColor: Colors.success,
  },
  variant_warning: {
    backgroundColor: Colors.warning,
  },

  // Text
  text: {
    fontWeight: '600' as const,
    color: Colors.text.inverse,
  },

  textVariant_primary: {
    color: Colors.text.inverse,
  },
  textVariant_secondary: {
    color: Colors.text.inverse,
  },
  textVariant_danger: {
    color: Colors.text.inverse,
  },
  textVariant_success: {
    color: Colors.text.inverse,
  },
  textVariant_warning: {
    color: Colors.text.inverse,
  },

  // Text sizes
  textSize_small: {
    fontSize: 11,
  },
  textSize_medium: {
    fontSize: 13,
  },
})
