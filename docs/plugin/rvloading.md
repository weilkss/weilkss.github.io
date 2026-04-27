# React Vue Loading

基于 Vue 3 封装 React 组件的 Loading 组件库，可以在 Vue 项目中直接使用 React 开发的 Loading 组件。

## 组件演示

<RVLoading />

## 使用方法

### 默认用法

```vue
<template>
    <rv-loading></rv-loading>
</template>

<script setup>
import RVLoading from "react-vue-loading";
</script>
```

### 自定义颜色

```vue
<template>
    <rv-loading color="red"></rv-loading>
    <rv-loading color="#1890ff"></rv-loading>
    <rv-loading color="rgb(255, 0, 0)"></rv-loading>
</template>
```

### 自定义尺寸

```vue
<template>
    <rv-loading size="64"></rv-loading>
    <rv-loading size="32"></rv-loading>
    <rv-loading size="16"></rv-loading>
</template>
```

### 完整示例

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

## CDN 使用

如果你不想通过 npm 安装，也可以直接使用 CDN：

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
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

## Props

| 属性  | 类型     | 默认值    | 说明                     |
| ----- | -------- | --------- | ------------------------ |
| color | `string` | `#333333` | 加载动画颜色             |
| size  | `number` | `32`      | 加载动画尺寸（单位：px） |

## 官方资源

- **npm**: https://www.npmjs.com/package/react-vue-loading
- **GitHub**: https://github.com/zhpeng811/react-vue-loading
