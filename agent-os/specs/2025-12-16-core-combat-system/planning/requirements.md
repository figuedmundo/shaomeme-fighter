# Spec Requirements: Core Combat System

## Initial Description
Port physics, hitboxes, and state machine (Idle, Walk, Attack, Hit) from temp_clone to Phaser 3 sprites.

## Requirements Discussion

### First Round Questions

**Q1:** I assume you want me to implement a standard Arcade Physics system in Phaser 3 (gravity, jumping, walking, collisions with the ground) from scratch to replace the old logic. Is that correct?
**Answer:** Yes.

**Q2:** I assume I should define standard "body" and "attack" hitboxes for the fighters within the new Phaser scenes. Is that correct?
**Answer:** Yes.

**Q3:** I assume you want a class-based State Machine (e.g., Fighter class with currentState like Idle, Walk, Attack) to manage animations and logic more robustly. Is that correct?
**Answer:** Yes.

**Q4:** I assume these [`refs/`] are the assets we should use for the new Phaser sprites. Is that correct?
**Answer:** Yes but with a caveat, right now we can use for phaser sprites but later can we redesign them using my girlfriend and parents, brother, me pictures, personalize I mean.

**Q5:** Are the WebP files in `refs/` animated WebPs or static images? How should we handle the animations?
**Answer:** Please recommend me according the best way to accomplish this project, the sprites webp files were just for me to try to develop this.

**Q6:** I assume we should implement keyboard controls (Arrow keys + Attack keys) for debugging this stage. Is that correct?
**Answer:** Correct.

### Existing Code to Reference
- `refs/` folder contains the source WebP images to be used as placeholders.
- `temp_clone/` contains the logic concepts (attack/defense values) to be adapted.

## Visual Assets
No visual files provided in `planning/visuals/`.
(Reference assets exist in project root `refs/`).

## Requirements Summary

### Functional Requirements
- **Arcade Physics:** Implement gravity, velocity, floor collisions, and jumping mechanics using Phaser 3's Arcade Physics engine.
- **State Machine:** Create a robust `Fighter` class with a State Machine handling states: `Idle`, `Walk`, `Jump`, `Attack`, `Crouch`, `Block`, `Hit`, `Die`.
- **Hitboxes:**
  - **Hurtbox (Body):** The area where the fighter can take damage.
  - **Hitbox (Attack):** Active only during specific frames of attack animations.
- **Asset Processing (Recommendation):** Convert the animated WebP files in `refs/` into **Spritesheets (PNG + JSON)**.
  - *Reasoning:* Fighting games require precise frame-by-frame control for hitboxes (e.g., an attack is only active for frames 3-5). Spritesheets allow this precision; animated WebPs do not.
  - *Implementation:* We will process the WebPs (or placeholders) to generate standard spritesheets for Ryu (Player 1) and Ken (Player 2/Enemy) for this prototype.
- **Controls:** Implement keyboard input (Arrows to move/jump, Space/Z/X to attack) for development/debugging.

### Reusability Opportunities
- The `Fighter` class design should be generic enough to accept different "Skin" configs later, facilitating the "Personalization" requirement where we swap sprites for photos of real people.

### Scope Boundaries
**In Scope:**
- Creating the `Fighter` class and State Machine.
- Implementing physics (movement, gravity).
- Implementing basic attacks (ground based).
- Converting/Loading placeholder spritesheets for Ryu and Ken.
- Basic hitbox detection (Attack box overlaps Hurtbox -> Log damage).

**Out of Scope:**
- Touch Controls (Invisible Combat Zones).
- Complex Combo systems or Special Moves (Fireballs).
- The full "Personalization" photo capture/swapping UI (just the architecture to support it).
- Sound effects implementation (unless basic placeholders are easy).
- Victory/Photo Slideshow logic.

### Technical Considerations
- **Phaser 3 Arcade Physics:** Use `scene.physics.add.sprite`.
- **Component Architecture:** Consider using a `FighterStateMachine` class separate from the Sprite to keep logic clean.
- **Asset Loading:** Preload spritesheets in `PreloadScene`.
