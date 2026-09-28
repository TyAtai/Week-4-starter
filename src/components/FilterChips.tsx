import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, minTouchSize, radii, spacing, typography } from '@/theme/tokens';
import type { DifficultyFilter } from '@/types/trail';

const FILTERS: DifficultyFilter[] = ['All', 'Easy', 'Moderate', 'Hard'];

interface FilterChipsProps {
  value: DifficultyFilter;
  onChange: (filter: DifficultyFilter) => void;
}

export function FilterChips({ value, onChange }: FilterChipsProps) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {FILTERS.map((filter) => {
        const selected = filter === value;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`Filter by ${filter}`}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{filter}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    minHeight: minTouchSize - 8,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.textInverse,
  },
});
