# SVG 深入指南

## 核心概念与原理

### 1. SVG 是什么？有哪些核心特性？

SVG（Scalable Vector Graphics）是一种基于 XML 的矢量图形格式，用于描述二维矢量图形。与传统的位图图像不同，SVG 图形可以无限缩放而不失真。

**核心特性：**

- **矢量特性**：基于数学描述的矢量图形，支持无损缩放
- **DOM 操作**：每个 SVG 元素都是 DOM 节点，可被 JavaScript 操作
- **事件系统**：支持完整的鼠标、键盘事件
- **样式控制**：可通过 CSS 和 SVG 属性两种方式设置样式
- **动画支持**：支持 SMIL 动画和 CSS 动画两种方式
- **可访问性**：内置 title、desc、role 等可访问性属性
- **文件体积**：通常比位图小，尤其适合简单图形
- **搜索引擎友好**：文本内容可被搜索引擎索引

### 2. SVG 与 Canvas 的区别是什么？

```
┌─────────────────────────────────────────────────────────────────┐
│                      SVG vs Canvas                              │
├─────────────────────────────────────────────────────────────────┤
│  类型        │  矢量图形           │  位图/光栅图形                 │
│  渲染方式    │  DOM 渲染           │  JavaScript 画布绑定           │
│  缩放       │  无损缩放           │  失真缩放                       │
│  事件处理   │  元素级事件         │  基于坐标的点击检测               │
│  性能       │  大量元素时较慢     │  大量元素时性能更好               │
│  适用场景   │  图标、图表、UI     │  游戏、数据可视化、图像处理         │
│  动画       │  声明式/程序式      │  程序式                         │
│  文件大小   │  简单图形更小       │  复杂场景更小                     │
└─────────────────────────────────────────────────────────────────┘

```

**性能对比详解：**

| 场景               | SVG                     | Canvas          |
| ------------------ | ----------------------- | --------------- |
| 少量元素（<1000）  | ✅ 更好（DOM 操作便捷） | 一般            |
| 大量元素（>10000） | ❌ 性能差               | ✅ 更好         |
| 频繁更新           | ❌ 频繁重绘 DOM         | ✅ 更高性能     |
| 静态图像           | ✅ 清晰可缩放           | 一般            |
| 交互需求           | ✅ 元素级事件           | ❌ 需要手动检测 |

### 3. SVG 的坐标系统是怎样的？

```
┌────────────────────────────────────┐
│  SVG 坐标系                        │
│                                    │
│  原点 (0,0) 在左上角               │
│                                    │
│  +X → 向右延伸                     │
│  +Y ↓ 向下延伸                     │
│                                    │
│  ┌───────────────────────────→ X  │
│  │  (0,0)                     │  │
│  │     ┌─────────┐             │  │
│  │     │  viewBox │            │  │
│  │     │   100    │            │  │
│  │     │   100    │            │  │
│  │     └─────────┘             │  │
│  ↓                              │  │
│  Y                               │  │
└────────────────────────────────────┘
```

```xml
<svg width="500" height="300" viewBox="0 0 100 100">
  <!-- viewBox="minX minY width height" -->
  <!-- 图形会在 500x300 的画布上渲染 100x100 的内容 -->
</svg>
```

**viewBox 变换原理：**

```xml
<!-- 原始坐标系 -->
<svg width="200" height="200" viewBox="0 0 100 100">
  <rect x="10" y="10" width="30" height="30"/>
</svg>

<!-- 缩放后的坐标系 -->
<svg width="200" height="200" viewBox="0 0 50 50">
  <!-- 同样大小的矩形，但坐标系统被缩放了 -->
  <rect x="10" y="10" width="30" height="30"/>
</svg>
```

### 4. SVG 的基本图形元素有哪些？

