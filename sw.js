/* Habitus OS service worker — app-shell caching only.
   Never caches: Firebase Auth, Firestore, personal records, tokens, backups. */
"use strict";
const CACHE_VERSION = "habitus-os-v5-1-release-2"; /* bumped: Firebase config wired */
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./offline.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];
/* Hosts that must always bypass the cache (auth, database, SDK). */
const NETWORK_ONLY = [
  "firestore.googleapis.com",
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com",
  "firebase.googleapis.com",
  "firebaseinstallations.googleapis.com",
  "firebaseremoteconfig.googleapis.com",
  "www.gstatic.com",
  "apis.google.com",
  "accounts.google.com"
];
function bypass(url){
  try{
    const u = new URL(url);
    if(u.origin !== self.location.origin) {
      /* Third-party: only cache nothing by default; SDK comes from gstatic (bypassed above). */
      if(NETWORK_ONLY.some(h => u.hostname === h || u.hostname.endsWith("." + h))) return true;
    }
    return NETWORK_ONLY.some(h => u.hostname === h || u.hostname.endsWith("." + h));
  }catch(e){ return true; }
}
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
      .catch(() => {})
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if(req.method !== "GET") return;
  const url = req.url;
  if(bypass(url)) return; /* network-only: auth, Firestore, SDK */
  /* Navigation: cache-first with offline fallback. */
  if(req.mode === "navigate"){
    event.respondWith(
      caches.match("./index.html").then((cached) =>
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put("./index.html", copy)).catch(()=>{});
          return res;
        }).catch(() => cached || caches.match("./offline.html"))
      )
    );
    return;
  }
  /* App-shell assets: cache-first, refresh in background. */
  event.respondWith(
    caches.match(req, {ignoreSearch: false}).then((cached) => {
      const net = fetch(req).then((res) => {
        if(res && res.ok){
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(()=>{});
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
/* Allow the page to trigger skipWaiting after its own safety checks. */
self.addEventListener("message", (event) => {
  if(event.data && event.data.type === "HABITUS_SKIP_WAITING") self.skipWaiting();
});
