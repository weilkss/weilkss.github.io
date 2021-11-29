<img style="width:100%" src="http://file.weilkss.cn/javasciriot111111.jpeg" />

### 创建 `Array` 对象的语法：

```js
new Array();
new Array(size);
new Array(element0, element1, ..., elementn);
```

### 参数

参数 `size` 是期望的数组元素个数。返回的数组，`length` 字段将被设为 `size` 的值。

参数 `element` `...`, `elementn` 是参数列表。当使用这些参数来调用构造函数 `Array()` 时，新创建的数组的元素就会被初始化为这些值。它的 `length` 字段也会被设置为参数的个数。

### 返回值

返回新创建并被初始化了的数组。

## `Array` 对象属性

| 属性        | 描述                             |
| ----------- | -------------------------------- |
| constructor | 返回对创建此对象的数组函数的引用 |
| length      | 设置或返回数组中元素的数目       |
| prototype   | 使您有能力向对象添加属性和方法   |

## `Array` 对象方法

### Array.from()

> `Array.from()` 方法从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例

#### 语法

```js
const ary = Array.from(arrayLike[, mapFn[, thisArg]])
```

| 参数      | 描述                                  |
| --------- | ------------------------------------- |
| arrayLike | 返回对创建此对象的数组函数的引用      |
| mapFn     | `可选` 设置或返回数组中元素的数目     |
| thisArg   | `可选` 使您有能力向对象添加属性和方法 |

**返回值：** ary 返回一个新的数组实例

#### 示例

- **从 String 生成数组**

```js
Array.from("foo");
// [ "f", "o", "o" ]
```

- **从 Set 生成数组**

```js
const set = new Set(["foo", "bar", "baz", "foo"]);
Array.from(set);
// [ "foo", "bar", "baz" ]
```

- **从 Map 生成数组**

```js
const map = new Map([
  [1, 2],
  [2, 4],
  [4, 8],
]);
Array.from(map);
// [[1, 2], [2, 4], [4, 8]]

const mapper = new Map([
  ["1", "a"],
  ["2", "b"],
]);
Array.from(mapper.values());
// ['a', 'b'];

Array.from(mapper.keys());
// ['1', '2'];
```

- **从类数组对象 `arguments` 生成数组**

```js
function f() {
  return Array.from(arguments);
}

f(1, 2, 3);
// [ 1, 2, 3 ]
```

- **在 `Array.from`中使用箭头函数**

```js
Array.from([1, 2, 3], (x) => x + x);
// [2, 4, 6]

Array.from({ length: 5 }, (v, i) => i);
//
```

- **数组去重合并**

```js
function combine() {
  let arr = [].concat.apply([], arguments);
  return Array.from(new Set(arr));
}

var m = [1, 2, 2],
  n = [2, 3, 3];
console.log(combine(m, n)); // [1, 2, 3]
```

### Array.isArray()

> `Array.isArray()` 用于确定传递的值是否是一个 `Array`

#### 语法

```js
const isArray = Array.isArray(obj);
```

| 参数 | 描述         |
| ---- | ------------ |
| obj  | 需要检测的值 |

**返回值：** 如果值是 Array，isArray 则为 true; 否则为 false

#### 示例

```js
// 下面的函数调用都返回 true
Array.isArray([]);
Array.isArray([1]);
Array.isArray(new Array());
Array.isArray(new Array("a", "b", "c", "d"));
// 鲜为人知的事实：其实 Array.prototype 也是一个数组。
Array.isArray(Array.prototype);

// 下面的函数调用都返回 false
Array.isArray();
Array.isArray({});
Array.isArray(null);
Array.isArray(undefined);
Array.isArray(17);
Array.isArray("Array");
Array.isArray(true);
Array.isArray(false);
Array.isArray(new Uint8Array(32));
Array.isArray({ __proto__: Array.prototype });
```

### Array.of()

> `Array.of()` 方法创建一个具有可变数量参数的新数组实例，而不考虑参数的数量或类型

#### 语法

```js
const ary = Array.of(element0[, element1[, ...[, elementN]]])
```

| 参数     | 描述                                     |
| -------- | ---------------------------------------- |
| elementN | 任意个参数，将按顺序成为返回数组中的元素 |

**返回值：** 返回新的 Array 实例

#### 示例

```js
Array.of(1); // [1]
Array.of(1, 2, 3); // [1, 2, 3]
Array.of(undefined); // [undefined]
```

- **兼容旧环境**

> 如果原生不支持的话，在其他代码之前执行以下代码会创建 `Array.of()`

```js
if (!Array.of) {
  Array.of = function () {
    return Array.prototype.slice.call(arguments);
  };
}
```

### Array.prototype.concat()

> `concat()` 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组

#### 语法

```js
const newArray = oldArray.concat(value1[, value2[, ...[, valueN]]])
```

| 参数   | 描述                                                                                                      |
| ------ | --------------------------------------------------------------------------------------------------------- |
| valueN | 将数组和/或值连接成新数组。如果省略了 valueN 参数参数，则 concat 会返回一个它所调用的已存在的数组的浅拷贝 |

**返回值：** 新的 Array 实例

#### 示例

- **连接两个数组**

```js
const alpha = ["a", "b", "c"];
const numeric = [1, 2, 3];

const newary = alpha.concat(numeric);

// newary in ['a', 'b', 'c', 1, 2, 3]
```

- **连接三个数组**

```js
const num1 = [1, 2, 3],
  num2 = [4, 5, 6],
  num3 = [7, 8, 9];

const nums = num1.concat(num2, num3);

// nums in [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

- **将值连接到数组**

```js
const alpha = ["a", "b", "c"];

const alphaNumeric = alpha.concat(1, [2, 3]);

// alphaNumeric in ['a', 'b', 'c', 1, 2, 3]
```

- **合并嵌套数组**

```js
const num1 = [[1]];
const num2 = [2, [3]];
const num3 = [5, [6]];

const nums = num1.concat(num2);
// nums is [[1], 2, [3]]

const nums2 = num1.concat(4, num3);
// nums2 is [[1], 4, 5,[6]]

num1[0].push(4);
// nums is [[1, 4], 2, [3]]
```

### Array.prototype.copyWithin()

> `copyWithin()` 方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度

#### 语法

```js
arr.copyWithin(target[, start[, end]])
```

| 参数   | 描述                                                                                                                                                                                                             |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| target | 0 为基底的索引，复制序列到该位置。 如果是负数，target 将从末尾开始计算,如果 target 大于等于 arr.length，将会不发生拷贝。如果 target 在 start 之后，复制的序列将被修改以符合 arr.length                           |
| start  | 0 为基底的索引，开始复制元素的起始位置。如果是负数，start 将从末尾开始计算,如果 start 被忽略，copyWithin 将会从 0 开始复制                                                                                       |
| end    | 0 为基底的索引，开始复制元素的结束位置。copyWithin 将会拷贝到该位置，但不包括 end 这个位置的元素。如果是负数， end 将从末尾开始计算 .如果 end 被忽略，copyWithin 方法将会一直复制至数组结尾（默认为 arr.length） |

**返回值：** 返回改变后的数组

#### 示例

```js
[1, 2, 3, 4, 5].copyWithin(-2)
// [1, 2, 3, 1, 2]

[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]

