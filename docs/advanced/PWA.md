# PWA 面试指南

## 面试者视角回答

PWA（Progressive Web App，渐进式网络应用）是一种结合 web 和原生应用优点的技术方案，让 web 应用能够像原生应用一样安装到设备上，并提供离线访问、推送通知等能力。

---

## 核心概念

### PWA 三大支柱

| 技术 | 作用 |
|------|------|
| **Service Worker** | 离线缓存、网络代理 |
| **Manifest** | 应用清单，可安装到桌面 |
| **HTTPS** | 安全要求（必需） |

### PWA vs 原生应用

| 特性 | PWA | 原生应用 |
|------|-----|---------|
| 安装 | 无需安装，扫码即用 | 需要应用商店 |
| 更新 | 自动更新 | 需要手动更新 |
| 开发成本 | 单一代码库 | 多平台开发 |
| 离线能力 | 支持 | 支持 |
| 推送通知 | 支持 | 支持 |
| 访问系统 API | 有限 | 完全访问 |
| 性能 | 依赖网络 | 更流畅 |
| 发现难度 | 易分享 | 依赖商店 |

---

## Service Worker

### 生命周期

```
┌──────────┐    ┌───────────┐    ┌───────────┐    ┌──────────┐
│  Install │───>│  Activating│───>│   Active   │───>│  Redundant│
└──────────┘    └───────────┘    └───────────┘    └──────────┘
     │               │                │
     v               v                v
  缓存预安装     清理旧缓存        处理请求
```

### 代码实现

**1. 注册 Service Worker**
```javascript
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('SW 注册成功:', registration.scope);
        } catch (error) {
            console.error('SW 注册失败:', error);
        }
    });
}
```

**2. Service Worker 基本结构**
```javascript
const CACHE_NAME = 'v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/logo.png'
];

// Install 事件 - 缓存资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('缓存资源');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate 事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch 事件 - 网络拦截
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200) {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});
```

---

## 缓存策略

### 常见缓存策略

| 策略 | 适用场景 | 说明 |
|------|---------|------|
| **Cache First** | 静态资源 | 先缓存，缓存没有再请求 |
| **Network First** | API 数据 | 先请求，失败用缓存 |
| **Stale While Revalidate** | 非关键资源 | 返回缓存同时更新缓存 |
| **Network Only** | 实时数据 | 只从网络获取 |
| **Cache Only** | 离线应用 | 只从缓存获取 |

### 策略代码实现

**Cache First（缓存优先）**
```javascript
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
```

**Network First（网络优先）**
```javascript
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
```

**Stale While Revalidate（缓存优先并后台更新）**
```javascript
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                return cachedResponse || fetchPromise;
            });
        })
    );
});
```

---

## Web App Manifest

### manifest.json 配置

```json
{
    "name": "我的 PWA 应用",
    "short_name": "PWA应用",
    "description": "一个优秀的渐进式网络应用",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#4CAF50",
    "orientation": "portrait",
    "icons": [
        {
            "src": "/icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        },
        {
            "src": "/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }
    ],
    "categories": ["business", "productivity"],
    "shortcuts": [
        {
            "name": "查看文章",
            "short_name": "文章",
            "url": "/articles",
            "icons": [{ "src": "/icons/articles.png", "sizes": "96x96" }]
        }
    ]
}
```

### display 模式

| 模式 | 效果 |
|------|------|
| `fullscreen` | 全屏显示，无浏览器 UI |
| `standalone` | 独立窗口，隐藏浏览器 UI |
| `minimal-ui` | 最小 UI（如地址栏） |
| `browser` | 普通浏览器模式 |

---

## 离线页面

### 创建离线回退页面

```javascript
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
                return new Response('离线状态', { status: 503 });
            })
    );
});
```

### 离线数据同步

