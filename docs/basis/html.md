# HTML

## 1. HTML 语义化

语义化是指使用恰当的 HTML 标签来描述内容结构，使代码清晰易读，同时有利于 SEO 和无障碍访问。

### 常见语义化标签

```html
<!-- 头部 -->
<header></header>

<!-- 导航 -->
<nav></nav>

<!-- 主要内容 -->
<main>
    <article>
        <!-- 独立文章 -->
        <section><!-- 章节 --></section>
    </article>

    <!-- 侧边栏 -->
    <aside></aside>
</main>

<!-- 页脚 -->
<footer></footer>
```

### 语义化优点

| 优点       | 说明                                   |
| ---------- | -------------------------------------- |
| SEO 友好   | 便于搜索引擎理解页面结构，提高搜索排名 |
| 可访问性   | 屏幕阅读器能准确解析内容               |
| 代码可读性 | 开发者易于理解和维护                   |
| 设备兼容   | 适合不同设备解析                       |

### 行内元素与块级元素

| 行内元素                        | 块级元素                         |
| ------------------------------- | -------------------------------- |
| span、a、strong、em、img、input | div、p、h1-h6、ul、ol、li、table |
| 不换行                          | 独占一行                         |
| 不能设置宽高                    | 可设置宽高                       |
| margin 上下无效                 | margin 上下有效                  |

## 2. script 标签 defer 与 async

### 执行时机对比

| 类型             | 执行时机            | 是否阻塞 HTML |
| ---------------- | ------------------- | ------------- |
| `<script>`       | 下载后立即执行      | 完全阻塞      |
| `<script async>` | 下载完成即执行      | 可能阻塞      |
| `<script defer>` | HTML 解析完成后执行 | 不阻塞        |

```html
<!-- 阻塞：HTML 解析暂停，等待脚本下载并执行 -->
<script src="app.js"></script>

<!-- 异步：下载时 HTML 继续解析，下载完立即执行 -->
<script async src="analytics.js"></script>

<!-- 延迟：HTML 解析完成后再执行，按顺序 -->
<script defer src="app.js"></script>
```

### 使用场景

- **defer**：需要按顺序执行，依赖 DOM 的脚本
- **async**：独立脚本，如统计脚本、广告脚本
- **普通 script**：关键依赖脚本，位置靠前

## 3. 从输入 URL 到页面显示

### 完整流程

```
输入 URL → DNS 解析 → 建立 TCP 连接 → 发送 HTTP 请求
     ↓
服务器处理 → 返回 HTTP 响应 → 断开连接
     ↓
浏览器解析 HTML → 构建 DOM 树 → 构建 CSSOM 树
     ↓
合成 Render Tree → Layout → Paint → Display
```

### 详细步骤

**1. URL 解析**

- 识别协议（http/https）
- 检查缓存（强缓存/协商缓存）
- URL 编码转换

**2. DNS 解析**

```
域名 → DNS 服务器查询 → IP 地址
```

- 浏览器缓存 → 系统缓存 → 路由器缓存 → ISP DNS 缓存 → 递归查询

**3. TCP 连接（三次握手）**

```
客户端 → SYN → 服务器
客户端 ← SYN+ACK ← 服务器
客户端 → ACK → 服务器
```

**4. 发送 HTTP 请求**

```http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

**5. 服务器处理与响应**

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!DOCTYPE html>
<html>...</html>
```

**6. 浏览器渲染**

- **解析 HTML** → DOM Tree
- **解析 CSS** → CSSOM Tree
- **合成** → Render Tree
- **Layout** → 计算位置尺寸
- **Paint** → 绘制像素
- **Composite** → 合成图层

## 4. DOCTYPE 的作用

DOCTYPE 声明告诉浏览器文档使用的 HTML 版本。

```html
<!-- HTML5 -->
<!DOCTYPE html>

<!-- HTML 4.01 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

### 严格模式与混杂模式

- **严格模式**：按 W3C 标准解析
- **混杂模式**：向后兼容旧版浏览器行为

## 5. meta 标签常用属性

```html
<!-- 字符编码 -->
<meta charset="UTF-8" />

<!-- 视口设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- SEO -->
<meta name="description" content="页面描述" />
<meta name="keywords" content="关键词1, 关键词2" />
<meta name="author" content="作者" />
<meta name="robots" content="index, follow" />

<!-- 移动端 -->
<meta name="format-detection" content="telephone=no" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />

<!-- 社交分享 -->
<meta property="og:title" content="标题" />
<meta property="og:description" content="描述" />
<meta property="og:image" content="图片地址" />
```

## 6. link 标签常用属性

```html
<!-- 引入 CSS -->
<link rel="stylesheet" href="style.css" />

<!-- 预加载关键资源 -->
<link rel="preload" href="main.js" as="script" />
<link rel="preconnect" href="https://api.example.com" />

<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />

<!-- 图标 -->
<link rel="icon" href="favicon.ico" />
<link rel="apple-touch-icon" href="icon.png" />
```

## 7. HTML5 新特性

### 新增语义化标签

```html
<header>
    、
    <footer>
        、
        <nav>
            、
            <main>
                、
                <article>
                    、
                    <section>
                        <aside>
                            、
                            <figure>
                                、
                                <figcaption>
                                    、<time>、<mark></mark></time>
                                </figcaption>
                            </figure>
                        </aside>
                    </section>
                </article>
            </main>
        </nav>
    </footer>