[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

[1, 2, 3, 4, 5].copyWithin(-2, -3, -1)
// [1, 2, 3, 3, 4]

[].copyWithin.call({length: 5, 3: 1}, 0, 3);
// {0: 1, 3: 1, length: 5}

//ES2015 Typed Arrays是Array的子​​类
const i32a = new Int32Array([1, 2, 3, 4, 5]);

i32a.copyWithin(0, 2);
// Int32Array [3, 4, 5, 4, 5]

[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]
```

### Array.prototype.entries()

> `entries()` 方法返回一个新的 `Array Iterator` 对象，该对象包含数组中每个索引的键/值对

#### 语法

```js
arr.entries();
```

**返回值：** 返回 一个新的 Array 迭代器对象

#### 示例

- **Array Iterator**

```js
const arr = ["a", "b", "c"];
const iterator = arr.entries();

console.log(iterator);
/*Array Iterator {}
         __proto__:Array Iterator
         next:ƒ next()
         Symbol(Symbol.toStringTag):"Array Iterator"
         __proto__:Object
*/
```

- **iterator.next()**

```js
const arr = ["a", "b", "c"];
const iterator = arr.entries();

console.log(iterator.next());
/*{value: Array(2), done: false}
          done:false
          value:(2) [0, "a"]
           __proto__: Object
*/
// iterator.next()返回一个对象，对于有元素的数组，
// 是next{ value: Array(2), done: false }；
// next.done 用于指示迭代器是否完成：在每次迭代时进行更新而且都是false，
// 直到迭代器结束done才是true。
// next.value是一个["key","value"]的数组，是返回的迭代器中的元素值。
```

- **iterator.next 方法运行**

```js
const arr = ["a", "b", "c"];
const iter = arr.entries();
const a = [];

// for(var i=0; i< arr.length; i++){   // 实际使用的是这个
for (let i = 0; i < arr.length + 1; i++) {
  // 注意，是length+1，比数组的长度大
  const tem = iter.next(); // 每次迭代时更新next

  console.log(tem.done); // 这里可以看到更新后的done都是false
  if (tem.done !== true) {
    // 遍历迭代器结束done才是true
    console.log(tem.value);
    a[i] = tem.value;
  }
}

console.log(a); // 遍历完毕，输出next.value的数组
```

- **二维数组按行排序**

```js
function sortArr(arr) {
  let goNext = true;
  const entries = arr.entries();
  while (goNext) {
    const result = entries.next();
    if (result.done !== true) {
      result.value[1].sort((a, b) => a - b);
      goNext = true;
    } else {
      goNext = false;
    }
  }
  return arr;
}

const arr = [
  [1, 34],
  [456, 2, 3, 44, 234],
  [4567, 1, 4, 5, 6],
  [34, 78, 23, 1],
];
sortArr(arr);

/*(4) [Array(2), Array(5), Array(5), Array(4)]
    0:(2) [1, 34]
    1:(5) [2, 3, 44, 234, 456]
    2:(5) [1, 4, 5, 6, 4567]
    3:(4) [1, 23, 34, 78]
    length:4
    __proto__:Array(0)
*/
```

- **使用 for…of 循环**

```js
const arr = ["a", "b", "c"];
const iterator = arr.entries();
// undefined

for (let e of iterator) {
  console.log(e);
}

// [0, "a"]
// [1, "b"]
// [2, "c"]
```

### Array.prototype.every()

> `every()` 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值

- **注意：** 若收到一个空数组，此方法在一切情况下都会返回 true

#### 语法

```js
arr.every(callback[, thisArg])
```

| 参数     | 描述                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| callback | 用来测试每个元素的函数，它可以接收三个参数:`element:用于测试的当前值`,`index:用于测试的当前值的索引`,`array:调用 every 的当前数组` |
| thisArg  | 任意个参数，将按顺序成为返回数组中的元素                                                                                           |

**返回值：** 如果回调函数的每一次返回都为 truthy 值，返回 true ，否则返回 false

#### 示例

- **检测所有数组元素的大小**

```js
function isBigEnough(element, index, array) {
  return element >= 10;
}
[12, 5, 8, 130, 44].every(isBigEnough); // false
[12, 54, 18, 130, 44].every(isBigEnough); // true
```

- **使用箭头函数**

```js
[12, 5, 8, 130, 44].every((x) => x >= 10); // false
[12, 54, 18, 130, 44].every((x) => x >= 10); // true
```

### Array.prototype.fill()

> `fill()` 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。

#### 语法

```js
arr.fill(value[, start[, end]])
```

| 参数  | 描述                                   |
| ----- | -------------------------------------- |
| value | 用来填充数组元素的值                   |
| start | 起始索引，默认值为 0`[可选]`           |
| end   | 终止索引，默认值为 this.length`[可选]` |

**返回值：** 修改后的数组

#### 示例

```js
[1, 2, 3].fill(4); // [4, 4, 4]
[1, 2, 3].fill(4, 1); // [1, 4, 4]
[1, 2, 3].fill(4, 1, 2); // [1, 4, 3]
[1, 2, 3].fill(4, 1, 1); // [1, 2, 3]
[1, 2, 3].fill(4, 3, 3); // [1, 2, 3]
[1, 2, 3].fill(4, -3, -2); // [4, 2, 3]
[1, 2, 3].fill(4, NaN, NaN); // [1, 2, 3]
[1, 2, 3].fill(4, 3, 5); // [1, 2, 3]
Array(3).fill(4); // [4, 4, 4]
[].fill.call({ length: 3 }, 4); // {0: 4, 1: 4, 2: 4, length: 3}

// Objects by reference.
var arr = Array(3).fill({}); // [{}, {}, {}];
// 需要注意如果fill的参数为引用类型，会导致都执行都一个引用类型
// 如 arr[0] === arr[1] 为true
arr[0].hi = "hi"; // [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]
```

### Array.prototype.filter()

> `filter()` 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

#### 语法

```js
var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
```

| 参数     | 描述                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| callback | 1.`element`-数组中当前正在处理的元素;2.`index[可选]`-正在处理的元素在数组中的索引;3.`array[可选]`-调用了 filter 的数组本身 |
| thisArg  | 执行 `callback` 时，用于 `this` 的值                                                                                       |

**返回值：** 返回一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组

#### 示例

- **筛选排除所有较小的值**

下例使用 `filter` 创建了一个新数组，该数组的元素由原数组中值大于 `10` 的元素组成

```js
function isBigEnough(element) {
  return element >= 10;
}
const filtered = [12, 5, 8, 130, 44].filter(isBigEnough);
// filtered is [12, 130, 44]
```

- **过滤 JSON 中的无效条目**

以下示例使用 `filter()` 创建具有非零 `id` 的元素的 `json`

```js
var arr = [
  { id: 15 },
  { id: -1 },
  { id: 0 },
  { id: 3 },
  { id: 12.2 },
  {},
  { id: null },
  { id: NaN },
  { id: "undefined" },
];

var invalidEntries = 0;

function isNumber(obj) {
  return obj !== undefined && typeof obj === "number" && !isNaN(obj);
}

function filterByID(item) {
  if (isNumber(item.id) && item.id !== 0) {
    return true;
  }
  invalidEntries++;
  return false;
}

var arrByID = arr.filter(filterByID);

console.log("Filtered Array\n", arrByID);
// Filtered Array
// [{ id: 15 }, { id: -1 }, { id: 3 }, { id: 12.2 }]

console.log("Number of Invalid Entries = ", invalidEntries);
// Number of Invalid Entries = 5
```

- **在数组中搜索**

下例使用 `filter()` 根据搜索条件来过滤数组内容

```js
var fruits = ["apple", "banana", "grapes", "mango", "orange"];

/**
 * Array filters items based on search criteria (query)
 */
function filterItems(query) {
  return fruits.filter(function (el) {
    return el.toLowerCase().indexOf(query.toLowerCase()) > -1;
  });
}

console.log(filterItems("ap")); // ['apple', 'grapes']
console.log(filterItems("an")); // ['banana', 'mango', 'orange']
```

- **ES2015 实现**

```js
const fruits = ["apple", "banana", "grapes", "mango", "orange"];

/**
 * 数组根据搜索条件过滤项目（查询）
 */
const filterItems = (query) => {
  return fruits.filter(
    (el) => el.toLowerCase().indexOf(query.toLowerCase()) > -1
  );
};

console.log(filterItems("ap")); // ['apple', 'grapes']
console.log(filterItems("an")); // ['banana', 'mango', 'orange']
```

### Array.prototype.find()

> `find()` 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 `undefined`

#### 语法

```js
arr.find(callback[, thisArg])
```

| 参数     | 描述                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| callback | 1.`element`-当前遍历到的元素;2.`index[可选]`-当前遍历到的索引;3.`array[可选]`-数组本身 |
| thisArg  | 执行 `callback` 时，用于 `this` 的值                                                   |

**返回值：** 数组中第一个满足所提供测试函数的元素的值，否则返回 undefined

#### 示例

- **用对象的属性查找数组里的对象**

```js
var inventory = [
  { name: "apples", quantity: 2 },
  { name: "bananas", quantity: 0 },
  { name: "cherries", quantity: 5 },
];

function findCherries(fruit) {
  return fruit.name === "cherries";
}

console.log(inventory.find(findCherries)); // { name: 'cherries', quantity: 5 }
```

- **寻找数组中的质数**

```js
function isPrime(element, index, array) {
  var start = 2;
  while (start <= Math.sqrt(element)) {
    if (element % start++ < 1) {
      return false;
    }
  }
  return element > 1;
}

console.log([4, 6, 8, 12].find(isPrime)); // undefined, not found
console.log([4, 5, 8, 12].find(isPrime)); // 5
```

### Array.prototype.findIndex()

> `findIndex()`方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回 `-1`

#### 语法

```js
arr.findIndex(callback[, thisArg])
```

| 参数     | 描述                                                                                      |
| -------- | ----------------------------------------------------------------------------------------- |
| callback | 1.`element`-当前元素;2.`index[可选]`-当前元素的索引;3.`array[可选]`-调用 findIndex 的数组 |
| thisArg  | 执行 `callback` 时，用于 `this` 的值 `[可选]`                                             |

**返回值：** 数组中通过提供测试函数的第一个元素的索引。否则，返回-1

#### 示例

- **查找数组中首个质数元素的索引**

以下示例查找数组中素数的元素的索引（如果不存在素数，则返回-1）

```js
function isPrime(element, index, array) {
  var start = 2;
  while (start <= Math.sqrt(element)) {
    if (element % start++ < 1) {
      return false;
    }
  }
  return element > 1;
}

console.log([4, 6, 8, 12].findIndex(isPrime)); // -1, not found
console.log([4, 6, 7, 12].findIndex(isPrime)); // 2
```

### Array.prototype.flat()

> `flat()` 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回

#### 语法

```js
var newArray = arr.flat([depth]);
```

| 参数  | 描述                                              |
| ----- | ------------------------------------------------- |
| depth | 指定要提取嵌套数组的结构深度，默认值为 1 `[可选]` |

**返回值：** 返回一个包含将数组与子数组中所有元素的新数组

#### 示例

- **扁平化嵌套数组**

```js
var arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

//使用 Infinity，可展开任意深度的嵌套数组
var arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

- **扁平化与数组空项**

```js
var arr4 = [1, 2, , 4, 5];
arr4.flat();
// [1, 2, 4, 5]
```

### Array.prototype.flatMap()

> `flatMap()` 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组

#### 语法

```js
var new_array = arr.flatMap(function callback(currentValue[, index[, array]]) {
    // return element for new_array
}[, thisArg])
```

| 参数     | 描述                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| callback | 1.`currentValue`-当前正在数组中处理的元素;2.`index[可选]`-数组中正在处理的当前元素的索引;3.`array[可选]`-被调用的 `map` 数组 |
| thisArg  | 执行 `callback` 时，用于 `this` 的值 `[可选]`                                                                                |

**返回值：** 一个新的数组，其中每个元素都是回调函数的结果，并且结构深度 depth 值为 1

#### 示例

- **map() 与 flatMap()**

```js
var arr1 = [1, 2, 3, 4];

arr1.map((x) => [x * 2]);
// [[2], [4], [6], [8]]

arr1.flatMap((x) => [x * 2]);
// [2, 4, 6, 8]

// only one level is flattened
arr1.flatMap((x) => [[x * 2]]);
// [[2], [4], [6], [8]]
```

### Array.prototype.forEach()

> `forEach()` 方法对数组的每个元素执行一次给定的函数

#### 语法

```js
arr.forEach(callback(currentValue [, index [, array]])[, thisArg])
```

| 参数     | 描述                                                                                                                                    |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| callback | 1.`currentValue`-数组中正在处理的当前元素;2.`index[可选]`-数组中正在处理的当前元素的索引;3.`array[可选]`-`forEach()` 方法正在操作的数组 |
| thisArg  | 执行 `callback` 时，用于 `this` 的值 `[可选]`                                                                                           |

**返回值：** undefined

#### 示例

- **不对未初始化的值进行任何操作（稀疏数组**

```js
const arraySparse = [1, 3, , 7];
let numCallbackRuns = 0;

arraySparse.forEach(function (element) {
  console.log(element);
  numCallbackRuns++;
});

console.log("numCallbackRuns: ", numCallbackRuns);

// 1
// 3
// 7
// numCallbackRuns: 3
```

- **将 for 循环转换为 forEach**

```js
const items = ["item1", "item2", "item3"];
const copy = [];

// before
for (let i = 0; i < items.length; i++) {
  copy.push(items[i]);
}

// after
items.forEach(function (item) {
  copy.push(item);
});
```

- **打印出数组的内容**

```js
function logArrayElements(element, index, array) {
  console.log("a[" + index + "] = " + element);
}

// 注意索引 2 被跳过了，因为在数组的这个位置没有项
[2, 5, , 9].forEach(logArrayElements);
// logs:
// a[0] = 2
// a[1] = 5
// a[3] = 9
```

- **使用 thisArg**

```js
function Counter() {
  this.sum = 0;
  this.count = 0;
}
Counter.prototype.add = function (array) {
  array.forEach(function (entry) {
    this.sum += entry;
    ++this.count;
  }, this);
  // ^---- Note
};

const obj = new Counter();
obj.add([2, 5, 9]);
obj.count;
// 3 === (1 + 1 + 1)
obj.sum;
// 16 === (2 + 5 + 9)
```

- **对象复制器函数**

下面的代码会创建一个给定对象的副本。 创建对象的副本有不同的方法，以下是只是一种方法，并解释了 `Array.prototype.forEach()` 是如何使用 `ECMAScript 5 Object`.\* 元属性（meta property）函数工作的。

```js
function copy(obj) {
  const copy = Object.create(Object.getPrototypeOf(obj));
  const propNames = Object.getOwnPropertyNames(obj);

  propNames.forEach(function (name) {
    const desc = Object.getOwnPropertyDescriptor(obj, name);
    Object.defineProperty(copy, name, desc);
  });

  return copy;
}

const obj1 = { a: 1, b: 2 };
const obj2 = copy(obj1); // 现在 obj2 看起来和 obj1 一模一样了
```

- **如果数组在迭代时被修改了，则其他元素会被跳过**

```js
var words = ["one", "two", "three", "four"];
words.forEach(function (word) {
  console.log(word);
  if (word === "two") {
    words.shift();
  }
});
// one
// two
// four
```

- **扁平化数组**

下面的示例仅用于学习目的。如果你想使用内置方法来扁平化数组，你可以考虑使用 `Array.prototype.flat()`（预计将成为 ES2019 的一部分。

```js
/**
 * Flattens passed array in one dimensional array
 *
 * @params {array} arr
 * @returns {array}
 */
function flatten(arr) {
  const result = [];

  arr.forEach((i) => {
    if (Array.isArray(i)) result.push(...flatten(i));
    else result.push(i);
  });

  return result;
}

// Usage
const problem = [1, 2, 3, [4, 5, [6, 7], 8, 9]];

flatten(problem); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

- **针对 promise 或 async 函数的使用备注**

如果使用 `promise` 或 `async` 函数作为 `forEach()` 等类似方法的 `callback` 参数，最好对造成的执行顺序影响多加考虑，否则容易出现错误

```js
let ratings = [5, 4, 5];

let sum = 0;

let sumFunction = async function (a, b) {
  return a + b;
};

ratings.forEach(async function (rating) {
  sum = await sumFunction(sum, rating);
});

console.log(sum);
// Expected output: 14
// Actual output: 0
```

### Array.prototype.includes()

> `includes()` 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 `true`，否则返回`false`

#### 语法

```js
arr.includes(valueToFind[, fromIndex])
```

| 参数        | 描述                                                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| valueToFind | 需要查找的元素值                                                                                                                                                                |
| fromIndex   | 从 fromIndex 索引处开始查找 valueToFind。如果为负值，则按升序从 array.length + fromIndex 的索引开始搜 （即使从末尾开始往前跳 fromIndex 的绝对值个索引，然后往后搜寻）。默认为 0 |

**返回值：** 返回一个布尔值 Boolean ，如果在数组中找到了（如果传入了 fromIndex ，表示在 fromIndex 指定的索引范围中找到了）则返回 true 。

#### 示例

```js
[1, 2, 3].includes(2); // true
[1, 2, 3].includes(4); // false
[1, 2, 3].includes(3, 3); // false
[1, 2, 3].includes(3, -1); // true
[1, 2, NaN].includes(NaN); // true
```

- **fromIndex 大于等于数组长度**

```js
var arr = ["a", "b", "c"];

arr.includes("c", 3); // false
arr.includes("c", 100); // false
```

- **计算出的索引小于 0**

```js
// array length is 3
// fromIndex is -100
// computed index is 3 + (-100) = -97

var arr = ["a", "b", "c"];

arr.includes("a", -100); // true
arr.includes("b", -100); // true
arr.includes("c", -100); // true
arr.includes("a", -2); // false
```

- **作为通用方法的 includes()**

```js
(function () {
  console.log([].includes.call(arguments, "a")); // true
  console.log([].includes.call(arguments, "d")); // false
})("a", "b", "c");
```

### Array.prototype.indexOf()

> `indexOf()`方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回 `-1`

#### 语法

```js
arr.indexOf(searchElement[, fromIndex])
```

| 参数          | 描述           |
| ------------- | -------------- |
| searchElement | 要查找的元素   |
| fromIndex     | 开始查找的位置 |

**返回值：** 首个被找到的元素在数组中的索引位置; 若没有找到则返回 -1

#### 示例

- **使用 indexOf**

```js
var array = [2, 5, 9];
array.indexOf(2); // 0
array.indexOf(7); // -1
array.indexOf(9, 2); // 2
array.indexOf(2, -1); // -1
array.indexOf(2, -3); // 0
```

- **找出指定元素出现的所有位置**

```js
var indices = [];
var array = ["a", "b", "a", "c", "a", "d"];
var element = "a";
var idx = array.indexOf(element);
while (idx != -1) {
  indices.push(idx);
  idx = array.indexOf(element, idx + 1);
}
console.log(indices);
// [0, 2, 4]
```

- **判断一个元素是否在数组里，不在则更新数组**

```js
function updateVegetablesCollection(veggies, veggie) {
  if (veggies.indexOf(veggie) === -1) {
    veggies.push(veggie);
    console.log("New veggies collection is : " + veggies);
  } else if (veggies.indexOf(veggie) > -1) {
    console.log(veggie + " already exists in the veggies collection.");
  }
}

var veggies = ["potato", "tomato", "chillies", "green-pepper"];

// New veggies collection is : potato,tomato,chillies,green-papper,spinach
updateVegetablesCollection(veggies, "spinach");
// spinach already exists in the veggies collection.
updateVegetablesCollection(veggies, "spinach");
```

### Array.prototype.join()

> `join()` 方法将一个数组（或一个类数组对象）的所有元素连接成一个字符串并返回这个字符串。如果数组只有一个项目，那么将返回该项目而不使用分隔符

#### 语法

```js
arr.join([separator]);
```

| 参数      | 描述                                       |
| --------- | ------------------------------------------ |
| separator | 指定一个字符串来分隔数组的每个元素`[可选]` |

**返回值：** 返回一个所有数组元素连接的字符串。如果 arr.length 为 0，则返回空字符串

#### 示例

- **使用四种不同的分隔符连接数组元素**

```js
var a = ["Wind", "Rain", "Fire"];
var myVar1 = a.join(); // myVar1的值变为"Wind,Rain,Fire"
var myVar2 = a.join(", "); // myVar2的值变为"Wind, Rain, Fire"
var myVar3 = a.join(" + "); // myVar3的值变为"Wind + Rain + Fire"
var myVar4 = a.join(""); // myVar4的值变为"WindRainFire"
```

- **连接类数组对象**

```js
function f(a, b, c) {
  var s = Array.prototype.join.call(arguments);
  console.log(s); // '1,a,true'
}
f(1, "a", true);
```

### Array.prototype.keys()

> `keys()` 方法返回一个包含数组中每个索引键的 `Array Iterator` 对象

#### 语法

```js
arr.keys();
```

**返回值：** 一个新的 Array 迭代器对象

#### 示例

- **索引迭代器会包含那些没有对应元素的索引**

```js
var arr = ["a", , "c"];
var sparseKeys = Object.keys(arr);
var denseKeys = [...arr.keys()];
console.log(sparseKeys); // ['0', '2']
console.log(denseKeys); // [0, 1, 2]
```

### Array.prototype.lastIndexOf()

> `lastIndexOf()` 方法返回指定元素（也即有效的 `JavaScript` 值或变量）在数组中的最后一个的索引，如果不存在则返回 `-1`。从数组的后面向前查找，从 `fromIndex` 处开始

#### 语法

```js
arr.lastIndexOf(searchElement[, fromIndex])
```

| 参数          | 描述                                                                                                                                                                                                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| searchElement | 被查找的元素                                                                                                                                                                                                                                                                                       |
| fromIndex     | 从此位置开始逆向查找`[可选]` 。默认为数组的长度减 1(arr.length - 1)，即整个数组都被查找。如果该值大于或等于数组的长度，则整个数组会被查找。如果为负值，将其视为从数组末尾向前的偏移。即使该值为负，数组仍然会被从后向前查找。如果该值为负时，其绝对值大于数组长度，则方法返回 -1，即数组不会被查找 |

**返回值：** 数组中该元素最后一次出现的索引，如未找到返回-1

#### 示例

```js
var array = [2, 5, 9, 2];
var index = array.lastIndexOf(2);
// index is 3
index = array.lastIndexOf(7);
// index is -1
index = array.lastIndexOf(2, 3);
// index is 3
index = array.lastIndexOf(2, 2);
// index is 0
index = array.lastIndexOf(2, -2);
// index is 0
index = array.lastIndexOf(2, -1);
// index is 3
```

- **查找所有元素**

```js
var indices = [];
var array = ["a", "b", "a", "c", "a", "d"];
var element = "a";
var idx = array.lastIndexOf(element);

while (idx != -1) {
  indices.push(idx);
  idx = idx > 0 ? array.lastIndexOf(element, idx - 1) : -1;
}

console.log(indices);
// [4, 2, 0];
```

### Array.prototype.map()

> `map()` 方法创建一个新数组，其结果是该数组中的每个元素都调用一次提供的函数后的返回值

#### 语法

```js
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array
}[, thisArg])
```

| 参数     | 描述                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| callback | 生成新数组元素的函数，`currentValue：`正在处理的当前元素；`index：`正在处理的当前元素的索引；`array：`map 方法调用的数组 |
| thisArg  | 执行 callback 函数时值被用作 `[可选]`this                                                                                |

**返回值：** 一个由原数组每个元素执行回调函数的结果组成的新数组

#### 示例

- **求数组中每个元素的平方根**

```js
var numbers = [1, 4, 9];
var roots = numbers.map(Math.sqrt);
// roots的值为[1, 2, 3], numbers的值仍为[1, 4, 9]
```

- **使用 map 重新格式化数组中的对象**

以下代码使用一个包含对象的数组来重新创建一个格式化后的数组。

```js
var kvArray = [
  { key: 1, value: 10 },
  { key: 2, value: 20 },
  { key: 3, value: 30 },
];

