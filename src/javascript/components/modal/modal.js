import createElement from '../../helpers/domHelper';


/**
 * This function retrieves the modal container element from the DOM.
 * It returns the element with the ID 'root', which is expected to be the container for modals.
 *
 * @returns {HTMLElement} The modal container element.
 */
function getModalContainer() {
    return document.getElementById('root');
}

/**
 * This function hides the currently displayed modal.
 * It retrieves the first element with the class name 'modal-layer' from the DOM and removes it.
 * If no such element exists, the function does nothing.
 */
function hideModal() {
    const modal = document.getElementsByClassName('modal-layer')[0];
    modal?.remove();
}


/**
 * This function creates a `div` DOM element that represents the header of a modal.
 * It takes a `title` string and an `onClose` function as arguments.
 * The `title` string is used as the inner text of a `span` element.
 * The `onClose` function is called when the close button of the modal is clicked.
 * The function creates several elements: a container for the header, a `span` for the title, and a `div` for the close button.
 * The title and close button elements are then appended to the header container.
 *
 * @param {string} title - The title of the modal.
 * @param {Function} onClose - The function to call when the modal is closed.
 * @returns {HTMLElement} The `div` element that represents the header of the modal.
 */
function createHeader(title, onClose) {
    const headerElement = createElement({ tagName: 'div', className: 'modal-header' });
    const titleElement = createElement({ tagName: 'span' });
    const closeButton = createElement({ tagName: 'div', className: 'close-btn' });

    titleElement.innerText = title;
    closeButton.innerText = '×';

    const close = () => {
        hideModal();
        onClose();
    };
    closeButton.addEventListener('click', close);
    headerElement.append(titleElement, closeButton);

    return headerElement;
}


/**
 * This function creates a `div` DOM element that represents a modal.
 * It takes an options object as an argument, which includes a `title` string, a `bodyElement` DOM element, and an `onClose` function.
 * The `title` string is used as the title of the modal.
 * The `bodyElement` DOM element is used as the body of the modal.
 * The `onClose` function is called when the close button of the modal is clicked.
 * The function creates several elements: a layer for the modal, a container for the modal, and a header for the modal.
 * The header and body elements are then appended to the modal container, and the modal container is appended to the layer.
 *
 * @param {Object} options - The options for the modal.
 * @param {string} options.title - The title of the modal.
 * @param {HTMLElement} options.bodyElement - The body of the modal.
 * @param {Function} options.onClose - The function to call when the modal is closed.
 * @returns {HTMLElement} The `div` element that represents the modal.
 */
function createModal({ title, bodyElement, onClose }) {
    const layer = createElement({ tagName: 'div', className: 'modal-layer' });
    const modalContainer = createElement({ tagName: 'div', className: 'modal-root' });
    const header = createHeader(title, onClose);

    modalContainer.append(header, bodyElement);
    layer.append(modalContainer);

    return layer;
}
/**
 * This function displays a modal with the specified title, body, and close handler.
 * It takes an options object as an argument, which includes a `title` string, a `bodyElement` DOM element, and an `onClose` function.
 * The `title` string is used as the title of the modal.
 * The `bodyElement` DOM element is used as the body of the modal.
 * The `onClose` function is called when the close button of the modal is clicked. If not provided, a no-op function is used by default.
 * The function first retrieves the modal container element from the DOM using the `getModalContainer` function.
 * It then creates the modal using the `createModal` function and appends it to the modal container.
 *
 * @param {Object} options - The options for the modal.
 * @param {string} options.title - The title of the modal.
 * @param {HTMLElement} options.bodyElement - The body of the modal.
 * @param {Function} [options.onClose] - The function to call when the modal is closed. Optional.
 */
export default function showModal({ title, bodyElement, onClose = () => {} }) {
    const root = getModalContainer();
    const modal = createModal({ title, bodyElement, onClose });
    root.append(modal);
}
