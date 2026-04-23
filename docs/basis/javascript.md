# JavaScript 深入理解

## 1. 强制类型转换

### 1.1 理论基础

JavaScript 是弱类型语言，在运算过程中会自动进行类型转换。强制类型转换分为**显式转换**和**隐式转换**两种形式。

**为什么需要类型转换？**
- 用户输入的数据通常是字符串
- 不同数据类型之间进行运算需要统一
- 某些操作符会触发自动类型转换

### 1.2 显式转换详解

```js
// ========== Number() 转换规则 ==========
Number("123")        // 123 - 纯数字字符串
Number("12.5")       // 12.5 - 浮点数字符串
Number("")           // 0 - 空字符串
Number("  ")        // 0 - 空白字符
Number(true)        // 1 - 布尔值 true
Number(false)       // 0 - 布尔值 false
Number(null)        // 0 - null 值
Number(undefined)   // NaN - undefined 无法转换
Number("123abc")    // NaN - 包含非数字字符
Number({a:1})       // NaN - 对象无法直接转换

// ========== parseInt() 转换规则 ==========
// 与 Number() 不同，parseInt 会从左到右解析，遇到非数字停止
parseInt("123")      // 123
parseInt("12.5")     // 12 - 遇到小数点停止
parseInt("12.5px")   // 12 - 遇到字母停止
parseInt("abc")      // NaN - 开头就是非数字
parseInt("12abc")    // 12
parseInt("  123")    // 123 - 忽略前导空白

// 进制转换（重要）
parseInt("0x10")     // 16 - 十六进制
parseInt("010")      // 10 - 八进制（部分浏览器）
parseInt("10", 2)    // 2 - 二进制
parseInt("10", 8)    // 8 - 八进制
parseInt("10", 16)   // 16 - 十六进制
parseInt("FF", 16)   // 255

// ========== parseFloat() 转换规则 ==========
parseFloat("12.5")    // 12.5
parseFloat("12.5px")  // 12.5
parseFloat("12.5.5")  // 12.5 - 只解析第一个小数点
parseFloat("12.")    // 12
parseFloat(".5")     // 0.5
parseFloat("12.5e2")  // 1250 - 科学计数法

// ========== String() 转换 ==========
String(123)          // "123"
String(true)         // "true"
String(false)        // "false"
String(null)         // "null"
String(undefined)    // "undefined"
String({a:1})        // "[object Object]"
String([1,2,3])      // "1,2,3"
String([])           // ""
String([1])          // "1"

// ========== Boolean() 转换 ==========
// falsy 值（转为 false）
Boolean(0)           // false
Boolean("")          // false
Boolean(null)        // false
Boolean(undefined)    // false
Boolean(NaN)         // false
Boolean(false)       // false

// truthy 值（转为 true）
Boolean(1)           // true
Boolean("abc")       // true
Boolean("0")         // true - 字符串 "0" 是 truthy
Boolean([])          // true - 空数组是 truthy
Boolean({})          // true - 空对象是 truthy
Boolean(function(){}) // true - 函数是 truthy
```

### 1.3 隐式转换详解

```js
// ========== 加法运算 + ==========
// 规则：一边是字符串，另一边也会转为字符串
"1" + 2              // "12" - 数字被转为字符串
1 + "2"              // "12"
true + "1"           // "true1" - 布尔被转为字符串
"5" + [1,2,3]       // "51,2,3" - 数组被转为字符串

// 特殊情况：两边都是数字或可转为数字的值时，执行加法
1 + 2                // 3
1 + true            // 2 - true 转为 1
1 + false           // 1 - false 转为 0
1 + null            // 1 - null 转为 0
1 + undefined       // NaN - undefined 转为 NaN

// ========== 其他算术运算 - * / % ==========
// 规则：转为数字，执行算术运算
"5" - 2             // 3 - 字符串转为数字
"5" * "2"           // 10
"5" / "2"           // 2.5
"5" % "2"           // 1
"5" - "a"           // NaN

// ========== 宽松相等 == 的转换规则 ==========
// 1. null 和 undefined 相等
null == undefined    // true - 特殊规则

// 2. 数字 vs 字符串，字符串转为数字
1 == "1"            // true
1 == "1.0"          // true
1 == "1.5"          // false

// 3. 布尔 vs 其他，布尔转为数字
true == 1           // true
true == "1"         // true
false == 0          // true
false == ""         // true

// 4. 对象 vs 基本类型，对象转为基本类型
[1] == 1            // true - [1]转为"1"再转为1
[1] == "1"         // true - [1]转为"1"
[1,2] == "1,2"     // true
({}).toString()    // "[object Object]"
{} == "[object Object]" // true

// ========== 容易出错的比较 ==========
[] == false         // true
// [] == false 详解：
// [] 先转为 ""，false 转为 0
// "" == 0
// "" 转为 0
// 0 == 0 -> true

"" == false         // true
0 == false          // true
false == null       // false - false 只和 0、"" 相等
false == undefined  // false

// ========== 严格相等 === ==========
// 不进行任何类型转换
1 === "1"           // false
true === 1          // false
null === undefined  // false
```

### 1.4 Object.is() 的特殊性

```js
// Object.is() 类似 ===，但有两个例外
Object.is(NaN, NaN)         // true - NaN 和自身相等
Object.is(0, -0)           // false - 区分 +0 和 -0

// 对比 ===
NaN === NaN                // false
0 === -0                   // true
```

### 1.5 实际应用场景

```js
// 场景1：表单输入验证
function validateNumber(input) {
    const num = Number(input);
    if (Number.isNaN(num)) {
        return "请输入有效数字";
    }
    return num;
}

// 场景2：安全比较
function safeEqual(a, b) {
    if (typeof a !== typeof b) return false;
    return Object.is(a, b);
}

// 场景3：类型转换的坑
// 不要用 == 判断 null
function isNull(val) {
    return val === null;  // 用 === 而非 ==
}

// 场景4：金额计算（避免浮点数问题）
function formatPrice(price) {
    // 转为整数计算（分）
    const cents = Math.round(price * 100);
    return cents / 100;
}
```

### 1.6 问题与解决方案

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 0.1 + 0.2 !== 0.3 | IEEE 754 浮点数精度 | 使用整数或 toFixed() |
| [] == false 为 true | 数组转换规则复杂 | 使用 === 或 Array.isArray |
| "1" == 1 为 true | == 会自动转换 | 优先使用 === |
| typeof null === "object" | 历史遗留 bug | 用 === null 判断 |

### 1.7 类型转换原理深入分析

#### 1.7.1 ToPrimitive 抽象操作

JavaScript 的类型转换核心依赖于 **ToPrimitive** 抽象操作，它将对象转换为基本类型值：

```js
/**
 * ToPrimitive(input, preferredType?)
 * @param input 要转换的值
 * @param preferredType 可选：Number 或 String，指定转换的"期望"类型
 *
 * 转换规则：
 * 1. 如果 input 已经是基本类型，直接返回
 * 2. 调用 input.valueOf()，如果返回基本类型则返回
 * 3. 调用 input.toString()，如果返回基本类型则返回
 * 4. 抛出 TypeError
 */

// 示例：[] 的转换过程
[].valueOf()   // [] - 不是基本类型
[].toString()  // "" - 基本类型，返回

// 示例：{} 的转换过程
({}).valueOf()   // {} - 不是基本类型
({}).toString()  // "[object Object]" - 基本类型，返回
```

#### 1.7.2 四则运算类型转换规则

```js
/**
 * 加法运算的两种模式：
 * 1. 字符串拼接模式：任一操作数是字符串
 * 2. 数学加法模式：两边都是数字或可转为数字的值
 */

// 字符串拼接优先级更高
"1" + 2       // "12" - 字符串拼接
1 + "2"       // "12" - 字符串拼接
true + "1"    // "true1" - 布尔转字符串

// 数学加法模式
1 + true      // 2 - true -> 1
1 + false     // 1 - false -> 0
1 + null      // 1 - null -> 0
1 + undefined // NaN - undefined -> NaN

// 特殊场景：数组的 + 运算
[] + 1        // "1" - [] -> "" -> 0, 但 +1 会触发字符串拼接 -> "1"
[1] + 1       // "11" - [1] -> "1"
[1,2] + 1     // "1,21" - [1,2] -> "1,2"
```

#### 1.7.3 比较运算的类型转换

```js
/**
 * 关系比较（> < >= <=）的转换规则：
 * 1. 两边都是字符串：按字典序比较
 * 2. 任一是数字：另一方转为数字
 * 3. 任一是布尔值：布尔转为数字
 */

// 字符串比较的陷阱
"10" > "2"    // false - 按字符比较，"1" < "2"
"10" > 2      // true - 转为数字比较

// NaN 的比较特性
NaN > 0       // false
NaN < 0       // false
NaN >= 0      // false
NaN <= 0      // false
NaN == NaN    // false - NaN 是唯一不等于自身的值

// 包装对象的比较
new Number(10) > 9   // true - 包装对象转为数字
new String("10") > "9" // false - 字符串比较
```

### 1.8 实际应用场景深入

#### 1.8.1 表单数据处理

```js
/**
 * 场景：电商网站的商品搜索和筛选
 * 用户输入可能是：字符串、数字、数组或空值
 */

// 搜索价格区间处理
function parsePriceRange(priceStr) {
    if (!priceStr) return { min: 0, max: Infinity };

    // 处理 "100-200" 格式
    if (typeof priceStr === 'string' && priceStr.includes('-')) {
        const [min, max] = priceStr.split('-').map(Number);
        return {
            min: Number.isNaN(min) ? 0 : min,
            max: Number.isNaN(max) ? Infinity : max
        };
    }

    // 处理单个数字
    const price = Number(priceStr);
    if (!Number.isNaN(price)) {
        return { min: price, max: price };
    }

    return { min: 0, max: Infinity };
}

// 使用示例
parsePriceRange("100-200");  // { min: 100, max: 200 }
parsePriceRange("50");       // { min: 50, max: 50 }
parsePriceRange("");         // { min: 0, max: Infinity }
parsePriceRange("abc");      // { min: 0, max: Infinity }
```

#### 1.8.2 API 数据格式化

```js
/**
 * 场景：从后端获取的用户数据需要在前端展示
 * 后端可能返回各种格式的数据
 */

// 安全地获取嵌套属性
function getNestedValue(obj, path, defaultValue) {
    const value = path.split('.').reduce((acc, key) => {
        return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);

    return value ?? defaultValue;
}

// 数据类型统一处理
function formatUserData(rawData) {
    return {
        id: Number(rawData.id) || 0,
        name: String(rawData.name || ''),
        age: parseInt(rawData.age, 10) || 0,
        balance: parseFloat(rawData.balance) || 0.00,
        isActive: Boolean(rawData.isActive),
        tags: Array.isArray(rawData.tags) ? rawData.tags : []
    };
}

// 金额精度处理（金融系统必备）
function formatCurrency(amount) {
    // 转为整数计算（分），避免浮点数精度问题
    const cents = Math.round(Number(amount) * 100);
    const yuan = cents / 100;
    return yuan.toFixed(2);
}

formatCurrency(0.1 + 0.2);    // "0.30"
formatCurrency(19.99);       // "19.99"
formatCurrency("29.5");     // "29.50"
```

#### 1.8.3 数据验证与类型守卫

```js
/**
 * 场景：用户注册表单验证
 * 需要验证多种类型的数据
 */

// 类型守卫函数
function isNonEmptyString(val) {
    return typeof val === 'string' && val.trim().length > 0;
}

function isPositiveInteger(val) {
    const num = Number(val);
    return Number.isInteger(num) && num > 0;
}

function isValidEmail(val) {
    return typeof val === 'string' &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

// 综合验证
function validateRegistrationForm(formData) {
    const errors = [];

    if (!isNonEmptyString(formData.username)) {
        errors.push('用户名不能为空');
    } else if (formData.username.length < 3) {
        errors.push('用户名至少3个字符');
    }

    if (!isValidEmail(formData.email)) {
        errors.push('请输入有效的邮箱地址');
    }

    if (!isPositiveInteger(formData.age)) {
        errors.push('请输入有效的年龄');
    } else if (formData.age < 18) {
        errors.push('必须年满18岁');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
```

### 1.9 问题解决方案汇总

| 问题类型 | 问题描述 | 解决方案 | 代码示例 |
|---------|---------|---------|----------|
| 浮点数精度 | `0.1 + 0.2 !== 0.3` | 使用整数运算或 toFixed() | `Math.round(0.1 * 10 + 0.2 * 10) / 10` |
| 隐式转换陷阱 | `[] == false` 为 true | 使用严格相等 `===` | `Array.isArray(arr) && arr.length === 0` |
| null 类型判断 | `typeof null === 'object'` | 使用 `=== null` | `val === null` |
| NaN 判断 | `NaN == NaN` 为 false | 使用 `Number.isNaN()` | `Number.isNaN(NaN)` // true |
| 宽松相等 | `"1" == 1` 为 true | 使用严格相等 `===` | `value === 1` |
| 数字字符串验证 | `Number("123abc")` 返回 NaN | 使用 `Number.isNaN()` | `Number.isNaN(Number(input))` |
| 空数组陷阱 | `[] == 0` 为 true | 明确类型检查 | `Array.isArray(arr) && arr.length > 0` |
| 金额计算 | 浮点运算不精确 | 转为整数计算 | `Math.round(price * 100) / 100` |

### 1.10 与相关技术的对比分析

#### 1.10.1 JavaScript vs TypeScript 类型系统

