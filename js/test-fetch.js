document.addEventListener('DOMContentLoaded', (event) => {
  fetchRestaurants();
  fetchNeighborhoods();
  fetchCuisines();
  initMap();
  fetchMarker();
});


function fetchRestaurants() {
  fetch('http://localhost:1337/restaurants')
    .then(res => res.json())
    .then(addRestaurants);
}

function addRestaurants(data) {

  let ul = document.getElementById('restaurants-list');

  let li = '';
  data.map(rest => {
    li += `<li>
        <h2>${rest.name}</h2>
        <p>${rest.neighborhood}</p>
        <p>${rest.address}</p>
        <p>${rest.cuisine_type}</p>
        <a href="./restaurants/${rest.id}">View more</a>
        </li>`;
  });
  ul.innerHTML = li;
}

/**
 * Add the Neighborhoods to search field
 */
function fetchNeighborhoods() {
  fetch('http://localhost:1337/restaurants')
    .then(res => res.json())
    .then(addNeighborhoods);
}

/**
 * Set Neighborhoods HTML.
 */
function addNeighborhoods(restaurants) {
  const select = document.getElementById('neighborhoods-select');

  // Get all cuisines from all restaurants
  const neighborhood = restaurants.map((v, i) => restaurants[i].neighborhood);
  // Remove duplicates from cuisines
  let uniqueNeighborhood = neighborhood.filter((v, i) => neighborhood.indexOf(v) == i);


  for (c in uniqueNeighborhood) {
    let option = document.createElement('option');
    option.innerHTML = uniqueNeighborhood[c];
    option.value = uniqueNeighborhood[c];
    select.append(option);
  }
}


/**
 * Add  Cuisines to search field
 */
function fetchCuisines() {
  fetch('http://localhost:1337/restaurants')
    .then(res => res.json())
    .then(addCuisines);
}

/**
 * Set cuisines HTML.
 */
function addCuisines(restaurants) {
  const select = document.getElementById('cuisines-select');

  // Get all cuisines from all restaurants
  const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);

  // Remove duplicates from cuisines
  let uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);


  for (c in uniqueCuisines) {
    let option = document.createElement('option');
    option.innerHTML = uniqueCuisines[c];
    option.value = uniqueCuisines[c];
    select.append(option);
  }
}







/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false
  });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);
};

/**
 * Map marker for a restaurant.
 */
function fetchMarker() {
  fetch('http://localhost:1337/restaurants')
    .then(res => res.json())
    .then(mapMarkerForRestaurant);

}

function mapMarkerForRestaurant(restaurants) {
  // https://leafletjs.com/reference-1.3.0.html#marker
  restaurants.map((restauranta) => {
    const marker = new L.marker([restauranta.latlng.lat, restauranta.latlng.lng], {
      title: restauranta.name,
      alt: restauranta.name,
      url: restauranta.id
    });
    marker.addTo(newMap);

    //Add markers for current restaurants to the map.
    marker.on('click', onClick => {
      window.location.href = marker.options.url;
    });
  });
}


