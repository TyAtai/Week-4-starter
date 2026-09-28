import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '@/theme/tokens';

/** Small, unobtrusive "Hiked" indicator for trail cards — icon + text, never color alone. */
export function HikedBadge() {
  return (
    <View style={styles.row} accessible={false} importantForAccessibility="no-hide-descendants">
      <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
      <Text style={styles.label}>Hiked</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  label: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '700',
  },
});
