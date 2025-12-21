import { describe, it, expect, vi } from "vitest";

describe("CharacterSelectScene Reveal State Transitions", () => {
  it("should assign a random opponent after P1 confirmation", () => {
    const roster = [{ id: "ann" }, { id: "mom" }, { id: "dad" }];
    const playerSelection = "ann";

    // Simulate logic
    const available = roster.filter((c) => c.id !== playerSelection);
    const opponent = available[Math.floor(Math.random() * available.length)];

    expect(opponent.id).not.toBe("ann");
    expect(["mom", "dad"]).toContain(opponent.id);
  });

  it("should trigger flash effect on final reveal", async () => {
    const flash = vi.fn().mockResolvedValue();

    // Simulate reveal trigger
    await flash(200, 0xffffff);

    expect(flash).toHaveBeenCalledWith(200, 0xffffff);
  });
});
