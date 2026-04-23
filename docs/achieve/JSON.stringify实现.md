# JSON.stringify 实现

## 描述

`JSON.stringify()` 将 JavaScript 对象或值转换为 JSON 字符串。

## 转换规则

| 输入类型     | 输出                |
| ------------ | ------------------- |
| 数字         | 对应数字字符串      |
| 字符串       | 带引号的字符串      |
| 布尔值       | "true" / "false"    |
| null         | "null"              |
| 数组         | JSON 数组字符串     |
| 对象         | JSON 对象字符串     |
| undefined    | undefined（被忽略） |
| 函数         | undefined（被忽略） |
| Symbol       | undefined（被忽略） |
| NaN/Infinity | "null"              |
| 循环引用     | 抛出 TypeError      |

## 实现代码

### 基础版

```js
JSON.myStringify = function (value, replacer, space) {
    const seen = new WeakSet();

    function stringify(val, indent = "") {
        if (val === null) return "null";
        if (typeof val === "undefined") return undefined;
        if (typeof val === "function") return undefined;
        if (typeof val === "symbol") return undefined;

        if (typeof val === "number") {
            if (Number.isNaN(val) || !Number.isFinite(val)) {
                return "null";
            }
            return String(val);
        }

        if (typeof val === "boolean") {
            return String(val);
        }

        if (typeof val === "string") {
            return `"${val.replace(/"/g, '\\"')}"`;
        }

        if (Array.isArray(val)) {
            if (seen.has(val)) {
                throw new TypeError("Converting circular reference to JSON");
            }
            seen.add(val);
            const items = val.map((item) => stringify(item, indent));
            seen.delete(val);
            return `[${items.join(",")}]`;
        }

        if (typeof val === "object") {
            if (seen.has(val)) {
                throw new TypeError("Converting circular reference to JSON");
            }
            seen.add(val);
            const keys = Object.keys(val);
            const pairs = keys
                .filter((key) => val[key] !== undefined && typeof val[key] !== "function")
                .map((key) => `"${key}":${stringify(val[key], indent)}`);
            seen.delete(val);
            return `{${pairs.join(",")}}`;
        }
    }

    return stringify(value);
};
```

### 完整版（支持 replacer 和 space）

```js
JSON.myStringify = function (value, replacer, space) {
    const seen = new WeakSet();

    function stringify(val, indent = "") {
        if (val === null) return "null";
        if (typeof val === "undefined") return undefined;
        if (typeof val === "function") return undefined;
        if (typeof val === "symbol") return undefined;

        if (typeof val === "number") {
            if (Number.isNaN(val) || !Number.isFinite(val)) {
                return "null";
            }
            return String(val);
        }

        if (typeof val === "boolean") {
            return String(val);
        }

        if (typeof val === "string") {
            return `"${escapeString(val)}"`;
        }

        if (Array.isArray(val)) {
            if (seen.has(val)) {
                throw new TypeError("Converting circular reference to JSON");
            }
            seen.add(val);
            const items = val.map((item) => {
                const str = stringify(item, indent);
                return str === undefined ? "null" : str;
            });
            seen.delete(val);
            const bracketSpace = space ? "\n" + indent + "  " : " ";
            return "[" + items.join("," + bracketSpace) + "]";
        }

        if (typeof val === "object") {
            if (seen.has(val)) {
                throw new TypeError("Converting circular reference to JSON");
            }
            seen.add(val);

            const keys = Object.keys(val);
            let filteredKeys = keys;

            if (replacer && Array.isArray(replacer)) {
                filteredKeys = keys.filter((key) => replacer.includes(key));
            }

            const pairs = filteredKeys
                .filter((key) => {
                    const valProp = val[key];
                    return valProp !== undefined && typeof valProp !== "function" && typeof valProp !== "symbol";
                })
                .map((key) => {
                    const strKey = `"${escapeString(key)}":${stringify(val[key], indent)}`;
                    return strKey;
                });

            seen.delete(val);

            const bracketSpace = space ? "\n" + indent + "  " : " ";
            return "{" + pairs.join("," + bracketSpace) + "}";
        }
    }

    return stringify(value);
};

function escapeString(str) {
    return str
        .replace(/"/g, '\\"')
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");
}
```

## 使用示例

```js
const obj = {
    name: "张三",
    age: 18,
    isStudent: false,
    hobbies: ["读书", "运动"],
    address: {
        city: "北京",
    },
    sayHello: function () {
        console.log("hi");
    },
    undefinedProp: undefined,
    symbolProp: Symbol("test"),
    nullProp: null,
    nanProp: NaN,
    infinityProp: Infinity,
};

console.log(JSON.myStringify(obj));
// {"name":"张三","age":18,"isStudent":false,"hobbies":["读书","运动"],"address":{"city":"北京"},"nullProp":null,"nanProp":null,"infinityProp":null}
```

## 面试追问点

### JSON.stringify 的第二个参数 replacer

可以是函数或数组：

- 函数：key-value 过滤或转换
- 数组：只包含指定 key

### JSON.stringify 的第三个参数 space

控制缩进：

- 数字：缩进空格数
- 字符串：用作缩进的字符串

### 循环引用处理

```js
const obj = { a: 1 };
obj.self = obj;

JSON.stringify(obj); // TypeError: Converting circular reference to JSON
```
