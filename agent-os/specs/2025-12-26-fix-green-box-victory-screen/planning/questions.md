Based on your description of the green box issue on the victory screen, I have some clarifying questions to help me identify the cause:

1. I assume this green box might be a debug rendering (like a hitbox or camera bound) that was accidentally left enabled. Is the box a solid green rectangle, or is it a green outline (stroke)?
2. I'm thinking it could also be a placeholder for a missing asset. Does the box cover the entire screen, or just a specific area (like where a portrait or text should be)?
3. Does this happen immediately when "Name Wins" appears, or does it appear during the transition to the photo slideshow?
4. I assume you want me to investigate the code for any debug flags or missing assets. Should I also implement a logging mechanism to track the state of the Victory scene when this happens?
5. Does the box persist through the slideshow, or does it disappear?

**Existing Code Reuse:**
Are there existing features in your codebase with similar patterns we should reference? For example:

- Any recent changes to `VictoryScene.js` or `VictorySlideshow.js`?
- Any debug flags you recently toggled in `config.js` or `gameData.json`?

Please provide file/folder paths or names of these features if they exist.

**Visual Assets Request:**
Do you have any design mockups, wireframes, or screenshots that could help guide the development?

If yes, please place them in: `agent-os/specs/2025-12-26-fix-green-box-victory-screen/planning/visuals/`

Use descriptive file names like:

- green-box-screenshot.png
- victory-screen-glitch.jpg

Please answer the questions above and let me know if you've added any visual files or can point to similar existing features.
