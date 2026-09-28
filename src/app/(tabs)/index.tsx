import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FilterChips } from '@/components/FilterChips';
import { SearchBar } from '@/components/SearchBar';
import { TrailCard } from '@/components/TrailCard';
import { EmptyState } from '@/components/EmptyState';
import { trails } from '@/data/trails';
import { useSavedTrails, usePreferences } from '@/state/AppStateProvider';
import { filterTrails } from '@/utils/search';
import { colors, spacing, typography } from '@/theme/tokens';
import type { DifficultyFilter, Trail } from '@/types/trail';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
  const { isSaved, toggleSaved } = useSavedTrails();
  const { preferences } = usePreferences();

  const filteredTrails = useMemo(
    () => filterTrails(trails, query, difficultyFilter),
    [query, difficultyFilter]
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
        <Text style={styles.title}>TrailMate</Text>
        <View style={styles.searchWrap}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
        <FilterChips value={difficultyFilter} onChange={setDifficultyFilter} />
      </View>
      <FlatList
        data={filteredTrails}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            icon="search"
            title="No trails found"
            message={
              query.trim().length > 0
                ? `No trails match "${query.trim()}". Try a different search or filter.`
                : 'No trails match this filter. Try a different difficulty.'
            }
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
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  searchWrap: {
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
});
