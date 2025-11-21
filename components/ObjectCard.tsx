/**
 * Object card component for displaying objects in the list
 */

import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { HeyamaObject } from '@/types'
import { Card } from './ui/Card'
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants'
import { formatRelativeDate } from '@/lib/utils'

interface ObjectCardProps {
  object: HeyamaObject
  onPress: (id: string) => void
}

export const ObjectCard = React.memo(function ObjectCard({
  object,
  onPress,
}: ObjectCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(object.id)}
      activeOpacity={0.7}
    >
      <Card variant="default">
        <View style={styles.content}>
          {/* Image */}
          <Image
            source={{ uri: object.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Text content */}
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>
              {object.title}
            </Text>

            <Text style={styles.description} numberOfLines={2}>
              {object.description}
            </Text>

            <Text style={styles.date}>
              {formatRelativeDate(object.createdAt)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  content: {
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.border.light,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },

  textContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },

  title: {
    ...Typography.title3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },

  description: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },

  date: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
})