```javascript
// IndexedDB 存储离线数据
const db = await openDB('my-db', 1, {
    upgrade(db) {
        const store = db.createObjectStore('pending-data', {
            keyPath: 'id',
            autoIncrement: true
        });
        store.createIndex('status', 'status');
    }
});

// 离线时保存数据
async function saveDataOffline(data) {
    const db = await openDB('my-db', 1);
    await db.add('pending-data', { ...data, status: 'pending' });
}

// 在线时同步
async function syncPendingData() {
    const db = await openDB('my-db', 1);
    const pendingItems = await db.getAllFromIndex('pending-data', 'status', 'pending');

    for (const item of pendingItems) {
        try {
            await fetch('/api/data', {
                method: 'POST',
                body: JSON.stringify(item)
            });
            await db.delete('pending-data', item.id);
        } catch (e) {
            console.error('同步失败:', e);
        }
    }
}

// 定期同步
setInterval(syncPendingData, 30000);
```

---

## 推送通知

### 订阅推送

```javascript
async function subscribePush() {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        });

        // 发送到服务器保存
        await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
        });
    }
}

// 工具函数
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
```

### 接收推送

```javascript
self.addEventListener('push', (event) => {
    const data = event.data.json();

    const options = {
        body: data.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        },
        actions: [
            { action: 'open', title: '打开' },
            { action: 'close', title: '关闭' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
```

---

## Workbox 工具

### Workbox 简介

Workbox 是 Google 开发的 Service Worker 工具库，简化了缓存策略的实现。

```javascript
// 使用 Workbox
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// 缓存 HTML
registerRoute(
    ({ request }) => request.mode === 'navigate',
    new StaleWhileRevalidate({
        cacheName: 'pages-cache'
    })
);

// 缓存图片
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 天
            })
        ]
    })
);

// 缓存静态资源
registerRoute(
    ({ request }) =>
        request.destination === 'style' ||
        request.destination === 'script',
    new StaleWhileRevalidate({
        cacheName: 'static-resources-cache'
    })
);

// 缓存 Google Fonts
registerRoute(
    ({ url }) =>
        url.origin === 'https://fonts.googleapis.com' ||
        url.origin === 'https://fonts.gstatic.com',
    new StaleWhileRevalidate({
        cacheName: 'google-fonts-cache'
    })
);
```

---

## 面试题精选

### 面试题 1：PWA 的核心原理是什么？

**参考答案：**

PWA 的核心原理基于以下三个技术：

**1. Service Worker**
- 运行在独立线程的 JavaScript 文件
- 作为浏览器和网络之间的代理服务器
- 可以拦截和处理所有 HTTP 请求
- 支持离线缓存、网络加速等能力

核心工作流程：
```
浏览器请求 → Service Worker 拦截 → 缓存策略处理 → 返回响应
```

**2. Manifest（Web App Manifest）**
- 一个 JSON 配置文件
- 定义应用名称、图标、启动页面等元数据
- 让 Web 应用可以"安装"到桌面
- 控制屏幕方向、显示模式等

**3. HTTPS**
- PWA 要求必须在 HTTPS 环境下运行
- Service Worker 可以拦截敏感请求
- 确保数据安全性

---

### 面试题 2：Service Worker 和 Web Worker 的区别？

**参考答案：**

| 特性 | Service Worker | Web Worker |
|------|---------------|------------|
| **运行环境** | 独立于主线程的代理服务器 | 独立线程执行耗时任务 |
| **生命周期** | 较长，与浏览器会话相关 | 任务结束即销毁 |
| **作用域** | 整个浏览器 | 创建时指定 |
| **主要用途** | 缓存、代理、离线 | 计算密集型任务 |
| **访问 API** | 不能直接访问 DOM | 不能直接访问 DOM |
| **与页面通信** | 通过 postMessage | 通过 postMessage |
| **常驻性** | 常驻内存 | 用完即销毁 |

**代码示例对比：**

```javascript
// Service Worker - 代理服务器
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
    );
});

// Web Worker - 计算任务
self.onmessage = function(e) {
    const result = heavyComputation(e.data);
    self.postMessage(result);
};

function heavyComputation(data) {
    // 耗时计算
    return data.reduce((acc, val) => acc + val, 0);
}
```

---

### 面试题 3：如何实现离线优先的应用？

**参考答案：**

离线优先（Offline First）是一种以离线为默认状态的设计理念：

**核心思路：**
1. 先展示缓存数据，保证首屏加载
2. 后台尝试同步最新数据
3. 网络恢复时更新缓存

**实现方案：**

