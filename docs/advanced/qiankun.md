# Qiankun 深入指南

## 核心概念与原理

### 1. Qiankun 是什么？它解决了什么问题？

Qiankun（乾坤）是蚂蚁金服开源的微前端框架，基于 single-spa 封装，专注于微前端解决方案。它解决了以下问题：

**解决的问题：**

| 问题 | 传统方案 | Qiankun |
|------|---------|---------|
| 多团队协作 | 各自开发，最后整合困难 | 独立开发，独立部署 |
| 技术栈限制 | 必须统一技术栈 | 支持任意技术栈 |
| 应用隔离 | 手动处理冲突 | JS/CSS 自动隔离 |
| 状态共享 | 通过 URL/LocalStorage | 原生 qiankun API |
| 沙箱环境 | 无隔离 | 快照沙箱/代理沙箱 |

**核心特性：**
- **HTML Entry**：通过 HTML 入口加载微应用
- **JS 沙箱**：独立的 JavaScript 执行环境
- **CSS 隔离**：防止样式污染
- **预加载**：应用启动时预加载微应用资源
- **乾坤大挪移**：一键切换主应用

### 2. 微前端的核心概念

```
┌─────────────────────────────────────────────────────────────────┐
│                      微前端架构                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      ┌─────────────────┐                        │
│                      │   主应用 Shell   │                        │
│                      │  (Container)    │                        │
│                      └────────┬────────┘                        │
│                               │                                  │
│         ┌─────────────────────┼─────────────────────┐           │
│         │                     │                     │           │
│         ▼                     ▼                     ▼           │
│   ┌───────────┐         ┌───────────┐         ┌───────────┐    │
│   │  Vue App  │         │ React App │         │  jQuery   │    │
│   │   子应用   │         │   子应用   │         │   子应用   │    │
│   └───────────┘         └───────────┘         └───────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Qiankun vs 其他微前端方案对比

| 特性 | Qiankun | single-spa | iframe | Webpack Module Federation |
|------|---------|------------|--------|--------------------------|
| 框架支持 | 任意 | 任意 | 任意 | 需 Webpack 5 |
| CSS 隔离 | ✓ | 需手动 | ✓ | 需配置 |
| JS 沙箱 | ✓ | 需手动 | ✓ | ✓ |
| HTML Entry | ✓ | 需手动 | ✗ | ✗ |
| 预加载 | ✓ | ✗ | ✗ | ✓ |
| 通信机制 | 原生支持 | 需手动 | postMessage | 需手动 |
| 学习曲线 | 低 | 中 | 低 | 高 |

## 快速开始

### 4. 主应用配置

```javascript
// main.js (主应用)
import { registerMicroApps, start, setDefaultMountApp } from 'qiankun';

const loader = (loading) => {
  // 可选：自定义 loading 效果
  document.getElementById('loader').style.display = loading ? 'block' : 'none';
};

registerMicroApps(
  [
    {
      name: 'vue-app',                                    // 微应用名称
      entry: '//localhost:8081',                          // 微应用入口
      container: '#micro-container',                      // 微应用挂载容器
      loader,                                              // loading 状态回调
      activeRule: '/vue',                                  // 激活规则
      props: {                                            // 传递给微应用的数据
        name: 'Main App Data',
        shared: ['Vue', 'Vuex', 'Router']
      }
    },
    {
      name: 'react-app',
      entry: '//localhost:8082',
      container: '#micro-container',
      activeRule: '/react',
      props: { name: 'React App Data' }
    },
    {
      name: 'static-app',
      entry: '//localhost:8083',
      container: '#micro-container',
      activeRule: '/static'
    }
  ],
  {
    beforeLoad: [
      app => {
        console.log('[Main] before load', app.name);
        return Promise.resolve();
      }
    ],
    beforeMount: [
      app => {
        console.log('[Main] before mount', app.name);
        return Promise.resolve();
      }
    ],
    afterMount: [
      app => {
        console.log('[Main] after mount', app.name);
        return Promise.resolve();
      }
    ],
    afterUnmount: [
      app => {
        console.log('[Main] after unmount', app.name);
        return Promise.resolve();
      }
    ]
  }
);

