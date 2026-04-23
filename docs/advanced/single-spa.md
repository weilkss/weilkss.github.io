# Single-SPA 微前端框架面试指南

## 什么是 Single-SPA？

Single-SPA 是一个用于微前端的 JavaScript 框架，它允许在同一个页面上同时运行多个 React、Vue、Angular、Svelte 等框架构建的应用程序（称为微应用）。与 qiankun 不同，single-spa 本身不提供沙箱隔离、样式隔离等功能，需要开发者自行实现或配合其他工具使用。

```javascript
// single-spa 核心概念
┌─────────────────────────────────────────────────────────────────┐
│                    Single-SPA 架构                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│   │  Vue App    │   │  React App  │   │  Angular    │          │
│   │  (微应用1)  │   │  (微应用2)  │   │  App (微应用3)│         │
│   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘          │
│          │                 │                 │                  │
│          └────────────┬────┴────────────────┘                  │
│                       │                                          │
│                       ▼                                          │
│              ┌─────────────────┐                                 │
│              │  single-spa     │                                 │
│              │  (路由系统)      │                                 │
│              └────────┬────────┘                                 │
│                       │                                          │
│                       ▼                                          │
│              ┌─────────────────┐                                 │
│              │     DOM         │                                 │
│              │  (容器应用)      │                                 │
│              └─────────────────┘                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

// 微应用的生命周期
生命周期: bootstrap → mount → unmount → unload

// 每一阶段的职责
bootstrap:   初始化微应用，挂载静态资源，准备渲染环境
mount:       将微应用挂载到 DOM，开始接收用户交互
unmount:     将微应用从 DOM 卸载，清理状态和事件监听
unload:      卸载微应用，释放所有资源，准备重新加载
```

## 核心概念解析

### 1. 根应用（Root Application）

根应用是 single-spa 的容器，负责注册和协调所有微应用。

```javascript
// main.js - 根应用入口
import { registerApplication, start } from 'single-spa';

// 定义如何加载微应用
const loadApp = (name, hashUrl) => {
  return () => {
    return fetch(hashUrl)
      .then(response => response.text())
      .then(html => {
        const container = document.createElement('div');
        container.id = name;
        container.innerHTML = html;
        document.body.appendChild(container);
      });
  };
};

// 注册微应用
registerApplication({
  name: 'vue-app',
  app: loadApp('vue-app', '/vue-app.html'),
  activeWhen: (location) => location.pathname.startsWith('/vue'),
  customProps: {
    name: 'Vue App',
    shared: ['Vue', 'Vuex']
  }
});

registerApplication({
  name: 'react-app',
  app: () => import('/react-app/main.js'),
  activeWhen: '/react',
  customProps: {
    name: 'React App'
  }
});

// 启动 single-spa
start();
```

### 2. 微应用导出格式

每个微应用必须导出特定的生命周期函数。

```javascript
// React 微应用示例
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let domEl = null;

export const bootstrap = async () => {
  console.log('[React App] bootstrap');
};

export const mount = async (props) => {
  console.log('[React App] mount', props);
  domEl = document.getElementById('react-app');
  ReactDOM.render(<App />, domEl);
};

export const unmount = async (props) => {
  console.log('[React App] unmount', props);
  ReactDOM.unmountComponentAtNode(domEl);
  domEl = null;
};

export const unload = async () => {
  console.log('[React App] unload');
};

// 不需要实现 unload 时，可以不导出
// export const unload = () => {};
```

```javascript
// Vue 微应用示例
// src/single-spa.js
import Vue from 'vue';
import App from './App.vue';

let instance = null;

export const bootstrap = async () => {
  console.log('[Vue App] bootstrap');
};

export const mount = async (props) => {
  console.log('[Vue App] mount', props);
  instance = new Vue({
    render: h => h(App)
  }).$mount('#vue-app');
};

export const unmount = async () => {
  console.log('[Vue App] unmount');
  instance.$destroy();
  instance = null;
};
```

### 3. 路由配置与 activeWhen

`activeWhen` 用于判断何时激活对应的微应用。

