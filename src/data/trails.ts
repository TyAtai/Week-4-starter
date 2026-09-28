import type { Trail } from '@/types/trail';

/**
 * Local fixture data. IDs are stable strings (not array indices) so saved
 * status survives reordering, filtering, and future fixture edits.
 *
 * Trail photography: royalty-free placeholder photos from Lorem Picsum
 * (https://picsum.photos), downloaded once and bundled locally under
 * `assets/trails/`. See BUILD_LOG.md for details.
 */
export const trails: Trail[] = [
  {
    id: 'cedar-ridge-loop',
    name: 'Cedar Ridge Loop',
    difficulty: 'Easy',
    distanceMiles: 4.2,
    elevationGainFeet: 320,
    estimatedTimeMinutes: 135,
    description: [
      'A gentle loop through second-growth cedar and fir forest, following a well-graded trail with only a handful of short climbs.',
      'Ideal for a relaxed morning hike or a first outing with kids — shaded for most of the route with a creek crossing near the halfway point.',
    ],
    image: require('../../assets/trails/cedar-ridge-loop.jpg'),
    routeSeed: 'cedar-ridge-loop',
    location: {
      trailheadName: 'Cedar Ridge Trailhead',
      coordinates: { latitude: 37.8324, longitude: -122.4924 },
    },
  },
  {
    id: 'willow-creek-path',
    name: 'Willow Creek Path',
    difficulty: 'Moderate',
    distanceMiles: 6.5,
    elevationGainFeet: 950,
    estimatedTimeMinutes: 210,
    description: [
      'Follows Willow Creek upstream through mixed woodland before climbing to an open ridgeline with valley views.',
      'A rocky section near mile four requires careful footing. Bring extra water — there is little shade on the final climb.',
    ],
    image: require('../../assets/trails/willow-creek-path.jpg'),
    routeSeed: 'willow-creek-path',
    location: {
      trailheadName: 'Willow Creek Trailhead',
      coordinates: { latitude: 45.5231, longitude: -122.6765 },
    },
  },
  {
    id: 'sunset-bluff',
    name: 'Sunset Bluff',
    difficulty: 'Easy',
    distanceMiles: 2.1,
    elevationGainFeet: 150,
    estimatedTimeMinutes: 60,
    description: [
      'A short coastal walk to a bluff overlooking the water, popular for golden-hour views and tide pools below.',
      'Mostly flat with one short set of stairs near the overlook. Watch footing on the final stretch during wet weather.',
    ],
    image: require('../../assets/trails/sunset-bluff.jpg'),
    routeSeed: 'sunset-bluff',
    location: {
      trailheadName: 'Sunset Bluff Parking Area',
      coordinates: { latitude: 36.5395, longitude: -121.9233 },
    },
  },
  {
    id: 'iron-gorge-descent',
    name: 'Iron Gorge Descent',
    difficulty: 'Hard',
    distanceMiles: 9.3,
    elevationGainFeet: 2800,
    estimatedTimeMinutes: 360,
    description: [
      'A steep, exposed descent into a narrow gorge followed by a demanding climb back out. Loose rock and scrambling required.',
      'Recommended for experienced hikers only. Start early — the return climb takes longer than most people expect.',
    ],
    image: require('../../assets/trails/iron-gorge-descent.jpg'),
    routeSeed: 'iron-gorge-descent',
    location: {
      trailheadName: 'Iron Gorge Trailhead',
      coordinates: { latitude: 40.2547, longitude: -111.6588 },
    },
  },
  {
    id: 'granite-peak-summit',
    name: 'Granite Peak Summit Trail',
    difficulty: 'Hard',
    distanceMiles: 11.8,
    elevationGainFeet: 3450,
    estimatedTimeMinutes: 420,
    description: [
      'Experience a challenging hike to the summit of Granite Peak. Expect steep inclines and rocky terrain.',
      'Enjoy panoramic views and alpine scenery as you make your way to the top.',
    ],
    image: require('../../assets/trails/granite-peak-summit.jpg'),
    routeSeed: 'granite-peak-summit',
    location: {
      trailheadName: 'Granite Peak Trailhead',
      coordinates: { latitude: 39.1911, longitude: -106.8175 },
    },
  },
  {
    id: 'maple-hollow-trail',
    name: 'Maple Hollow Trail',
    difficulty: 'Easy',
    distanceMiles: 3.0,
    elevationGainFeet: 200,
    estimatedTimeMinutes: 90,
    description: [
      'A shaded loop through a maple hollow, especially popular in autumn when the canopy turns bright red and orange.',
      'Well-maintained wide path suitable for strollers on the first mile; the return loop narrows slightly.',
    ],
    image: require('../../assets/trails/maple-hollow-trail.jpg'),
    routeSeed: 'maple-hollow-trail',
    location: {
      trailheadName: 'Maple Hollow Trailhead',
      coordinates: { latitude: 42.2808, longitude: -83.743 },
    },
  },
  {
    id: 'blue-heron-marsh',
    name: "Blue Heron Marsh Walk",
    difficulty: 'Easy',
    distanceMiles: 2.6,
    elevationGainFeet: 80,
    estimatedTimeMinutes: 70,
    description: [
      'A flat boardwalk and gravel path circling a protected wetland, home to herons, red-winged blackbirds, and turtles.',
      'Great for birdwatching in early morning. Benches and a covered viewing platform are available midway around the loop.',
    ],
    image: require('../../assets/trails/blue-heron-marsh.jpg'),
    routeSeed: 'blue-heron-marsh',
    location: {
      trailheadName: 'Blue Heron Marsh Visitor Center',
      coordinates: { latitude: 41.8781, longitude: -87.7325 },
    },
  },
  {
    id: 'timberline-ridge',
    name: 'Timberline Ridge',
    difficulty: 'Moderate',
    distanceMiles: 7.2,
    elevationGainFeet: 1600,
    estimatedTimeMinutes: 225,
    description: [
      'Climbs steadily through subalpine forest to a ridge that traces the treeline, with wide views on both sides on a clear day.',
      'Afternoon storms build quickly in summer — check conditions and plan to be off the ridge by early afternoon.',
    ],
    image: require('../../assets/trails/timberline-ridge.jpg'),
    routeSeed: 'timberline-ridge',
    location: {
      trailheadName: 'Timberline Ridge Trailhead',
      coordinates: { latitude: 44.2743, longitude: -121.7392 },
    },
  },
  {
    id: 'falcons-rest-overlook',
    name: "Falcon's Rest Overlook",
    difficulty: 'Moderate',
    distanceMiles: 5.4,
    elevationGainFeet: 1150,
    estimatedTimeMinutes: 170,
    description: [
      'A series of switchbacks leads to a rocky overlook favored by nesting falcons in spring — trail may close seasonally.',
      'Footing is uneven near the top. Sturdy shoes recommended; the view is worth the effort on a clear day.',
    ],
    image: require('../../assets/trails/falcons-rest-overlook.jpg'),
    routeSeed: 'falcons-rest-overlook',
    location: {
      trailheadName: "Falcon's Rest Trailhead",
      coordinates: { latitude: 39.7392, longitude: -104.9903 },
    },
  },
  {
    id: 'twin-lakes-loop',
    name: 'Twin Lakes Loop',
    difficulty: 'Moderate',
    distanceMiles: 6.0,
    elevationGainFeet: 900,
    estimatedTimeMinutes: 180,
    description: [
      'Connects two alpine lakes via a rolling forested path, with a short spur to a swimming beach at the second lake.',
      'Mosquitoes can be persistent in early summer near the shoreline — repellent recommended June through July.',
    ],
    image: require('../../assets/trails/twin-lakes-loop.jpg'),
    routeSeed: 'twin-lakes-loop',
    location: {
      trailheadName: 'Twin Lakes Trailhead',
      coordinates: { latitude: 47.6062, longitude: -121.4368 },
    },
  },
  {
    id: 'obsidian-canyon',
    name: 'Obsidian Canyon Trail',
    difficulty: 'Hard',
    distanceMiles: 8.7,
    elevationGainFeet: 2600,
    estimatedTimeMinutes: 330,
    description: [
      'Winds through a volcanic canyon of dark obsidian rock, with sustained climbing and several exposed traverses.',
      'No reliable water sources along the route — carry all the water you will need for the full round trip.',
    ],
    image: require('../../assets/trails/obsidian-canyon.jpg'),
    routeSeed: 'obsidian-canyon',
    location: {
      trailheadName: 'Obsidian Canyon Trailhead',
      coordinates: { latitude: 44.0582, longitude: -121.3153 },
    },
  },
  {
    id: 'eagle-crest-summit',
    name: 'Eagle Crest Summit',
    difficulty: 'Hard',
    distanceMiles: 10.5,
    elevationGainFeet: 3100,
    estimatedTimeMinutes: 390,
    description: [
      'A long, sustained climb to a windswept summit ridge with sweeping 360-degree views on a clear day.',
      'Weather changes fast above treeline. Turn back if visibility drops or thunderstorms are forecast nearby.',
    ],
    image: require('../../assets/trails/eagle-crest-summit.jpg'),
    routeSeed: 'eagle-crest-summit',
    location: {
      trailheadName: 'Eagle Crest Trailhead',
      coordinates: { latitude: 39.6403, longitude: -106.3742 },
    },
  },
];

export function getTrailById(id: string): Trail | undefined {
  return trails.find((trail) => trail.id === id);
}