```js
// JavaScript 动态类型 - 运行时转换
const result = "10" + 5;    // "105" - 字符串拼接
const num = +"10";          // 10 - 一元加号转为数字

// TypeScript 静态类型 - 编译时检查
// let value: string = "10";
// value = 10;  // 编译错误：不能将 number 分配给 string

// 类型断言（TypeScript）
const str = "123" as string;
const num2 = str as unknown as number;

// 类型守卫（TypeScript）
function isString(val): val is string {
    return typeof val === 'string';
}
```

#### 1.10.2 JavaScript vs Python 类型转换

```js
// JavaScript 类型转换
Number("123")           // 123
String(123)             // "123"
Boolean(1)              // true
parseInt("12.5px", 10)  // 12

# Python 类型转换
int("123")              # 123
str(123)                # "123"
bool(1)                 # True
int("12.5px")            # ValueError

// Python 的 int() 更严格，不允许字符串包含非数字字符
// JavaScript 的 parseInt() 更宽松，从左到右解析
```

#### 1.10.3 JavaScript vs Java 类型转换

```js
// JavaScript 隐式转换
console.log("10" + 5);    // "105" - 自动转为字符串
console.log("10" - 5);     // 5 - 自动转为数字
console.log(10 == "10");  // true - 宽松相等

// Java 显式转换
// System.out.println("10" + 5);  // 编译错误
// int result = "10" + 5;         // 编译错误
// String s = 10 + "5";           // "105"
// int num = Integer.parseInt("10");

// Java 是强类型语言，必须显式转换
// JavaScript 是弱类型语言，自动转换
```

#### 1.10.4 常见类型转换对比表

| 转换场景 | JavaScript | Python | Java | Go |
|---------|------------|--------|------|-----|
| 字符串转数字 | `Number("10")` | `int("10")` | `Integer.parseInt("10")` | `strconv.Atoi("10")` |
| 数字转字符串 | `String(10)` | `str(10)` | `String.valueOf(10)` | `strconv.Itoa(10)` |
| 字符串转布尔 | `Boolean("")` | `bool("")` | - | `str != ""` |
| 空转数字 | `Number("")` // 0 | `int("")` // Error | `Integer.parseInt("")` // Error | `strconv.Atoi("")` // Error |
| 空值处理 | `null` / `undefined` | `None` | `null` | `nil` |

---

## 2. 作用域

### 2.1 理论基础

**什么是作用域？**
作用域是指变量和函数的可访问范围。它决定了代码中哪些实体（变量、函数）对某个代码片段可见。

JavaScript 采用**词法作用域**（Lexical Scope），也称为**静态作用域**，函数的作用域在函数**定义**时就已经确定，而非运行时。

### 2.2 作用域类型详解

```js
// ========== 全局作用域 ==========
var globalVar = "全局变量";

function test() {
    // 函数内部可以访问全局变量
    console.log(globalVar);  // "全局变量"

    // 也可以定义同名的局部变量（遮蔽效应）
    var globalVar = "局部变量";
    console.log(globalVar);  // "局部变量"
}

test();
console.log(globalVar);      // "全局变量"

// 在浏览器中，全局变量是 window 的属性
console.log(window.globalVar); // "全局变量"

// ========== 函数作用域 ==========
function outer() {
    var outerVar = "外层";

    function inner() {
        var innerVar = "内层";
        console.log(outerVar);  // 可访问
        console.log(innerVar);   // 可访问
    }

    inner();
    console.log(innerVar);       // ReferenceError
}

outer();

// ========== 块级作用域 ==========
if (true) {
    // let/const 声明的变量是块级作用域
    let blockVar = "块级";
    const constVar = "常量";

    // var 声明的不是块级作用域
    var notBlockVar = "不是块级";
}

console.log(notBlockVar);    // "不是块级"
console.log(blockVar);       // ReferenceError

// ========== 词法作用域示例 ==========
var value = 1;

function foo() {
    console.log(value);  // 访问外层的 value
}

function bar() {
    var value = 2;
    foo();  // 打印 1，而非 2
}

bar();
// 原因：foo 在定义时就确定了作用域链，value 指向外层的全局 value
```

### 2.3 var/let/const 的作用域差异

```js
// var 的函数作用域问题
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 1000);  // 打印 3, 3, 3
}

// 原因：var i 是函数作用域，三个 setTimeout 共享同一个 i
// 等 setTimeout 执行时，循环已经结束，i = 3

// let 的块级作用域解决方案
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log(j), 1000);  // 打印 0, 1, 2
}

// 原因：每次循环都会创建新的 j，作用域互不影响

// ========== 经典闭包问题 ==========
// 问题：点击按钮，打印的全是 5
var buttons = document.querySelectorAll('button');
for (var k = 0; k < buttons.length; k++) {
    buttons[k].addEventListener('click', function() {
        console.log(k);  // 永远是 5
    });
}

// 解决方案1：使用 let
for (let k = 0; k < buttons.length; k++) {
    buttons[k].addEventListener('click', function() {
        console.log(k);  // 正确：0, 1, 2, 3, 4
    });
}

// 解决方案2：使用闭包
for (var k = 0; k < buttons.length; k++) {
    (function(index) {
        buttons[index].addEventListener('click', function() {
            console.log(index);
        });
    })(k);
}

// 解决方案3：使用 forEach
Array.from(buttons).forEach(function(button, index) {
    button.addEventListener('click', function() {
        console.log(index);
    });
});
```

### 2.4 作用域链与闭包

```js
// 作用域链
var a = 1;

function outer() {
    var b = 2;

    function middle() {
        var c = 3;

        function inner() {
            var d = 4;
            console.log(a, b, c, d);  // 1, 2, 3, 4
            // 可以访问所有外层变量
        }

        inner();
        console.log(d);  // ReferenceError
    }

    middle();
}

outer();

// 闭包：内层函数访问外层函数的变量
function createCounter() {
    var count = 0;  // 私有变量

    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getCount: function() {
            return count;
        }
    };
}

var counter = createCounter();
counter.increment();  // 1
counter.increment();  // 2
counter.getCount();   // 2
// count 不会被垃圾回收，因为闭包还在引用它
```

### 2.5 实际应用场景

```js
// 场景1：模块化（模拟私有变量）
var MyModule = (function() {
    var privateData = "私有";

    function privateMethod() {
        return "私有方法";
    }

    return {
        publicMethod: function() {
            return privateMethod();
        },
        getData: function() {
            return privateData;
        }
    };
})();

MyModule.publicMethod();
MyModule.getData();

// 场景2：防抖函数
function debounce(fn, delay) {
    var timer = null;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(this, arguments);
        }, delay);
    };
}

// 场景3：循环中的异步操作
// 错误写法
for (var i = 0; i < 3; i++) {
    fetch(`/api/${i}`)
        .then(function(data) {
            console.log(i);  // 都是 3
        });
}

// 正确写法
for (var i = 0; i < 3; i++) {
    (function(index) {
        fetch(`/api/${index}`)
            .then(function(data) {
                console.log(index);  // 0, 1, 2
            });
    })(i);
}
```

### 2.6 作用域原理深入分析

#### 2.6.1 执行上下文与作用域链

JavaScript 的执行机制依赖于**执行上下文栈**（Call Stack）和**作用域链**（Scope Chain）：

```js
/**
 * 执行上下文类型：
 * 1. 全局执行上下文 - window 对象，this 指向 window
 * 2. 函数执行上下文 - 每次函数调用创建
 * 3. Eval 执行上下文 - eval() 函数创建（不推荐使用）
 */

// 执行上下文栈示例
var globalVar = "全局";

function outer() {
    var outerVar = "外层";

    function middle() {
        var middleVar = "中层";

        function inner() {
            var innerVar = "内层";
            console.log(globalVar, outerVar, middleVar, innerVar);
        }

        inner();
    }

    middle();
}

outer();

// 执行顺序：
// 1. 全局上下文入栈
// 2. outer() 调用 -> outer 执行上下文入栈
// 3. middle() 调用 -> middle 执行上下文入栈
// 4. inner() 调用 -> inner 执行上下文入栈
// 5. inner() 执行完毕 -> inner 执行上下文出栈
// 6. middle() 执行完毕 -> middle 执行上下文出栈
// 7. outer() 执行完毕 -> outer 执行上下文出栈
// 8. 全局上下文出栈（程序结束）
```

#### 2.6.2 词法作用域 vs 动态作用域

```js
/**
 * 词法作用域（Lexical Scope）- JavaScript 采用
 * 作用域在代码定义时确定，由书写位置决定
 * 关注的是"在哪里定义"
 */

var value = 1;

function foo() {
    console.log(value);  // 词法作用域：定义时确定，指向外层的 value
}

function bar() {
    var value = 2;
    foo();  // 打印 1，而非 2
}

bar();

/**
 * 动态作用域（Dynamical Scope）- 少数语言采用
 * 作用域在代码执行时确定，由调用位置决定
 * 关注的是"从哪里调用"
 */

// 模拟动态作用域的行为
var scope = "global";

function getScope() {
    return scope;  // 动态作用域会返回 "function"
}

function test() {
    var scope = "function";
    return getScope();  // 词法作用域返回 "global"，动态作用域返回 "function"
}
```

#### 2.6.3 变量提升机制详解

```js
/**
 * 变量提升（Hoisting）：
 * var 声明的变量会被提升到函数或全局作用域顶部
 * 赋值语句保留在原位置
 */

// 变量提升示例
console.log(a);  // undefined（不是 ReferenceError）
var a = 1;

// 实际执行顺序（编译器视角）
var a;           // 提升声明
console.log(a);  // undefined
a = 1;           // 赋值保留在原位置

// 函数声明的提升（完整提升）
sayHello();  // "Hello"

function sayHello() {
    console.log("Hello");
}

// 函数表达式不会完整提升
sayWorld();  // TypeError: sayWorld is not a function

var sayWorld = function() {
    console.log("World");
};

// 提升优先级：函数声明 > 变量声明
console.log(fn);  // function

var fn = 3;

function fn() {
    return 4;
}

console.log(fn);  // 3

// 实际执行顺序
// function fn() { return 4; }  // 函数声明提升
// var fn;                       // 变量声明提升（被忽略，因为已存在同名的函数）
// console.log(fn);              // function
// fn = 3;                       // 赋值
// console.log(fn);              // 3
```

#### 2.6.4 块级作用域与 TDZ

```js
/**
 * 暂时性死区（Temporal Dead Zone - TDZ）：
 * let/const 声明的变量在声明前不可访问
 * 从块开始到声明之间的区域称为 TDZ
 */

function testTDZ() {
    console.log(x);  // ReferenceError
    let x = 1;
}

// TDZ 原理
// 在作用域开始时，let/const 变量已经存在，但不可访问
// 只有执行到声明语句时，变量才可访问

// 常见 TDZ 陷阱
if (true) {
    // TDZ 开始
    typeof x;  // ReferenceError
    typeof y;  // "undefined" - typeof 相对安全

    let x = 10;  // TDZ 结束，x 可访问
    let y = 20;
}

// typeof 在变量未声明时不会报错（相对安全）
// 但 let/const 在 TDZ 中 typeof 会报错
```

### 2.7 实际应用场景深入

#### 2.7.1 模块化模式

```js
/**
 * 场景：创建具有私有变量的模块
 * 模拟面向对象的封装特性
 */

var Calculator = (function() {
    // 私有变量 - 外部无法直接访问
    var memory = 0;
    var history = [];

    // 私有方法
    function validateNumber(num) {
        return typeof num === 'number' && !Number.isNaN(num);
    }

    // 公共接口
    return {
        add: function(a, b) {
            if (!validateNumber(a) || !validateNumber(b)) {
                throw new Error('无效的数字参数');
            }
            var result = a + b;
            memory = result;
            history.push({ operation: 'add', result });
            return result;
        },

        subtract: function(a, b) {
            if (!validateNumber(a) || !validateNumber(b)) {
                throw new Error('无效的数字参数');
            }
            var result = a - b;
            memory = result;
            history.push({ operation: 'subtract', result });
            return result;
        },

        getMemory: function() {
            return memory;
        },

        getHistory: function() {
            return [...history];  // 返回副本，防止外部修改
        },

        clearHistory: function() {
            history = [];
        }
    };
})();

// 使用示例
Calculator.add(10, 5);      // 15
Calculator.subtract(10, 3); // 7
Calculator.getMemory();     // 7
Calculator.getHistory();     // [{operation: 'add', result: 15}, ...]
// memory 和 history 外部无法直接访问
```

#### 2.7.2 函数节流与防抖

```js
/**
 * 场景：处理高频事件（滚动、输入、窗口调整）
 * 利用闭包和作用域实现性能优化
 */

// 防抖函数 - 延迟执行，时间内重复触发则重置
function debounce(fn, delay, immediate = false) {
    var timer = null;

    return function(...args) {
        var context = this;

        // 立即执行模式
        if (immediate && !timer) {
            fn.apply(context, args);
        }

        clearTimeout(timer);

        timer = setTimeout(function() {
            if (!immediate) {
                fn.apply(context, args);
            }
            timer = null;
        }, delay);
    };
}

// 节流函数 - 固定间隔执行
function throttle(fn, delay) {
    var flag = true;
    var lastArgs = null;

    return function(...args) {
        var context = this;

        if (flag) {
            flag = false;
            setTimeout(function() {
                fn.apply(context, lastArgs);
                flag = true;
                lastArgs = null;
            }, delay);
        } else {
            lastArgs = args;  // 保存最后一次参数
        }
    };
}

// 使用示例：搜索输入框
var searchInput = document.getElementById('search');

searchInput.addEventListener('input', debounce(function(e) {
    console.log('搜索:', e.target.value);
    fetchSuggestions(e.target.value);
}, 300));

// 使用示例：窗口滚动
window.addEventListener('scroll', throttle(function() {
    console.log('滚动位置:', window.scrollY);
    checkScrollAnimation();
}, 100));
```