```xml
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- 矩形 -->
  <rect x="10" y="10" width="100" height="50" rx="5" ry="5"/>

  <!-- 圆形 -->
  <circle cx="180" cy="35" r="25"/>

  <!-- 椭圆 -->
  <ellipse cx="280" cy="35" rx="40" ry="20"/>

  <!-- 直线 -->
  <line x1="10" y1="80" x2="100" y2="130" stroke="black"/>

  <!-- 折线 -->
  <polyline points="120,80 150,130 180,80 210,130" fill="none" stroke="black"/>

  <!-- 多边形 -->
  <polygon points="250,80 280,130 310,80 340,130 370,80" fill="none" stroke="black"/>

  <!-- 路径 -->
  <path d="M 10 150 L 50 180 Q 75 200 100 180 T 150 150" fill="none" stroke="black"/>
</svg>
```

**路径命令详解：**

```xml
<!-- 路径命令语法 -->
<path d="
  M x y    // MoveTo 移动到
  L x y    // LineTo 画线到
  H x      // Horizontal line 水平线
  V y      // Vertical line 垂直线
  Q x1 y1 x y    // Quadratic curve 二次贝塞尔曲线
  C x1 y1 x2 y2 x y  // Cubic curve 三次贝塞尔曲线
  T x y    // Smooth quadratic 三次贝塞尔曲线的简写
  A rx ry x-axis-rotation large-arc-flag sweep-flag x y  // Arc 圆弧
  Z        // Close path 闭合路径
"/>
```

## 常用元素与属性

### 5. 如何使用 `<g>` 元素进行分组？

```xml
<svg width="300" height="200">
  <g id="group1" fill="red" stroke="blue" stroke-width="2">
    <!-- 分组内的元素会继承这些属性 -->
    <rect x="10" y="10" width="50" height="50"/>
    <circle cx="80" cy="35" r="25"/>
    <!-- 子元素可以覆盖父元素属性 -->
    <rect x="120" y="10" width="50" height="50" fill="green"/>
  </g>

  <!-- 变换示例 -->
  <g transform="translate(150, 100) rotate(45)">
    <rect x="-25" y="-25" width="50" height="50" fill="purple"/>
  </g>
</svg>
```

### 6. SVG 的渐变和图案填充

```xml
<svg width="400" height="200">
  <!-- 线性渐变 -->
  <defs>
    <linearGradient id="linearGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="red"/>
      <stop offset="50%" stop-color="yellow"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>

    <!-- 径向渐变 -->
    <radialGradient id="radialGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="black"/>
    </radialGradient>

    <!-- 图案填充 -->
    <pattern id="pattern1" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#ddd"/>
      <circle cx="10" cy="10" r="5" fill="blue"/>
    </pattern>
  </defs>

  <!-- 使用渐变 -->
  <rect x="10" y="10" width="100" height="100" fill="url(#linearGrad)"/>
  <circle cx="200" cy="60" r="50" fill="url(#radialGrad)"/>
  <rect x="280" y="10" width="100" height="100" fill="url(#pattern1)"/>
</svg>
```

### 7. SVG 裁剪与遮罩

```xml
<svg width="400" height="200">
  <defs>
    <!-- 裁剪路径 -->
    <clipPath id="circleClip">
      <circle cx="50" cy="50" r="40"/>
    </clipPath>

    <!-- 遮罩（可实现渐变透明效果） -->
    <mask id="gradientMask">
      <rect width="100" height="100" fill="url(#maskGrad)"/>
    </mask>

    <linearGradient id="maskGrad">
      <stop offset="0%" stop-color="white"/>
      <stop offset="100%" stop-color="black"/>
    </linearGradient>
  </defs>

  <!-- 应用裁剪 -->
  <g clip-path="url(#circleClip)">
    <rect x="10" y="10" width="100" height="100" fill="red"/>
    <rect x="30" y="30" width="100" height="100" fill="blue"/>
  </g>

  <!-- 应用遮罩 -->
  <rect x="200" y="10" width="100" height="100" fill="green" mask="url(#gradientMask)"/>
</svg>
```

### 8. SVG 滤镜效果

