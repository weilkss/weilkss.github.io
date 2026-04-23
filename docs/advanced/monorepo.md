# Monorepo 深入指南

## 核心概念与原理

### 1. 什么是 Monorepo？它解决了什么问题？

Monorepo（Monolithic Repository）是一种代码管理策略，将多个相关项目（包）集中存放在同一个代码仓库中。

**解决的问题：**

| 问题场景   | MultiRepo（多仓库）                 | Monorepo（单仓库）   |
| ---------- | ----------------------------------- | -------------------- |
| 代码共享   | 需要发布npm包才能共享，版本管理复杂 | 直接引用，原子提交   |
| 依赖管理   | 各项目重复安装相同依赖              | 统一管理，节省空间   |
| 协调变更   | 跨项目修改需要手动同步版本          | 一站式提交，版本一致 |
| 代码可见性 | 团队间代码隔离，难以复用            | 全局可见，促进复用   |
| CI/CD      | 各仓库独立配置，重复工作            | 统一流水线，配置复用 |

**典型代表项目：**

- Babel（所有包在一个仓库）
- React（React核心 + ReactDOM + ReactNative等）
- Vue（Vue2/Vue3 + 相关工具）
- Angular（所有模块在一个仓库）

### 2. Monorepo 的架构设计

```
my-monorepo/
├── packages/                    # 存放所有子项目
│   ├── shared/                 # 共享工具包
│   │   ├── utils/
│   │   │   ├── package.json
│   │   │   └── src/
│   │   └── ui-components/
│   │       ├── package.json
│   │       └── src/
│   ├── app-web/                # Web应用
│   │   ├── package.json
│   │   └── src/
│   └── app-mobile/             # 移动应用
│       ├── package.json
│       └── src/
├── tools/                      # 构建工具和脚本
│   ├── eslint-config-custom/
│   └── typescript-config/
├── package.json                # 根目录workspace配置
├── pnpm-workspace.yaml         # pnpm workspace配置
└── turbo.json                  # Turborepo配置
```

### 3. Monorepo 的核心工具

| 工具                 | 特点                         | 适用场景           |
| -------------------- | ---------------------------- | ------------------ |
| **pnpm + workspace** | 高效的依赖管理，节省磁盘空间 | Node.js项目首选    |
| **Turborepo**        | 智能构建缓存，任务编排       | 大型项目构建优化   |
| **Nx**               | 强大的依赖图分析，分布式执行 | 复杂企业级项目     |
| **Lerna**            | 老牌工具，包发布管理         | 需要npm发布的场景  |
| **Rush**             | Microsoft出品，企业级        | 大型TypeScript项目 |

## pnpm Workspace 详解

### 4. pnpm workspace 的配置与使用

```yaml
# pnpm-workspace.yaml
packages:
    - "packages/*" # 所有子包
    - "tools/*" # 工具包
    # 支持 glob 模式
    - "apps/**"
```

```json
// 根目录 package.json
{
    "name": "my-monorepo",
    "private": true, // 私有仓库，不会被发布
    "workspaces": ["packages/*", "tools/*"],
    "scripts": {
        "dev": "pnpm --filter @my/app-web dev",
        "build": "turbo run build",
        "test": "turbo run test",
        "clean": "turbo run clean"
    }
}
```

### 5. 依赖管理规则

```bash
# 安装依赖到根目录
pnpm add lodash -w

# 安装依赖到特定包
pnpm add axios --filter @my/app-web

# 安装依赖到所有包（场景：升级某依赖版本）
pnpm add typescript -r

# 从workspace内部依赖其他包
# 在 app-web/package.json 中
{
  "dependencies": {
    "@my/utils": "workspace:*"    # 使用 workspace:* 引用
  }
}
```

**依赖提升规则：**

```yaml
# pnpm-workspace.yaml
publicPackages:
    - "@my/public-component" # 这些包不会被提升
```

## Turborepo 进阶

### 6. Turborepo 任务配置

```json
// turbo.json
{
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
        "build": {
            "dependsOn": ["^build"], // ^ 表示依赖的包的 build 先完成
            "outputs": ["dist/**", ".next/**"],
            "cache": true
        },
        "test": {
            "dependsOn": ["build"],
            "outputs": ["coverage/**"],
            "cache": true
        },
        "dev": {
            "cache": false, // 开发模式禁用缓存
            "persistent": true // 长期运行任务
        },
        "lint": {
            "outputs": []
        }
    }
}
```

**任务依赖图：**

