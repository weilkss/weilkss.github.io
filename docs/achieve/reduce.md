# reduce

reduce() 方法对数组中的每个元素执行一个由您提供的 reducer 函数（升序执行），将其结果汇总为单个返回值

**实现思路：**

-   看是否有初始值，没有就取数组第一个
-   开始循环数组，拿到返回值
-   最后返回循环完了的结果

**代码实现：**

```js
Array.prototype.myReduce = function (callback, initValue) {
    const arr = this;
    let result = initValue ?? 0;
    for (let i = 0; i < arr.length; i++) {
        result = callback(result, arr[i], i, arr);
    }
    return result;
};
```

::: danger

-   需要判断 this 是否是数组
-   需要判断 callback 是否是个方法
-   需要判断当没有默认值的时候数组必须存在项

:::

**完整实现：**

```js
Array.prototype.myReduce = function (callback, initValue) {
    // 确保 'this' 是数组
    if (!Array.isArray(this)) {
        throw new Error("数组才能调用reduce");
    }

    // 确保 callback 是一个函数
    if (typeof callback !== "function") {
        throw new Error("第一个参数必须是一个函数");
    }

    const arr = this;
    let startIndex = 0;

    // 如果提供了 initValue，则从第一个元素开始迭代
    // 否则，从第二个元素开始迭代，并设置 result 为第一个元素
    if (initValue === undefined) {
        if (arr.length === 0) {
            throw new TypeError("Reduce of empty array with no initial value");
        }
        startIndex = 1;
        initValue = arr[0];
    }

    let result = initValue;
    for (let i = startIndex; i < arr.length; i++) {
        result = callback(result, arr[i], i, arr);
    }

    return result;
};
```
