# JSON.parse 实现

## 描述

`JSON.parse()` 将 JSON 字符串解析为 JavaScript 值。

## 实现方式

JSON.parse 有两种实现方式：
1. **eval 方式**：使用 `eval()` 执行（简单但有安全隐患）
2. **正则方式**：手动解析字符串（复杂但安全）

## 实现代码

### 方式一：eval 方式（简单实现）

```js
JSON.myParse = function(jsonString) {
    if (typeof jsonString !== 'string') {
        return jsonString;
    }

    // 使用 eval 执行，注意安全风险
    // 在实际使用中推荐使用方式二
    return eval('(' + jsonString + ')');
};
```

### 方式二：正则解析（完整实现）

```js
JSON.myParse = function(text, reviver) {
    if (typeof text !== 'string') {
        return null;
    }

    // 去除前后空白
    text = text.trim();

    // 使用递归下降解析器
    let index = 0;

    function parseValue() {
        skipWhitespace();
        if (index >= text.length) {
            throw new Error('Unexpected end of input');
        }

        const ch = text[index];

        if (ch === '{') {
            return parseObject();
        }
        if (ch === '[') {
            return parseArray();
        }
        if (ch === '"') {
            return parseString();
        }
        if (ch === 't' || ch === 'f') {
            return parseBoolean();
        }
        if (ch === 'n') {
            return parseNull();
        }
        if (ch === '-' || isDigit(ch)) {
            return parseNumber();
        }

        throw new Error('Unexpected character: ' + ch);
    }

    function skipWhitespace() {
        while (index < text.length && /\s/.test(text[index])) {
            index++;
        }
    }

    function parseObject() {
        if (text[index] !== '{') {
            throw new Error('Expected {');
        }
        index++;

        const obj = {};
        skipWhitespace();

        if (text[index] === '}') {
            index++;
            return obj;
        }

        while (true) {
            skipWhitespace();
            if (text[index] !== '"') {
                throw new Error('Expected property name');
            }

            const key = parseString();
            skipWhitespace();

            if (text[index] !== ':') {
                throw new Error('Expected :');
            }
            index++;

            const value = parseValue();
            obj[key] = value;

            skipWhitespace();
            if (text[index] === '}') {
                index++;
                return obj;
            }
            if (text[index] !== ',') {
                throw new Error('Expected , or }');
            }
            index++;
        }
    }

    function parseArray() {
        if (text[index] !== '[') {
            throw new Error('Expected [');
        }
        index++;

        const arr = [];
        skipWhitespace();

        if (text[index] === ']') {
            index++;
            return arr;
        }

        while (true) {
            const value = parseValue();
            arr.push(value);

            skipWhitespace();
            if (text[index] === ']') {
                index++;
                return arr;
            }
            if (text[index] !== ',') {
                throw new Error('Expected , or ]');
            }
            index++;
        }
    }

    function parseString() {
        if (text[index] !== '"') {
            throw new Error('Expected "');
        }
        index++;

        let str = '';
        while (index < text.length && text[index] !== '"') {
            if (text[index] === '\\') {
                index++;
                if (index >= text.length) {
                    throw new Error('Unexpected end of string');
                }
                const escaped = text[index];
                switch (escaped) {
                    case '"': str += '"'; break;
                    case '\\': str += '\\'; break;
                    case '/': str += '/'; break;
                    case 'n': str += '\n'; break;
                    case 'r': str += '\r'; break;
                    case 't': str += '\t'; break;
                    case 'u':
                        if (index + 4 >= text.length) {
                            throw new Error('Invalid unicode escape');
                        }
                        const hex = text.substring(index + 1, index + 5);
                        if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
                            throw new Error('Invalid unicode escape');
                        }
                        str += String.fromCharCode(parseInt(hex, 16));
                        index += 4;
                        break;
                    default:
                        str += escaped;
                }
            } else {
                str += text[index];
            }
            index++;
        }

        if (index >= text.length) {
            throw new Error('Unterminated string');
        }
        index++; // skip closing "

        return str;
    }

    function parseNumber() {
        let start = index;

        if (text[index] === '-') {
            index++;
        }

        if (text[index] === '0') {
            index++;
        } else if (isDigit(text[index])) {
            while (index < text.length && isDigit(text[index])) {
                index++;
            }
        } else {
            throw new Error('Invalid number');
        }

        if (text[index] === '.') {
            index++;
            if (!isDigit(text[index])) {
                throw new Error('Invalid number');
            }
            while (index < text.length && isDigit(text[index])) {
                index++;
            }
        }

        if (text[index] === 'e' || text[index] === 'E') {
            index++;
            if (text[index] === '+' || text[index] === '-') {
                index++;
            }
            if (!isDigit(text[index])) {
                throw new Error('Invalid number');
            }
            while (index < text.length && isDigit(text[index])) {
                index++;
            }
        }

        const numStr = text.substring(start, index);
        const num = parseFloat(numStr);

        if (isNaN(num)) {
            throw new Error('Invalid number: ' + numStr);
        }

        return num;
    }

    function parseBoolean() {
        if (text.substring(index, index + 4) === 'true') {
            index += 4;
            return true;
        }
        if (text.substring(index, index + 5) === 'false') {
            index += 5;
            return false;
        }
        throw new Error('Expected boolean');
    }

    function parseNull() {
        if (text.substring(index, index + 4) === 'null') {
            index += 4;
            return null;
        }
        throw new Error('Expected null');
    }

    function isDigit(ch) {
        return /[0-9]/.test(ch);
    }

    // 解析主值
    let result;
    try {
        result = parseValue();
        skipWhitespace();
        if (index < text.length) {
            throw new Error('Unexpected characters after parsing');
        }
    } catch (e) {
        throw new SyntaxError('JSON.parse: ' + e.message);
    }

    // 应用 reviver 转换
    if (typeof reviver === 'function') {
        const walk = (holder, key, reviver) => {
            const value = holder[key];
            if (value && typeof value === 'object') {
                for (const k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        const nested = walk(value, k, reviver);
                        if (nested === undefined) {
                            delete value[k];
                        } else {
                            value[k] = nested;
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        };
        result = walk({ '': result }, '', reviver);
    }

    return result;
}
```

## 使用示例

```js
const jsonString = '{"name":"张三","age":18,"isStudent":false,"hobbies":["读书","运动"]}';

console.log(JSON.myParse(jsonString));
// { name: '张三', age: 18, isStudent: false, hobbies: ['读书', '运动'] }

// 使用 reviver
const parsed = JSON.myParse(jsonString, (key, value) => {
    if (typeof value === 'number') {
        return value * 2;
    }
    return value;
});
console.log(parsed);
// { name: '张三', age: 36, isStudent: false, hobbies: ['读书', '运动'] }
```

## 面试追问点

### eval 方式的安全问题

```js
// 恶意 JSON 字符串可能包含危险代码
const malicious = '{"name":"test"}; console.log("hacked")';
eval('(' + malicious + ')'); // 会执行额外代码
```

### reviver 函数的作用

用于在返回结果之前转换值，例如：
- 转换日期字符串为 Date 对象
- 过滤某些属性
- 数据脱敏

### 为什么用括号包裹

```js
eval('({name: "test"})') // 解析为对象字面量
eval('{name: "test"}')    // 解析为代码块，label 语法
```