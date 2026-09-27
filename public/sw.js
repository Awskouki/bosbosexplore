// BosboSExplore Service Worker
// Caches OSM tile layer and app shell for offline use.

const CACHE_NAME = 'bosbosexplore-v1'
const TILE_CACHE = 'bosbosexplore-tiles-v1'

// App shell — static assets to pre-cache
const APP_SHELL = [
  '/',
  '/index.html',
]

// Tile hosts to cache on the fly
const TILE_ORIGINS = [
  'tile.openstreetmap.org',
  'a.tile.opentopomap.org',
  'b.tile.opentopomap.org',
  'c.tile.opentopomap.org',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== TILE_CACHE)
          .map(k => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Cache OSM/topo tiles
  if (TILE_ORIGINS.includes(url.hostname)) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async cache => {
        const cached = await cache.match(event.request)
        if (cached) return cached
        try {
          const response = await fetch(event.request)
          if (response.ok) cache.put(event.request, response.clone())
          return response
        } catch {
          return new Response('', { status: 503 })
        }
      })
    )
    return
  }

  // App shell — network first, fall back to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/') ?? new Response('Offline', { status: 503 })
      )
    )
    return
  }

  // Static assets — cache first
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached ?? fetch(event.request)
    )
  )
})