#### 2.7.3 惰性函数与缓存

```js
/**
 * 场景：根据条件一次性决定函数行为，后续调用直接使用
 * 减少重复判断开销
 */

// 惰性函数示例：环境检测
var addEvent = function() {
    if (window.addEventListener) {
        // 重写函数，下次直接调用
        addEvent = function(elem, type, handler) {
            elem.addEventListener(type, handler, false);
        };
    } else {
        addEvent = function(elem, type, handler) {
            elem.attachEvent('on' + type, handler);
        };
    }

    // 首次执行
    addEvent.apply(this, arguments);
};

// 带缓存的惰性函数
function createFormatter(pattern) {
    var cache = {};

    return function(date) {
        if (cache[date]) {
            return cache[date];
        }

        // 复杂的格式化逻辑
        var result = format(date, pattern);
        cache[date] = result;
        return result;
    };
}

// 记忆化函数
function memoize(fn) {
    var cache = {};

    return function(...args) {
        var key = JSON.stringify(args);

        if (cache[key]) {
            return cache[key];
        }

        var result = fn.apply(this, args);
        cache[key] = result;
        return result;
    };
}

// 使用示例
var fibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

fibonacci(100);  // 快速返回缓存结果
```

### 2.8 问题解决方案汇总

| 问题场景 | 问题描述 | 解决方案 | 代码示例 |
|---------|---------|---------|----------|
| 循环闭包陷阱 | var i 在循环中共享 | 使用 let / 闭包 / forEach | `for (let i = 0; i < 3; i++)` |
| 变量提升冲突 | 变量在声明前使用 | 使用 let/const | `let x = 1; // TDZ 保护` |
| 全局变量污染 | 多个脚本变量冲突 | IIFE / 模块化 | `(function() { ... })()` |
| 变量泄漏 | 意外的全局变量 | 开启严格模式 | `'use strict';` |
| 块级作用域缺失 | var 的函数作用域问题 | 改用 let/const | `let i = 0; // 块级` |
| 私有变量暴露 | 对象属性可被修改 | 闭包实现私有化 | `return { get, set }` |
| 事件处理器的 this | 回调中 this 指向错误 | 箭头函数 / bind | `() => this.handle()` |
| 循环 setTimeout | 延迟打印的值都相同 | 使用 let / IIFE | `(function(i) { ... })(i)` |

### 2.9 与相关技术的对比分析

#### 2.9.1 JavaScript vs Python 作用域

```js
// JavaScript 作用域类型
var globalVar = "全局";           // 全局作用域

function scopeTest() {
    var functionVar = "函数";     // 函数作用域

    if (true) {
        let blockVar = "块级";   // ES6+ 块级作用域
        const constVar = "常量"; // const 也是块级
        console.log(functionVar); // 可访问外层
    }

    console.log(blockVar);       // ReferenceError
}

# Python 作用域类型 (LEGB 规则)
# L - Local（本地）
# E - Enclosing（闭包作用域）
# G - Global（全局）
# B - Built-in（内置）

global_var = "全局"

def scope_test():
    function_var = "函数"

    if True:
        block_var = "块级"       # Python 中 if 也创建作用域
        print(function_var)      # 可访问外层

    print(block_var)            # 可访问（Python 3）

# 主要区别：
# 1. Python 几乎所有代码块都创建作用域
# 2. JavaScript 只有函数创建作用域（var），ES6+ 后块级作用域
# 3. Python 有闭包作用域（E），JavaScript 没有单独的 E 层
```

#### 2.9.2 JavaScript vs Java 作用域

```js
// JavaScript 作用域
var globalVar = "全局";          // 全局作用域（函数外）

function test() {
    var functionVar = "函数";    // 函数作用域

    if (true) {
        let blockVar = "块级";  // 块级作用域（ES6+）
    }
}

// Java 作用域
public class ScopeExample {
    String globalVar = "全局";   // 类作用域

    public void test() {
        String functionVar = "方法";  // 方法作用域

        if (true) {
            String blockVar = "块级"; // if 块作用域（Java 7+ 支持）
        }
    }
}

// 主要区别：
// 1. JavaScript 是函数作用域，Java 是块级作用域
// 2. Java 是强类型，变量必须先声明类型
// 3. Java 的变量作用域更严格，编译时确定
```

#### 2.9.3 作用域解决方案对比

