import createElement from '../helpers/domHelper';

export function createVictoryGallery(winnerName) {
    const overlay = createElement({ tagName: 'div', className: 'victory-overlay' });
    const title = createElement({ tagName: 'h1', className: 'victory-title' });
    title.innerText = `${winnerName} Wins!`;

    const subtitle = createElement({ tagName: 'p', className: 'victory-subtitle' });
    subtitle.innerText = "Loading memory...";

    const imageContainer = createElement({ tagName: 'div', className: 'victory-image-container' });
    const img = createElement({ tagName: 'img', className: 'victory-image' });
    imageContainer.append(img);

    const closeBtn = createElement({ tagName: 'button', className: 'victory-close' });
    closeBtn.innerText = "Play Again";
    closeBtn.onclick = () => window.location.reload();

    overlay.append(title, subtitle, imageContainer, closeBtn);

    // Fetch photo
    fetch('http://localhost:3000/api/photos')
        .then(res => res.json())
        .then(photos => {
            if (photos.length > 0) {
                const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
                img.src = `http://localhost:3000${randomPhoto}`;
                subtitle.innerText = "You remembered this place!";
            } else {
                subtitle.innerText = "No memories found.";
            }
        })
        .catch(err => {
            console.error(err);
            subtitle.innerText = "Could not load memories.";
        });

    return overlay;
}
