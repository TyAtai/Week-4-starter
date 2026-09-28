import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, minTouchSize } from '@/theme/tokens';

interface StarButtonProps {
  trailName: string;
  saved: boolean;
  onToggle: () => void;
  size?: number;
  variant?: 'plain' | 'card';
}

export function StarButton({ trailName, saved, onToggle, size = 26, variant = 'plain' }: StarButtonProps) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={saved ? `Remove ${trailName} from saved trails` : `Save ${trailName}`}
      accessibilityState={{ selected: saved }}
      style={({ pressed }) => [
        styles.hitArea,
        variant === 'card' && styles.cardVariant,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={saved ? 'star' : 'star-outline'}
        size={size}
        color={saved ? colors.accentGold : colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    minWidth: minTouchSize,
    minHeight: minTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardVariant: {
    backgroundColor: colors.surface,
    borderRadius: minTouchSize / 2,
  },
  pressed: {
    opacity: 0.6,
  },
});