var reformattedArray = kvArray.map(function (obj) {
  var rObj = {};
  rObj[obj.key] = obj.value;
  return rObj;
});

// reformattedArray 数组为： [{1: 10}, {2: 20}, {3: 30}],

// kvArray 数组未被修改:
// [{key: 1, value: 10},
//  {key: 2, value: 20},
//  {key: 3, value: 30}]
```

- **使用一个包含一个参数的函数来 mapping(构建)一个数字数组**

```js
var numbers = [1, 4, 9];
var doubles = numbers.map(function (num) {
  return num * 2;
});

// doubles数组的值为： [2, 8, 18]
// numbers数组未被修改： [1, 4, 9]
```

- **一般的 map 方法**

```js
var map = Array.prototype.map;
var a = map.call("Hello World", function (x) {
  return x.charCodeAt(0);
});
// a的值为[72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]
```

- **querySelectorAll 应用**

```js
var elems = document.querySelectorAll("select option:checked");
var values = Array.prototype.map.call(elems, function (obj) {
  return obj.value;
});
```

- **Mapping 含 undefined 的数组**

```js
var numbers = [1, 2, 3, 4];
var filteredNumbers = numbers.map(function (num, index) {
  if (index < 3) {
    return num;
  }
});
//index goes from 0,so the filterNumbers are 1,2,3 and undefined.
// filteredNumbers is [1, 2, 3, undefined]
// numbers is still [1, 2, 3, 4]
```

### Array.prototype.pop()

> `pop()`方法从数组中删除最后一个元素，并返回该元素的值。此方法更改数组的长度

#### 语法

```js
arr.pop();
```

**返回值：** 从数组中删除的元素(当数组为空时返回 undefined)

#### 示例

删除掉数组的最后一个元素

```js
let myFish = ["angel", "clown", "mandarin", "surgeon"];
let popped = myFish.pop();

