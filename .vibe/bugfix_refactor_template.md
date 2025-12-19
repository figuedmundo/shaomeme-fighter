# AI Task Template: Bug Fixes & Refactoring - Shaomeme Fighter

> **Purpose**: This template provides a systematic framework for AI assistants to analyze, plan, and execute bug fixes and code refactoring tasks for the Shaomeme Fighter project (Phaser 3.90.0).

---

## 📋 Template Metadata

- **Template Version**: 2.0.0
- **Project Name**: Shaomeme Fighter
- **Core Tech**: Phaser 3.90.0, Vite, Express, UnifiedLogger
- **Task ID**: [TASK_ID or TICKET_NUMBER]
- **Last Updated**: 2025-12-19

---

## 🎯 Task Definition

### Issue Summary

**[Provide a clear, one-sentence description of the bug or refactoring need]**

Example: "DynamicLightingSystem throws TypeError when calling setTint on Rectangle overlay"

### Reported Symptoms

List all observable problems:

- [ ] Symptom 1: [e.g., "Console error: this.overlay.setTint is not a function"]
- [ ] Symptom 2: [e.g., "Dublin arena fog is too dense and lacks depth"]
- [ ] Symptom 3: [e.g., "Fighter animations fail to load if frames are missing"]

### User Impact

- **Severity**: [Critical / High / Medium / Low]
- **Affected Users**: [Mobile users / Specific character selection / Performance degradation]
- **Workaround Available**: [Yes / No]
- **Core Pillars Affected**: [Personalization / Mobile-First / Memory Rewards]

---

## 🔍 PHASE 1: Initial Analysis (Shaomeme Fighter Specific)

### Step 1.1: Understand the Request

**AI Instructions**: Prioritize **Player Feel** and **Mobile Responsiveness**.

#### Questions to Answer:

- [ ] Does this fix maintain the "Fun First" mission?
- [ ] Is the expected behavior verified for a landscape touchscreen?
- [ ] Are we adhering to the "Invisible Combat Zones" input paradigm?
- [ ] Does this change affect the cinematic "Memory Arena" payoff?

#### Output Format:

```markdown
### Problem Understanding

**What**: [Concise description]
**Expected**: [Mobile-first expected behavior]
**Actual**: [Current behavior/error]
**Type**: [Bug / Polish / Performance / Architecture]
```

---

### Step 1.2: Identify Affected Areas

**AI Instructions**: Check for systemic impact across the specialized agents (Architecture, Gameplay, UI/UX).

#### Layers Involved:

- [ ] Core Engine (`src/core/` - Bootstrap/Config)
- [ ] Scenes (`src/scenes/` - State transitions)
- [ ] Systems (`src/systems/` - Lighting, Weather, Input, Combat)
- [ ] UI Components (`src/components/` - HUD, Overlays)
- [ ] Backend (`server/` - Image processing, API)
- [ ] Assets (`public/assets/` - Paths, structure)

#### Files to Investigate:

1. **Primary**: [e.g., FightScene.js, DynamicLightingSystem.js]
2. **Configuration**: [gameData.json, rosterConfig.js, arenaConfig.js]
3. **Mocks**: [tests/setup.js - ensure mocks support new methods]

---

### Step 1.3: Gather Project Context

**AI Instructions**: Mimic existing naming, formatting, and architectural patterns.

#### Key Constraints:

- **Phaser 3.90**: Use modern Phaser patterns (e.g., avoid `Rectangle` for tinting, prefer `Image` with generated textures).
- **Absolute Paths**: All assets MUST use root-relative paths (e.g., `/assets/...`).
- **UnifiedLogger**: Use `logger.debug`, `logger.info`, etc. instead of `console.log`.
- **Arcade Physics**: Keep logic compatible with gravity `1200`.

---

### Step 1.4: Root Cause Analysis

**AI Instructions**: Focus on the "TRUE" cause (e.g., "Shape objects don't support tinting" vs "Tinting is broken").

---

### Step 1.5: Dependency and Side Effects

**AI Instructions**: Map impact on mobile performance and cross-scene state.

---

## 🎯 PHASE 2: Solution Planning

### Step 2.1: Define Success Criteria

**AI Instructions**: Use "Acceptance Tests" that can be verified via Vitest or manual browser check.

#### Success Criteria Checklist:

- [ ] No regression in target 60 FPS on mobile.
- [ ] Assets load via `/` paths from the `public/` folder.
- [ ] `UnifiedLogger` confirms the fix in the logs.
- [ ] Vitest mocks in `tests/setup.js` are updated if new Phaser methods are used.

---

## 🛠️ PHASE 3: Implementation Guidance

### Step 3.1: File-by-File Guide

**AI Instructions**: Provide full file content or precise `replace` calls.

### Step 3.2: Shaomeme Best Practices

- **UI**: Always use `setScrollFactor(0)` and `setDepth(1000+)`.
- **Fighters**: Animation frames MUST match `generate_placeholders.py` indices (0-17).
- **Data-Driven**: Modify `gameData.json` instead of hardcoding arena/character IDs.
- **Orientation**: Ensure UI works in landscape (`1280x720` design resolution).

---

## 📊 PHASE 4: Deliverables

### Step 4.1: Quality Standards

- **Readability**: Small, focused functions.
- **Security**: No secrets in `gameData.json` or logs.
- **Testing**: Every bug fix MUST have a corresponding test case in `tests/`.

---

## 📝 PHASE 5: Summary & Documentation

### Step 5.1: Change Summary

**AI Instructions**: Document _WHY_ choices were made (e.g., choosing `Image` over `Rectangle` for `DynamicLightingSystem`).

### Implementation Summary Template:

```markdown
## Implementation Summary

**Task**: [Fix/Refactor]
**Status**: Complete
**Completed By**: [AI Agent]

### Changes

- **System**: [e.g. WeatherSystem] -> Switched to Gradient Sprites for better fog visuals.
- **Config**: [e.g. gameData.json] -> Reduced fog density for Dublin arena.
- **Tests**: [e.g. EnvironmentalSystems.test.js] -> Updated to expect Image instead of Rectangle.

### Verification

- [ ] npm test (141/141 passing)
- [ ] Manual check: Dublin arena visuals confirmed polished.
```
