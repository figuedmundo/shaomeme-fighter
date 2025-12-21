# Implementation Report: Reactive Decision Engine

**Task Group:** 2
**Status:** ✅ Complete

## Changes

- Refactored `AIInputController.js` to use frame-based reactivity.
- Replaced fixed interval updates with dynamic `reactionDelay` and `moveInterval` based on difficulty.
- Added `pendingReaction` logic to queue actions (like BLOCK) after a delay when detecting opponent attacks.
- Implemented `isOpponentJumping()` for state detection.
- Verified via focused timing tests in `tests/AIController.test.js`.
