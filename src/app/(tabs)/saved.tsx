import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { TrailCard } from '@/components/TrailCard';
import { EmptyState } from '@/components/EmptyState';
import { trails } from '@/data/trails';
import { useSavedTrails, usePreferences } from '@/state/AppStateProvider';
import { colors, spacing, typography } from '@/theme/tokens';
import type { Trail } from '@/types/trail';

export default function SavedScreen() {
  const { savedIds, isSaved, toggleSaved } = useSavedTrails();
  const { preferences } = usePreferences();

  const savedTrails = useMemo(
    () => trails.filter((trail) => savedIds.has(trail.id)),
    [savedIds]
  );

  const renderItem = ({ item }: { item: Trail }) => (
    <TrailCard
      trail={item}
      saved={isSaved(item.id)}
      units={preferences.units}
      onPress={() => router.push(`/trail/${item.id}`)}
      onToggleSaved={() => toggleSaved(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
      </View>
      <FlatList
        data={savedTrails}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="star-outline"
            title="No saved trails yet"
            message="Tap the star on any trail card or trail detail page to save it here for quick access."
            actionLabel="Browse trails"
            onAction={() => router.push('/')}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.title,
    fontSize: 24,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
});
