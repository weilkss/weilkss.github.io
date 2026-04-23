# compose / pipe 实现

## 描述

组合函数（compose）将多个函数组合成一个从右到左执行的函数。管道函数（pipe）则是从左到右执行。

## compose 实现

### 核心原理

```
compose(f, g, h) 等价于 (...args) => f(g(h(...args)))
```

### 实现代码

#### 基础版

```js
function compose(...fns) {
    if (fns.length === 0) {
        return arg => arg;
    }

    if (fns.length === 1) {
        return fns[0];
    }

    return fns.reduce((prevFn, nextFn) => {
        return (...args) => prevFn(nextFn(...args));
    });
}
```

#### 完整版（支持调试和错误处理）

```js
function compose(...fns) {
    if (fns.length === 0) {
        return arg => arg;
    }

    return fns.reduce((prevFn, nextFn) => {
        return (...args) => {
            try {
                return prevFn(nextFn(...args));
            } catch (err) {
                console.error('Compose error:', err);
                throw err;
            }
        };
    });
}
```

## pipe 实现

### 核心原理

```
pipe(f, g, h) 等价于 (...args) => h(g(f(...args)))
```

### 实现代码

```js
function pipe(...fns) {
    if (fns.length === 0) {
        return arg => arg;
    }

    if (fns.length === 1) {
        return fns[0];
    }

    return fns.reduceRight((prevFn, nextFn) => {
        return (...args) => nextFn(prevFn(...args));
    });
}
```

## 使用示例

```js
// 示例函数
const double = x => x * 2;
const square = x => x * x;
const addTen = x => x + 10;

// compose：从右到左执行
// 先 square(2) = 4，再 double(4) = 8
const composed = compose(double, square);
console.log(composed(2)); // 8

// 多个函数组合
// 先 addTen(2) = 12，再 square(12) = 144，再 double(144) = 288
const composed2 = compose(double, square, addTen);
console.log(composed2(2)); // 288

// pipe：从左到右执行
const piped = pipe(double, square, addTen);
console.log(piped(2)); // 18
// 先 double(2) = 4，再 square(4) = 16，再 addTen(16) = 26
```

## 实际应用

### 表单验证

```js
const trim = str => str.trim();
const isNonEmpty = str => str.length > 0;
const isEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

const validateEmail = compose(
    email => ({ isValid: email.isValid, value: email.value }),
    email => ({ ...email, isValid: email.isValid && isEmail(email.value) }),
    email => ({ ...email, isValid: isNonEmpty(email.value) }),
    value => ({ value, isValid: true })
);

console.log(validateEmail('  user@example.com  '));
// { value: 'user@example.com', isValid: true }
```

### 中间件模式

```js
const middleware1 = next => config => {
    console.log('middleware1 start');
    const result = next(config);
    console.log('middleware1 end');
    return result;
};

const middleware2 = next => config => {
    console.log('middleware2 start');
    const result = next(config);
    console.log('middleware2 end');
    return result;
};

const handler = config => {
    console.log('handler executed:', config);
    return 'response';
};

const composed = compose(middleware1, middleware2)(handler);
composed({ data: 'test' });
// middleware2 start
// middleware1 start
// handler executed: { data: 'test' }
// middleware1 end
// middleware2 end
```

---

## compose vs pipe 对比

| 特性 | compose | pipe |
|------|---------|------|
| 执行顺序 | 从右到左 | 从左到右 |
| 可读性 | 更符合数学概念 f(g(x)) | 更符合流水线 |
| 使用场景 | 函数式编程 | 数据转换流水线 |