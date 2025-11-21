/**
 * Home screen - Object list
 */

import React, { useState, useCallback } from 'react'
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Text } from 'react-native'

import { useObjects } from '@/hooks/useObjects'
import { ObjectCard } from '@/components/ObjectCard'
import { CreateObjectModal } from '@/components/CreateObjectModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonCard } from '@/components/ui/LoadingSkeleton'
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants'

export default function HomeScreen() {
  const router = useRouter()
  const { objects, loading, refresh } = useObjects()
  const [modalVisible, setModalVisible] = useState(false)

  const handleCreatePress = useCallback(async () => {
    await Haptics.selectionAsync()
    setModalVisible(true)
  }, [])

  const handleObjectPress = useCallback(
    (id: string) => {
      router.push(`/objects/${id}`)
    },
    [router]
  )

  const handleRefresh = useCallback(async () => {
    try {
      await Haptics.selectionAsync()
      await refresh()
    } catch (error) {
      console.error('Error refreshing:', error)
    }
  }, [refresh])

  const renderEmpty = () => (
    <EmptyState
      icon="cube-outline"
      title="Aucun objet"
      description="Créez votre premier objet pour commencer"
      actionButton={
        <TouchableOpacity
          onPress={handleCreatePress}
          style={styles.emptyAction}
        >
          <Ionicons
            name="add-circle"
            size={32}
            color={Colors.primary}
          />
          <Text style={styles.emptyActionText}>Créer un objet</Text>
        </TouchableOpacity>
      }
    />
  )

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>Heyama</Text>
          <Text style={styles.subtitle}>Gestion d'objets</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="add-circle"
            size={32}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading && objects.length === 0 ? (
        <SkeletonCard count={3} />
      ) : (
        <FlatList
          data={objects}
          renderItem={({ item }) => (
            <ObjectCard object={item} onPress={handleObjectPress} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={!loading ? renderEmpty() : null}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Modal */}
      <CreateObjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },

  appTitle: {
    ...Typography.title1,
    color: Colors.text.primary,
  },

  subtitle: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },

  createButton: {
    padding: Spacing.sm,
  },

  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },

  emptyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },

  emptyActionText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
})