console.log(myFish);
// ["angel", "clown", "mandarin"]
console.log(popped);
// surgeon
```

### Array.prototype.push()

> `push()` 方法将一个或多个元素添加到数组的末尾，并返回该数组的新长度

#### 语法

```js
arr.push(element1, ..., elementN)
```

| 参数     | 描述                   |
| -------- | ---------------------- |
| elementN | 被添加到数组末尾的元素 |

**返回值：** 当调用该方法时，新的 length 属性值将被返回

#### 示例

- **添加元素到数组**

```js
var sports = ["soccer", "baseball"];
var total = sports.push("football", "swimming");

console.log(sports);
// ["soccer", "baseball", "football", "swimming"]

console.log(total);
// 4
```

- **合并两个数组**

```js
var vegetables = ["parsnip", "potato"];
var moreVegs = ["celery", "beetroot"];

// 将第二个数组融合进第一个数组
// 相当于 vegetables.push('celery', 'beetroot');
Array.prototype.push.apply(vegetables, moreVegs);

console.log(vegetables);
// ['parsnip', 'potato', 'celery', 'beetroot']
```

- **像数组一样使用对象**

```js
var obj = {
  length: 0,
  addElem: function addElem(elem) {
    // obj.length is automatically incremented
    // every time an element is added.
    [].push.call(this, elem);
  },
};

