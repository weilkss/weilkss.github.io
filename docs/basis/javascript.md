# Javascript
javaScript 篇 【包含 ECMAScript 6.0】


## 1. JavaScript 中的强制转型是指什么？

在 JavaScript 中，两种不同的内置类型间的转换被称为强制转型。强制转型在 JavaScript 中有两种形式：显式和隐式

这是一个显式强制转型的例子：

```js
let a = "1";
let b = Number(a);
a; // "1"
b; // 1 -- 是个数字!
```

这是一个隐式强制转型的例子：

```js
let a = "1";
let b = a * 1; // '1' 隐式转型成 1
let c = a + 1; // 1 隐式转换成 '1'
a; // "1"
b; // 1 -- 是个数字!
c; // '11'
```

## 2. JavaScript 中的作用域（scope）是指什么？

在 JavaScript 中，每个函数都有自己的作用域。作用域基本上是变量以及如何通过名称访问这些变量的规则的集合。只有函数中的代码才能访问函数作用域内的变量

同一个作用域中的变量名必须是唯一的。一个作用域可以嵌套在另一个作用域内。如果一个作用域嵌套在另一个作用域内，最内部作用域内的代码可以访问另一个作用域的变量

## 3. 解释 JavaScript 中的相等性。

JavaScript 中有严格比较和类型转换比较：

-   严格比较（例如 ===）在不允许强制转型的情况下检查两个值是否相等；
-   抽象比较（例如 ==）在允许强制转型的情况下检查两个值是否相等。

```js
let a = "1";
let b = 1;
a == b; // true
a === b; // false
```

## 4. 解释什么是回调函数，并提供一个简单的例子

回调函数是可以作为参数传递给另一个函数的函数，并在某些操作完成后执行,
比如 ajax 的 success，error 都是回调函数

```js
function modifyArray(arr, callback) {
    arr.push(100);
    // 执行传进来的 callback 函数
    callback();
}
const arr = [1, 2, 3, 4, 5];
modifyArray(arr, function () {
    console.log("array has been modified", arr);
});
```

## 5. “use strict”的作用是什么？

use strict 出现在 JavaScript 代码的顶部或函数的顶部，可以帮助你写出更安全的 JavaScript 代码。如果你错误地创建了全局变量，它会通过抛出错误的方式来警告你

## 6. 解释 JavaScript 中的 null 和 undefined

JavaScript 中有两种底层类型：null 和 undefined。null 和 undefined 是两个不同的对象，它们代表了不同的含义：

-   尚未初始化：undefined
-   空值：null

## 7. 编写一个可以执行如下操作的函数

> 考察函数的闭包

```js
const addSix = createBase(6);
addSix(10); // 返回 16
addSix(21); // 返回 27
```

可以创建一个闭包来存放传递给函数 createBase 的值。被返回的内部函数是在外部函数中创建的，内部函数就成了一个闭包，它可以访问外部函数中的变量，在本例中是变量 baseNum

```js
function createBase(baseNum) {
    return function (num) {
        // 我们在这里访问 baseNum，即使它是在这个函数之外声明的。
        // JavaScript 中的闭包允许我们这么做。
        return baseNum + num;
    };
}
const addSix = createBase(6);
addSix(10);
addSix(21);
```

## 8. 解释 JavaScript 中的值和类型

JavaScript 提供两种数据类型: 基本数据类型和引用数据类型

**基本数据类型有:**

-   String
-   Number
-   Boolean
-   Null
-   Undefined
-   Symbol【es6】

**引用数据类型有:**

-   Object
-   Array
-   Function
-   Date
-   RegExp
-   Error

## 9. 解释事件冒泡以及如何阻止它？

事件冒泡是指嵌套最深的元素触发一个事件，然后这个事件顺着嵌套顺序在父元素上触发

防止事件冒泡的一种方法是使用 event.cancelBubble 或 event.stopPropagation()（低于 IE 9）

## 10. JavaScript 中的 let 关键字有什么用？

除了可以在函数级别声明变量之外，ES6 还允许你使用 let 关键字在代码块（{..}）中声明变量

## 11. 如何检查一个数字是否为整数？

