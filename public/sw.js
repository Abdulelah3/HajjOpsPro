// HajjOpsPro Service Worker - Offline Caching
const CACHE_NAME = 'hajjospro-cache-v1'

// Core assets to cache for offline support
const PRECACHE_URLS = [
  '/',
  '/login',
  '/pilgrims',
  '/trips',
  '/nusuk',
  '/staff',
  '/reports',
  '/notifications',
  '/settings',
]

// Install event: precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS)
    }).then(() => {
      return self.skipWaiting()
    })
  )
})

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Fetch event: Network-first strategy with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests (POST, PUT, DELETE should always go to network)
  if (request.method !== 'GET') return

  // Skip API requests - they should always hit the network
  if (request.url.includes('/api/')) return

  // Skip Firebase requests
  if (request.url.includes('firestore.googleapis.com') || 
      request.url.includes('firebase') ||
      request.url.includes('googleapis.com')) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses for future offline use
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // If navigating to a page, return the cached home page
          if (request.mode === 'navigate') {
            return caches.match('/')
          }
          return new Response('غير متصل بالإنترنت', {
            status: 503,
            statusText: 'Service Unavailable'
          })
        })
      })
  )
})
