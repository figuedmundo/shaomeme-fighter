import ConfigManager from "./ConfigManager";

const combatConfig = ConfigManager.getCombatConfig();

export const DAMAGE_VALUES = combatConfig.damage;
export const ATTACK_RANGE = combatConfig.attackRange;
export const MATCH_SETTINGS = combatConfig.match;
export const COMBO_THRESHOLDS = combatConfig.combo.thresholds;
export const COMBO_VOICE_LINES = combatConfig.combo.voiceLines;