// 设置默认激活的微应用
setDefaultMountApp('/vue');

// 启动 qiankun
start({
  prefetch: 'all',                    // 预加载所有微应用
  sandbox: {
    strictStyleIsolation: true,       // 严格样式隔离
    experimentalStyleIsolation: true, // 实验性样式隔离
    snapshot: false,                  // 快照沙箱（兼容性好）
    trunkStie: false                  // 代理沙箱
  },
  cssPrefix: false,
  singular: false,                    // 是否单实例模式
  getDerivedStateFromProps(props, state) {
    return { ...props, ...state };
  }
});
```

### 5. Vue 子应用配置

```javascript
// vue-app/src/main.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import routes from './router';

Vue.use(VueRouter);

let instance = null;
let router = null;

function render(props = {}) {
  const { container } = props;

  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/vue' : '/',
    mode: 'history',
    routes
  });

  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时（开发环境）
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// ============ qiankun 生命周期函数 ============

// 导出 quankun 生命周期钩子
export async function bootstrap() {
  console.log('[Vue App] bootstrap');
}

export async function mount(props) {
  console.log('[Vue App] mount', props);

  // 接收主应用传递的数据
  props.onGlobalStateChange?.((state, prev) => {
    console.log('[Vue App] global state changed', state, prev);
  });

  // 设置全局状态
  props.setGlobalState?.({ name: 'Vue App' });

  render(props);
}

export async function unmount() {
  console.log('[Vue App] unmount');
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}

export async function update(props) {
  console.log('[Vue App] update', props);
}
```

```javascript
// vue.config.js
const { name } = require('./package.json');
const port = 8081;
const pnp = require('./pnp');

module.exports = {
  devServer: {
    port,
    headers: {
      'Access-Control-Allow-Origin': '*'  // 允许跨域
    }
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',               // 使用 umd 格式
      jsonpFunction: `webpackJsonp_${name}`
    }
  },
  chainWebpack: config => {
    // 添加 qiankun 相关的 pnp 支持
    if (process.env.NODE_ENV === 'development') {
      config.devServer.disableHostCheck(true);
    }
  }
};
```

### 6. React 子应用配置

```javascript
// react-app/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