```javascript
// activeWhen 的几种写法

// 1. 路径前缀匹配（最常用）
registerApplication({
  name: 'vue-app',
  app: () => import('/vue-app/main.js'),
  activeWhen: '/vue'  // 匹配所有以 /vue 开头的路径
});

// 2. 多路径匹配
registerApplication({
  name: 'admin-app',
  app: () => import('/admin/main.js'),
  activeWhen: ['/admin', '/settings', '/profile']
});

// 3. 自定义函数
registerApplication({
  name: 'special-app',
  app: () => import('/special/main.js'),
  activeWhen: (location) => {
    return location.pathname.startsWith('/special') &&
           location.hash === '#feature-x';
  }
});

// 4. 带条件的路径匹配
registerApplication({
  name: 'cart-app',
  app: () => import('/cart/main.js'),
  activeWhen: (location) => {
    return location.pathname.startsWith('/cart') &&
           localStorage.getItem('cart_enabled') === 'true';
  }
});
```

### 4. 自定义属性（Custom Props）

`customProps` 用于向微应用传递数据和共享依赖。

```javascript
// 根应用
registerApplication({
  name: 'shared-app',
  app: () => import('/shared/main.js'),
  activeWhen: '/shared',
  customProps: {
    name: 'Shared App',
    shared: {
      Vue: window.Vue,
      Vuex: window.Vuex,
      eventBus: new EventEmitter()
    },
    globalEvent: (action) => {
      console.log('Global action:', action);
    }
  }
});

// 微应用中使用
export const mount = async (props) => {
  const { name, shared, globalEvent } = props;
  console.log('App name:', name);
  
  // 使用共享的 Vue
  shared.Vue.use(shared.Vuex);
  
  // 调用全局事件
  globalEvent('app-mounted');
};
```

## 生命周期详解

### 完整生命周期流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Single-SPA 生命周期                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   注册阶段:                                                      │
│   registerApplication() ──► 验证配置 ──► 添加到应用列表           │
│                                  │                              │
│                                  ▼                              │
│   启动阶段:                                                      │
│   start() ──► 初始挂载检查 ──► 加载匹配的微应用                    │
│                                  │                              │
│                                  ▼                              │
│   激活阶段:                                                      │
│   bootstrap() ──► mount() ──► 应用可见和可交互                    │
│                                  │                              │
│   切换阶段:                                                      │
│   路由变化 ──► 检查 activeWhen ──► 卸载旧应用 ──► 加载新应用       │
│                                  │                              │
│                                  ▼                              │
│   卸载阶段:                                                      │
│   unmount() ──► unload() ──► 清理资源                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 生命周期实现示例

```javascript
// 完整的生命周期实现
const lifeCycleLog = {
  bootstrap: async (props) => {
    console.log('[App] bootstrap 开始');
    console.log('[App] Props:', props);
    
    // 初始化状态
    props.setState({ initialized: false });
    
    // 加载必要的资源
    await loadResources();
    
    console.log('[App] bootstrap 完成');
    return true;
  },
  
  mount: async (props) => {
    console.log('[App] mount 开始');
    const startTime = performance.now();
    
    // 创建 DOM 容器
    const container = document.createElement('div');
    container.id = 'micro-app-container';
    document.getElementById('app-host').appendChild(container);
    
    // 渲染应用
    await renderApp(container, props);
    
    const mountTime = performance.now() - startTime;
    console.log(`[App] mount 完成，耗时: ${mountTime}ms`);
    
    // 更新全局状态
    props.setState({ mounted: true, mountTime });
  },
  
  unmount: async (props) => {
    console.log('[App] unmount 开始');
    
    // 保存应用状态
    const appState = getAppState();
    localStorage.setItem('app-state', JSON.stringify(appState));
    
    // 清理事件监听
    removeEventListeners();
    
    // 取消网络请求
    cancelPendingRequests();
    
    // 卸载 React/Vue 应用
    unmountComponentAtNode(document.getElementById('micro-app-container'));
    
    // 移除 DOM 容器
    const container = document.getElementById('micro-app-container');
    if (container) {
      container.remove();
    }
    
    console.log('[App] unmount 完成');
  },
  
  unload: async (props) => {
    console.log('[App] unload 开始');
    
    // 清理缓存
    clearCaches();
    
    // 移除已加载的模块
    delete window.__MICRO_APP__;
    
    console.log('[App] unload 完成');
  }
};

// 生命周期错误处理
const lifecycleWithErrorHandling = (lifecycle) => {
  return async (props) => {
    try {
      const result = await lifecycle(props);
      return result;
    } catch (error) {
      console.error(`[App] Lifecycle error:`, error);
      
      // 可以选择重试或上报错误
      reportError(error, 'lifecycle_error');
      
      // 根据错误类型决定是否抛出
      if (error.isFatal) {
        throw error;
      }
    }
  };
};
```

