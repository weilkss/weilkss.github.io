# async/await 实现

## 描述

async/await 是 ES2017 引入的异步编程语法糖，让异步代码看起来像同步代码。async 函数返回一个 Promise，await 用于等待一个 Promise 完成。

## async/await 原理

1. **async**：将普通函数包装成返回 Promise 的函数
2. **await**：暂停 async 函数执行，等待 Promise resolve 后继续
3. 编译器/解释器会将 async/await 编译成生成器 + Promise 的形式

## 手写实现

### 简易版 co 函数

```js
function co(generator) {
    const gen = generator();

    return new Promise((resolve, reject) => {
        function step(method, arg) {
            try {
                const result = gen[method](arg);
                if (result.done) {
                    resolve(result.value);
                } else {
                    Promise.resolve(result.value).then(
                        (val) => step("next", val),
                        (err) => step("throw", err),
                    );
                }
            } catch (err) {
                reject(err);
            }
        }

        step("next");
    });
}
```

### 使用生成器模拟 async/await

```js
function fetchData() {
    return new Promise((resolve) => {
        setTimeout(() => resolve("data"), 100);
    });
}

function fetchMore() {
    return new Promise((resolve) => {
        setTimeout(() => resolve("more"), 100);
    });
}

// 使用生成器 + co 模拟 async/await
co(function* () {
    const data = yield fetchData();
    console.log(data); // 'data'

    const more = yield fetchMore();
    console.log(more); // 'more'

    return "complete";
}).then(console.log); // 'complete'
```

---

## async 函数的实现

### 简易版 async

```js
function myAsync(generatorFn) {
    return function (...args) {
        const generator = generatorFn.apply(this, args);
        return co(generator);
    };
}

// 使用
const asyncFn = myAsync(function* () {
    const data = yield Promise.resolve(1);
    const more = yield Promise.resolve(data + 2);
    return more;
});

asyncFn().then(console.log); // 3
```

---

## 带错误处理的完整版

```js
class AsyncFunction {
    constructor(generatorFn) {
        this.generatorFn = generatorFn;
    }

    then(onFulfilled, onRejected) {
        const self = this;
        return new Promise(function (resolve, reject) {
            function step(method, arg) {
                try {
                    const result = self.generatorFn[method](arg);
                    if (result.done) {
                        Promise.resolve(result.value).then(resolve, reject);
                    } else {
                        Promise.resolve(result.value).then(
                            (val) => step("next", val),
                            (err) => step("throw", err),
                        );
                    }
                } catch (err) {
                    reject(err);
                }
            }

            step("next");
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }
}

function async(generatorFn) {
    return function (...args) {
        return new AsyncFunction(generatorFn.apply(this, args));
    };
}
```

---

## 实际应用示例

### 顺序执行

```js
// async/await 写法
async function fetchAll() {
    const a = await fetchA();
    const b = await fetchB();
    const c = await fetchC();
    return [a, b, c];
}

// 用生成器模拟
co(function* () {
    const a = yield fetchA();
    const b = yield fetchB();
    const c = yield fetchC();
    return [a, b, c];
});
```

### 并行执行

```js
// async/await 并行写法
async function fetchAllParallel() {
    const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()]);
    return [a, b, c];
}

// 用生成器模拟
co(function* () {
    const [a, b, c] = yield Promise.all([fetchA(), fetchB(), fetchC()]);
    return [a, b, c];
});
```

---

## 面试追问点

### async/await 与 Promise 的关系

- async 函数始终返回 Promise
- await 后面通常是 Promise，也可以是任何值
- async/await 是 Promise 的语法糖，不能替代 Promise

### async/await 的优点

1. 代码更简洁、可读性更强
2. 调试友好（可以在 await 处打断点）
3. 错误处理统一（try/catch）

### async/await 的缺点

1. 错误处理不直观（容易忘记 try/catch）
2. 并行执行需要配合 Promise.all
3. 浏览器兼容性问题（需要转译）
