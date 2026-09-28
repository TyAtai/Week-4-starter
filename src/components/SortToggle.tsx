import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchSize, radii, spacing, typography } from '@/theme/tokens';

interface SortToggleProps {
  active: boolean;
  enabled: boolean;
  onToggle: () => void;
}

/** The "Distance: Nearest" sort control. Disabled (with an explanation) until a location is available. */
export function SortToggle({ active, enabled, onToggle }: SortToggleProps) {
  return (
    <View>
      <Pressable
        onPress={onToggle}
        disabled={!enabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: active, disabled: !enabled }}
        accessibilityLabel="Sort by distance, nearest first"
        accessibilityHint={enabled ? undefined : 'Requires your location'}
        style={({ pressed }) => [
          styles.chip,
          active && enabled && styles.chipActive,
          !enabled && styles.chipDisabled,
          pressed && enabled && styles.pressed,
        ]}
      >
        <Ionicons
          name="swap-vertical"
          size={14}
          color={active && enabled ? colors.textInverse : colors.textSecondary}
          style={styles.icon}
        />
        <Text style={[styles.label, active && enabled && styles.labelActive]}>Distance: Nearest</Text>
      </Pressable>
      {!enabled && <Text style={styles.hint}>Use your location to sort by distance.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    minHeight: minTouchSize - 8,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    ...typography.bodyStrong,
    fontSize: 13,
    color: colors.textPrimary,
  },
  labelActive: {
    color: colors.textInverse,
  },
  hint: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
