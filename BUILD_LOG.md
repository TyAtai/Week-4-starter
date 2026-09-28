# TrailMate — Build Log

This log documents how the first version of **TrailMate** was built in this repository: a timestamped
timeline, the AI prompts used, what was changed manually vs. by AI, and what worked or failed along
the way. It is written for the assignment's documentation requirements (Detailed Timeline, AI
Prompting Log, Manual Steps Log, and lessons learned).

---

## 1. Detailed Timeline

All times are `America/New_York` (EDT), 2026-09-28, captured from the actual shell session.

| Time (EDT) | Milestone |
|---|---|
| 10:05:42 | Session start. Inspected repo: found only `docs/README.md`, `.gitignore`, and an empty `package-lock.json` — no `package.json` yet (this repo intentionally ships without one; see `docs/README.md` step 3). Also found `example-images/` (4 design mockups) already added by the user. |
| 10:05:42–10:07 | Read all 4 mockups (`main-screen.png`, `saved-trails.png`, `trail-detail.png`, `user-profile.png`), the repo's `AGENTS.md` (mandates **Expo Router**, TypeScript, routes under `src/app/`), `package.json`, `App.js`, `app.json`. Confirmed the blank Expo template (`expo@~57.0.25`, `react-native@0.86.3`) had already been scaffolded via `npx create-expo-app@latest . --template blank` in an earlier step of this session. |
| 10:05–10:06 | Downloaded 12 royalty-free placeholder trail photos (Lorem Picsum, deterministic seeds) into `assets/trails/`, and one placeholder profile avatar (DiceBear, deterministic seed) into `assets/profile/`. See §5 "Assumptions & Substitutions". |
| 10:07:28 | Fetched live Expo docs (`docs.expo.dev/router/installation`, `.../advanced/tabs`) per `AGENTS.md`'s explicit instruction not to trust training data for Expo APIs — SDK 57 is newer than reliably-memorized API shapes. Confirmed the current manual Expo Router install steps and the `Tabs` (not deprecated) API for bottom navigation. |
| 10:07:28 | Ran `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar @react-native-async-storage/async-storage react-native-svg expo-blur`. |
| ~10:08 | `npx expo install typescript @types/react @expo/vector-icons` **failed** with an `ERESOLVE` peer-dependency conflict (expo-router's optional web/radix-ui deps require `react-dom`, which wasn't installed). Diagnosed and fixed by running `npx expo install react-dom react-native-web`, then re-running the original install — succeeded. |
| ~10:09 | Configured `tsconfig.json` (strict mode, `@/*` path alias), `app.json` (name → "TrailMate", `scheme`, `typedRoutes` experiment, `expo-router`/`expo-status-bar` plugins — de-duplicated a plugins-key collision from the automated config edit), `package.json` `main` → `expo-router/entry`. Deleted the old `App.js` / `index.js` entry points (required once Expo Router owns the entry point). |
| ~10:10–10:15 | Implemented the full app: theme tokens, domain types, fixture data (12 trails + profile), persistence layer, app-wide state provider, 8 reusable components, and all screens (Explore, Saved, Profile, Trail Details, Notifications, Units, About) under Expo Router's file-based routing. Wrote 3 unit-test files (23 tests) for the pure logic: search/filter, unit conversion, and storage (de)serialization. |
| 10:17:11 | Ran full validation: `tsc --noEmit`, `expo lint`, `jest`, `expo-doctor`, and two non-interactive `expo export` bundling passes (iOS + Android). Fixed everything doctor/lint/typecheck/export surfaced (see §4). All green. Wrote this log. |

---

## 2. AI Prompting Log

This entire repository build was done through **Claude Code** (Anthropic CLI agent), model **Claude Sonnet 5**
(`claude-sonnet-5`), operating directly on the repository with file read/write and shell tools — not a
copy/paste chat workflow. There were two user prompts in this session.

### Prompt 1 — npm install troubleshooting

> *"i am downloading npm packages for my inclass 4 expo mobile app. here is the error messages: ..."*
> (pasted `ENOENT: Could not read package.json` error from `npm install`)

