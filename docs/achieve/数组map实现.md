# 数组 map 实现

## 描述

`Array.prototype.map()` 创建一个新数组，其结果是该数组中的每个元素调用一个提供的函数后的返回值。

## 核心原理

1. 遍历原数组
2. 对每个元素调用回调函数
3. 将回调返回值收集到新数组
4. 返回新数组（不修改原数组）

## 实现代码

### 基础版

```js
Array.prototype.myMap = function (callback, thisArg) {
    if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
    }

    const arr = this;
    const result = new Array(arr.length);

    for (let i = 0; i < arr.length; i++) {
        if (i in arr) {
            result[i] = callback.call(thisArg, arr[i], i, arr);
        }
    }

    return result;
};
```

### 完整版（处理稀疏数组）

```js
Array.prototype.myMap = function (callback, thisArg) {
    if (this === null || this === undefined) {
        throw new TypeError('Cannot read property "map" of null or undefined');
    }

    if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
    }

    const O = Object(this);
    const len = O.length >>> 0;
    const result = new Array(len);

    for (let i = 0; i < len; i++) {
        if (Object.prototype.hasOwnProperty.call(O, i)) {
            const value = O[i];
            result[i] = callback.call(thisArg, value, i, O);
        }
    }

    return result;
};
```

## 使用示例

```js
const numbers = [1, 2, 3, 4];

// 基础用法
const doubled = numbers.myMap((x) => x * 2);
console.log(doubled); // [2, 4, 6, 8]

// 带索引
const indexed = numbers.myMap((num, index) => num + index);
console.log(indexed); // [1, 3, 5, 7]

// 配合 thisArg
const multiplier = { factor: 10 };
const scaled = numbers.myMap(function (num) {
    return num * this.factor;
}, multiplier);
console.log(scaled); // [10, 20, 30, 40]

// 处理对象
const users = [
    { name: "张三", age: 18 },
    { name: "李四", age: 20 },
];
const names = users.myMap((user) => user.name);
console.log(names); // ['张三', '李四']
```

## 与原生对比

| 特性       | 原生 map | 手写实现 |
| ---------- | -------- | -------- |
| 稀疏数组   | 跳过空位 | 跳过空位 |
| this 绑定  | 支持     | 支持     |
| 返回新数组 | ✓        | ✓        |
| 原数组不变 | ✓        | ✓        |
