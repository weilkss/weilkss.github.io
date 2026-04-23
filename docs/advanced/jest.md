# Jest 深入指南

## 核心概念与原理

### 1. Jest 是什么？有哪些核心特性？

Jest 是 Facebook 开发的 JavaScript 单元测试框架，拥有"开箱即用"的特性，被广泛应用于 React 项目的测试。

**核心特性：**

- **零配置**：Jest 默认配置已经足够大多数项目使用，无需复杂配置即可开始测试
- **快照测试**：能够轻松记录组件渲染结果，支持 UI 回归测试
- **隔离性**：每个测试文件在独立的 sandbox 环境中运行，避免相互影响
- **并行执行**：通过 Worker 进程池实现测试并行执行，提高测试速度
- **Mock 系统**：提供完善的 Mock、Spy、Stub 功能
- **覆盖率报告**：内置代码覆盖率统计功能
- **即时反馈**：监视模式支持文件变化自动重新运行测试

### 2. Jest 的执行流程是怎样的？

```
┌─────────────────────────────────────────────────────────┐
│                    Jest 执行流程                         │
├─────────────────────────────────────────────────────────┤
│  1. 解析配置 (jest.config.js)                            │
│  2. 收集测试文件 (通过 testMatch/testRegex)              │
│  3. 创建测试环境 (JsDom/Node)                            │
│  4. 加载测试文件                                        │
│  5. beforeAll/beforeEach 预处理                         │
│  6. 执行每个测试用例                                    │
│  7. afterEach/afterAll 清理                             │
│  8. 生成测试报告                                        │
└─────────────────────────────────────────────────────────┘
```

### 3. Jest 的隔离机制是如何实现的？

Jest 通过以下方式实现测试隔离：

1. **每个测试文件独立进程**：默认情况下，每个测试文件在独立的子进程中运行
2. **模块缓存隔离**：每个测试文件的 require/import 模块缓存相互独立
3. **全局状态重置**：beforeAll/beforeEach/afterAll/afterEach 提供完善的生命周期管理
4. **Fake Timers**：提供独立的计时器模拟，避免测试间时间状态污染

## 常用 API 与应用场景

### 4. describe、test、it 的区别与使用场景

```javascript
// describe: 分组测试用例，提供逻辑封装和作用域控制
describe("UserService", () => {
    describe("createUser", () => {
        // 嵌套 describe 可以进一步细分测试场景
        it("should create user with valid data", () => {});
        it("should throw error with invalid email", () => {});
    });
});

// test 和 it 是完全等价的别名关系
test("sum should return correct result", () => {
    expect(sum(1, 2)).toBe(3);
});

it("can use async/await", async () => {
    const user = await fetchUser();
    expect(user.name).toBe("John");
});
```

**面试官可能问的延伸问题**：

- `describe.skip` 和 `test.skip` 的区别？
- 为什么 describe 块内的变量不会泄露到其他 describe 块？

### 5. 常见的断言有哪些？

```javascript
// 常用匹配器
expect(value).toBe(expected); // 精确相等（ === ）
expect(value).toEqual(expected); // 深度相等（适合对象/数组）
expect(value).toBeNull(); // null
expect(value).toBeUndefined(); // undefined
expect(value).toBeTruthy(); // 真值
expect(value).toBeFalsy(); // 假值
expect(() => fn()).toThrow(); // 抛出异常
expect(arr).toContain(item); // 数组包含元素
expect(str).toMatch(/pattern/); // 正则匹配
expect(obj).toHaveProperty("key"); // 对象属性存在

// 数值相关
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThanOrEqual(100);

// Promise 相关
expect(Promise).resolves.toEqual(expected);
expect(Promise).rejects.toThrow();
```

### 6. beforeAll、beforeEach、afterAll、afterEach 的执行顺序

```javascript
beforeAll(() => console.log("1 - beforeAll")); // 所有测试开始前执行一次
afterAll(() => console.log("1 - afterAll")); // 所有测试结束后执行一次

beforeEach(() => console.log("2 - beforeEach")); // 每个测试前执行
afterEach(() => console.log("2 - afterEach")); // 每个测试后执行

test("test 1", () => console.log("3 - test 1"));
test("test 2", () => console.log("3 - test 2"));

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

## Mock 系统详解

### 7. Jest Mock 函数的创建与使用

```javascript
// 方式一：jest.fn()
const mockFn = jest.fn();
mockFn.mockReturnValue("hello");
console.log(mockFn()); // 'hello'