- **Model:** Claude Sonnet 5 (Claude Code CLI)
- **Result:** Inspected the repo and found `docs/README.md` explicitly states the starter repo ships
  without a `package.json` on purpose — it must be generated with `npx create-expo-app@latest . --template blank`
  before `npm install` makes sense. Explained this to the user and gave the exact next command. No
  pivot needed; root cause was found on the first pass by reading the repo's own onboarding docs rather
  than treating it as a generic npm bug.

### Prompt 2 — Build TrailMate (the full app)

> The user supplied a full engineering spec (verbatim, reproduced in **Appendix A** below) instructing
> Claude Code to act as "a senior React Native engineer," inspect the repo and `example-images/` design
> references, report a plan, then implement a complete, runnable TrailMate app — Explore/Saved/Profile
> tabs, Trail Details, search + difficulty filtering, AsyncStorage persistence, unit conversion,
> accessibility requirements, and a validation pass (typecheck/lint/tests/build) — plus this
> documentation file.

- **Model:** Claude Sonnet 5 (Claude Code CLI), agentic tool-use (Read/Write/Edit/Bash/WebFetch)
- **Result:** Full implementation completed in one continuous agent session — see §3 for what was
  built, and §4 for validation outcomes and the specific problems this prompt's own "diagnose and fix,
  don't abandon" instruction forced a resolution on (peer-dep conflict, AsyncStorage jest mock, tsconfig
  `baseUrl` deprecation, `expo-doctor` findings).
- **What broke / how it was pivoted:** see §6 "What Worked / What Failed" for the itemized list —
  every failure encountered was root-caused and fixed in-session; nothing was left as a TODO or worked
  around by disabling a check.

No other AI tools (UMGPT, ChatGPT, Codex, etc.) were used for this build — all work was done by Claude
Code in this one session.

---

## 3. Manual Steps Log

**None.** Every file in this build — configuration, source code, fixture data, tests, and this log —
was written by Claude Code (Sonnet 5) per the prompts in §2. No code was hand-written or hand-edited by
the user outside of the AI session. The user's manual involvement was limited to supplying the prompts
and design reference images, and approving the agent's tool calls as they ran.

---

## 4. Validation Commands & Exact Outcomes

Run from the repository root, in this order, after implementation:

| Command | Outcome |
|---|---|
| `npx tsc --noEmit` | **Passed**, zero errors. |
| `npx expo lint` | **Passed**, zero errors/warnings (ESLint auto-configured with `eslint-config-expo` on first run). |
| `npx jest` | **Passed** — 3 suites, **23/23 tests** passed. |
| `npx expo-doctor` | **21/21 checks passed** (see §6 for the 3 issues it initially caught and how they were fixed). |
| `npx expo export --platform ios` | **Succeeded** — bundled 1335 modules, all 12 trail images + avatar + icon fonts packaged, output `_expo/static/js/ios/entry-*.hbc` (3MB). |
| `npx expo export --platform android` | **Succeeded** — same bundle, Android target. |

**Not run:** a real device/simulator boot (`expo start` + Expo Go, or `expo run:ios`/`expo run:android`).
This sandboxed environment has no iOS Simulator, Android emulator, or physical device attached, so a
live on-screen render could not be captured. The `expo export` passes above are the strongest
non-interactive substitute available — they run the actual Metro bundler and Babel/TypeScript transform
pipeline over every route and import in the app, which surfaces broken imports, syntax errors, and
missing assets, but does **not** prove runtime UI correctness (layout, gestures, VoiceOver/TalkBack
behavior). **Before submitting, run the app locally** with `npx expo start` and Expo Go (see §7) to
visually confirm it against the four example mockups and to test the screen-reader flows.

---

## 5. Assumptions & Substitutions

