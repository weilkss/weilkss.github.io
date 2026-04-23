# ES6 面试指南

## 核心概念

ES6（ECMAScript 2015）是 JavaScript 最重要的更新，引入了大量新特性，大幅提升了开发效率。

---

## let 和 const

### 核心特性

```javascript
// let - 块级作用域
if (true) {
    let a = 1;
    var b = 2;
}
console.log(b); // 2
console.log(a); // ReferenceError: a is not defined

// const - 常量（注意：是引用地址不变，不是值不变）
const ARR = [1, 2, 3];
ARR.push(4); // 可以执行，数组内容变了
// ARR = [1, 2]; // 报错，不能重新赋值

// const 对象
const OBJ = { name: "zs" };
OBJ.name = "ls"; // 可以执行
// OBJ = {}; // 报错
```

### 面试高频问题

### Q1：let、const、var 的区别？

**答**：

| 特性     | var                       | let                   | const                 |
| -------- | ------------------------- | --------------------- | --------------------- |
| 作用域   | 函数作用域                | 块级作用域            | 块级作用域            |
| 变量提升 | ✅ 会提升，值为 undefined | ✅ 提升但有暂时性死区 | ✅ 提升但有暂时性死区 |
| 重复声明 | ✅ 可以                   | ❌ 不可以             | ❌ 不可以             |
| 全局属性 | ✅ 会成为 window 属性     | ❌ 不会               | ❌ 不会               |

**暂时性死区**：在块级作用域中，使用 let/const 声明的变量，在声明之前使用会报错。

```javascript
// var 的变量提升
console.log(a); // undefined（不会报错）
var a = 1;

// let 的暂时性死区
console.log(b); // ReferenceError
let b = 2;
```

### Q2：为什么推荐使用 const/let 而不是 var？

**答**：

1. **避免变量提升带来的困惑**：var 会变量提升，容易产生意想不到的 bug
2. **块级作用域更符合直觉**：let/const 在 `{}` 块内有效，不会意外泄漏
3. **const 语义化更好**：声明后不应再赋值的变量用 const，便于代码阅读
4. **避免全局污染**：var 在全局作用域下会挂载到 window 对象

---

## 箭头函数

### 核心特性

```javascript
// 基本语法
const fn = (a, b) => a + b;

// 完整语法
const fn = (a, b) => {
    return a + b;
};

// 单参数可省略括号
const fn = (a) => a * 2;

// 返回对象需要用括号包裹
const fn = () => ({ name: "zs" });
```

### 面试高频问题

### Q1：箭头函数和普通函数的区别？

**答**：

| 特性               | 箭头函数               | 普通函数           |
| ------------------ | ---------------------- | ------------------ |
| this               | 指向定义时的外层上下文 | 指向调用时的对象   |
| arguments          | 没有自己的 arguments   | 有自己的 arguments |
| prototype          | 没有 prototype         | 有 prototype       |
| 不能作为构造函数   | ✅ 不能用 new 调用     | ✅ 可以用 new 调用 |
| 不能用作 Generator | ✅ 不能 yield          | ✅ 可以 yield      |

```javascript
// this 的区别示例
const obj = {
    name: "obj",
    // 普通函数 - this 指向调用时的 obj
    getName: function () {
        return this.name;
    },
    // 箭头函数 - this 指向定义时的外层（全局/模块）
    getNameArrow: () => {
        return this.name; // this !== obj
    },
};

const fn = obj.getName;
fn(); // 丢失 this，普通函数返回 undefined
const fnArrow = obj.getNameArrow;
fnArrow(); // 箭头函数 this 仍然指向定义时的上下文
```

### Q2：箭头函数能作为构造函数吗？为什么？

**答**：不能。因为箭头函数没有自己的 `this`、`prototype` 和 `arguments`，而构造函数需要通过 `this` 来设置实例属性，并通过 `prototype` 来设置原型方法。

---

## 解构赋值

### 核心特性