// 方式二：jest.spyOn()
const obj = {
    getName: () => "John",
};
const spy = jest.spyOn(obj, "getName");
obj.getName();
console.log(spy.mock.calls.length); // 1

// 方式三：jest.mock() 自动提升
jest.mock("axios");
import axios from "axios";
axios.get.mockResolvedValue({ data: [] });
```

### 8. Mock 的高级用法

```javascript
const mockFn = jest.fn();

// 链式调用模拟
mockFn.mockReturnValueOnce("first call").mockReturnValueOnce("second call").mockReturnValue("default");

console.log(mockFn()); // 'first call'
console.log(mockFn()); // 'second call'
console.log(mockFn()); // 'default'

// 模拟实现
mockFn.mockImplementation((a, b) => {
    return a + b;
});

// 模拟模块
jest.mock("lodash", () => ({
    debounce: jest.fn(() => () => {}),
    cloneDeep: jest.fn((obj) => JSON.parse(JSON.stringify(obj))),
}));
```

### 9. jest.spyOn 和 jest.fn 的区别

| 特性       | jest.fn()      | jest.spyOn()       |
| ---------- | -------------- | ------------------ |
| 创建方式   | 独立创建函数   | 包装已有对象的方法 |
| 原方法调用 | 不会调用原方法 | 默认会调用原方法   |
| 用途       | 模拟独立函数   | 监视+模拟对象方法  |
| 恢复原状   | 无需恢复       | 需要 restore()     |

```javascript
// spyOn 可以追踪原方法调用
const MathLib = {
    add: (a, b) => a + b,
};

const spy = jest.spyOn(MathLib, "add");
MathLib.add(1, 2); // 实际调用了原方法
MathLib.add(3, 4); // 实际调用了原方法

console.log(spy.mock.calls.length); // 2
spy.mockRestore(); // 恢复原方法
```

## 异步测试

### 10. 如何测试异步代码？

```javascript
// 方式一：Promise
test("fetch user", () => {
    return fetchUser().then((data) => {
        expect(data.name).toBe("John");
    });
});

// 方式二：async/await
test("fetch user with async", async () => {
    const data = await fetchUser();
    expect(data.name).toBe("John");
});

// 方式三：resolves/rejects
test("fetch user resolves", async () => {
    await expect(fetchUser()).resolves.toEqual({ name: "John" });
});

// 方式四：回调函数风格
test("callback style", (done) => {
    fetchUser((err, data) => {
        expect(err).toBeNull();
        expect(data.name).toBe("John");
        done();
    });
});
```

### 11. 测试异步错误处理的正确方式

```javascript
test("async error handling", async () => {
    try {
        await expect(fetchData()).rejects.toThrow("Network error");
    } catch (err) {
        // 这种写法是错误的！
        // 因为 expect(...).rejects.toThrow() 已经处理了 Promise
    }
});

// 正确写法
test("async error handling - correct", async () => {
    await expect(fetchData()).rejects.toThrow("Network error");
});

// 或者使用 try-catch
test("async error handling with try-catch", async () => {
    let error;
    try {
        await fetchData();
    } catch (e) {
        error = e;
    }
    expect(error.message).toBe("Network error");
});
```

## 快照测试

### 12. 快照测试的原理与应用场景

```javascript
// 组件快照
test("Button renders correctly", () => {
    const tree = renderer.create(<Button>Click</Button>).toJSON();
    expect(tree).toMatchSnapshot();
});

// 内联快照
test("renders correctly", () => {
    const output = renderComponent();
    expect(output).toMatchInlineSnapshot(`
    <div>
      <span>Hello</span>
    </div>
  `);
});

// 更新快照
// jest --updateSnapshot 或 jest -u
```

**适用场景**：

- UI 组件渲染结果验证
- JSON 数据结构验证
- 配置文件内容验证

**不适合场景**：

- 频繁变动的数据
- 动态计算的结果

### 13. 快照测试的局限性

1. **无法验证功能正确性**：只验证渲染结果，不验证交互
2. **维护成本高**：UI 变化时需要手动更新快照
3. **Snapshot Blasting**：大型快照难以 code review
4. **顺序敏感**：对象属性顺序可能导致测试失败

## 面试精选问题

### 问题一：Jest 和 Mocha 相比有什么优缺点？

**答案要点**：

**优点**：

- 零配置，开箱即用
- 内置 Mock、Coverage、Snapshot 功能
- 并行执行，测试速度快
- 更好的 TypeScript 支持

**缺点**：

- 隔离性过强，不适合需要共享状态的场景
- 全局变量污染（describe、test 等）
- 复杂配置不如 Mocha 灵活

**实际应用建议**：

- React 项目首选 Jest
- 需要高度自定义的测试环境可选 Mocha
- Vue 项目常用 Vue Test Utils + Jest/Vitest

### 问题二：如何提高 Jest 测试的执行速度？

**答案要点**：

```javascript
// 1. 使用 --maxWorkers 限制并行数
jest --maxWorkers=50%;