检查一个数字是小数还是整数，可以使用一种非常简单的方法，就是将它对 1 进行取余，看看是否有余数。

```js
function isInt(num) {
    return num % 1 === 0;
}
```

## 12. 什么是 IIFE（立即调用函数表达式）？

它是立即调用函数表达式（Immediately-Invoked Function Expression），简称 IIFE。函数被创建后立即被执行

```js
(function test() {
    console.log("Hello!");
})();
// "Hello!"
```

在避免污染全局命名空间时经常使用这种模式，因为 IIFE（与任何其他正常函数一样）内部的所有变量在其作用域之外都是不可见的

-   不必为函数命名，避免了污染全局变量
-   立即执行函数内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量
-   封装变量

## 13. 如何在 JavaScript 中比较两个对象？

首先深复制和浅复制只针对像 Object, Array 这样的复杂对象的

-   **浅拷贝**

    > 复制一层对象的属性，并不包括对象里面的为引用类型的数据，当改变拷贝的对象里面的引用类型时，源对象也会改变

    1. for···in 只循环第一层

    ```js
    function simpleCopy(obj1) {
        let obj2 = Array.isArray(obj1) ? [] : {};
        for (let i in obj1) {
            obj2[i] = obj1[i];
        }
        return obj2;
    }
    ```

    2. Object.assign 方法

    ```js
    let obj1 = Object.assign(obj);
    ```

    3. 直接用 `=` 赋值

-   **深拷贝**

    > 重新开辟一个内存空间，需要递归拷贝对象里的引用，直到子属性都为基本类型。两个对象对应两个不同的地址，修改一个对象的属性，不会改变另一个对象的属性

    1. 采用递归去拷贝所有层级属性

    ```js
    function deepClone(obj) {
        let objClone = Array.isArray(obj) ? [] : {};
        if (obj && typeof obj === "object") {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    //判断ojb子元素是否为对象，如果是，递归复制
                    if (obj[key] && typeof obj[key] === "object") {
                        objClone[key] = deepClone(obj[key]);
                    } else {
                        //如果不是，简单复制
                        objClone[key] = obj[key];
                    }
                }
            }
        }
        return objClone;
    }
    ```

    2. 通过 JSON 对象来实现深拷贝

    只是用普通的对象，无法实现对对象中方法的深拷贝，会显示为 undefined

    ```js
    let obj1 = JSON.parse(JSON.stringify(obj));
    ```

    3. 使用扩展运算符实现深拷贝

    ```js
    //对象
    let obj1 = { ...obj };
    //数组
    let arr1 = [...arr];
    ```

    4. 用 concat 实现对数组的深拷贝
    5. 用 slice 实现对数组的深拷贝

## 14. 你能解释一下 ES5 和 ES6 之间的区别吗？

-   ECMAScript 5（ES5）：ECMAScript 的第 5 版，于 2009 年标准化。这个标准已在所有现代浏览器中完全实现
-   ECMAScript 6（ES6）或 ECMAScript 2015（ES2015）：第 6 版 ECMAScript，于 2015 年标准化。这个标准已在大多数现代浏览器中部分实现

**es6 新增特性：**

-   const 与 let 变量
-   字符串扩展
-   for...of 和 for...in
-   展开运算符
-   解构表达式
    -   数组解构
    -   对象解构
-   剩余参数 【arguments 换成 ...params】
-   ES6 箭头函数
-   class 类
-   map 和 reduce
-   promise
-   async 和 await
-   Set 和 Map
-   模块化
    -   import
    -   export

## 15. 解释 JavaScript 中 `undefined` 和 `not defined` 之间的区别

**undefined：** 声明变量未赋值

**not defined：** 未声明未赋值

## 16. 匿名函数和命名函数有什么区别？

```js
let foo = function () {
    // 赋给变量 foo 的匿名函数
    console.log("foo");
};

let baz = function bar() {
    // 赋给变量 baz 的命名函数 bar
    console.log("baz");
};

foo(); // foo
baz(); // baz
bar(); // Uncaught ReferenceError: bar is not defined
```

bar 只是是 baz 变量指向的函数的内部标识符

## 17. 函数的声明和函数表达式

**函数的声明**

```js
function sayHello() {
    // 函数体
}
```

