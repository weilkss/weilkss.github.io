# Vitest 深入指南

## 核心概念与原理

### 1. Vitest 是什么？有哪些核心特性？

Vitest 是一个由 Vue 团队开发的下一代单元测试框架，基于 Vite 构建。它旨在提供极速的开发体验同时保持与 Jest 完全兼容的 API。

**核心特性：**

- **极速启动**：利用 Vite 的预bundle 能力，启动速度比 Jest 快 10-100 倍
- **热更新（HMR）**：测试文件修改后几乎即时反馈，媲美开发服务器的体验
- **原生 ESM**：原生支持 ES Modules，无需额外配置
- **智能感知**：内置 TypeScript、JSX、Vue、React 等支持
- ** Jest 兼容**：兼容 Jest 的 API、匹配器和 spies，降低迁移成本
- **多框架支持**：不仅支持 Vue，还能测试 React、Svelte、Lit 等框架
- **内置 Chai**：支持 Chai 断言库，同时兼容 Jest 匹配器
- **并行执行**：通过 Worker 线程池实现测试并行执行
- **FilteRity**：提供精确的测试过滤和分组功能

### 2. Vitest 与 Jest 的核心区别是什么？

```
┌─────────────────────────────────────────────────────────────────┐
│                      Vitest vs Jest                             │
├─────────────────────────────────────────────────────────────────┤
│  启动速度   │  Vitest: ~200ms   │  Jest: ~2-5s                  │
│  热更新     │  即时反馈         │  需要重新运行测试              │
│  ESM 支持   │  原生支持         │  需要配置 transform            │
│  TypeScript │  开箱即用         │  需要 ts-jest                  │
│  配置复杂度 │  极简             │  较复杂                        │
│  Vite 集成  │  深度集成         │  无                           │
│  内存占用   │  较低             │  较高                         │
└─────────────────────────────────────────────────────────────────┘
```

**底层实现差异：**

| 方面 | Jest | Vitest |
|------|------|--------|
| 构建工具 | 自有 transform | 基于 Vite |
| 模块解析 | CommonJS 优先 | ESM 优先 |
| 测试环境 | JSDOM/Node | 浏览器 API + Happy DOM |
| HMR | 不支持 | 原生支持 |

### 3. Vitest 的执行流程是怎样的？

```
┌─────────────────────────────────────────────────────────────┐
│                    Vitest 执行流程                          │
├─────────────────────────────────────────────────────────────┤
│  1. 读取配置 (vitest.config.ts)                              │
│  2. 启动 Vite Dev Server (用于 HMR 和预bundle)              │
│  3. 收集测试文件 (通过 include)                               │
│  4. 并行加载测试文件 (Worker 池)                               │
│  5. 预处理依赖 (esbuild/swc)                                  │
│  6. 执行 beforeAll/beforeEach 预处理                         │
│  7. 执行每个测试用例                                          │
│  8. 执行 afterEach/afterAll 清理                             │
│  9. 收集测试结果                                              │
│ 10. 生成测试报告                                              │
│ 11. 监视文件变化 (watch 模式)                                 │
│ 12. HMR 热更新相关测试                                        │
└─────────────────────────────────────────────────────────────┘
```

### 4. Vitest 如何利用 Vite 实现快速启动？

Vitest 深度集成 Vite 的核心能力：

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // 启用 HMR 支持
    hot: true,
    // 使用 Vite 的预构建能力
    globals: true,
    // 环境配置
    environment: 'jsdom',
    // 全局测试 DOM APIs
    setupFiles: ['./src/test/setup.ts']
  }
})
```

**Vite 加速原理：**

1. **esbuild 预构建**：依赖首次加载时，esbuild 会将 CommonJS 模块转换为 ESM
2. **按需编译**：只编译实际导入的代码
3. **模块缓存**：Vite 会缓存已编译的模块
4. **并行加载**：通过 Worker 池并行加载测试文件

## 常用 API 与应用场景

### 5. describe、test、it 的使用

```typescript
// describe: 分组测试用例
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const user = await userService.create({ name: 'John' });
      expect(user.name).toBe('John');
    });

    it('should throw error with invalid email', async () => {
      await expect(
        userService.create({ email: 'invalid' })
      ).rejects.toThrow('Invalid email');
    });
  });
});

