/**
 * 404 Not found page
 */

import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Colors, Spacing } from '@/lib/constants'

export default function NotFound() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <EmptyState
          icon="alert-circle-outline"
          title="Page non trouvée"
          description="La page que vous cherchez n\'existe pas"
          actionButton={
            <Link href="/" asChild>
              <Button title="Retour à l'accueil" onPress={() => {}} />
            </Link>
          }
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
})
