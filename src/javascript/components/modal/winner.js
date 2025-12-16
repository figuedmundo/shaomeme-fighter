import showModal from './modal';
import createElement from '../../helpers/domHelper';


/**
 * This function is used to display a modal with the winner's details.
 * It calls the `showModal` function with a configuration object.
 * The configuration object has a `title` and a `bodyElement`.
 * The `title` is a string that displays the winner's name followed by 'wins!'.
 * The `bodyElement` is a DOM element created by the `createWinnerModalBody` function.
 *
 * @param {Object} fighter - The fighter object representing the winner.
 * @param {string} fighter.name - The name of the fighter.
 * @param {number} fighter._id - The ID of the fighter.
 */

export function showWinnerModal(fighter) {
    // call showModal function
    showModal({
        title: `${fighter.name} wins!`,
        bodyElement: createWinnerModalBody(fighter)
    });
}
/**
 * This function creates a DOM element that represents the body of the winner modal.
 * It creates a `div` element and appends an `img` and an `audio` element to it.
 * The `img` element displays the portrait of the winner, and the `audio` element plays a sound effect when the fight is over.
 *
 * @param {Object} fighter - The fighter object representing the winner.
 * @returns {HTMLElement} The `div` element that represents the body of the winner modal.
 */
function createWinnerModalBody(fighter)
{   
    const winnerElement = createElement({ tagName: 'div' });

    const imgElement = createElement({ tagName: 'img' });
    imgElement.src = `resources/${fighter._id}Portrait.png`;
    winnerElement.appendChild(imgElement);

    const audioElement = createElement({ tagName: 'audio' });
    audioElement.src = `resources/KO.mp3`;
    audioElement.autoplay = true;
    winnerElement.appendChild(audioElement);

    return winnerElement;
}