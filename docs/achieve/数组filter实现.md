# 数组 filter 实现

## 描述

`Array.prototype.filter()` 创建一个新数组，包含所有通过回调函数测试的元素。

## 核心原理

1. 遍历原数组
2. 对每个元素执行回调测试
3. 将通过测试的元素收集到新数组
4. 返回新数组（不修改原数组）

## 实现代码

### 基础版

```js
Array.prototype.myFilter = function (callback, thisArg) {
    if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
    }

    const arr = this;
    const result = [];

    for (let i = 0; i < arr.length; i++) {
        if (i in arr) {
            if (callback.call(thisArg, arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
    }

    return result;
};
```

### 完整版（处理稀疏数组和边界情况）

```js
Array.prototype.myFilter = function (callback, thisArg) {
    if (this === null || this === undefined) {
        throw new TypeError('Cannot read property "filter" of null or undefined');
    }

    if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
    }

    const O = Object(this);
    const len = O.length >>> 0;
    const result = [];

    for (let i = 0; i < len; i++) {
        if (Object.prototype.hasOwnProperty.call(O, i)) {
            const value = O[i];
            if (callback.call(thisArg, value, i, O)) {
                result.push(value);
            }
        }
    }

    return result;
};
```

## 使用示例

```js
const numbers = [1, 2, 3, 4, 5, 6];

// 基础筛选
const evens = numbers.myFilter((x) => x % 2 === 0);
console.log(evens); // [2, 4, 6]

// 筛选对象
const users = [
    { name: "张三", age: 18 },
    { name: "李四", age: 20 },
    { name: "王五", age: 15 },
];
const adults = users.myFilter((user) => user.age >= 18);
console.log(adults);
// [{ name: '张三', age: 18 }, { name: '李四', age: 20 }]

// 配合索引
const indexEven = numbers.myFilter((num, index) => index % 2 === 0);
console.log(indexEven); // [1, 3, 5]（索引0,2,4的元素）

// 配合 thisArg
const context = { minValue: 3 };
const filtered = numbers.myFilter(function (num) {
    return num >= this.minValue;
}, context);
console.log(filtered); // [3, 4, 5, 6]

// 去除假值
const mixed = [0, 1, false, 2, "", 3, null, undefined, NaN];
const truthy = mixed.myFilter(Boolean);
console.log(truthy); // [1, 2, 3]
```

## 与原生对比

| 特性       | 原生 filter             | 手写实现 |
| ---------- | ----------------------- | -------- |
| 稀疏数组   | 跳过空位                | 跳过空位 |
| this 绑定  | 支持                    | 支持     |
| 返回新数组 | ✓                       | ✓        |
| 原数组不变 | ✓                       | ✓        |
| 回调参数   | (element, index, array) | 支持     |

## 面试追问点

### filter 的时间复杂度

- O(n)，需要遍历所有元素

### filter 与 find 的区别

| 方法   | 返回值             | 找到第一个后 |
| ------ | ------------------ | ------------ |
| filter | 新数组（可能多个） | 继续遍历     |
| find   | 第一个匹配元素     | 停止遍历     |