```javascript
// 数组解构
const [a, b, c] = [1, 2, 3]; // a=1, b=2, c=3
const [, , c] = [1, 2, 3]; // c=3
const [a, ...rest] = [1, 2, 3]; // a=1, rest=[2, 3]

// 对象解构
const { name, age } = { name: "zs", age: 18 };
const { name: nickname } = { name: "zs" }; // nickname='zs'，重命名
const { name = "default" } = {}; // 默认值

// 函数参数解构
function fn({ name, age = 18 }) {
    console.log(name, age);
}
fn({ name: "zs", age: 20 }); // zs 20

// 嵌套解构
const {
    data: { list },
} = { data: { list: [1, 2] } }; // list=[1,2]
```

### 面试高频问题

### Q1：解构赋值的原理是什么？

**答**：解构赋值利用了**迭代器协议**和**对象属性的可枚举性**。对于数组，解构按位置匹配；对于对象，解构按属性名匹配。右侧必须是可迭代的（数组）或对象。

```javascript
// 数组解构原理：右侧必须是可迭代对象
const [a, b] = "hi"; // a='h', b='i'，字符串可迭代

// 惰性求值
const [
    a = (() => {
        console.log("only run when needed");
        return 1;
    })(),
] = [undefined]; // 打印 'only run when needed'
const [
    b = (() => {
        console.log("not run");
        return 2;
    })(),
] = [3]; // 不打印
```

---

## 模板字符串

### 核心特性

```javascript
// 基本用法
const name = "zs";
const str = `Hello, ${name}!`; // 'Hello, zs!'

// 表达式
const a = 1,
    b = 2;
const result = `${a} + ${b} = ${a + b}`; // '1 + 2 = 3'

// 调用函数
const fn = (str) => str.toUpperCase();
const output = `${fn`hello`}`; // 'HELLO'，标签模板

// 多行字符串
const html = `
    <div>
        <h1>Title</h1>
    </div>
`;
```

### Q1：什么是标签模板？

**答**：标签模板是一种特殊调用函数的方式。函数名后面直接跟一个模板字符串，模板字符串的表达式的值会作为参数传入函数。

```javascript
function tag(strings, ...values) {
    console.log(strings); // ['Hello, ', '!']
    console.log(values); // ['World']
    return strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
}

const result = tag`Hello, ${"World"}!`;
// strings: ['Hello, ', '!']
// values: ['World']
```

**应用场景**：

1. 国际化处理（i18n）
2. SQL 注入防护
3. HTML 转义

---

## Symbol

### 核心特性

```javascript
// 创建 Symbol
const s1 = Symbol("desc"); // 可选描述
const s2 = Symbol("desc");
s1 === s2; // false，每个 Symbol 都唯一

// Symbol.for - 全局注册表
const s3 = Symbol.for("key"); // 首次创建
const s4 = Symbol.for("key"); // 获取已存在的
s3 === s4; // true

// 获取 Symbol 描述
s1.description; // 'desc'

// 用作对象属性
const obj = {
    [s1]: "value1",
    [Symbol("anon")]: "value2",
};
Object.getOwnPropertySymbols(obj); // 获取所有 Symbol 属性
```

### 面试高频问题

### Q1：Symbol 的应用场景？

**答**：

1. **属性名唯一性**：防止对象属性名冲突
2. **私有属性**：Symbol 属性不会出现在 `for...in`、`Object.keys()` 中
3. **内置 Symbol 值**：如 `Symbol.iterator`、`Symbol.toStringTag`
4. **全局 Symbol 注册表**：`Symbol.for()` 实现跨 iframe/worker 共享

---

## Set 和 Map

### 核心特性

```javascript
// Set - 类似数组，成员唯一
const set = new Set([1, 2, 2, 3]);
set.size; // 3
set.has(1); // true
set.add(4);
set.delete(1);
set.clear();

[...set]; // [2, 3, 4]

// Map - 键值对，键可以是任意值
const map = new Map();
map.set("name", "zs");
map.set({}, "objectKey"); // 对象作为键
map.get("name"); // 'zs'
map.has("name"); // true
map.delete("name");
map.size; // 1

// 遍历
for (const [key, value] of map) {
    console.log(key, value);
}

// WeakMap/WeakSet - 弱引用，不阻止垃圾回收
const wm = new WeakMap();
const obj = {};
wm.set(obj, "value"); // key 必须是对象
```

### 面试高频问题

### Q1：Set 和 Array 的区别？如何选择？

**答**：

| 特性       | Set                | Array              |
| ---------- | ------------------ | ------------------ |
| 元素唯一性 | ✅ 自动去重        | ❌ 可能重复        |
| 查找效率   | O(1)               | O(n)               |
| 添加/删除  | O(1)               | O(n)（中间位置）   |
| 存储类型   | 只能是值           | 值                 |
| 场景       | 去重、判断是否存在 | 有序存储、需要索引 |

### Q2：Map 和 Object 的区别？

**答**：

| 特性   | Map            | Object               |
| ------ | -------------- | -------------------- |
| 键类型 | 任意值         | 只能是字符串/Symbol  |
| 键有序 | ✅ 是          | ✅（除 Proxy 外）    |
| 迭代   | 可直接迭代     | 需要 Object.keys()   |
| 大小   | size 属性      | Object.keys().length |
| 性能   | 键值对多时更优 | 键值对少时更优       |
| 原型链 | 没有默认键     | 有默认键（可覆盖）   |

---

## Promise

### 核心特性

```javascript
// 创建 Promise
const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("success"), 1000);
});

// 三种状态
// pending（进行中）-> fulfilled（已成功）或 rejected（已失败）
// 状态一旦改变就不可逆

// then / catch / finally
promise
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
    .finally(() => console.log("complete"));

// Promise.all - 所有都成功才成功
Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.reject("error")])
    .then((res) => console.log(res)) // 不会执行
    .catch((err) => console.log(err)); // 'error'

// Promise.race - 返回最快的一个
// Promise.any - 返回最快成功的（忽略拒绝）
// Promise.allSettled - 所有 settled 后返回全部结果
```

### 面试高频问题

### Q1：Promise 的状态有哪些？什么是 Promise 链？

**答**：

**Promise 三种状态**：

1. `pending`（进行中）- 初始状态
2. `fulfilled`（已成功）- 操作成功完成
3. `rejected`（已失败）- 操作失败

**Promise 链**：Promise 的 `.then()` 和 `.catch()` 返回新的 Promise，支持链式调用。

```javascript
fetchData()
    .then((data) => processData(data))
    .then((result) => saveResult(result))
    .catch((error) => handleError(error))
    .finally(() => cleanup());
```

### Q2：Promise.all 和 Promise.race 的区别？

**答**：

| 方法               | 成功条件     | 失败条件 | 返回值         |
| ------------------ | ------------ | -------- | -------------- |
| Promise.all        | 全部成功     | 任一失败 | 所有结果的数组 |
| Promise.allSettled | 全部 settled | 无       | 所有结果的数组 |
| Promise.race       | 任一 settled | 无       | 最快的那个结果 |
| Promise.any        | 任一成功     | 全部失败 | 最快成功的那个 |

**应用场景**：

- `Promise.all`：并行执行多个请求，全部成功后再处理（如加载页面所有资源）
- `Promise.race`：超时处理，如 `Promise.race([fetch(url), timeout()])`

---

## async/await

### 核心特性

```javascript
// async 函数返回 Promise
async function fn() {
    return 1; // 等同于 Promise.resolve(1)
}

// await 等待 Promise
async function fetchData() {
    try {
        const res = await fetch("/api/data");
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

// 并行执行
async function parallel() {
    const [res1, res2] = await Promise.all([fetch("/api1"), fetch("/api2")]);
    return [res1, res2];
}
```

### 面试高频问题

### Q1：async/await 和 Promise 的区别？如何选择？

**答**：

**async/await 优势**：

1. 代码更简洁直观，避免回调地狱
2. 调试方便，可以像同步代码一样打断点
3. 错误处理统一用 try/catch

**Promise 优势**：

1. 返回新的 Promise，支持链式调用
2. 可以并行执行多个 Promise（Promise.all）
3. 更适合事件流处理

**如何选择**：

- 单个异步操作：两者皆可，async/await 更简洁
- 多个并行操作：用 Promise.all + async/await
- 需要取消/中断：用 Promise + AbortController

### Q2：async/await 的错误处理方式？

**答**：

```javascript
// 方式1：try/catch
async function fn1() {
    try {
        const data = await fetchData();
        return data;
    } catch (err) {
        console.error(err);
    }
}

// 方式2： Promise.catch
async function fn2() {
    return await fetchData().catch((err) => {
        console.error(err);
    });
}

// 方式3：全局错误（未被捕获的 reject）
window.addEventListener("unhandledrejection", (event) => {
    console.error("未处理的 Promise 错误:", event.reason);
});
```

---

## Class

### 核心特性

```javascript
// 类的定义
class Person {
    // 构造函数
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // 方法
    greet() {
        return `Hello, I'm ${this.name}`;
    }

    // 静态方法
    static create(name, age) {
        return new Person(name, age);
    }

    // getter/setter
    get info() {
        return `${this.name}, ${this.age}`;
    }

    // 私有字段（ES2022）
    #secret = "private";
}

// 继承
class Student extends Person {
    constructor(name, age, grade) {
        super(name, age); // 必须先调用 super
        this.grade = grade;
    }

    greet() {
        return super.greet() + `, grade: ${this.grade}`;
    }
}

const student = new Student("zs", 18, "A");
student instanceof Person; // true
```

### 面试高频问题

### Q1：Class 的原理是什么？

**答**：Class 本质上是构造函数+原型链的语法糖。

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    greet() {
        return `Hi, ${this.name}`;
    }
}

// 等价于
function Person(name) {
    this.name = name;
}
Person.prototype.greet = function () {
    return `Hi, ${this.name}`;
};
```

### Q2：Class 和构造函数的区别？

**答**：

| 特性            | Class                  | 构造函数           |
| --------------- | ---------------------- | ------------------ |
| 语法            | 简洁语法糖             | 传统写法           |
| 方法不可枚举    | ✅ 默认不可枚举        | ❌ 需要手动设置    |
| 必须用 new 调用 | ✅                     | ✅                 |
| 原型            | class.prototype        | function.prototype |
| 继承            | extends 关键字         | 原型链             |
| 提升            | 类似 let（暂时性死区） | 变量提升           |

---

## 模块化

### 核心特性

```javascript
// 导出
// 命名导出（多个）
export const name = "zs";
export function fn() {}

// 默认导出（每个模块一个）
export default class Person {}

// 统一导出
export { name, fn };

// 导入
import { name, fn } from "./module.js";
import Person from "./module.js";
import * as module from "./module.js"; // 命名空间导入
import { name as nickname } from "./module.js"; // 重命名
```

### 面试高频问题

### Q1：ES Module 和 CommonJS 的区别？

**答**：

| 特性       | ES Module              | CommonJS               |
| ---------- | ---------------------- | ---------------------- |
| 语法       | import/export          | require/module.exports |
| 加载时机   | 编译时确定（静态）     | 运行时确定（动态）     |
| 值拷贝     | 值引用                 | 值拷贝                 |
| 循环引用   | 支持，但可能 undefined | 支持                   |
| 浏览器支持 | 原生支持               | 需要打包               |
| 顶層 this  | undefined              | module.exports         |

```javascript
// CommonJS
let count = 0;
setTimeout(() => count++, 100);
setTimeout(() => console.log(count), 200); // 0（值拷贝）

// ES Module
let count = 0;
setTimeout(() => count++, 100);
setTimeout(() => console.log(count), 200); // 1（值引用）
```

### Q2：为什么 ES Module 可以 Tree Shaking？

**答**：因为 ES Module 在**编译时**就能确定导入导出关系，打包工具（如 webpack、rollup）可以通过静态分析确定哪些导出被使用，哪些没有使用，从而移除未使用的代码。

---

## Proxy 和 Reflect

### 核心特性

```javascript
// Proxy - 代理对象
const proxy = new Proxy(target, {
    get(target, prop, receiver) {
        console.log(`getting ${prop}`);
        return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
        console.log(`setting ${prop} = ${value}`);
        return Reflect.set(target, prop, value, receiver);
    },
    has(target, prop) {
        // in 操作符
        return Reflect.has(target, prop);
    },
    deleteProperty(target, prop) {
        // delete 操作符
        return Reflect.deleteProperty(target, prop);
    },
});

// Reflect - 反射对象，提供操作对象的默认行为
Reflect.get({ name: "zs" }, "name"); // 'zs'
Reflect.set({ name: "zs" }, "name", "ls");
Reflect.has({ name: "zs" }, "name"); // true
Reflect.deleteProperty({ name: "zs" }, "name");
```

### 面试高频问题

### Q1：Proxy 能实现哪些功能？

**答**：

1. **数据响应式**：Vue 3 的响应式原理
2. **属性访问控制**：控制属性的读写删除
3. **函数参数验证**
4. **负数数组索引**：如 `arr[-1]` 获取最后一个元素
5. **日志系统**：自动记录属性访问
6. **访问限制**：如只读属性

```javascript
// 响应式实现
function reactive(obj) {
    return new Proxy(obj, {
        get(target, key) {
            track(target, key);
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            trigger(target, key);
            return true;
        },
    });
}

// 只读属性
function readonly(obj) {
    return new Proxy(obj, {
        set() {
            throw new Error("Read only!");
        },
        deleteProperty() {
            throw new Error("Read only!");
        },
    });
}
```

---

## 迭代器和生成器

### 核心特性

```javascript
// 迭代器
const iterator = {
    data: [1, 2, 3],
    index: 0,
    next() {
        if (this.index < this.data.length) {
            return { value: this.data[this.index++], done: false };
        }
        return { value: undefined, done: true };
    },
};

// 可迭代对象
const iterable = {
    data: [1, 2, 3],
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                if (index < this.data.length) {
                    return { value: this.data[index++], done: false };
                }
                return { value: undefined, done: true };
            },
        };
    },
};

// 生成器
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}

const g = gen();
g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
g.next(); // { value: 3, done: false }
g.next(); // { value: undefined, done: true }

// 生成器实现 async/await
function asyncToGenerator(genFn) {
    return function (...args) {
        const gen = genFn.apply(this, args);
        return new Promise((resolve, reject) => {
            function step(key, arg) {
                let result;
                try {
                    result = gen[key](arg);
                } catch (err) {
                    return reject(err);
                }
                const { value, done } = result;
                if (done) {
                    return resolve(value);
                }
                Promise.resolve(value).then(
                    (val) => step("next", val),
                    (err) => step("throw", err),
                );
            }
            step("next");
        });
    };
}
```

### 面试高频问题

### Q1：for...of 和 for...in 的区别？

**答**：

| 特性     | for...of                              | for...in         |
| -------- | ------------------------------------- | ---------------- |
| 迭代对象 | 可迭代对象（Array, Set, Map, String） | 对象（枚举属性） |
| 值       | 值                                    | 键/index         |
| 继承属性 | 不迭代                                | 会迭代           |
| 数组     | 迭代值                                | 迭代索引         |

```javascript
const arr = [1, 2, 3];
for (const i in arr) {
    console.log(i);
} // 0, 1, 2
for (const i of arr) {
    console.log(i);
} // 1, 2, 3
```

---

## 扩展运算符和剩余参数

### 核心特性

```javascript
// 扩展运算符
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4]

const obj1 = { a: 1 };
const obj2 = { b: 2 };
const objMerged = { ...obj1, ...obj2 }; // { a: 1, b: 2 }

// 函数调用展开
Math.max(...[1, 5, 3]); // 5

// 剩余参数
function fn(a, b, ...rest) {
    console.log(a, b); // 1, 2
    console.log(rest); // [3, 4, 5]
}
fn(1, 2, 3, 4, 5);

// 解构剩余
const [first, ...remaining] = [1, 2, 3, 4]; // first=1, remaining=[2,3,4]
const { name, ...others } = { name: "zs", age: 18, gender: "male" };
// name='zs', others={ age: 18, gender: 'male' }
```

### Q1：扩展运算符和剩余参数的区别？

**答**：

- **扩展运算符（spread）**：将数组/对象展开为单独元素
- **剩余参数（rest）**：将多个参数合并为数组

```javascript
// 扩展运算符 - 打包
const arr = [1, 2, 3];
console.log(...arr); // 1 2 3

// 剩余参数 - 解包
function fn(...args) {
    console.log(args); // [1, 2, 3]
}
fn(1, 2, 3);
```

---

## 其他重要特性

### 可选链操作符 `?.`

```javascript
const obj = { user: { profile: { name: "zs" } } };

// 传统写法
const name = obj && obj.user && obj.user.profile && obj.user.profile.name;

// 可选链
const name = obj?.user?.profile?.name;
obj?.user?.getName?.(); // 安全的函数调用

// 数组可选链
arr?.[0]?.name;

// 空值合并 ??
const value = obj?.name ?? "default"; // name 为 null/undefined 时使用默认值
```