```
┌─────────────────────────────────────────────────────────────┐
│                      依赖关系示例                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   shared/utils ──► shared/components ──► app-web           │
│        │                                      │             │
│        └──────────────────────────────────────┘             │
│                         │                                   │
│                    app-mobile                               │
│                                                             │
│   build 任务执行顺序：                                       │
│   1. shared/utils:build                                     │
│   2. shared/components:build (等待 utils 完成)              │
│   3. app-web:build (等待 components 完成)                   │
│   4. app-mobile:build (等待 app-web 完成)                    │
└─────────────────────────────────────────────────────────────┘
```

### 7. 远程缓存（Remote Cache）

```bash
# 登录 Vercel（使用 Turborepo Cloud）
npx turbo login

# 链接项目
npx turbo link

# 查看缓存状态
npx turbo status

# 强制重新构建
npx turbo build --force
```

```json
// turbo.json 配置远程缓存
{
    "pipeline": {
        "build": {
            "cache": true,
            "inputs": ["src/**", "package.json", "tsconfig.json"]
        }
    }
}
```

## 实际应用场景

### 8. 如何搭建一个 Monorepo 项目？

**第一步：初始化项目结构**

```bash
mkdir my-monorepo && cd my-monorepo
pnpm init
```

**第二步：创建 pnpm-workspace.yaml**

```yaml
packages:
    - "packages/*"
```

**第三步：创建子包**

```bash
mkdir packages/shared
cd packages/shared
pnpm init
pnpm add lodash
```

**第四步：在根目录安装工具**

```bash
pnpm add -Dw turbo typescript eslint
```

**第五步：配置 package.json 脚本**

```json
{
    "scripts": {
        "build": "turbo run build",
        "dev": "turbo run dev --parallel",
        "lint": "turbo run lint"
    }
}
```

### 9. workspace 协议的使用

```json
// 引用本地 workspace 包
{
    "dependencies": {
        "@my/shared": "workspace:*", // 最新版本
        "@my/utils": "workspace:^1.0.0", // 指定版本范围
        "@my/constants": "workspace:~1.0.0"
    }
}
```

**版本解析规则：**

- `workspace:*` - 使用本地包的内容
- `workspace:^1.0.0` - 使用本地包，满足 ^ 范围
- `workspace:~1.0.0` - 使用本地包，满足 ~ 范围

### 10. 包之间如何共享类型定义？

```typescript
// packages/shared/src/index.ts
export * from "./types";
export { default as Button } from "./Button";
```

```json
// packages/app-web/package.json
{
    "dependencies": {
        "@my/shared": "workspace:*"
    },
    "devDependencies": {
        "@my/shared": {
            // 需要源码类型时
            "version": "workspace:*"
        }
    }
}
```

```json
// tsconfig.json 配置 path mapping
{
    "compilerOptions": {
        "paths": {
            "@my/shared": ["../shared/src"]
        }
    }
}
```

## 面试精选问题

### 问题一：Monorepo 和 MultiRepo 各有什么优缺点？

**Monorepo 优点：**

1. **代码复用方便**：所有包可以直接相互引用，无需发布npm
2. **统一版本管理**：避免不同项目使用不同版本导致的兼容性问题
3. **原子提交**：相关改动可以一次性提交，保持一致性
4. **跨项目重构**：更容易进行全局性的代码重构
5. **统一配置**：eslint、tsconfig、babel等配置可以共享

**Monorepo 缺点：**

1. **仓库体积膨胀**：所有代码在一个仓库，占用空间大
2. **CI/CD 复杂度**：每次提交可能触发全量构建
3. **权限控制困难**：难以对不同模块设置不同的访问权限
4. **学习曲线**：新成员需要理解整个项目结构
5. **工具依赖**：需要配置额外的工具链（pnpm workspace + turbo）

**MultiRepo 优点：**

1. **权限控制灵活**：可以按仓库设置访问权限
2. **独立部署**：各项目可以独立发布版本
3. **职责清晰**：边界明确，易于理解
4. **工具简单**：不需要额外的workspace配置

**MultiRepo 缺点：**

1. **代码共享困难**：需要发布npm包才能共享代码
2. **版本协调成本高**：跨仓库修改需要管理多个版本
3. **一致性难以保证**：各项目可能使用不同版本的同一依赖

### 问题二：如何处理 Monorepo 中的依赖循环引用？

**场景分析：**

```typescript
// packages/a/src/index.ts
export { foo } from "./a";
export { bar } from "../b";

// packages/b/src/index.ts
export { foo } from "../a";
export { bar } from "./b";
```

**解决方案：**

1. **使用 barrel 文件（index.ts）打破循环**

```typescript
// packages/a/src/types.ts - 只放类型定义
export interface AType {
    name: string;
}

// packages/a/src/index.ts - 不再 re-export b 的内容
export * from "./types";
export { foo } from "./foo";
```

2. **拆分共享模块**

```
packages/
├── core/           # 最底层，无依赖
├── shared/         # 依赖 core
├── feature-a/      # 依赖 shared
└── feature-b/      # 依赖 shared 和 feature-a
```

