import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchSize, spacing, typography } from '@/theme/tokens';

interface SettingsRowProps {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  value?: string;
}

export function SettingsRow({ label, onPress, destructive, value }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text style={[styles.label, destructive && styles.destructiveLabel]}>{label}</Text>
      <View style={styles.right}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        {!destructive && <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: minTouchSize,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 16,
  },
  destructiveLabel: {
    color: colors.danger,
    fontWeight: '600',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