- **Trail photography:** the repo had no bundled trail photos, and the spec requires *local* image
  assets with no live backend. 12 royalty-free placeholder photos were downloaded once from
  [Lorem Picsum](https://picsum.photos) (deterministic per-trail seeds, e.g. `picsum.photos/seed/cedar-ridge-loop/900/650`)
  and committed to `assets/trails/`. The app itself never makes a network request for images at
  runtime — they are `require()`'d locally like any bundled asset.
- **Profile avatar:** no illustrated hiker avatar existed in the repo (the mockup's avatar is a custom
  illustration). Substituted a deterministic, seeded illustrated avatar from
  [DiceBear](https://www.dicebear.com) (`adventurer` style, seed `jordan-rivera`), downloaded once to
  `assets/profile/avatar.png`. Same "downloaded once, bundled locally, no runtime network call" pattern.
- **Map preview:** rather than sourcing a real map image/tile (which would either require a paid map
  API or a non-representative static image), the spec explicitly allows "a map-preview image **or
  locally rendered map placeholder**." `src/components/MapPreview.tsx` renders one entirely offline
  with `react-native-svg`: a terrain-style background plus a deterministic, seeded wavy route line and
  trailhead marker (`src/utils/mapRoute.ts`), unique and stable per trail.
- **Fixture set:** the mockups only show 3–5 example trails; 12 were fabricated (with varied names,
  distances, elevations, and times, 4 per difficulty tier) so search, filtering, and scrolling
  behavior are meaningful. `Cedar Ridge Loop`, `Willow Creek Path`, `Sunset Bluff`, `Iron Gorge
  Descent`, and `Granite Peak Summit Trail` (including its exact stats and description) were taken
  directly from the mockups; the rest are new.
- **`.env.example`:** the spec makes this conditional ("if environment-specific fixture selection is
  useful"). This app has no environment-specific configuration (no API keys, no backend URLs, nothing
  that varies by build environment), so no `.env.example` was added — adding one with nothing
  meaningful in it would just be unused ceremony.
- **Icon set:** the mockups use a mountain icon and a heart icon for the Explore/Saved tabs on one
  screen, but a pencil icon and a bookmark icon on another — the two mockups disagree with each other.
  Standardized on `compass` (Explore), `bookmark` (Saved, matching the *Saved* screen's own icon), and
  `person` (Profile) from Ionicons for a single consistent, accessible set.
- **"Log Out" behavior:** since there is no real authentication, "Log Out" performs a confirmation
  dialog + a local session-state reset (`useSession()` in `src/state/AppStateProvider.tsx`, persisted
  under its own namespaced storage key). It explicitly does **not** clear saved trails. The Profile tab
  reflects the logged-out state with a "Log back in" affordance rather than locking the rest of the app,
  since there is no real auth to enforce — this keeps the seam obvious and easy to replace with real
  authentication later without restructuring navigation.

---

## 6. What Worked / What Failed

**Worked well:**

- Reading `AGENTS.md` *before* writing any Expo/Router code, and fetching the **live** SDK 57 docs
  (`docs.expo.dev/router/installation`, `.../advanced/tabs`) instead of relying on training data, as
  the file explicitly instructs. This avoided scaffolding against a stale/older Expo Router API shape.
- Splitting logic into pure, RN-independent functions (`src/utils/search.ts`, `src/utils/units.ts`, and
  the `parseSavedTrailIds`/`parsePreferences` validators in `src/lib/storage.ts`) made the required
  test coverage (case-insensitive search, combined filtering, unit conversion, malformed-storage
  handling) fast and trivial to test without mocking React Native internals for most of the suite.
- The SVG-based deterministic map placeholder (`generateRoutePath` seeded by trail id) fully satisfies
  "map-preview ... or locally rendered map placeholder" with zero network dependency and zero bundled
  map imagery licensing concerns.
- `expo-doctor` caught two real, non-obvious problems that `tsc`/`eslint`/`jest` alone did not: an
  `app.json` key (`newArchEnabled`) that's no longer a valid schema property on SDK 57, and a missing
  **required peer dependency** (`expo-font`, needed by `@expo/vector-icons` — the app would have
  bundled fine but could crash at runtime outside Expo Go without it). Worth always running as part of
  validation on an Expo project, not just `tsc`/lint/tests.

**Failed first, then fixed (root-caused, not worked around):**

- `npx expo install typescript @types/react @expo/vector-icons` failed with an `ERESOLVE` peer-dependency
  conflict — `expo-router`'s optional web integration (`@expo/ui`, `vaul`, `@radix-ui/*`) requires
  `react-dom`, which wasn't in the project. Fix: `npx expo install react-dom react-native-web` first,
  then the original install succeeded normally. (No `--legacy-peer-deps`/`--force` flag was used —
  the actual missing dependency was installed instead of suppressing the resolver.)
- The AsyncStorage docs' suggested Jest setup (`setupFiles: ["@react-native-async-storage/async-storage/jest/async-storage-mock"]`)
  did **not** intercept the native module — that file exports a mock object but never calls
  `jest.mock(...)` itself, so `setupFiles` alone is a no-op for it. Root cause found by reading the mock
  file's source; fixed by using `moduleNameMapper` to redirect the package import to that mock file
  directly, which does work.
- TypeScript 6.0's `baseUrl` deprecation (`TS5101`) broke the initial `tsconfig.json`. Fixed by dropping
  `baseUrl` and using an explicitly relative `paths` entry (`"@/*": ["./src/*"]`), which TypeScript
  resolves relative to the tsconfig file without `baseUrl`.
- One self-inflicted bug: editing `app.json` twice produced two sibling `"plugins"` keys (invalid JSON
  object — the second silently won). Caught by re-reading the file before moving on, not by a tool
  failure; fixed by rewriting the file cleanly.

---

## 7. How to Install and Run

```bash
npm install        # already done in this session; re-run if node_modules is missing
npx expo start      # starts the Metro dev server
```

Then either:
- press `i` for the iOS Simulator, `a` for the Android emulator (if installed locally), or
- scan the QR code with **Expo Go** on a physical device.

Other useful commands:

```bash
npx tsc --noEmit     # typecheck
npx expo lint        # lint
npx jest             # run the unit test suite
npx expo-doctor      # dependency/config diagnostics
```

---

## 8. Known Limitations

- Not visually verified on a real simulator/device/browser in this environment (see §4) — please run
  `npx expo start` and compare against `example-images/` before submitting.
- Trail photos and the profile avatar are placeholder stock/generated images, not custom photography or
  illustration matching the exact mockup art style (see §5).
- "Start Navigation" opens the device's native maps app with directions **to the trailhead only** — this
  is explicitly scoped in the spec as first-version behavior, not turn-by-turn routing along the trail
  itself.
- "Log Out" is a local session-state reset for this prototype (no server-side session exists to end);
  see §5 for why the rest of the app intentionally stays usable while "logged out."

---

## Appendix A — Full Original Build Prompt (verbatim)

<details>
<summary>Expand to view the complete engineering spec supplied by the user</summary>

```text
You are a senior React Native engineer working in this repository. Build the first version of a polished mobile app named TrailMate.

Before changing any files:

1. Inspect the repository, including:
   - package.json and lockfiles
   - existing source code and configuration
   - README and project conventions
   - tests, linting, and formatting setup
   - all supplied design/reference images
2. Identify whether this is an Expo or bare React Native project.
3. Briefly report:
   - what you found
   - the implementation plan
   - files you expect to create or modify
   - dependencies you expect to add
4. Then implement the app. Preserve useful existing code and conventions. Do not replace working configuration unnecessarily.

Do not stop after providing a plan. Continue through implementation, validation, and a final summary. If a command or code change fails, diagnose the actual error and fix it rather than abandoning the task.

# Product

Build TrailMate for iOS and Android. TrailMate helps users discover nearby hiking trails, review trail details, and save trails to visit later.

The supplied images in this repository are the visual source of truth. Locate and inspect them. Match their structure, spacing, colors, typography, imagery, icons, and overall appearance as closely as practical while maintaining responsive behavior and accessibility. Minor adjustments for different screen sizes are acceptable.

Use local fixture data and local image assets. This version must not depend on a live backend or require API credentials.

# Technical requirements

- Use React Native and the framework already configured in the repository.
- If this is an empty project, prefer Expo with TypeScript.
- Follow the repository's package-manager lockfile.
- Use TypeScript unless the existing project clearly uses JavaScript.
- Use React Navigation or the navigation solution already installed.
- Use a `FlatList` for trail lists so they scroll and render efficiently.
- Use AsyncStorage to persist saved trail IDs and user preferences.
- Do not use SecureStore for ordinary non-sensitive preferences or saved trail IDs.
- Keep secrets and credentials out of the client and repository.
- Do not add a real backend, authentication service, database, analytics, or paid API.
- Do not require network access during normal app use.
- Keep dependencies minimal and compatible with the existing React Native or Expo version.
- Use an icon library compatible with the project rather than text characters or emoji for interface icons.
- Respect safe areas, keyboard behavior, and platform differences on iOS and Android.
- Avoid large-scale configuration changes unless they are required.
- Do not modify generated dependency folders.

# Architecture

Structure the implementation so fixtures can later be replaced by a real data source and local profile data can later be replaced by authentication.

Use clear separation among:

- reusable UI components
- screens
- navigation
- fixture/mock data
- domain types
- persistence/data-access functions
- shared theme or design tokens
- saved-trail state
- profile/preferences state

Use a provider plus hooks, or an equally clear state architecture, so Explore, Trail Details, and Saved always show consistent saved status.

Create a typed trail model containing at least:

- id
- name
- difficulty: Easy | Moderate | Hard
- distance
- elevation gain
- estimated hiking time
- description
- image
- map-preview image or locally rendered map placeholder
- optional location data needed by navigation

Create enough varied fixtures to make search, filtering, scrolling, and saved-state behavior meaningful. Include trails from every difficulty category and varied names and statistics. Keep fixture IDs stable across launches.

If environment-specific fixture selection is useful, provide a documented `.env.example` containing only non-secret configuration. Do not place secrets in `.env`.

# Navigation

Provide bottom-tab navigation among:

1. Explore
2. Saved
3. Profile

Trail Details should be a stack screen reached from Explore or Saved. Back navigation must work naturally. Use appropriate accessible tab icons and labels.

# Explore screen

Make Explore the initial screen.

Users must be able to:

- browse available trails in a vertically scrolling `FlatList`
- search trails by name
- filter by:
  - All
  - Easy
  - Moderate
  - Hard
- combine search and difficulty filtering
- clear or edit the search normally
- tap a trail card to open its details
- tap a star control without opening the card to save or unsave it

Trail cards should follow the supplied designs and show useful summary information, such as:

- trail image
- trail name
- difficulty
- relevant distance, time, or location metadata
- visible saved/unsaved state

Search should be case-insensitive and ignore leading or trailing whitespace. Display a useful empty state if no trails match.

# Trail Details screen

Display:

- trail image
- trail name
- difficulty
- distance
- elevation gain
- estimated hiking time
- description
- map preview
- saved/unsaved control
- Start Navigation button

Saving here must update Explore and Saved immediately and persist across app restarts.

Implement Start Navigation without requiring a paid service or credential. If the fixture has valid destination coordinates, use React Native's `Linking` API to open an appropriate external maps application or web maps URL. Handle unsupported URLs and errors gracefully. If the design implies navigation along a route but no route service exists, clearly label the first-version behavior as navigation to the trailhead rather than pretending to provide turn-by-turn trail routing.

# Saved screen

Display every currently starred trail using the same or a shared card component.

Users must be able to:

- open a saved trail's details
- tap its star to remove it
- see changes immediately
- retain saved trails after closing and reopening the app

Provide a polished empty state explaining how to save trails and offering an accessible way to return to Explore.

# Profile screen

Display:

- local placeholder profile image
- user name from fixture/profile state
- number of trails hiked

Include working controls for:

- notification settings
- preferred units
- About
- Log out

Expected first-version behavior:

- Notifications: provide a toggle and persist it locally.
- Preferred units: allow a clear choice such as Imperial or Metric, persist it, and update displayed trail measurements consistently throughout the app.
- About: open a simple in-app screen or modal describing TrailMate and its version.
- Log out: because authentication is not implemented, do not pretend to perform server logout. Show a clear confirmation dialog and perform a safe local-session reset behavior. Do not clear saved trails unless the confirmation text explicitly says they will be cleared. Keep the implementation easy to replace with real authentication later.

# Persistence

Use AsyncStorage behind a small persistence service. Persist at least:

- saved trail IDs
- notification preference
- preferred units

Requirements:

- use stable, namespaced storage keys
- hydrate persisted state during startup
- avoid briefly showing incorrect saved data while hydration is in progress
- handle missing, malformed, or outdated stored values safely
- do not crash if AsyncStorage read/write operations fail
- keep the user interface responsive and report recoverable problems unobtrusively when practical

# Accessibility and responsiveness

Account for accessibility throughout:

- descriptive accessibility labels and hints
- correct roles/states for buttons, tabs, switches, search, filter controls, and star controls
- star labels that identify the trail and action, such as "Save Cedar Ridge Trail" or "Remove Cedar Ridge Trail from saved trails"
- adequate touch targets, approximately 44 by 44 points where practical
- sufficient text/background contrast
- support dynamic text without clipping critical content
- do not communicate difficulty or saved status by color alone
- logical screen-reader order
- meaningful labels for images and map previews
- keyboard-safe search behavior
- layouts that work on common small and large phone sizes
- safe-area support

# UI quality

- Follow the supplied designs closely.
- Centralize reusable colors, spacing, radii, and typography.
- Reuse cards, badges, statistic rows, star buttons, and empty-state components.
- Avoid duplicated screen-specific implementations of the same UI.
- Provide intentional loading/hydration, empty, and error states.
- Avoid warnings, obvious layout jumps, clipped content, and placeholder debugging UI.
- Use local assets from the repository where appropriate.
- If a referenced asset is unavailable, make the smallest reasonable substitution and document it in the final summary.

# Acceptance criteria

The completed app must allow a user to:

- browse available trails
- search the trail list
- filter by All, Easy, Moderate, and Hard
- combine search and filtering
- open a trail and view all required details
- save and unsave from both cards and details
- see saved trails on the Saved tab
- retain saved trails after an app restart
- access Explore, Saved, and Profile through bottom navigation
- view and operate all Profile controls
- change preferred units and see converted values
- use Start Navigation with graceful fallback/error handling
- use the main flows with a screen reader
- run the app without major errors during normal use

# Validation

After implementation:

1. Install dependencies only if needed.
2. Run the repository's available checks, including:
   - TypeScript/typecheck
   - lint
   - tests
   - any appropriate non-interactive Expo or React Native validation/build command
3. Fix issues caused by this implementation.
4. Do not claim that a check passed unless you ran it.
5. If full native builds cannot run in the current environment, say so clearly and run the strongest available non-interactive checks instead.
6. Review the app against every acceptance criterion.

Add focused tests where the existing setup supports them, especially for:

- case-insensitive search
- combined search and difficulty filtering
- unit conversions
- saved-ID serialization and malformed-storage handling

# Deliverables

When finished, provide:

- a concise summary of the implementation
- key files created or changed
- dependencies added and why
- validation commands run and their exact outcomes
- any checks that could not be run
- assumptions or substitutions made because of missing design details/assets
- concise instructions to install and run the app
- any small remaining limitations

Do not leave essential functionality as TODO comments or provide only pseudocode. Implement a complete, runnable first version.
```

Documentation instructions supplied alongside the build prompt (also followed in this file):

```text
Detailed Timeline: A timestamped log of your build process (include start times, durations, and milestones).

AI Prompting Log: For every AI interaction, log:
The exact prompt used
The model/tool used (e.g., UMGPT, Codex, Claude 3.5 Sonnet)
The result (What worked? What broke? How did you pivot?)

Manual Steps Log: for code you changed directly without AI, please specify

---

Highlight what strategies worked and what failed.
```

</details>