| 问题 | JavaScript 传统方案 | JavaScript 现代方案 | 其他语言 |
|-----|-------------------|-------------------|---------|
| 私有变量 | IIFE 闭包 | ES2022 private (#x) | Java: private 关键字 |
| 块级循环 | IIFE 包装 | let 声明 | Python: for 中直接可用 |
| 延迟执行 | 闭包保存变量 | async/await | Rust: move 闭包 |
| 模块化 | 立即执行函数 | ES Modules | Python: import |

#### 2.9.4 作用域闭包对比表

| 特性 | var | let | const | Python | Java |
|-----|-----|-----|-------|--------|------|
| 作用域类型 | 函数 | 块 | 块 | 函数/块 | 块 |
| 变量提升 | 是 | 否(TDZ) | 否(TDZ) | 否 | 否 |
| 重复声明 | 允许 | 禁止 | 禁止 | 允许 | 禁止 |
| 初始值 | 可选 | 可选 | 必须 | 可选 | 必须 |
| 可修改性 | 可修改 | 可修改 | 禁止(基本类型) | 可修改 | 禁止(final) |

---

## 3. 相等性比较

### 3.1 理论基础

JavaScript 提供了两组相等性比较运算符：
- **宽松相等**（==）：会进行类型转换
- **严格相等**（===）：不进行类型转换

理解类型转换规则是正确使用比较运算符的关键。

### 3.2 == 类型转换规则详解

```js
// ========== 转换规则表 ==========
// 1. null 和 undefined 特殊处理
null == undefined    // true - 互等
null == 0             // false
undefined == 0       // false

// 2. 数字 vs 字符串
// 字符串转为数字
1 == "1"             // true
1 == "1.0"           // true
0 == ""              // true  - "" 转为 0
0 == " "             // true  - 空格转为 0

// 3. 布尔值 vs 其他
// 布尔转为数字
true == 1            // true
true == "1"          // true
false == 0           // true
false == ""          // true
false == "0"         // true
false == []          // true  - [] 转为 "" 再转为 0

// 4. 对象 vs 基本类型
// 对象先调用 valueOf() 或 toString()
[1] == 1             // true
[1] == "1"          // true
[1, 2] == "1,2"     // true
({}).toString()     // "[object Object]"
{} == "[object Object]" // true

// 5. NaN 不等于任何值
NaN == NaN           // false
NaN == 0            // false
NaN == false        // false
```

### 3.3 经典陷阱与解析

```js
// ========== 陷阱 1：数组比较 ==========
[] == false         // true
![] == false        // true

// [] == false 详解：
// 左边是对象，右边是布尔
// false 转为 0
// [] 调用 toString() 转为 ""
// "" 转为 0
// 0 == 0 -> true

// ========== 陷阱 2：空字符串 ==========
"" == 0             // true
"" == false         // true
"" == []            // true

// ========== 陷阱 3：包装对象 ==========
new Number(1) == 1  // true
new String("1") == 1 // true
new Boolean(true) == true // true
```

### 3.4 严格相等 === 的优势

```js
// === 不进行类型转换，更安全
1 === "1"           // false
true === 1          // false
null === undefined  // false
{} === {}           // false
[] === []           // false

// 推荐用法
if (value === null)
if (typeof x === "undefined")
if (Array.isArray(arr))
```

### 3.5 Object.is() 的精确比较

```js
Object.is(NaN, NaN)       // true - 弥补 === 的不足
Object.is(0, -0)         // false - 区分正负零

function sameValueZero(x, y) {
    return Object.is(x, y) || (Number.isNaN(x) && Number.isNaN(y));
}
```

### 3.6 相等性比较原理深入

#### 3.6.1 SameValue vs SameValueZero vs Strict Equality

JavaScript 提供了三种相等性比较算法：

```js
/**
 * 1. 严格相等（Strict Equality Comparison）- ===
 *    - 不进行类型转换
 *    - NaN 不等于自身
 *    - +0 和 -0 相等
 *
 * 2. 抽象相等（Abstract Equality Comparison）- ==
 *    - 进行类型转换
 *    - NaN 不等于自身
 *    - +0 和 -0 相等
 *
 * 3. SameValue（Object.is）
 *    - 不进行类型转换
 *    - NaN 等于自身
 *    - +0 和 -0 不相等
 *
 * 4. SameValueZero
 *    - 不进行类型转换
 *    - NaN 等于自身
 *    - +0 和 -0 相等
 */

// 对比表格
console.log("严格相等 ===:");
console.log(NaN === NaN);           // false
console.log(0 === -0);             // true
console.log("1" === 1);            // false

console.log("抽象相等 ==");
console.log(NaN == NaN);           // false
console.log(0 == -0);             // true
console.log("1" == 1);            // true

console.log("Object.is:");
console.log(Object.is(NaN, NaN));  // true
console.log(Object.is(0, -0));    // false
console.log(Object.is("1", 1));   // false

console.log("SameValueZero (可通过 polyfill 实现):");
function sameValueZero(x, y) {
    return Object.is(x, y) || (Number.isNaN(x) && Number.isNaN(y));
}
console.log(sameValueZero(NaN, NaN));  // true
console.log(sameValueZero(0, -0));     // true
console.log(sameValueZero("1", 1));    // false
```

#### 3.6.2 抽象相等比较算法详解

```js
/**
 * 抽象相等比较（Abstract Equality Comparison）的执行流程：
 *
 * 7.2.14 Abstract Equality Comparison
 *
 * 1. 如果类型相同，执行严格相等比较
 * 2. null == undefined -> true（特殊规则）
 * 3. Number vs String -> String 转为 Number
 * 4. Boolean vs 任意 -> Boolean 转为 Number
 * 5. Object vs String/Number/Symbol -> Object 转为基本类型
 * 6. 其他情况 -> false
 */

// 详细解析 [] == false
// Step 1: 类型不同，继续
// Step 2: 不是 null/undefined
// Step 3: 不是 Number/String
// Step 4: false 是 Boolean，转为 Number
//         Number(false) = 0
//         [] 转为基本类型 -> ""
// Step 5: "" == 0
//         "" 转为 Number -> 0
// Step 6: 0 == 0 -> true

// 详细解析 {} == false
// Step 1: 类型不同，继续
// Step 4: false 转为 0
// Step 5: {} 转为基本类型 -> "[object Object]"
//         "[object Object]" == 0
//         "[object Object]" 转为 Number -> NaN
// Step 6: NaN == 0 -> false
```

### 3.7 实际应用场景深入

#### 3.7.1 安全的对象比较

```js
/**
 * 场景：深度比较两个对象是否相等
 * 用于状态管理、diff 算法、缓存更新等
 */

function deepEqual(val1, val2) {
    // SameValueZero 逻辑
    if (Object.is(val1, val2)) return true;

    // 处理 null
    if (val1 === null || val2 === null) return false;

    // 必须是对象才深度比较
    if (typeof val1 !== 'object' || typeof val2 !== 'object') {
        return false;
    }

    // 类型检查
    const type1 = Object.prototype.toString.call(val1);
    const type2 = Object.prototype.toString.call(val2);

    if (type1 !== type2) return false;

    // Array vs Object
    if (type1 === '[object Object]') {
        const keys1 = Object.keys(val1);
        const keys2 = Object.keys(val2);

        if (keys1.length !== keys2.length) return false;

        return keys1.every(key =>
            Object.prototype.hasOwnProperty.call(val2, key) &&
            deepEqual(val1[key], val2[key])
        );
    }

    // Array
    if (type1 === '[object Array]') {
        if (val1.length !== val2.length) return false;

        return val1.every((item, index) => deepEqual(item, val2[index]));
    }

    // Date
    if (type1 === '[object Date]') {
        return val1.getTime() === val2.getTime();
    }

    return false;
}

// 使用示例
var state1 = { user: { name: '张三', age: 25 }, tags: ['a', 'b'] };
var state2 = { user: { name: '张三', age: 25 }, tags: ['a', 'b'] };
var state3 = { user: { name: '李四', age: 30 }, tags: ['a', 'b'] };

deepEqual(state1, state2);  // true - 相同的结构
deepEqual(state1, state3);  // false - 不同的值
```

#### 3.7.2 缓存 key 的安全构建

```js
/**
 * 场景：使用对象作为缓存的 key
 * 需要安全地将对象转为字符串
 */

function safeStringify(obj) {
    return JSON.stringify(obj, Object.keys(obj).sort());
}

// 带类型标记的安全比较
function getCacheKey(...args) {
    return args.map(arg => {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (Number.isNaN(arg)) return 'NaN';
        if (typeof arg === 'object') {
            return JSON.stringify(arg, Object.keys(arg).sort());
        }
        return String(arg);
    }).join('|');
}

// 使用示例
var cache = new Map();

function expensiveOperation(config) {
    var key = getCacheKey(config);

    if (cache.has(key)) {
        console.log('使用缓存');
        return cache.get(key);
    }

    var result = computeExpensiveValue(config);
    cache.set(key, result);
    return result;
}

var config1 = { type: 'user', id: 123 };
var config2 = { id: 123, type: 'user' };  // 相同的逻辑内容

expensiveOperation(config1);  // 计算
expensiveOperation(config2);  // 缓存（因为 key 相同）
```

#### 3.7.3 表单变更检测

```js
/**
 * 场景：检测表单是否有未保存的变更
 * 用于提示用户是否离开页面
 */

function hasChanges(original, current) {
    if (Object.keys(original).length !== Object.keys(current).length) {
        return true;
    }

    return Object.keys(original).some(key => {
        var orig = original[key];
        var curr = current[key];

        // 处理嵌套对象
        if (typeof orig === 'object' && typeof curr === 'object') {
            return !deepEqual(orig, curr);
        }

        // SameValueZero 逻辑处理 NaN
        if (Number.isNaN(orig) && Number.isNaN(curr)) {
            return false;
        }

        return orig !== curr;
    });
}

// 使用示例
var originalForm = {
    username: '张三',
    email: 'zhang@example.com',
    profile: { city: '北京', hobby: ['读书', '运动'] }
};

var currentForm = {
    username: '张三',
    email: 'zhang@example.com',
    profile: { city: '北京', hobby: ['读书', '运动'] }
};

hasChanges(originalForm, currentForm);  // false

currentForm.username = '李四';
hasChanges(originalForm, currentForm);   // true
```

### 3.8 问题解决方案汇总

| 问题场景 | 问题描述 | 解决方案 | 代码示例 |
|---------|---------|---------|----------|
| NaN 判断 | NaN !== NaN | 使用 Number.isNaN() | `Number.isNaN(value)` |
| 浮点数比较 | 0.1 + 0.2 !== 0.3 | 使用容差或整数运算 | `Math.abs(a - b) < 1e-10` |
| 对象相等 | {} !== {} | 深度比较函数 | `deepEqual(obj1, obj2)` |
| null vs undefined | 语义不明确 | 明确比较 | `val === null` / `val === undefined` |
| 数组比较 | [] !== [] | 序列化或深度比较 | `JSON.stringify(a) === JSON.stringify(b)` |
| 包装对象 | new Number(1) !== 1 | 使用 valueOf() | `num.valueOf() === 1` |
| Date 比较 | new Date() !== new Date() | 比较时间戳 | `date1.getTime() === date2.getTime()` |
| 正负零 | 0 !== -0 | 使用 Object.is() | `Object.is(0, -0)` |

### 3.9 与相关技术的对比分析

#### 3.9.1 JavaScript vs Python 相等性比较

```js
// JavaScript 相等性
1 === 1              // true - 严格相等
1 == "1"             // true - 抽象相等
null == undefined    // true - 特殊规则
NaN === NaN          // false - NaN 不等于自身
Object.is(NaN, NaN)  // true - SameValue

# Python 相等性
1 == 1               # True
1 == "1"             # False - 类型不同
None == None         # True
float('nan') == float('nan')  # False - NaN 不等于自身
# Python 使用 "is" 判断是否是同一对象
a = [1, 2]
b = [1, 2]
a == b   # True - 值相等
a is b   # False - 不同对象
a = b
a is b   # True - 同一引用

// 主要区别：
// 1. Python 没有隐式类型转换
// 2. Python 的 "is" 类似 JavaScript 的 Object.is（但不完全相同）
// 3. Python 的 == 会调用 __eq__ 方法
```

#### 3.9.2 JavaScript vs Java 相等性比较

```js
// JavaScript 相等性
"1" === 1      // false
"1" == 1       // true

// Java 相等性
// "1" == 1     // 编译错误，不能比较不同类型
"1".equals(1)  // false
Integer.parseInt("1") == 1  // true

// Java 使用 == 比较基本类型，equals() 比较对象
String s1 = new String("hello");
String s2 = new String("hello");
s1 == s2      // false - 不同对象
s1.equals(s2) // true - 值相等

// 主要区别：
// 1. Java 必须显式类型转换
// 2. Java 的对象比较使用 equals() 方法
// 3. JavaScript 的 == 有隐式类型转换
```

#### 3.9.3 相等性比较方案对比表

| 场景 | JavaScript | Python | Java | C# |
|-----|-----------|--------|------|-----|
| 值相等 | == | == | == | == |
| 引用相等 | === (基本类型) | is | == (对象) | ReferenceEquals |
| 身份相等 | Object.is | is | ReferenceEquals | ReferenceEquals |
| 无隐式转换 | === | == | == | == |

---

## 4. 回调函数

### 4.1 理论基础

**回调函数**是将一个函数作为参数传递给另一个函数，在特定操作完成后被调用的函数。这是 JavaScript 异步编程的基础。

### 4.2 同步回调 vs 异步回调

```js
// ========== 同步回调 ==========
var arr = [1, 2, 3];
var doubled = arr.map(function(item) {
    return item * 2;
});
console.log(doubled);  // [2, 4, 6]

// ========== 异步回调 ==========
console.log("1");
setTimeout(function() {
    console.log("2");
}, 0);
console.log("3");
// 输出: 1, 3, 2
```

### 4.3 回调地狱与解决方案

```js
// ========== 回调地狱 ==========
getUser(userId, function(user) {
    getPosts(user.id, function(posts) {
        getComments(posts[0].id, function(comments) {
            console.log(comments);
        });
    });
});

// ========== Promise 解决方案 ==========
getUser(userId)
    .then(user => getPosts(user.id))
    .then(posts => getComments(posts[0].id))
    .then(comments => console.log(comments))
    .catch(err => console.error(err));

// ========== async/await 解决方案 ==========
async function getData() {
    try {
        const user = await getUser(userId);
        const posts = await getPosts(user.id);
        const comments = await getComments(posts[0].id);
        console.log(comments);
    } catch (error) {
        console.error(error);
    }
}
```

### 4.4 this 指向问题

```js
// ========== 问题：回调中的 this ==========
var obj = {
    name: "张三",
    delayedSay: function() {
        setTimeout(function() {
            console.log(this.name);  // undefined
        }, 1000);
    }
};

// ========== 解决方案：箭头函数 ==========
var obj = {
    name: "张三",
    delayedSay: function() {
        setTimeout(() => {
            console.log(this.name);  // "张三"
        }, 1000);
    }
};
```

### 4.5 回调函数原理深入

#### 4.5.1 回调函数执行机制

```js
/**
 * 回调函数的本质：
 * 将函数作为参数传递给另一个函数，由接收方在合适的时机调用
 *
 * 同步回调：在当前调用栈中立即执行
 * 异步回调：放入任务队列，等待调用栈清空后执行
 */

// 同步回调示例
[1, 2, 3].forEach(function(item) {
    console.log(item);  // 同步执行
});
console.log('完成');  // 在 forEach 之后执行

// 异步回调示例
setTimeout(function() {
    console.log('异步');  // 放入宏任务队列
}, 0);
console.log('同步');  // 立即执行
// 输出: 同步, 异步
```

#### 4.5.2 回调函数 this 指向问题

```js
/**
 * 回调函数中的 this 指向问题：
 * 普通函数作为回调时，this 指向调用者或 window
 * 箭头函数作为回调时，this 指向定义时的外层作用域
 */

// 问题示例
var name = '全局';

var obj = {
    name: '对象',
    delayedSay: function() {
        setTimeout(function() {
            console.log(this.name);  // "全局" - this 指向 window
        }, 1000);
    }
};

// 解决方案1：保存 this 引用
var obj = {
    name: '对象',
    delayedSay: function() {
        var self = this;  // 保存 this
        setTimeout(function() {
            console.log(self.name);  // "对象"
        }, 1000);
    }
};

// 解决方案2：箭头函数
var obj = {
    name: '对象',
    delayedSay: function() {
        setTimeout(() => {
            console.log(this.name);  // "对象" - 箭头函数继承外层 this
        }, 1000);
    }
};

// 解决方案3：bind
var obj = {
    name: '对象',
    delayedSay: function() {
        setTimeout(function() {
            console.log(this.name);
        }.bind(this), 1000);  // 绑定 this
    }
};
```

### 4.6 实际应用场景深入

#### 4.6.1 异步流程控制

```js
/**
 * 场景：并行执行多个异步任务，等待所有任务完成
 * 类似 Promise.all
 */

function promiseAll(promises) {
    return new Promise(function(resolve, reject) {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('参数必须是数组'));
        }

        var results = [];
        var pending = promises.length;

        if (pending === 0) {
            return resolve(results);
        }

        promises.forEach(function(promise, index) {
            Promise.resolve(promise).then(
                function(value) {
                    results[index] = value;
                    pending--;

                    if (pending === 0) {
                        resolve(results);
                    }
                },
                function(reason) {
                    reject(reason);
                }
            );
        });
    });
}

// 使用示例
promiseAll([
    fetch('/api/user'),
    fetch('/api/posts'),
    fetch('/api/comments')
]).then(function(results) {
    console.log('所有数据加载完成:', results);
}).catch(function(error) {
    console.error('某个请求失败:', error);
});

// 手动实现 Promise.race
function promiseRace(promises) {
    return new Promise(function(resolve, reject) {
        promises.forEach(function(promise) {
            Promise.resolve(promise).then(resolve, reject);
        });
    });
}

// 使用示例
promiseRace([
    fetch('/api/fast'),
    new Promise(function(_, reject) {
        setTimeout(reject, 1000, new Error('超时'));
    })
]).then(function(result) {
    console.log('最快的结果:', result);
}).catch(function(error) {
    console.error('失败:', error);
});
```

#### 4.6.2 错误处理模式

```js
/**
 * 场景：统一的异步错误处理
 * 确保错误不会丢失
 */

// 错误优先回调模式
function readFile(callback) {
    fs.readFile('data.json', function(err, data) {
        if (err) {
            return callback(err);  // 错误优先
        }
        callback(null, JSON.parse(data));  // 成功返回
    });
}

// 安全的异步包装
function safeAsync(fn) {
    return function(...args) {
        return Promise.resolve().then(() => fn.apply(this, args));
    };
}

// 使用示例
var safeGetUser = safeAsync(getUser);

async function loadUserData() {
    try {
        var user = await safeGetUser(123);
        return user;
    } catch (error) {
        console.error('加载失败:', error);
        return null;
    }
}

// 全局错误处理
window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的 Promise 拒绝:', event.reason);
});
```

#### 4.6.3 组合函数

```js
/**
 * 场景：函数式编程中的组合函数
 * 将多个小函数组合成复杂功能
 */

function compose(...fns) {
    return function initial(value) {
        return fns.reduceRight(function(acc, fn) {
            return fn(acc);
        }, value);
    };
}

function pipe(...fns) {
    return function initial(value) {
        return fns.reduce(function(acc, fn) {
            return fn(acc);
        }, value);
    };
}

// 示例函数
var trim = function(str) { return str.trim(); };
var toLowerCase = function(str) { return str.toLowerCase(); };
var replaceSpaces = function(str) { return str.replace(/\s+/g, '-'); };
var addPrefix = function(str) { return 'user_' + str; };

// 组合成一个函数
var processUsername = compose(
    addPrefix,
    replaceSpaces,
    toLowerCase,
    trim
);

processUsername('  Zhang San  ');  // "user_zhang-san"

// pipe 版本（从左到右执行）
var processUsernamePipe = pipe(
    trim,
    toLowerCase,
    replaceSpaces,
    addPrefix
);

processUsernamePipe('  Zhang San  ');  // "user_zhang-san"
```

### 4.7 问题解决方案汇总

| 问题场景 | 问题描述 | 解决方案 | 代码示例 |
|---------|---------|---------|----------|
| 回调地狱 | 多层嵌套难以阅读 | Promise / async-await | `then().then()` |
| this 丢失 | 回调中 this 指向错误 | 箭头函数 / bind / 保存 self | `() => this.fn()` |
| 错误丢失 | 异步错误未被捕获 | 统一错误处理 | `catch(console.error)` |
| 重复执行 | 快速触发多次回调 | 防抖 / 节流 | `debounce(fn, 300)` |
| 内存泄漏 | 回调持有外部引用 | 清理函数 / 弱引用 | `removeEventListener` |
| 回调控制权 | 回调何时调用、几次 | Promise / 状态机 | `new Promise((res, rej) => ...)` |

### 4.8 与相关技术的对比分析

#### 4.8.1 回调函数 vs Promise vs async-await

```js
// 回调函数模式
function fetchData(callback) {
    setTimeout(() => callback(null, 'data'), 1000);
}

fetchData((err, data) => {
    if (err) console.error(err);
    else console.log(data);
});

// Promise 模式
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve('data'), 1000);
    });
}

fetchData()
    .then(data => console.log(data))
    .catch(err => console.error(err));

// async-await 模式
async function fetchAndProcess() {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

// 对比分析
// 1. 可读性：async-await > Promise > 回调
// 2. 错误处理：async-await/Promise > 回调
// 3. 控制流：async-await 最接近同步代码
// 4. 调试：async-await 有完整堆栈跟踪
// 5. 适用场景：
//    - 回调：简单的异步操作、事件处理
//    - Promise：需要链式调用、组合多个异步操作
//    - async-await：复杂的异步流程、同步写法
```

#### 4.8.2 JavaScript 回调 vs Python 装饰器

```js
// JavaScript 回调模式
function withTiming(fn) {
    return function(...args) {
        console.time(fn.name);
        var result = fn(...args);
        console.timeEnd(fn.name);
        return result;
    };
}

function add(a, b) {
    return a + b;
}

var timedAdd = withTiming(add);
timedAdd(1, 2);

# Python 装饰器模式
import time
from functools import wraps

def timing(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = fn(*args, **kwargs)
        end = time.time()
        print(f"{fn.__name__} took {end - start:.4f}s")
        return result
    return wrapper

@timing
def add(a, b):
    return a + b

add(1, 2)

// 主要区别：
// 1. JavaScript 使用函数包装，Python 使用 @decorator 语法
// 2. Python 装饰器更简洁，JavaScript 更灵活
// 3. Python 有 @wraps 保留原函数元信息
```

#### 4.8.3 异步方案对比表

| 特性 | 回调函数 | Promise | async-await | 生成器 |
|-----|---------|---------|-------------|--------|
| 可读性 | 差 | 中 | 好 | 中 |
| 错误处理 | 分散 | 集中 | 同步模式 | 需配合 |
| 调试支持 | 差 | 中 | 好 | 差 |
| 组合能力 | 差 | 好 | 好 | 好 |
| 取消能力 | 难 | Promise.race | AbortController | 可暂停 |
| 浏览器支持 | 原生 | ES6+ | ES2017+ | ES6+ |

---

## 5. use strict

### 5.1 严格模式的变化

```js
"use strict";

test = "hello";  // ReferenceError - 禁止未声明变量

function fn() {
    console.log(this);  // undefined（函数调用时）
}

// 禁止删除不可删除的属性
var obj = {};
Object.defineProperty(obj, "name", { value: "张三", configurable: false });
delete obj.name;  // TypeError

// 禁止函数参数重名
function f(a, a, b) { }  // SyntaxError

// 禁止八进制字面量
// console.log(010);  // SyntaxError
```

---

## 6. null vs undefined

### 6.1 产生场景对比

```js
// ========== undefined 的场景 ==========
var a;
console.log(a);  // undefined - 变量声明但未赋值

function fn(x) {
    console.log(x);  // undefined - 参数未传递
}
fn();

function fn2() {}
console.log(fn2());  // undefined - 函数没有返回值

var obj = { name: "张三" };
console.log(obj.age);  // undefined - 属性不存在

// ========== null 的场景 ==========
var obj = null;  // 主动设置为空
var el = document.getElementById("not-exist");  // null - DOM 不存在
```

### 6.2 typeof 的差异

```js
console.log(typeof null);        // "object" - 历史遗留 bug
console.log(typeof undefined);   // "undefined"

console.log(null === undefined);  // false
console.log(null == undefined);   // true
```

---

## 7. 闭包

### 7.1 基础闭包

```js
function outer() {
    var outerVar = "外层变量";

    function inner() {
        console.log(outerVar);  // 访问外层变量
    }

    return inner;
}

var fn = outer();
fn();  // "外层变量"
```

### 7.2 经典面试题：循环打印

```js
// 错误写法：var
for (var i = 1; i <= 3; i++) {
    setTimeout(function() {
        console.log(i);  // 4, 4, 4
    }, i * 1000);
}

// 正确1：使用 let
for (let i = 1; i <= 3; i++) {
    setTimeout(function() {
        console.log(i);  // 1, 2, 3
    }, i * 1000);
}

// 正确2：使用闭包
for (var i = 1; i <= 3; i++) {
    (function(index) {
        setTimeout(function() {
            console.log(index);
        }, index * 1000);
    })(i);
}
```

### 7.3 防抖与节流

```js
// 防抖（Debounce）
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 节流（Throttle）
function throttle(fn, delay) {
    let flag = true;
    return function(...args) {
        if (!flag) return;
        flag = false;
        setTimeout(() => {
            fn.apply(this, args);
            flag = true;
        }, delay);
    };
}
```

### 7.4 数据私有

```js
function createStack() {
    var items = [];  // 私有变量

    return {
        push: function(item) { items.push(item); },
        pop: function() { return items.pop(); },
        peek: function() { return items[items.length - 1]; },
        getSize: function() { return items.length; }
    };
}

var stack = createStack();
stack.push(1);
stack.peek();  // 1
// items 外部无法访问
```

### 7.5 闭包原理深入

#### 7.5.1 闭包的形成机制

```js
/**
 * 闭包的定义：
 * 当一个内部函数引用了外部函数的变量，即使外部函数已经执行完毕，
 * 这些变量依然会被保留，因为内部函数形成了闭包
 *
 * JavaScript 的闭包依赖于：
 * 1. 词法作用域（Lexical Scope）- 作用域在定义时确定
 * 2. 函数可以作为返回值
 * 3. 函数可以访问其外部作用域的变量
 */

// 闭包的本质是：函数 + 词法环境（作用域链）
function outer() {
    var outerVar = 100;

    function inner() {
        var innerVar = 200;
        console.log(outerVar + innerVar);  // 300
    }

    return inner;
}

var fn = outer();  // outer 执行完毕，但 inner 仍持有 outerVar 的引用
fn();  // 300

// 作用域链示意图
// fnclosure = {
//    scope: {
//      outerScope: { outerVar: 100 },
//      local: { innerVar: 200 }
//    }
// }
```

#### 7.5.2 内存泄漏与闭包

```js
/**
 * 闭包可能导致内存泄漏的场景：
 * 1. 循环引用：DOM 元素引用闭包，闭包引用 DOM
 * 2. 意外持有大型对象
 * 3. 忘记清理事件监听器
 */

// 问题示例：循环引用导致内存泄漏
function attachHandler() {
    var element = document.getElementById('button');

    element.onclick = function() {
        // 闭包引用了 element
        console.log(element.id);
    };

    // element 引用 onclick 处理函数
    // onclick 处理函数引用 element
    // 形成循环引用，无法被垃圾回收
}

// 解决方案1：手动清空引用
function attachHandler() {
    var element = document.getElementById('button');
    var handler = function() {
        console.log(element.id);
    };

    element.onclick = handler;

    // 清理时
    element.onclick = null;  // 断开循环引用
}

// 解决方案2：使用弱引用（现代浏览器的 EventListener）
function attachHandler() {
    var element = document.getElementById('button');

    function handler() {
        console.log(element.id);
    }

    element.addEventListener('click', handler);

    // 清理时
    element.removeEventListener('click', handler);
}

// 问题示例：意外持有大型对象
function processLargeData() {
    var largeArray = new Array(1000000).fill('x');  // 大数组

    return function() {
        // 即使不使用 largeArray，它也会被保留
        return '处理完成';
    };
}

// 解决方案：及时释放不需要的引用
function processLargeData() {
    var largeArray = new Array(1000000).fill('x');
    var result = '处理完成';

    largeArray = null;  // 释放大数组引用

    return function() {
        return result;  // 只保留需要的数据
    };
}
```

### 7.6 实际应用场景深入

#### 7.6.1 函数柯里化

```js
/**
 * 场景：函数式编程中的柯里化（Currying）
 * 将多参数函数转换为一系列单参数函数
 */

// 基础柯里化
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function(...args2) {
            return curried.apply(this, args.concat(args2));
        };
    };
}

// 示例
function add(a, b, c) {
    return a + b + c;
}

var curriedAdd = curry(add);
curriedAdd(1)(2)(3);    // 6
curriedAdd(1, 2)(3);    // 6
curriedAdd(1)(2, 3);    // 6

// 高级柯里化：自动柯里化
function autoCurry(fn) {
    return function curried(...args) {
        return args.length >= fn.length
            ? fn(...args)
            : (...args2) => curried(...args, ...args2);
    };
}

// 使用场景：配置对象构建
function createUser(name, age, gender, city) {
    return { name, age, gender, city };
}

var createUserCurried = autoCurry(createUser);
var createBeijingUser = createUserCurried('北京市');
var createMaleUser = createUserCurried('男');

createBeijingUser(25, '张三');  // {name: '北京市', age: 25, gender: '张三', city: undefined}
createMaleUser('李四', 30, '北京');  // {name: '男', age: '李四', gender: 30, city: '北京'}
```

#### 7.6.2 偏函数应用

```js
/**
 * 场景：部分应用函数参数
 * 创建一个函数，该函数预先填充了一些参数
 */

function partial(fn, ...presetArgs) {
    return function(...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}

// 示例：日志函数
function log(level, timestamp, message) {
    console.log(`[${level}] ${timestamp}: ${message}`);
}

var logError = partial(log, 'ERROR', new Date().toISOString());
var logInfo = partial(log, 'INFO', new Date().toISOString());

logError('用户登录失败');      // [ERROR] 2024-01-01T...: 用户登录失败
logInfo('用户登录成功');       // [INFO] 2024-01-01T...: 用户登录成功

// 带占位符的偏函数
var _ = Symbol('placeholder');

function partialWithPlaceholder(fn, ...presetArgs) {
    return function(...laterArgs) {
        var args = [];
        var laterIndex = 0;

        for (var i = 0; i < presetArgs.length; i++) {
            if (presetArgs[i] === _) {
                args.push(laterArgs[laterIndex++]);
            } else {
                args.push(presetArgs[i]);
            }
        }

        return fn(...args, ...laterArgs.slice(laterIndex));
    };
}

// 示例
function connect(host, port, database, user, password) {
    return `连接 ${database}@${host}:${port} 用户: ${user}`;
}

var connectToMySQL = partialWithPlaceholder(connect, _, 3306, _, _, _);
connectToMySQL('localhost', 'mydb', 'admin', '123456');
// "连接 mydb@localhost:3306 用户: admin"
```

#### 7.6.3 观察者模式

```js
/**
 * 场景：实现观察者模式（发布-订阅）
 * 常用于事件系统、状态管理
 */

function createObservable() {
    var observers = [];

    return {
        subscribe: function(observer) {
            observers.push(observer);
            // 返回取消订阅函数
            return function() {
                observers = observers.filter(o => o !== observer);
            };
        },

        notify: function(data) {
            observers.forEach(observer => observer(data));
        },

        getObserverCount: function() {
            return observers.length;
        }
    };
}

// 示例：事件总线
var eventBus = createObservable();

var unsubscribe1 = eventBus.subscribe(function(data) {
    console.log('订阅者1收到:', data);
});

var unsubscribe2 = eventBus.subscribe(function(data) {
    console.log('订阅者2收到:', data);
});

eventBus.notify('Hello');  // 两个订阅者都会收到

unsubscribe1();  // 取消订阅1
eventBus.notify('World');  // 只有订阅者2收到
```

### 7.7 问题解决方案汇总

| 问题场景 | 问题描述 | 解决方案 | 代码示例 |
|---------|---------|---------|----------|
| 循环打印 | var i 共享导致结果错误 | let / IIFE | `for (let i = 0; i < 3; i++)` |
| 内存泄漏 | 闭包持有不需要的引用 | 手动清空 / null | `element = null` |
| 循环引用 | DOM 和闭包相互引用 | removeEventListener | `el.removeEventListener()` |
| this 丢失 | 闭包中 this 指向错误 | 箭头函数 / self | `() => this.fn()` |
| 变量遮蔽 | 内层变量遮蔽外层 | 避免重名 / 移动变量 | `let self = this` |
| 性能问题 | 大量闭包占用内存 | 及时释放 / 懒加载 | `weakMap` |

### 7.8 与相关技术的对比分析

#### 7.8.1 JavaScript 闭包 vs Python 闭包

```js
// JavaScript 闭包
function outer() {
    var x = 10;

    return function inner() {
        console.log(x);  // 可以访问 x
    };
}

# Python 闭包
def outer():
    x = 10

    def inner():
        print(x)  # 可以访问 x

    return inner

// 主要区别：
// 1. Python 使用 nonlocal 关键字修改闭包变量
// 2. JavaScript 的闭包变量可直接修改
// 3. Python 的 LEGB 规则更复杂
```

#### 7.8.2 JavaScript 闭包 vs Java 内部类

```js
// JavaScript 闭包
function createCounter() {
    var count = 0;

    return {
        increment: function() { return ++count; },
        getCount: function() { return count; }
    };
}

// Java 内部类
public class Counter {
    private int count = 0;

    public interface CounterInterface {
        int increment();
        int getCount();
    }

    public CounterInterface create() {
        class InnerCounter implements CounterInterface {
            public int increment() {
                return ++count;  // 可以访问外部类的私有变量
            }
            public int getCount() {
                return count;
            }
        }
        return new InnerCounter();
    }
}

// 主要区别：
// 1. Java 内部类访问外部变量必须是 final 或 effectively final
// 2. JavaScript 的闭包变量可修改
// 3. Java 内部类有单独的类文件，JavaScript 闭包是函数
```

#### 7.8.3 闭包实现对比表

| 特性 | JavaScript | Python | Java | Rust |
|-----|-----------|--------|------|------|
| 变量修改 | 可直接修改 | nonlocal 关键字 | final 限制 | mut 关键字 |
| 内存管理 | GC 自动回收 | GC 自动回收 | GC 自动回收 | 所有权系统 |
| 作用域规则 | 词法作用域 | LEGB 规则 | 词法作用域 | 词法作用域 |
| 循环引用 | 可能泄漏 | 可能泄漏 | 可能泄漏 | 编译时检测 |
| 最小语法 | 函数嵌套 | 函数嵌套 | 类定义 | 闭包语法 |

---

## 8. 数据类型

### 8.1 基本数据类型

```js
// 7 种基本类型
String   // "字符串"
Number   // 123, 3.14, NaN, Infinity
Boolean  // true, false
Null     // null
Undefined // undefined
Symbol    // Symbol("id")
BigInt    // 9007199254740991n
```

### 8.2 引用数据类型

```js
Object  // { name: "张三" }
Array   // [1, 2, 3]
Function // function() {}
Date    // new Date()
RegExp  // /abc/gi
Error   // new Error()
Map     // new Map()
Set     // new Set()
```

### 8.3 基本类型 vs 引用类型

```js
// 基本类型 - 值拷贝
var a = 1;
var b = a;
b = 2;
console.log(a);  // 1

// 引用类型 - 引用拷贝
var obj1 = { name: "张三" };
var obj2 = obj1;
obj2.name = "李四";
console.log(obj1.name);  // "李四"
```

---

## 9. 事件冒泡与阻止

### 9.1 事件流三阶段

```
捕获阶段 → 目标阶段 → 冒泡阶段
(window)     ↓           (window)
   ↓         ↓              ↓
  ...      [点击元素]       ...
   ↓         ↓              ↓
 body     [点击元素]       body
```

### 9.2 阻止事件传播

```js
element.addEventListener('click', function(e) {
    e.stopPropagation();  // 阻止冒泡
    e.preventDefault();   // 阻止默认行为
});
```

### 9.3 事件委托

```js
// 不用事件委托
lis.forEach(function(li) {
    li.addEventListener('click', handleClick);
});

// 使用事件委托
ul.addEventListener('click', function(e) {
    var li = e.target.closest('li');
    if (li) {
        console.log(li.textContent);
    }
});
```

---

## 10. let vs var vs const

### 10.1 对比表格

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | 是 | 否（TDZ） | 否（TDZ） |
| 重复声明 | 可以 | 不可以 | 不可以 |
| 初始值 | 可选 | 可选 | 必须 |
| 全局属性 | 是 | 否 | 否 |

### 10.2 TDZ（暂时性死区）

```js
// console.log(x); // ReferenceError
let x = 10;
```

---

## 11. 深拷贝与浅拷贝

### 11.1 浅拷贝

```js
// Object.assign
var obj1 = Object.assign({}, obj);

// 扩展运算符
var obj2 = { ...obj };
var arr2 = [...arr];

// 遍历复制
function shallowCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    }
    return result;
}
```

### 11.2 深拷贝

```js
// JSON 方式（无法拷贝函数）
var obj1 = JSON.parse(JSON.stringify(obj));

// 递归实现
function deepClone(obj, weakMap = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (weakMap.has(obj)) {
        return weakMap.get(obj);
    }

    var result = Array.isArray(obj) ? [] : {};
    weakMap.set(obj, result);

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (value && typeof value === 'object') {
                result[key] = deepClone(value, weakMap);
            } else {
                result[key] = value;
            }
        }
    }

    return result;
}

// structuredClone（现代浏览器）
var clone = structuredClone(original);
```

### 11.3 深拷贝原理深入

#### 11.3.1 拷贝原理图解

```js
/**
 * 浅拷贝 vs 深拷贝的核心区别：
 *
 * 浅拷贝：只拷贝对象的第一层属性，嵌套对象共享引用
 * 深拷贝：递归拷贝所有层级，生成完全独立的对象
 */

// 浅拷贝图解
// 原对象：{ a: 1, b: { c: 2 } }
// 拷贝后：{ a: 1, b: { c: 2 } }  <- b 属性指向同一个 { c: 2 }

// 深拷贝图解
// 原对象：{ a: 1, b: { c: 2 } }
// 拷贝后：{ a: 1, b: { c: 2 } }  <- b 属性指向新的 { c: 2 }

// 示例验证
var original = { a: 1, b: { c: 2 } };

// 浅拷贝
var shallow = Object.assign({}, original);
shallow.b.c = 999;
console.log(original.b.c);  // 999 - 被修改了！

// 深拷贝
var deep = JSON.parse(JSON.stringify(original));
deep.b.c = 888;
console.log(original.b.c);  // 999 - 不受影响
```

#### 11.3.2 循环引用处理

```js
/**
 * 循环引用场景：
 * 对象属性引用自身或形成引用链
 */

var obj = { name: 'test' };
obj.self = obj;  // 循环引用

// JSON 方式无法处理循环引用
try {
    JSON.stringify(obj);  // TypeError: Converting circular structure to JSON
} catch (e) {
    console.log('JSON 无法处理循环引用');
}

// 使用 WeakMap 处理循环引用
function deepCloneWithCycle(obj, visited = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // 防止循环引用导致无限递归
    if (visited.has(obj)) {
        return visited.get(obj);
    }

    var clone = Array.isArray(obj) ? [] : {};
    visited.set(obj, clone);

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = deepCloneWithCycle(obj[key], visited);
        }
    }

    return clone;
}

// 示例
var original = { name: 'test' };
original.self = original;  // 循环引用

var cloned = deepCloneWithCycle(original);
console.log(cloned.name);        // "test"
console.log(cloned.self === cloned);  // true - 循环引用被正确处理
```

#### 11.3.3 特殊类型拷贝

```js
/**
 * 需要特殊处理的数据类型：
 * 1. Date、RegExp、Error
 * 2. Map、Set
 * 3. 函数
 * 4. Symbol 作为键
 */

function deepCloneSpecial(obj, visited = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (visited.has(obj)) {
        return visited.get(obj);
    }

    // 处理 Date
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    // 处理 RegExp
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags);
    }

    // 处理 Error
    if (obj instanceof Error) {
        return new Error(obj.message);
    }

    // 处理 Map
    if (obj instanceof Map) {
        var cloneMap = new Map();
        visited.set(obj, cloneMap);
        obj.forEach((value, key) => {
            cloneMap.set(
                deepCloneSpecial(key, visited),
                deepCloneSpecial(value, visited)
            );
        });
        return cloneMap;
    }

    // 处理 Set
    if (obj instanceof Set) {
        var cloneSet = new Set();
        visited.set(obj, cloneSet);
        obj.forEach(value => {
            cloneSet.add(deepCloneSpecial(value, visited));
        });
        return cloneSet;
    }

    // 处理数组
    if (Array.isArray(obj)) {
        var cloneArr = [];
        visited.set(obj, cloneArr);
        for (var i = 0; i < obj.length; i++) {
            cloneArr[i] = deepCloneSpecial(obj[i], visited);
        }
        return cloneArr;
    }

    // 处理普通对象
    var cloneObj = {};
    visited.set(obj, cloneObj);

    Object.keys(obj).forEach(key => {
        cloneObj[key] = deepCloneSpecial(obj[key], visited);
    });

    // 处理 Symbol 作为键
    Object.getOwnPropertySymbols(obj).forEach(sym => {
        cloneObj[sym] = deepCloneSpecial(obj[sym], visited);
    });

    return cloneObj;
}

// 示例
var original = {
    date: new Date(),
    regex: /test/gi,
    map: new Map([['a', 1]]),
    set: new Set([1, 2, 3]),
    symbol: Symbol('test')
};

var cloned = deepCloneSpecial(original);
console.log(cloned.date instanceof Date);           // true
console.log(cloned.regex.source);                  // "test"
console.log(cloned.map.get('a'));                  // 1
console.log(cloned.set.has(1));                    // true
console.log(cloned.symbol === original.symbol);    // false - 新的 Symbol
```

### 11.4 实际应用场景深入

#### 11.4.1 不可变状态管理

```js
/**
 * 场景：Redux 风格的状态管理
 * 每次状态更新都生成新对象，确保不可变性
 */

function createImmutableReducer(initialState, handlers) {
    return function reducer(state, action) {
        if (state === undefined) {
            return initialState;
        }

        var handler = handlers[action.type];
        if (!handler) {
            return state;
        }

        // 调用 handler，返回新状态
        return handler(state, action);
    };
}

// 示例：用户状态管理
var initialUserState = {
    profile: null,
    isLoading: false,
    error: null
};

var userReducer = createImmutableReducer(initialUserState, {
    FETCH_USER_START: function(state, action) {
        return {
            ...state,
            isLoading: true,
            error: null
        };
    },

    FETCH_USER_SUCCESS: function(state, action) {
        return {
            ...state,
            isLoading: false,
            profile: action.payload  // 深拷贝新数据
        };
    },

    FETCH_USER_ERROR: function(state, action) {
        return {
            ...state,
            isLoading: false,
            error: action.payload
        };
    },

    UPDATE_PROFILE: function(state, action) {
        return {
            ...state,
            profile: {
                ...state.profile,  // 浅拷贝嵌套对象
                ...action.payload   // 合并更新
            }
        };
    }
});

// 使用示例
var state1 = userReducer(undefined, { type: 'INIT' });
var state2 = userReducer(state1, {
    type: 'FETCH_USER_START'
});
var state3 = userReducer(state2, {
    type: 'FETCH_USER_SUCCESS',
    payload: { name: '张三', age: 25 }
});

console.log(state1.profile);   // null
console.log(state2.isLoading); // true
console.log(state3.profile);   // { name: '张三', age: 25 }
console.log(state1 === state2); // false - 不同对象
```

#### 11.4.2 表单状态暂存

```js
/**
 * 场景：表单编辑时暂存原始值
 * 用于实现取消功能和变更检测
 */

function createFormState(initialValues) {
    var original = deepCloneSpecial(initialValues);
    var current = deepCloneSpecial(initialValues);
    var history = [];

    return {
        getOriginal: function() {
            return deepCloneSpecial(original);
        },

        getCurrent: function() {
            return deepCloneSpecial(current);
        },

        updateField: function(field, value) {
            current[field] = value;
        },

        hasChanges: function() {
            return JSON.stringify(original) !== JSON.stringify(current);
        },

        save: function() {
            original = deepCloneSpecial(current);
            history.push(deepCloneSpecial(current));
        },

        revert: function() {
            current = deepCloneSpecial(original);
        },

        undo: function() {
            if (history.length > 0) {
                current = history.pop();
            }
        }
    };
}

// 使用示例
var form = createFormState({
    username: '张三',
    email: 'zhang@example.com',
    profile: { city: '北京' }
});

form.updateField('username', '李四');
form.updateField('profile.city', '上海');

console.log(form.hasChanges());  // true

form.revert();
console.log(form.getCurrent().username);  // "张三"
console.log(form.getCurrent().profile.city);  // "北京"

form.updateField('username', '王五');
form.save();
console.log(form.getCurrent().username);  // "王五"
```

#### 11.4.3 缓存与记忆化

```js
/**
 * 场景：计算结果缓存
 * 避免重复计算复杂对象
 */

function memoizeWithClone(fn, keyGenerator) {
    var cache = new Map();

    return function(...args) {
        var key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

        if (cache.has(key)) {
            // 返回缓存的克隆，避免外部修改
            return deepCloneSpecial(cache.get(key));
        }

        var result = fn.apply(this, args);
        cache.set(key, deepCloneSpecial(result));
        return deepCloneSpecial(result);
    };
}

// 示例：复杂计算
var expensiveOperation = memoizeWithClone(
    function(config) {
        // 模拟复杂计算
        var result = { computed: true, data: config };
        return result;
    },
    function(config) {
        return config.id;  // 自定义缓存 key
    }
);

var obj1 = { id: '1', value: 100 };
var obj2 = { id: '1', value: 200 };  // 相同 id，会命中缓存

var result1 = expensiveOperation(obj1);
var result2 = expensiveOperation(obj2);

console.log(result1 === result2);  // false - 返回的是克隆
console.log(result1.data.value);   // 100 - 原始缓存值
console.log(result2.data.value);   // 100 - 命中缓存
```

### 11.5 问题解决方案汇总

| 问题场景 | 问题描述 | 解决方案 | 代码示例 |
|---------|---------|---------|----------|
| 循环引用 | 对象引用自身导致栈溢出 | WeakMap 记录已拷贝对象 | `if (visited.has(obj))` |
| 函数丢失 | JSON 拷贝丢失函数 | structuredClone / 递归 | `clone.fn = deepClone(fn)` |
| 日期对象 | JSON 拷贝后变成字符串 | 特殊类型处理 | `new Date(obj.time)` |
| 原型丢失 | 拷贝后丢失原型链 | Object.create / getPrototypeOf | `Object.create(Object.getPrototypeOf(obj))` |
| Symbol 键 | 普通拷贝丢失 Symbol 键 | getOwnPropertySymbols | `Object.getOwnPropertySymbols()` |
| 性能问题 | 大对象拷贝慢 | 懒拷贝 / 增量拷贝 | `immer.js` |
| Map/Set | 普通拷贝丢失内部结构 | 特殊类型处理 | `new Map(obj)` |

### 11.6 与相关技术的对比分析

#### 11.6.1 JavaScript 拷贝方案对比

```js
// 方案1：JSON 序列化
var clone1 = JSON.parse(JSON.stringify(obj));
// 优点：简单
// 缺点：无法拷贝函数、undefined、Symbol、Date 变字符串、循环引用报错

// 方案2：Object.assign
var clone2 = Object.assign({}, obj);
// 优点：ES6 原生支持
// 缺点：只拷贝可枚举属性、浅拷贝

// 方案3：扩展运算符
var clone3 = { ...obj };
// 优点：语法简洁
// 缺点：只拷贝第一层、浅拷贝

// 方案4：手写递归
// 优点：完全可控、可处理各种类型
// 缺点：代码复杂、容易遗漏边界情况

// 方案5：structuredClone
var clone4 = structuredClone(obj);
// 优点：原生支持、处理循环引用
// 缺点：较新、无法拷贝函数
```

#### 11.6.2 JavaScript vs Python 拷贝

```js
// JavaScript
var obj = { a: 1, b: { c: 2 } };

// 浅拷贝
var shallow = Object.assign({}, obj);
var shallow2 = { ...obj };

// 深拷贝
var deep = JSON.parse(JSON.stringify(obj));  // 简单深拷贝
// 或者使用递归函数

# Python
import copy

obj = { 'a': 1, 'b': { 'c': 2 } }

# 浅拷贝
shallow = copy.copy(obj)
shallow2 = obj.copy()

# 深拷贝
deep = copy.deepcopy(obj)

// 主要区别：
// 1. Python 有 copy 模块，JavaScript 没有标准库
// 2. Python 的 deepcopy 更完善，自动处理循环引用
// 3. JavaScript 需要手写或使用第三方库
```

#### 11.6.3 拷贝方案对比表

| 特性 | JSON | Object.assign | 扩展运算符 | 递归 | structuredClone |
|-----|------|---------------|-----------|------|----------------|
| 拷贝深度 | 深 | 浅 | 浅 | 深 | 深 |
| 函数 | ✗ | ✓ | ✓ | ✓ | ✗ |
| undefined | ✗ | ✓ | ✓ | ✓ | ✓ |
| Symbol | ✗ | ✓ | ✓ | ✓ | ✓ |
| Date | 转字符串 | ✓ | ✓ | ✓ | ✓ |
| 循环引用 | 报错 | 浅拷贝 | 浅拷贝 | 需处理 | ✓ |
| 原型链 | ✗ | ✗ | ✗ | ✗ | ✓ |
| 性能 | 慢 | 快 | 快 | 慢 | 快 |

---

## 12. ES6+ 新特性

### 12.1 新特性一览

```js
// const/let
const PI = 3.14;
let count = 0;

// 模板字符串
var greeting = `Hello, ${name}`;

// 箭头函数
var add = (a, b) => a + b;

// 解构赋值
var { name, age } = person;
var [first, second] = arr;

// 展开运算符
var arr2 = [...arr, 4, 5];
var obj2 = { ...obj, c: 3 };

// rest 参数
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}

// class
class Animal {
    constructor(name) {
        this.name = name;
    }
    speak() {
        console.log(`${this.name} 叫`);
    }
}

// Promise
new Promise((resolve, reject) => {
    resolve('成功');
});

// async/await
async function fn() {
    var result = await promise;
    return result;
}

// Set
var set = new Set([1, 2, 2, 3]);

// Map
var map = new Map();
map.set('a', 1);

// Module
import { name } from './module';
export const name = 'test';
```

### 12.2 ES6+ 核心特性深入

#### 12.2.1 块级作用域与变量提升

```js
/**
 * ES6 引入了 let 和 const，彻底改变了 JavaScript 的作用域模型
 * 解决了 var 变量提升和函数作用域带来的诸多问题
 */

// var 的问题：变量提升
console.log(x);  // undefined（不是 ReferenceError）
var x = 10;

// var 的问题：函数作用域导致循环变量共享
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// 输出: 3, 3, 3（不是 0, 1, 2）

// let 的解决方案：块级作用域 + TDZ
{
    let blockVar = '块级';
    const constVar = '常量';
}
console.log(blockVar);  // ReferenceError

// let 的解决方案：每次循环创建新变量
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// 输出: 0, 1, 2

// const 的特性
const PI = 3.14159;
PI = 3;  // TypeError: Assignment to constant variable

// const 对象可以修改属性，但不能重新赋值
const user = { name: '张三' };
user.name = '李四';  // 允许
user = {};  // TypeError

// const 数组可以修改元素，但不能重新赋值
const arr = [1, 2, 3];
arr.push(4);  // 允许
arr = [1, 2];  // TypeError
```

#### 12.2.2 箭头函数与 this 绑定

```js
/**
 * 箭头函数的核心特性：
 * 1. 语法简洁
 * 2. 没有自己的 this，继承外层作用域
 * 3. 不能作为构造函数
 * 4. 没有 arguments 对象
 * 5. 不能用作 Generator
 */

// 语法变体
var fn1 = x => x * 2;                    // 单参数，可省略括号
var fn2 = (x, y) => x + y;               // 多参数，必须括号
var fn3 = x => { return x * 2; };        // 多行语句，需要 return
var fn4 = () => ({ a: 1 });              // 返回对象字面量需括号

// this 绑定对比
function Timer() {
    this.time = 0;

    // 普通函数：this 指向新创建的实例
    setInterval(function() {
        this.time++;  // this 指向 window 或 undefined
        console.log(this.time);
    }, 1000);

    // 箭头函数：继承外层 this
    setInterval(() => {
        this.time++;  // this 指向 Timer 实例
        console.log(this.time);
    }, 1000);
}

// 箭头函数不适用的场景
var obj = {
    name: 'obj',
    // 错误：不能用作方法
    getName: () => this.name,  // this 不会指向 obj

    // 错误：不能用作构造函数
    create: () => ({ name: 'new' }),  // 可以，但箭头函数不是构造函数

    // 错误：不能使用 arguments
    log: (...args) => {
        console.log(arguments);  // arguments 未定义
        console.log(...args);    // 应使用 rest 参数
    }
};
```

#### 12.2.3 解构赋值详解

```js
/**
 * 解构赋值允许从数组或对象中提取值，赋给变量
 * 提供了极大的灵活性来处理复杂的数据结构
 */

// 数组解构
var [a, b, c] = [1, 2, 3];
var [first, , third] = [1, 2, 3];  // 跳过中间元素
var [head, ...tail] = [1, 2, 3, 4];  // rest: head=1, tail=[2,3,4]
var [a = 1, b = 2] = [null, undefined];  // 默认值: a=null, b=2

// 对象解构
var { name, age } = { name: '张三', age: 25 };
var { name: userName, age: userAge } = { name: '张三', age: 25 };  // 重命名
var { name = '匿名', age = 0 } = { name: null };  // 默认值: name=null(不生效), age=0

// 嵌套解构
var {
    user: { profile: { avatar } },
    posts: [firstPost]
} = {
    user: { profile: { avatar: 'url' } },
    posts: [{ id: 1 }]
};

// 函数参数解构
function processUser({ name, age, address: { city } = {} }) {
    return `${name}, ${age}岁, 住在${city}`;
}

processUser({ name: '张三', age: 25, address: { city: '北京' } });

// 实际应用：交换变量
[a, b] = [b, a];  // 无需临时变量交换

// 实际应用：解析函数返回
function getUserInfo() {
    return {
        basic: { name: '张三', age: 25 },
        extra: { hobby: '阅读', city: '北京' }
    };
}

var { basic: { name, age }, extra: { hobby, city } } = getUserInfo();
```

#### 12.2.4 Symbol 与迭代器

```js
/**
 * Symbol：新的原始类型，表示唯一的标识符
 * 主要用于对象属性的键，避免属性名冲突
 */

// Symbol 创建
var sym1 = Symbol('description');  // 带描述的 Symbol
var sym2 = Symbol('description');
console.log(sym1 === sym2);  // false - 每个 Symbol 都唯一

// Symbol 用于对象属性
var obj = {};
obj[Symbol('key')] = 'value1';
obj[Symbol('key')] = 'value2';  // 不会覆盖

// 已知 Symbol
Symbol.iterator;  // 迭代器
Symbol.hasInstance;  // instanceof
Symbol.toStringTag;  // Object.prototype.toString
Symbol.toPrimitive;  // 类型转换

// 迭代器协议
var arr = [1, 2, 3];
var iterator = arr[Symbol.iterator]();

console.log(iterator.next());  // { value: 1, done: false }
console.log(iterator.next());  // { value: 2, done: false }
console.log(iterator.next());  // { value: 3, done: false }
console.log(iterator.next());  // { value: undefined, done: true }

// 自定义迭代器
var counter = {
    [Symbol.iterator]: function() {
        var count = 0;
        return {
            next: function() {
                count++;
                return count <= 5
                    ? { value: count, done: false }
                    : { value: undefined, done: true };
            }
        };
    }
};

for (var num of counter) {
    console.log(num);  // 1, 2, 3, 4, 5
}
```

### 12.3 Promise 与 async-await 深入

#### 12.3.1 Promise 状态机

```js
/**
 * Promise 三种状态：
 * 1. pending（待定）- 初始状态
 * 2. fulfilled（已兑现）- 操作成功
 * 3. rejected（已拒绝）- 操作失败
 *
 * 状态转换：
 * pending -> fulfilled
 * pending -> rejected
 * 一旦状态确定，不可逆转
 */

// Promise 创建
var promise = new Promise(function(resolve, reject) {
    // 异步操作
    setTimeout(() => {
        var success = true;
        if (success) {
            resolve('操作成功');
        } else {
            reject(new Error('操作失败'));
        }
    }, 1000);
});

// then/catch/finally
promise
    .then(function(result) {
        console.log(result);  // "操作成功"
        return result.toUpperCase();
    })
    .then(function(upper) {
        console.log(upper);  // "操作成功"
    })
    .catch(function(error) {
        console.error(error);  // 捕获之前的错误
    })
    .finally(function() {
        console.log('操作完成');  // 总是执行
    });

// Promise 静态方法
Promise.all([p1, p2, p3]);    // 所有成功才成功
Promise.allSettled([...]);     // 等待所有完成（无论成功失败）
Promise.race([p1, p2, p3]);   // 最先完成的决定结果
Promise.any([p1, p2, p3]);    // 最先成功的决定结果
Promise.resolve(value);       // 返回成功 Promise
Promise.reject(error);         // 返回失败 Promise
```

#### 12.3.2 async-await 原理

```js
/**
 * async-await 是 Promise 的语法糖
 * async 函数始终返回 Promise
 * await 暂停函数执行，等待 Promise 解决
 */

// async 函数
async function fetchData() {
    return 'data';  // 等同于 return Promise.resolve('data')
}

fetchData().then(console.log);  // "data"

// await 使用
async function process() {
    try {
        var result = await fetchData();  // 等待 Promise 解决
        console.log(result);

        var users = await getUsers();    // 串行等待
        return users;
    } catch (error) {
        console.error(error);  // 捕获错误
    }
}

// 并行执行优化
async function parallel() {
    var [users, posts] = await Promise.all([
        getUsers(),
        getPosts()
    ]);  // 同时发起请求
    return { users, posts };
}

// async 迭代器
async function* asyncGenerator() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
}

for await (var num of asyncGenerator()) {
    console.log(num);
}
```

### 12.4 实际应用场景深入

#### 12.4.1 异步流程控制

```js
/**
 * 场景：按顺序执行一系列异步任务
 * 传统回调方式容易形成回调地狱
 */

// 回调地狱示例
getUser(userId, function(user) {
    getPosts(user.id, function(posts) {
        getComments(posts[0].id, function(comments) {
            getLikes(comments[0].id, function(likes) {
                console.log(likes);
            });
        });
    });
});

// Promise 链式调用
getUser(userId)
    .then(user => getPosts(user.id))
    .then(posts => getComments(posts[0].id))
    .then(comments => getLikes(comments[0].id))
    .then(likes => console.log(likes))
    .catch(error => console.error(error));

// async-await 写法（最接近同步）
async function getUserData() {
    try {
        const user = await getUser(userId);
        const posts = await getPosts(user.id);
        const comments = await getComments(posts[0].id);
        const likes = await getLikes(comments[0].id);
        return likes;
    } catch (error) {
        console.error(error);
    }
}

// 并行优化
async function getUserDataOptimized() {
    try {
        const user = await getUser(userId);

        // 不相关的请求并行执行
        const [posts, followers, following] = await Promise.all([
            getPosts(user.id),
            getFollowers(user.id),
            getFollowing(user.id)
        ]);

        return { user, posts, followers, following };
    } catch (error) {
        console.error(error);
    }
}
```

#### 12.4.2 错误处理模式

```js
/**
 * 场景：统一的错误处理机制
 * 确保所有异步操作都有错误处理
 */

// try-catch 模式
async function fetchUserData(id) {
    try {
        const response = await fetch(`/api/user/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('获取用户数据失败:', error);
        throw error;  // 重新抛出以便调用者处理
    }
}

