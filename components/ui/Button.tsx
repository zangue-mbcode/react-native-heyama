/**
 * Button component with variants and states
 */

import React, { useMemo } from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants'

interface ButtonProps {
  title: string
  onPress: () => void | Promise<void>
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  style?: ViewStyle
  hapticFeedback?: boolean
}

export const Button = React.memo(function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  hapticFeedback = true,
}: ButtonProps) {
  const isDisabled = disabled || loading

  const handlePress = async () => {
    if (hapticFeedback) {
      try {
        await Haptics.selectionAsync()
      } catch (e) {
        // Haptics not available on web
      }
    }
    onPress()
  }

  const buttonStyle = useMemo(
    () => [
      styles.button,
      styles[`size_${size}`],
      styles[`variant_${variant}`],
      isDisabled && styles.disabled,
      fullWidth && styles.fullWidth,
      style,
    ],
    [variant, size, isDisabled, fullWidth, style]
  )

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={isDisabled ? 1 : 0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'ghost'
              ? Colors.primary
              : Colors.text.inverse
          }
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              styles[`textVariant_${variant}`],
              styles[`textSize_${size}`],
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },

  // Sizes
  size_small: {
    paddingVertical: Spacing.sm,
    minHeight: 36,
  },
  size_medium: {
    paddingVertical: Spacing.md,
    minHeight: 44,
  },
  size_large: {
    paddingVertical: Spacing.lg,
    minHeight: 50,
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
  variant_ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border.medium,
  },

  // Disabled state
  disabled: {
    opacity: 0.5,
  },

  // Full width
  fullWidth: {
    width: '100%',
  },

  // Text
  text: {
    fontWeight: '600' as const,
  },

  // Text variants
  textVariant_primary: {
    color: Colors.text.inverse,
  },
  textVariant_secondary: {
    color: Colors.text.inverse,
  },
  textVariant_danger: {
    color: Colors.text.inverse,
  },
  textVariant_ghost: {
    color: Colors.text.primary,
  },

  // Text sizes
  textSize_small: {
    fontSize: 13,
  },
  textSize_medium: {
    fontSize: 15,
  },
  textSize_large: {
    fontSize: 17,
  },
})
