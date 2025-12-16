const API_URL = 'http://localhost:3000/api/photos'; // Make this configurable in prod

export const getPhotosForCity = async (cityName) => {
    try {
        const response = await fetch(`${API_URL}?city=${encodeURIComponent(cityName)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch photos');
        }
        const data = await response.json();
        return data; // Array of image URLs
    } catch (error) {
        console.error('Photo Service Error:', error);
        return [];
    }
};
