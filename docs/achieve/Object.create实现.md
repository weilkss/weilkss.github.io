# Object.create 实现

## 描述

`Object.create()` 创建一个新对象，使用现有的对象作为新对象的原型。

## 原型链关系

```
object.__proto__ === prototype
```

## 实现代码

### 基础版

```js
function myCreate(proto) {
    if (proto === null || typeof proto !== "object") {
        throw new TypeError("Object prototype may only be an Object or null");
    }

    function F() {}
    F.prototype = proto;
    return new F();
}
```

### 完整版（支持属性描述符）

```js
function myCreate(proto, properties) {
    if (proto === null || typeof proto !== "object") {
        throw new TypeError("Object prototype may only be an Object or null");
    }

    function F() {}
    F.prototype = proto;

    const obj = new F();

    if (properties !== undefined) {
        Object.defineProperties(obj, properties);
    }

    return obj;
}
```

## 使用示例

```js
// 原型对象
const personProto = {
    greet() {
        return `Hello, I'm ${this.name}`;
    },
};

// 创建实例
const person = myCreate(personProto);
person.name = "张三";
console.log(person.greet()); // "Hello, I'm 张三"
console.log(Object.getPrototypeOf(person) === personProto); // true

// 带属性
const personWithAge = myCreate(personProto, {
    age: {
        value: 18,
        writable: true,
        enumerable: true,
        configurable: true,
    },
});
console.log(personWithAge.age); // 18
```

## 与 new Object() 和 {} 的区别

| 方式                   | 原型             | 特点                   |
| ---------------------- | ---------------- | ---------------------- |
| `{}`                   | Object.prototype | 字面量创建             |
| `new Object()`         | Object.prototype | 构造函数               |
| `Object.create(proto)` | 自定义原型       | 可创建没有原型链的对象 |

```js
// 普通对象的原型链
const obj = {};
console.log(Object.getPrototypeOf(obj) === Object.prototype); // true

// 使用 Object.create(null) 创建无原型对象
const pureObj = Object.create(null);
console.log(Object.getPrototypeOf(pureObj)); // null
console.log(pureObj.hasOwnProperty); // undefined

// 实现类继承
function Parent(name) {
    this.name = name;
}
Parent.prototype.getName = function () {
    return this.name;
};

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

// 原型继承
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
Child.prototype.getAge = function () {
    return this.age;
};

const child = new Child("张三", 18);
console.log(child.getName()); // '张三'
console.log(child.getAge()); // 18
console.log(child instanceof Child); // true
console.log(child instanceof Parent); // true
```

## 面试追问点

### Object.create(null) 的应用场景

1. **纯数据对象**：不需要继承任何属性
2. **作为 Map 使用**：避免原型属性干扰
3. **安全考虑**：防止原型污染攻击

```js
// 作为 Map 使用（ES6 之前）
const map = Object.create(null);
map.name = "test";
// 不会有 hasOwnProperty 等干扰
```

### Object.create vs new

```js
// new Object() 实际上内部也是用 Object.create
// 但 new Object() 会继承 Object.prototype
// Object.create 可以指定任意原型
```