## 应用间通信

### 1. 通过 Custom Props 传递通信机制

```javascript
// 根应用 - 创建通信总线
const eventBus = {
  handlers: {},
  
  on(event, handler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  },
  
  off(event, handler) {
    if (!this.handlers[event]) return;
    this.handlers[event] = this.handlers[event].filter(h => h !== handler);
  },
  
  emit(event, data) {
    if (!this.handlers[event]) return;
    this.handlers[event].forEach(handler => handler(data));
  }
};

// 注册时传递通信机制
registerApplication({
  name: 'app-a',
  app: () => import('/app-a/main.js'),
  activeWhen: '/app-a',
  customProps: {
    eventBus,
    sharedData: sharedStore
  }
});
```

### 2. 使用 single-spa 提供的 API 进行通信

```javascript
// 使用 single-spa 的 API
import { getProps, navigateToUrl } from 'single-spa';

// 获取传递给当前应用的 props
const props = getProps();

// 应用间跳转（会触发路由变化）
navigateToUrl('/other-app');
```

### 3. 基于 localStorage 的通信

```javascript
// 简单的跨应用通信方案
class CrossAppCommunicator {
  constructor(channel) {
    this.channel = channel;
    this.listeners = [];
    
    window.addEventListener('storage', (e) => {
      if (e.key === channel && e.newValue) {
        const data = JSON.parse(e.newValue);
        this.notifyListeners(data);
      }
    });
  }
  
  publish(data) {
    localStorage.setItem(this.channel, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }
  
  subscribe(callback) {
    this.listeners.push(callback);
  }
  
  notifyListeners(data) {
    this.listeners.forEach(cb => cb(data));
  }
}

// 使用
const communicator = new CrossAppCommunicator('app-channel');

// 发布消息
communicator.publish({ type: 'USER_LOGIN', payload: { userId: 123 } });

// 订阅消息
communicator.subscribe((message) => {
  console.log('Received message:', message);
});
```

## 与 Qiankun 的对比

| 特性 | Single-SPA | Qiankun |
|------|-----------|---------|
| 沙箱隔离 | ❌ 不提供 | ✅ 基于 Proxy 沙箱 |
| 样式隔离 | ❌ 不提供 | ✅ CSS Modules、Shadow DOM |
| 资源预加载 | ❌ 不提供 | ✅ prefetch 策略 |
| 入口 HTML | ❌ 需要手动处理 | ✅ 自动解析 HTML |
| 依赖共享 | 手动配置 | ✅ 内置 shared 机制 |
|上手难度| 较高 | 较低 |
| 体积 | ~10KB | ~15KB |
| 适用场景 | 简单微前端 | 复杂企业级应用 |