`sayHello()` 能在当前作用域任意地方调用，因为会发生函数声明提前，并且函数体也提前了，函数声明是在预执行期执行的，就是说函数声明是在浏览器准备执行代码的时候执行的

**函数表达式**

```js
let sayHello = function () {};
// or
let sayHello = function bar() {}; /*  */
```

提前调用 `sayHello()` 会报错 `sayHello is not a function` ，因为这个时候 sayHello 声明提升了但是值是 undefined

## 18. Javascript 中的“闭包”是什么？举个例子？

> 闭包是在一个函数中定义的函数，并且可以访问在父函数作用域中声明和定义的变量

闭包可以访问三个作用域中的变量：

-   在自己作用域中声明的变量
-   在父函数中声明的变量
-   在全局作用域中声明的变量

## 19. 如何在 JavaScript 中创建私有变量？

要在 JavaScript 中创建无法被修改的私有变量，你需要将其创建为函数中的局部变量。即使这个函数被调用，也无法在函数之外访问这个变量

```js
function func() {
    let name = "zhang san";
}
```

要访问这个变量，需要创建一个返回私有变量的辅助函数

```js
function func() {
    let name = "zhang san";
    return function () {
        return name;
    };
}

func()(); // zhang san
```

## 20. 请解释原型设计模式

原型模式可用于创建新对象，但它创建的不是非初始化的对象，而是使用原型对象（或样本对象）的值进行初始化的对象。原型模式也称为属性模式

将一个类的原型指向另个一类（实例化对象）的原型，实现对类的原型的共享

## 21. `this` 关键字的原理是什么？

this 的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定 this 到底指向谁，实际上 this 的最终指向的是那个调用它的对象

```js
var o = {
    a: 10,
    b: {
        fn: function () {
            console.log(this.a); //undefined
        },
    },
};

o.b.fn();

// 这个this指向的是对象b
```

这个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，this 指向的也只是它上一级的对象

**构造函数遇到 return 时**

> 构造函数默认 `return this` ，当我们改变 `return` 时，如果返回值是一个对象，那么 this 指向的就是那个返回的对象，如果返回值不是一个对象那么 this 还是指向函数的实例

```js
function Example() {
    this.name = "example";
    // return {
    //   name: 'return'
    // };
    // or
    return 1;
}

let example = new Example();
```

-   还有一点就是虽然 null 也是对象，但是在这里 this 还是指向那个函数的实例，因为 null 比较特殊

**知识点补充：** 在严格版中的默认的 this 不再是 window，而是 undefined

## 22. `new` 关键字，实现一个 `new`

-   创建一个空对象，并使该空对象继承 `Function.prototype`
-   执行构造函数，并将 `this` 指向刚刚创建的新对象
-   返回新对象

**实现一个`new`**

```js
function _new() {
    // 创建一个新对象
    const obj = {};
    // 将构造函数从 arguments 取出
    const fn = [].shift.call(arguments);
    // 新对象的 __proto__ 指向 构造函数的 prototype
    obj.__proto__ = fn.prototype;
    // 绑定 this 实现继承，使obj可以访问构造函数中的属性
    const result = fn.apply(obj, arguments);
    // result是fn的返回值并确保是一个对象
    return result instanceof Object ? result : obj;
}
```

## 23. 什么是 JavaScript 中的提升操作？

提升（hoisting）是 JavaScript 解释器将所有变量和函数声明移动到当前作用域顶部的操作。有两种类型的提升：

**变量提升：** 非常少见

**函数提升：** 常见

## 24. javasscript 浮点数计算问题？

> 因为计算机内部的信息都是由二进制方式表示的，即 0 和 1 组成的各种编码，但由于某些浮点数没办法用二进制准确的表示出来，也就带来了一系列精度问题

**toFixed**

```js
Number((0.1 + 0.2).toFixed(10));
```

