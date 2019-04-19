/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Create IDB
   *
   * @static
   * @param {*} dbPromise
   * @returns
   * @memberof DBHelper
   */

  static createIDB(dbPromise) {
    var dbPromise = idb.open('restaurant', 1, function(upgradeDb) {
      var store = upgradeDb.createObjectStore('restaurants', {
        keyPath: 'id'
      });
      store.createIndex('name', 'name');
    });
    return dbPromise;
  }


  /**
   * Put the fetched data into IDB
   *
   * @static
   * @param {*} restaurants
   * @returns
   * @memberof DBHelper
   */

  static populateIDB() {
    return DBHelper.fetchRestaurantsFromServer()
      .then((restaurants) => {
        // put the data into db
        DBHelper.createIDB()
          .then(function(db) {
            var tx = db.transaction('restaurants', 'readwrite');
            var restaurantStore = tx.objectStore('restaurants');
            restaurants.forEach(function(restaurant) {
              restaurantStore.put(restaurant);
            });
            return tx.complete;
          });
      });
  }

  /**
   * Get the data from the DB
   *
   * @static
   * @returns
   * @memberof DBHelper
   */

  static fetchRestaurantsFromIDB() {
    return DBHelper.createIDB()
      .then((db) => {
        const tx = db.transaction('restaurants', 'readonly');
        const store = tx.objectStore('restaurants');
        return store.getAll();
      });
  }

  /**
   * Fetch all restaurants from server
   * http://localhost:1337/restaurants
   */

  static fetchRestaurantsFromServer() {
    return fetch('http://localhost:1337/restaurants')
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        // console.log("fetching");
        // Read the response as json.
        return response.json();
      })
      .catch(function(error) {
        console.log('Looks like there was a problem: \n', error);
        return error;
      });
  }


  /**
   * Fetch restaurants either from db or from the network
   * The function guarantees that the db is always filled.
   * @static
   * @returns response
   * @memberof DBHelper
   */

  static fetchRestaurants() {
    return DBHelper.fetchRestaurantsFromIDB()
      .then((response) => {
        if (response == '') {
          // console.log("empty");
          // if the storage is empty, fetch from the server und populate the db
          return DBHelper.fetchRestaurantsFromServer()
            .then((data) => {
              DBHelper.populateIDB(data);
              // console.log("filled");
              return data;
            });
        } else {
          return response;
        }

      });
  }

  /**
   * Fetch a restaurant by its ID.
   * http://localhost:1337/restaurants/{3}
   */

  static fetchRestaurantById(id) {
    // fetch all restaurants.
    return DBHelper.fetchRestaurants()
      .then(restaurants => {
        const restaurant = restaurants.find(r => r.id == id);
        return restaurant;
      });
  }


  /**
   * Fetch restaurants by a cuisine type.
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
   * Fetch restaurants by a neighborhood.
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
   * Fetch restaurants by a cuisine and a neighborhood.
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
   * Fetch all neighborhoods.
   */
  static fetchNeighborhoods() {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
      .then((restaurants) => {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        return uniqueNeighborhoods;

      });
  }

  /**
   * Fetch all cuisines.
   */
  static fetchCuisines() {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
      .then((restaurants) => {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
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
    var screenWidth = window.innerWidth;
    if (screenWidth < 400) {
      // Load mobile image
      return (`./img/${restaurant.photograph}_small.jpg`);
    } else {
       // Load desktop image
      return (`./img/${restaurant.photograph}.jpg`);
    }
  }

  /**
   * ALT Description for URL.
   */
  static imageAltForRestaurant(restaurant) {
    return (`Photo of ${restaurant.name} Restaurant`);
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
    });
    marker.addTo(newMap);
    return marker;
  }



  // Reviews

    /**
   * Fetch all reviews from server
   * http://localhost:1337/reviews
   */

  static fetchReviewsFromServer() {

    return fetch('http://localhost:1337/reviews')
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        // console.log("fetching");
        // Read the response as json.
        return response.json();
      })
      .catch(function(error) {
        console.log('Looks like there was a problem: \n', error);

        return error;
      });
  }


    /**
   * Fetch a review by its ID.
   * http://localhost:1337/restaurants/{3}
   */

  static fetchReviewsById(id) {
    // fetch all reviews for current restaurant.
    return DBHelper.fetchReviewsFromServer()
      .then(reviews => {
        const review = reviews.filter(r => r.restaurant_id == id);

        return review;
      });
  }
}