```javascript
// Single-SPA 需要手动实现的功能（Qiankun 自动提供）

// 1. 样式隔离
const styleIsolation = {
  scoped_css: (appName, styles) => {
    // 为所有 CSS 规则添加前缀
    const prefixedStyles = styles.replace(/([\s\S]*?)\{/g, (match, selector) => {
      const prefixedSelector = selector
        .split(',')
        .map(s => `${s}[data-app=${appName}]`)
        .join(',');
      return `${prefixedSelector}{`;
    });
    return prefixedStyles;
  },
  
  // Shadow DOM 隔离
  shadow_dom: (container, appContent) => {
    const shadow = container.attachShadow({ mode: 'open' });
    shadow.innerHTML = appContent;
    return shadow;
  }
};

// 2. 全局变量隔离（简化版沙箱）
const globalSandbox = {
  injections: {},
  
  patch() {
    const originWindow = { ...window };
    
    this.injections = new Proxy({}, {
      get(target, key) {
        return target[key] ?? window[key];
      },
      set(target, key, value) {
        target[key] = value;
        return true;
      }
    });
    
    return () => {
      // 恢复原始 window
      Object.keys(window).forEach(key => {
        if (!(key in originWindow)) {
          delete window[key];
        }
      });
      Object.assign(window, originWindow);
    };
  }
};
```

## 路由管理

### Hash 路由与 History 路由

```javascript
// Hash 路由配置
registerApplication({
  name: 'hash-app',
  app: () => import('/hash-app/main.js'),
  activeWhen: (location) => {
    return location.hash.startsWith('#/hash-app');
  }
});

// History 路由配置
registerApplication({
  name: 'history-app',
  app: () => import('/history-app/main.js'),
  activeWhen: '/history-app'
});

// 混合路由
registerApplication({
  name: 'hybrid-app',
  app: () => import('/hybrid/main.js'),
  activeWhen: (location) => {
    // 在开发环境使用 hash 路由
    if (import.meta.env.DEV) {
      return location.hash.startsWith(`#${routePrefix}`);
    }
    // 生产环境使用 history 路由
    return location.pathname.startsWith(routePrefix);
  }
});
```

### 路由过渡与动画

```javascript
// 路由切换动画
const routeTransition = {
  isTransitioning: false,
  
  async transitionOut(currentApp) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    const overlay = document.createElement('div');
    overlay.className = 'route-transition-overlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
    
    await this.wait(300); // 等待动画开始
    
    if (currentApp && currentApp.unmount) {
      await currentApp.unmount(currentApp.customProps);
    }
  },
  
  async transitionIn(nextApp) {
    if (nextApp && nextApp.mount) {
      await nextApp.mount(nextApp.customProps);
    }
    
    const overlay = document.querySelector('.route-transition-overlay');
    if (overlay) {
      overlay.classList.add('fade-out');
      await this.wait(300);
      overlay.remove();
    }
    
    this.isTransitioning = false;
  },
  
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// 自定义导航守卫
const navigationGuards = {
  guards: [],
  
  addGuard(guard) {
    this.guards.push(guard);
  },
  
  async runGuards(location) {
    for (const guard of this.guards) {
      const result = await guard(location);
      if (result === false) {
        return false;
      }
      if (result !== true && typeof result === 'string') {
        // 重定向
        window.history.pushState(null, '', result);
        return false;
      }
    }
    return true;
  }
};
```

## 性能优化

### 1. 应用加载优化

```javascript
// 1. 预加载策略
const prefetchStrategy = {
  // 空闲时预加载
  prefetchIdle: () => {
    requestIdleCallback(() => {
      import('/app-a/main.js');
      import('/app-b/main.js');
    });
  },
  
  // 视口内预加载
  prefetchInView: () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const appName = entry.target.dataset.app;
          import(`/apps/${appName}/main.js`);
          observer.unobserve(entry.target);
        }
      });
    });
    
    document.querySelectorAll('[data-app]').forEach(el => {
      observer.observe(el);
    });
  }
};

// 2. 代码分割
registerApplication({
  name: 'lazy-app',
  app: () => import(/* webpackChunkName: "lazy-app" */ '/lazy/main.js'),
  activeWhen: '/lazy'
});

// 3. 依赖预加载
const dependencies = {
  vue: () => import('vue'),
  react: () => import('react'),
  angular: () => import('angular')
};

const preloadDeps = (appName) => {
  const deps = dependencyMap[appName];
  if (deps) {
    deps.forEach(dep => {
      if (dependencies[dep]) {
        dependencies[dep]();
      }
    });
  }
};
```

### 2. 应用缓存

```javascript
// 应用缓存管理器
const appCache = {
  cache: new Map(),
  
  set(name, app) {
    this.cache.set(name, {
      app,
      timestamp: Date.now()
    });
  },
  
  get(name) {
    const cached = this.cache.get(name);
    if (cached) {
      // 检查缓存是否过期（5分钟）
      if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return cached.app;
      }
      this.cache.delete(name);
    }
    return null;
  },
  
  clear() {
    this.cache.clear();
  }
};

// 使用缓存
registerApplication({
  name: 'cached-app',
  app: () => {
    const cached = appCache.get('cached-app');
    if (cached) {
      return Promise.resolve(cached);
    }
    return import('/cached/main.js').then(app => {
      appCache.set('cached-app', app);
      return app;
    });
  },
  activeWhen: '/cached'
});
```

## 常见问题与解决方案

### 1. 微应用之间样式冲突

```javascript
// 解决方案：CSS Modules 化
const cssModules = {
  process(css, appName) {
    const classMap = {};
    let counter = 0;
    
    const processedCss = css.replace(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g, (match, className) => {
      if (!classMap[className]) {
        classMap[className] = `${className}_${appName}_${counter++}`;
      }
      return `.${classMap[className]}`;
    });
    
    return processedCss;
  },
  
  inject(css, container) {
    const style = document.createElement('style');
    style.textContent = css;
    container.appendChild(style);
    return style;
  }
};

