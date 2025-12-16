import createElement from '../helpers/domHelper';

export function createMobileControls() {
    const container = createElement({ tagName: 'div', attributes: { id: 'mobile-controls' } });
    const leftZone = createElement({ tagName: 'div', className: 'control-zone', attributes: { id: 'left-zone' } });
    const rightZone = createElement({ tagName: 'div', className: 'control-zone', attributes: { id: 'right-zone' } });

    // Left Zone: Movement
    let touchStartX = 0;

    leftZone.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    leftZone.addEventListener('touchmove', (e) => {
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - touchStartX;

        // Threshold for movement
        if (deltaX < -10) {
            dispatchKey('ArrowLeft', 'keydown');
        } else if (deltaX > 10) {
            dispatchKey('ArrowRight', 'keydown');
        }
    });

    leftZone.addEventListener('touchend', () => {
        dispatchKey('ArrowLeft', 'keyup');
        dispatchKey('ArrowRight', 'keyup');
    });

    // Right Zone: Attack
    rightZone.addEventListener('touchstart', (e) => {
        // Simple tap: Attack (KeyA for Player 1)
        // TODO: Detect Double Tap / Long Press
        dispatchKey('KeyA', 'keydown');
        setTimeout(() => dispatchKey('KeyA', 'keyup'), 100);
    });

    container.append(leftZone, rightZone);
    return container;
}

function dispatchKey(code, type) {
    const event = new KeyboardEvent(type, { code: code });
    window.dispatchEvent(event);
}
