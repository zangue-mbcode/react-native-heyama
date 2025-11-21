/**
 * Loading skeleton component for placeholder animations
 */

import React, { useEffect, useRef } from 'react'
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { Colors, Spacing, BorderRadius } from '@/lib/constants'

interface LoadingSkeletonProps {
  width?: number | string
  height?: number
  borderRadius?: number
  style?: ViewStyle
  variant?: 'card' | 'text' | 'circle'
}

export const LoadingSkeleton = React.memo(function LoadingSkeleton({
  width = '100%',
  height = 20,
  borderRadius: radius = BorderRadius.md,
  style,
  variant = 'text',
}: LoadingSkeletonProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      })
    ).start()
  }, [shimmerAnim])

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.5, 0.3],
  })

  const skeletonHeight =
    variant === 'card' ? 200 : variant === 'circle' ? 60 : height

  const skeletonWidth = variant === 'circle' ? 60 : width

  const skeletonRadius = variant === 'circle' ? 30 : radius

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          opacity,
          width: typeof skeletonWidth === 'number' ? skeletonWidth : '100%',
          height: skeletonHeight,
          borderRadius: skeletonRadius,
        },
        style,
      ] as any}
    />
  )
})

interface SkeletonCardProps {
  count?: number
}

export const SkeletonCard = React.memo(function SkeletonCard({
  count = 3,
}: SkeletonCardProps) {
  return (
    <View style={styles.cardContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.card}>
          <LoadingSkeleton
            width="100%"
            height={200}
            variant="card"
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <LoadingSkeleton width="80%" height={20} />
            <LoadingSkeleton width="100%" height={16} style={{ marginTop: Spacing.sm }} />
            <LoadingSkeleton width="60%" height={14} style={{ marginTop: Spacing.sm }} />
          </View>
        </View>
      ))}
    </View>
  )
})

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.border.light,
  },

  cardContainer: {
    paddingTop: Spacing.md,
  },

  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },

  cardImage: {
    width: '100%',
    height: 200,
  },

  cardContent: {
    padding: Spacing.lg,
  },
})
