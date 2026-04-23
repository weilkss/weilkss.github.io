# 数组 flat 实现

## 描述

`Array.prototype.flat()` 用于将嵌套的数组拍平（flatten）成一维数组。该方法返回一个新数组，不会改变原数组。

## 实现思路

1. **递归遍历**：遍历数组每个元素
2. **类型判断**：如果是数组则递归展开，否则拼接
3. **深度控制**：通过 depth 参数控制展开深度

## 代码实现

### 基础版

```js
function flat(arr, depth = 1) {
    if (depth <= 0) return arr;
    return arr.reduce((prev, cur) => {
        return prev.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur);
    }, []);
}
```

### 完整版（处理 Infinity）

```js
function flat(arr, depth = Infinity) {
    if (depth <= 0) return arr;
    return arr.reduce((prev, cur) => {
        if (Array.isArray(cur)) {
            return prev.concat(flat(cur, depth - 1));
        }
        return prev.concat(cur);
    }, []);
}
```

### 替代方案

如果不想自己实现，可以使用以下方式：

```js
// 使用 toString（仅适用于纯数字数组）
const arr = [1, [2, [3, [4]]]];
arr.toString().split(",").map(Number); // [1, 2, 3, 4]

// 使用 join（仅适用于纯数字数组）
arr.join(",").split(",").map(Number);

// 使用 spread 运算符简化
const flatten = (arr) =>
    arr.reduce((acc, val) => (Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val)), []);
```

## 使用示例

```js
const arr = [1, [2, [3, [4]]]];

flat(arr); // [1, 2, [3, [4]]] - 默认深度1
flat(arr, 2); // [1, 2, 3, [4]] - 深度2
flat(arr, Infinity); // [1, 2, 3, 4] - 全部展开
```

## 内置方法对比

| 方法      | 说明                                     |
| --------- | ---------------------------------------- |
| flat()    | ES2019 内置方法，默认深度1               |
| flatMap() | 先 map 再 flat，常用于映射和展开一步完成 |