// 错误边界模式
class AsyncErrorBoundary {
    constructor(fallback) {
        this.fallback = fallback;
    }

    async execute(fn, ...args) {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('Async operation failed:', error);
            return this.fallback;
        }
    }
}

var safeFetch = new AsyncErrorBoundary({ error: true, data: null });
var result = await safeFetch.execute(fetchUserData, 123);
```

### 12.5 问题解决方案汇总

| 问题场景 | 问题描述 | 解决方案 | 代码示例 |
|---------|---------|---------|----------|
| var 提升问题 | 变量在声明前可访问 | 使用 let/const | `let x = 1; // TDZ` |
| this 丢失 | 回调中 this 指向错误 | 箭头函数 | `() => this.fn()` |
| 回调地狱 | 多层嵌套难以阅读 | Promise/async-await | `await fn1(); await fn2()` |
| 异步错误处理 | 错误处理分散 | try-catch/Promise.catch | `try { await fn() } catch` |
| 并行请求 | 需要等待多个请求 | Promise.all | `await Promise.all([p1, p2])` |
| 循环引用对象 | JSON 无法序列化 | structuredClone | `structuredClone(obj)` |
| 模块加载 | 同步加载导致阻塞 | ES Modules / dynamic import | `import('./module.js')` |

### 12.6 与相关技术的对比分析