function render(props) {
  const { container } = props;

  const root = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// 独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// ============ qiankun 生命周期函数 ============

export async function bootstrap() {
  console.log('[React App] bootstrap');
}

export async function mount(props) {
  console.log('[React App] mount', props);

  // 通信机制
  props.onGlobalStateChange?.((state, prev) => {
    console.log('[React App] state changed', state, prev);
  });

  render(props);
}

export async function unmount(props) {
  console.log('[React App] unmount');
  const { container } = props;
  const root = container
    ? container.querySelector('#root')
    : document.getElementById('root');

  ReactDOM.createRoot(root).unmount();
}

export async function update(props) {
  console.log('[React App] update', props);
}
```

```javascript
// react-app/config-overrides.js
const { name } = require('./package');
const port = 8082;

module.exports = {
  devServer: {
    port,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.globalObject = 'window';
    return config;
  }
};
```

## 沙箱机制

### 7. 沙箱原理详解

```javascript
// qiankun 沙箱类型

// 1. 快照沙箱（SnapshotSandbox）
// 原理：激活时保存 window 快照，卸载时恢复
class SnapshotSandbox {
  constructor() {
    this.proxy = window;
    this.modifiedProperties = {};  // 记录修改的属性
    this.snapshot = {};           // window 快照
  }

  activate() {
    // 记录当前 window 上的修改
    this.modifiedProperties = {};
    for (const key in window) {
      if (window.hasOwnProperty(key)) {
        this.snapshot[key] = window[key];
      }
    }

    // 恢复上次的修改
    for (const key in this.modifiedProperties) {
      window[key] = this.modifiedProperties[key];
    }
  }

  deactivate() {
    // 记录当前的修改
    for (const key in window) {
      if (window.hasOwnProperty(key) && window[key] !== this.snapshot[key]) {
        this.modifiedProperties[key] = window[key];
        // 恢复原状
        window[key] = this.snapshot[key];
      }
    }
  }
}

// 2. 代理沙箱（ProxySandbox）
// 原理：通过 Proxy 代理 window，不直接修改真实的 window
class ProxySandbox {
  constructor() {
    const self = this;
    this.modifiedProperties = new Set();

    this.proxy = new Proxy(window, {
      get(target, key) {
        if (!self.modifiedProperties.has(key)) {
          self.modifiedProperties.add(key);
        }
        return target[key];
      },
      set(target, key, value) {
        self.modifiedProperties.add(key);
        target[key] = value;
        return true;
      }
    });
  }

  activate() {
    // nothing to do
  }

  deactivate() {
    // 清理
    this.modifiedProperties.clear();
  }
}
```

### 8. CSS 隔离策略

```css
/* 方案一：严格样式隔离 (strictStyleIsolation) */
/* qiankun 会为每个微应用添加唯一的属性选择器 */
.wrapper[data-qiankun-xxxx] .button {
  color: blue;
}

/* 方案二：实验性样式隔离 (experimentalStyleIsolation) */
/* qiankun 会自动为微应用样式添加前缀 */
#app -> #app[data-qiankun-xxxx] {
  /* 所有样式会被自动包装 */
}

/* 方案三：手动 CSS Modules */
.button {
  color: blue;
}

/* 在主应用中 */
:global(.button) {
  color: red;  /* 不会被覆盖 */
}

/* 方案四：动态样式表 */
const styleEl = document.createElement('style');
styleEl.textContent = `
  #${appId} .button { color: blue; }
`;
document.head.appendChild(styleEl);
```

## 应用间通信

### 9. 通信机制详解

```javascript
// 主应用初始化全局状态
import { initGlobalState, registerMicroApps } from 'qiankun';

// 初始化全局状态
const initialState = {
  user: null,
  token: null,
  theme: 'light'
};

const actions = initGlobalState(initialState);

// 主应用监听全局状态变化
actions.onGlobalStateChange((state, prev) => {
  console.log('[Main] state changed', state, prev);

  // 更新主应用状态
  setState(state);
});

// 主应用设置全局状态
function setGlobalState(state) {
  actions.setGlobalState({
    user: { name: 'John' },
    theme: 'dark'
  });
}

// 注册微应用
registerMicroApps([...]);

// 主应用向微应用发送消息
function notifyMicroApp() {
  actions.setGlobalState({ fromMain: 'Hello from Main' });
}

// ============ 微应用中使用 ============

// mount 生命周期中接收
export async function mount(props) {
  // 监听全局状态变化
  props.onGlobalStateChange?.((state, prev) => {
    console.log('[Micro] state changed', state, prev);

    // 更新微应用内部状态
    setAppState(state);
  });

  // 获取当前全局状态
  const currentState = props.getGlobalState?.();
  console.log('[Micro] current state', currentState);
}
```

### 10. 自定义通信协议

```javascript
// utils/communication.js
class MicroAppStore {
  constructor() {
    this.state = {};
    this.listeners = new Set();
  }

  setState(state) {
    this.state = { ...this.state, ...state };
    this.listeners.forEach(listener => listener(this.state));
  }