// Let's add some empty objects just to illustrate.
obj.addElem({});
obj.addElem({});
console.log(obj.length);
// → 2
```

### Array.prototype.reduce()

> `reduce()` 方法对数组中的每个元素执行一个由您提供的 `reducer` 函数(升序执行)，将其结果汇总为单个返回值

#### 语法

```js
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

| 参数         | 描述                                                                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| callback     | 执行数组中每个值;`accumulator：`累计器累计回调的返回值;`currentValue：`数组中正在处理的元素；`index：`数组中正在处理的当前元素的索引`[可选]`；`array：`调用 reduce()的数组 |
| initialValue | 作为第一次调用 callback 函数时的第一个参数的值`[可选]`                                                                                                                     |

**返回值：** 函数累计处理的结果

#### 示例

- **数组里所有值的和**

```js
var sum = [0, 1, 2, 3].reduce(function (accumulator, currentValue) {
  return accumulator + currentValue;
}, 0);
// or
var total = [0, 1, 2, 3].reduce((acc, cur) => acc + cur, 0);

// 和为 6
```

- **累加对象数组里的值**

```js
var initialValue = 0;
var sum = [{ x: 1 }, { x: 2 }, { x: 3 }].reduce(function (
  accumulator,
  currentValue
) {
  return accumulator + currentValue.x;
},
initialValue);

console.log(sum); // logs 6
```

你也可以写成箭头函数的形式：

```js
var initialValue = 0;
var sum = [{ x: 1 }, { x: 2 }, { x: 3 }].reduce(
  (accumulator, currentValue) => accumulator + currentValue.x,
  initialValue
);

console.log(sum); // logs 6
```

- **将二维数组转化为一维**

```js
var flattened = [
  [0, 1],
  [2, 3],
  [4, 5],
].reduce(function (a, b) {
  return a.concat(b);
}, []);
// flattened is [0, 1, 2, 3, 4, 5]
```

你也可以写成箭头函数的形式：

```js
var flattened = [
  [0, 1],
  [2, 3],
  [4, 5],
].reduce((acc, cur) => acc.concat(cur), []);
```

- **计算数组中每个元素出现的次数**

```js
var names = ["Alice", "Bob", "Tiff", "Bruce", "Alice"];

var countedNames = names.reduce(function (allNames, name) {
  if (name in allNames) {
    allNames[name]++;
  } else {
    allNames[name] = 1;
  }
  return allNames;
}, {});
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```

- **按属性对 object 分类**

```js
var people = [
  { name: "Alice", age: 21 },
  { name: "Max", age: 20 },
  { name: "Jane", age: 20 },
];

function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

var groupedPeople = groupBy(people, "age");
// groupedPeople is:
// {
//   20: [
//     { name: 'Max', age: 20 },
//     { name: 'Jane', age: 20 }
//   ],
//   21: [{ name: 'Alice', age: 21 }]
// }
```

- **使用扩展运算符和 initialValue 绑定包含在对象数组中的数组**

```js
// friends - 对象数组
// where object field "books" - list of favorite books
var friends = [
  {
    name: "Anna",
    books: ["Bible", "Harry Potter"],
    age: 21,
  },
  {
    name: "Bob",
    books: ["War and peace", "Romeo and Juliet"],
    age: 26,
  },
  {
    name: "Alice",
    books: ["The Lord of the Rings", "The Shining"],
    age: 18,
  },
];

// allbooks - list which will contain all friends' books +
// additional list contained in initialValue
var allbooks = friends.reduce(
  function (prev, curr) {
    return [...prev, ...curr.books];
  },
  ["Alphabet"]
);

// allbooks = [
//   'Alphabet', 'Bible', 'Harry Potter', 'War and peace',
//   'Romeo and Juliet', 'The Lord of the Rings',
//   'The Shining'
// ]
```

- **数组去重**

```js
let arr = [1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4];
let result = arr.sort().reduce((init, current) => {
  if (init.length === 0 || init[init.length - 1] !== current) {
    init.push(current);
  }
  return init;
}, []);
console.log(result); //[1,2,3,4,5]
```

- **按顺序运行 Promise**

