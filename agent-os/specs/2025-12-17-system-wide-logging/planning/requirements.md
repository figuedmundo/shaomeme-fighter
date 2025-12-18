# Spec Requirements: System-Wide Logging

## Initial Description

I need add logs to the whole project so we can now what is happening and be able to find bugs

## Requirements Discussion

### First Round Questions

**Q1:** I'm assuming we should implement logging for both the Frontend (Phaser/Vite) and the Backend (Express). Is that correct, or should we focus only on one side?
**Answer:** log everthing

**Q2:** For the Frontend, I'm thinking we should log critical events like scene transitions, fighter state changes (e.g., transitions to HIT or DIE), and input detection. Should we also include high-frequency events like frame updates or physics collisions, or would that be too much noise?
**Answer:** we can have several level of bugs , for high frecuency bugs we can have a verbose so we can check that as well

**Q3:** For the Backend, I assume we want to log API requests to /api/cities and /api/photos, as well as image processing results from ImageProcessor.js. Are there other backend processes we should monitor?
**Answer:** we need to log everuthing

**Q4:** I'm assuming we will use standard console logging for now (which is visible in the browser console and server terminal). Should we consider a logging library (like pino for backend or a custom wrapper for frontend) to handle log levels like DEBUG, INFO, WARN, and ERROR?
**Answer:** we can use pino or any other good logging tool

**Q5:** Regarding the "Shaomeme Fighter" style, should we add any "fun" prefixes to the logs (e.g., [BATTLE-LOG], [MEMORY-SCAN]) to make them easier to filter?
**Answer:** no , just make good logs normal standard best practices

**Q6:** Are there any specific bugs you've encountered recently that these logs should specifically help target?
**Answer:** the game is not wokring even though we have 2e2 test , and maybe we can catch the bug with the logs

## Visual Assets

No visual assets provided.

## Requirements Summary

### Functional Requirements

- **Comprehensive Logging:** Implement logging across all components of the system (Frontend and Backend).
- **Log Levels:** Support multiple log levels (ERROR, WARN, INFO, DEBUG, VERBOSE).
- **Verbose Mode:** Specifically allow for high-frequency/high-volume logging (verbose) to debug complex physics or frame-by-frame issues.
- **Backend Monitoring:** Log all API requests, responses, file system operations, and image processing steps.
- **Frontend Monitoring:** Log scene lifecycle events, asset loading, player input, fighter state transitions, and game loop milestones.

### Reusability Opportunities

- Standardize existing console logs into the new logging framework.
- Create a unified Logger utility that can be shared or adapted for both browser and Node.js environments.

### Scope Boundaries

**In Scope:**

- Integration of a logging library (e.g., pino).
- Implementation of a global logger utility.
- Instrumentation of all major game scenes and components.
- Instrumentation of all Express routes and utility functions.
- Configuration for different log levels.

**Out of Scope:**

- External log aggregation services (e.g., ELK, Datadog) unless needed for basic functionality.
- Persistent log storage beyond standard console/terminal output for now.

### Technical Considerations

- **Environment Context:** Ensure the logger works in both the browser (Vite/Phaser) and Node.js (Express).
- **Performance:** High-frequency logging (verbose) must be easily toggleable to avoid performance degradation on mobile devices during normal play.
- **Debugging focus:** The primary goal is to surface the "hidden" bug that is currently bypassing E2E tests.
