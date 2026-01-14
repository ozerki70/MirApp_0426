const CACHE_NAME = 'mirapp-cache-v0326';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/persian-date@latest/dist/persian-date.min.js',
  'https://cdn.jsdelivr.net/npm/persian-date@latest/dist/persian-date.fa.min.js',
  'https://cdn-icons-png.flaticon.com/512/2784/2784459.png'
];

// نصب Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('ایجاد کش برای MirApp');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('حذف کش قدیمی:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// مدیریت درخواست‌ها
self.addEventListener('fetch', event => {
  // فقط درخواست‌های HTTP را مدیریت کن
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر پاسخ در کش موجود بود
        if (response) {
          return response;
        }

        // در غیر این صورت از شبکه دریافت کن
        return fetch(event.request)
          .then(response => {
            // فقط پاسخ‌های موفق را کش کن
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // اگر آفلاین هستیم
            if (event.request.url.includes('.html')) {
              return caches.match('/index.html');
            }
            
            // صفحه خطای سفارشی
            return new Response(`
              <!DOCTYPE html>
              <html lang="fa" dir="rtl">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>MirApp - حالت آفلاین</title>
                <style>
                  body {
                    font-family: 'Vazirmatn', sans-serif;
                    background: linear-gradient(135deg, #0a3d2f 0%, #115e59 100%);
                    color: white;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    padding: 20px;
                  }
                  .offline-icon {
                    font-size: 4rem;
                    color: #2dd4bf;
                    margin-bottom: 20px;
                  }
                  h1 {
                    color: #fbbf24;
                    margin-bottom: 15px;
                  }
                  p {
                    margin-bottom: 10px;
                    line-height: 1.6;
                  }
                </style>
              </head>
              <body>
                <div class="offline-icon">
                  <i class="fas fa-wifi-slash"></i>
                </div>
                <h1>اتصال اینترنت برقرار نیست</h1>
                <p>لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش نمایید.</p>
                <p>برخی از قابلیت‌ها در حالت آفلاین در دسترس نیستند.</p>
              </body>
              </html>
            `, {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/html; charset=utf-8'
              })
            });
          });
      })
  );
});

// دریافت Push Notification
self.addEventListener('push', event => {
  let data = {
    title: 'MirApp',
    body: 'اعلان جدید',
    icon: 'https://cdn-icons-png.flaticon.com/512/2784/2784459.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2784/2784459.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    }
  };

  if (event.data) {
    try {
      const pushData = event.data.json();
      data = { ...data, ...pushData };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      vibrate: data.vibrate,
      data: data.data,
      actions: [
        {
          action: 'open',
          title: 'مشاهده'
        },
        {
          action: 'close',
          title: 'بستن'
        }
      ]
    })
  );
});

// کلیک روی Notification
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({type: 'window'}).then(windowClients => {
        // اگر پنجره باز است، آن را focus کن
        for (let client of windowClients) {
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus();
          }
        }
        // در غیر این صورت پنجره جدید باز کن
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // این تابع زمانی که دستگاه آنلاین شود اجرا می‌شود
  // می‌تواند برای همگام‌سازی داده‌ها استفاده شود
  console.log('همگام‌سازی داده‌ها در پس‌زمینه...');
}