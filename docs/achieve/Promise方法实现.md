# Promise.all / Promise.race 实现

## Promise.all

### 描述

`Promise.all()` 方法接受一个 Promise 可迭代对象，返回一个新的 Promise。当所有 Promise 都成功时，新的 Promise 才会 resolve；如果任意一个 Promise 失败，新的 Promise 会 reject。

### 实现代码

```js
Promise.myAll = function (promises) {
    const results = [];
    let completedCount = 0;

    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            resolve([]);
            return;
        }

        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                (value) => {
                    results[index] = value;
                    completedCount++;
                    if (completedCount === promises.length) {
                        resolve(results);
                    }
                },
                (reason) => {
                    reject(reason);
                },
            );
        });
    });
};
```

### 使用示例

```js
const p1 = Promise.resolve(1);
const p2 = new Promise((resolve) => setTimeout(() => resolve(2), 100));
const p3 = Promise.resolve(3);

Promise.myAll([p1, p2, p3]).then(console.log); // [1, 2, 3]

// 任意一个失败
const p4 = Promise.reject("error");
Promise.myAll([p1, p4, p3]).catch(console.log); // 'error'
```

---

## Promise.race

### 描述

`Promise.race()` 方法返回一个新的 Promise，以最先 settled（fulfilled 或 rejected）的 Promise 的结果为准。

### 实现代码

```js
Promise.myRace = function (promises) {
    return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
            Promise.resolve(promise).then(
                (value) => resolve(value),
                (reason) => reject(reason),
            );
        });
    });
};
```

### 使用示例

```js
const p1 = new Promise((resolve) => setTimeout(() => resolve("第一个"), 200));
const p2 = new Promise((resolve) => setTimeout(() => resolve("第二个"), 100));
const p3 = new Promise((_, reject) => setTimeout(() => reject("第三个失败"), 50));

Promise.myRace([p1, p2]).then(console.log); // '第二个'（最快）
Promise.myRace([p1, p3]).catch(console.log); // '第三个失败'
```

---

## Promise.allSettled

### 描述

`Promise.allSettled()` 返回一个在所有给定 Promise 都 settled（无论成功或失败）后的 Promise。

### 实现代码

```js
Promise.myAllSettled = function (promises) {
    const results = [];
    let completedCount = 0;

    return new Promise((resolve) => {
        if (promises.length === 0) {
            resolve([]);
            return;
        }

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(
                    (value) => {
                        results[index] = { status: "fulfilled", value };
                    },
                    (reason) => {
                        results[index] = { status: "rejected", reason };
                    },
                )
                .finally(() => {
                    completedCount++;
                    if (completedCount === promises.length) {
                        resolve(results);
                    }
                });
        });
    });
};
```

### 使用示例

```js
const p1 = Promise.resolve(1);
const p2 = Promise.reject("error");

Promise.myAllSettled([p1, p2]).then(console.log);
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'error' }
// ]
```

---

## Promise.any

### 描述

`Promise.any()` 返回一个新的 Promise，只要任意一个 Promise 成功就 resolve；如果全部失败才 reject。

### 实现代码

```js
Promise.myAny = function (promises) {
    const reasons = [];
    let rejectedCount = 0;

    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            reject(new AggregateError("All promises were rejected"));
            return;
        }

        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(
                (value) => resolve(value),
                (reason) => {
                    reasons[index] = reason;
                    rejectedCount++;
                    if (rejectedCount === promises.length) {
                        reject(new AggregateError(reasons));
                    }
                },
            );
        });
    });
};
```

### 使用示例

```js
const p1 = Promise.reject(1);
const p2 = new Promise((resolve) => setTimeout(() => resolve(2), 100));

Promise.myAny([p1, p2]).then(console.log); // 2

// 全部失败
const p3 = Promise.reject("error1");
const p4 = Promise.reject("error2");
Promise.myAny([p3, p4]).catch((err) => console.log(err.errors));
// ['error1', 'error2']
```

---

## 四者对比

| 方法       | 成功条件           | 失败条件       | 返回值         |
| ---------- | ------------------ | -------------- | -------------- |
| all        | 全部成功           | 任意一个失败   | 所有结果的数组 |
| race       | 任意一个先 settled | 任意一个先失败 | 最先结果       |
| allSettled | 全部 settled       | 无             | 所有状态的数组 |
| any        | 任意一个成功       | 全部失败       | 最先成功的值   |