// test 是 it 的别名，完全等价
test('sum should return correct result', () => {
  expect(sum(1, 2)).toBe(3);
});

// 使用 async/await
it('async test', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

### 6. 常见的断言有哪些？

```typescript
// 常用匹配器 (Jest 兼容)
expect(value).toBe(expected);           // 精确相等 (===)
expect(value).toEqual(expected);        // 深度相等
expect(value).toBeNull();               // null
expect(value).toBeUndefined();          // undefined
expect(value).toBeTruthy();             // 真值
expect(value).toBeFalsy();              // 假值
expect(arr).toContain(item);            // 数组包含
expect(str).toMatch(/pattern/);         // 正则匹配
expect(obj).toHaveProperty('key');      // 对象属性存在
expect(() => fn()).toThrow();           // 抛出异常

// Chai 风格 (Vitest 独有)
expect(value).to.equal(expected);       // 严格相等
expect(value).to.be.a('string');        // 类型检查
expect(arr).to.have.lengthOf(3);        // 长度检查
expect(fn).to.have.been.called();        // 调用检查
expect(bigNum).to.be.closeTo(3.14, 0.01); // 浮点比较

// 数值相关
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThanOrEqual(100);

// Promise 相关
await expect(fetchUser()).resolves.toEqual({ name: 'John' });
await expect(fetchData()).rejects.toThrow('Error');
```

### 7. beforeAll、beforeEach、afterAll、afterEach 的执行顺序

```typescript
beforeAll(() => console.log('1 - beforeAll'));     // 所有测试开始前执行一次
afterAll(() => console.log('1 - afterAll'));      // 所有测试结束后执行一次

beforeEach(() => console.log('2 - beforeEach')); // 每个测试前执行
afterEach(() => console.log('2 - afterEach'));    // 每个测试后执行

test('test 1', () => console.log('3 - test 1'));
test('test 2', () => console.log('3 - test 2'));

// 执行顺序：
// 1 - beforeAll
// 2 - beforeEach
// 3 - test 1
// 2 - afterEach
// 2 - beforeEach
// 3 - test 2
// 2 - afterEach
// 1 - afterAll
```

### 8. 作用域与变量隔离

```typescript
describe('outer', () => {
  const outerValue = 'outer';

  describe('inner', () => {
    const innerValue = 'inner';

    test('has access to outer and inner', () => {
      expect(outerValue).toBe('outer');
      expect(innerValue).toBe('inner');
    });
  });

  test('has access to outer only', () => {
    expect(outerValue).toBe('outer');
    // innerValue 在这里不可访问
  });
});
```

## Mock 系统详解

### 9. 如何创建和使用 Mock 函数？

```typescript
import { vi, describe, it, expect } from 'vitest';

// 方式一：vi.fn()
const mockFn = vi.fn();
mockFn.mockReturnValue('hello');
mockFn.mockResolvedValue('hello');
mockFn.mockRejectedValue(new Error('error'));

console.log(mockFn()); // 'hello'

// 方式二：vi.spyOn()
const obj = {
  getName: () => 'John'
};
const spy = vi.spyOn(obj, 'getName');
obj.getName();
console.log(spy.mock.calls.length); // 1

// 方式三：vi.mock() 自动提升
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] })
  }
}));
```

### 10. Mock 的高级用法

```typescript
const mockFn = vi.fn();

// 链式调用模拟
mockFn
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call')
  .mockReturnValue('default');

console.log(mockFn()); // 'first call'
console.log(mockFn()); // 'second call'
console.log(mockFn()); // 'default'

// 模拟实现
mockFn.mockImplementation((a: number, b: number) => {
  return a + b;
});

// 模拟模块
vi.mock('lodash', () => ({
  debounce: vi.fn(() => () => {}),
  cloneDeep: vi.fn((obj: unknown) => JSON.parse(JSON.stringify(obj)))
}));

// 追踪调用
mockFn(1, 2);
mockFn(3, 4);
console.log(mockFn.mock.calls); // [[1, 2], [3, 4]]
console.log(mockFn.mock.results); // [{ type: 'return', value: 3 }, { type: 'return', value: 7 }]
```

### 11. vi.fn() 与 vi.spyOn() 的区别

| 特性 | vi.fn() | vi.spyOn() |
|------|---------|------------|
| 创建方式 | 独立创建函数 | 包装已有对象的方法 |
| 原方法调用 | 不会调用原方法 | 默认会调用原方法 |
| 用途 | 模拟独立函数 | 监视+模拟对象方法 |
| 恢复原状 | 无需恢复 | 需要 mockRestore() |

```typescript
// spyOn 可以追踪原方法调用
const MathLib = {
  add: (a: number, b: number) => a + b
};

const spy = vi.spyOn(MathLib, 'add');
MathLib.add(1, 2); // 实际调用了原方法
MathLib.add(3, 4); // 实际调用了原方法

console.log(spy.mock.calls.length); // 2
spy.mockRestore(); // 恢复原方法
```

### 12. 如何 Mock 定时器？

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// 使用 fake timers
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('debounce should work', () => {
  const fn = vi.fn();
  const debounced = debounce(fn, 1000);

  debounced();
  debounced();
  debounced();

  // 快进所有定时器
  vi.runAllTimers();

  expect(fn).toHaveBeenCalledTimes(1);
});

// 测试特定的定时器
it('setTimeout with specific time', () => {
  vi.advanceTimersByTime(1000);
});

// 等待异步定时器
it('async timer', async () => {
  const promise = new Promise(resolve => setTimeout(resolve, 1000));
  vi.advanceTimersByTime(1000);
  await promise;
});

// 使用 fake date
it('date mocking', () => {
  const date = new Date('2024-01-01');
  vi.setSystemTime(date);
  expect(new Date().toISOString()).toBe('2024-01-01T00:00:00.000Z');
});
```

## 异步测试

### 13. 如何测试异步代码？

```typescript
// 方式一：Promise
test('fetch user', () => {
  return fetchUser().then(data => {
    expect(data.name).toBe('John');
  });
});

// 方式二：async/await
test('fetch user with async', async () => {
  const data = await fetchUser();
  expect(data.name).toBe('John');
});

// 方式三：resolves/rejects
test('fetch user resolves', async () => {
  await expect(fetchUser()).resolves.toEqual({ name: 'John' });
});

// 方式四：回调函数风格
test('callback style', (done) => {
  fetchUser((err, data) => {
    expect(err).toBeNull();
    expect(data.name).toBe('John');
    done();
  });
});
```

### 14. 并行测试的实现原理

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // 启用并行执行
    threads: true,
    // 最大并行数
    maxWorkers: 4,
    // 或使用百分比
    maxWorkers: '50%',
    // 测试文件隔离
    isolate: true
  }
});

// 单个测试文件内顺序执行，但文件间并行
describe('test suite', () => {
  it('test 1', async () => { /* ... */ });
  it('test 2', async () => { /* ... */ });
  // 1 和 2 在同一 worker 中顺序执行
});
```

## DOM 测试

### 15. 如何测试 DOM 操作？

```typescript
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';

// 设置 DOM 环境
const dom = new JSDOM('<!DOCTYPE html><div id="app"></div>');
global.document = dom.window.document;
global.window = dom.window;

describe('DOM Test', () => {
  it('should manipulate DOM', () => {
    const app = document.getElementById('app');
    app!.innerHTML = '<span>Hello</span>';

    const span = app!.querySelector('span');
    expect(span?.textContent).toBe('Hello');
  });

  it('should handle events', () => {
    const button = document.createElement('button');
    let clicked = false;

    button.addEventListener('click', () => {
      clicked = true;
    });

    button.click();
    expect(clicked).toBe(true);
  });
});
```

### 16. Vitest 中的环境配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // 环境选项
    environment: 'jsdom',      // 默认: jsdom, happy-dom, node
    globals: true,              // 全局 APIs (describe, it, expect)
    setupFiles: ['./tests/setup.ts'], // 测试前运行的文件

    // DOM 配置
    jsdom: {
      // JSDOM 配置
      url: 'http://localhost:3000'
    }
  }
});
```

## 覆盖率配置

### 17. 如何配置代码覆盖率？

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',           // 或 'c8'
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'coverage/**',
        'dist/**',
        '**/*.config.*',
        '**/*.d.ts',
        '**/*.test.ts'
      ],
      // 阈值配置
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
});

// 命令行
vitest --coverage
```

