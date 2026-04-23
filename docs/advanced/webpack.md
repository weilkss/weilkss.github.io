# Webpack 面试指南

## 核心概念

Webpack 是前端工程化的核心工具，用于打包、构建和管理项目依赖。面试中经常考察对 Webpack 原理、配置和优化的理解。

---

## 基础配置

### 核心概念

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/index.js',           // 入口文件
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[contenthash].js',  // 输出文件名
        clean: true,                    // 清理输出目录
    },
    mode: 'production',                // 模式：development/production/none
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
    devServer: {
        static: './dist',
        hot: true,
        port: 3000,
    },
};
```

### 常用 Loader

| Loader | 功能 | 示例 |
|--------|------|------|
| babel-loader | ES6+ 转 ES5 | 处理 .js 文件 |
| css-loader | 处理 CSS 中的 @import 和 url() | 处理 .css 文件 |
| style-loader | 将 CSS 注入到 DOM | 处理 .css 文件 |
| sass-loader | 编译 Sass/Scss | 处理 .scss 文件 |
| file-loader | 处理文件导入 | 处理图片、字体 |
| url-loader | 类似 file-loader，可设置阈值 | 小文件转 base64 |
| vue-loader | 处理 Vue 组件 | 处理 .vue 文件 |
| ts-loader | 处理 TypeScript | 处理 .ts 文件 |
| eslint-loader | 代码检查 | 处理 .js 文件 |

### 常用 Plugin

| Plugin | 功能 |
|--------|------|
| HtmlWebpackPlugin | 自动生成 HTML 文件 |
| MiniCssExtractPlugin | 提取 CSS 到单独文件 |
| CleanWebpackPlugin | 清理输出目录 |
| DefinePlugin | 定义全局常量 |
| CopyWebpackPlugin | 复制静态文件 |
| CompressionPlugin | 压缩资源 |
| TerserPlugin | 压缩 JavaScript |
| SplitChunksPlugin | 代码分割 |

---

## 面试高频问题

### Q1：Webpack 的构建流程？

**答**：

**核心流程**：

```
初始化 → 编译 → 输出 → 完成

1. 初始化
   - 读取配置参数
   - 初始化 Compiler 对象
   - 加载插件

2. 编译阶段
   - Entry：确定入口文件
   - Module：从入口文件出发，调用 Loader 转换模块内容
   - Dependency Parsing：解析模块依赖
   - Module Graph：构建模块依赖图

3. 输出阶段
   - Seal：对模块进行组合优化，生成 chunks
   - Output：生成最终文件到输出目录
```

**关键阶段**：

```javascript
// Webpack 核心工作流程伪代码
class Compiler {
    run(callback) {
        // 1. 初始化
        this.options = resolveOptions(this.config);
        
        // 2. 编译
        const compilation = new Compilation(this.options);
        compilation.build(entry, (err, module) => {
            // 3. 封装输出
            const result = this.seal(module);
            
            // 4. 输出
            this.emitAssets(result, callback);
        });
    }
}
```

### Q2：Loader 和 Plugin 的区别？

**答**：

| 特性 | Loader | Plugin |
|------|--------|--------|
| 作用时机 | 文件转换时 | 整个构建过程 |
| 输入 | 文件内容 | 构建过程中的数据结构 |
| 输出 | 转换后的内容 | 参与构建流程的修改 |
| 执行方式 | 链式调用 | 基于事件流机制 |
| 配置位置 | module.rules | plugins 数组 |

** Loader 执行流程**：
```javascript
// 一个文件可能经过多个 Loader 转换
module.rules = [
    {
        test: /\.scss$/,
        use: [
            'style-loader',      // 3. 最后执行：注入到 DOM
            'css-loader',        // 2. 执行：处理 CSS @import/url()
            'sass-loader'        // 1. 先执行：编译 Sass
        ]
    }
]
```

**Plugin 事件流**：
```javascript
// Webpack 内部使用 Tapable 实现事件流
compiler.hooks.emit.tap('MyPlugin', (compilation) => {
    // 在输出文件前执行
});

