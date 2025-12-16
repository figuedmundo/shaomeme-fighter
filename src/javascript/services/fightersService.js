import callApi from '../helpers/apiHelper';


/**
 * FighterService is a class for fetching fighter data from a specific endpoint.
 * It has two main methods: getFighters and getFighterDetails.
 */
class FighterService {
        /**
     * The endpoint where the fighter data is located.
     * @private
     */
    #endpoint = 'fighters.json';
/**
     * Fetches all fighters from the endpoint.
     * @async
     * @returns {Promise<Object>} The fighters data.
     * @throws {Error} If there is an error fetching the data.
     */
    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

/**
     * Fetches the details of a specific fighter by their ID.
     * @async
     * @param {string} id - The ID of the fighter.
     * @returns {Promise<Object>} The fighter's details.
     * @throws {Error} If there is an error fetching the data.
     */
    async getFighterDetails(id) {
        // todo: implement this method
        // endpoint - `details/fighter/${id}.json`;
        // let fighters = this.getFighters()
        try {
            const fighter = await callApi(`details/fighter/${id}.json`);
            return fighter;
        } catch (error) {
            console.error('Error fetching fighter details:', error);
            throw error; // Throw the error after logging it
        }
    
    }
}
/**
 * An instance of the FighterService class.
 * @type {FighterService}
 */
const fighterService = new FighterService();

export default fighterService;
