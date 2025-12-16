import createElement from '../helpers/domHelper';
import { createFightersSelector } from './fighterSelector';


/**
 * This function creates an image element for a fighter.
 * It takes one argument: a `fighter` object.
 * The `fighter` object is expected to have `source` and `name` properties.
 * The function creates an image element with the source set to the `source` property of the `fighter` object and the title and alt text set to the `name` property of the `fighter` object.
 * The created image element has a class name of 'fighter___fighter-image'.
 *
 * @param {Object} fighter - The fighter object.
 * @returns {HTMLElement} The created image element.
 */
function createImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter___fighter-image',
        attributes
    });

    return imgElement;
}


/**
 * This function creates a fighter element.
 * It takes two arguments: a `fighter` object and a `selectFighter` function.
 * The `fighter` object is expected to have `_id` property.
 * The function creates a div element with a class name of 'fighters___fighter' and an image element using the `createImage` function.
 * It then adds a click event listener to the div element that calls the `selectFighter` function with the event and the `_id` property of the `fighter` object.
 * The created div element is returned.
 *
 * @param {Object} fighter - The fighter object.
 * @param {Function} selectFighter - The function to be called when the fighter element is clicked.
 * @returns {HTMLElement} The created fighter element.
 */
function createFighter(fighter, selectFighter) {
    const fighterElement = createElement({ tagName: 'div', className: 'fighters___fighter' });
    const imageElement = createImage(fighter);
    const onClick = event => selectFighter(event, fighter._id);

    fighterElement.append(imageElement);
    fighterElement.addEventListener('click', onClick, false);

    return fighterElement;
}


/**
 * This function creates a container with the fighters and their previews.
 * It takes one argument: an array of `fighters`.
 * The function first creates a fighter selector using the `createFightersSelector` function.
 * It then creates a container, a preview container, and a fighters list.
 * For each fighter in the `fighters` array, it creates a fighter element using the `createFighter` function and the fighter selector.
 * The created fighter elements are appended to the fighters list.
 * The preview container and the fighters list are appended to the container.
 * The function returns the created container.
 *
 * @param {Array<Object>} fighters - An array of fighter objects.
 * @returns {HTMLElement} The created container with the fighters and their previews.
 */
export default function createFighters(fighters) {
    const selectFighter = createFightersSelector();
    const container = createElement({ tagName: 'div', className: 'fighters___root' });
    const preview = createElement({ tagName: 'div', className: 'preview-container___root' });
    const fightersList = createElement({ tagName: 'div', className: 'fighters___list' });
    const fighterElements = fighters.map(fighter => createFighter(fighter, selectFighter));

    fightersList.append(...fighterElements);
    container.append(preview, fightersList);

    return container;
}
