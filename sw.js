// ============================================================================
// SERVICE WORKER
//
// The dashboard is one file that needs the network for nothing except loading
// itself, so this makes it load without one. Network first: when there is a
// connection you always get the newest deploy, and the copy it serves is kept
// for the next time there isn't. Only successful responses are kept — a
// lock screen or an error page must never become "the app".
// ============================================================================
const CACHE = "chaston-v1";
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;          // Google and the like: leave alone
  if (url.pathname === "/sw.js") return;

  // The page itself, on any path and with any query (?steps=…): network first.
  // A query-bearing request is never cached — the Shortcut ingest must run
  // against a live load, and "/" is the entry it falls back to.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok && !url.search) caches.open(CACHE).then(c => c.put("/", res.clone()));
        return res;
      }).catch(() => caches.match("/"))
    );
    return;
  }

  // Everything else the shell owns (icons, manifest): cache first, refresh behind.
  e.respondWith(
    caches.match(req).then(hit => {
      const refresh = fetch(req).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || refresh;
    })
  );
});
