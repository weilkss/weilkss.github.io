# 手写实现

## 深拷贝

**简易版实现思路：**

-   使用递归
-   考虑循环引用，使用 map 和 weakMap
-   考虑对象 object 和数组 array
-   考虑 null
-   考虑其他复合对象：比如 Date、Mach 等

**代码实现：**

```js
function deepClone(targrt, map = new Map()) {
	if (typeof targrt == "object" && targrt !== null) {
		const obj = Array.isArray(targrt) ? [] : {};

		if (map.get(targrt)) {
			return map.get(targrt);
		}
		map.set(targrt, obj);

		for (const key in targrt) {
			obj[key] = deepClone(targrt[key], map);
		}
		return obj;
	}

	return targrt;
}
```

## 防抖节流

### 防抖

防抖技术的基本思想是：在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时。这适用于那些需要等待用户停止操作后才执行的场景，比如搜索框的搜索提示、输入框的验证等。

**实现思路：**

-   定义一个定时器。
-   当事件被触发时，如果定时器已存在，则清除它。
-   重新设置定时器，延迟执行回调函数。

**代码实现：**

```js
function debounce(func, wait) {
	let timeout;
	return function () {
		const context = this,
			args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args);
		}, wait);
	};
}
```

### 节流

节流技术的基本思想是：规定在单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次能生效。这适用于那些需要控制执行频率的场景，比如滚动加载图片、自动完成等。

**实现思路：**

-   记录上一次执行的时间。
-   当事件被触发时，比较当前时间和上一次执行时间的差是否达到了指定的时间间隔。
-   如果达到了，则执行函数，并更新上一次执行时间。

**代码实现：**

```js
function throttle(func, limit) {
	let flag;
	return function () {
		const args = arguments;
		const context = this;
		if (!flag) {
			func.apply(context, args);
			flag = true;
			setTimeout(() => (flag = false), limit);
		}
	};
}
```

## instanceof

在 JavaScript 中，instanceof 操作符用于检测一个实例是否属于某个构造函数或者它的原型链上。如果你想要手写一个模拟 instanceof 的函数，你可以通过遍历目标对象的原型链（`__proto__` 或使用 Object.getPrototypeOf()），并检查它是否指向了构造函数的 prototype 属性。

但是，需要注意的是，直接使用 `__proto__` 并不是最佳实践，因为它不是 ECMAScript 标准的一部分，尽管在大多数现代浏览器中都可用。更标准的方法是使用 Object.getPrototypeOf() 来获取对象的原型

**实现思路：**

-   首先检查 obj 是否为 null 或 undefined，因为这两种情况不符合 instanceof 的定义
-   循环通过查找 obj 的`__proto__`是否等于对象的原型即 `target.prototype`

**代码实现：**

```js
function myInstanceof(obj, target) {
	if (typeof obj === "undefined" || obj === null) return false;
	let proto = Object.getPrototypeOf(obj);
	while (true) {
		if (proto === target.prototype) return true;
		if (proto === null) return false;
		proto = Object.getPrototypeOf(proto);
	}
}
```

## reduce

reduce() 方法对数组中的每个元素执行一个由您提供的 reducer 函数（升序执行），将其结果汇总为单个返回值

**实现思路：**

-   看是否有初始值，没有就取数组第一个
-   开始循环数组，拿到返回值
-   最后返回循环完了的结果

**代码实现：**

```js
Array.prototype.myReduce = function () {
	const arr = this;
	const callback = arguments[0];
	let result = arguments[1] ?? arr[0];
	for (let i = 0; i < arr.length; i++) {
		result = callback(result, arr[i], i, arr);
	}
	return result;
};
```