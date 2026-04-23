# Canvas 面试指南

## 面试者视角回答

Canvas 是 HTML5 提供的绑定画布，通过 JavaScript 可以在 canvas 上绘制 2D/3D 图形、游戏、图表等。Canvas 本质上是一个位图画布，绘制后变成像素点，无法单独操作单个元素。

---

## 核心概念

### Canvas vs SVG

| 特性         | Canvas               | SVG                |
| ------------ | -------------------- | ------------------ |
| **渲染方式** | 位图（像素）         | 矢量（DOM）        |
| **元素操作** | 像素级控制           | 可操作单个元素     |
| **性能**     | 大批量绘制快         | 小批量操作快       |
| **内存**     | 一次声明，多次绘制   | 每个图形是独立 DOM |
| **适用场景** | 游戏、图表、图像处理 | UI 图表、图标      |
| **事件绑定** | 整个画布             | 单个图形           |

### Canvas 2D 渲染上下文

```javascript
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
```

---

## 基础绘图

### 绘制矩形

```javascript
// 填充矩形
ctx.fillStyle = "#FF5733";
ctx.fillRect(x, y, width, height);

// 描边矩形
ctx.strokeStyle = "#FF5733";
ctx.strokeRect(x, y, width, height);

// 清除区域
ctx.clearRect(x, y, width, height);
```

### 绘制路径

```javascript
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 200);
ctx.lineTo(100, 200);
ctx.closePath();
ctx.fillStyle = "blue";
ctx.fill();
ctx.strokeStyle = "red";
ctx.stroke();
```

### 绘制圆弧

```javascript
// arc(x, y, radius, startAngle, endAngle, anticlockwise)
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2, false);
ctx.fillStyle = "green";
ctx.fill();

// 绘制弧线
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI / 2, false);
ctx.stroke();
```

### 绘制文本

```javascript
ctx.font = "24px Arial";
ctx.fillStyle = "black";
ctx.textAlign = "center";
ctx.fillText("Hello Canvas", 100, 100);

ctx.strokeText("Hello Canvas", 100, 150);
```

### 绘制图片

```javascript
const img = new Image();
img.src = "/path/to/image.png";
img.onload = () => {
    ctx.drawImage(img, x, y);
    ctx.drawImage(img, x, y, width, height);
    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
};
```

---

## 样式和变换

### 颜色和透明度

```javascript
ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
ctx.globalAlpha = 0.5;
```

### 渐变

```javascript
// 线性渐变
const linearGradient = ctx.createLinearGradient(x1, y1, x2, y2);
linearGradient.addColorStop(0, "red");
linearGradient.addColorStop(1, "blue");
ctx.fillStyle = linearGradient;
ctx.fillRect(0, 0, 200, 200);

// 径向渐变
const radialGradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
radialGradient.addColorStop(0, "red");
radialGradient.addColorStop(1, "blue");
ctx.fillStyle = radialGradient;
ctx.fillRect(0, 0, 200, 200);
```

### 阴影

```javascript
ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 5;
ctx.shadowOffsetY = 5;
ctx.fillRect(10, 10, 100, 100);
```

### 变换

```javascript
// 平移
ctx.translate(100, 100);

// 旋转（弧度）
ctx.rotate(Math.PI / 4);

// 缩放
ctx.scale(2, 2);

// 保存和恢复状态
ctx.save();
ctx.translate(100, 100);
ctx.rotate(Math.PI / 4);
ctx.fillRect(0, 0, 50, 50);
ctx.restore();
```

---

## 动画实现

### 动画循环

```javascript
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update(); // 更新状态
    draw(); // 绘制画面

    requestAnimationFrame(animate);
}

function update() {
    ball.x += ball.vx;
    ball.y += ball.vy;
}

function draw() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}

animate();
```

### 完整动画示例 - 弹跳球

```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5,
    vy: 3,
    radius: 20,
    color: "#FF5733",
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.x += ball.vx;
    ball.y += ball.vy;

    // 边界检测
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx = -ball.vx;
    }
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.vy = -ball.vy;
    }

    drawBall();
    requestAnimationFrame(update);
}

update();
```

---

## 高级绘图

### 贝塞尔曲线

