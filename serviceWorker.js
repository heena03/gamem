const cacheName = 'v1';

self.addEventListener('install', (event) => {
    // console.log('Service Worker: Installed ')
})

self.addEventListener('activate', (event) => {
    // console.log('Service Worker: Activated ')
    // Remove unwanted caches
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== cacheName) {
                            // console.log('Service Worker: Clearing old cache')
                            return caches.delete(cache)
                        }
                    })
                )
            })
    )
})

self.addEventListener('fetch', (event) => {
    // console.log('Service Worker: Fetching ')
    event.respondWith(
        fetch(event.request)
            .then(res => {
                // Make copy/clone of respnse
                const resClone = res.clone()
                // Open Cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        // Add response to cache
                        cache.put(event.request, resClone)
                    })
                return res
            })
            .catch(err => caches.match(event.request)
                .then(res => res))
    )
})