## 面试精选问题

### 问题一：为什么 Vitest 的启动速度比 Jest 快这么多？

**答案要点**：

**核心原因：**

1. **基于 Vite 的预构建**：
   - Jest 首次运行需要将所有依赖转为 CommonJS
   - Vitest 复用 Vite 的 esbuild 预构建，只需转换一次
   - esbuild 比 Babel 快 10-30 倍

2. **原生 ESM 支持**：
   - Jest 需要将 ESM 代码转译为 CommonJS
   - Vitest 直接运行原生 ESM，减少转换开销

3. **懒编译策略**：
   - Jest 启动时编译所有测试文件
   - Vitest 只编译实际导入的模块

4. ** Worker 池优化**：
   - Jest 的 Worker 通信开销较大
   - Vitest 使用更轻量的 Worker 实现

**实际测试对比**：

```bash
# Jest 首次启动
$ time npx jest
real 0m3.245s

# Vitest 首次启动
$ time npx vitest
real 0m0.312s
```

### 问题二：Vitest 如何实现 HMR 式的测试体验？

**答案要点**：

```typescript
// Vitest 的 HMR 实现原理
// 1. 监听文件变化
const watcher = chokidar.watch(testFiles, {
  ignoreInitial: true
});

// 2. 计算受影响的测试
watcher.on('change', (file) => {
  const affectedTests = calculateAffectedTests(file);
  // 3. 增量运行受影响的测试
  runTests(affectedTests);
});

// 4. 利用 Vite 的 HMR API
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    // 清理状态，准备重载
    cleanup();
  });
}
```

