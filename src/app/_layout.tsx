import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppStateProvider, useSavedTrails } from '@/state/AppStateProvider';
import { colors } from '@/theme/tokens';

function HydrationGate({ children }: { children: React.ReactNode }) {
  const { isHydrated } = useSavedTrails();
  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="dark" />
        <HydrationGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="trail/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen
              name="about"
              options={{ presentation: 'modal', headerShown: true, title: 'About TrailMate' }}
            />
            <Stack.Screen
              name="notifications"
              options={{ headerShown: true, title: 'Notifications' }}
            />
            <Stack.Screen name="units" options={{ headerShown: true, title: 'Units' }} />
          </Stack>
        </HydrationGate>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
