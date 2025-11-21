import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Colors } from '@/lib/constants'

export const unstable_settings = {
  anchor: 'index',
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="objects/[id]"
          options={{
            presentation: 'card',
          }}
        />
      </Stack>
      <StatusBar style="auto" backgroundColor={Colors.surface} />
    </SafeAreaProvider>
  )
}
