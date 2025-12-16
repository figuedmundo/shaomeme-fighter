import controls from '../../constants/controls';

/**
 * This function simulates a fight between two fighters.
 * It takes two arguments: two `fighter` objects.
 * The `fighter` objects are expected to have `attack`, `defense`, and `health` properties.
 * The function returns a Promise that resolves with the winner of the fight (the fighter who still has health left).
 * The fight is simulated by listening for keydown and keyup events.
 * The fighters can attack, block, and use a critical hit combination.
 * The damage dealt by an attack is calculated using the `getDamage` function.
 * The damage dealt by a critical hit combination is twice the attacker's attack power.
 * A fighter can only use their critical hit combination if they haven't used it in the last 10 seconds.
 *
 * @param {Object} firstFighter - The first fighter object.
 * @param {Object} secondFighter - The second fighter object.
 * @returns {Promise} A promise that resolves with the winner of the fight.
 */
export async function fight(firstFighter, secondFighter) {

    // Couldnt separate the fight function into smaller functions because of onHealthChange function defined inside the fight function
    return new Promise(resolve => {

        // set the last combo times to 10 seconds ago so the players can use their combos when the fight starts
        let lastcombo1 = Date.now() - 10000;
        let lastcombo2 = Date.now() - 10000;

        // create an object to store the key states
        let keyState = {};

        // Create a onHealthChange arrow to resolve the promise when one of the fighters health is less than or equal to 0
        var onHealthChange = () => {
            if (firstFighter.health <= 0) {
                resolve(secondFighter);
            } else if (secondFighter.health <= 0) {
                resolve(firstFighter);
            }
        };

        // Add event listeners for keydown and keyup events
        window.addEventListener('keydown', (event) => {
            keyState[event.code] = true;

            // Movement Logic (Player 1)
            const p1 = document.querySelector('.arena___left-fighter');
            if (p1) {
                const currentLeft = parseInt(p1.style.left || '10'); // Assume start at 10%? CSS classes usually handle this
                // Note: The clone uses flexbox or grid for positioning via CSS classes
                // We need to switch to absolute or relative positioning to move them

                // Let's hack it: changing transform
                // We need to store current position
                if (!p1.dataset.x) p1.dataset.x = 0;

                let x = parseInt(p1.dataset.x);

                if (keyState['ArrowLeft']) {
                    x -= 5;
                }
                if (keyState['ArrowRight']) {
                    x += 5;
                }

                p1.dataset.x = x;
                p1.style.transform = `translateX(${x}px)`;
            }

            // Check if the player 1 attacks the player 2 and the player 2 blocks it and plays the attack sound
            if (keyState[controls.PlayerOneAttack] && !keyState[controls.PlayerOneBlock] && keyState[controls.PlayerTwoBlock]) {
                attack_sound();
                console.log('player 1 attacks but player 2 blocks it');
            }
            // Check if the player 1 attacks the player 2 without blocking
            else if (keyState[controls.PlayerOneAttack] && !keyState[controls.PlayerOneBlock]) {
                let damage = getDamage(firstFighter, secondFighter);
                if (damage > 0) {
                    secondFighter.health -= damage;
                    // Check if any player health is less or equal to 0 to resolve the promise and change the health bar
                    onHealthChange();
                    changeHealthBar(secondFighter, 'right');
                }
                // play the attack sound
                attack_sound();
                console.log(`player 1 attacks dealing ${damage} damage to the enemy`);
            }
            // Check if the player 2 attacks the player 1 and the player 1 blocks it and plays the attack sound
            else if (keyState[controls.PlayerTwoAttack] && !keyState[controls.PlayerTwoBlock] && keyState[controls.PlayerOneBlock]) {
                attack_sound();
                console.log('player 2 attacks but player 1 blocks it');
            }
            // Check if the player 2 attacks the player 1 without blocking
            else if (keyState[controls.PlayerTwoAttack] && !keyState[controls.PlayerTwoBlock]) {
                let damage = getDamage(secondFighter, firstFighter);
                if (damage > 0) {
                    firstFighter.health -= damage;
                    // Check if any player health is less or equal to 0 to resolve the promise
                    onHealthChange();
                    changeHealthBar(firstFighter, 'left');
                }
                // play the attack sound
                attack_sound();
                console.log(`player 2 attacks dealing ${damage} damage to the enemy`);
            }
            // Check if the player 1 uses the critical hit combination and is not blocking
            else if (controls.PlayerOneCriticalHitCombination.every(key => keyState[key]) && !keyState[controls.PlayerOneBlock]) {
                // Check if player one has used the combo in the last 10 seconds
                if (Date.now() - lastcombo1 > 10000) {
                    // Calculate the damage dealt by the combo and reduce the health of the second player
                    let damage = 2 * firstFighter.attack;
                    secondFighter.health -= damage;
                    // Check if any player health is less or equal to 0 to resolve the promise and change the health bar
                    onHealthChange();
                    changeHealthBar(secondFighter, 'right');
                    // play the combo sound
                    combo_sound()
                    console.log(`Player 1 critical hit combination is pressed dealing 2x =${damage}  damage to the enemy`);
                    // set the last combo time to the current time so the player can't use the combo again for 10 seconds
                    lastcombo1 = Date.now();
                }
                else {
                    console.log("You can't use critical hit combination yet");
                }
            }
            // Check if the player 2 uses the critical hit combination and is not blocking
            else if (controls.PlayerTwoCriticalHitCombination.every(key => keyState[key]) && !keyState[controls.PlayerTwoBlock]) {
                // Check if player two has used the combo in the last 10 seconds
                if (Date.now() - lastcombo2 > 10000) {
                    // Calculate the damage dealt by the combo and reduce the health of the first player
                    let damage = 2 * secondFighter.attack;
                    firstFighter.health -= damage;
                    // Check if any player health is less or equal to 0 to resolve the promise and change the health bar
                    onHealthChange();
                    changeHealthBar(firstFighter, 'left');
                    // play the combo sound
                    combo_sound()
                    console.log(`Player 2 critical hit combination is pressed dealing 2x =${damage}  damage to the enemy`);
                    // set the last combo time to the current time so the player can't use the combo again for 10 seconds
                    lastcombo2 = Date.now();
                }
                else {
                    console.log("You can't use critical hit combination yet");
                }

            }

        });
        // Add event listener for keyup event to delete the key from the keyState object    
        window.addEventListener('keyup', (event) => {
            delete keyState[event.code];
        });
    });
}

