// 🟢 ប្តូរឈ្មោះទៅ v2 ដើម្បីឲ្យ Browser ដឹងថាមានការ Update ថ្មី
const CACHE_NAME = 'vaci-store-v2';
const urlsToCache = ['./', './index.html'];

self.addEventListener('install', e => {
  self.skipWaiting(); // បង្ខំឲ្យ Update ភ្លាមៗ មិនបាច់រង់ចាំ
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
});

self.addEventListener('activate', e => {
  // លុបការចងចាំ (Cache) ចាស់ៗចោលទាំងអស់
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.map(key => { if(key !== CACHE_NAME) return caches.delete(key); })
  )));
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // 🟢 បិទមិនឲ្យ PWA ប៉ះពាល់ទំព័រ Admin និងការ Upload/Download ទិន្នន័យពី Database
  if (
    e.request.method !== 'GET' ||
    url.includes('admin99.html') ||
    url.includes('googleapis.com') ||
    url.includes('firebase') ||
    url.includes('cloudflarestorage')
  ) {
    return; // បន្តដំណើរការធម្មតាដោយមិនឆ្លងកាត់ PWA
  }

  // ដំណើរការ PWA សម្រាប់តែភ្ញៀវ
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).catch(() => console.log('Offline mode fallback'));
    })
  );
});