```xml
<svg width="500" height="300">
  <defs>
    <!-- 高斯模糊 -->
    <filter id="blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
    </filter>

    <!-- 投影效果 -->
    <filter id="shadow">
      <feDropShadow dx="3" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.5)"/>
    </filter>

    <!-- 颜色矩阵 -->
    <filter id="grayscale">
      <feColorMatrix type="matrix" values="
        0.33 0.33 0.33 0 0
        0.33 0.33 0.33 0 0
        0.33 0.33 0.33 0 0
        0    0    0    1 0"/>
    </filter>

    <!-- 混合模式 -->
    <filter id="lighten">
      <feBlend in="SourceGraphic" in2="BackgroundImage" mode="lighten"/>
    </filter>

    <!-- 复杂滤镜组合 -->
    <filter id="complex">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 1 0" result="colored"/>
      <feComposite in="colored" in2="SourceGraphic" operator="over"/>
    </filter>
  </defs>

  <rect x="10" y="10" width="100" height="100" fill="red" filter="url(#blur)"/>
  <rect x="130" y="10" width="100" height="100" fill="blue" filter="url(#shadow)"/>
  <rect x="250" y="10" width="100" height="100" fill="green" filter="url(#grayscale)"/>
</svg>
```

## SVG 动画

### 9. SMIL 动画详解

```xml
<svg width="400" height="200">
  <!-- 基础动画 -->
  <rect x="10" y="10" width="50" height="50">
    <!-- 位置动画 -->
    <animate attributeName="x" from="10" to="300" dur="3s" repeatCount="indefinite"/>

    <!-- 颜色动画 -->
    <animate attributeName="fill" values="red;green;blue;red" dur="5s" repeatCount="indefinite"/>

    <!-- 缩放动画 -->
    <animateTransform attributeName="transform" type="scale" from="1" to="2" dur="2s" repeatCount="indefinite"/>
  </rect>

  <!-- 路径动画 -->
  <circle r="10" fill="orange">
    <animateMotion path="M 10,100 Q 200,10 390,100 T 770,100" dur="5s" repeatCount="indefinite"/>
  </circle>

  <!-- 渐变动画 -->
  <rect x="200" y="10" width="100" height="100">
    <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
  </rect>

  <!-- 关键帧动画 -->
  <circle cx="50" cy="150" r="20">
    <animate attributeName="cy" values="150;50;150" keyTimes="0;0.5;1" dur="3s" repeatCount="indefinite"/>
  </circle>
</svg>
```

### 10. CSS 动画与 SVG 结合

```css
/* SVG CSS 动画 */
@keyframes move {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(300px);
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(1.2);
    }
}

@keyframes dash {
    to {
        stroke-dashoffset: 0;
    }
}

.svg-animate {
    animation: move 3s ease-in-out infinite;
}

.svg-pulse {
    animation: pulse 2s ease-in-out infinite;
}

.svg-path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: dash 3s ease-out forwards;
}
```

```xml
<svg width="400" height="200">
  <rect class="svg-animate" x="10" y="10" width="50" height="50" fill="red"/>
  <circle class="svg-pulse" cx="200" cy="100" r="30" fill="blue"/>
  <path class="svg-path" d="M 10,150 L 100,50 L 200,150 L 300,50" fill="none" stroke="green" stroke-width="5"/>
</svg>
```

### 11. JavaScript 动态操作 SVG

```javascript
// 创建 SVG 元素
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", "400");
svg.setAttribute("height", "200");

// 创建矩形
const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
rect.setAttribute("x", "10");
rect.setAttribute("y", "10");
rect.setAttribute("width", "100");
rect.setAttribute("height", "100");
rect.setAttribute("fill", "red");

svg.appendChild(rect);

// 添加事件监听
rect.addEventListener("click", (e) => {
    e.target.setAttribute("fill", "blue");
    console.log("Clicked!", e.target.tagName);
});

// 动态动画
let frame = 0;
function animate() {
    frame++;
    rect.setAttribute("x", 10 + frame);
    if (frame < 290) {
        requestAnimationFrame(animate);
    }
}
requestAnimationFrame(animate);

// 操作路径
const path = document.querySelector("path");
const length = path.getTotalLength();
console.log("Path length:", length);

// 获取路径上的点
const point = path.getPointAtLength(100);
console.log("Point at 100:", point.x, point.y);
```

