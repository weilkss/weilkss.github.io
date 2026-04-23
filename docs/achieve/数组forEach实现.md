# 数组 forEach 实现

## 描述

`Array.prototype.forEach()` 对数组的每个元素执行一次提供的函数。没有返回值。

## 核心原理

1. 遍历数组
2. 对每个元素执行回调
3. 不能 break/throw/return 终止（可用 try 或 every/some/filter/find 替代）

## 实现代码

### 基础版

```js
Array.prototype.myForEach = function (callback, thisArg) {
    if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
    }

    const arr = this;

    for (let i = 0; i < arr.length; i++) {
        if (i in arr) {
            callback.call(thisArg, arr[i], i, arr);
        }
    }
};
```

### 完整版（处理稀疏数组和边界情况）

```js
Array.prototype.myForEach = function (callback, thisArg) {
    if (this === null || this === undefined) {
        throw new TypeError('Cannot read property "forEach" of null or undefined');
    }

    if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
    }

    const O = Object(this);
    const len = O.length >>> 0;

    for (let i = 0; i < len; i++) {
        if (Object.prototype.hasOwnProperty.call(O, i)) {
            callback.call(thisArg, O[i], i, O);
        }
    }
};
```

## 使用示例

```js
const numbers = [1, 2, 3];

// 基础用法
numbers.myForEach((num) => console.log(num));
// 1
// 2
// 3

// 带索引和数组本身
numbers.myForEach((num, index, arr) => {
    console.log(`${index}: ${num}`, arr);
});
// 0: 1 [1, 2, 3]
// 1: 2 [1, 2, 3]
// 2: 3 [1, 2, 3]

// 配合 thisArg
const context = { prefix: "Num:" };
numbers.myForEach(function (num) {
    console.log(this.prefix + num);
}, context);
// Num:1
// Num:2
// Num:3

// 稀疏数组
const sparse = [1, , 3];
sparse.myForEach((val, i) => console.log(`${i}: ${val}`));
// 0: 1
// 2: 3
```

## 与原生对比

| 特性       | 原生 forEach         | 手写实现  |
| ---------- | -------------------- | --------- |
| 稀疏数组   | 跳过空位             | 跳过空位  |
| this 绑定  | 支持                 | 支持      |
| 返回值     | undefined            | undefined |
| 修改原数组 | 可能（但不应这么做） | 可能      |

## forEach vs for vs map

| 特性           | forEach   | for    | map    |
| -------------- | --------- | ------ | ------ |
| 语法           | 函数式    | 命令式 | 函数式 |
| break/continue | 不可用    | 可用   | 不可用 |
| 返回值         | undefined | 可控   | 新数组 |
| 性能           | 较慢      | 最快   | 较慢   |
| 修改原数组     | 可        | 可     | 不可   |
