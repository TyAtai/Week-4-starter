import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchSize, radii, spacing, typography } from '@/theme/tokens';

interface HikedButtonProps {
  trailName: string;
  hiked: boolean;
  onToggle: () => void;
}

export function HikedButton({ trailName, hiked, onToggle }: HikedButtonProps) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ selected: hiked }}
      accessibilityLabel={hiked ? `Mark ${trailName} as not hiked` : `Mark ${trailName} as hiked`}
      accessibilityHint={hiked ? 'Currently marked as hiked' : 'Not yet marked as hiked'}
      style={({ pressed }) => [styles.button, hiked && styles.buttonHiked, pressed && styles.pressed]}
    >
      <Ionicons
        name={hiked ? 'checkmark-circle' : 'checkmark-circle-outline'}
        size={20}
        color={hiked ? colors.primary : colors.textSecondary}
        style={styles.icon}
      />
      <Text style={[styles.label, hiked && styles.labelHiked]}>
        {hiked ? 'Mark as Not Hiked' : 'Mark as Hiked'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: minTouchSize,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  buttonHiked: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    marginRight: spacing.sm,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
  },
  labelHiked: {
    color: colors.primaryDark,
  },
});
