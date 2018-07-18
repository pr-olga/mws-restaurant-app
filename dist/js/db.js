import idb from 'idb';


var dbPromise = idb.open('restaurant', 1, function (upgradeDb) {
  var store = upgradeDb.createObjectStore('restaurants', {
    keyPath: 'id'
  });

  store.createIndex('name', 'name');

});

fetch('http://localhost:1337/restaurants')
  .then(function (response) {
    return response.json();
  }).then((restaurants) => {
    // put the data into db
    dbPromise.then(function (db) {
      var tx = db.transaction('restaurants', 'readwrite');
      var restaurantStore = tx.objectStore('restaurants');
      restaurants.forEach(function (restaurant) {
        restaurantStore.put(restaurant);
      });
      return tx.complete;
      // cache the data
    }).then(() => {
      dbPromise.then(function (db) {
        var tx = db.transaction('restaurants');
        var restaurantStore = tx.objectStore('restaurants');
        var ageIndex = restaurantStore.index('name');


        return restaurantStore.getAll().then(function (restaurants) {

          var a = restaurants.map((v, i) => restaurants[i].name);
          var b = restaurants.map((v, i) => restaurants[i].neighborhood);

          const ul = document.getElementById('restaurants-list');
          ul.innerHTML = '';

          restaurants.forEach((restaurant) => {
            const li = document.createElement('li');

            const name = document.createElement('h2');
            name.innerHTML = restaurant.name;
            li.append(name);

            const neighborhood = document.createElement('p');
            neighborhood.innerHTML = restaurant.neighborhood;
            li.append(neighborhood);

            const address = document.createElement('p');
            address.innerHTML = restaurant.address;
            li.append(address);

            ul.append(li);
          });
        });

      });


    })
      .catch(function (error) {
        console.log('Looks like there was a problem: \n', error);
        return error;
      });

  });


