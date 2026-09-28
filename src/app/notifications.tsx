import { StyleSheet, Switch, Text, View } from 'react-native';
import { usePreferences } from '@/state/AppStateProvider';
import { colors, spacing, typography } from '@/theme/tokens';

export default function NotificationsScreen() {
  const { preferences, setNotificationsEnabled } = usePreferences();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.textWrap}>
          <Text style={styles.label}>Trail reminders</Text>
          <Text style={styles.description}>
            Get notified about saved trails and seasonal trail conditions.
          </Text>
        </View>
        <Switch
          value={preferences.notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          accessibilityRole="switch"
          accessibilityLabel="Trail reminder notifications"
          accessibilityState={{ checked: preferences.notificationsEnabled }}
          trackColor={{ true: colors.primary, false: colors.border }}
        />
      </View>
      <Text style={styles.footnote}>
        This is a local preference for this prototype — no push notification service is
        connected.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    gap: spacing.md,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footnote: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
});