// 2. 使用 testPathIgnorePatterns 排除无关文件
// jest.config.js
module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};

// 3. 使用 watchPathIgnorePatterns 减少监视范围
module.exports = {
  watchPathIgnorePatterns: ['/node_modules/', '/dist/']
};

// 4. 使用 bail 快速失败
module.exports = {
  bail: 1 // 第一次失败就停止
};

// 5. 使用 setupFilesAfterEnv 优化环境准备
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};

// 6. 使用 jest-changed-files 只测试变更文件
jest --changedFilesSince=origin/master;
```

### 问题三：如何处理定时器相关的测试？

```javascript
// 使用 fake timers 控制时间
beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

test("debounce should work", () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 1000);

    debounced();
    debounced();
    debounced();

    // 快进时间
    jest.runAllTimers();

    expect(fn).toHaveBeenCalledTimes(1);
});

// 测试特定的定时器
jest.advanceTimersByTime(1000);

// 等待异步定时器
test("async timer", async () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 1000));
    jest.advanceTimersByTime(1000);
    await promise;
});
```

### 问题四：如何 Mock 第三方模块而不影响其他测试？

```javascript
// 在单个测试文件中 mock
jest.mock("axios");

test("mock axios in this file", () => {
    axios.get.mockResolvedValue({ data: { name: "John" } });
    // 测试代码
});

// 配合 beforeEach 重置
beforeEach(() => {
    jest.clearAllMocks();
});

// 使用 doMock 实现条件 mock
jest.doMock("axios", () => ({
    get: jest.fn(),
}));
```

### 问题五：Jest 的模块解析机制是怎样的？

```javascript
// jest.config.js
module.exports = {
    // 模块名称映射
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.css$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/__mocks__/fileMock.js",
    },

    // 模块目录解析顺序
    roots: ["<rootDir>/src"],

    // 测试文件匹配模式
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};
```

### 问题六：如何实现 Vue 组件的 Jest 测试？

```javascript
// Vue Test Utils + Jest
import { mount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

describe("HelloWorld.vue", () => {
    test("renders props.msg when passed", () => {
        const msg = "new message";
        const wrapper = mount(HelloWorld, {
            props: { msg },
        });
        expect(wrapper.text()).toMatch(msg);
    });

    test("emits event when button clicked", () => {
        const wrapper = mount(HelloWorld);
        wrapper.find("button").trigger("click");
        expect(wrapper.emitted().click).toBeTruthy();
    });

    test("matches snapshot", () => {
        const wrapper = mount(HelloWorld);
        expect(wrapper).toMatchSnapshot();
    });
});
```

## 最佳实践

### 测试文件组织结构

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.vue
│   │   ├── Button.spec.js      # 单元测试
│   │   └── __snapshots__/
│   │       └── Button.spec.js.snap
│   └── __tests__/
│       └── Modal.test.js        # 集成测试
└── utils/
    └── format.test.js
```

### 编写高质量测试的原则

1. **AAA 模式**：Arrange（准备）-> Act（执行）-> Assert（断言）
2. **单一职责**：每个测试只验证一个功能点
3. **描述性命名**：测试名称应该清晰表达测试意图
4. **避免逻辑**：测试代码中避免复杂逻辑
5. **独立性**：测试之间不应该有依赖关系
6. **可重复**：测试应该能够多次执行并得到相同结果

```javascript
// 好的测试示例
describe("Calculator", () => {
    describe("add", () => {
        it("should return 3 when adding 1 and 2", () => {
            // Arrange
            const calculator = new Calculator();

            // Act
            const result = calculator.add(1, 2);

            // Assert
            expect(result).toBe(3);
        });

        it("should handle negative numbers", () => {
            const calculator = new Calculator();
            expect(calculator.add(-1, -2)).toBe(-3);
        });
    });
});
```

### CI 环境优化

```javascript
// jest.config.js
module.exports = {
    // CI 环境使用顺序执行，避免资源竞争
    maxWorkers: process.env.CI ? 1 : "50%",

    // CI 环境启用详细输出
    verbose: !!process.env.CI,

    // 启用报告器
    reporters: process.env.CI ? ["default", "jest-junit"] : ["default"],
};
```