compiler.hooks.done.tap('MyPlugin', (stats) => {
    // 构建完成时执行
});
```

### Q3：如何优化 Webpack 构建速度？

**答**：

**1. 优化 Loader 范围**
```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,  // 排除不需要处理的文件
                include: path.resolve(__dirname, 'src'),
            }
        ]
    }
}
```

**2. 开启缓存**
```javascript
module.exports = {
    cache: {
        type: 'filesystem',      // 文件系统缓存
        buildDependencies: {
            config: [__filename]  // 配置文件改变时清除缓存
        }
    }
}
```

**3. 使用 HappyPack/thread-loader 并行处理**
```javascript
// thread-loader
{
    test: /\.js$/,
    use: [
        {
            loader: 'thread-loader',
            options: {
                workers: 3,  // 启动 3 个 worker
            }
        },
        'babel-loader'
    ]
}
```

**4. 优化 resolve 配置**
```javascript
module.exports = {
    resolve: {
        extensions: ['.js', '.vue', '.json'],  // 减少文件查找
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'vue$': 'vue/dist/vue.esm.js'       // 精确匹配
        },
        symlinks: false,                         // 禁用 symlinks 解析
    }
}
```

**5. 使用 externals 排除大依赖**
```javascript
module.exports = {
    externals: {
        vue: 'Vue',
        'element-ui': 'ELEMENT'
    }
}
```

### Q4：如何做代码分割（Code Splitting）？

**答**：

**1. 配置 optimization.splitChunks**
```javascript
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',           // 对所有 chunk 生效
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: -10,
                },
                common: {
                    minChunks: 2,    // 至少 2 个 chunk 引用才提取
                    name: 'common',
                    priority: -20,
                }
            }
        }
    }
}
```

**2. 动态 import**
```javascript
// 方式1：React.lazy + Suspense
const About = React.lazy(() => import('./About'));

// 方式2：路由级分割
const routes = [
    { path: '/about', component: () => import('./About') }
];

// 方式3：手动分割
import(/* webpackChunkName: 'lodash' */ 'lodash').then(_ => {
    // 使用 lodash
});
```

**3. 提取公共依赖**
```javascript
// 同步加载的公共模块
new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: 2
});
```

### Q5：如何优化 bundle 体积？

**答**：

**1. Tree Shaking**
```javascript
// package.json
{
    "sideEffects": false,  // 标记无副作用的文件
    // 或者指定有副作用的文件
    "sideEffects": ["*.css", "*.scss"]
}

// webpack.config.js
module.exports = {
    mode: 'production',  // 生产模式自动开启 tree shaking
    optimization: {
        usedExports: true
    }
}
```

**2. 压缩和优化**
```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,  // 移除 console
                        drop_debugger: true
                    }
                }
            })
        ]
    }
}
```

**3. 图片优化**
```javascript
{
    test: /\.(png|jpe?g|gif|svg)$/i,
    type: 'asset',
    parser: {
        dataUrlCondition: {
            maxSize: 8 * 1024  // 8kb 以下的图片转 base64
        }
    },
    generator: {
        filename: 'images/[name].[hash][ext]'
    }
}
```

**4. 分析工具**
```bash
# webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    plugins: [
        new BundleAnalyzerPlugin()
    ]
}
```

### Q6：Webpack 的热更新原理？

**答**：

**热更新流程**：

```
┌─────────────────────────────────────────────────────┐
│                      浏览器                          │
│  ┌─────────────┐    WebSocket    ┌──────────────┐  │
│  │ HMR Runtime │ ←────────────── │ HMR Server   │  │
│  └─────────────┘                  └──────────────┘  │
│         ↓                                  ↑        │
│    更新模块                            监听文件变化  │
│         ↓                                  ↑        │
│  ┌─────────────┐                  ┌──────────────┐ │
│  │   App       │                  │   Webpack    │ │
│  │  Runtime    │                  │   Compile    │ │
│  └─────────────┘                  └──────────────┘ │
└─────────────────────────────────────────────────────┘
```

**实现代码**：
```javascript
// 开启热更新
devServer: {
    hot: true,
    hotOnly: true
}

// 在代码中使用
if (module.hot) {
    module.hot.accept('./render', () => {
        render();  // 当 render.js 变化时执行
    });
    
    module.hot.decline('./unrelated');  // 不进行热更新
}
```

**HMR 触发方式**：
1. 修改 CSS/JS 文件
2. Webpack 重新编译
3. 通过 WebSocket 推送更新消息
4. HMR Runtime 下载更新模块
5. 执行 HMR Update

### Q7：Webpack 5 和 Webpack 4 的区别？

**答**：

| 特性 | Webpack 4 | Webpack 5 |
|------|-----------|-----------|
| 构建速度 | 较慢 | 提升 20%-95% |
| 缓存 | 无持久缓存 | 内置持久缓存 |
| Tree Shaking | 基础 | 更强（嵌套Tree Shaking） |
| Module Federation | 无 | 支持（微前端） |
| 资源模块 | 无 | 原生支持（asset module） |
| 输出文件名 | [hash] | [contenthash]（内容哈希） |
| 自动 polyfill | 有 | 移除（需手动配置） |
| 构建优化 | 插件分散 | 优化内置化 |

**Webpack 5 重要变化**：

```javascript
// 1. 资源模块（替代 file-loader/url-loader）
module.exports = {
    module: {
        rules: [
            {
                test: /\.png/,
                type: 'asset/resource'  // 输出文件
                // type: 'asset/inline'  // 转 base64
                // type: 'asset'         // 自动选择
            }
        ]
    }
}

