import createElement from '../helpers/domHelper';
/**
 * This function creates a DOM element that represents a preview of a fighter.
 * It creates a `div` element and appends several child elements to it, including an `img` element for the fighter's portrait,
 * and `p` elements for the fighter's name, health, attack, and defense.
 * If the position is 'right', an `audio` element is also appended to play a sound effect.
 *
 * @param {Object} fighter - The fighter object to create a preview for. It has the following structure: { _id, name, health, attack, defense}.
 * @param {string} position - The position of the fighter preview ('left' or 'right').
 * @returns {HTMLElement} The `div` element that represents the fighter preview.
 */
export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName} vs-preview`
    });

        // Create a new element for the fighter's portrait and set its source
        const imgElement = createElement({ tagName: 'img' });
        imgElement.src = `resources/${fighter._id}Portrait.png`;
        fighterElement.appendChild(imgElement);

        // Create a new element for the fighter's name and set its content
        const nameElement = createElement({ tagName: 'p', className: 'name-text' });
        nameElement.textContent = `${fighter.name}`;
        fighterElement.appendChild(nameElement);

        // Create a new element for the fighter's health and set its content
        const healthElement = createElement({ tagName: 'p' });
        healthElement.textContent = `Health: ${fighter.health}`;
        fighterElement.appendChild(healthElement);

        // Create a new element for the fighter's attack and set its content
        const attackElement = createElement({ tagName: 'p' });
        attackElement.textContent = `Attack: ${fighter.attack}`;
        fighterElement.appendChild(attackElement);

        // Create a new element for the fighter's defense and set its content
        const defenseElement = createElement({ tagName: 'p' });
        defenseElement.textContent = `Defense: ${fighter.defense}`;
        fighterElement.appendChild(defenseElement);
        
        // Append an audio element to play a sound effect if the position is 'right'. This is done so the background songdoesnt play twice.
        if (position === 'right') { 
            const audioElement = createElement({ tagName: 'audio' });
            audioElement.src = `resources/vs.mp3`;
            audioElement.autoplay = true;
             fighterElement.appendChild(audioElement);}

    return fighterElement;
}
/**
 * This function creates an `img` DOM element that represents a fighter's image.
 * It takes a `fighter` object as an argument, which should have `source` and `name` properties.
 * The `source` property is used as the `src` attribute of the `img` element, and the `name` property is used as the `title` and `alt` attributes.
 * The `img` element is given a class name of 'fighter-preview___img'.
 *
 * @param {Object} fighter - The fighter object to create an image for.
 * @returns {HTMLElement} The `img` element that represents the fighter's image.
 */
export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