```javascript
// 二次贝塞尔曲线
ctx.beginPath();
ctx.moveTo(20, 100);
ctx.quadraticCurveTo(100, 20, 180, 100);
ctx.stroke();

// 三次贝塞尔曲线
ctx.beginPath();
ctx.moveTo(20, 100);
ctx.bezierCurveTo(60, 20, 140, 20, 180, 100);
ctx.stroke();
```

### 像素操作

```javascript
// 获取像素数据
const imageData = ctx.getImageData(x, y, width, height);
const data = imageData.data; // Uint8ClampedArray

// 修改像素
for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // R
    data[i + 1] = 255 - data[i + 1]; // G
    data[i + 2] = 255 - data[i + 2]; // B
}

// 放回画布
ctx.putImageData(imageData, x, y);
```

### 裁剪区域

```javascript
ctx.save();
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.clip();

ctx.fillStyle = "red";
ctx.fillRect(0, 0, 200, 200);
ctx.restore();
```

---

## 性能优化

### 1. 避免每帧创建新对象

```javascript
// 不好：每帧创建渐变
function draw() {
    const gradient = ctx.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "blue");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
}

// 好：预创建渐变
const gradient = ctx.createLinearGradient(0, 0, 200, 0);
gradient.addColorStop(0, "red");
gradient.addColorStop(1, "blue");

function draw() {
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
}
```

### 2. 分层画布

```html
<canvas id="bg" style="z-index: 1;"></canvas> <canvas id="fg" style="z-index: 2;"></canvas>
```

```javascript
const bgCanvas = document.getElementById("bg");
const bgCtx = bgCanvas.getContext("2d");
const fgCanvas = document.getElementById("fg");
const fgCtx = fgCanvas.getContext("2d");
```

### 3. 使用离屏 canvas

```javascript
const offscreen = document.createElement("canvas");
offscreen.width = 100;
offscreen.height = 100;
const offCtx = offscreen.getContext("2d");

offCtx.beginPath();
offCtx.arc(50, 50, 50, 0, Math.PI * 2);
offCtx.fillStyle = "red";
offCtx.fill();

// 每帧只需 drawImage
function draw() {
    ctx.drawImage(offscreen, 0, 0);
}
```

### 4. 批量绘制

```javascript
// 不好：逐个绘制
for (let i = 0; i < circles.length; i++) {
    ctx.beginPath();
    ctx.arc(circles[i].x, circles[i].y, circles[i].r, 0, Math.PI * 2);
    ctx.fill();
}

// 好：使用路径批量绘制
ctx.beginPath();
for (let i = 0; i < circles.length; i++) {
    ctx.moveTo(circles[i].x + circles[i].r, circles[i].y);
    ctx.arc(circles[i].x, circles[i].y, circles[i].r, 0, Math.PI * 2);
}
ctx.fill();
```

---

## 常用技巧

### 1. 绘制圆角矩形

```javascript
function roundRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.stroke();
}
```

### 2. 绘制虚线

```javascript
ctx.setLineDash([10, 5]); // [实线长度, 间隙长度]
ctx.lineDashOffset = -offset; // 动画效果
ctx.strokeRect(0, 0, 200, 200);
```

### 3. 文字居中

```javascript
ctx.font = "24px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Center", canvas.width / 2, canvas.height / 2);
```

### 4. 渐变文字

```javascript
ctx.font = "48px Arial";
ctx.fillText("Gradient", 100, 100);

ctx.globalCompositeOperation = "source-in";
const gradient = ctx.createLinearGradient(100, 0, 300, 0);
gradient.addColorStop(0, "red");
gradient.addColorStop(1, "blue");
ctx.fillStyle = gradient;
ctx.fillText("Gradient", 100, 100);
```

---

## 面试题精选

### 面试题 1：Canvas 的渲染原理是什么？

**参考答案：**

Canvas 的渲染原理基于以下机制：

**1. 立即模式渲染**

- Canvas 采用立即模式（Immediate Mode）
- 每帧绘制时，JavaScript 命令直接写入像素缓冲区
- 绘制完成后，画布上只有位图数据，无法单独操作单个图形

**2. 渲染流程**

```
JavaScript API 调用 → Canvas 2D 上下文 → 命令解析 → GPU 绘制 → 像素缓冲区更新
```

**3. 重绘机制**

```javascript
// 每次绘制前需要清空画布
ctx.clearRect(0, 0, canvas.width, canvas.height);

// 然后重新绘制所有元素
// （因为清除后元素就消失了）
```

**4. requestAnimationFrame**

