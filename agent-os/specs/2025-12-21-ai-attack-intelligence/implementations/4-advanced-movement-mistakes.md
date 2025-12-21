# Implementation Report: Advanced Movement & Mistake Injection

**Task Group:** 4
**Status:** ✅ Complete

## Changes

- Added `JUMP_APPROACH` and `JUMP_ESCAPE` (Anti-Corner) logic to `makeDecision()`.
- Implemented mistake injection in `getModifiedBlockRate()` based on `mistakeChance`.
- Added logic to jump over the opponent if trapped in a corner.
- Verified via focused movement and mistake tests in `tests/AIController.test.js`.