// 使用
const container = document.getElementById('app-container');
const css = await fetch('/app/styles.css').then(r => r.text());
const processedCss = cssModules.process(css, 'my-app');
cssModules.inject(processedCss, container);
```

### 2. 公共依赖重复加载

```javascript
// 解决方案：依赖共享表
const sharedDependencies = {
  'react': window.React,
  'react-dom': window.ReactDOM,
  'vue': window.Vue,
  'vuex': window.Vuex
};

registerApplication({
  name: 'react-app',
  app: () => import('/react/main.js'),
  activeWhen: '/react',
  customProps: {
    shared: sharedDependencies
  }
});

// 在微应用中
export const mount = async (props) => {
  const { shared } = props;
  
  // 使用共享的 React 而非本地版本
  const { createElement } = shared.react;
  const root = shared['react-dom'].createRoot(container);
  root.render(createElement(App));
};
```

### 3. 路由不同步

```javascript
// 解决方案：监听路由变化
const syncRouter = {
  init() {
    // 监听浏览器前进后退
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
    
    // 拦截 pushState 和 replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleRouteChange();
    };
    
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handleRouteChange();
    };
  },
  
  handleRouteChange() {
    // 通知所有微应用
    const currentPath = location.pathname;
    window.dispatchEvent(new CustomEvent('router-change', {
      detail: { path: currentPath }
    }));
  }
};
```

---

## 面试题

### 面试题 1：Single-SPA 的工作原理是什么？

**参考答案：**

Single-SPA 的核心原理是在容器应用中管理多个微应用的生命周期，通过路由匹配决定何时加载、挂载、卸载微应用。

**工作流程：**

1. **注册阶段**：通过 `registerApplication()` 将微应用注册到 single-spa 的应用列表中，配置应用名称、加载函数、激活条件和自定义属性。

2. **启动阶段**：调用 `start()` 启动 single-spa，此时会检查当前 URL 匹配的微应用并加载它们。

3. **路由监听**：Single-SPA 内部监听 URL 变化（通过 `hashchange` 和 `popstate` 事件），当路由变化时，重新评估所有应用的 `activeWhen` 条件。

4. **生命周期管理**：
   - 当应用被激活时，依次调用 `bootstrap` → `mount`
   - 当应用被停用时，调用 `unmount`，必要时调用 `unload`
   - 保证同一时刻只有一个相同 `activeWhen` 的应用处于 mounted 状态

**源码核心逻辑：**

```javascript
// single-spa 核心实现简化版
const apps = [];

function registerApplication(config) {
  apps.push({
    name: config.name,
    app: config.app,
    activeWhen: config.activeWhen,
    customProps: config.customProps,
    status: 'NOT_LOADED'
  });
}

function start() {
  reroute(); // 初始加载
  window.addEventListener('hashchange', reroute);
  window.addEventListener('popstate', reroute);
}

function reroute() {
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();
  
  // 加载需要加载的应用
  appsToLoad.forEach(loadApp);
  
  // 卸载需要卸载的应用
  appsToUnmount.forEach(unmountApp);
  
  // 挂载需要挂载的应用
  appsToMount.forEach(mountApp);
}

