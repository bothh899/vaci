const CACHE_NAME = 'vaci-store-v1';
const urlsToCache = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // 🔴 ១. កុំស្ទាក់ទិន្នន័យដែលមិនមែនជាការអាន (Bypass POST, PUT, DELETE requests)
  if (e.request.method !== 'GET') {
    return; // ទុកឲ្យ Browser ធ្វើការធម្មតា
  }

  // 🔴 ២. កុំស្ទាក់ការហៅទិន្នន័យពី Firebase, Google APIs, Cloudflare និងទំព័រ Admin
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('cloudflarestorage') ||
    url.pathname.includes('admin99.html')
  ) {
    return; // ទុកឲ្យ Browser ធ្វើការធម្មតា
  }

  // 🟢 ៣. ដំណើរការ PWA ធម្មតាសម្រាប់តែរូបភាព និងកូដវេបសាយភ្ញៀវ
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