```javascript
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新状态
    ball.x += ball.vx;

    // 重新绘制
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(render);
}
```

---

### 面试题 2：Canvas 和 SVG 的区别？如何选择？

**参考答案：**

**核心区别：**

| 维度             | Canvas         | SVG            |
| ---------------- | -------------- | -------------- |
| **渲染机制**     | 位图，依赖 CPU | 矢量，依赖 DOM |
| **单个元素操作** | 不支持         | 支持           |
| **事件绑定**     | 整个画布       | 单个图形       |
| **渲染性能**     | 大量元素时快   | 少量元素时快   |
| **内存占用**     | 恒定           | 元素越多越大   |
| **缩放**         | 失真/模糊      | 保持清晰       |

**性能对比场景：**

```javascript
// Canvas 适合：1000+ 元素
function drawManyCircles() {
    for (let i = 0; i < 10000; i++) {
        ctx.beginPath();
        ctx.arc(random(), random(), 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// SVG 适合：需要交互的少量元素
// <circle cx="100" cy="100" r="50" onclick="handleClick()" />
```

**选择建议：**

- **用 Canvas**：游戏、图表（ECharts）、图像处理、数据可视化（大量数据点）
- **用 SVG**：UI 组件、图标、地图、图表（少量元素需交互）

---

### 面试题 3：如何实现 Canvas 高清屏适配？

**参考答案：**

高清屏（Retina）下 Canvas 会出现模糊问题，因为屏幕像素比（dpr）大于 1。

**问题原因：**

- dpr = 2 时，1 个 CSS 像素对应 4 个物理像素
- 如果 Canvas 宽 300px，实际需要 600px 才能清晰

**解决方案：**

```javascript
const canvas = document.getElementById("canvas");
const dpr = window.devicePixelRatio || 1;
const width = 300;
const height = 200;

// 设置 canvas 实际像素
canvas.width = width * dpr;
canvas.height = height * dpr;

// 设置 CSS 尺寸
canvas.style.width = width + "px";
canvas.style.height = height + "px";

// 缩放上下文
ctx.scale(dpr, dpr);

// 现在绘制时使用 CSS 尺寸
ctx.fillRect(0, 0, width, height);
```

**封装为工具函数：**

```javascript
function setupCanvas(canvas, width, height) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    return ctx;
}
```

---

### 面试题 4：Canvas 的性能优化有哪些方法？

**参考答案：**

**1. 避免在绘制循环中创建对象**

```javascript
// 不好
function animate() {
    const gradient = ctx.createLinearGradient(0, 0, 500, 0);
    // 每帧创建新对象
}

// 好：预创建
const gradient = ctx.createLinearGradient(0, 0, 500, 0);
function animate() {
    ctx.fillStyle = gradient;
}
```

**2. 使用离屏 Canvas 缓存**

```javascript
const offscreen = document.createElement('canvas');
offscreen.width = 100;
offscreen.height = 100;
const offCtx = offscreen.getContext('2d');

// 复杂图形预渲染一次
offCtx.drawImage(...);

function render() {
    ctx.drawImage(offscreen, x, y);
}
```

**3. 分层渲染**

```html
<div class="canvas-container">
    <canvas id="static"></canvas>
    <!-- 背景层 -->
    <canvas id="dynamic"></canvas>
    <!-- 前景层 -->
</div>
```

**4. 批量绘制**

```javascript
// 减少 beginPath 调用
ctx.beginPath();
for (const circle of circles) {
    ctx.moveTo(circle.x + circle.r, circle.y);
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
}
ctx.fill();
```

**5. 使用 requestAnimationFrame**

```javascript
// 好
function render() {
    requestAnimationFrame(render);
}

// 不好
setInterval(render, 16);
```

---

### 面试题 5：如何实现 Canvas 图片压缩？

**参考答案：**

**基础压缩方法：**

```javascript
function compressImage(file, quality = 0.8, maxWidth = 1920) {
    return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement("canvas");
            let { width, height } = img;

            // 等比缩放
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // 输出为 Blob
            canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
        };
    });
}
```

**自定义压缩算法：**

```javascript
function compressWithQuality(imageData, quality = 0.5) {
    const data = imageData.data;
    const factor = quality;

    for (let i = 0; i < data.length; i += 4) {
        // 降低颜色精度实现压缩
        data[i] = Math.round(data[i] / factor) * factor;
        data[i + 1] = Math.round(data[i + 1] / factor) * factor;
        data[i + 2] = Math.round(data[i + 2] / factor) * factor;
    }

    return imageData;
}
```