3. **使用接口继承而非实现继承**

```typescript
// 在 TypeScript 中使用 interface 继承
interface CoreInterface {
    init(): void;
}

interface SharedInterface extends CoreInterface {
    configure(options: any): void;
}
```

### 问题三：如何在 Monorepo 中实现增量构建和缓存？

**Turborepo 缓存策略：**

```json
// turbo.json
{
    "pipeline": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**", ".next/**", "build/**"],
            "cache": true,
            "inputs": [
                // 定义什么变化时需要重新构建
                "src/**",
                "package.json",
                "tsconfig.json",
                "*.config.js"
            ]
        }
    }
}
```

**CI 环境中的缓存策略：**

```yaml
# .github/workflows/ci.yml
- uses: actions/cache@v3
  with:
      path: |
          ~/.cache/turbo
          node_modules/.cache
      key: ${{ runner.os }}-turbo-${{ hashFiles('**/pnpm-lock.yaml') }}
```

**增量测试策略：**

```json
// turbo.json
{
    "pipeline": {
        "test": {
            "dependsOn": ["build"],
            "inputs": ["src/**/*.test.ts", "src/**/*.spec.ts"],
            "output": ["coverage/**"]
        }
    }
}
```

### 问题四：Monorepo 中的代码风格和lint如何统一？

**ESLint 配置共享：**

```javascript
// tools/eslint-config-custom/index.js
module.exports = {
    extends: ["eslint:recommended"],
    rules: {
        "no-console": "warn",
        "prefer-const": "error",
    },
};
```

```json
// packages/app-web/package.json
{
    "devDependencies": {
        "@my/eslint-config": "workspace:*"
    },
    "eslintConfig": {
        "extends": "@my/eslint-config"
    }
}
```

**统一 git hooks：**

```bash
pnpm add -Dw husky lint-staged
```

```json
// package.json
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    "lint-staged": {
        "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
        "*.{json,md}": ["prettier --write"]
    }
}
```

### 问题五：Monorepo 如何实现独立的部署策略？

**场景：**

- `app-web` 需要部署到 vercel
- `app-mobile` 需要独立构建
- `shared` 只发布到 npm

**方案一：使用 Turborepo 过滤**

```bash
# 只构建 web 应用
turbo run build --filter=@my/app-web

# 构建除了某个应用外的所有
turbo run build --filter=!@my/app-mobile
```

**方案二：独立 CI 配置**

```yaml
# .github/workflows/web.yml
on:
    push:
        paths:
            - "packages/app-web/**"
            - "packages/shared/**"
```

**方案三：独立部署脚本**

```json
// package.json
{
    "scripts": {
        "deploy:web": "turbo run build --filter=@my/app-web && vercel --prod",
        "deploy:mobile": "turbo run build --filter=@my/app-mobile"
    }
}
```

### 问题六：大型 Monorepo 项目如何做好代码可见性控制？

**方案一：使用 Nx 的隐式依赖**

```json
// nx.json
{
    "implicitDependencies": {
        "packages/app-web": ["packages/shared"]
    }
}
```

**方案二：TypeScript Project References**

```json
// packages/app-web/tsconfig.json
{
    "references": [{ "path": "../shared" }]
}
```

**方案三：合理的目录结构和命名约定**

```
packages/
├── private/           # 私有包，不对外
│   └── internal-tool/
└── public/            # 公开包，可以发布npm
    └── shared-ui/
```

## 最佳实践

### Monorepo 项目结构建议

```
monorepo/
├── .github/
│   └── workflows/
│       ├── ci.yml           # 统一 CI
│       └── deploy-web.yml   # 独立部署
├── .husky/                  # Git hooks
├── packages/
│   ├── apps/                # 应用
│   │   ├── web/
│   │   ├── admin/
│   │   └── mobile/
│   ├── packages/            # 库
│   │   ├── ui/
│   │   ├── utils/
│   │   └── hooks/
│   └── configs/             # 共享配置
│       ├── eslint/
│       ├── typescript/
│       └── babel/
├── turbo.json               # Turborepo 配置
├── pnpm-workspace.yaml      # pnpm workspace
├── package.json
└── .gitignore
```

### 依赖版本管理策略

```bash
# 使用 Renovate 自动更新依赖
# .renovaterc.json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchPackagePatterns": ["@my/*"],
      "groupName": "my packages"
    }
  ]
}
```

### 性能优化建议

1. **使用 pnpm 的 content-addressable storage**
2. **合理配置 turbo 的 cache**
3. **使用 `pnpm deploy` 精简依赖**
4. **配置 `.npmignore` 减少发布体积**

```json
// packages/shared/package.json
{
  "files": ["dist", "src"  # 只发布必要文件
}
```
