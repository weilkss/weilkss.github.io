# instanceof

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