---

### 面试题 6：Canvas 绘制饼图如何实现？

**参考答案：**

```javascript
function drawPieChart(data, labels, colors) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    const total = data.reduce((sum, val) => sum + val, 0);
    let startAngle = -Math.PI / 2;

    data.forEach((value, i) => {
        const sliceAngle = (value / total) * Math.PI * 2;

        // 绘制扇形
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();

        // 绘制文字
        const midAngle = startAngle + sliceAngle / 2;
        const textX = centerX + (radius / 2) * Math.cos(midAngle);
        const textY = centerY + (radius / 2) * Math.sin(midAngle);
        const percentage = Math.round((value / total) * 100);

        ctx.fillStyle = "#fff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${percentage}%`, textX, textY);

        startAngle += sliceAngle;
    });
}

// 使用示例
drawPieChart([300, 150, 100, 50], ["A", "B", "C", "D"], ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]);
```

---

### 面试题 7：如何实现 Canvas 图像拖拽？

**参考答案：**

```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isDragging = false;
let dragTarget = null;
let offsetX = 0;
let offsetY = 0;

const shapes = [
    { x: 100, y: 100, width: 80, height: 80, color: "red" },
    { x: 200, y: 200, width: 80, height: 80, color: "blue" },
];

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape, index) => {
        ctx.fillStyle = shape.color;
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    });
}

function getShape(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
        const s = shapes[i];
        if (x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height) {
            return s;
        }
    }
    return null;
}

canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const shape = getShape(x, y);
    if (shape) {
        isDragging = true;
        dragTarget = shape;
        offsetX = x - shape.x;
        offsetY = y - shape.y;
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    dragTarget.x = x - offsetX;
    dragTarget.y = y - offsetY;
    draw();
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
    dragTarget = null;
});

draw();
```

---

### 面试题 8：Canvas 如何实现文字水印？

**参考答案：**

```javascript
function addWatermark(text) {
    ctx.save();

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#000";
    ctx.font = "24px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";

    // 右下角水印
    ctx.fillText(text, canvas.width - 20, canvas.height - 20);

    // 平铺水印
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);

    const textWidth = ctx.measureText(text).width;
    const gap = 200;

    for (let y = -canvas.height; y < canvas.height * 2; y += gap) {
        for (let x = -canvas.width; x < canvas.width * 2; x += textWidth + gap) {
            ctx.fillText(text, x, y);
        }
    }

    ctx.restore();
    ctx.restore();
}

// 使用
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#333";
ctx.font = "16px Arial";
ctx.fillText("内容区域", 50, 50);
addWatermark("仅供内测使用");
```

---

### 面试题 9：Canvas 圆形头像如何实现？

**参考答案：**

```javascript
function drawCircleImage(img, x, y, radius) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // 计算缩放以填充圆形
    const size = Math.max(img.width, img.height);
    const scaleX = size / img.width;
    const scaleY = size / img.height;
    const scale = Math.max(scaleX, scaleY);

    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const drawX = x - drawWidth / 2;
    const drawY = y - drawHeight / 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    ctx.restore();
}

// 完整示例
const img = new Image();
img.onload = () => {
    drawCircleImage(img, 100, 100, 50);
};
img.src = "/avatar.jpg";
```

---

### 面试题 10：Canvas 模糊问题如何解决？

**参考答案：**

**问题原因：**

- Retina 屏幕的 devicePixelRatio 为 2 或更高
- 如果 canvas 宽 200px，实际渲染 400 个物理像素
- 图像被压缩到 200px 显示，造成模糊

**解决方案：**

```javascript
function setupHighDPICanvas(canvas, width, height) {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    return ctx;
}

// 使用
const canvas = document.getElementById("canvas");
const ctx = setupHighDPICanvas(canvas, 400, 300);

// 绘制将保持清晰
ctx.fillStyle = "red";
ctx.fillRect(0, 0, 400, 300);
```

**图像绘制时额外注意：**

```javascript
function drawImageHighDPI(img, x, y, width, height) {
    const dpr = window.devicePixelRatio || 1;
    ctx.drawImage(img, x * dpr, y * dpr, width * dpr, height * dpr);
}
```
