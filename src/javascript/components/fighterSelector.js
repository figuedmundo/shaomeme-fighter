import createElement from '../helpers/domHelper';
import renderArena from './arena';
import versusImg from '../../../resources/versus.png';
import { createFighterPreview } from './fighterPreview';
import callApi from '../helpers/apiHelper'; 



const fighterDetailsMap = new Map();


/**
 * This asynchronous function retrieves the details of a fighter by their ID.
 * It takes one argument: a `fighterId`.
 * The function first checks if the details of the fighter with the given ID are already stored in `fighterDetailsMap`.
 * If the details are not stored, it calls the `callApi` function with the URL of the fighter's details and stores the returned details in `fighterDetailsMap`.
 * The function then logs the details of the fighter and returns them.
 *
 * @param {string} fighterId - The ID of the fighter.
 * @returns {Promise<Object>} A promise that resolves with the details of the fighter.
 */
export async function getFighterInfo(fighterId) {
    if (!fighterDetailsMap.has(fighterId)) {
        const fighter = await callApi(`details/fighter/${fighterId}.json`);
        fighterDetailsMap.set(fighterId, fighter);
    }
    console.log(fighterDetailsMap.get(fighterId));
    return fighterDetailsMap.get(fighterId);
}


/**
 * This function starts a fight between the selected fighters.
 * It takes one argument: an array of `selectedFighters`.
 * The `selectedFighters` array is expected to contain two fighter objects.
 * The function calls the `renderArena` function with the `selectedFighters` array to render the arena for the fight.
 *
 * @param {Array<Object>} selectedFighters - An array of the selected fighters.
 */
function startFight(selectedFighters) {
    renderArena(selectedFighters);
}

/**
 * This function creates a versus block for the selected fighters.
 * It takes one argument: an array of `selectedFighters`.
 * The `selectedFighters` array is expected to contain two fighter objects.
 * The function creates a container with an image and a fight button.
 * If two fighters are selected, the fight button is enabled and starts the fight when clicked.
 * If less than two fighters are selected, the fight button is disabled.
 *
 * @param {Array<Object>} selectedFighters - An array of the selected fighters.
 * @returns {HTMLElement} The created versus block.
 */
function createVersusBlock(selectedFighters) {
    const canStartFight = selectedFighters.filter(Boolean).length === 2;
    const onClick = () => startFight(selectedFighters);
    const container = createElement({ tagName: 'div', className: 'preview-container___versus-block' });
    const image = createElement({
        tagName: 'img',
        className: 'preview-container___versus-img',
        attributes: { src: versusImg }
    });
    const disabledBtn = canStartFight ? '' : 'disabled';
    const fightBtn = createElement({
        tagName: 'button',
        className: `preview-container___fight-btn ${disabledBtn}`
    });

    fightBtn.addEventListener('click', onClick, false);
    fightBtn.innerText = 'Fight';
    container.append(image, fightBtn);

    return container;
}


/**
 * This function renders the selected fighters in the preview container.
 * It takes one argument: an array of `selectedFighters`.
 * The `selectedFighters` array is expected to contain two fighter objects.
 * The function creates a preview for each fighter using the `createFighterPreview` function and a versus block using the `createVersusBlock` function.
 * It then clears the preview container and appends the created previews and versus block to it.
 *
 * @param {Array<Object>} selectedFighters - An array of the selected fighters.
 */
function renderSelectedFighters(selectedFighters) {
    const fightersPreview = document.querySelector('.preview-container___root');
    const [playerOne, playerTwo] = selectedFighters;
    const firstPreview = createFighterPreview(playerOne, 'left');
    const secondPreview = createFighterPreview(playerTwo, 'right');
    const versusBlock = createVersusBlock(selectedFighters);

    fightersPreview.innerHTML = '';
    fightersPreview.append(firstPreview, versusBlock, secondPreview);
}


/**
 * This function creates a fighter selector.
 * It initializes an empty array of `selectedFighters`.
 * The function returns an async function that takes an `event` and a `fighterId`.
 * When the returned function is called, it retrieves the details of the fighter with the given `fighterId` using the `getFighterInfo` function.
 * It then updates the `selectedFighters` array with the retrieved fighter details.
 * If there's already a fighter in the `selectedFighters` array, the new fighter is added as the second fighter.
 * After updating the `selectedFighters` array, the function calls the `renderSelectedFighters` function with the `selectedFighters` array to render the selected fighters.
 *
 * @returns {Function} The created fighter selector function.
 */
export function createFightersSelector() {
    let selectedFighters = [];

    return async (event, fighterId) => {
        const fighter = await getFighterInfo(fighterId);
        const [playerOne, playerTwo] = selectedFighters;
        const firstFighter = playerOne ?? fighter;
        const secondFighter = playerOne ? playerTwo ?? fighter : playerTwo;
        selectedFighters = [firstFighter, secondFighter];

        renderSelectedFighters(selectedFighters);
    };
}