**与 Jest watch 模式的区别**：

| 特性 | Vitest HMR | Jest watch |
|------|------------|------------|
| 反馈速度 | 即时（毫秒级） | 较慢（秒级） |
| 状态保持 | 保持 | 重新运行 |
| 增量执行 | 精确计算 | 全量重跑 |

### 问题三：Vitest 如何处理 Vue 组件测试？

**答案要点**：

```typescript
// Vue Test Utils + Vitest
import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { describe, it, expect } from 'vitest';

const HelloWorld = defineComponent({
  props: {
    msg: String
  },
  setup(props) {
    const count = ref(0);
    const increment = () => count.value++;
    return { count, increment };
  },
  template: `
    <div>
      <h1>{{ msg }}</h1>
      <button @click="increment">Count: {{ count }}</button>
    </div>
  `
});

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'new message' }
    });
    expect(wrapper.text()).toContain('new message');
  });

  it('emits event when button clicked', async () => {
    const wrapper = mount(HelloWorld);
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('button').text()).toContain('Count: 1');
  });

  it('updates reactively', async () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Hello' }
    });
    expect(wrapper.props().msg).toBe('Hello');
  });
});
```

### 问题四：Vitest 的模块解析机制是怎样的？

**答案要点**：

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // 模块名称映射
    alias: {
      '@': '/src',
      '~': '/src',
      '@components': '/src/components'
    },

    // 全局导入
    globals: {
      vi: true,
      describe: true,
      it: true,
      expect: true,
      beforeEach: true
    },

    // 包含的测试文件
    include: [
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/__tests__/**/*.ts'
    ],

    // 排除的文件
    exclude: [
      '**/node_modules/**',
      '**/dist/**'
    ]
  }
});
```

### 问题五：Vitest 如何实现与 Jest 的兼容？

**答案要点**：

```typescript
// 1. Jest 兼容模式
export default defineConfig({
  test: {
    // 启用 Jest 兼容
    compatibilityMode: 'v8',  // 或 'jest'
  }
});

