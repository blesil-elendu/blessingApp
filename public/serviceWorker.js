const staticWeatherApp = "gads-weather-app-site-v1"
const assets = [
  "/",
  "./index.html",
  "./css/style.css",
  "./js/main.js",
  "./images/image.jpg",
 
]

// cache the Assets
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticWeatherApp).then(cache => {
      cache.addAll(assets)
    })
  )
})

// fetching the Assets
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })



