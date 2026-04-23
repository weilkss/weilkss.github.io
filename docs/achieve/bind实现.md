# call、apply、bind 实现

## 三者区别

| 特性 | call | apply | bind |
|------|------|-------|------|
| **调用方式** | 立即执行 | 立即执行 | 返回新函数 |
| **参数形式** | 逐个传递 `fn.call(obj, a, b)` | 数组形式 `fn.apply(obj, [a, b])` | 逐个传递 `fn.bind(obj, a, b)` |
| **返回值** | 函数执行结果 | 函数执行结果 | 新函数 |
| **用途** | 临时改变 this，调用继承方法 | 临时改变 this，处理数组参数 | 永久绑定 this，预设参数 |

**核心区别**：
- **call/apply**：立即调用原函数，调用后 this 不再改变
- **bind**：返回新函数，新函数的 this 永久绑定，不会因调用方式改变

---

## call 实现

### 核心原理

1. 将函数设为对象的临时方法
2. 调用该方法
3. 删除临时方法

### 实现代码

```js
Function.prototype.myCall = function(context, ...args) {
    // context 为 null 或 undefined 时，指向 window
    context = context || window;

    // 使用 Symbol 确保属性名唯一
    const fn = Symbol('fn');

    // 将函数设为对象的临时方法
    context[fn] = this;

    // 调用该方法，传入参数
    const result = context[fn](...args);

    // 删除临时方法
    delete context[fn];

    return result;
};
```

### 使用示例

```js
const obj = {
    name: '张三'
};

function greet(greeting, punctuation) {
    return greeting + ', ' + this.name + punctuation;
}

console.log(greet.myCall(obj, 'Hello', '!')); // 'Hello, 张三!'
console.log(greet.call(obj, 'Hi', '~'));      // 'Hi, 张三~'
```

---

## apply 实现

### 核心原理

与 call 完全相同，唯一的区别是参数以数组形式传递。

### 实现代码

```js
Function.prototype.myApply = function(context, args) {
    // context 为 null 或 undefined 时，指向 window
    context = context || window;

    // 使用 Symbol 确保属性名唯一
    const fn = Symbol('fn');

    // 将函数设为对象的临时方法
    context[fn] = this;

    // 调用该方法，传入数组参数
    const result = args ? context[fn](...args) : context[fn]();

    // 删除临时方法
    delete context[fn];

    return result;
};
```

### 使用示例

```js
const obj = {
    name: '张三'
};

function greet(greeting, punctuation) {
    return greeting + ', ' + this.name + punctuation;
}

console.log(greet.myApply(obj, ['Hello', '!'])); // 'Hello, 张三!'
console.log(greet.apply(obj, ['Hi', '~']));      // 'Hi, 张三~'

// 数组最大值
const numbers = [1, 5, 3, 8, 2];
console.log(Math.max.apply(null, numbers)); // 8
```

---

## bind 实现

### 描述

`Function.prototype.bind()` 方法创建一个新的函数，在调用时将其 this 绑定到指定的值。bind 返回一个新函数，不会立即执行。

### 核心原理

1. 返回一个新函数
2. 新函数的 this 被绑定到指定的值
3. 可以预设部分参数（偏函数/柯里化）
4. 当新函数被作为构造函数调用时，this 的绑定会被忽略

### 实现代码

#### 基础版本

```js
Function.prototype.myBind = function(context, ...args) {
    const fn = this;
    return function(...args2) {
        return fn.apply(context, [...args, ...args2]);
    };
};
```

#### 完整版本（支持 new 调用）

```js
Function.prototype.myBind = function(context, ...args) {
    const fn = this;

    const bound = function(...args2) {
        // 当作为构造函数调用时，忽略 context
        // 通过 instanceof 检查是否是通过 new 调用的
        return fn.apply(
            this instanceof bound ? this : context,
            [...args, ...args2]
        );
    };

    // 维护原型链
    bound.prototype = Object.create(fn.prototype);

    return bound;
};
```

### 使用示例

```js
const obj = {
    name: '张三',
    greet: function(greeting) {
        return `${greeting}, ${this.name}`;
    }
};

const sayHello = obj.greet.myBind(obj, 'Hello');
console.log(sayHello()); // 'Hello, 张三'

// 预设参数
const sayHi = obj.greet.myBind(obj);
console.log(sayHi('Hi')); // 'Hi, 张三'

// 作为构造函数调用
function Person(name) {
    this.name = name;
}

const BoundPerson = Person.myBind(null, '默认名字');
const person = new BoundPerson();
console.log(person.name); // '默认名字'
```

---

## 面试追问点

### 三者选择场景

| 场景 | 推荐方法 | 原因 |
|------|---------|------|
| 临时改变 this，立即执行 | call / apply | 立即调用 |
| 需要处理数组参数 | apply | 参数天然是数组 |
| 需要预设参数 | bind | 返回新函数，可预设 |
| 事件处理函数 | bind | 确保 this 稳定 |

### 性能考虑

- 三者性能差异在实际开发中可忽略不计
- 现代引擎已对它们做了大量优化

### 箭头函数与 this

- 箭头函数没有自己的 this，无法被 call/apply/bind 绑定
- 箭头函数的 this 始终指向定义时的外层作用域

```js
const obj = {
    name: '张三',
    greet: () => {
        return `Hello, ${this.name}`; // this 不会是 obj
    }
};
```