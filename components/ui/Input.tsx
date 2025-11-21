/**
 * Text input component
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

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
  helperText?: string
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, helperText, ...props }, ref) => {
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
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error && styles.inputError,
          ]}
          placeholderTextColor={Colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {error && (
          <Text style={styles.error}>{error}</Text>
        )}
        {helperText && !error && (
          <Text style={styles.helper}>{helperText}</Text>
        )}
      </View>
    )
  }
)

Input.displayName = 'Input'

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

  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.text.primary,
    backgroundColor: Colors.surface,
  },

  inputFocused: {
    borderColor: Colors.primary,
  },

  inputError: {
    borderColor: Colors.danger,
  },

  error: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },

  helper: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
})
