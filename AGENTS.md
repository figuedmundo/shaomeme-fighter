# AGENTS.md

## Required Read Order for Agents

All agents must read and internalize the following files before making changes:

1. DOCUMENTATION.md
2. AGENTS.md
3. src/ (existing code)

<skills>

## Skills

You have new skills. If any skill might be relevant then you MUST read it.

- [frontend-design](.skills/frontend-design/SKILL.md) - Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
- [modern-javascript-patterns](.skills/modern-javascript-patterns/SKILL.md) - Master ES6+ features including async/await, destructuring, spread operators, arrow functions, promises, modules, iterators, generators, and functional programming patterns for writing clean, efficient JavaScript code. Use when refactoring legacy code, implementing modern patterns, or optimizing JavaScript applications.
- [Writing Phaser 3 Games](.skills/phaser/SKILL.md) - Provides battle-tested patterns, best practices, and code examples for building Phaser 3 games. Use when writing game code, implementing game mechanics, setting up scenes, handling physics, animations, input, or any Phaser-related development. Covers architecture, performance, algorithms, and common pitfalls.
  </skills>

## Purpose

This document defines how **AI agents, contributors, and automated systems** should interact with the _Shaomeme Fighter_ codebase. Its goal is to ensure consistency, quality, and alignment with the project’s vision, mission, and architectural principles.

AGENTS.md is a **behavioral contract**: any human or AI agent contributing to this repository must follow these rules.

---

## Project Context

**Project Name:** Shaomeme Fighter
**Type:** Mobile-first web fighting game
**Core Technologies:** Phaser 3, Vite, TypeScript/JavaScript
**Target Platforms:** iOS (Safari), Android (Chrome), tablet-first (iPad priority)

### Vision

Create a fast, expressive, and nostalgic 2D fighting game inspired by arcade games, optimized for modern touch devices, and designed to be _fun first_, not button-heavy.

### Mission

- Deliver an arcade-quality fighting experience on mobile web
- Replace traditional on-screen buttons with intuitive, touch-driven mechanics
- Enable personalized content (“Memory Arenas”) that emotionally connects players to victories
- Maintain a clean, extensible architecture suitable for rapid iteration and AI-assisted development

All agents must prioritize **player feel**, **performance**, and **clarity of design decisions**.

---

## Agent Roles and Responsibilities

### 1. Architecture Agent

Responsible for:

- Overall project structure
- Scene lifecycle management in Phaser
- Game state separation (menu, combat, unlocks)
- Avoiding over-engineering

Constraints:

- Prefer simple, explicit patterns over abstractions
- No unnecessary frameworks (e.g., Three.js is explicitly out of scope)
- Mobile performance is non-negotiable

---

### 2. Gameplay Agent

Responsible for:

- Combat mechanics
- Input interpretation (touch gestures, zones, timing)
- Hit detection, frame data, and balance

Principles:

- Fun > realism
- Responsiveness > visual complexity
- Every mechanic must be testable on a touchscreen

Do **not**:

- Introduce small UI buttons unless explicitly required
- Assume keyboard or controller availability

---

### 3. UI / UX Agent

Responsible for:

- Menus, overlays, HUD
- Touch affordances and visual feedback
- Accessibility and readability

Guidelines:

- Thumb-first design
- Large hit areas, minimal clutter
- Visual feedback for _every_ interaction

---

### 4. Performance & Build Agent

Responsible for:

- Asset optimization
- Bundle size control
- Load times and runtime FPS

Rules:

- Mobile Safari is the lowest common denominator
- Measure before optimizing, but never ignore regressions
- Prefer spritesheets over large individual assets

---

### 5. Content & Progression Agent

Responsible for:

- Characters
- Arenas
- Unlock logic (Memory Arenas, rewards)

Constraints:

- Content must be data-driven
- No hardcoded unlock conditions
- Emotional payoff matters as much as difficulty

---

## Coding Standards

All agents must adhere to the following:

- Deterministic logic where possible
- Clear file and function naming
- One responsibility per module
- No commented-out dead code

### File Organization (Guideline)

```
src/
  core/        # Game engine glue, bootstrapping
  scenes/      # Phaser scenes (Menu, Fight, Results)
  systems/     # Combat, Input, AI, Physics abstractions
  ui/          # HUD and menus
  assets/      # Raw assets (processed via pipeline)
```

Agents may propose changes, but must justify them explicitly.

---

## AI-Specific Instructions

When an AI agent contributes:

- Assume **no hidden context** beyond repository files
- Never hallucinate undocumented systems
- If uncertain, leave TODO comments instead of guessing
- Respect existing patterns unless instructed otherwise

### Required Output Quality

AI-generated code must:

- Run without manual fixes
- Be readable by humans
- Include brief inline comments only where intent is non-obvious

---

## Decision-Making Rules

When trade-offs exist, prioritize in this order:

1. Player experience
2. Mobile performance
3. Simplicity of implementation
4. Extensibility
5. Visual polish

---

## What Not to Do

Agents must **not**:

- Introduce desktop-only assumptions
- Add libraries without clear justification
- Optimize prematurely at the cost of clarity
- Drift from the arcade fighting game core loop

---

## Alignment With DOCUMENTATION.md

AGENTS.md must always be read **together with** DOCUMENTATION.md.

If a conflict arises:

- DOCUMENTATION.md defines _what_ the project is
- AGENTS.md defines _how_ work is performed

Conflicts must be resolved explicitly and documented.

---

## Updating This File

This file is a living contract.

Any agent proposing changes must:

- Clearly state the reason
- Explain the impact on other agents
- Preserve the original vision and mission

---

## Final Principle

> _If a contribution does not make the game more fun, more playable, or more maintainable on mobile — it does not belong in this project._
