var staticCacheName = 'version1';
var cacheFiles = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/js/main.js',
    '/js/dbhelper.js',
    '/js/restaurant_info.js',
    '/js/picturefill.js',
    '/data/restaurants.json',
    '/app.js',
    'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1206/1539.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow ',
    'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1206/1540.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
    'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1540.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
    'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1205/1540.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
    'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1539.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
    'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1205/1539.jpg70?access_token=pk.eyJ1IjoicHItb2xnYSIsImEiOiJjaml3MmEzcDcwZjF6M2tvc2dsc2xhcW9jIn0.C3eNrk94kkZnqDbrgN4pow',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png',
    'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon-2x.png',
    'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png'
]

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== staticCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        // open the certain cache
        caches.open('version1').then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return response || fetch(event.request);
            });
        })
    );
});