</header>
```

### 新增表单属性

```html
<input type="email" placeholder="邮箱" />
<input type="url" placeholder="网址" />
<input type="date" min="2020-01-01" />
<input type="number" min="0" max="100" step="10" />
<input required pattern="[A-Za-z]{3}" />
<input autofocus />
```

### 新增 API

```js
// 本地存储
localStorage.setItem("key", "value");
localStorage.getItem("key");
sessionStorage.setItem("key", "value");

// 地理定位
navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords.latitude);
});

// 拖拽 API
element.draggable = true;
element.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text", e.target.id);
});

// Canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.fillRect(0, 0, 100, 100);

// Web Worker
const worker = new Worker("worker.js");
worker.postMessage({ type: "start" });
worker.onmessage = (e) => console.log(e.data);
```

## 8. 本地存储对比

| 特性     | localStorage | sessionStorage | cookie         |
| -------- | ------------ | -------------- | -------------- |
| 容量     | 5MB          | 5MB            | 4KB            |
| 生命周期 | 永久         | 标签页关闭     | 可设置过期时间 |
| 作用域   | 同源         | 同源+同标签页  | 同源           |
| API      | 同步         | 同步           | 需手动处理     |

```js
// localStorage
localStorage.setItem("user", JSON.stringify({ name: "张三" }));
const user = JSON.parse(localStorage.getItem("user"));

// sessionStorage
sessionStorage.setItem("token", "abc123");
const token = sessionStorage.getItem("token");

// cookie
document.cookie = "token=abc123; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
```

## 9. 浏览器内核

| 浏览器  | 内核                 |
| ------- | -------------------- |
| Chrome  | Blink（WebKit 分支） |
| Safari  | WebKit               |
| Firefox | Gecko                |
| IE/Edge | Trident / Blink      |
| Opera   | Blink                |

### 渲染过程

```
HTML → Token → Node → DOM Tree
                   ↓
CSS → Rule → CSSOM Tree
                   ↓
            Render Tree → Layout → Paint → Composite
```

## 10. 浏览器存储机制

### 缓存策略

```
强缓存：
├── Cache-Control: max-age=3600
├── Expires: Thu, 01 Jan 2025 00:00:00 GMT
└── 不发送请求，直接使用缓存

协商缓存：
├── Last-Modified / If-Modified-Since
├── ETag / If-None-Match
└── 发送请求，304 则使用缓存
```

## 11. HTML 渲染优化

### 关键渲染路径优化

```html
<!-- CSS 放在 head，避免 FOUC -->
<link rel="stylesheet" href="critical.css" />

<!-- 非关键 CSS 异步加载 -->
<link rel="preload" href="non-critical.css" as="style" onload="this.rel='stylesheet'" />

<!-- JS 放在 body 末尾或使用 defer -->
<script src="app.js" defer></script>
```

### 减少渲染阻塞

```html
<!-- 内联关键 CSS -->
<style>
    .critical {
        color: red;
    }
</style>

<!-- 懒加载非首屏图片 -->
<img loading="lazy" src="image.jpg" alt="" />

<!-- 预加载关键资源 -->
<link rel="preload" href="font.woff2" as="font" crossorigin />
```

## 12. HTML 与 XHTML 区别

| 特性     | HTML         | XHTML    |
| -------- | ------------ | -------- |
| 语法     | 宽松         | 严格     |
| 标签     | 不区分大小写 | 必须小写 |
| 属性引号 | 可省略       | 必须引号 |
| 闭合标签 | 可省略       | 必须闭合 |
| DOCTYPE  | 可省略       | 必须声明 |

## 13. Canvas 与 SVG 对比

| 特性     | Canvas          | SVG            |
| -------- | --------------- | -------------- |
| 类型     | 位图            | 矢量图         |
| 渲染方式 | JavaScript 绘制 | DOM 操作       |
| 事件绑定 | 像素级别        | 元素级别       |
| 缩放     | 失真            | 无损           |
| 适用场景 | 游戏、图表      | 图标、图表     |
| 性能     | 大量元素时更好  | 少量元素时更好 |

```html
<!-- Canvas -->
<canvas id="canvas" width="500" height="300"></canvas>

<!-- SVG -->
<svg width="500" height="300">
    <rect x="10" y="10" width="100" height="100" fill="red" />
    <circle cx="250" cy="150" r="50" fill="blue" />
</svg>
```

## 14. 常见面试题

### DOCTYPE 声明的作用？

告诉浏览器按照哪种文档类型解析页面，影响浏览器的渲染模式。

### script 标签为什么放在 body 末尾？

避免脚本阻塞 HTML 解析，保证 DOM 元素在脚本执行时已存在。

### 为什么 HTML5 只需要写 DOCTYPE html？

HTML5 简化了语法，不再需要引用 DTD，自动进入标准模式。

### img 标签的 srcset 属性作用？

响应式图片，根据设备屏幕密度或宽度提供不同分辨率图片。

```html
<img src="small.jpg" srcset="small.jpg 1x, medium.jpg 2x, large.jpg 3x" alt="响应式图片" />
```

### 前端攻击及防范？

| 攻击类型 | 防范措施                     |
| -------- | ---------------------------- |
| XSS      | 转义 HTML 实体， CSP 配置    |
| CSRF     | Token 验证， SameSite Cookie |
| SQL 注入 | 参数化查询                   |
| 点击劫持 | X-Frame-Options 头           |

```html
<!-- 防止 XSS -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'" />

<!-- 防止点击劫持 -->
<meta http-equiv="X-Frame-Options" content="DENY" />
```
