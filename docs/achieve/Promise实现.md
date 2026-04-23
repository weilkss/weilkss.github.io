# Promise 实现

## Promise/A+ 规范概述

Promise 是异步编程的一种解决方案，比回调函数更强大、更优雅。Promise A+ 规范定义了 Promise 的最小接口。

## Promise 状态

| 状态      | 说明             | 转换                         |
| --------- | ---------------- | ---------------------------- |
| pending   | 待定（初始状态） | 可转为 fulfilled 或 rejected |
| fulfilled | 已兑现（成功）   | 不可转换其他状态             |
| rejected  | 已拒绝（失败）   | 不可转换其他状态             |

## 核心原理

1. Promise 构造函数接收一个 executor 函数
2. executor 会立即执行，传入 resolve 和 reject 两个回调
3. Promise 实例有 then 方法，返回新的 Promise
4. 支持链式调用

## 完整实现

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
    constructor(executor) {
        this.state = PENDING;
        this.value = undefined;
        this.reason = undefined;

        // 存储多个 then 回调
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.state === PENDING) {
                this.state = FULFILLED;
                this.value = value;
                this.onFulfilledCallbacks.forEach((fn) => fn());
            }
        };

        const reject = (reason) => {
            if (this.state === PENDING) {
                this.state = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach((fn) => fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    then(onFulfilled, onRejected) {
        // 参数可选处理
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
        onRejected =
            typeof onRejected === "function"
                ? onRejected
                : (err) => {
                      throw err;
                  };

        const promise2 = new MyPromise((resolve, reject) => {
            if (this.state === FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                }, 0);
            }

            if (this.state === REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                }, 0);
            }

            if (this.state === PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    }, 0);
                });

                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    }, 0);
                });
            }
        });

        return promise2;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(callback) {
        return this.then(
            (value) => MyPromise.resolve(callback()).then(() => value),
            (reason) =>
                MyPromise.resolve(callback()).then(() => {
                    throw reason;
                }),
        );
    }

    static resolve(value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise((resolve) => resolve(value));
    }

    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
}

// 处理 Promise 返回值
function resolvePromise(promise2, x, resolve, reject) {
    // 避免循环引用
    if (promise2 === x) {
        return reject(new TypeError("Chaining cycle detected"));
    }

    // 如果 x 是 Promise
    if (x instanceof MyPromise) {
        x.then(resolve, reject);
        return;
    }

    // 如果 x 是对象或函数
    if (x !== null && (typeof x === "object" || typeof x === "function")) {
        let called = false;
        try {
            const then = x.then;
            if (typeof then === "function") {
                then.call(
                    x,
                    (y) => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    (err) => {
                        if (called) return;
                        called = true;
                        reject(err);
                    },
                );
            } else {
                resolve(x);
            }
        } catch (err) {
            if (called) return;
            called = true;
            reject(err);
        }
    } else {
        resolve(x);
    }
}
```

## 使用示例

```js
const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve("成功");
    }, 1000);
});

promise
    .then((res) => {
        console.log(res); // '成功'
        return "第二次成功";
    })
    .then((res) => {
        console.log(res); // '第二次成功'
    })
    .catch((err) => {
        console.log(err);
    });
```

## 面试追问点

### Promise 相比回调函数的优点

1. **链式调用**：解决回调地狱
2. **状态不可逆**：一旦确定就不能再改变
3. **错误处理**：统一的 catch 捕获
4. **组合能力**：Promise.all、Promise.race

### Promise 的局限性

1. 无法取消
2. 错误处理不够友好（需要 catch）
3. 处于 pending 状态时无法知道进度
