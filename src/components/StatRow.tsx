import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/theme/tokens';

export interface Stat {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <View style={styles.row}>
      {stats.map((stat, index) => (
        <View
          key={stat.label}
          style={[styles.item, index < stats.length - 1 && styles.divider]}
          accessible
          accessibilityLabel={`${stat.label}: ${stat.value}`}
        >
          <Ionicons name={stat.icon} size={18} color={colors.primary} />
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    paddingVertical: spacing.lg,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  value: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    marginTop: 4,
  },
  label: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