/**
 * This function calculates and returns the damage dealt by an attacker to a defender.
 * It takes two arguments: an `attacker` fighter object and a `defender` fighter object.
 * Both objects are expected to have `attack` and `defense` properties.
 * The function first calculates the block power of the defender and the hit power of the attacker using the `getBlockPower` and `getHitPower` functions respectively.
 * If the block power is greater than the hit power, the function returns 0, indicating that the attack was completely blocked.
 * Otherwise, it returns the difference between the hit power and the block power, representing the damage dealt to the defender.
 *
 * @param {Object} attacker - The attacker object.
 * @param {Object} defender - The defender object.
 * @returns {number} The damage dealt by the attacker to the defender.
 */
export function getDamage(attacker, defender) {
    let blockpower = getBlockPower(defender);
    let hitpower = getHitPower(attacker);
    if (blockpower > hitpower) {
        return 0;
    }
    else {
        return hitpower - blockpower;
    }
}


/**
 * This function calculates and returns the hit power of a fighter.
 * It takes a `fighter` object as an argument.
 * The `fighter` object is expected to have an `attack` property that represents the fighter's attack power.
 * The function first generates a random number between 1 and 2 (inclusive) to simulate the chance of a critical hit this is the critical hit chance.
 * It then multiplies the fighter's attack power by this number to get the hit power.
 *
 * @param {Object} fighter - The fighter object.
 * @returns {number} The hit power of the fighter.
 */
export function getHitPower(fighter) {
    let criticalHitChance = Math.random() + 1;
    let hitpower = fighter.attack * criticalHitChance;
    return hitpower;
}

/**
 * This function calculates and returns the block power of a fighter.
 * It takes a `fighter` object as an argument.
 * The `fighter` object is expected to have a `defense` property that represents the fighter's defense power.
 * The function first generates a random number between 1 and 2 (inclusive) this is the dodge chance.
 * It then multiplies the fighter's defense power by this number to get the block power.
 *
 * @param {Object} fighter - The fighter object.
 * @returns {number} The block power of the fighter.
 */
export function getBlockPower(fighter) {
    let dodgeChance = Math.random() + 1;
    let blockpower = fighter.defense * dodgeChance;
    return blockpower;
}

/**
 * This function plays a random attack sound effect to be played when a character attacks.
 * It first generates a random number between 1 and 4.
 * It then creates a new `Audio` object with the source set to a random 'attack' sound file based on the generated number.
 * The volume of the audio is set to 1.0, which represents the maximum volume.
 * The audio is then played immediately.
 */
function attack_sound() {
    var num = Math.floor(Math.random() * 4) + 1;
    var audio = new Audio(`resources/attack${num}.mp3`);
    audio.volume = 1.0;
    audio.play();
}

/**
 * This function plays a combo sound effect to be played when a character does its combo attack.
 * It creates a new `Audio` object with the source set to 'resources/attack5.mp3'.
 * The volume of the audio is set to 1.0, which represents the maximum volume.
 * The audio is then played immediately.
 */
function combo_sound() {
    var audio = new Audio(`resources/attack5.mp3`);
    audio.volume = 1.0;
    audio.play();
}


/**
 * This function changes the width of a fighter's health bar according to the fighter's current health.
 * It takes a `fighter` object and a `position` string as arguments.
 * The `fighter` object is expected to have a `health` property that represents the fighter's current health as a percentage.
 * The `position` string is used as part of the ID of the health bar element.
 * The function retrieves the health bar element from the DOM and changes its width to match the fighter's current health.
 *
 * @param {Object} fighter - The fighter object.
 * @param {string} position - The position of the fighter in the arena ('left' or 'right').
 */
function changeHealthBar(fighter, position) {
    const healthBar = document.getElementById(`${position}-fighter-indicator`);
    healthBar.style.width = `${fighter.health}%`;
}