// 2. 支持的 Jest APIs
import {
  // 核心函数
  describe, it, test, expect, beforeAll, afterAll,
  beforeEach, afterEach,

  // Mock APIs
  jest,           // 别名为 vi
  jest.fn(),      // 等同于 vi.fn()
  jest.spyOn(),   // 等同于 vi.spyOn()
  jest.mock(),    // 等同于 vi.mock()
  jest.clearAllMocks,
  jest.resetAllMocks,

  // 快照
  toMatchSnapshot,
  toHaveSnapshotDiff,

  // Fake timers
  jest.useFakeTimers(),
  jest.useRealTimers(),
  jest.advanceTimersByTime(),
  jest.runAllTimers(),
} from 'vitest';
```

### 问题六：如何处理第三方模块的 Mock？

**答案要点**：

```typescript
// 单个测试文件中 Mock
vi.mock('axios');

test('mock axios', () => {
  const axios = require('axios');
  (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
    data: { name: 'John' }
  });
});

// 使用 vi.hoisted() 在模块级别保持变量
const { mockAxios } = vi.hoisted(() => ({
  mockAxios: vi.fn()
}));

vi.mock('axios', () => ({
  default: mockAxios
}));

// 条件 Mock
vi.mock('axios', async () => {
  const actual = await vi.importActual('axios');
  return {
    ...actual,
    get: vi.fn()
  };
});

// Mock 第三方模块的复杂场景
vi.mock('lodash', () => {
  const debounce = vi.fn((fn: Function) => fn);
  const cloneDeep = vi.fn((obj: unknown) => JSON.parse(JSON.stringify(obj)));
  return { debounce, cloneDeep };
});
```

## 最佳实践

### 测试文件组织结构

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.vue
│   │   └── Button.test.ts      # 单元测试
│   └── __tests__/
│       └── Modal.test.ts        # 集成测试
├── composables/
│   └── useCounter.test.ts
└── utils/
    └── format.test.ts

tests/
├── setup.ts                    # 全局设置
├── mocks/
│   └── axios.ts                # Mock 模块
└── utils/
    └── render.ts               # 测试工具函数
```

### 编写高质量测试的原则

1. **AAA 模式**：Arrange（准备）-> Act（执行）-> Assert（断言）
2. **单一职责**：每个测试只验证一个功能点
3. **描述性命名**：测试名称应该清晰表达测试意图
4. **避免逻辑**：测试代码中避免复杂逻辑
5. **独立性**：测试之间不应该有依赖关系
6. **可重复**：测试应该能够多次执行并得到相同结果

```typescript
// 好的测试示例
describe('Calculator', () => {
  describe('add', () => {
    it('should return 3 when adding 1 and 2', () => {
      // Arrange
      const calculator = new Calculator();

      // Act
      const result = calculator.add(1, 2);

      // Assert
      expect(result).toBe(3);
    });

    it('should handle negative numbers', () => {
      const calculator = new Calculator();
      expect(calculator.add(-1, -2)).toBe(-3);
    });
  });
});

// 不好的测试示例
it('test', () => {
  const arr = [1, 2, 3];
  const sum = arr.reduce((a, b) => a + b, 0);
  expect(sum).toBe(6);
  // 问题：测试名称不清晰，代码中有计算逻辑
});
```

### 从 Jest 迁移到 Vitest

```typescript
// 1. 安装依赖
npm install -D vitest @vue/test-utils happy-dom

// 2. 更新 jest.config.js -> vitest.config.ts
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.ts'],
    alias: {
      '@': '/src'
    }
  }
});

// 3. 更新导入语句
// 之前
import { describe, it, expect, jest } from '@jest/globals';

// 现在
import { describe, it, expect, vi } from 'vitest';

// 4. 更新全局变量配置
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true // 启用全局 APIs
  }
});

// 或在 tsconfig.json 中添加
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```
