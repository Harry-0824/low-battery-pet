const CACHE_NAME = "low-battery-pet-shell-v1";
const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) =>
            key === CACHE_NAME ? Promise.resolve() : caches.delete(key)
          )
        )
      )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const requestUrl = new URL(event.request.url);

        if (requestUrl.origin === self.location.origin && response.ok) {
          const responseCopy = response.clone();
          void caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseCopy));
        }

        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          if (event.request.mode === "navigate") {
            return caches.match("/");
          }

          return Response.error();
        })
      )
  );
});
