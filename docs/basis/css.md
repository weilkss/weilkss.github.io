# CSS

## 1. 盒模型

盒模型是 CSS 中最基础的概念，定义了元素在页面中所占据的空间。由四部分组成：content、padding、border、margin。

**两种盒模型：**

| 类型             | 计算方式                           |
| ---------------- | ---------------------------------- |
| 标准盒模型       | width = content                    |
| IE（替代）盒模型 | width = content + padding + border |

```css
/* 标准盒模型 */
box-sizing: content-box;

/* IE 盒模型 */
box-sizing: border-box;
```

**推荐：** 面试时大多数公司都要求使用 `border-box`

## 2. BFC（块级格式化上下文）

BFC 是一个独立的渲染区域，其中的元素按一定规则布局。

### BFC 触发条件

- 根元素 html
- `float` 不是 none
- `position` 不是 static 或 relative
- `overflow` 不是 visible
- `display` 是 inline-block、table-cell、flex、table-caption、inline-flex

### BFC 特性

- Box 垂直方向依次放置
- 同一 BFC 的相邻 Box 的 margin 会重叠
- BFC 区域不会与 float 重叠
- BFC 是隔离容器，子元素不影响外部
- 计算 BFC 高度时，浮动元素参与计算

### BFC 作用

```css
/* 清除浮动 */
.father {
    overflow: hidden; /* 触发 BFC */
}

/* 防止 margin 重叠 */
.father {
    overflow: hidden;
}
.son {
    margin-top: 20px;
}
```

## 3. margin 纵向重叠

margin 重叠发生在垂直方向的相邻块级元素之间。

### 解决方法

- 触发 BFC（overflow: hidden/auto）
- 设置 border 或 padding 隔开
- 使用 Flex 布局（flex 布局的子元素 margin 不重叠）

## 4. 选择器优先级

### 优先级计算

| 选择器       | 权重 |
| ------------ | ---- |
| !important   | 最高 |
| 行内样式     | 1000 |
| ID 选择器    | 100  |
| 类/属性/伪类 | 10   |
| 元素/伪元素  | 1    |
| 通配符       | 0    |

### 示例

```css
/* 优先级：100 + 10 + 1 = 111 */
#header.nav.active {
    /* ... */
}

/* 优先级：10 + 10 = 20 */
.nav.active {
    /* ... */
}

/* 如果优先级相同，后定义的生效 */
```

### 注意

- 面试时可以提到 CSS 选择器从右向左匹配
- !important 应尽量避免使用

## 5. 重排（reflow）和重绘（repaint）

### 重排触发条件

- DOM 增删
- 元素位置/尺寸变化
- 浏览器窗口 resize
- 读取 offset、scroll、client、getComputedStyle 等属性

### 重绘触发条件

- 元素外观属性变化（color、background、visibility 等）

### 性能优化

```js
// ❌ 多次操作 DOM
el.style.left = left + 1 + "px";
el.style.top = top + 1 + "px";

// ✅ 合并操作
el.style.transform = `translate(${left + 1}px, ${top + 1}px)`;

// ✅ 使用文档片段
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    fragment.appendChild(createItem());
}
container.appendChild(fragment);

// ✅ 缓存布局信息
const width = div.offsetWidth; // 读取一次
requestAnimationFrame(() => {
    console.log(width); // 使用缓存值
});
```

## 6. Flex 布局

### 容器属性

