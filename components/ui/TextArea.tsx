/**
 * TextArea component for multi-line text input
 */

import React, { useState } from 'react'
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native'
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants'

interface TextAreaProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
  minHeight?: number
  maxHeight?: number
}

export const TextArea = React.forwardRef<TextInput, TextAreaProps>(
  ({ label, error, containerStyle, minHeight = 100, maxHeight = 200, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, error && styles.labelError]}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          multiline
          textAlignVertical="top"
          style={[
            styles.textArea,
            {
              minHeight,
              maxHeight,
            },
            isFocused && styles.textAreaFocused,
            error && styles.textAreaError,
          ]}
          placeholderTextColor={Colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {error && (
          <Text style={styles.error}>{error}</Text>
        )}
      </View>
    )
  }
)

TextArea.displayName = 'TextArea'

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
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

  textArea: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.text.primary,
    backgroundColor: Colors.surface,
  },

  textAreaFocused: {
    borderColor: Colors.primary,
  },

  textAreaError: {
    borderColor: Colors.danger,
  },

  error: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
})
