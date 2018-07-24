# Mobile Web Specialist Certification Course

## Project Part 2: Development Modifications

- Ajax proceeds with fetch: The files that include this code has the ending __-prom__.
- The data from server ('http://localhost:1337/restaurants') is cached in the IDB _restaurants_.
- The data is retrieved from the cache (IDB) and, if the cache is empty, is catched from the  server und put into the cache.
- The fetching response in the Service Worker is cloned; in this case, the cache is fetched on the single restaurant pages as well.
- External CSS-files are static placed on the bottom in order to increase the perfomance; the manifest.json is included in the production file; a pop-up window is created to inform the users about installation of PWA.
- The most of files are minified: The files has the ending __.min__.
- Development workflow is modified according to the development/production stages:
    - new Gulp tasks: copyHTML (incl. minify and add the suffix), copyJS (incl. minify and add the suffix), copyIMG.
    - Server in  _browsersync_ is adjusted to the production folder _dist_.
- _eslint_, _babel_ and _browserify_ is added to test/control the code. They are not included into default/watch task.
- The _images_ in the DB were extended (s. last commit on https://github.com/pr-olga/mws-restaurant-stage-2)


## Project Part 1: Development Modifications: Fixing SW

- cache.open() was added to fetch event. The fetch event did not happend, that is why, the method for opening the certain cache was added.
- the path to the cache files was changed: "/" -> "./"
- the SW scope was changed: "./" -> "/"
- in order to test the appropriate work of SW on GitHub Pages, the following routes were changed:
    - in dbhelpers.js
    ```javascript
    static get DATABASE_URL() {
    const port = 3000
    // return `http://localhost:${port}/data/restaurants.json`;

    return `./data/restaurants.json`;
    }

     static imageUrlForRestaurant(restaurant) {
    return (`./img/${restaurant.photograph}`);
     }


    static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
     }


    static smallImageUrlForRestaurant(restaurant) {
    return (`./img/${restaurant.photographSmall} 1x, /img/${restaurant.photograph} 2x`);
    }
    ```
    - in app.js
```javascript
    .register('sw.js', {scope: '/mws-restaurant-stage-1/'})
```


## This Project runs on localhost:3000
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

### Specification

You have been provided the code for a restaurant reviews website. The code has a lot of issues. It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any standard accessibility features, and it doesn’t work offline at all. Your job is to update the code to resolve these issues while still maintaining the included functionality.

### What do I do from here?

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000`, and look around for a bit to see what the current experience looks like.
3. Explore the provided code, and start making a plan to implement the required features in three areas: responsive design, accessibility and offline use.
4. Write code to implement the updates to get this site on its way to being a mobile-ready website.

## Leaflet.js and Mapbox:

This repository uses [leafletjs](https://leafletjs.com/) with [Mapbox](https://www.mapbox.com/). You need to replace `<your MAPBOX API KEY HERE>` with a token from [Mapbox](https://www.mapbox.com/). Mapbox is free to use, and does not require any payment information.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write.