```js
/**
 * Runs promises from array of functions that can return promises
 * in chained manner
 *
 * @param {array} arr - promise arr
 * @return {Object} promise object
 */
function runPromiseInSequence(arr, input) {
  return arr.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(input)
  );
}

// promise function 1
function p1(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 5);
  });
}

// promise function 2
function p2(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 2);
  });
}

// function 3  - will be wrapped in a resolved promise by .then()
function f3(a) {
  return a * 3;
}

// promise function 4
function p4(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 4);
  });
}

const promiseArr = [p1, p2, f3, p4];
runPromiseInSequence(promiseArr, 10).then(console.log); // 1200
```

- **功能型函数管道**

```js
// 用于合成的构建块
const double = (x) => x + x;
const triple = (x) => 3 * x;
const quadruple = (x) => 4 * x;

// 通过功能组合实现管道功能
const pipe =
  (...functions) =>
  (input) =>
    functions.reduce((acc, fn) => fn(acc), input);

// 用于特定值相乘的组合函数
const multiply6 = pipe(double, triple);
const multiply9 = pipe(triple, triple);
const multiply16 = pipe(quadruple, quadruple);
const multiply24 = pipe(double, triple, quadruple);

// 用法
multiply6(6); // 36
multiply9(9); // 81
multiply16(16); // 256
multiply24(10); // 240
```

- **使用 reduce 实现 map**

```js
使用 reduce实现map
if (!Array.prototype.mapUsingReduce) {
  Array.prototype.mapUsingReduce = function(callback, thisArg) {
    return this.reduce(function(mappedArray, currentValue, index, array) {
      mappedArray[index] = callback.call(thisArg, currentValue, index, array);
      return mappedArray;
    }, []);
  };
}

[1, 2, , 3].mapUsingReduce(
  (currentValue, index, array) => currentValue + index + array.length
); // [5, 7, , 10]
```

### Array.prototype.reduceRight()

> `reduceRight()` 方法接受一个函数作为累加器（accumulator）和数组的每个值（从右到左）将其减少为单个值

#### 语法

```js
arr.reduceRight(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

| 参数         | 描述                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| callback     | 一个回调函数，用于操作数组中的每个元素`[可选]`；`accumulator：`上一次调用回调函数时，回调函数返回的值；`currentValue：`当前被处理的元素；`index：`数组中当前被处理的元素的索引；`array：`调用 reduceRight() 的数组 |
| initialValue | 首次调用 callback 函数时，累加器 accumulator 的值`[可选]`                                                                                                                                                          |

**返回值：** 执行之后的返回值

#### 示例

- **求一个数组中所有值的和**

```js
var sum = [0, 1, 2, 3].reduceRight(function (a, b) {
  return a + b;
});
// sum is 6
```

- **扁平化（flatten）一个二维数组**

```js
var flattened = [
  [0, 1],
  [2, 3],
  [4, 5],
].reduceRight(function (a, b) {
  return a.concat(b);
}, []);
// flattened is [4, 5, 2, 3, 0, 1]
```

- **运行一个带有回调每个函数将其结果传给下一个的异步函数列表**

```js
const waterfall =
  (...functions) =>
  (callback, ...args) =>
    functions.reduceRight(
      (composition, fn) =>
        (...results) =>
          fn(composition, ...results),
      callback
    )(...args);

const randInt = (max) => Math.floor(Math.random() * max);

const add5 = (callback, x) => {
  setTimeout(callback, randInt(1000), x + 5);
};
const mult3 = (callback, x) => {
  setTimeout(callback, randInt(1000), x * 3);
};
const sub2 = (callback, x) => {
  setTimeout(callback, randInt(1000), x - 2);
};
const split = (callback, x) => {
  setTimeout(callback, randInt(1000), x, x);
};
const add = (callback, x, y) => {
  setTimeout(callback, randInt(1000), x + y);
};
const div4 = (callback, x) => {
  setTimeout(callback, randInt(1000), x / 4);
};

const computation = waterfall(add5, mult3, sub2, split, add, div4);
computation(console.log, 5); // -> 14

// same as:

const computation2 = (input, callback) => {
  const f6 = (x) => div4(callback, x);
  const f5 = (x, y) => add(f6, x, y);
  const f4 = (x) => split(f5, x);
  const f3 = (x) => sub2(f4, x);
  const f2 = (x) => mult3(f3, x);
  add5(f2, input);
};
```

- **展示 reduce 与 reduceRight 之间的区别**

```js
var a = ["1", "2", "3", "4", "5"];
var left = a.reduce(function (prev, cur) {
  return prev + cur;
});
var right = a.reduceRight(function (prev, cur) {
  return prev + cur;
});

console.log(left); // "12345"
console.log(right); // "54321"
```

- **定义可组合函数**

```js
const compose =
  (...args) =>
  (value) =>
    args.reduceRight((acc, fn) => fn(acc), value);

const inc = (n) => n + 1;
const double = (n) => n * 2;

console.log(compose(double, inc)(2)); // 6
console.log(compose(inc, double)(2)); // 5
```

### Array.prototype.reverse()

> `reverse()` 方法将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组

#### 语法

```js
arr.reverse();
```

**返回值：** 颠倒后的数组

#### 示例

- **颠倒数组中的元素**

```js
const a = [1, 2, 3];

a.reverse();
console.log(a); // [3, 2, 1]
```

- **颠倒类数组中的元素**

```js
const a = { 0: 1, 1: 2, 2: 3, length: 3 };

Array.prototype.reverse.call(a); //same syntax for using apply()
console.log(a); // {0: 3, 1: 2, 2: 1, length: 3}
```

### Array.prototype.shift()

> `shift()` 方法从数组中删除第一个元素，并返回该元素的值。此方法更改数组的长度

#### 语法

```js
arr.shift();
```

**返回值：** 从数组中删除的元素; 如果数组为空则返回 undefined

#### 示例

- **移除数组中的一个元素**

```js
let myFish = ["angel", "clown", "mandarin", "surgeon"];
var shifted = myFish.shift();

console.log("调用 shift 之后: " + myFish);
// "调用 shift 之后: clown,mandarin,surgeon"

console.log("被删除的元素: " + shifted);
// "被删除的元素: angel"
```

- **在 while 循环中使用 shift()**

```js
var names = ["Andrew", "Edward", "Paul", "Chris", "John"];

while ((i = names.shift()) !== undefined) {
  console.log(i);
}
// Andrew, Edward, Paul, Chris, John
```

### Array.prototype.slice()

> `slice()` 方法返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的浅拷贝（包括 `begin`，不包括 `end`）。原始数组不会被改变

#### 语法

```js
arr.slice([begin[, end]])
```

| 参数  | 描述                                                                |
| ----- | ------------------------------------------------------------------- |
| begin | 提取起始处的索引（从 0 开始），从该索引开始提取原数组元素`[可选]`   |
| end   | 提取终止处的索引（从 0 开始），在该索引处结束提取原数组元素`[可选]` |

**返回值：** 一个含有被提取元素的新数组

#### 示例

- **返回现有数组的一部分**

```js
var fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
var citrus = fruits.slice(1, 3);

// fruits : ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango']
// citrus : ['Orange','Lemon']
```

- **使用 slice**

```js
// 使用 slice 方法从 myCar 中创建一个 newCar。
var myHonda = { color: "red", wheels: 4, engine: { cylinders: 4, size: 2.2 } };
var myCar = [myHonda, 2, "cherry condition", "purchased 1997"];
var newCar = myCar.slice(0, 2);

// 输出 myCar、newCar 以及各自的 myHonda 对象引用的 color 属性。
console.log(" myCar = " + JSON.stringify(myCar));
console.log("newCar = " + JSON.stringify(newCar));
console.log(" myCar[0].color = " + JSON.stringify(myCar[0].color));
console.log("newCar[0].color = " + JSON.stringify(newCar[0].color));

// 改变 myHonda 对象的 color 属性.
myHonda.color = "purple";
console.log("The new color of my Honda is " + myHonda.color);