## 文本与字体

### 12. SVG 文本处理

```xml
<svg width="400" height="300">
  <!-- 基础文本 -->
  <text x="10" y="30" font-size="20" fill="black">
    Hello SVG Text
  </text>

  <!-- 文本定位 -->
  <text x="200" y="30" text-anchor="middle" font-size="20">
    居中文本
  </text>

  <!-- 垂直对齐 -->
  <text x="300" y="30" dominant-baseline="middle" font-size="20">
    垂直居中
  </text>

  <!-- 文本路径 -->
  <defs>
    <path id="textPath" d="M 10,100 Q 100,50 200,100 T 390,100"/>
  </defs>
  <text font-size="16">
    <textPath href="#textPath">
      沿着路径排列的文本内容
    </textPath>
  </text>

  <!-- 分段样式 -->
  <text x="10" y="180" font-size="20">
    <tspan fill="red">红色</tspan>
    <tspan fill="blue" dx="5">蓝色</tspan>
    <tspan fill="green" dy="20">换行</tspan>
  </text>

  <!-- 文字间距 -->
  <text x="10" y="250" letter-spacing="5">字符间距</text>
  <text x="10" y="280" word-spacing="20">单词间距</text>
</svg>
```

### 13. SVG foreignObject 嵌入 HTML

```xml
<svg width="400" height="300">
  <!-- 使用 foreignObject 嵌入 HTML 内容 -->
  <foreignObject x="10" y="10" width="200" height="200">
    <div xmlns="http://www.w3.org/1999/xhtml" style="
      font-size: 14px;
      font-family: Arial, sans-serif;
      color: #333;
      padding: 10px;
      background: #f0f0f0;
      border-radius: 8px;
    ">
      <h1>HTML in SVG</h1>
      <p>这里可以放置任意的 HTML 内容</p>
      <ul>
        <li>列表项 1</li>
        <li>列表项 2</li>
      </ul>
    </div>
  </foreignObject>

  <!-- 组合使用 -->
  <circle cx="300" cy="150" r="80" fill="rgba(255,0,0,0.2)"/>
  <foreignObject x="250" y="120" width="100" height="60">
    <div xmlns="http://www.w3.org/1999/xhtml" style="
      text-align: center;
      line-height: 60px;
      font-weight: bold;
    ">
      叠加文字
    </div>
  </foreignObject>
</svg>
```

## 面试精选问题

### 问题一：SVG 优缺点分析

**答案要点**：

**优点：**

1. **可缩放性**：无限缩放而不失真，适合响应式设计
2. **文件体积小**：对于简单图形，比 PNG/JPG 小得多
3. **可编辑性**：直接修改 DOM 即可改变图形
4. **可脚本化**：完整的 DOM API 支持
5. **可访问性**：内置 ARIA 属性支持
6. **搜索引擎友好**：文本内容可被索引
7. **动画支持**：内置 SMIL 动画和 CSS 动画
8. **样式灵活**：支持 CSS 和 SVG 属性两种样式设置

**缺点：**

1. **渲染性能**：大量元素时性能不如 Canvas
2. **复杂图形**：复杂渐变和滤镜时文件较大
3. **浏览器兼容**：旧版浏览器可能不支持某些特性
4. **DOM 开销**：每个元素都是 DOM 节点，有一定内存开销
5. **学习曲线**：路径语法相对复杂

### 问题二：如何优化 SVG 性能？

**答案要点**：