// 2. 持久缓存
module.exports = {
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename]
        }
    }
}

// 3. Module Federation（微前端）
// host 配置
new ModuleFederationPlugin({
    name: 'host',
    remotes: {
        remote: 'remote@http://localhost:3001/remote.js'
    }
});

// remote 配置
new ModuleFederationPlugin({
    name: 'remote',
    filename: 'remote.js',
    exposes: {
        './Button': './src/Button'
    }
});
```

### Q8：如何排查 Webpack 构建问题？

**答**：

**1. 使用 stats 选项控制输出**
```javascript
module.exports = {
    stats: {
        assets: true,
        colors: true,
        errors: true,
        errorDetails: true,
        hash: true,
        modules: false,
        performance: true
    }
}

// 或者使用 preset
stats: 'minimal'   // 最少信息
stats: 'normal'    // 适中
stats: 'verbose'   // 详细信息
```

**2. 分析构建时间**
```bash
# 使用 speed-measure-webpack-plugin
npm install --save-dev speed-measure-webpack-plugin

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
    // ...config
});
```

**3. 常见问题解决**：

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 构建太慢 | 未排除 node_modules | 添加 `exclude: /node_modules/` |
| 内存溢出 | 项目太大 | 增加 Node 内存 `node --max-old-space-size=4096` |
| 循环依赖 | 代码问题 | 排查模块间的循环引用 |
| 路径错误 | resolve 配置 | 检查 extensions 和 alias |
| 模块找不到 | babel 配置 | 检查 @babel/preset-* 和 plugins |

### Q9：Webpack 的 Tree Shaking 原理？

**答**：

**实现原理**：

1. **标记阶段（Make）**：
   - 遍历所有模块，找出未被使用的导出
   - 标记为 `usedExports: false`

2. **收集阶段（Seal）**：
   - 整理模块依赖图
   - 根据标记移除未使用的代码

```javascript
// 源码
export const a = 1;
export const b = 2;  // 未使用，会被移除

// 编译后
export const a = 1;  // 保留
// b 被移除
```

**副作用（Side Effects）**：
```javascript
// 无副作用
import { a } from './utils';  // 可被 tree shaking

// 有副作用（不能被 shaking）
import './styles.css';  // 必须保留，即使未使用

// package.json 配置
{
    "sideEffects": [
        "*.css",
        "./src/helpers.js"
    ]
}
```

**注意**：
- 只有 ES Module（静态导入）才能 tree shaking
- CommonJS 使用 `require()` 无法确定导入内容
- 生产模式默认开启 tree shaking

### Q10：Webpack 如何处理 CSS？

**答**：

**流程**：
```
CSS 文件 → css-loader（处理 @import/url） → 交回 Webpack → MiniCssExtractPlugin（提取） → 写入文件
                ↓
         style-loader（开发时注入到 <style>）
```

**配置**：
```javascript
// 开发环境
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',   // 将 CSS 注入到 <style> 标签
                    'css-loader'      // 处理 @import 和 url()
                ]
            }
        ]
    }
}

// 生产环境
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css'
        })
    ]
}
```

**CSS Modules**：
```javascript
{
    test: /\.module\.css$/,
    use: [
        'style-loader',
        {
            loader: 'css-loader',
            options: {
                modules: {
                    localIdentName: '[name]__[local]--[hash:base64:5]'
                }
            }
        }
    ]
}
```

---

## 高级配置

### Babel 配置

```javascript
// .babelrc 或 babel.config.js
{
    "presets": [
        ["@babel/preset-env", {
            "targets": {
                "browsers": ["> 1%", "last 2 versions"]
            },
            "useBuiltIns": "usage",  // 按需 polyfill
            "corejs": 3
        }],
        "@babel/preset-react",  // React JSX
        "@babel/preset-typescript"  // TypeScript
    ],
    "plugins": [
        "@babel/plugin-proposal-class-properties",
        ["@babel/plugin-proposal-decorators", { "legacy": true }]
    ]
}
```

### 环境变量

```javascript
// webpack.config.js
const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
};

// 使用
if (process.env.NODE_ENV === 'production') {
    console.log('生产环境');
}
```