```javascript
// 1. 预缓存核心资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('app-shell-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles/main.css',
                '/scripts/main.js',
                '/images/logo.png'
            ]);
        })
    );
});

// 2. Stale-While-Revalidate 策略
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            caches.open('api-cache').then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
    }
});

// 3. IndexedDB 存储离线数据
const db = await openDB('app-db', 1, {
    upgrade(db) {
        const store = db.createObjectStore('data', { keyPath: 'id' });
    }
});

// 4. 页面展示
async function loadData() {
    const cachedData = await db.getAll('data');
    renderUI(cachedData); // 先展示缓存

    try {
        const networkData = await fetch('/api/data').then(r => r.json());
        await db.clear('data');
        await db.add('data', networkData);
        renderUI(networkData); // 更新最新数据
    } catch (e) {
        console.log('离线状态，使用缓存数据');
    }
}
```

---

### 面试题 4：PWA 的缓存策略有哪些？如何选择？

**参考答案：**

**缓存策略对比：**

| 策略 | 原理 | 优点 | 缺点 | 适用场景 |
|------|------|------|------|---------|
| **Cache First** | 缓存优先 | 快速响应 | 可能过期 | 静态资源、版本稳定的资源 |
| **Network First** | 网络优先 | 数据新鲜 | 慢 | API 数据、实时性内容 |
| **Stale While Revalidate** | 返回缓存同时更新 | 平衡速度和新鲜度 | 缓存可能稍旧 | 变化频率适中的资源 |
| **Network Only** | 只走网络 | 实时 | 无离线能力 | 登录状态、验证码 |
| **Cache Only** | 只走缓存 | 完全离线 | 无更新 | 离线游戏资源 |

**选择建议：**

```javascript
// 静态资源（CSS/JS）: Cache First
registerRoute(
    ({ request }) => request.destination === 'style' ||
                     request.destination === 'script',
    new CacheFirst({
        cacheName: 'static-cache',
        plugins: [
            new ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 })
        ]
    })
);

// 用户数据: Stale While Revalidate
registerRoute(
    ({ url }) => url.pathname.startsWith('/api/user'),
    new StaleWhileRevalidate({
        cacheName: 'user-cache'
    })
);

// 搜索结果: Network First
registerRoute(
    ({ url }) => url.pathname.startsWith('/api/search'),
    new NetworkFirst({
        cacheName: 'search-cache',
        networkTimeoutSeconds: 3
    })
);

// 隐私数据: Network Only
registerRoute(
    ({ url }) => url.pathname.startsWith('/api/private'),
    new NetworkOnly()
);
```

---

### 面试题 5：PWA 如何实现秒开？

**参考答案：**

秒开（Short Launch Time）是 PWA 的核心优势之一：

**1. 应用壳缓存**
```javascript
// 缓存 HTML 壳
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.match('/shell.html')
        );
    }
});
```

**2. 关键 CSS 内联**
```html
<head>
    <style>
        /* 关键渲染路径 CSS */
        .app-header { display: flex; }
        .app-content { padding: 16px; }
    </style>
</head>
```

**3. 预加载关键资源**
```html
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
<link rel="preload" href="/styles/main.css" as="style">
<link rel="preload" href="/scripts/main.js" as="script">
```

**4. 骨架屏**
```javascript
const shell = `
    <div class="skeleton">
        <div class="skeleton-header"></div>
        <div class="skeleton-content"></div>
    </div>
`;
// 立即渲染骨架屏，同时加载数据
```

**5. 预连接关键域名**
```html
<link rel="preconnect" href="https://api.example.com" crossorigin>
```

---

### 面试题 6：PWA 的局限性有哪些？

**参考答案：**

**1. 系统级 API 访问受限**
- 无法访问通讯录、短信、电话
- NFC、蓝牙有限制
- 摄像头能力弱于原生

**2. 后台执行限制**
- iOS Safari 不支持真正的后台推送
- 电池消耗比原生应用快

**3. 应用商店问题**
- Google Play 可以上架
- iOS App Store 不接受纯 PWA
- 用户认知度低

**4. 性能问题**
- 首次加载仍需下载资源
- 复杂动画可能卡顿
- 依赖浏览器实现

**5. 兼容性问题**
- iOS Safari 支持不完整
- 部分 Android 浏览器不支持
- Service Worker 浏览器支持问题