function getAppChanges() {
  const currentPath = location.pathname;
  return apps.reduce((result, app) => {
    const isActive = typeof app.activeWhen === 'function' 
      ? app.activeWhen(location) 
      : location.pathname.startsWith(app.activeWhen);
    
    if (isActive && app.status === 'NOT_LOADED') {
      result.appsToLoad.push(app);
    } else if (isActive && app.status !== 'MOUNTED') {
      result.appsToMount.push(app);
    } else if (!isActive && app.status === 'MOUNTED') {
      result.appsToUnmount.push(app);
    }
    return result;
  }, { appsToLoad: [], appsToMount: [], appsToUnmount: [] });
}
```

### 面试题 2：Single-SPA 与 Qiankun 的区别是什么？何时选择哪个？

**参考答案：**

| 对比维度 | Single-SPA | Qiankun |
|---------|-----------|---------|
| **定位** | 纯粹的微前端调度器 | 企业级微前端解决方案 |
| **沙箱隔离** | 不提供 | 基于 Proxy 的强沙箱 |
| **样式隔离** | 不提供 | CSS Modules + Shadow DOM |
| **HTML 入口** | 需手动解析 | 自动解析子应用 HTML |
| **预加载** | 无 | smart prefetch |
| **依赖共享** | 手动配置 | 内置 shared 机制 |
| **接入难度** | 较高 | 较低 |
| **打包体积** | 更小 | 稍大 |

**选择建议：**

- **选择 Single-SPA**：
  - 项目简单，微应用数量少
  - 需要高度定制化的微前端方案
  - 技术栈统一（如全是 React 或全是 Vue）
  - 对包体积敏感
  - 团队有能力自行实现沙箱和样式隔离

- **选择 Qiankun**：
  - 企业级大型项目
  - 需要强隔离的沙箱环境
  - 接入成本要低
  - 需要同时支持 Vue、React、Angular 等多框架
  - 需要预加载等性能优化策略

**实际项目选型建议：**

```javascript
// 小型项目 - Single-SPA 足够
// 场景：2-3 个微应用，技术栈统一，无安全要求
const config = {
  name: 'small-project',
  use: singleSpa({
    projects: ['react-app', 'vue-app'],
    styleIsolation: false // 不需要
  })
};

// 大型企业级项目 - Qiankun 更合适
// 场景：10+ 微应用，多团队协作，多技术栈混合
const config = {
  name: 'enterprise-project',
  use: qiankun({
    apps: [...],
    sandbox: {
      strictStyleIsolation: true,
      experimentalStyleIsolation: true
    },
    prefetch: ['critical-apps'],
    shared: {
      vue: ['Vue', Vuex, Router],
      react: ['React', ReactDOM]
    }
  })
};
```

### 面试题 3：如何解决 Single-SPA 中多个微应用的样式冲突？

**参考答案：**

**方案一：CSS Modules**

为每个微应用的 CSS 类名添加唯一前缀，实现样式隔离。

```javascript
// 构建工具配置（以 webpack 为例）
{
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          }
        }
      ]
    }]
  }
}
```

**方案二：手动添加前缀**

在运行时为样式规则添加前缀。

```javascript
const stylePrefixer = (appName, cssText) => {
  // 匹配所有 CSS 规则选择器
  const prefixedCss = cssText.replace(/([^{]+)\{([^}]+)\}/g, (match, selectors, declarations) => {
    const prefixedSelectors = selectors.split(',').map(selector => {
      const trimmed = selector.trim();
      // 跳过 @media、@keyframes 等 at-rules
      if (trimmed.startsWith('@')) {
        return selector;
      }
      return `[data-app="${appName}"] ${selector}`;
    }).join(',');
    
    return `${prefixedSelectors}{${declarations}}`;
  });
  
  return prefixedCss;
};

// 使用
const container = document.getElementById('vue-app');
const css = await fetch('/vue-app/styles.css').then(r => r.text());
const prefixedCss = stylePrefixer('vue-app', css);

