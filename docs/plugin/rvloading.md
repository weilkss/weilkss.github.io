# React Vue Loading

基于 Web Component 封装的 Loading 组件，不依赖任何框架，可在 Vue、React、原生 HTML 等任何环境中使用。

## 组件演示

<div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap; justify-content: center; padding: 32px; background: #f5f5f5; border-radius: 8px;">
    <RVLoading />
    <RVLoading color="red" />
    <RVLoading size="64" />
    <RVLoading size="72" color="red"/>
</div>

## 基本使用

### Vue 项目

```vue
<template>
    <RVLoading />
    <RVLoading color="red" />
    <RVLoading size="64" />
</template>

<script setup>
import RVLoading from "react-vue-loading";
</script>
```

### React 项目

```jsx
import React from "react";
import RVLoading from "react-vue-loading";

function App() {
    return (
        <div>
            <RVLoading />
            <RVLoading color="red" />
            <RVLoading size={64} />
        </div>
    );
}
```

### 原生 HTML

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Document</title>
    </head>
    <body>
        <rv-loading></rv-loading>
        <rv-loading color="red"></rv-loading>
        <rv-loading size="64"></rv-loading>

        <script type="module">
            import RVLoading from "https://unpkg.com/react-vue-loading@1.0.6/lib/react-vue-loading.js";
            customElements.define("rv-loading", RVLoading);
        </script>
    </body>
</html>
```

## CDN 使用

### Vue 3

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Vue 3 + RVLoading</title>
    </head>
    <body>
        <div id="app">
            <rv-loading></rv-loading>
            <rv-loading color="red"></rv-loading>
            <rv-loading size="64"></rv-loading>
        </div>
        <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
        <script type="module">
            import RVLoading from "https://unpkg.com/react-vue-loading@1.0.6/lib/react-vue-loading.js";
            const app = Vue.createApp();
            app.component("rv-loading", RVLoading);
            app.mount("#app");
        </script>
    </body>
</html>
```

### React

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>React + RVLoading</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    </head>
    <body>
        <div id="root"></div>
        <script type="text/babel">
            const { useState } = React;

            function App() {
                return (
                    <div>
                        <h1>React + RVLoading</h1>
                        <RVLoading />
                        <RVLoading color="red" />
                        <RVLoading size={64} />
                    </div>
                );
            }

            ReactDOM.createRoot(document.getElementById("root")).render(<App />);
        </script>
        <script type="module">
            import RVLoading from "https://unpkg.com/react-vue-loading@1.0.6/lib/react-vue-loading.js";
            window.RVLoading = RVLoading;
        </script>
    </body>
</html>
```

### 原生 JavaScript

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Native JS + RVLoading</title>
    </head>
    <body>
        <rv-loading></rv-loading>
        <rv-loading color="red"></rv-loading>
        <rv-loading size="64"></rv-loading>

        <script type="module">
            import RVLoading from "https://unpkg.com/react-vue-loading@1.0.6/lib/react-vue-loading.js";
            customElements.define("rv-loading", RVLoading);
        </script>
    </body>
</html>
```

## 完整示例

### Vue 完整示例

```vue
<template>
    <div class="rvloading-wrapper">
        <RVLoading></RVLoading>
        <RVLoading size="32" color="red"></RVLoading>
        <RVLoading size="64"></RVLoading>
        <RVLoading :size="72" color="red"></RVLoading>
    </div>
</template>

<script setup>
import RVLoading from "react-vue-loading";
</script>

<style scoped>
.rvloading-wrapper {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 32px;
    background: #f5f5f5;
    border-radius: 8px;
}
</style>
```

### React 完整示例

```jsx
import React, { useState } from "react";
import RVLoading from "react-vue-loading";

function App() {
    const [loading, setLoading] = useState(true);

    return (
        <div>
            <button onClick={() => setLoading(!loading)}>Toggle Loading</button>
            {loading ? (
                <div className="loading-wrapper">
                    <RVLoading size={48} color="#1890ff" />
                </div>
            ) : (
                <div className="content">
                    <h1>内容加载完成</h1>
                    <p>这里是实际的内容...</p>
                </div>
            )}
        </div>
    );
}
```

## Props

| 属性  | 类型               | 默认值    | 说明                     |
| ----- | ------------------ | --------- | ------------------------ |
| color | `string`           | `#333333` | 加载动画颜色             |
| size  | `number \| string` | `32`      | 加载动画尺寸（单位：px） |

## 官方资源

- **npm**: https://www.npmjs.com/package/react-vue-loading
- **GitHub**: https://github.com/zhpeng811/react-vue-loading