#### 12.6.1 ES6+ vs TypeScript 类型系统

```js
// ES6+ 特性
var name = '张三';
const PI = 3.14;
let count = 0;

// TypeScript 类型注解
var name: string = '张三';
const PI: number = 3.14;
let count: number = 0;

// 接口
interface User {
    name: string;
    age: number;
    email?: string;  // 可选属性
}

// 类型守卫
function isUser(obj: any): obj is User {
    return 'name' in obj && 'age' in obj;
}

// 泛型
function identity<T>(arg: T): T {
    return arg;
}

var result = identity<string>('hello');

// 联合类型
type Status = 'pending' | 'success' | 'error';

// 交叉类型
type Employee = User & { department: string };
```

#### 12.6.2 JavaScript 迭代器 vs Python 迭代器

```js
// JavaScript 迭代器协议
var arr = [1, 2, 3];
var iterator = arr[Symbol.iterator]();

# Python 迭代器协议
class Counter:
    def __init__(self, max):
        self.max = max
        self.current = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.max:
            raise StopIteration
        self.current += 1
        return self.current

// 主要区别：
// 1. JavaScript 使用 Symbol.iterator 定义迭代器
// 2. Python 使用 __iter__ 和 __next__ 方法
// 3. JavaScript 的迭代器是懒加载的
// 4. Python 的迭代器更面向对象
```