  getState() {
    return { ...this.state };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const microAppStore = new MicroAppStore();

// 在微应用中使用
import { microAppStore } from '@/utils/communication';

export async function mount(props) {
  // 初始化状态
  microAppStore.setState(props.globalState || {});

  // 监听主应用更新
  props.onGlobalStateChange?.((state) => {
    microAppStore.setState(state);
  });

  // 订阅状态变化
  const unsubscribe = microAppStore.subscribe((state) => {
    // 更新组件状态
    console.log('State updated:', state);
  });

  // 卸载时取消订阅
  return () => unsubscribe();
}
```

## 路由处理

### 11. 路由配置详解

```javascript
// 主应用路由配置
// 方式一：hash 路由
const microApps = [
  { name: 'vue-app', entry: '//localhost:8081', activeRule: '/#/vue' }
];

// 方式二：history 路由（推荐）
const microApps = [
  { name: 'vue-app', entry: '//localhost:8081', activeRule: '/vue' }
];

// 主应用路由
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      { path: '', redirect: '/vue' },
      { path: 'vue/*', component: VueApp },      // 微应用容器
      { path: 'react/*', component: ReactApp }    // 微应用容器
    ]
  }
];

// 路由切换时自动触发微应用激活/卸载
// qiankun 会根据 activeRule 自动匹配

// 微应用内部路由（history 模式）
// 必须设置 base 为 /vue
const router = new VueRouter({
  base: window.__POWERED_BY_QIANKUN__ ? '/vue' : '/',
  mode: 'history',
  routes
});
```

### 12. 微应用之间的跳转

```javascript
// 方式一：通过主应用路由跳转
import { useRouter } from 'vue-router';

function navigateToReact() {
  window.history.pushState(null, '', '/react/dashboard');
}

// 方式二：通过 history 对象
function navigateBetweenApps() {
  // 从 vue-app 跳转到 react-app
  history.pushState(null, '', '/react/about');
}

// 方式三：通过 qiankun 的全局状态
// 主应用监听并处理跨应用跳转
actions.onGlobalStateChange((state) => {
  if (state.navigateTo) {
    router.push(state.navigateTo);
  }
});
```

## 面试精选问题

### 问题一：Qiankun 的沙箱是如何实现的？

**答案要点**：

**快照沙箱（SnapshotSandbox）：**
1. 激活时遍历 window，记录所有属性值到 snapshot
2. 运行时记录所有修改到 modifiedProperties
3. 卸载时恢复 window 到 snapshot 状态
4. 再次激活时恢复 modifiedProperties

**代理沙箱（ProxySandbox）：**
1. 创建一个 Proxy 代理真实的 window 对象
2. 所有对 window 的读写都通过 proxy 完成
3. 使用 Set 记录被修改的属性
4. 卸载时清空 Set，但不修改真实 window

**LegacySandbox（快照沙箱）和 ProxySandbox（代理沙箱）的区别：**
- 快照沙箱直接修改 window，卸载时恢复
- 代理沙箱不修改真实 window，通过 proxy 隔离

### 问题二：Qiankun 如何实现 CSS 隔离？

**答案要点**：

**1. 严格样式隔离（strictStyleIsolation）**
```javascript
start({
  sandbox: {
    strictStyleIsolation: true
  }
});
```
- qiankun 会为每个微应用的容器添加唯一的 data-qiankun-[hash] 属性
- 所有样式选择器自动加上属性选择器

**2. 实验性样式隔离（experimentalStyleIsolation）**
```javascript
start({
  sandbox: {
    experimentalStyleIsolation: true
  }
});
```
- qiankun 会重写微应用的样式，为所有选择器添加前缀
- 更彻底，但可能有样式兼容性问题

**3. 自定义 CSS Modules**
```css
/* 在样式中使用 :global */
:global(.button) {
  color: red;
}

/* 或使用 scoped */
```

### 问题三：微应用如何获取主应用的数据？

**答案要点**：

**1. 通过 props 传递**
```javascript
// 主应用
registerMicroApps([
  {
    name: 'vue-app',
    entry: '//localhost:8081',
    container: '#container',
    props: {
      name: 'Main App',
      shared: window.__MAIN_APP_SHARED__
    }
  }
]);

