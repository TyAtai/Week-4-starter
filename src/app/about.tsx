import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { colors, radii, spacing, typography } from '@/theme/tokens';

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconWrap}>
        <Ionicons name="trail-sign" size={36} color={colors.primary} />
      </View>
      <Text style={styles.appName}>TrailMate</Text>
      <Text style={styles.version}>Version {version}</Text>
      <Text style={styles.paragraph}>
        TrailMate helps you discover nearby hiking trails, review trail details, and save trails
        to visit later.
      </Text>
      <Text style={styles.paragraph}>
        This is a first-version prototype: trail data is local fixture data, and no account,
        backend, or paid service is required.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  appName: {
    ...typography.title,
    color: colors.textPrimary,
  },
  version: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  paragraph: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
});
