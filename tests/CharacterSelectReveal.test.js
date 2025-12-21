import { describe, it, expect } from "vitest";

// Mock roster for testing
const mockRoster = [
  { id: "ann", displayName: "Ann" },
  { id: "mom", displayName: "Mom" },
  { id: "dad", displayName: "Dad" },
];

// Mock the scene class logic
class MockCharacterSelectScene {
  constructor() {
    this.selectedCharacterIndex = 0;
    this.opponentCharacter = null;
  }

  confirmSelection(roster) {
    const p1Char = roster[this.selectedCharacterIndex].id;

    // Filter out player choice
    const availableOpponents = roster.filter((c) => c.id !== p1Char);

    // Pick random
    const randomIndex = Math.floor(Math.random() * availableOpponents.length);
    this.opponentCharacter = availableOpponents[randomIndex].id;

    return { p1: p1Char, opponent: this.opponentCharacter };
  }
}

describe("CharacterSelectScene Reveal Logic", () => {
  it("should pick a random opponent that is NOT the player character", () => {
    const scene = new MockCharacterSelectScene();
    scene.selectedCharacterIndex = 0; // Ann

    const result = scene.confirmSelection(mockRoster);

    expect(result.p1).toBe("ann");
    expect(result.opponent).not.toBe("ann");
    expect(["mom", "dad"]).toContain(result.opponent);
  });

  it("should store the opponent character in the scene state", () => {
    const scene = new MockCharacterSelectScene();
    scene.confirmSelection(mockRoster);
    expect(scene.opponentCharacter).not.toBeNull();
  });
});
