# Vite 面试指南

## 核心概念

Vite 是新一代前端构建工具，利用 ES Module 和原生浏览器 API 实现极快的开发服务器启动和热更新。

---

## 核心特性

### 对比 Webpack

| 特性       | Vite         | Webpack          |
| ---------- | ------------ | ---------------- |
| 构建方式   | ESM 原生加载 | 预先打包         |
| 开发服务器 | 毫秒级启动   | 需要打包，启动慢 |
| 热更新     | 按需更新模块 | 重新打包相关模块 |
| 生产构建   | Rollup       | Webpack          |
| 配置复杂度 | 简单         | 复杂             |
| 生态       | 快速发展中   | 成熟稳定         |

### 工作原理

```
┌─────────────────────────────────────────────────────────────┐
│                        开发模式                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   浏览器 ────── 请求 ──────> Vite Dev Server                  │
│                          │                                   │
│                          ├── index.html                      │
│                          │    返回 HTML + type="module"       │
│                          │    的 import 语句                  │
│                          │                                   │
│                          ├── /src/main.js                    │
│                          │    返回 ESM 格式的源码              │
│                          │    (no bundle)                    │
│                          │                                   │
│                          └── /src/style.css                  │
│                               返回 CSS 源码                  │
│                                                             │
│   注：只有请求时才转换，按需加载                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        生产模式                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   vite build                                                │
│      │                                                       │
│      ├── @vitejs/plugin-react (或其他框架插件)               │
│      │                                                       │
│      └── Rollup 打包                                        │
│           │                                                 │
│           ├── 依赖预构建 (esbuild)                           │
│           │    - 多种格式 → ESM                             │
│           │    - 合并小模块                                 │
│           │    - 解决CommonJS依赖                          │
│           │                                                 │
│           └── 代码分割                                       │
│                - 路由分割                                   │
│                - 公共依赖分割                               │
│                                                             │
│   输出: 优化过的静态资源                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 基础配置

### 核心配置

```javascript
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
    plugins: [vue()],

    // 基础路径
    base: "./",

    // 服务器配置
    server: {
        port: 3000,
        host: true,
        open: true,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
        },
    },

    // 构建配置
    build: {
        outDir: "dist",
        assetsDir: "assets",
        sourcemap: false,
        minify: "terser",
        rollupOptions: {
            output: {
                manualChunks: {
                    vue: ["vue", "vue-router", "pinia"],
                    vendor: ["element-plus"],
                },
            },
        },
    },

    // 路径别名
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },

    // css 配置
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";`,
            },
        },
    },

    // 依赖优化
    optimizeDeps: {
        include: ["vue", "vue-router"],
    },
});
```

---

## 面试高频问题

### Q1：Vite 为什么启动这么快？

**答**：

**核心原因**：

1. **ESM 原生支持**：现代浏览器原生支持 ES Module，Vite 不需要在启动时打包整个项目
2. **按需加载**：只有当模块被请求时，Vite 才进行转换和发送
3. **依赖预构建**：使用 esbuild 对第三方依赖进行预构建（一次性）

```bash
# Webpack 启动流程
1. 读取配置文件
2. 解析入口文件
3. 递归解析所有依赖模块（耗时！）
4. 打包所有模块到 bundle（耗时！）
5. 启动开发服务器

# Vite 启动流程
1. 读取配置文件
2. 启动开发服务器
3. 浏览器请求时按需转换（快！）
```

**示例**：

```javascript
// 入口文件
import Vue from "vue";
import App from "./App.vue";

new Vue(App).$mount("#app");

// 浏览器请求 main.js 时，Vite 返回：
// import { createElementVNode as _createElementVNode } from 'vue'
// import { createApp } from './node_modules/vue/dist/vue.esm-bundler.js'
// ...
// 而不是打包后的巨大 bundle
```

### Q2：Vite 热更新原理？

**答**：

**流程**：

```
┌──────────────────────────────────────────────────────────────┐
│                      Vite HMR 流程                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   1. 文件变化                                                 │
│      file watcher 检测到 src/App.vue 变化                     │
│                                                              │
│   2. 编译更新模块                                             │
│      Vite 只编译变化的 App.vue                               │
│      生成新的 ESM 模块                                        │
│                                                              │
│   3. 推送更新                                                 │
│      通过 WebSocket 向浏览器推送 HMR 更新                     │
│                                                              │
│   4. 模块替换                                                 │
│      浏览器执行 HMR API，替换旧模块                           │
│      组件执行 setup() 重新渲染                               │
│                                                              │
│   5. 边界处理                                                 │
│      如果 HMR 边界（如 Vue 组件），                          │
│      Vue 框架会处理组件重渲染                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Vite 与 Webpack HMR 对比**：