```css
.container {
    display: flex;

    /* 主轴方向 */
    flex-direction: row | row-reverse | column | column-reverse;

    /* 换行 */
    flex-wrap: nowrap | wrap | wrap-reverse;

    /* 方向+换行 */
    flex-flow: row wrap;

    /* 主轴对齐 */
    justify-content: flex-start | flex-end | center | space-between | space-around;

    /* 交叉轴对齐 */
    align-items: flex-start | flex-end | center | baseline | stretch;

    /* 多轴线对齐 */
    align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

### 项目属性

```css
.item {
    /* 排列顺序 */
    order: 0;

    /* 放大比例 */
    flex-grow: 0;

    /* 缩小比例 */
    flex-shrink: 1;

    /* 初始大小 */
    flex-basis: auto;

    /* flex-grow, flex-shrink, flex-basis 简写 */
    flex: 0 1 auto;

    /* 单独对齐 */
    align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

### 常见布局

```css
/* 水平垂直居中 */
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 两端对齐 */
.space-between {
    display: flex;
    justify-content: space-between;
}

/* Sticky Footer */
.page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.page-content {
    flex: 1;
}
```

## 7. Grid 布局

### 基本属性

```css
.container {
    display: grid;

    /* 定义列 */
    grid-template-columns: 100px 100px 100px;

    /* 定义行 */
    grid-template-rows: 100px 100px;

    /* 简写 */
    grid-template: 100px 100px / 1fr 2fr 1fr;

    /* fr 单位表示比例 */
    grid-template-columns: repeat(3, 1fr);

    /* 间隙 */
    gap: 20px;
    row-gap: 10px;
    column-gap: 20px;
}
```

### 常见布局

```css
/* 圣杯布局 */
.grid-container {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

/* 响应式网格 */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}
```

## 8. line-height 和 margin 继承

```css
/* 百分比继承 */
.father {
    font-size: 16px;
    line-height: 200%; /* 继承值为 32px */
}

/* 子元素 margin 百分比 */
.father {
    width: 500px;
}
.son {
    margin: 50%; /* 实际值为 250px（父 width 的 50%） */
}
```

## 9. CSS 定位

### 定位模式

| 值       | 说明                         |
| -------- | ---------------------------- |
| static   | 默认，正常流                 |
| relative | 相对定位，相对于自身         |
| absolute | 绝对定位，相对于最近定位祖先 |
| fixed    | 固定定位，相对于视口         |
| sticky   | 粘性定位（CSS3）             |

### 层叠上下文

```css
/* 创建层叠上下文的属性 */
.layer {
    position: relative/absolute/fixed;
    z-index: 数字;

    /* 其他创建方式 */
    opacity: 0.5;
    transform: rotate(5deg);
    mix-blend-mode: multiply;
}
```

### 居中方法

```css
/* 1. absolute + transform */
.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

/* 2. flex */
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 3. grid */
.center {
    display: grid;
    place-items: center;
}

/* 4. inline-block + text-align */
.parent {
    text-align: center;
}
.son {
    display: inline-block;
    vertical-align: middle;
}
```

## 10. CSS 动画

### transition

```css
.transition {
    transition: property duration timing-function delay;
    transition: all 0.3s ease 0s;
}
```

### animation

```css
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animation {
    animation: fadeIn 0.5s ease forwards;
}
```

### 常见动画性能优化

```css
/* ✅ GPU 加速的属性 */
.gpu {
    transform: translateZ(0);
    will-change: transform;
}

/* ❌ 避免的属性 */
.slow {
    width: 100px;
    height: 100px;
    left: 100px;
    top: 100px;
}
```

## 11. CSS 伪类与伪元素

### 伪类

```css
/* 状态伪类 */
:hover {
}
:active {
}
:focus {
}
:visited {
}
:focus-within {
}

/* 结构伪类 */
:first-child {
}
:last-child {
}
:nth-child(2n) {
}
:nth-of-type(2n) {
}
:only-child {
}
:root {
}
```

### 伪元素

```css
/* 创建伪元素 */
::before {
    content: "";
}
::after {
    content: "";
}
::first-line {
}
::first-letter {
}
::selection {
}
```

## 12. CSS 响应式

### 媒体查询

```css
/* 断点 */
@media (max-width: 768px) {
    /* 移动端 */
}
@media (min-width: 769px) and (max-width: 1024px) {
    /* 平板 */
}
@media (min-width: 1025px) {
    /* 桌面 */
}

/* 常用设备 */
@media (max-width: 480px) {
    /* 手机 */
}
@media (min-width: 481px) and (max-width: 768px) {
    /* 平板 */
}
@media (min-width: 769px) {
    /* 桌面 */
}
```

### 单位

| 单位      | 说明                        |
| --------- | --------------------------- |
| em        | 相对于父元素 font-size      |
| rem       | 相对于根元素 html font-size |
| vw/vh     | 相对于视口 1%               |
| vmin/vmax | 视口最小/最大方向           |
| %         | 相对于父元素对应属性        |

## 13. CSS 预处理器

### SCSS 常用特性

```scss
/* 变量 */
$primary: #333;
$fs: 16px;

.box {
    color: $primary;
    font-size: $fs;
}

/* 嵌套 */
.list {
    li {
        padding: 10px;
        &:hover {
            background: #f5f5f5;
        }
    }
}

/* mixin */
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.box {
    @include flex-center;
}

/* 继承 */
%btn {
    padding: 10px 20px;
    border-radius: 4px;
}
.btn-primary {
    @extend %btn;
    background: blue;
}
```

## 14. CSS 新特性

### CSS3 新增

```css
/* 圆角 */
border-radius: 8px;

/* 阴影 */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

/* 渐变 */
background: linear-gradient(to right, #fff, #ccc);

/* 滤镜 */
filter: blur(5px);

/* 遮罩 */
clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
```

### CSS 变量

```css
:root {
    --primary: #333;
    --spacing: 20px;
}

.box {
    color: var(--primary);
    padding: var(--spacing);
}
```

## 15. CSS 经典面试题

### 移动端 1px 问题

```css
/* 方法1：transform 缩放 */
.scale-border {
    position: relative;
    &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 200%;
        height: 200%;
        transform: scale(0.5);
        border: 1px solid #ddd;
    }
}

/* 方法2：border-image */
.border-image {
    border: 1px solid #ddd;
}

/* 方法3：box-shadow */
.shadow-border {
    box-shadow: inset 0 -1px 1px #ddd;
}
```

### 两栏布局

```css
/* Flex 方案 */
.layout {
    display: flex;
}
.sidebar {
    width: 200px;
}
.main {
    flex: 1;
}

/* Grid 方案 */
.layout {
    display: grid;
    grid-template-columns: 200px 1fr;
}
```

### 三栏布局

```css
/* 圣杯布局 */
.holy-grail {
    display: flex;
    padding: 0 200px;
}
.header,
.footer {
    flex: 1;
}
.main {
    flex: 1;
}
.left,
.right {
    width: 200px;
}
.left {
    margin-left: -200px;
}
.right {
    margin-right: -200px;
}

/* 双飞翼布局 */
```

### CSS 垂直居中

```css
/* 已知高度 */
.parent {
    position: relative;
}
.child {
    position: absolute;
    top: 50%;
    height: 100px;
    margin-top: -50px;
}

/* 未知高度 */
.child {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

/* Flex */
.parent {
    display: flex;
    align-items: center;
}

/* Grid */
.parent {
    display: grid;
    place-items: center;
}
```

### 清除浮动

```css
/* 方法1：BFC */
.clearfix {
    overflow: hidden;
}

/* 方法2：伪元素 */
.clearfix::after {
    content: "";
    display: block;
    clear: both;
}

/* 方法3：双伪元素 */
.clearfix::before,
.clearfix::after {
    content: "";
    display: table;
}
.clearfix::after {
    clear: both;
}
```

### CSS 模块化

```css
/* BEM 命名 */
.block {
}
.block__element {
}
.block--modifier {
}

/* 示例 */
.card {
}
.card__header {
}
.card__body {
}
.card--featured {
}
```