const styleEl = document.createElement('style');
styleEl.textContent = prefixedCss;
container.appendChild(styleEl);
```

**方案三：Shadow DOM 隔离**

使用 Shadow DOM 实现完全的样式隔离。

```javascript
const mountWithShadow = (appName, appContent, container) => {
  const shadow = container.attachShadow({ mode: 'open' });
  
  // 创建样式
  const style = document.createElement('style');
  style.textContent = `
    :host {
      display: block;
      --primary-color: #3498db;
    }
    .app-title {
      color: var(--primary-color);
    }
  `;
  
  shadow.appendChild(style);
  
  // 添加 HTML 内容
  const template = document.createElement('template');
  template.innerHTML = appContent;
  shadow.appendChild(template.content.cloneNode(true));
  
  return shadow;
};
```

**方案四：Iframe 隔离**

完全隔离的方案，但通信成本高。

```javascript
const mountWithIframe = (appName, appUrl, container) => {
  const iframe = document.createElement('iframe');
  iframe.src = appUrl;
  iframe.style.border = 'none';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  
  // 通过 postMessage 通信
  iframe.contentWindow.addEventListener('message', (event) => {
    // 处理来自微应用的消息
    console.log('Message from iframe:', event.data);
  });
  
  container.appendChild(iframe);
  
  // 向 iframe 发送消息
  iframe.contentWindow.postMessage({ type: 'MOUNT', appName }, '*');
  
  return iframe;
};
```

**实际项目中推荐方案：**

考虑到维护成本和隔离效果，建议：

1. **开发规范**：统一使用 CSS Modules 或 BEM 命名规范
2. **运行时隔离**：使用 CSS 前缀 + Shadow DOM 结合
3. **特殊场景**：对于老旧项目，使用 Iframe 隔离

### 面试题 4：Single-SPA 中微应用之间如何实现通信？

**参考答案：**

**方案一：Custom Props 传递（最推荐）**

通过 `registerApplication` 的 `customProps` 向微应用传递通信接口。

```javascript
// 根应用
const eventBus = {
  listeners: {},
  
  on(event, callback) {
    (this.listeners[event] = this.listeners[event] || []).push(callback);
  },
  
  off(event, callback) {
    this.listeners[event] = (this.listeners[event] || [])
      .filter(cb => cb !== callback);
  },
  
  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data));
  }
};

const globalStore = {
  state: { user: null },
  setState(updates) {
    this.state = { ...this.state, ...updates };
    eventBus.emit('stateChange', this.state);
  }
};

registerApplication({
  name: 'app-a',
  app: () => import('/app-a/main.js'),
  activeWhen: '/app-a',
  customProps: { eventBus, globalStore }
});

// 微应用中使用
export const mount = async (props) => {
  const { eventBus, globalStore } = props;
  
  eventBus.on('stateChange', (newState) => {
    console.log('State updated:', newState);
  });
  
  // 修改全局状态
  globalStore.setState({ user: { id: 1, name: 'John' } });
};
```

**方案二：基于 BroadcastChannel**

适用于同源的不同标签页或微应用之间的通信。

```javascript
// 创建通信频道
const channel = new BroadcastChannel('micro-app-channel');

registerApplication({
  name: 'app-a',
  app: () => import('/app-a/main.js'),
  activeWhen: '/app-a',
  customProps: {
    sendMessage: (data) => channel.postMessage(data),
    onMessage: (callback) => {
      channel.addEventListener('message', (event) => callback(event.data));
    }
  }
});
```

**方案三：window 事件通信**

利用原生 DOM 事件机制。

```javascript
// 发送消息
const emitGlobalEvent = (eventName, data) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
};

// 监听消息
const subscribeGlobalEvent = (eventName, callback) => {
  const handler = (event) => callback(event.detail);
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
};

// 使用
export const mount = async (props) => {
  const unsubscribe = subscribeGlobalEvent('user-login', (user) => {
    console.log('User logged in:', user);
  });
  
  // 在 unmount 时清理
  export const unmount = async () => {
    unsubscribe();
  };
};
```

**方案四：localStorage 事件（跨标签页）**

```javascript
class CrossTabEventBus {
  constructor(channel) {
    this.channel = channel;
    this.listeners = [];
    
    window.addEventListener('storage', (e) => {
      if (e.key === channel && e.newValue) {
        try {
          const { type, payload } = JSON.parse(e.newValue);
          this.listeners.forEach(cb => cb({ type, payload }));
        } catch (e) {}
      }
    });
  }
  
  emit(type, payload) {
    localStorage.setItem(this.channel, JSON.stringify({
      type,
      payload,
      timestamp: Date.now()
    }));
    // 立即触发本地监听
    this.listeners.forEach(cb => cb({ type, payload }));
  }
  
