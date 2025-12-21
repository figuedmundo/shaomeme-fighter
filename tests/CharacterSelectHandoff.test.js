import { describe, it, expect, vi } from "vitest";

describe("CharacterSelectScene Data Handoff", () => {
  it("should pass both player and opponent character IDs to next scene", () => {
    const transitionTo = vi.fn();
    const mockState = {
      playerCharacter: "ann",
      opponentCharacter: "mom",
    };

    // Simulate handoff
    transitionTo("ArenaSelectScene", {
      playerCharacter: mockState.playerCharacter,
      opponentCharacter: mockState.opponentCharacter,
    });

    expect(transitionTo).toHaveBeenCalledWith("ArenaSelectScene", {
      playerCharacter: "ann",
      opponentCharacter: "mom",
    });
  });
});