```javascript
// 1. 简化路径
// 使用简化的路径数据
path.setAttribute('d', 'M0 0 L100 100'); // 尽量减少点数

// 2. 合并路径
// 多个相同填充的路径尽量合并
// 使用 <g> 批量设置属性

// 3. 避免动画时重排
// 使用 transform 代替 x、y 属性动画
// transform: translate() 性能优于 x、y

// 4. 使用 will-change 提示浏览器
.svg-element {
  will-change: transform;
  will-change: opacity;
}

// 5. 懒加载大型 SVG
<svg>
  <switch>
    <g systemLanguage="es">
      <!-- 西班牙语版本 -->
    </g>
    <g>
      <!-- 默认版本 -->
    </g>
  </switch>
</svg>

// 6. 优化滤镜
// 避免在动画中使用复杂滤镜
// 使用简单的滤镜效果

// 7. 使用 CSS 动画代替 SMIL
// CSS 动画性能更好，也更易维护

// 8. 批量操作
const svg = document.querySelector('svg');
const fragments = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const rect = createRect(i);
  fragments.appendChild(rect);
}
svg.appendChild(fragments); // 只触发一次重绘
```

### 问题三：SVG 动画与 CSS 动画的区别？

**答案要点**：

| 特性            | SMIL 动画  | CSS 动画   |
| --------------- | ---------- | ---------- |
| 语法            | XML 声明式 | CSS 代码式 |
| JavaScript 控制 | 有限       | 完全支持   |
| 路径动画        | 原生支持   | 需要 JS 库 |
| 暂停/播放       | 不支持     | 完全支持   |
| 浏览器支持      | 逐渐弃用   | 广泛支持   |
| 性能            | 一般       | 更好       |
| 复杂动画        | 较难       | 更容易     |

**SMIL 独有特性：**

```xml
<!-- 路径动画（CSS 难以实现） -->
<animateMotion path="M0,0 Q50,50 100,0" dur="2s"/>

<!-- 沿元素形状动画 -->
<animate attributeName="d"
  values="M0,0;L100,0;L100,100;L0,100;Z"
  dur="3s"/>

<!-- 关键帧细分 -->
<animate attributeName="opacity"
  values="0;0;1;0;1;0"
  keyTimes="0;0.2;0.4;0.6;0.8;1"/>
```

**CSS 动画独有特性：**

```css
/* 暂停/播放控制 */
.animated {
    animation-play-state: paused; /* 或 running */
}

/* 动画填充模式 */
.animated {
    animation-fill-mode: forwards; /* 保持最后一帧 */
}

/* 多动画组合 */
.animated {
    animation:
        fadeIn 1s,
        slide 1s,
        scale 1s;
}
```

### 问题四：SVG 图标最佳实践

**答案要点**：

```xml
<!-- 1. 使用 viewBox 标准化 -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
  <path d="M2 17l10 5 10-5"/>
  <path d="M2 12l10 5 10-5"/>
</svg>

<!-- 2. 使用 currentColor 实现颜色继承 -->
<svg class="icon" fill="currentColor">
  <!-- 图标会自动继承文字颜色 -->
</svg>

<!-- 3. 使用 <symbol> 定义可复用图标 -->
<svg>
  <defs>
    <symbol id="icon-home" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    </symbol>
  </defs>

  <!-- 使用 -->
  <use href="#icon-home" x="10" y="10" width="24" height="24"/>
  <use href="#icon-home" x="50" y="10" width="24" height="24"/>
</svg>
```

**图标系统实现：**

```javascript
// SVG Sprites 自动化
// svg-sprite-loader 配置
// webpack.config.js
{
  test: /\.svg$/,
  use: [{
    loader: 'svg-sprite-loader',
    options: {
      symbolId: 'icon-[name]'
    }
  }]
}

// 使用
// <svg><use href="#icon-home"></use></svg>
```

### 问题五：SVG 可访问性如何实现？

**答案要点**：

