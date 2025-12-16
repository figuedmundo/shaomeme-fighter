import createElement from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';
import { fight } from './fight';
import { showWinnerModal } from './modal/winner';


/**
 * This function creates a `div` DOM element that represents a fighter in the arena.
 * It takes a `fighter` object and a `position` string as arguments.
 * The `fighter` object is used to create an `img` element for the fighter's image.
 * The `position` string determines the class name of the `div` element and with it its position in the screen.
 *
 * @param {Object} fighter - The fighter object to create an element for.
 * @param {string} position - The position of the fighter in the arena ('left' or 'right').
 * @returns {HTMLElement} The `div` element that represents the fighter in the arena.
 */
function createFighter(fighter, position) {
    const imgElement = createFighterImage(fighter);
    const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
    const fighterElement = createElement({
        tagName: 'div',
        className: `arena___fighter ${positionClassName}`
    });

    fighterElement.append(imgElement);
    return fighterElement;
}
/**
 * This function creates a `div` DOM element that represents the battlefield in the arena.
 * It takes two `fighter` objects as arguments, which represent the first and second fighters.
 * For each fighter, it calls the `createFighter` function to create a `div` element that represents the fighter.
 * The first fighter is positioned on the left and the second fighter is positioned on the right.
 * The fighter elements are then appended to the battlefield element.
 *
 * @param {Object} firstFighter - The first fighter object.
 * @param {Object} secondFighter - The second fighter object.
 * @returns {HTMLElement} The `div` element that represents the battlefield in the arena.
 */
function createFighters(firstFighter, secondFighter) {
    const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
    const firstFighterElement = createFighter(firstFighter, 'left');
    const secondFighterElement = createFighter(secondFighter, 'right');

    battleField.append(firstFighterElement, secondFighterElement);
    return battleField;
}

/**
 * This function creates a `div` DOM element that represents a fighter's health indicator in the arena.
 * It takes a `fighter` object and a `position` string as arguments.
 * The function creates several elements: a container for the indicator, a `span` for the fighter's name, a `div` for the indicator, and a `div` for the health bar.
 * The fighter's name, indicator, and health bar elements are then appended to the container element.
 *
 * @param {Object} fighter - The fighter object to create a health indicator for.
 * @param {string} position - The position of the fighter in the arena ('left' or 'right').
 * @returns {HTMLElement} The `div` element that represents the fighter's health indicator.
 */
function createHealthIndicator(fighter, position) {
    const { name } = fighter;
    const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
    const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
    const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
    const bar = createElement({
        tagName: 'div',
        className: 'arena___health-bar',
        attributes: { id: `${position}-fighter-indicator` }
    });

    fighterName.innerText = name;
    indicator.append(bar);
    container.append(fighterName, indicator);

    return container;
}

function createHealthIndicators(leftFighter, rightFighter) {
    const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
    const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
    const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
    const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

    healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
    return healthIndicators;
}


/**
 * This function creates a `div` DOM element that represents the health indicators of the fighters in the arena.
 * It takes two `fighter` objects as arguments, which represent the left and right fighters.
 * For each fighter, it calls the `createHealthIndicator` function to create a `div` element that represents the fighter's health indicator.
 * The function also creates a `div` element for the versus sign.
 * The health indicators and the versus sign are then appended to the main `div` element.
 *
 * @param {Object} leftFighter - The left fighter object.
 * @param {Object} rightFighter - The right fighter object.
 * @returns {HTMLElement} The `div` element that represents the health indicators of the fighters.
 */
function createArena(selectedFighters) {

    const arena = createElement({ tagName: 'div', className: 'arena___root' });
    const healthIndicators = createHealthIndicators(...selectedFighters);
    const fighters = createFighters(...selectedFighters);
    arena.append(healthIndicators, fighters);

    return arena;
}


/**
 * This function renders the arena for the selected fighters.
 * It takes an array of two `fighter` objects as an argument, which represent the first and second fighters.
 * The function first clears the root element, then creates the arena using the `createArena` function.
 * It also creates an `audio` element for the arena background sound and appends it to the arena.
 * The arena is then appended to the root element.
 * Finally, the function starts the fight between the two fighters using the `fight` function.
 * When the fight is over, it shows a modal with the winner using the `showWinnerModal` function.
 *
 * @param {Array} selectedFighters - An array of two fighter objects.
 */
export default function renderArena(selectedFighters) {
    const root = document.getElementById('root');
    const arena = createArena(selectedFighters);
    let firstFighter = selectedFighters[0];
    let secondFighter = selectedFighters[1];
    root.innerHTML = '';

    // Create an audio element for the arena background sound
    const audioElement = createElement({ tagName: 'audio' });
    audioElement.src = `resources/arena.mp3`;
    audioElement.autoplay = true;
    arena.appendChild(audioElement);

    root.append(arena);

    fight(firstFighter, secondFighter).then((winner) => {
        // showWinnerModal(winner);
        // Custom Victory Logic
        import('./VictoryGallery').then(({ createVictoryGallery }) => {
            const gallery = createVictoryGallery(winner.name);
            document.getElementById('root').append(gallery);
        });
    });

}

