# new 操作符实现

## 描述

`new` 操作符用于创建构造函数的实例对象。理解 new 的实现原理对于深入理解 JavaScript 面向对象编程至关重要。

## new 操作符做了什么

1. 创建了一个全新的空对象
2. 设置原型链，将新对象的 `__proto__` 指向构造函数的 `prototype`
3. 执行构造函数，绑定 this 为新创建的对象
4. 如果构造函数有返回值且是对象，则返回该对象；否则返回新创建的对象

## 实现代码

```js
function myNew(constructor, ...args) {
    // 1. 创建一个新对象
    const obj = {};

    // 2. 设置原型链
    Object.setPrototypeOf(obj, constructor.prototype);

    // 3. 执行构造函数
    const result = constructor.apply(obj, args);

    // 4. 返回结果
    // 如果构造函数返回的是对象，则返回该对象；否则返回新创建的对象
    return result instanceof Object ? result : obj;
}
```

## 简化版本

```js
function myNew(constructor, ...args) {
    const obj = Object.create(constructor.prototype);
    const result = constructor.apply(obj, args);
    return result instanceof Object ? result : obj;
}
```

## 使用示例

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

const person = myNew(Person, '张三', 18);
console.log(person.name);   // '张三'
console.log(person.age);    // 18
console.log(person.greet()); // 'Hello, I'm 张三'
console.log(person instanceof Person); // true
```

## 手动实现版本对比

| 步骤 | 说明 | 代码 |
|------|------|------|
| 1 | 创建空对象 | `{}` 或 `Object.create()` |
| 2 | 设置原型链 | `Object.setPrototypeOf(obj, constructor.prototype)` |
| 3 | 执行构造函数 | `constructor.apply(obj, args)` |
| 4 | 返回结果 | 判断返回值类型 |

## 注意事项

1. **构造函数返回值**：如果构造函数显式返回一个对象，则 new 表达式返回该对象；如果返回原始值，则忽略，仍返回新创建的对象
2. **原型链**：新对象的原型指向构造函数的原型，这使得实例可以访问原型上的属性和方法
3. **instanceof**：由于原型链的设置，`instance instanceof Constructor` 会返回 true