```xml
<!-- 基本可访问性 -->
<svg role="img" aria-labelledby="title desc">
  <title id="title">图表标题</title>
  <desc id="desc">详细描述图表内容</desc>
  <!-- 图形内容 -->
</svg>

<!-- 图表可访问性 -->
<svg role="img" aria-labelledby="chartTitle chartDesc">
  <title id="chartTitle">2024年销售数据</title>
  <desc id="chartDesc">柱状图显示 Q1-Q4 销售额分别为 100万、120万、90万、150万</desc>

  <rect role="graphics-symbol" aria-label="Q1 销售额100万"/>
  <rect role="graphics-symbol" aria-label="Q2 销售额120万"/>
  <rect role="graphics-symbol" aria-label="Q3 销售额90万"/>
  <rect role="graphics-symbol" aria-label="Q4 销售额150万"/>
</svg>

<!-- 键盘导航 -->
<svg>
  <g tabindex="0" role="button" aria-label="关闭按钮">
    <circle cx="10" cy="10" r="8" @click="close"/>
    <path d="M6,6 L14,14 M14,6 L6,14"/>
  </g>
</svg>

<!-- 焦点管理 -->
<svg>
  <g tabindex="0"
     @keydown.enter="handleSelect"
     @keydown.space.prevent="handleSelect">
    <!-- 可交互元素 -->
  </g>
</svg>
```

### 问题六：SVG 与 CSS 的交互方式

**答案要点**：

```css
/* SVG 样式继承 */
svg {
    color: blue; /* currentColor 会继承这个颜色 */
    fill: currentColor; /* 使用 currentColor */
}

/* CSS 变量在 SVG 中的应用 */
svg {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
}

.rect {
    fill: var(--primary-color);
}

/* CSS 伪类 */
svg rect:hover {
    fill: red;
}

/* CSS 动画 */
@keyframes fillChange {
    0% {
        fill: #3498db;
    }
    50% {
        fill: #e74c3c;
    }
    100% {
        fill: #3498db;
    }
}

svg rect {
    animation: fillChange 2s infinite;
}
```

```javascript
// JavaScript 动态修改样式
const rect = document.querySelector("rect");

// 获取计算样式
const style = getComputedStyle(rect);
console.log(style.fill);

// 修改 CSS 变量
rect.style.setProperty("--my-color", "red");
rect.style.getPropertyValue("--my-color");

// 操作 class
rect.classList.add("active");
rect.classList.remove("hidden");
rect.classList.toggle("selected");
```

## 最佳实践

### SVG 文件组织

```
public/
├── icons/
│   ├── home.svg          # 独立图标文件
│   ├── user.svg
│   └── settings.svg
└── illustrations/
    ├── hero-image.svg    # 插图
    └── background.svg    # 背景图案

src/
├── components/
│   └── Icon/
│       ├── Icon.vue
│       └── icons/        # 内联 SVG
│           ├── Home.vue
│           └── User.vue
└── assets/
    └── sprites/
        └── icons.svg     # SVG Sprite
```

### SVG 优化工具

```bash
# SVGO 命令行优化
npx svgo input.svg -o output.svg

# 批量优化
npx svgo -f ./icons --ext .optimized.svg

# GUI 工具
# - SVGO (Node.js)
# - SVGOMG (在线)
# - Figma export

# 优化配置
# svgo.config.js
module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false, // 保留 viewBox
          cleanupIDs: false     // 保留有意义的 ID
        }
      }
    },
    'removeDimensions',        // 移除 width/height
    'removeXMLProcInst',        // 移除 XML 声明
    'removeComments'           // 移除注释
  ]
}
```

### 响应式 SVG

```xml
<!-- 方式一：移除宽高，使用 viewBox -->
<svg viewBox="0 0 100 100" class="responsive-svg">
  <circle cx="50" cy="50" r="40"/>
</svg>

<style>
.responsive-svg {
  width: 100%;
  height: auto; /* 保持宽高比 */
  max-width: 200px;
}
</style>

<!-- 方式二：使用 preserveAspectRatio -->
<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
  <!-- meet: 完整显示，meet 是默认 -->
  <!-- slice: 填充整个区域 -->
  <!-- none: 不保持比例 -->
</svg>

<!-- 方式三：多个分辨率 -->
<svg>
  <switch>
    <g systemLanguage="en">
      <!-- 英文版本 -->
    </g>
    <g>
      <!-- 默认 -->
    </g>
  </switch>
</svg>
```
