// JS file which runs all the time even if we close the page

// CACHE stands for storage of the browser
const CACHE_NAME = "v1"
const urlsToCache = ["index.html", "offline.html"]

const self = this

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    // opening the caches
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")

      return cache.addAll(urlsToCache)
    })
  )
})

// Listen for requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // We match all the request that our page is saving
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => caches.match("index.html"))
    })
  )
})

// Activate the SW
self.addEventListener("activate", (event) => {
  const cacheWhitelist = []
  cacheWhitelist.push(CACHE_NAME)

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName)
          }
        })
      )
    )
  )
})