  on(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
}
```

**通信方案对比：**

| 方案 | 实时性 | 跨标签页 | 复杂度 | 适用场景 |
|------|--------|---------|--------|---------|
| Custom Props | ✅ 高 | ❌ | 低 | 微应用间通信 |
| BroadcastChannel | ✅ 高 | ✅ | 低 | 同源跨标签页 |
| window 事件 | ✅ 高 | ❌ | 低 | 简单事件通知 |
| localStorage | ❌ 低 | ✅ | 低 | 状态同步 |
| postMessage | ✅ 高 | ✅ | 中 | 跨域通信 |

### 面试题 5：Single-SPA 的缺点是什么？如何规避？

**参考答案：**

**主要缺点：**

1. **缺少沙箱隔离**
   - 全局变量容易冲突
   - DOM 操作可能相互影响
   - 事件监听器可能相互覆盖

2. **样式冲突问题**
   - 没有内置样式隔离
   - 需手动处理或配合 CSS Modules

3. **依赖共享复杂**
   - 需要手动配置依赖共享
   - 版本冲突难以处理

4. **初始加载性能**
   - 多个微应用首屏加载慢
   - 需要自行实现预加载策略

**规避方案：**

**1. 沙箱隔离实现**

```javascript
// 简易沙箱实现
class SimpleSandbox {
  constructor(appName) {
    this.appName = appName;
    this.modifiedProps = new Map();
  }
  
  proxy() {
    const proxyWindow = {};
    const proxy = new Proxy(proxyWindow, {
      get(target, prop) {
        if (this.modifiedProps.has(prop)) {
          return this.modifiedProps.get(prop);
        }
        return window[prop];
      },
      set(target, prop, value) {
        // 检查是否已存在
        if (prop in window) {
          this.modifiedProps.set(prop, value);
        }
        return true;
      }.bind(this)
    });
    
    return proxy;
  }
  
  active() {
    // 记录当前 window 快照
    this.snapshot = { ...window };
  }
  
  inactive() {
    // 恢复被修改的属性
    this.modifiedProps.forEach((value, key) => {
      delete window[key];
    });
    this.modifiedProps.clear();
  }
}
```

**2. 依赖预加载优化**

```javascript
// 预加载配置
const preloadConfig = {
  strategy: 'viewport', // viewport | idle | all
  
  preload: (appName) => {
    const dependencies = {
      'vue-app': ['vue', 'vuex', 'vue-router'],
      'react-app': ['react', 'react-dom', 'redux']
    };
    
    return dependencies[appName] || [];
  }
};

// 预加载实现
const preloadDeps = (deps) => {
  deps.forEach(dep => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = `/deps/${dep}.js`;
    document.head.appendChild(link);
  });
};
```

**3. 应用分片加载**

```javascript
// 根据路由分片加载
const routeBasedChunks = {
  '/dashboard': ['vue-app'],
  '/analytics': ['react-app', 'd3'],
  '/settings': ['vue-app', 'tinymce']
};

// 智能加载器
const smartLoader = {
  loaded: new Set(),
  
  loadForRoute(path) {
    const chunks = routeBasedChunks[path] || [];
    chunks.forEach(appName => {
      if (!this.loaded.has(appName)) {
        import(`/apps/${appName}/main.js`);
        this.loaded.add(appName);
      }
    });
  }
};
```

**4. 完整的规避策略总结**

```javascript
// 完整的 Single-SPA 配置
const microFrontendConfig = {
  apps: [
    { name: 'vue-app', entry: '/vue', activeWhen: '/vue' },
    { name: 'react-app', entry: '/react', activeWhen: '/react' }
  ],
  
  // 1. 沙箱配置
  sandbox: {
    strictStyleIsolation: true,
    snapshot: false
  },
  
  // 2. 依赖共享
  shared: {
    vue: window.Vue,
    react: window.React
  },
  
  // 3. 预加载策略
  prefetch: ['critical-app'],
  
  // 4. 样式隔离
  styleIsolation: (css, appName) => {
    return css.replace(/([^{]+)\{/g, 
      `[data-app="${appName}"] $1{`);
  },
  
  // 5. 错误边界
  errorBoundary: {
    errorHandler: (error, appName) => {
      console.error(`[${appName}] Error:`, error);
      reportError(error, appName);
    },
    fallbackUI: (appName) => {
      return `<div class="error-boundary">
        <p>应用 ${appName} 加载失败</p>
        <button onclick="location.reload()">刷新页面</button>
      </div>`;
    }
  }
};
```

**总结建议：**

对于对隔离要求高的企业级应用，建议：

1. **预算充足**：直接选择 Qiankun，它已经解决了这些问题
2. **定制需求**：在 Single-SPA 基础上自建沙箱和样式隔离
3. **简单场景**：Single-SPA + 团队编码规范就足够