//输出 myCar、newCar 中各自的 myHonda 对象引用的 color 属性。
console.log(" myCar[0].color = " + myCar[0].color);
console.log("newCar[0].color = " + newCar[0].color);
```

- **类数组（Array-like）对象**

```js
function list() {
  return Array.prototype.slice.call(arguments);
}

var list1 = list(1, 2, 3); // [1, 2, 3]
```

你可以使用 bind 来简化该过程

```js
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.call.bind(unboundSlice);

function list() {
  return slice(arguments);
}

var list1 = list(1, 2, 3); // [1, 2, 3]
```

### Array.prototype.some()

> `some()` 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个 `Boolean` 类型的值

#### 语法

```js
arr.some(callback(element[, index[, array]])[, thisArg])
```

| 参数     | 描述                                                                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| callback | 用来测试每个元素的函数`[可选]`；`element：`数组中正在处理的元素；`index：`数组中正在处理的元素的索引值`[可选]`；`array：`some()被调用的数组`[可选]` |
| thisArg  | 执行 callback 时使用的 this 值`[可选]`                                                                                                              |

**返回值：** 数组中有至少一个元素通过回调函数的测试就会返回 true；所有元素都没有通过回调函数的测试返回值才会为 false。

#### 示例

- **测试数组元素的值**

```js
function isBiggerThan10(element, index, array) {
  return element > 10;
}

[2, 5, 8, 1, 4].some(isBiggerThan10); // false
[12, 5, 8, 1, 4].some(isBiggerThan10); // true
```

- **使用箭头函数测试数组元素的值**

```js
[2, 5, 8, 1, 4].some((x) => x > 10); // false
[12, 5, 8, 1, 4].some((x) => x > 10); // true
```

- **判断数组元素中是否存在某个值**

```js
var fruits = ["apple", "banana", "mango", "guava"];

function checkAvailability(arr, val) {
  return arr.some(function (arrVal) {
    return val === arrVal;
  });
}

checkAvailability(fruits, "kela"); // false
checkAvailability(fruits, "banana"); // true
```

- **使用箭头函数判断数组元素中是否存在某个值**

```js
var fruits = ["apple", "banana", "mango", "guava"];

function checkAvailability(arr, val) {
  return arr.some((arrVal) => val === arrVal);
}

checkAvailability(fruits, "kela"); // false
checkAvailability(fruits, "banana"); // true
```

- **将任意值转换为布尔类型**

```js
var TRUTHY_VALUES = [true, "true", 1];

function getBoolean(value) {
  "use strict";

  if (typeof value === "string") {
    value = value.toLowerCase().trim();
  }

  return TRUTHY_VALUES.some(function (t) {
    return t === value;
  });
}

getBoolean(false); // false
getBoolean("false"); // false
getBoolean(1); // true
getBoolean("true"); // true
```

### Array.prototype.sort()

> `sort()` 方法用原地算法对数组的元素进行排序，并返回数组。默认排序顺序是在将元素转换为字符串，然后比较它们的 `UTF-16` 代码单元值序列时构建的

#### 语法

```js
arr.sort([compareFunction]);
```

| 参数            | 描述                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------- |
| compareFunction | 用来指定按某种顺序进行排列的函数；`firstEl：`第一个用于比较的元素；`secondEl：`第二个用于比较的元素 |

**返回值：** 排序后的数组

#### 示例

```js
var numbers = [4, 2, 5, 1, 3];
numbers.sort(function (a, b) {
  return a - b;
});
console.log(numbers);

var numbers = [4, 2, 5, 1, 3];
numbers.sort((a, b) => a - b);
console.log(numbers);

// [1, 2, 3, 4, 5]
```

对象可以按照某个属性排序：

```js
var items = [
  { name: "Edward", value: 21 },
  { name: "Sharpe", value: 37 },
  { name: "And", value: 45 },
  { name: "The", value: -12 },
  { name: "Magnetic" },
  { name: "Zeros", value: 37 },
];

// sort by value
items.sort(function (a, b) {
  return a.value - b.value;
});

// sort by name
items.sort(function (a, b) {
  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal

  return 0;
});
```

- **创建、显示及排序数组**

```js
var stringArray = ["Blue", "Humpback", "Beluga"];
var numericStringArray = ["80", "9", "700"];
var numberArray = [40, 1, 5, 200];
var mixedNumericArray = ["80", "9", "700", 40, 1, 5, 200];

function compareNumbers(a, b) {
  return a - b;
}
console.log("stringArray:" + stringArray.join());
// stringArray: Blue,Humpback,Beluga
console.log("Sorted:" + stringArray.sort());
// Sorted: Beluga,Blue,Humpback

console.log("numberArray:" + numberArray.join());
// numberArray: 40,1,5,200
console.log("Sorted without a compare function:" + numberArray.sort());
// Sorted without a compare function: 1,200,40,5
console.log("Sorted with compareNumbers:" + numberArray.sort(compareNumbers));
// Sorted with compareNumbers: 1,5,40,200

console.log("numericStringArray:" + numericStringArray.join());
// numericStringArray: 80,9,700
console.log("Sorted without a compare function:" + numericStringArray.sort());
// Sorted without a compare function: 700,80,9
console.log(
  "Sorted with compareNumbers:" + numericStringArray.sort(compareNumbers)
);
// Sorted with compareNumbers: 9,80,700

console.log("mixedNumericArray:" + mixedNumericArray.join());
// mixedNumericArray: 80,9,700,40,1,5,200
console.log("Sorted without a compare function:" + mixedNumericArray.sort());
// Sorted without a compare function: 1,200,40,5,700,80,9
console.log(
  "Sorted with compareNumbers:" + mixedNumericArray.sort(compareNumbers)
);
// Sorted with compareNumbers: 1,5,9,40,80,200,700
```

- **对非 ASCII 字符排序**

```js
var items = ["réservé", "premier", "cliché", "communiqué", "café", "adieu"];
items.sort(function (a, b) {
  return a.localeCompare(b);
});

// items is ['adieu', 'café', 'cliché', 'communiqué', 'premier', 'réservé']
```

- **使用映射改善排序**

```js
// 需要被排序的数组
var list = ["Delta", "alpha", "CHARLIE", "bravo"];

// 对需要排序的数字和位置的临时存储
var mapped = list.map(function (el, i) {
  return { index: i, value: el.toLowerCase() };
});

// 按照多个值排序数组
mapped.sort(function (a, b) {
  return +(a.value > b.value) || +(a.value === b.value) - 1;
});

// 根据索引得到排序的结果
var result = mapped.map(function (el) {
  return list[el.index];
});
```

### Array.prototype.splice()

> `splice()` 方法通过删除或替换现有元素或者原地添加新的元素来修改数组,并以数组形式返回被修改的内容。此方法会改变原数组

#### 语法

```js
array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
```

| 参数              | 描述                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------- |
| start             | 指定修改的开始位置（从 0 计数）                                                       |
| deleteCount       | 整数，表示要移除的数组元素的个数`[可选]`                                              |
| item1, item2, ... | 要添加进数组的元素,从 start 位置开始,如果不指定，则 splice() 将只删除数组元素`[可选]` |

**返回值：** 由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组

#### 示例

- **从第 2 位开始删除 0 个元素，插入“drum”**

```js
var myFish = ["angel", "clown", "mandarin", "sturgeon"];
var removed = myFish.splice(2, 0, "drum");

// 运算后的 myFish: ["angel", "clown", "drum", "mandarin", "sturgeon"]
// 被删除的元素: [], 没有元素被删除
```

- **从第 2 位开始删除 0 个元素，插入“drum” 和 "guitar"**

```js
var myFish = ["angel", "clown", "mandarin", "sturgeon"];
var removed = myFish.splice(2, 0, "drum", "guitar");

// 运算后的 myFish: ["angel", "clown", "drum", "guitar", "mandarin", "sturgeon"]
// 被删除的元素: [], 没有元素被删除
```

- **从第 3 位开始删除 1 个元素**

```js
var myFish = ["angel", "clown", "drum", "mandarin", "sturgeon"];
var removed = myFish.splice(3, 1);