#### 12.6.3 ES6+ 特性对比表

| 特性 | ES5 | ES6+ | 说明 |
|-----|-----|------|------|
| 变量声明 | var | let, const | 块级作用域 |
| 箭头函数 | function | => | 更简洁、this 绑定 |
| 类 | 原型继承 | class 语法 | 语法糖 |
| 模块 | 外部库 | import/export | 原生支持 |
| Promise | 回调 | Promise/async-await | 异步处理 |
| 迭代器 | for循环 | for...of | 统一遍历接口 |
| 解构 | 逐个赋值 | { a, b } = obj | 批量提取 |
| 展开运算符 | apply/concat | ...arr | 更简洁 |
| 模板字符串 | 拼接 | \`str ${x}\` | 更清晰 |
| 默认参数 | `\| \|` | `x = 1` | 更简洁 |
| Map/Set | Object/Array | Map/Set | 专业数据结构 |

---

## 13. undefined vs not defined

```js
// undefined：变量已声明但未赋值
var a;
console.log(a);  // undefined

// not defined：变量未声明
// console.log(b);  // ReferenceError
```

---

## 14. 匿名函数 vs 命名函数

```js
// 匿名函数
var foo = function() {
    console.log('foo');
};

// 命名函数
var baz = function bar() {
    console.log('baz');
};
bar();  // ReferenceError - bar 外部不可访问
```

---

## 15. 函数声明 vs 函数表达式

```js
// 函数声明（可提升）
function sayHello() {
    console.log('Hello');
}

