/**
 * Common database helper functions.
 */
class DBHelper {

    /**
     * Fetch all restaurants.
     * http://localhost:1337/restaurants
     */
    static fetchRestaurants() {
        return fetch(`http://localhost:1337/restaurants`)
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                // Read the response as json.
                return response.json();
            })
            .catch(function (error) {
                console.log('Looks like there was a problem: \n', error);
                return error;
            });
    }


    /**
     * Fetch a restaurant by its ID.
     * http://localhost:1337/restaurants/{3}
     */
    // THIS ONE WORKS
    static fetchRestaurantById(id) {
        // fetch all restaurants with proper error handling.
        return DBHelper.fetchRestaurants()
            .then(restaurants => {
                const restaurant = restaurants.find(r => r.id == id);
              return restaurant;
            });
    }


    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine) {
        // Fetch all restaurants  with proper error handling
        return DBHelper.fetchRestaurants()
            .then((restaurants) => {
                const cuisine = restaurants.map((v, i) => restaurants[i].cuisine_type);
                // Filter restaurants to have only given cuisine type
                const results = cuisine.filter(r => r.cuisine_type == cuisine);
                return results;

            });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood) {
        // Fetch all restaurants
        return DBHelper.fetchRestaurants()
            .then((restaurants) => {
                // Filter restaurants to have only given neighborhood
                const neighborhood = restaurants.map((v, i) => restaurants[i].neighborhood);
                const results = neighborhood.filter(r => r.neighborhood == neighborhood);
                return results;

            });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
        // Fetch all restaurants
        return DBHelper.fetchRestaurants(restaurants)
            .then((restaurants) => {
                let results = restaurants;
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                    console.log(results);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                    console.log(neighborhood);
                }
                return results;
            });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods() {
        // Fetch all restaurants
        return DBHelper.fetchRestaurants()
            .then((restaurants) => {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
                return uniqueNeighborhoods;

            });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines() {
        // Fetch all restaurants
        return DBHelper.fetchRestaurants()
            .then((restaurants) => {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
                return uniqueCuisines;

            });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        return (`./img/${restaurant.photograph}`);
    }
    /**
     * Restaurant SMALL image URL.
     */
    static smallImageUrlForRestaurant(restaurant) {
        return (`./img/${restaurant.photographSmall} 1x, /img/${restaurant.photograph} 2x`);
    }

    /**
     * ALT Description for URL.
     */
    static imageAltForRestaurant(restaurant) {
        return (`${restaurant.alt}`);
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        // https://leafletjs.com/reference-1.3.0.html#marker
        const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], {
            title: restaurant.name,
            alt: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant)
        })
        marker.addTo(newMap);
        return marker;
    }

}