// 运算后的 myFish: ["angel", "clown", "drum", "sturgeon"]
// 被删除的元素: ["mandarin"]
```

- **从第 2 位开始删除 1 个元素，插入“trumpet”**

```js
var myFish = ["angel", "clown", "drum", "sturgeon"];
var removed = myFish.splice(2, 1, "trumpet");

// 运算后的 myFish: ["angel", "clown", "trumpet", "sturgeon"]
// 被删除的元素: ["drum"]
```

- **从第 0 位开始删除 2 个元素，插入"parrot"、"anemone"和"blue"**

```js
var myFish = ["angel", "clown", "trumpet", "sturgeon"];
var removed = myFish.splice(0, 2, "parrot", "anemone", "blue");

// 运算后的 myFish: ["parrot", "anemone", "blue", "trumpet", "sturgeon"]
// 被删除的元素: ["angel", "clown"]
```

- **从第 2 位开始删除 2 个元素**

```js
var myFish = ["parrot", "anemone", "blue", "trumpet", "sturgeon"];
var removed = myFish.splice(myFish.length - 3, 2);

// 运算后的 myFish: ["parrot", "anemone", "sturgeon"]
// 被删除的元素: ["blue", "trumpet"]
```

- **从倒数第 2 位开始删除 1 个元素**

```js
var myFish = ["angel", "clown", "mandarin", "sturgeon"];
var removed = myFish.splice(-2, 1);

// 运算后的 myFish: ["angel", "clown", "sturgeon"]
// 被删除的元素: ["mandarin"]
```

- **从第 2 位开始删除所有元素**

```js
var myFish = ["angel", "clown", "mandarin", "sturgeon"];
var removed = myFish.splice(2);

// 运算后的 myFish: ["angel", "clown"]
// 被删除的元素: ["mandarin", "sturgeon"]
```

### Array.prototype.toLocaleString()

> `toLocaleString()` 返回一个字符串表示数组中的元素。数组中的元素将使用各自的 `toLocaleString` 方法转成字符串，这些字符串将使用一个特定语言环境的字符串（例如一个逗号 ","）隔开

#### 语法

```js
arr.toLocaleString([locales[,options]]);
```

| 参数    | 描述                                                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| locales | 带有 BCP 47 语言标记的字符串或字符串数组`[可选]`                                                                   |
| options | 一个可配置属性的对象，对于数字 Number.prototype.toLocaleString()，对于日期 Date.prototype.toLocaleString()`[可选]` |

**返回值：** 表示数组元素的字符串

#### 示例

- **使用 locales 和 options**

```js
var prices = ["￥7", 500, 8123, 12];
prices.toLocaleString("ja-JP", { style: "currency", currency: "JPY" });

// "￥7,￥500,￥8,123,￥12"
```

### Array.prototype.toSource()

> 该特性是非标准的，请尽量不要在生产环境中使用它！

#### 语法

```js
array.toSource();
```

#### 示例

查看数组的源码

```js
var alpha = new Array("a", "b", "c");

alpha.toSource(); //返回["a", "b", "c"]
```

### Array.prototype.toString()

> `toString()` 返回一个字符串，表示指定的数组及其元素

#### 语法

```js
arr.toString();
```

**返回值：** 一个表示指定的数组及其元素的字符串

#### 示例

```js
[1, 2, 3].toString();
// '1,2,3';

["122", 222, { a: 11 }].toString();
// "122,222,[object Object]"
```

### Array.prototype.unshift()

> `unshift()` 方法将一个或多个元素添加到数组的开头，并返回该数组的新长度(该方法修改原有数组)

#### 语法

```js
arr.unshift(element1, ..., elementN)
```

| 参数     | 描述                             |
| -------- | -------------------------------- |
| elementN | 要添加到数组开头的元素或多个元素 |

**返回值：** 当一个对象调用该方法时，返回其 length 属性值

#### 示例

```js
let arr = [1, 2];

arr.unshift(0); // result of the call is 3, which is the new array length
// arr is [0, 1, 2]

arr.unshift(-2, -1); // the new array length is 5
// arr is [-2, -1, 0, 1, 2]

arr.unshift([-4, -3]); // the new array length is 6
// arr is [[-4, -3], -2, -1, 0, 1, 2]

arr.unshift([-7, -6], [-5]); // the new array length is 8
// arr is [ [-7, -6], [-5], [-4, -3], -2, -1, 0, 1, 2 ]
```

### Array.prototype.values()

> `values()` 方法返回一个新的 `Array Iterator` 对象，该对象包含数组每个索引的值

#### 语法

```js
arr.values();
```

**返回值：** 一个新的 Array 迭代对象

#### 示例

- **使用 for...of 循环进行迭代**

```js
let arr = ["w", "y", "k", "o", "p"];
let eArr = arr.values();

for (let letter of eArr) {
  console.log(letter);
} //"a" "b" "c" "d"
```

`Array.prototype.values` 是 `Array.prototype[Symbol.iterator]` 的默认实现

```js
Array.prototype.values === Array.prototype[Symbol.iterator]; // true
```

- **使用 .next() 迭代**

```js
var arr = ["a", "b", "c", "d", "e"];
var iterator = arr.values();
iterator.next(); // Object { value: "a", done: false }
iterator.next().value; // "b"
iterator.next()["value"]; // "c"
iterator.next(); // Object { value: "d", done: false }
iterator.next(); // Object { value: "e", done: false }
iterator.next(); // Object { value: undefined, done: true }
iteraroe.next().value; // undefined
```

### Array.prototype[@@iterator]()

> `@@iterator` 属性和 `Array.prototype.values()` 属性的初始值是同一个函数对象

#### 语法

```js
arr[Symbol.iterator]();
```

**返回值：** 数组的 iterator 方法，默认情况下，与 values() 返回值相同， arr[Symbol.iterator] 则会返回 values() 函数

#### 示例

- **使用 for...of 循环进行迭代**

```js
var arr = ["a", "b", "c", "d", "e"];
var eArr = arr[Symbol.iterator]();
// 浏览器必须支持 for...of 循环
for (let letter of eArr) {
  console.log(letter);
}
```

- **另一种迭代方式**

```js
var arr = ["a", "b", "c", "d", "e"];
var eArr = arr[Symbol.iterator]();
console.log(eArr.next().value); // a
console.log(eArr.next().value); // b
console.log(eArr.next().value); // c
console.log(eArr.next().value); // d
console.log(eArr.next().value); // e
```

- **Use Case for brace notation**

```js
function logIterable(it) {
  var iterator = it[Symbol.iterator]();
  // 浏览器必须支持 for...of 循环
  for (let letter of iterator) {
    console.log(letter);
  }
}

// Array
logIterable(["a", "b", "c"]);
// a
// b
// c

// string
logIterable("abc");
// a
// b
// c
```

### get Array[@@species]

> `Array[@@species]` 访问器属性返回 `Array` 的构造函数

#### 语法

```js
Array[Symbol.species];
```

| 参数      | 描述                                       |
| --------- | ------------------------------------------ |
| separator | 指定一个字符串来分隔数组的每个元素`[可选]` |

**返回值：** Array 的构造函数

#### 示例

```js
Array[Symbol.species]; // function Array()
```

在继承类的对象中（例如你自定义的数组 `MyArray`），`MyArray` 的 `species` 属性返回的是 `MyArray` 这个构造函数. 然而你可能想要覆盖它，以便在你继承的对象 `MyArray` 中返回父类的构造函数 `Array` :

```js
class MyArray extends Array {
  // 重写 MyArray 的 species 属性到父类 Array 的构造函数
  static get [Symbol.species]() {
    return Array;
  }
}
```

## 继承 Function

- Function.prototype.apply()
- Function.prototype.bind()
- Function.prototype.call()
- Function.prototype.toString()
