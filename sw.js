var staticCacheName = 'version1';
var cacheFiles = [
  './',
  './restaurant.html',
  './css/styles.min.css',
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg',
  './img/4.jpg',
  './img/5.jpg',
  './img/6.jpg',
  './img/7.jpg',
  './img/8.jpg',
  './img/9.jpg',
  './img/10.jpg',
  './icon-192x192.png',
  './icon-512x512.png',
  './js/idb.js',
  './js/main-prom.min.js',
  './js/dbhelper-prom.min.js',
  './js/restaurant_info-prom.min.js',
  './js/picturefill.min.js',
  './app.min.js',
  './manifest.json',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1206/1539.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow ',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1206/1540.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1540.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1205/1540.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1539.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1205/1539.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1204/1539.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1204/1540.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png',
  'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon-2x.png',
  'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png'

]

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== staticCacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  const storageUrl = event.request.url.split(/[?#]/)[0];

  if (storageUrl.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(storageUrl).then(function(response) {
        return response || fetch(event.request).then((response) => {
          var resp = response.clone();
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          var req = event.request;
          caches.open(staticCacheName).then(function(cache) {
            cache.put(req, resp);
          });
          return response;
        });
      })
    );
  }
});