// 微应用
export async function mount(props) {
  console.log(props.name);  // 'Main App'
}
```

**2. 通过全局状态**
```javascript
// 主应用
const actions = initGlobalState({ user: null });
actions.setGlobalState({ user: { name: 'John' } });

// 微应用
props.onGlobalStateChange?.((state) => {
  console.log(state.user);  // { name: 'John' }
});
```

**3. 通过 window 对象**
```javascript
// 主应用
window.__MAIN_STATE__ = { user: null };

// 微应用
const state = window.__MAIN_STATE__;
```

### 问题四：qiankun 的预加载是如何实现的？

**答案要点**：

**prefetch 配置选项：**
```javascript
start({
  prefetch: 'all'      // 预加载所有微应用
  // 或
  prefetch: ['vue-app', 'react-app']  // 指定预加载
  // 或
  prefetch: false      // 不预加载
});
```

**实现原理：**
1. qiankun 使用 requestIdleCallback 或 script link rel=prefetch
2. 在主应用加载完成后，空闲时预加载微应用的 HTML
3. 预加载只是获取 HTML，不会执行 JavaScript
4. 真正激活时才执行微应用的 JavaScript

### 问题五：微应用如何独立开发部署？

**答案要点**：

**独立开发：**
```javascript
// 微应用入口文件
function render() {
  const app = createApp(App);
  app.mount('#app');
}

// 独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```

**独立部署：**
1. 微应用构建输出到独立域名或路径
2. 主应用 entry 指向微应用部署地址
3. 只需保证跨域配置正确即可

**配置 CORS：**
```javascript
// 微应用 devServer
headers: {
  'Access-Control-Allow-Origin': '*'
}
```

### 问题六：qiankun 的性能优化策略有哪些？

**答案要点**：

**1. 预加载策略**
```javascript
start({
  prefetch: 'all'  // 或 'lazy' 只预加载当前可能用到的
});
```

**2. 沙箱优化**
```javascript
// 快照沙箱（内存占用小）
start({
  sandbox: { snapshot: true }
});

// 代理沙箱（隔离性好）
start({
  sandbox: { trunkStie: true }
});
```

**3. 按需加载微应用**
```javascript
// 使用 loadMicroApp 手动加载
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp({
  name: 'vue-app',
  entry: '//localhost:8081',
  container: '#micro-container'
});

// 卸载
microApp.unmount();
```

**4. 样式隔离选择**
```javascript
// 根据实际情况选择隔离级别
start({
  sandbox: {
    experimentalStyleIsolation: true
  }
});
```

## 最佳实践

### 项目结构建议

```
├── main-app/                    # 主应用
│   ├── src/
│   │   ├── micro/              # 微应用容器
│   │   │   ├── MicroApp.jsx
│   │   │   └── MicroContainer.jsx
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   └── main.js
│   └── package.json
│
├── vue-subapp/                  # Vue 子应用
│   ├── src/
│   │   ├── main.js             # 包含 qiankun 生命周期
│   │   ├── App.vue
│   │   └── router/
│   └── package.json
│
├── react-subapp/                # React 子应用
│   ├── src/
│   │   ├── index.js            # 包含 qiankun 生命周期
│   │   ├── App.tsx
│   │   └── router/
│   └── package.json
│
└── static-subapp/               # 静态子应用
    ├── dist/
    └── package.json
```

### 常见问题解决方案

**1. 全局变量冲突**
```javascript
// 使用沙箱隔离
start({
  sandbox: {
    experimentalStyleIsolation: true
  }
});
```

**2. 第三方库冲突**
```javascript
// 在微应用中使用 external
// webpack 配置
externals: {
  vue: 'Vue',
  react: 'React'
}
```

**3. 微应用样式丢失**
```javascript
// 检查是否正确设置了 strictStyleIsolation
start({
  sandbox: {
    strictStyleIsolation: true
  }
});
```
