import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { StarButton } from '@/components/StarButton';
import { StatRow } from '@/components/StatRow';
import { MapPreview } from '@/components/MapPreview';
import { EmptyState } from '@/components/EmptyState';
import { getTrailById } from '@/data/trails';
import { useSavedTrails, usePreferences } from '@/state/AppStateProvider';
import { formatDistance, formatDuration, formatElevation } from '@/utils/units';
import { openTrailheadDirections } from '@/utils/maps';
import { colors, minTouchSize, radii, spacing, typography } from '@/theme/tokens';

const IMAGE_HEIGHT = 280;

export default function TrailDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trail = getTrailById(id ?? '');
  const { isSaved, toggleSaved } = useSavedTrails();
  const { preferences } = usePreferences();
  const [isNavigating, setIsNavigating] = useState(false);

  if (!trail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState
          icon="alert-circle-outline"
          title="Trail not found"
          message="This trail may have been removed from the fixture data."
          actionLabel="Back to Explore"
          onAction={() => router.replace('/')}
        />
      </SafeAreaView>
    );
  }

  const saved = isSaved(trail.id);

  const handleStartNavigation = async () => {
    setIsNavigating(true);
    const result = await openTrailheadDirections(
      trail.location.coordinates,
      trail.location.trailheadName
    );
    setIsNavigating(false);
    if (result !== 'opened') {
      Alert.alert(
        'Unable to open maps',
        'We could not open a maps app on this device. Try again once a maps app such as Apple Maps, Google Maps, or a browser is available.'
      );
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image
            source={trail.image}
            style={styles.image}
            accessible
            accessibilityLabel={`Photo of ${trail.name}`}
          />
          <SafeAreaView edges={['top']} style={styles.imageOverlayRow}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
              style={styles.circleButton}
            >
              <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            </Pressable>
            <View style={styles.circleButton}>
              <StarButton trailName={trail.name} saved={saved} onToggle={() => toggleSaved(trail.id)} />
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{trail.name}</Text>
            <DifficultyBadge difficulty={trail.difficulty} />
          </View>

          <StatRow
            stats={[
              { icon: 'location', value: formatDistance(trail.distanceMiles, preferences.units), label: 'Distance' },
              {
                icon: 'triangle',
                value: formatElevation(trail.elevationGainFeet, preferences.units),
                label: 'Elevation',
              },
              { icon: 'time', value: formatDuration(trail.estimatedTimeMinutes), label: 'Time' },
            ]}
          />

          <Text style={styles.sectionTitle}>Description</Text>
          {trail.description.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Trailhead Map</Text>
          <MapPreview seed={trail.routeSeed} trailName={trail.name} />
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Pressable
          onPress={handleStartNavigation}
          disabled={isNavigating}
          accessibilityRole="button"
          accessibilityLabel={`Start navigation to ${trail.location.trailheadName}`}
          accessibilityHint="Opens your maps app with directions to the trailhead, not turn-by-turn trail navigation"
          style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
        >
          <Ionicons name="navigate" size={18} color={colors.textInverse} style={{ marginRight: 8 }} />
          <Text style={styles.navButtonLabel}>
            {isNavigating ? 'Opening maps…' : 'Start Navigation'}
          </Text>
        </Pressable>
        <Text style={styles.navHint}>Opens directions to the trailhead, not turn-by-turn trail routing.</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  imageWrap: {
    height: IMAGE_HEIGHT,
    backgroundColor: colors.surfaceAlt,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlayRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  circleButton: {
    width: minTouchSize,
    height: minTouchSize,
    borderRadius: minTouchSize / 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  name: {
    ...typography.heading,
    fontSize: 22,
    color: colors.textPrimary,
    flex: 1,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  paragraph: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flexDirection: 'row',
    minHeight: minTouchSize + 6,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonPressed: {
    opacity: 0.9,
  },
  navButtonLabel: {
    ...typography.bodyStrong,
    color: colors.textInverse,
    fontSize: 16,
  },
  navHint: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
});
