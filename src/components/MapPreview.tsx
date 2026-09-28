import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, radii } from '@/theme/tokens';
import { generateRoutePath } from '@/utils/mapRoute';

interface MapPreviewProps {
  seed: string;
  trailName: string;
  height?: number;
}

/**
 * A locally-rendered, offline map-style placeholder (no map tiles or network
 * request): a stylized terrain background with a deterministic route line
 * and trailhead marker generated from the trail's id.
 */
export function MapPreview({ seed, trailName, height = 170 }: MapPreviewProps) {
  const route = generateRoutePath(seed, 340, height);

  return (
    <View
      style={[styles.container, { height }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Map preview illustrating the route for ${trailName}`}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${route.width} ${route.height}`}>
        <Rect x={0} y={0} width={route.width} height={route.height} fill={colors.mapLand} />
        <Path
          d={`M0 ${route.height * 0.15} Q ${route.width * 0.3} ${route.height * 0.4} ${route.width * 0.55} ${route.height * 0.1} T ${route.width} ${route.height * 0.3} V0 H0 Z`}
          fill={colors.mapForest}
          opacity={0.7}
        />
        <Path
          d={`M0 ${route.height} Q ${route.width * 0.4} ${route.height * 0.65} ${route.width * 0.7} ${route.height * 0.85} T ${route.width} ${route.height * 0.7} V ${route.height} H0 Z`}
          fill={colors.mapForest}
          opacity={0.45}
        />
        <Path d={route.d} stroke={colors.mapRoute} strokeWidth={4} fill="none" strokeLinecap="round" />
        <Circle cx={route.markerX} cy={route.markerY} r={7} fill={colors.mapMarker} stroke="#FFFFFF" strokeWidth={2} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.mapLand,
  },
});