### 逻辑赋值运算符

```javascript
// ||=
let a = null;
a ||= 1; // a = 1

// &&=
let b = 5;
b &&= 10; // b = 10

// ??=
let c = undefined;
c ??= "default"; // c = 'default'
```

### 数字扩展

```javascript
// 二进制和八进制字面量
0b1010; // 二进制 10
0o755; // 八进制 493

// Number.isNaN / isFinite / isInteger
Number.isInteger(3.0); // true
Number.isSafeInteger(Math.pow(2, 53)); // false

// 安全整数
Number.MAX_SAFE_INTEGER;
Number.MIN_SAFE_INTEGER;

// Math 扩展
Math.trunc(4.5); // 4，去除小数部分
Math.sign(-5); // -1，判断正负零
Math.cbrt(27); // 3，立方根
```

### 字符串扩展

```javascript
// 遍历
for (const c of "hello") {
    console.log(c);
}

// includes / startsWith / endsWith
"hello".includes("ell"); // true
"hello".startsWith("hel"); // true
"hello".endsWith("llo"); // true

// repeat
"ha".repeat(3); // 'hahaha'

// padStart / padEnd
"5".padStart(3, "0"); // '005'
"5".padEnd(3, "0"); // '500'

// 模板字符串标签
String.raw`\n`; // '\\n'，原始字符串
```

### 数组扩展

```javascript
// find / findIndex
[1, 2, 3].find((x) => x > 1); // 2
[1, 2, 3].findIndex((x) => x > 1); // 1

// includes
[1, 2, 3].includes(1); // true（使用 SameValueZero）

// flat / flatMap
[1, [2, [3]]].flat(2); // [1, 2, 3]
[1, 2, 3].flatMap((x) => [x, x * 2]); // [1, 2, 2, 4, 3, 6]

// from / of
Array.from("hello"); // ['h', 'e', 'l', 'l', 'o']
Array.of(1, 2, 3); // [1, 2, 3]

// fill
[1, 2, 3].fill(0, 1, 2); // [1, 0, 3]
```

### 对象扩展

```javascript
// Object.assign
Object.assign({}, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }

// Object.keys/values/entries
Object.keys({ a: 1, b: 2 }); // ['a', 'b']
Object.values({ a: 1, b: 2 }); // [1, 2]
Object.entries({ a: 1, b: 2 }); // [['a', 1], ['b', 2]]

// Object.getOwnPropertyDescriptors
Object.getOwnPropertyDescriptors({
    get foo() {
        return 1;
    },
});

// 对象属性简写
const name = "zs";
const obj = { name }; // { name: 'zs' }

// 方法简写
const obj = {
    greet() {
        return "hi";
    },
};

// 计算属性名
const key = "name";
const obj = { [key]: "zs" };

// __proto__
Object.setPrototypeOf({}, null); // 设置原型
```

---

## 面试综合问题

### Q1：ES6 带来了哪些开发体验的提升？

**答**：

1. **模块化**：原生支持模块化，避免全局污染
2. **类语法**：面向对象编程更直观
3. **异步处理**：Promise + async/await 解决回调地狱
4. **语法糖**：箭头函数、解构赋值、模板字符串让代码更简洁
5. **新数据结构**：Set、Map 提供了更合适的数据组织方式
6. **新特性**：Proxy、Reflect 提供了更强大的元编程能力

### Q2：ES6 对前端工程化的影响？

**答**：

1. **模块化规范统一**：ES Module 成为浏览器原生支持的模块规范
2. **构建工具兴起**：Webpack、Rollup 等工具利用 ES Module 进行 Tree Shaking
3. **开发体验改善**：Less 编译、ES6 转 ES5 等前置工作由工具自动完成
4. **代码质量提升**：const/let 减少bug，async/await 让异步代码更可读
5. **TypeScript 普及**：ES6 模块系统让 TS 编译更简单

### Q3：如何理解 ES6 的"编译时确定"特性？

**答**：ES Module 在编译时就能确定导入导出关系，这意味着：

1. **静态分析可行**：打包工具可以分析依赖树，进行 Tree Shaking
2. **循环引用处理**：可以提前发现循环依赖
3. **性能优化**：浏览器可以在解析 HTML 之前就开始下载模块
4. **代码分割**：更精确的进行代码分割和懒加载
