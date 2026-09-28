import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SettingsRow } from '@/components/SettingsRow';
import { EmptyState } from '@/components/EmptyState';
import { profile, profileAvatar } from '@/data/profile';
import { useHikedTrails, usePreferences, useSession } from '@/state/AppStateProvider';
import { countHikedTrails } from '@/utils/hiked';
import { colors, radii, spacing, typography } from '@/theme/tokens';

export default function ProfileScreen() {
  const { preferences } = usePreferences();
  const { isLoggedIn, logOut, logIn } = useSession();
  const { hikedIds } = useHikedTrails();
  const trailsHiked = countHikedTrails(hikedIds);

  const handleLogOut = () => {
    Alert.alert(
      'Log out?',
      'This resets your local session. Your saved trails will stay on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logOut },
      ]
    );
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <EmptyState
          icon="log-out-outline"
          title="You're logged out"
          message="This is a local-only session reset for this prototype. Log back in to view your profile."
          actionLabel="Log back in"
          onAction={logIn}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={profileAvatar}
            style={styles.avatar}
            accessible
            accessibilityLabel={`${profile.name}'s profile photo`}
          />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.subtitle}>
            {trailsHiked} {trailsHiked === 1 ? 'trail' : 'trails'} hiked
          </Text>
        </View>

        <View style={styles.section}>
          <SettingsRow
            label="Notifications"
            value={preferences.notificationsEnabled ? 'On' : 'Off'}
            onPress={() => router.push('/notifications')}
          />
          <SettingsRow
            label="Units"
            value={preferences.units === 'imperial' ? 'Imperial' : 'Metric'}
            onPress={() => router.push('/units')}
          />
          <SettingsRow label="About" onPress={() => router.push('/about')} />
        </View>

        <View style={styles.section}>
          <SettingsRow label="Log Out" destructive onPress={handleLogOut} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    marginBottom: spacing.md,
  },
  name: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.xl,
  },
});
