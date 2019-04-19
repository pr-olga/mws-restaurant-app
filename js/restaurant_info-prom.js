let restaurant;
var newMap;

/**
 * Initialize map and current restaurant from page URL as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  fetchRestaurantFromURL();
  fetchReviewsFromURL();
  fetchRestaurantFromURL2();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  const id = getParameterByName('id');
  DBHelper.fetchRestaurantById(id)
    .then((restaurant = self.restaurant) => {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
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
      return DBHelper.mapMarkerForRestaurant(restaurant, newMap);
    });
};




/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = () => {
  const id = getParameterByName('id');
  DBHelper.fetchRestaurantById(id)
    .then(fillRestaurantHTML);
};

/**
 * Get reviews for current restaurant.
 */
fetchReviewsFromURL = () => {
  const id = getParameterByName('id');
  let allComm = DBHelper.fetchReviewsById(id)
  .then(fillReviewsHTML);
};


/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  // add alt attribute to the image
  image.alt = DBHelper.imageAltForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    const hours = document.getElementById('restaurant-hours');
    const operatingHours = (restaurant.operating_hours);
    for (let key in operatingHours) {
      const row = document.createElement('tr');

      const day = document.createElement('td');
      day.innerHTML = key;
      row.appendChild(day);

      const time = document.createElement('td');
      time.innerHTML = operatingHours[key];
      row.appendChild(time);

      hours.appendChild(row);
    }
  }
};

fillReviewsHTML = (review = self.review) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!review) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }

  const ul = document.getElementById('reviews-list');
  review.forEach(rev => {
    ul.appendChild(createReviewHTML(rev));
  });

  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */

createReviewHTML = (review) => {
  const li = document.createElement('li');

  // wrap two first p to create a black header
  const div = document.createElement('div');
  li.appendChild(div);

  const name = document.createElement('p');
  name.innerHTML = review.name;
  div.appendChild(name);

  /* const date = document.createElement('p');
  date.innerHTML = review.date;
  div.appendChild(date);
 */
  // wrap two second p to create a black header
  const divSec = document.createElement('div');
  divSec.classList.add('div-content');
  li.appendChild(divSec);


  const rating = document.createElement('p');
  rating.innerHTML = `RATING: ${review.rating}`;
  divSec.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  divSec.appendChild(comments);

  return li;
};

/**
 * Get current restaurant from page URL
 * to get the restaurants name for breadcrumbs
 */

fetchRestaurantFromURL2 = () => {
  const id = getParameterByName('id');
  console.log(id);
  DBHelper.fetchRestaurantById(id)
    .then(fillBreadcrumb);

};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  console.log(url);
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};