**解决方案：**
- 对于需要深度系统集成的功能，考虑 React Native 或 Flutter
- iOS 推送可以结合 APNs
- 使用 WebAssembly 提升性能

---

### 面试题 7：如何优化 PWA 的首屏加载性能？

**参考答案：**

**1. 代码分割**
```javascript
// 使用动态导入
const { Chart } = await import('./chart.js');

// React.lazy
const Dashboard = React.lazy(() => import('./Dashboard'));
```

**2. 资源压缩**
```javascript
// webpack 配置
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: 10
                }
            }
        },
        minimize: true
    }
};
```

**3. Service Worker 预缓存**
```javascript
// 使用 Workbox precache
import { precacheAndRoute } from 'workbox-precaching';
precacheAndRoute(self.__WB_MANIFEST);
```

**4. HTTP/2 Server Push**
```javascript
// 服务器配置（Node.js）
res.push('/styles/main.css', {
    headers: { 'Content-Type': 'text/css' }
});
```

**5. 关键指标优化**
```javascript
// 监控 LCP (Largest Contentful Paint)
new PerformanceObserver((list) => {
    const entry = list.getEntries()[0];
    console.log('LCP:', entry.startTime);
}).observe({ type: 'largest-contentful-paint', buffered: true });
```

---

### 面试题 8：PWA 的更新机制是怎样的？

**参考答案：**

**Service Worker 更新流程：**

```
1. 用户访问页面，SW 检查新版本
2. 发现新 SW，下载并触发 install
3. 新 SW 进入 waiting 状态
4. 当所有页面关闭，新 SW 激活
5. 触发 activate 事件，清理旧缓存
```

**强制更新策略：**
```javascript
// 立即激活新 SW
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 页面刷新
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

// 通知用户刷新
navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (confirm('有新版本可用，是否刷新？')) {
        window.location.reload();
    }
});
```

**缓存版本管理：**
```javascript
const CACHE_VERSION = 'v2';
const CACHE_NAME = `app-${CACHE_VERSION}`;

// 激活时只保留当前版本缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key.startsWith('app-') && key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
});
```

---

### 面试题 9：Manifest 中的 icons 应该准备哪些尺寸？

**参考答案：**

**推荐尺寸：**

| 尺寸 | 用途 | 必需 |
|------|------|------|
| 72x72 | 低密度 Android | 建议 |
| 96x96 | Google Play 小图标 | 建议 |
| 128x128 | Chrome 应用列表 | 建议 |
| 144x144 | Windows 快捷方式 | 建议 |
| 152x152 | iPad | 建议 |
| 192x192 | Android 主屏幕 | 必需 |
| 384x384 | 高分辨率 | 建议 |
| 512x512 | Google Play Store | 必需 |
| maskable 512x512 | 安全区域图标 | 建议 |

**maskable 图标规范：**
- 图标必须适合一个圆形/圆角矩形的安全区域内
- 安全区域为图标尺寸的 80%
- 周围 10% 边距可以透明

```json
{
    "icons": [
        {
            "src": "/icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        },
        {
            "src": "/icons/icon-maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }
    ]
}
```

---

### 面试题 10：如何检测 PWA 是否已安装？

**参考答案：**

**1. 检测 display-mode**
```javascript
function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           navigator.standalone === true;
}

if (isStandalone()) {
    console.log('PWA 独立模式运行');
}
```

**2. 检测添加到主屏幕**
```javascript
window.addEventListener('beforeinstallprompt', (e) => {
    e.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
            console.log('用户添加到主屏幕');
        } else {
            console.log('用户取消安装');
        }
    });
});
```

**3. 检测已安装**
```javascript
window.addEventListener('appinstalled', () => {
    console.log('PWA 已安装');
    hideInstallButton();
});
```

**4. iOS Safari 检测**
```javascript
function isIOSStandalone() {
    return ('standalone' in navigator) && (navigator.standalone === true);
}
```

**完整示例：**
```javascript
function getPWADisplayMode() {
    if (document.fullscreenElement) return 'fullscreen';
    if (navigator.standalone) return 'standalone';
    if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
    if (window.matchMedia('(display-mode: browser)').matches) return 'browser';
    return 'unknown';
}

console.log('显示模式:', getPWADisplayMode());
```
