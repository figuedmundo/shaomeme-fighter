export default class CombatSystem {
    constructor() {
        // No state needed here really, it's mostly helper functions in the clone, 
        // but we might want to track cooldowns here if we move them out of the scene.
    }

    /**
     * Calculates damage dealt by attacker to defender.
     * Ported from temp_clone/src/javascript/components/fight.js
     */
    static getDamage(attacker, defender) {
        const blockPower = CombatSystem.getBlockPower(defender);
        const hitPower = CombatSystem.getHitPower(attacker);

        if (blockPower > hitPower) {
            return 0; // Blocked
        } else {
            return hitPower - blockPower;
        }
    }

    /**
     * Calculates hit power with critical chance.
     * Ported from temp_clone
     */
    static getHitPower(fighter) {
        const criticalHitChance = Math.random() + 1; // Random between 1 and 2
        return fighter.attack * criticalHitChance;
    }

    /**
     * Calculates block power with dodge chance.
     * Ported from temp_clone
     */
    static getBlockPower(fighter) {
        // If fighter is NOT blocking, defense is effectively 0 or base? 
        // In the clone, this function is called inside getDamage. 
        // BUT, in the clone's input handler:
        // if (blocking) -> damage = 0 (logic was: if blocking, you invoke getDamage? No, clone logic was:
        // if (attack && !block && enemy_block) -> 0 damage (perfect block logic in event listener)
        // if (attack && !block) -> getDamage(attacker, defender) (defender MIGHT auto-dodge/block via RNG)

        // This function simulates "Active Defense" stat contribution even if not holding block button?
        // OR does it imply that 'defense' stat is always active?
        // Let's stick to the clone's exact math:

        const dodgeChance = Math.random() + 1; // Random between 1 and 2
        return fighter.defense * dodgeChance;
    }
}