| 阶段     | Vite              | Webpack                |
| -------- | ----------------- | ---------------------- |
| 检测变化 | 原生 fs watcher   | webpack-dev-server     |
| 编译范围 | 单个模块          | 变化模块 + 相关模块    |
| 传输格式 | ESM（浏览器原生） | JSON + 模块 ID         |
| 更新速度 | 毫秒级            | 秒级（取决于项目大小） |

### Q3：Vite 的依赖预构建是什么？

**答**：

**为什么需要预构建**：

1. **兼容 CommonJS**：很多 npm 包使用 CommonJS 格式
2. **减少请求数**：合并分散的小模块
3. **转换 ESM**：将 CJS 转换为 ESM

```javascript
// 预构建前
import Vue from "vue";
// Vue 可能有 50 个分散的文件，50 次请求！

// 预构建后
import Vue from "/node_modules/.vite/deps/vue.js";
// 合并成一个文件，1 次请求
```

**配置**：

```javascript
export default defineConfig({
    optimizeDeps: {
        // 预构建的依赖
        include: ["vue", "vue-router", "pinia"],
        // 排除的依赖
        exclude: ["your-local-package"],
        // 构建选项
        esbuildOptions: {
            jsxFactory: "h",
            jsxFragment: "Fragment",
        },
    },
});
```

**预构建产物**：

```
node_modules/.vite/
    ├── deps/
    │   ├── vue.js           # 预构建后的 vue
    │   ├── vue.js.map
    │   └── ...
    └── cache/               # 缓存
```

### Q4：Vite 生产构建为什么选择 Rollup？

**答**：

**Rollup 优势**：

| 特性         | Rollup   | Webpack |
| ------------ | -------- | ------- |
| Tree Shaking | 更强     | 一般    |
| 输出格式     | 专注 ESM | 多格式  |
| 代码简洁度   | 更简洁   | 较冗余  |
| 插件生态     | 较局限   | 丰富    |

**Rollup 输出格式**：

```javascript
// Vite 构建配置
build: {
    rollupOptions: {
        output: {
            // 输出格式选项
            format: 'es',           // es module
            // format: 'cjs',       // CommonJS
            // format: 'umd',       // UMD
            // format: 'iife'       // 立即执行函数

            entryFileNames: '[name].[hash].js',
            chunkFileNames: '[name].[hash].js',
            assetFileNames: '[name].[hash].[ext]'
        }
    }
}
```

### Q5：Vite 和 Webpack 的性能对比？

**答**：

**开发环境启动速度**：

```
项目规模     Webpack      Vite
────────────────────────────────
小型项目     5-10s        <100ms
中型项目     20-60s       <200ms
大型项目     1-5min       <500ms
```

**热更新速度**：

```
场景              Webpack          Vite
──────────────────────────────────────
样式修改           100-300ms        10-50ms
组件逻辑修改       500ms-3s         10-100ms
新增依赖           需要重启         增量更新
```

**生产构建**：

```
对比项            Webpack          Vite(Rollup)
────────────────────────────────────────
构建速度          较慢             快 20-40%
Bundle 体积       较大             小 5-15%
Tree Shaking      基础             更强
代码分割          插件支持         内置支持
```

### Q6：Vite 的 CSS 处理方式？

**答**：

**内置支持**：

1. `.css` - 原生 CSS
2. `.less` / `.sass` / `.scss` / `.styl` - 预处理器
3. `.css modules` - CSS Modules

**配置**：

```javascript
export default defineConfig({
    css: {
        // CSS Modules
        modules: {
            localsConvention: "camelCase",
            generateScopedName: "[name]__[local]--[hash:base64:5]",
        },

        // 预处理器选项
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";`,
                api: "modern-compiler", // 或 'legacy'
            },
            less: {
                javascriptEnabled: true,
            },
        },

        // 是否提取 CSS
        // dev: false, 生产模式下自动提取
        devSourcemap: true,
    },
});
```

**PostCSS 支持**：

```javascript
// postcss.config.js
module.exports = {
    plugins: [require("autoprefixer"), require("postcss-preset-env")],
};
```

### Q7：Vite 如何处理环境变量？

**答**：

**环境变量文件**：

```
.env                # 所有环境
.env.local          # 所有环境，优先级高，不提交
.env.development    # 开发环境
.env.production     # 生产环境
.env.test           # 测试环境
```

**文件内容**：

```bash
# .env.development
VITE_APP_TITLE=开发环境
VITE_API_BASE=/api
VITE_UPLOAD_URL=http://localhost:8080/upload

# .env.production
VITE_APP_TITLE=生产环境
VITE_API_BASE=https://api.example.com
VITE_UPLOAD_URL=https://api.example.com/upload
```

**使用**：

```javascript
// 必须以 VITE_ 开头才能访问
console.log(import.meta.env.VITE_APP_TITLE);
console.log(import.meta.env.VITE_API_BASE);

