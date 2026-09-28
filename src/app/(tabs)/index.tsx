import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FilterChips } from '@/components/FilterChips';
import { SearchBar } from '@/components/SearchBar';
import { TrailCard } from '@/components/TrailCard';
import { EmptyState } from '@/components/EmptyState';
import { LocationBar } from '@/components/LocationBar';
import { SortToggle } from '@/components/SortToggle';
import { trails } from '@/data/trails';
import { useHikedTrails, useSavedTrails, usePreferences } from '@/state/AppStateProvider';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { filterTrails } from '@/utils/search';
import { sortTrails, type SortOption } from '@/utils/sortTrails';
import { haversineDistanceMiles } from '@/utils/geo';
import { colors, spacing, typography } from '@/theme/tokens';
import type { DifficultyFilter, Trail } from '@/types/trail';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const { isSaved, toggleSaved } = useSavedTrails();
  const { isHiked } = useHikedTrails();
  const { preferences } = usePreferences();
  const { state: locationState, requestLocation, clearLocation } = useCurrentLocation();

  const hasLocation = locationState.phase === 'granted';

  // Nearest-distance sorting only makes sense while a location is active.
  // Rather than syncing `sortOption` back to 'default' via an effect when
  // location is lost, derive the *effective* sort option straight from
  // render — it stays a pure function of current props/state, and the
  // user's last choice is preserved (auto-reapplies if location returns).
  const effectiveSortOption: SortOption = hasLocation ? sortOption : 'default';

  const distanceMilesByTrailId = useMemo(() => {
    if (locationState.phase !== 'granted') return null;
    const map = new Map<string, number>();
    for (const trail of trails) {
      map.set(trail.id, haversineDistanceMiles(locationState.coordinates, trail.location.coordinates));
    }
    return map;
  }, [locationState]);

  const visibleTrails = useMemo(() => {
    const filtered = filterTrails(trails, query, difficultyFilter);
    return sortTrails(filtered, effectiveSortOption, distanceMilesByTrailId);
  }, [query, difficultyFilter, effectiveSortOption, distanceMilesByTrailId]);

  const toggleSort = useCallback(() => {
    setSortOption((previous) => (previous === 'distanceNearest' ? 'default' : 'distanceNearest'));
  }, []);

  const renderItem = ({ item }: { item: Trail }) => (
    <TrailCard
      trail={item}
      saved={isSaved(item.id)}
      hiked={isHiked(item.id)}
      units={preferences.units}
      distanceFromUserMiles={distanceMilesByTrailId?.get(item.id)}
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
        <LocationBar state={locationState} onRequest={requestLocation} onClear={clearLocation} />
        <SortToggle
          active={effectiveSortOption === 'distanceNearest'}
          enabled={hasLocation}
          onToggle={toggleSort}
        />
      </View>
      <FlatList
        data={visibleTrails}
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
