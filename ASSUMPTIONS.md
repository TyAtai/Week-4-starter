# TrailMate — Assumptions Log

This document lists every assumption made while building the first version of TrailMate, why it was
made, and where it shows up in the code. It's a companion to `BUILD_LOG.md` (which has the full
timeline and AI prompting log) — this file exists specifically to answer "what did the AI decide on
your behalf, and why," since the spec left some things genuinely ambiguous or explicitly asked for
substitutions to be documented.

---

## 1. Content & asset substitutions

These were required because the repo had no real trail photography, illustration, or map imagery —
only four static mockup screenshots as design reference.

| Asset | Assumption | Why | Where |
|---|---|---|---|
| Trail photos (12) | Used royalty-free placeholder photography from [Lorem Picsum](https://picsum.photos), one deterministic seed per trail, downloaded once and bundled locally. | The spec requires local image assets and no live backend. Real photography wasn't available, and sourcing licensed photos per-trail wasn't feasible in this session. Picsum images are free-to-use and downloading them once at build time (not at app runtime) keeps the running app fully offline. | `assets/trails/*.jpg`, referenced in `src/data/trails.ts` |
| Profile avatar | Used a deterministic, seeded illustrated avatar from [DiceBear](https://dicebear.com) instead of a custom illustration matching the mockup's hand-drawn hiker art style. | No illustration asset existed and generating custom art wasn't in scope. A seeded avatar is stable across rebuilds (same seed → same image) and bundled locally like any other asset. | `assets/profile/avatar.png`, `src/data/profile.ts` |
| Map preview | Built as a locally-rendered SVG illustration (terrain-colored background + a deterministic wavy "route" line + trailhead marker, seeded per trail) instead of a real map image or map tile service. | The spec explicitly allows this: *"map-preview image **or locally rendered map placeholder**."* A real map would need a paid tiles API (forbidden) or a static image that wouldn't actually correspond to the fictional trail. | `src/components/MapPreview.tsx`, `src/utils/mapRoute.ts` |

---

## 2. Fixture data

| Assumption | Why |
|---|---|
| 12 trails total, 4 per difficulty tier (Easy/Moderate/Hard). | The spec says "enough varied fixtures to make search, filtering, scrolling, and saved-state behavior meaningful" without a number. 12 felt like the smallest set that makes filtering and empty-search-result states feel real without being tedious to review. |
| 5 trails (names, exact stats, and — for Granite Peak — description text) were taken directly from the mockups: Cedar Ridge Loop, Willow Creek Path, Sunset Bluff, Iron Gorge Descent, Granite Peak Summit Trail. The other 7 were invented. | Kept the app visually/numerically consistent with the supplied design reference where the reference actually specified values; fabricated the rest since the mockups only show 3–5 trails but 12 were needed. |
| Trailhead coordinates are real-looking (real US hiking regions) but not verified, actual GPS coordinates for a real trailhead. | "Start Navigation" needs *some* coordinate to build a maps deep link, and the spec explicitly says fixture data is fine. These are illustrative, not to be treated as accurate hiking directions. |
| "Trails hiked" (12, shown on Profile) is a static fixture number, unrelated to the saved-trails count or any real activity log. | The spec asks for "number of trails hiked" as profile *display* data, not a tracked/derived statistic — there's no hike-completion flow in this version, so it's fixture data like the rest of the profile. |
| Trail IDs are stable, hand-written kebab-case strings (e.g. `cedar-ridge-loop`), not array indices or generated UUIDs. | The spec requires saved status to survive across restarts and fixture edits; index-based IDs would silently corrupt saved state if the fixture array is ever reordered. |

---

## 3. Product-behavior interpretations

Places where the spec described a constraint but left the exact behavior up to implementation:

| Area | Assumption made | Why |
|---|---|---|
| **Start Navigation** | Opens the device's native maps app with directions to the **trailhead coordinates only**, clearly labeled as such (both in the button's accessibility hint and a caption under the button). | The spec explicitly requires this distinction ("clearly label the first-version behavior as navigation to the trailhead rather than pretending to provide turn-by-turn trail routing") since no route/trail-navigation service is included and none is allowed (no paid API). |
| **Log Out** | Resets a local "session" flag (persisted, not real auth) and shows a logged-out empty state *only on the Profile tab* — Explore and Saved remain fully usable while "logged out." | There is no real authentication to enforce app-wide, and the spec says to keep this "easy to replace with real authentication later." Locking the whole app behind a fake session felt like it would misrepresent what's actually happening (nothing is actually being protected) and would've meant building real route-guarding logic for a state that isn't real auth. Saved trails are explicitly never cleared by this action, per the spec. |
| **Notifications toggle** | Purely a local, persisted preference with no actual push-notification wiring (no permission prompt, no scheduled notification). | The spec says "provide a toggle and persist it locally" — it does not ask for a real notifications pipeline, and adding one would require a backend/push service, which is explicitly out of scope. |
| **Tab icons** | Standardized on `compass` (Explore), `bookmark` (Saved), `person` (Profile) — all from one icon family (Ionicons). | The two supplied mockups actually *disagree with each other*: the Explore screen mockup shows a mountain icon for its own tab and a heart icon for Saved, while the Saved-screen mockup shows a pencil icon for Explore and a bookmark icon for Saved. Since the reference images conflict, a single self-consistent, accessible icon set was chosen rather than trying to reconcile two mockups that don't match. |
| **Filter chip accessibility role** | Used `accessibilityRole="tab"` / `"tablist"` for the All/Easy/Moderate/Hard filter chips. | React Native's accessibility role vocabulary has no dedicated "segmented filter control" role; `tab`/`tablist` is the closest built-in semantic match for "a row of mutually exclusive selectable options" and is what most production RN apps use for this pattern. |

---

## 4. Architecture & technical choices

| Assumption | Why |
|---|---|
| Used **Expo Router** (file-based routing under `src/app/`) rather than installing React Navigation directly. | The build prompt said "use React Navigation or the navigation solution already installed" — nothing was installed yet, so this was a genuine choice point. The repo's own `AGENTS.md` is explicit and unconditional: *"Use Expo Router for all navigation... Never trust your training data [for Expo APIs]."* Repo convention took precedence over the more generic instruction in the prompt. |
| Used **TypeScript** in **strict mode**. | The prompt says "Use TypeScript unless the existing project clearly uses JavaScript" — the starter's blank template was plain JS (`App.js`), but nothing about it was TypeScript-hostile, and the prompt separately says "If this is an empty project, prefer Expo with TypeScript." Treated "empty project, about to be scaffolded" as the operative case. |
| One combined `AppStateProvider` (saved trails + preferences + session) instead of three separate context providers. | The spec asks for "a provider plus hooks, or an equally clear state architecture" — a single provider with three focused hooks (`useSavedTrails`, `usePreferences`, `useSession`) keeps one hydration lifecycle and one loading gate instead of three, while still keeping the *consumer-facing* API separated by concern. |
| Canonical stored units for distance/elevation are **imperial** (miles, feet), converted to metric only for display. | The mockups display imperial units by default (e.g. "4.2 mi", "3,450 ft"), and fixture data needed one canonical representation to avoid rounding-trip drift between units. Metric is derived on the fly via `src/utils/units.ts`, never stored. |
| No `.env.example` file was added. | The spec makes this conditional: *"If environment-specific fixture selection is useful, provide..."* This app has no backend URL, API key, or build-environment-dependent configuration of any kind — adding an empty/unused `.env.example` would be ceremony with nothing real to configure. |
| Build-time network access (downloading placeholder images from Picsum/DiceBear during implementation) was treated as acceptable, distinct from the spec's "no network access during normal app use" requirement. | That requirement is about the *running app's* behavior for the student/grader, not about how the AI agent sourced placeholder assets once during development. Once downloaded, the images are ordinary bundled local files — the shipped app makes no image-fetch network calls. |

---

## 5. Validation environment

| Assumption | Why |
|---|---|
| No iOS Simulator, Android emulator, or physical device was available in this build environment, so correctness was validated with `tsc --noEmit`, `expo lint`, `jest`, `expo-doctor`, and two non-interactive `expo export` passes (iOS + Android bundling) instead of an actual on-screen run. | The spec explicitly anticipates this: *"If full native builds cannot run in the current environment, say so clearly and run the strongest available non-interactive checks instead."* `expo export` runs the real Metro/Babel/TypeScript pipeline over every screen and import, which catches broken code, but it does **not** verify visual layout, gesture behavior, or actual screen-reader announcements. **This still needs a real run (`npx expo start` + Expo Go or a simulator) before submitting**, to confirm the app visually matches `example-images/` and that the accessibility flows work as described. |

---

## Quick reference: full detail

Every substitution and interpretation above is also cross-referenced against validation results and
the AI prompting log in `BUILD_LOG.md` (§5 "Assumptions & Substitutions" and §6 "What Worked / What
Failed"), if you need timestamps or the exact prompts that produced these decisions for the "AI
Prompting Log" section of your homework write-up.
