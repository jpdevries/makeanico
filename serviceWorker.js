'use strict';

var CACHE_NAME = 'drst0.0.0';
var cacheAll = false;

var urlsToCache = [
  '/assets/css/main.css',
  '/assets/css/main.min.css',
  '/assets/img/sprite.svg',
  '/assets/img/sprite.min.svg',
  '/favicon.ico',
  //'/assets/js/app.js',
  //'/assets/js/app.min.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  console.log('install');
  /*event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );*/
});

function urlShouldBeCached(url) {
  for(let i = 0; i < urlsToCache.length; i++) if(url.indexOf(urlsToCache[i]) !== -1) return true;
  return false;
}

self.addEventListener('fetch', function(event) {
  console.log(event);
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      if(resp) console.log('returning resp from cache ', resp);
      return resp || fetch(event.request).then(function(response) {
        if(!(cacheAll || urlShouldBeCached(response.url))) return response;
        console.log('saving to cache', response);
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

this.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('purging cache ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
});