// 函数表达式（不可提升）
var sayHi = function() {
    console.log('Hi');
};
```

---

## 16. 创建私有变量

### 16.1 闭包方式

```js
function Person(name) {
    this.getName = function() {
        return name;
    };
    this.setName = function(newName) {
        name = newName;
    };
}
```

### 16.2 ES2022 private 字段

```js
class Person {
    #name;

    constructor(name) {
        this.#name = name;
    }

    getName() {
        return this.#name;
    }
}
```

---

## 17. this 指向

### 17.1 四种绑定规则

| 调用方式 | this 指向 |
|----------|----------|
| 普通函数调用 | window/undefined |
| 对象方法调用 | 调用方法的对象 |
| 构造函数调用 | new 创建的实例 |
| call/apply/bind | 第一个参数 |

### 17.2 示例

```js
// 普通函数调用
function fn() { console.log(this); }
fn();  // window/undefined

// 对象方法调用
var obj = { name: '张三', sayHi: function() { console.log(this.name); } };
obj.sayHi();  // "张三"

// 箭头函数
var arrow = () => { console.log(this); };
// 箭头函数没有自己的 this，继承外层
```

---

## 18. new 操作符原理

```js
function _new(constructor, ...args) {
    var obj = {};
    Object.setPrototypeOf(obj, constructor.prototype);
    var result = constructor.apply(obj, args);
    return result instanceof Object ? result : obj;
}
```

---

## 19. 变量提升

| 类型 | 提升内容 |
|------|----------|
| var | 声明提升，初始化不提升 |
| let/const | 声明提升，但 TDZ |
| function | 完全提升 |

---

## 20. 浮点数精度问题

```js
// 问题
console.log(0.1 + 0.2);  // 0.30000000000000004

// 解决方案
console.log((0.1 + 0.2).toFixed(10));  // '0.3'

// 金额计算（整数）
var price1 = 0.1 * 100;  // 10
var price2 = 0.2 * 100;  // 20
var sum = (price1 + price2) / 100;  // 0.3
```

---

## 21. Set vs Map

```js
// Set - 值的集合
var set = new Set([1, 2, 2, 3]);
console.log([...set]);  // [1, 2, 3]

// Map - 键值对
var map = new Map();
map.set('a', 1);
map.get('a');  // 1
```

---

## 22. Promise 执行顺序

```js
var promise = new Promise((resolve, reject) => {
    console.log(1);
    resolve();
    console.log(2);
});

promise.then(() => console.log(3));
console.log(4);
// 输出: 1 2 4 3
```

---

## 23. 异步执行顺序

### 宏任务 vs 微任务

| 类型 | 示例 |
|------|------|
| 宏任务 | setTimeout, setInterval, I/O, UI 渲染 |
| 微任务 | Promise.then, MutationObserver, process.nextTick |

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 输出: 1 4 3 2
```

---

## 24. 箭头函数特点

```js
// 没有自己的 this
// 没有 arguments
// 不能用作构造函数
// 没有 prototype

var obj = {
    name: '张三',
    say: () => console.log(this.name)  // 继承外层
};
```

---

## 25. Symbol

```js
var s1 = Symbol('id');
var s2 = Symbol('id');
s1 === s2;  // false

// Symbol.for 全局注册
var s3 = Symbol.for('global');
var s4 = Symbol.for('global');
s3 === s4;  // true
```

---

## 26. call vs apply vs bind

| 方法 | 参数形式 | 执行时机 |
|------|----------|----------|
| call | (this, arg1, arg2, ...) | 立即执行 |
| apply | (this, [args]) | 立即执行 |
| bind | (this, arg1, arg2, ...) | 返回新函数 |

---

## 27. 跨域问题

### 同源策略

同源：协议、域名、端口相同

### 解决方案

| 方案 | 说明 |
|------|------|
| JSONP | 只能 GET |
| CORS | 服务端设置 header |
| nginx 代理 | 服务端转发 |
| postMessage | 跨窗口通信 |
| WebSocket | 不受同源限制 |

---

## 28. JSON vs JSONP

| 特性 | JSON | JSONP |
|------|------|-------|
| 格式 | 数据交换格式 | 跨域数据获取 |
| 作用 | 数据传输 | 跨域请求 |

---

## 29. AJAX 请求步骤

```js
var xhr = new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
    }
};
xhr.send(null);

// Fetch API
fetch(url)
    .then(res => res.json())
    .then(data => console.log(data));
```

---

## 30. GET vs POST

| 特性 | GET | POST |
|------|-----|------|
| 参数位置 | URL 查询参数 | 请求体 |
| 安全性 | 较低 | 较高 |
| 传输大小 | ~8KB | 无限制 |
| 缓存 | 可缓存 | 不可缓存 |

---

## 31. HTTP 状态码

| 分类 | 范围 | 说明 |
|------|------|------|
| 1xx | 100-199 | 信息性 |
| 2xx | 200-299 | 成功 |
| 3xx | 300-399 | 重定向 |
| 4xx | 400-499 | 客户端错误 |
| 5xx | 500-599 | 服务端错误 |

---

## 32. TCP 三次握手

```
客户端 → SYN → 服务器
客户端 ← SYN+ACK ← 服务器
客户端 → ACK → 服务器
```

---

## 33. HTTP 缓存

### 强缓存

- Cache-Control: max-age=3600
- Expires

### 协商缓存

- If-Modified-Since / Last-Modified
- If-None-Match / ETag

---

## 34. 原型链

```js
function Person(name) {
    this.name = name;
}

Person.prototype.sayHi = function() {
    console.log(`Hi, ${this.name}`);
};

var p = new Person('张三');
// p.__proto__ === Person.prototype
// Person.prototype.__proto__ === Object.prototype
// Object.prototype.__proto__ === null
```

---

## 35. instanceof 原理

```js
function _instanceof(left, right) {
    var prototype = right.prototype;
    var proto = left.__proto__;

    while (proto) {
        if (proto === prototype) {
            return true;
        }
        proto = proto.__proto__;
    }

    return false;
}
```

---

## 36. 防抖与节流

### 防抖（Debounce）

```js
function debounce(fn, delay) {
    var timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
```

### 节流（Throttle）

```js
function throttle(fn, delay) {
    var flag = true;
    return function(...args) {
        if (!flag) return;
        flag = false;
        setTimeout(() => {
            fn.apply(this, args);
            flag = true;
        }, delay);
    };
}
```

---

## 37. 数组方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| push | 末尾添加 | 新长度 |
| pop | 末尾删除 | 删除元素 |
| shift | 首位删除 | 删除元素 |
| unshift | 首位添加 | 新长度 |
| splice | 插入/删除 | 数组 |
| slice | 截取 | 新数组 |
| concat | 合并 | 新数组 |
| map | 映射 | 新数组 |
| filter | 过滤 | 新数组 |
| reduce | 汇总 | 任意值 |
| forEach | 遍历 | undefined |
| find | 查找 | 元素/undefined |
| some | 是否存在 | boolean |
| every | 是否都满足 | boolean |

---

## 38. 数组去重

```js
// Set
[...new Set(arr)]

// indexOf
arr.filter((item, index) => arr.indexOf(item) === index)

// reduce
arr.reduce((prev, cur) => {
    return prev.includes(cur) ? prev : [...prev, cur];
}, [])

// 对象键值
var obj = {};
arr.filter(item => obj.hasOwnProperty(item) ? false : (obj[item] = true))
```

---

## 39. 继承方式

### 原型链继承

```js
Child.prototype = new Parent();
```

### 构造函数继承

```js
function Child() {
    Parent.call(this);
}
```

### 组合继承

```js
function Child() {
    Parent.call(this);
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;
```

### ES6 Class 继承

```js
class Child extends Parent {
    constructor() {
        super();
    }
}
```

---

## 40. 事件循环

```js
console.log('1');

setTimeout(() => {
    console.log('2');
    Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve().then(() => console.log('4'));

setTimeout(() => {
    console.log('5');
}, 0);

console.log('6');
// 输出: 1 6 4 2 3 5
```

---

## 41. 模块化

### CommonJS

```js
// 导出
module.exports = { name: 'test' };
exports.fn = function() {};

// 导入
var module = require('./module');
```

### ES Module

```js
// 导出
export const name = 'test';
export function fn() {}

// 默认导出
export default class {}

// 导入
import { name, fn } from './module';
import MyClass from './module';
```

---

## 42. 常见手写题

### 实现数组 flat

```js
function flat(arr, depth = 1) {
    if (depth <= 0) return arr;
    return arr.reduce((prev, cur) => {
        return prev.concat(
            Array.isArray(cur) ? flat(cur, depth - 1) : cur
        );
    }, []);
}
```

### 实现数组 reduce

```js
function reduce(arr, callback, initialValue) {
    var accumulator = initialValue !== undefined ? initialValue : arr[0];
    var startIndex = initialValue !== undefined ? 0 : 1;

    for (var i = startIndex; i < arr.length; i++) {
        accumulator = callback(accumulator, arr[i], i, arr);
    }

    return accumulator;
}
```

### 实现 instanceof

```js
function myInstanceof(left, right) {
    if (left === null || typeof left !== 'object') {
        return false;
    }

    var proto = Object.getPrototypeOf(left);

    while (proto !== null) {
        if (proto === right.prototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }

    return false;
}
```

### 实现 new

```js
function myNew(constructor, ...args) {
    var obj = Object.create(constructor.prototype);
    var result = constructor.apply(obj, args);
    return result instanceof Object ? result : obj;
}
```

### 实现 bind

```js
Function.prototype.myBind = function(context, ...args) {
    var fn = this;
    return function(...args2) {
        return fn.apply(
            this instanceof fn ? this : context,
            [...args, ...args2]
        );
    };
};
```

---

## 43. 常见面试题

### 如何判断数组

```js
Array.isArray([]);
Object.prototype.toString.call([]);
[].constructor === Array;
```

### 0.1 + 0.2 !== 0.3

```js
// 二进制浮点数精度问题
console.log((0.1 + 0.2).toFixed(10) === '0.3');
```

### for vs forEach vs map

```js
// for 可以 break/continue
for (var i = 0; i < arr.length; i++) {
    if (i === 3) break;
}

// forEach 无法中断
arr.forEach(function(item, index) {
    // 无法 break/continue
});

// map 返回新数组
var doubled = arr.map(function(x) { return x * 2; });
```

### Promise 链式调用

```js
Promise.resolve(1)
    .then(x => x + 1)
    .then(x => {
        throw new Error('error');
    })
    .catch(err => 2)
    .then(x => x + 1)
    .then(x => console.log(x)); // 4
```

### async/await 错误处理

```js
async function fn() {
    try {
        var result = await promise;
    } catch (err) {
        console.error(err);
    }
}

async function fn2() {
    var result = await promise.catch(err => {
        console.error(err);
    });
}
```