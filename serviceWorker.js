'use strict';

var CACHE_NAME = '1.0.2-dev4';
//cacheAll = true;

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        //if(!(cacheAll)) return response;
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) return caches.delete(key);
      }));
    }).then(function() {
      self.clients.claim()
    })
  );
});