// 类型提示
// env.d.ts
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_API_BASE: string;
    readonly VITE_UPLOAD_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
```

**Vite 1.x vs 2.x 差异**：

```javascript
// Vite 1.x
process.env.VITE_USER_MODE;

// Vite 2.x
import.meta.env.VITE_USER_MODE;
```

### Q8：Vite 插件系统？

**答**：

**插件 Hook**：

```javascript
// Vite 插件结构
export default function myPlugin() {
    return {
        name: "vite-plugin-name", // 插件名称

        // 全顿
        enforce: "pre", // 或 'post'，控制执行顺序

        // 钩子
        options(options) {}, // 处理配置
        buildStart(options) {}, // 构建开始
        config(config, { mode }) {}, // 处理配置
        configureServer(server) {}, // 配置开发服务器
        transformIndexHtml(html) {}, // 转换 HTML
        transform(code, id) {}, // 转换模块
        load(id) {}, // 加载模块
        resolveId(source, importer) {}, // 解析模块路径
        handleHotUpdate(ctx) {}, // 处理热更新

        // 输出
        generateBundle(options, bundle) {},
    };
}
```

**完整示例**：

```javascript
// vite-plugin-console-logger.js
export default function consoleLogger() {
    return {
        name: "vite-plugin-console-logger",
        transform(code, id) {
            if (!id.endsWith(".js")) return;

            // 移除所有 console.log
            const transformed = code.replace(/console\.(log|debug|info)\([^)]*\)/g, "");

            return {
                code: transformed,
                map: null,
            };
        },
    };
}
```

**使用插件**：

```javascript
// vite.config.js
import vue from "@vitejs/plugin-vue";
import consoleLogger from "./vite-plugin-console-logger";

export default defineConfig({
    plugins: [vue(), consoleLogger()],
});
```

### Q9：Vite 与 TypeScript？

**答**：

**内置支持**：

- `.ts` 文件直接使用，无需额外配置
- 使用 `esbuild` 进行类型转换（比 tsc 快 20-100 倍）
- 类型检查需要配合 `vue-tsc`

**配置**：

```javascript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    // Vite 自动识别 tsconfig.json
});
```

**与 Vue 配合**：

```vue
<script setup lang="ts">
import { ref, computed } from "vue";

interface User {
    name: string;
    age: number;
}

const user = ref<User>({
    name: "zs",
    age: 18,
});

const greeting = computed(() => `Hello, ${user.value.name}`);
</script>
```

**类型验证**：

```bash
# 开发时跳过类型检查（快速启动）
vite build

# 完整类型检查
vue-tsc --noEmit
```

### Q10：Vite 兼容性和浏览器支持？

**答**：

**ESM 要求**：

```javascript
// vite.config.js
export default defineConfig({
    build: {
        target: "es2015", // 兼容目标
        outDir: "dist",
        rollupOptions: {
            output: {
                // 兼容旧浏览器
                legacyDynamicImport: true,
            },
        },
    },
});
```

**Polyfill 方案**：

```bash
# 使用 @vitejs/plugin-legacy
npm install -D @vitejs/plugin-legacy

# vite.config.js
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
    plugins: [
        legacy({
            targets: ['defaults', 'not IE 11'],
            additionalLegacyPolyfills: ['regenerator-runtime/runtime']
        })
    ]
});
```

**目标浏览器配置**：

```json
// package.json 或 .browserslistrc
{
    "browserslist": ["> 1%", "last 2 versions", "not dead", "not IE 11"]
}
```

---

## 最佳实践

### 性能优化配置

```javascript
export default defineConfig({
    build: {
        // 分包
        rollupOptions: {
            output: {
                manualChunks: {
                    "vue-vendor": ["vue", "vue-router", "pinia"],
                    "element-vendor": ["element-plus"],
                },
            },
        },

        // 压缩
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },

        // CSS Code Splitting
        cssCodeSplit: true,

        // 资源内联阈值
        assetsInlineLimit: 4096,
    },

    // 依赖优化
    optimizeDeps: {
        include: ["vue", "vue-router", "pinia"],
    },
});
```

### 常见问题解决

| 问题         | 解决方案                                                 |
| ------------ | -------------------------------------------------------- |
| 启动白屏     | 检查 base 配置、import 路径                              |
| 热更新失效   | 检查 HMR 配置、插件顺序                                  |
| 生产构建失败 | 禁用 cache、清理 node_modules/.vite                      |
| CJS 依赖报错 | 添加到 optimizeDeps.exclude                              |
| Worker 报错  | 使用 new Worker(new URL('./worker.js', import.meta.url)) |
