/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Create IDB Restaurants
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
      store.createIndex('is_favorite', 'is_favorite');
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
           console.log("empty");
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
          //console.log(results);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
          //console.log(neighborhood);
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
   * Fetch reviews either from db or from the network
   * The function guarantees that the db is always filled.
   * @static
   * @returns response
   * @memberof DBHelper
   */

  static fetchReviews(id) {
    return DBHelper.fetchReviewsFromIDB(id)
      .then((response) => {
        if (response == '') {
          //console.log("empty");
          // if the storage is empty, fetch from the server und populate the db
          DBHelper.populateIDB(id);
          return DBHelper.fetchReviewsById(id);
        } else {
          return response;
        }
      });
  }


  /**
   * Get the data from the DB
   *
   * @static
   * @returns
   * @memberof DBHelper
   */

  static fetchReviewsFromIDB(id) {
    return DBHelper.createIDBReviews()
      .then((db) => {
        const tx = db.transaction('reviews', 'readonly');
        const store = tx.objectStore('reviews');
        const index = store.index('restaurant_id');

        return index.getAll(id);
      });
  }

  /**
   * Fetch a review by its ID.
   */

  static fetchReviewsById(id) {

    return fetch(`http://localhost:1337/reviews/?restaurant_id=${id}`)
      .then(function(response) {

        return response.json();
      });
  }

  /**
   * Put the fetched data into IDB
   *
   * @static
   * @param {*} restaurants
   * @returns
   * @memberof DBHelper
   */

  static populateIDB(id) {
    return DBHelper.fetchReviewsById(id)
    .then((reviews) => {
      // put the data into db
      DBHelper.createIDBReviews(id)
        .then(function(db) {
          var tx = db.transaction('reviews', 'readwrite');
          var reviewStore = tx.objectStore('reviews');
          reviews.forEach(function(review) {
            reviewStore.put(review);
          });

          return tx.complete;
        });
      });
  }

  /**
   * Create IDB Reviews
   *
   * @static
   * @param {*} dbPromiseReview
   * @returns
   * @memberof DBHelper
   */

  static createIDBReviews(dbPromiseReview) {
    var dbPromiseReview = idb.open('review', 1, function(upgradeDb) {
      var storeReview = upgradeDb.createObjectStore('reviews', {
        keyPath: 'id'
      });
      storeReview.createIndex('restaurant_id', 'restaurant_id');
    });
    return dbPromiseReview;
  }

  /**
   * Post new review
   *
   * @static
   * @param {*} reviewObj
   * @returns
   * @memberof DBHelper
   */
  static postReview(reviewObj) {
    event.preventDefault();

    let offlineObj = {
      name: 'postReview',
      data: reviewObj,
      object_type: 'review'
    };

    if (!navigator.onLine) {
      DBHelper.sendDataOnline(offlineObj);
      return;
    }

    location.reload();

    return fetch('http://localhost:1337/reviews/', {
        method: 'post',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify(reviewObj)
      })
      .then((res) => res.json())
      .then((review) => {
        // put the data into db
        DBHelper.createIDBReviews()
          .then(function(db) {
            var tx = db.transaction('reviews', 'readwrite');
            var reviewStore = tx.objectStore('reviews');
            reviewStore.add(review);

            return tx.complete;
          });
      });
  }

  /**
   * If offline, save data to local storage
   * check if online then push it to IDB and server
   *
   * @static
   * @param {*} offlineObj
   * @memberof DBHelper
   */
  static sendDataOnline(offlineObj) {
    localStorage.setItem('data', JSON.stringify(offlineObj.data));
    //write an message
    alert("Unfortunately, you are offline. Your review has been saved and will be added if your are online!")
    // reset data in the form
    document.getElementById('addReview').reset();

    window.addEventListener('online', function(event) {
      let data = JSON.parse(localStorage.getItem('data'));
      if (data !== null) {
        DBHelper.postReview(offlineObj.data);
        //console.log(offlineObj.data);
        localStorage.removeItem('data');
      }
    })
  }

  /**
   * Update favorite status on main page
   *
   * @static
   * @param {*} id
   * @param {*} isFavourite
   * @returns
   * @memberof DBHelper
   */
  static updateFavourite(id, isFavourite) {

    return fetch(`http://localhost:1337/restaurants/${id}/?is_favorite=${isFavourite}`, {
        method: 'put'
      })
      .then(() => {
        // put the is_favorite data into db
        DBHelper.createIDB()
          .then(function(db) {
            var tx = db.transaction('restaurants', 'readwrite');
            var store = tx.objectStore('restaurants');
            store.get(id)
              .then(restaurant => {
                restaurant.is_favorite = isFavourite;
                store.put(restaurant);
              });

            return tx.complete;
          });
      });
  }
}