import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePreferences } from '@/state/AppStateProvider';
import { colors, minTouchSize, radii, spacing, typography } from '@/theme/tokens';
import type { Units } from '@/types/preferences';

const OPTIONS: { value: Units; label: string; hint: string }[] = [
  { value: 'imperial', label: 'Imperial', hint: 'Miles, feet' },
  { value: 'metric', label: 'Metric', hint: 'Kilometers, meters' },
];

export default function UnitsScreen() {
  const { preferences, setUnits } = usePreferences();

  return (
    <View style={styles.container}>
      {OPTIONS.map((option) => {
        const selected = preferences.units === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => setUnits(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={`${option.label}, ${option.hint}`}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View>
              <Text style={styles.label}>{option.label}</Text>
              <Text style={styles.hint}>{option.hint}</Text>
            </View>
            {selected && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
          </Pressable>
        );
      })}
      <Text style={styles.footnote}>
        Distances and elevation throughout TrailMate update immediately when you change this
        setting.
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
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    minHeight: minTouchSize,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footnote: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
});
