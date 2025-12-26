# Task Breakdown: Fix Green Box on Victory Screen

## Overview

Total Tasks: 6

## Task List

### Debugging & Logging

#### Task Group 1: Texture & Lighting Logging

**Dependencies:** None

- [x] 1.0 Implement logging for dynamic textures and lighting
  - [x] 1.1 Write 2-3 focused tests for `DynamicLightingSystem` texture generation
  - [x] 1.2 Add texture generation logs to `DynamicLightingSystem.js`
  - [x] 1.3 Add safety check and fallback in `DynamicLightingSystem.addSpotlight`
  - [x] 1.4 Ensure logging tests pass

**Acceptance Criteria:**

- `DynamicLightingSystem` logs texture status on initialization.
- `addSpotlight` safely handles missing `soft_light` texture without crashing or adding a "missing texture" placeholder.
- Tests verify the fallback logic.

### Gameplay Logic

#### Task Group 2: Fight Scene Integration

**Dependencies:** Task Group 1

- [x] 2.0 Safeguard Victory Spotlight Trigger
  - [x] 2.1 Write 2-3 focused tests for `FightScene` victory sequence
  - [x] 2.2 Add pre-flight check in `FightScene.checkWinCondition`
  - [x] 2.3 Run gameplay verification tests

**Acceptance Criteria:**

- Victory sequence logs its attempt to add a spotlight.
- The game does not render a green box (missing texture) if the spotlight texture is missing.
- The game flow continues to the slideshow regardless of lighting success.

## Execution Order

Recommended implementation sequence:

1. Debugging & Logging (Task Group 1)
2. Gameplay Logic (Task Group 2)
