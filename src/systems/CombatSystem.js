export default class CombatSystem {
  // No state needed here really, it's mostly helper functions in the clone,
  // but we might want to store some state later. For now, static methods?
  // Or just keep it as a class if we plan to instantiate it per fight.

  static getDamage(attacker, defender) {
    const blockPower = CombatSystem.getBlockPower(defender);
    const hitPower = CombatSystem.getHitPower(attacker);

    if (blockPower > hitPower) {
      return 0;
    }
    return hitPower - blockPower;
  }

  static getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;
    const hitPower = fighter.attack * criticalHitChance;
    return hitPower;
  }

  static getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    const blockPower = fighter.defense * dodgeChance;
    return blockPower;
  }

  // If fighter is NOT blocking, defense is effectively 0 or base?
  // In the clone, this function is called inside getDamage.
  // We will likely reimplement this logic in the FightScene using Phaser Arcade Physics events.
}
