# npm / yarn / pnpm 区别

## 面试者视角回答

作为前端工程化中的三大包管理工具，它们在性能、存储和安全性方面各有特点。下面从多个维度进行分析。

---

## 核心区别对比

| 特性 | npm | yarn | pnpm |
|------|-----|------|------|
| **诞生时间** | 2010 | 2016 | 2017 |
| **作者** | npm 公司 | Facebook | npm? (pnpm) |
| **锁文件** | package-lock.json | yarn.lock | pnpm-lock.yaml |
| **依赖安装** | 扁平化 | 扁平化 | Hard Link（硬链接） |
| **安装速度** | 较慢 | 快 | 极快 |
| **磁盘空间** | 占用大 | 占用大 | 占用小 |
| **幽灵依赖** | 存在 | 存在 | 不存在 |
| **Node 版本** | npm 7+ 支持 workspace | yarn 2+ 支持 workspace | 原生支持 workspace |

---

## npm

### 核心原理

npm 采用**扁平化**依赖管理，将所有依赖提升到 `node_modules` 根目录下。

### 优缺点

**优点**：
- Node.js 内置，无需额外安装
- 生态最完善，兼容性最好
- npm 7+ 支持 workspaces

**缺点**：
- 安装速度较慢
- 依赖重复安装，占用磁盘空间大
- 存在幽灵依赖问题（可以访问未声明的依赖）

### 幽灵依赖示例

```json
// package.json
{
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

```js
// 但可以直接使用其他未声明的包
const axios = require('axios'); // 即使没在 package.json 中声明
// npm 会提升所有包到根目录，导致可能访问到未声明的包
```

---

## yarn

### 核心原理

yarn 也是扁平化依赖管理，但引入了**确定性安装**和**并行安装**的概念。

### 核心特性

1. **确定性安装**：通过 yarn.lock 保证每次安装结果一致
2. **并行安装**：比 npm 更快
3. **本地缓存**：缓存已下载的包，离线也能安装

### 优缺点

**优点**：
- 安装速度快（并行下载）
- yarn.lock 确保确定性
- 有本地缓存机制

**缺点**：
- 仍然存在幽灵依赖问题
- 磁盘占用与 npm 类似
- yarn 2+ 有 PnP 模式，但兼容性较差

### yarn.lock 示例

```yaml
# yarn.lock
lodash@^4.17.21:
  version "4.17.21"
  resolved "https://registry.yarnpkg.com/lodash/-/lodash-4.17.21.tgz#sha512"
  integrity sha512-v2kDEe57lecTulaDIuNTPy3Ry4lLGyUU1N9ntaqWoaE6Zf2VHXjOk2FVNI/3Zq0/6QX1V0E0y0N0i2z0c5eq5w==
```

---

## pnpm

### 核心原理

pnpm 采用**内容寻址存储**（Content-addressable storage）+ **硬链接**，真正实现了**全局存储、共享依赖**。

### 工作机制

```
pnpm store
└── .pnpm-store
    └── node_modules
        └── .bin
        └── lodash (所有版本)
            └── node_modules (内部依赖)
```

安装时，pnpm 通过**硬链接**将全局 store 中的包链接到项目 `node_modules`，而不是复制。

### 幽灵依赖解决方案

pnpm 通过**虚拟存储目录**严格隔离依赖：

```
node_modules
└── .pnpm
    └── lodash@4.17.21/node_modules/lodash
    └── axios@0.27.2/node_modules/axios
        └── node_modules
            └── is-what (axios 的依赖)
└── lodash -> .pnpm/lodash@4.17.21/node_modules/lodash
└── axios -> .pnpm/axios@0.27.2/node_modules/axios
```

只能访问 `package.json` 中声明的依赖，幽灵依赖问题彻底解决。

### 优缺点

**优点**：
- 安装速度最快（硬链接，几乎不占用额外空间）
- 磁盘空间占用最小
- 彻底解决幽灵依赖
- 原生支持 monorepo workspaces
- 安全性高（严格隔离）

**缺点**：
- 生态相对较新，部分工具兼容性可能有问题
- 符号链接（symlink）在某些场景下可能有问题

---

## 实际面试回答模板

### 问：pnpm 为什么比 npm 和 yarn 快？

**答**：
1. **硬链接**：直接复用全局 store 中的文件，无需重复下载
2. **并行下载**：比 npm 的串行下载更快
3. **精简依赖树**：只安装直接依赖，减少解析时间

### 问：什么是幽灵依赖？为什么 pnpm 能解决？

**答**：
幽灵依赖是指在 `node_modules` 中可以访问到但未在 `package.json` 中声明的包。

npm/yarn 采用扁平化结构，所有包都被提升到根目录，导致 A 包安装了 B，但项目可以直接 import B。

pnpm 通过 `.pnpm` 虚拟目录和硬链接，每个包只能访问自己声明的依赖，无法访问未声明的包。

### 问：pnpm 的硬链接和符号链接有什么区别？

**答**：
- **硬链接**：多个文件指向同一块磁盘数据，删除一个不影响其他
- **符号链接（软链接）**：类似快捷方式，指向另一个路径

pnpm 使用硬链接存储全局包到项目目录，兼具性能和安全性。

### 问：monorepo 场景下用什么工具？

**答**：
pnpm 对 monorepo 支持最好：
- 原生支持 workspaces
- 依赖 hoist 最小化
- 安装和构建效率最高

如果项目较大或使用 monorepo，推荐 pnpm > yarn > npm。

---

## 常用命令对比

| 操作 | npm | yarn | pnpm |
|------|-----|------|------|
| 安装 | npm install | yarn install | pnpm install |
| 添加 | npm add pkg | yarn add pkg | pnpm add pkg |
| 删除 | npm rm pkg | yarn remove pkg | pnpm remove pkg |
| 更新 | npm update | yarn upgrade | pnpm update |
| 全局添加 | npm add -g | yarn global add | pnpm add -g |
| 清除缓存 | npm cache clean | yarn cache clean | pnpm store prune |
| 查看 store | - | - | pnpm store path |

---

## 总结建议

| 场景 | 推荐工具 |
|------|---------|
| 个人项目/小项目 | 都行，npm 兼容性最好 |
| 大型团队项目 | pnpm（性能和安全性） |
| monorepo 项目 | pnpm（原生支持） |
| 兼容性优先 | npm / yarn |