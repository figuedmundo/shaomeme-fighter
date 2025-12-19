const rosterConfig = [
  {
    id: "ann",
    displayName: "Ann",
    portraitPath: "assets/fighters/ann/portrait.png",
    iconPath: "assets/fighters/ann/icon.png",
  },
  {
    id: "mom",
    displayName: "Mom",
    portraitPath: "assets/fighters/mom/portrait.png",
    iconPath: "assets/fighters/mom/icon.png",
  },
  {
    id: "dad",
    displayName: "Dad",
    portraitPath: "assets/fighters/dad/portrait.png",
    iconPath: "assets/fighters/dad/icon.png",
  },
  {
    id: "brother",
    displayName: "Brother",
    portraitPath: "assets/fighters/brother/portrait.png",
    iconPath: "assets/fighters/brother/icon.png",
  },
  {
    id: "old_witch",
    displayName: "Old Witch",
    portraitPath: "assets/fighters/old_witch/portrait.png",
    iconPath: "assets/fighters/old_witch/icon.png",
  },
  {
    id: "fat",
    displayName: "Fat",
    portraitPath: "assets/fighters/fat/portrait.png",
    iconPath: "assets/fighters/fat/icon.png",
  },
  {
    id: "fresway_worker",
    displayName: "Fresway Worker",
    portraitPath: "assets/fighters/fresway_worker/portrait.png",
    iconPath: "assets/fighters/fresway_worker/icon.png",
  },
  {
    id: "ryu",
    displayName: "Ryu",
    portraitPath: "assets/fighters/ryu/portrait.png",
    iconPath: "assets/fighters/ryu/icon.png",
    hidden: true // Mark as hidden if they shouldn't appear in select screen
  },
  {
    id: "ken",
    displayName: "Ken",
    portraitPath: "assets/fighters/ken/portrait.png",
    iconPath: "assets/fighters/ken/icon.png",
    hidden: true
  }
];

export const getCharacterDisplayName = (id) => {
  const char = rosterConfig.find(c => c.id === id);
  return char ? char.displayName : id.toUpperCase();
};

export default rosterConfig;