工具库 [Math.js](https://github.com/josdejong/mathjs)

## 25. 介绍下 Set、Map 的区别？

应用场景 Set 用于数据重组，Map 用于数据存储

**Set:**

-   成员不能重复

-   键值没有键名，类似数组(3)可以遍历，方法有 add,delete,has

**Map:**

-   本质上是键值对的集合，类似集合

-   可以遍历，可以跟各种数据格式转换。

## 26. Promise 构造函数时同步执行还是异步执行，那么 then 方法呢？

Promise 构造函数时同步执行的，then 方法是异步执行的

```js
const promise = new Promise((resolve, reject) => {
    console.log(1);
    resolve();
    console.log(2);
});

promise.then(() => {
    console.log(3);
});

console.log(4);

// 1 2 4 3
```

## 27. setTimeout、setInterval、Promise、Async/Await 的区别？

事件循环中分为宏任务队列和微任务队列

其中 setTimeout、setInterval 的回调函数放到宏任务队列里，等到执行栈清空以后执行。

promise.then 里的回调函数会放到相应宏任务的微任务队列里，等宏任务里面的同步代码执行完再执行

async 函数表示函数里面可能会有异步方法，await 后面跟一个表达式

async 方法执行时，遇到 await 会立即执行表达式，然后把表达式后面的代码放到微任务队列里，让出执行栈让同步代码先执行

**整理异步编程：**

-   `setTimeout`、`setInterval`
-   ES6 的异步编程： `promise` `generator` `async`
-   `requestAnimationFrame` 和 `requestIdleCallback`

## 28. 使用箭头函数应注意什么？

-   用了箭头函数，this 就不是指向 window，而是父级（指向是可变的）
-   不能够使用 arguments 对象
-   不能用作构造函数，这就是说不能够使用 new 命令，否则会抛出一个错误
-   不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数

## 29. 对 Symbol 的理解？

Symbol 是一种基本类型。Symbol 通过调用 symbol 函数产生，它接收一个可选的名字参数，该函数返回的 symbol 是唯一的

## 30. call、apply、bind 的区别和用法？

call 、bind 、 apply 这三个函数的第一个参数都是 this 的指向对象

-   call 的参数是直接放进去的，第二第三第 n 个参数全都用逗号分隔
-   apply 的所有参数都必须放在一个数组里面传进去
-   bind 除了返回是函数以外，它 的参数和 call 一样
-   call 和 apply 是立即执行函数，bind 是返回了一个改变上下文的一个函数，可以稍后调用

## 31. javascript 的同源策略（跨域问题）

**跨域是什么：** 实际上就是一个网站不能执行其他网站上的网址，是由浏览器同源策略造成的，是浏览器对 js 施加的安全限制

所谓同源，实际上是指域名(host)，协议(http(s))，端口(prot)都相同

**解决跨域：**

1. JSONP 前后端约定一个回调函数，往页面添加一个 script 标签，通过 src 属性去触发对指定地址的请求,故只能是 Get 请求
2. nginx 反向代理
3. 服务端修改 header

    > ```js
    > header("Access-Control-Allow-Origin:*"); //允许所有来源访问
    > header("Access-Control-Allow-Method:POST,GET"); //允许访问的方式
    > ```

4. document.domain 这个只适用于两个页面之间的跨域，可以解决主域相同子域不同
5. window.name
6. postMessage

## 32. JSON 和 JSONP 的区别

**JSON(JavaScript Object Notation)** 是一种轻量级的数据交换格式

-   基于纯文本，跨平台传递极其简单；
-   Javascript 原生支持，后台语言几乎全部支持；
-   轻量级数据格式，占用字符数量极少，特别适合互联网传递；
-   可读性较强，虽然比不上 XML 那么一目了然，但在合理的依次缩进之后还是很容易识别的；
-   容易编写和解析，当然前提是你要知道数据结构；

**JSONP（JSON with Padding）** 是资料格式 JSON 的一种“使用模式”，可以让网页从别的网域要资料

## 33. 什么是 ajax？ajax 作用是什么？

-   异步的 javascript 和 xml AJAX 是一种用于创建快速动态网页的技术
-   ajax 用来与后台交互

## 34. 原生 js ajax 请求有几个步骤？分别是什么

```js
//创建 XMLHttpRequest 对象
var ajax = new XMLHttpRequest();
//规定请求的类型、URL 以及是否异步处理请求。
ajax.open("GET", url, true);
//发送信息至服务器时内容编码类型
ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//发送请求,携带参数
ajax.send(null);
//接受服务器响应数据
ajax.onreadystatechange = function () {
    if (ajax.readyState == 4 && ajax.status == 200) {
        console.log(ajax.responseText);
    }
};
```

## 35. ajax 几种请求方式？他们的优缺点？

常用的 post、get 不常用 delete、put、copy、head、link 等等。

-   get 通过 url 传递参数
-   post 设置请求头 规定请求数据类型，所以 post 相比 get 安全一点
-   get 传输速度比 post 快 根据传参决定的
-   post 传输文件大理论没有限制 get 传输文件小大概 7-8k ie4k 左右
-   get 一般用于获取数据，post 一般用于增删改

## 36. http 常见状态码有哪些？

-   200 (成功) 服务器已成功处理了请求
-   304 (未修改) 自从上次请求后，请求的网页未修改过
-   400 (错误请求) 服务器不理解请求的语法
-   403 (禁止) 服务器拒绝请求
-   404 (未找到) 服务器找不到请求的网页
-   500 (服务器内部错误) 服务器遇到错误，无法完成请求。
-   501 (尚未实施) 服务器不具备完成请求的功能。 例如，服务器无法识别请求方法时可能会返回此代码。
-   502 (错误网关) 服务器作为网关或代理，从上游服务器收到无效响应。
-   503 (服务不可用) 服务器目前无法使用(由于超载或停机维护)。 通常，这只是暂时状态。
-   504 (网关超时) 服务器作为网关或代理，但是没有及时从上游服务器收到请求。
-   505 (HTTP 版本不受支持) 服务器不支持请求中所用的 HTTP 协议版本。

## 37. 在浏览器中输入 URL 到整个页面显示在用户面前时这个过程中到底发生了什么

-   浏览器向 DNS 服务器请求解析该 URL 中的域名所对应的 IP 地址;
-   建立 TCP 连接（三次握手）;
-   浏览器发出读取文件(URL 中域名后面部分对应的文件)的 HTTP 请求，该请求报文作为 TCP 三次握手的第三个报文的数据发送给服务器;
-   服务器对浏览器请求作出响应，并把对应的 html 文本发送给浏览器;
-   浏览器将该 html 文本并显示内容;
-   释放 TCP 连接（四次挥手）;

## 38. 解释下 TCP 连接三次握手？

**第一次握手：** 建立连接时，客户端发送 syn 包（syn=x）到服务器，并进入 SYN_SENT 状态，等待服务器确认；SYN：同步序列编号（Synchronize Sequence Numbers）

**第二次握手：** 服务器收到 syn 包，必须确认客户的 SYN（ack=x+1），同时自己也发送一个 SYN 包（syn=y），即 SYN+ACK 包，此时服务器进入 SYN_RECV 状态

**第三次握手：** 客户端收到服务器的 SYN+ACK 包，向服务器发送确认包 ACK(ack=y+1），此包发送完毕，客户端和服务器进入 ESTABLISHED（TCP 连接成功）状态，完成三次握手

**关闭时第四次挥手过程理解:**

因为当 服务器到 客户端的 SYN 连接请求报文后，可以直接发送 SYN+ACK 报文。其中 ACK 报文是用来应答的，SYN 报文是用来同步的。但是关闭连接时，当 服务端收到 FIN 报文时，很可能并不会立即关闭 SOCKET，所以只能先回复一个 ACK 报文，告诉 客户端，"你发的 FIN 报文我收到了"。只有等到我 服务端所有的报文都发送完了，我才能发送 FIN 报文，因此不能一起发送。故需要四步握手

## 39. http 缓存？

> 当客户端向服务器请求资源时，会先抵达浏览器缓存，如果浏览器有`要请求资源`的副本，就可以直接从浏览器缓存中提取而不是从原始服务器中提取这个资源

**强制缓存：**

强制缓存在缓存数据未失效的情况下（即 Cache-Control 的 max-age 没有过期或者 Expires 的缓存时间没有过期），那么就会直接使用浏览器的缓存数据，不会再向服务器发送任何请求 强制缓存生效时，http 状态码为 200

**协商缓存：**

当第一次请求时服务器返回的响应头中没有 Cache-Control 和 Expires 或者 Cache-Control 和 Expires 过期还或者它的属性设置为 no-cache 时(即不走强缓存)，那么浏览器第二次请求时就会与服务器进行协商，与服务器端对比判断资源是否进行了修改更新。如果服务器端的资源没有修改，那么就会返回 304 状态码，告诉浏览器可以使用缓存中的数据，这样就减少了服务器的数据传输压力

当浏览器第一次向服务器发送请求时，会在响应头中返回协商缓存的头属性：ETag 和 Last-Modified,其中 ETag 返回的是一个 hash 值，Last-Modified 返回的是 GMT 格式的最后修改时间。然后浏览器在第二次发送请求的时候，会在请求头中带上与 ETag 对应的 If-Not-Match，其值就是响应头中返回的 ETag 的值，Last-Modified 对应的 If-Modified-Since。服务器在接收到这两个参数后会做比较，如果返回的是 304 状态码，则说明请求的资源没有修改，浏览器可以直接在缓存中取数据，否则，服务器会直接返回数据

## 40. 为什么要使用 HTTP 缓存 ？

1. 减少了冗余的数据传输，节省了网费。
2. 缓解了服务器的压力， 大大提高了网站的性能
3. 加快了客户端加载网页的速度

## 41. 浏览器缓存

浏览器缓存有：cookie、sessionStorage、localStorage

| 本地缓存       | 容量 | 描述                                                                                           |
| -------------- | ---- | ---------------------------------------------------------------------------------------------- |
| cookie         | 4kb  | 1. 兼容各种浏览器 <br> 2. 每次都会和后台交互 <br> 3. 可设置过期时间                            |
| sessionStorage | 5M   | 1. h5 新特性，有兼容性问题 <br> 2. 不会和后台交互 <br> 3. 会话关闭，缓存失效                   |
| localStorage   | 5M   | 1. h5 新特性，有兼容性问题 <br> 2. 不会和后台交互 <br> 3. 本地缓存，除非手动删除，不然一直存在 |

## 42. 什么是 CDN 缓存

CDN 是一种部署策略,根据不同的地区部署类似 nginx 这种服务服务,会缓存静态资源.前端在项目优化的时候,习惯在静态资源上加上一个 hash 值,每次更新的时候去改变这个 hash,hash 值变化的时候,服务会去重新取资源

## 43. 线程,进程

-   线程是最小的执行单元,进程是最小的资源管理单元
-   一个线程只能属于一个进程,而一个进程可以有多个线程,但至少有一个线程(一般情况)

## 44. javascript 中常见的内存泄露陷阱

-   内存泄露会导致一系列问题,比如:运行缓慢,崩溃,高延迟
-   内存泄露是指你用不到(访问不到)的变量,依然占居着内存空间,不能被再次利用起来
-   意外的全局变量,这些都是不会被回收的变量(除非设置 null 或者被重新赋值),特别是那些用来临时存储大量信息的变量

## 45. 什么是原型和原型链

原型就是一个对象的属性而已，可以通过 `__proto__` 来访问，但是这不是标准属性，什么叫不是标准属性?就是可能以后浏览器按照标准更新之后你就没法通过 `__proto__` 来获取对象原型了。建议获取对象的原型方法通过 Reflect.getPrototypeOf(obj)。

好了你已经知道了原型其实就是对象上的一个属性，那么原型其实可以是任意类型，你可以直接修改 obj.`__proto__` = null，改就是了。原型的特性或者说说对象上有个属性 `__proto__` 的特性是当你访问一个对象 obj 时，如果 obj 本身没有这个属性，那么就会去它的原型，也就是 obj.`__proto__` 去获取这个属性。如果还是找不到并且这个原型是个对象，正常情况下对象都有原型，所以会继续往原型的原型也就是 obj.`__proto__`.`__proto__`，上去找这个属性。这样原型和原型之间构成的链就叫原型链

## 46. ES5 与 ES6 继承的区别

ES5 的继承实质上是先创建子类的实例对象，然后再将父类的方法添加到 this 上

ES6 的继承机制完全不同，实质上是先创建父类的实例对象 this（所以必须先调用父类的 super()方法），然后再用子类的构造函数修改 this

## 47. 箭头函数和普通函数有什么不同？

-   箭头函数是匿名函数，不能作为构造函数，不能使用 new
-   箭头函数不能绑定 arguments，取而代之用 rest 参数 `...` 解决
-   箭头函数没有原型属性
-   箭头函数的 this 永远指向其上下文的 this，没有办改变其指向，普通函数的 this 指向调用它的对象
-   箭头函数不绑定 this，会捕获其所在的上下文的 this 值，作为自己的 this 值

## 48. 如何造成闭包函数内存泄漏

内部函数 被 外部函数 包含时，内部函数会将外部函数的局部活动对象添加到自己的作用域链中

```js
outerFun(outerArgument){
    // 被包含的内部函数可以访问外部函数的变量
    return function(){
        return outerArgument+1
    }
}
```

而由于内部匿名函数的作用域链 在引用 外部包含函数的活动对象 ，即使 outFun 执行完毕了，它的活动对象还是不会被销毁，即，outerFun 的执行环境作用域链都销毁了，它的活动对象还在内存中留着呢

并且根据垃圾回收机制，被另一个作用域引用的变量不会被回收

```js
// 创建函数 还未调用
let creatFun = outerFun(7);
// 调用函数
let result = creatFun(8);
// 解除对匿名函数的引用
creatFun = null;
```

## 49. 闭包如何减少内存占用？

如果没有对匿名函数的引用，匿名函数执行完之后自动销毁，就可以做到减少占用内存的问题。

利用匿名函数，制造私有作用域（块级作用域），这样匿名函数执行完之后可以将引用的活动对象销毁

## 49. 什么是作用域

作用域就是一个独立的地盘，让变量不会外泄、暴露出去。也就是说作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突

ES6 之前 JavaScript 没有块级作用域,只有全局作用域和函数作用域。ES6 的到来，为我们提供了‘块级作用域’,可通过新增命令 let 和 const 来体现

```js
// 匿名函数 模仿 块级作用域
(function () {
    // 此处为块级作用域
    // 这里面的变量都会在函数执行完之后释放内存
})();
```

## 50. 什么是防抖节流防抖节流？怎么实现

**防抖(debounce)**

所谓防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间

比如滚动事件监听

```js
function debounce(fn, delay) {
    let timer = null; //借助闭包
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(fn, delay); // 简化写法
    };
}
// 然后是旧代码
function showTop() {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    console.log("滚动条位置：" + scrollTop);
}
window.onscroll = debounce(showTop, 1000); // 为了方便观察效果我们取个大点的间断值，实际使用根据需要来配置
```

**节流(throttle)**

我们可以设计一种类似控制阀门一样定期开放的函数，也就是让函数执行一次后，在某个时间段内暂时失效，过了这段时间后再重新激活（类似于技能冷却时间

但是这里不只是指定固定时间，也可以是是时间戳差值，也可以用回调函数（比如异步请求成功后回调打开开关）

```js
// 指定时间
function throttle(fn, delay) {
  let valid = true;
  return function () {
    if (!valid) {
      //休息时间 暂不接客
      return false;
    }
    // 工作时间，执行函数并且在间隔期内把状态位设为无效
    valid = false;
    setTimeout(() => {
      fn();
      valid = true;
    }, delay);
  };
}

function throttle(fn)
  let valid = true;
  return function () {
    if (!valid) {
      //休息时间 暂不接客
      return false;
    }
    valid = false;
    // 给我们的方法传一个回调过去，在方法里异步请求完成然后执行回调就ok了
    fn(functin(){
      valid = true
    });
  };
}
```

## 51. JS 设计模式之 Mixin（混入）模式

> Mixin 模式就是一些提供能够被一个或者一组子类简单继承功能的类,意在重用其功能

**优点**

有助于减少系统中的重复功能及增加函数复用。当一个应用程序可能需要在各种对象实例中共享行为时，我们可以通过在 Mixin 中维持这种共享功能并专注于仅实现系统中真正不同的功能，来轻松避免任何重复。

**缺点**

有些人认为将功能注入对象原型中会导致原型污染和函数起源方面的不确定性。

## 52. js 实现常用数据结构

-   栈
-   队列
-   链表
-   哈希表
-   树