# Specification: Fix Green Box on Victory Screen

## Goal

Identify and fix the rendering artifact (green box with diagonal line) that appears on the Victory Screen when "Name Wins" is displayed, likely caused by a missing texture in the Dynamic Lighting System.

## User Stories

- As a player, I want the victory screen to look polished without glitchy green boxes so that I can enjoy the moment of winning.
- As a developer, I want to log asset states during the victory sequence to ensure all dynamic textures are correctly generated and available.

## Specific Requirements

**Debug & Logging**

- Implement detailed logging in `FightScene.checkWinCondition` to verify the existence of the `soft_light` texture before `DynamicLightingSystem` attempts to use it.
- Log the creation status of the `soft_light` texture in `DynamicLightingSystem.init`.

**Fix Missing Texture Artifact**

- Verify if the `soft_light` texture key is being lost or corrupted between scene restarts.
- Ensure `DynamicLightingSystem` correctly handles the regeneration of `soft_light` if it is missing from the Texture Manager, even if it was previously generated.
- If `soft_light` generation relies on `document.createElement('canvas')`, ensure it runs correctly in the current browser context and doesn't return an empty/invalid canvas.
- Fallback: If `soft_light` cannot be generated, the spotlight effect should be skipped to avoid the green box artifact.

**Victory Spotlight Integrity**

- The "Dramatic Victory Lighting" feature in `FightScene` must explicitly check for the validity of the lighting system and its assets before triggering.

## Visual Design

No new visuals. The goal is to remove the "green box with diagonal line" artifact.

## Existing Code to Leverage

**`src/systems/DynamicLightingSystem.js`**

- Reuse `init()` method to enforce texture checks.
- Reuse `addSpotlight` to implement the safe guard against missing textures.

**`src/scenes/FightScene.js`**

- Modify `checkWinCondition` to add the safety check before calling `this.lighting.addSpotlight`.

## Out of Scope

- Redesigning the Victory Screen UI.
- Changing the Victory Slideshow logic (unless it interacts with the texture cache).
- Modifying `AnnouncerOverlay` (unless the issue is proven to be there, but currently unlikely).
