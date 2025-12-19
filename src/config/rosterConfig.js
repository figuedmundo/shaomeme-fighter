import ConfigManager from "./ConfigManager";

const rosterConfig = ConfigManager.getRoster();

export const getCharacterDisplayName = (id) => {
  return ConfigManager.getCharacterDisplayName(id);
};

export default rosterConfig;
