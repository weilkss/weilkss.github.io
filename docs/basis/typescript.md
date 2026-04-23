# TypeScript 深入理解

## 1. TypeScript 基础类型系统

### 1.1 TypeScript 有哪些基本类型？

TypeScript 是 JavaScript 的超集，它添加了静态类型检查。TypeScript 的基本类型可以分为以下几类：

```typescript
// ========== 基础类型 ==========
let isDone: boolean = false;
let count: number = 42;
let name: string = "张三";
let bigNumber: bigint = 100n;

// ========== Null 和 Undefined ==========
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// ========== Symbol ==========
let uniqueId: symbol = Symbol("id");

// ========== Array 数组类型 ==========
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// ========== Tuple 元组类型 ==========
let tuple: [string, number, boolean] = ["hello", 42, true];

// ========== Enum 枚举类型 ==========
enum Color {
    Red = "red",
    Green = "green",
    Blue = "blue",
}

// ========== Any 类型（尽量避免使用）==========
let anything: any = 4;
anything = "string";
anything = true;

// ========== Unknown 类型（类型安全的 any）==========
let unknown: unknown = 4;
if (typeof unknown === "string") {
    console.log(unknown.toUpperCase()); // 安全使用
}

// ========== Void 类型（通常用于函数返回值）==========
function logMessage(): void {
    console.log("这是一条消息");
}

// ========== Never 类型（永不返回）==========
function throwError(): never {
    throw new Error("错误");
}

// ========== Object 类型（非原始类型）==========
let obj: object = { name: "张三" };
```

**面试官追问点：**

- TypeScript 的类型系统是结构化类型还是名义类型？
- `unknown` 和 `any` 的区别是什么？
- `void` 和 `never` 的使用场景？

## 2. 接口与类型别名

### 2.1 interface 和 type 有什么区别？

虽然接口和类型别名在大多数情况下可以互换使用，但它们有一些关键区别：

```typescript
// ========== 共同点 ==========
interface Person1 {
    name: string;
    age: number;
}

type Person2 = {
    name: string;
    age: number;
};

// ========== 接口优势 ==========
// 1. 接口可以声明合并（Declaration Merging）
interface Animal {
    name: string;
}

interface Animal {
    age: number;
}
// Animal 现在有 name 和 age 两个属性

// 2. 接口更适合面向对象的设计（extends、implements）
class Dog implements Animal {
    name: string = "dog";
    age: number = 3;
}

// 3. 接口可以声明类的结构（implements）
interface Serializable {
    serialize(): string;
}

// ========== 类型别名优势 ==========
// 1. 类型别名可以表示联合类型
type StringOrNumber = string | number;
type Callback = () => void;

// 2. 类型别名可以表示交叉类型
type Employee = Person1 & { employeeId: number };

// 3. 类型别名可以表示元组
type Point = [number, number];

// 4. 类型别名可以表示映射类型
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// ========== 使用建议 ==========
// - 面向对象、设计类时：使用 interface
// - 处理复杂类型组合、联合类型时：使用 type
// - 需要声明合并时：必须使用 interface
```

**面试官追问点：**

- 什么情况下必须使用 `interface` 而不能用 `type`？
- `declare` 关键字的作用是什么？

## 3. 泛型

### 3.1 什么是泛型？请举例说明它的使用场景。

泛型是 TypeScript 最强大的特性之一，它允许我们编写可重用的组件，同时保持类型安全。

```typescript
// ========== 基础泛型函数 ==========
function identity<T>(arg: T): T {
    return arg;
}

identity<string>("hello"); // 显式指定类型
identity(42); // 类型推断

// ========== 泛型约束 ==========
// 约束 T 必须有 length 属性
function logLength<T extends { length: number }>(arg: T): T {
    console.log(arg.length);
    return arg;
}

logLength("hello"); // OK，字符串有 length
logLength([1, 2, 3]); // OK，数组有 length
logLength(123); // Error，数字没有 length

// ========== 多类型参数 ==========
function merge<T, U>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

const result = merge({ name: "张三" }, { age: 25 });
// result 类型为 { name: string } & { age: number }

// ========== 泛型接口 ==========
interface Container<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void;
}

class Box<T> implements Container<T> {
    constructor(public value: T) {}

    getValue(): T {
        return this.value;
    }

    setValue(value: T): void {
        this.value = value;
    }
}

// ========== 泛型工具类 ==========
class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

// 使用示例
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.pop(); // 2

const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.pop(); // "hello"

// ========== 泛型条件类型 ==========
type IsArray<T> = T extends Array<any> ? true : false;

type A = IsArray<number[]>; // true
type B = IsArray<string>; // false

// ========== 泛型默认参数 ==========
interface ApiResponse<T = string> {
    data: T;
    status: number;
}

type StringResponse = ApiResponse; // data 是 string
type NumberResponse = ApiResponse<number>; // data 是 number
```

**实际应用场景：**

- 数据结构实现（Stack、Queue、Map）
- API 请求/响应类型定义
- 身份验证/授权类型
- 表单验证规则

## 4. 联合类型与交叉类型

### 4.1 联合类型和交叉类型的区别是什么？

```typescript
// ========== 联合类型（Union Types）==========
// 表示值可以是多种类型之一
type StringOrNumber = string | number;

function processValue(value: StringOrNumber): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    } else {
        return value.toFixed(2);
    }
}

// 联合类型常用于可选字段
interface ButtonProps {
    variant: "primary" | "secondary" | "danger";
    size: "small" | "medium" | "large";
}

// ========== 交叉类型（Intersection Types）==========
// 表示值必须同时满足多个类型
interface HasName {
    name: string;
}

interface HasAge {
    age: number;
}

type Person = HasName & HasAge;

const person: Person = {
    name: "张三",
    age: 25,
};

// ========== 实际应用 ==========
// Mixin 模式
function withTimestamp<T extends object>(Base: T) {
    return class extends (Base as any) {
        timestamp = Date.now();
    };
}

class User {
    constructor(public name: string) {}
}

const TimestampedUser = withTimestamp(User);
const user = new TimestampedUser("张三");
console.log(user.name); // 张三
console.log(user.timestamp); // 时间戳

// ========== 联合 vs 交叉 对比 ==========
type A = { a: number } | { b: string }; // 有 a 或有 b
type B = { a: number } & { b: string }; // 同时有 a 和 b

const a1: A = { a: 1 }; // OK
const a2: A = { b: "hello" }; // OK
const a3: A = { a: 1, b: "hello" }; // 也 OK

const b1: B = { a: 1 }; // Error，必须同时有 b
const b2: B = { b: "hello" }; // Error，必须同时有 a
const b3: B = { a: 1, b: "hello" }; // OK
```

## 5. 类型守卫

### 5.1 TypeScript 的类型守卫有哪些？

类型守卫是 TypeScript 的一种机制，可以在条件块中缩小变量的类型范围。

```typescript
// ========== typeof 类型守卫 ==========
function process(value: string | number) {
    if (typeof value === "string") {
        // 编译器知道 value 是 string
        return value.toUpperCase();
    }
    // 编译器知道 value 是 number
    return value.toFixed(2);
}

// ========== instanceof 类型守卫 ==========
class Dog {
    bark() {
        console.log("汪汪");
    }
}

class Cat {
    meow() {
        console.log("喵喵");
    }
}

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();
    } else {
        animal.meow();
    }
}

// ========== in 操作符类型守卫 ==========
interface Fish {
    swim(): void;
}

interface Bird {
    fly(): void;
}

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        animal.swim();
    } else {
        animal.fly();
    }
}

// ========== 字面量类型守卫 ==========
type Event = { type: "click"; x: number; y: number } | { type: "keydown"; key: string };

function handleEvent(event: Event) {
    if (event.type === "click") {
        console.log(`点击坐标: ${event.x}, ${event.y}`);
    } else {
        console.log(`按键: ${event.key}`);
    }
}

// ========== 自定义类型守卫 ==========
interface Fruit {
    kind: "fruit";
    name: string;
}

interface Vegetable {
    kind: "vegetable";
    name: string;
}

function isFruit(obj: any): obj is Fruit {
    return obj && obj.kind === "fruit";
}

function getName(item: Fruit | Vegetable): string {
    if (isFruit(item)) {
        return item.name; // TypeScript 知道是 Fruit
    }
    return item.name; // TypeScript 知道是 Vegetable
}

// ========== 可辨识联合类型（Discriminated Unions）==========
interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    side: number;
}

interface Triangle {
    kind: "triangle";
    base: number;
    height: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.side ** 2;
        case "triangle":
            return 0.5 * shape.base * shape.height;
    }
}
```

## 6. 映射类型

### 6.1 什么是映射类型？如何实现一个只读映射类型？

映射类型是 TypeScript 提供的一种语法，可以基于已有类型创建新类型。

```typescript
// ========== TypeScript 内置映射类型 ==========
// Readonly - 将所有属性变为只读
type ReadonlyPerson = Readonly<{ name: string; age: number }>;
// 等同于: { readonly name: string; readonly age: number; }

// Partial - 将所有属性变为可选
type PartialPerson = Partial<{ name: string; age: number }>;
// 等同于: { name?: string; age?: number; }

// Required - 将所有可选属性变为必需
type RequiredPerson = Required<{ name?: string; age?: number }>;

// Pick - 选取部分属性
type PersonName = Pick<{ name: string; age: number; gender: string }, "name">;
// 等同于: { name: string; }

// Omit - 排除部分属性
type PersonWithoutAge = Omit<{ name: string; age: number; gender: string }, "age">;
// 等同于: { name: string; gender: string; }

// Record - 创建键值对类型
type PersonDict = Record<string, { name: string; age: number }>;

// ========== 自定义映射类型 ==========
// 只读映射类型实现
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
};

// 可选映射类型实现
type MyPartial<T> = {
    [P in keyof T]?: T[P];
};

// 只读数组映射类型
type ReadonlyArray<T> = {
    readonly [P in number]: T;
};

// ========== 映射类型结合泛型 ==========
type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};

type User = { name: string; age: number };
type NullableUser = Nullable<User>;
// { name: string | null; age: number | null; }

// ========== 映射类型结合条件类型 ==========
type OptionalKeys<T> = {
    [P in keyof T]-?: undefined extends T[P] ? P : never;
}[keyof T];

type User2 = { name?: string; age: number; gender?: string };
type OptionalKeysOfUser = OptionalKeys<User2>; // "name" | "gender"

// ========== 实际应用：API 响应类型构建 ==========
type ApiResponse<T> = {
    data: T;
    status: number;
    message: string;
};

type PaginatedResponse<T> = {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
    };
};

// 使用示例
function fetchUsers(): Promise<ApiResponse<User[]>> {
    return fetch("/api/users").then((res) => res.json());
}
```

## 7. 条件类型

### 7.1 什么是条件类型？请举例说明。

条件类型是 TypeScript 2.8 引入的特性，它允许我们基于类型关系创建条件类型。

```typescript
// ========== 基础条件类型 ==========
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"

// ========== 泛型条件类型 ==========
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null | undefined>; // string
type B = NonNullable<number | undefined>; // number

// ========== 条件类型的分发特性 ==========
type ToArray<T> = T extends any ? T[] : never;

type StrArr = ToArray<string>; // string[]
type NumArr = ToArray<number>; // number[]
type StrOrNumArr = ToArray<string | number>; // string[] | number[]

// 如果不想分发，用元组包装
type ToArrayNonDistribute<T> = [T] extends [any] ? T[] : never;
type Both = ToArrayNonDistribute<string | number>; // (string | number)[]

// ========== infer 关键字 ==========
// 从类型中提取类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type A = ReturnType<() => string>; // string
type B = ReturnType<() => Promise<number>>; // Promise<number>
type C = ReturnType<(x: number) => boolean>; // boolean

// 提取数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : never;

type A = ElementType<string[]>; // string
type B = ElementType<number[]>; // number

// 提取函数参数类型
type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never;

type A = FirstArg<(x: string, y: number) => void>; // string

// ========== 实际应用：类型安全的 EventEmitter ==========
type EventMap = {
    click: { x: number; y: number };
    keydown: { key: string };
    resize: { width: number; height: number };
};

type EventHandler<T> = (data: T) => void;

type Emitter<T extends Record<string, any>> = {
    on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
    off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void;
    emit<K extends keyof T>(event: K, data: T[K]): void;
};

// 使用示例
const emitter: Emitter<EventMap> = createEmitter();

emitter.on("click", ({ x, y }) => console.log(`点击: ${x}, ${y}`));
emitter.on("keydown", ({ key }) => console.log(`按键: ${key}`));

// 错误类型会报错
emitter.emit("click", { key: "Enter" }); // Error: 类型不匹配
```

## 8. 装饰器

### 8.1 TypeScript 装饰器是什么？有哪些类型？

装饰器是 TypeScript 的实验性特性（需开启 `experimentalDecorators`），它允许我们在不修改类代码的情况下给类添加功能。

```typescript
// ========== 启用装饰器 ==========
// tsconfig.json: { "experimentalDecorators": true }

// ========== 类装饰器 ==========
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Person {
    constructor(public name: string) {}
}

// ========== 工厂装饰器 ==========
function logger(prefix: string) {
    return function <T extends Function>(target: T): T {
        const original = target;

        function wrapper(...args: any[]) {
            console.log(`${prefix}: 调用构造函数`);
            return new original(...args);
        }

        wrapper.prototype = original.prototype;
        return wrapper as any;
    };
}

@logger("INFO")
class User {
    constructor(public name: string) {
        console.log(`创建用户: ${name}`);
    }
}

// ========== 方法装饰器 ==========
function readonly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
}

function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`调用 ${propertyKey}，参数:`, args);
        return original.apply(this, args);
    };

    return descriptor;
}

class Calculator {
    @readonly
    static PI = 3.14159;

    @log
    add(a: number, b: number): number {
        return a + b;
    }
}

// Calculator.PI = 3;  // Error: Cannot assign to readonly property

// ========== 属性装饰器 ==========
function minLength(length: number) {
    return function (target: any, propertyKey: string) {
        let value: string;

        Object.defineProperty(target, propertyKey, {
            get: () => value,
            set: (newValue: string) => {
                if (newValue.length < length) {
                    throw new Error(`${propertyKey} 长度必须至少 ${length}`);
                }
                value = newValue;
            },
        });
    };
}

class Product {
    @minLength(3)
    name: string = "";

    constructor(name: string) {
        this.name = name;
    }
}

// new Product("ab");  // Error: name 长度必须至少 3

// ========== 参数装饰器 ==========
function validate(target: any, methodName: string, parameterIndex: number) {
    const method = target[methodName];

    target[methodName] = function (...args: any[]) {
        if (parameterIndex < args.length && args[parameterIndex] < 0) {
            throw new Error("参数不能为负数");
        }
        return method.apply(this, args);
    };
}

class MathService {
    divide(@validate a: number, b: number): number {
        return a / b;
    }
}

// ========== 装饰器组合 ==========
function first() {
    console.log("first(): evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("first(): called");
    };
}

function second() {
    console.log("second(): evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("second(): called");
    };
}

class Example {
    @first()
    @second()
    method() {}
}

// 输出顺序:
// first(): evaluated
// second(): evaluated
// second(): called
// first(): called
```

## 9. 工具类型实现

### 9.1 手写实现 TypeScript 内置的工具类型。

```typescript
// ========== MyReadonly ==========
type MyReadonly<T> = {
    readonly [P in keyof T]: T[P];
};

// ========== MyPartial ==========
type MyPartial<T> = {
    [P in keyof T]?: T[P];
};

// ========== MyRequired ==========
type MyRequired<T> = {
    [P in keyof T]-?: T[P]; // -? 移除可选标记
};

// ========== MyPick ==========
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// ========== MyOmit ==========
type MyOmit<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P];
};

// ========== MyRecord ==========
type MyRecord<K extends keyof any, V> = {
    [P in K]: V;
};

// ========== MyReturnType ==========
type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

// ========== MyParameters ==========
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

// ========== MyConstructorParameters ==========
type MyConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

// ========== MyInstanceType ==========
type MyInstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;

// ========== MyExclude ==========
type MyExclude<T, U> = T extends U ? never : T;

// ========== MyExtract ==========
type MyExtract<T, U> = T extends U ? T : never;

// ========== MyNonNullable ==========
type MyNonNullable<T> = T extends null | undefined ? never : T;

// ========== MyAwaited ==========
type MyAwaited<T> = T extends null | undefined ? T : T extends PromiseLike<infer R> ? MyAwaited<R> : T;

// ========== 使用示例 ==========
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

type UserReadonly = MyReadonly<User>;
// { readonly id: number; readonly name: string; ... }

type UserPartial = MyPartial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

type UserPick = MyPick<User, "id" | "name">;
// { id: number; name: string; }

type UserOmit = MyOmit<User, "email">;
// { id: number; name: string; age: number; }

type UserInfo = MyRecord<"personal" | "work", User>;
// { personal: User; work: User; }

type UserName = MyReturnType<() => User>;
// User

type CreateUserArgs = MyParameters<typeof createUser>;
// [name: string, age: number]

type NameOrAge = MyExtract<keyof User, "name" | "age">;
// "name" | "age"

type NonNullName = MyNonNullable<string | null | undefined>;
// string
```

## 10. TypeScript 编译配置

### 10.1 tsconfig.json 有哪些重要配置项？

```json
{
    "compilerOptions": {
        // ========== 严格模式（推荐开启）==========
        "strict": true,
        // 相当于同时开启:
        // - strictNullChecks
        // - strictFunctionTypes
        // - strictBindCallApply
        // - strictPropertyInitialization
        // - noImplicitAny
        // - noImplicitThis
        // - alwaysStrict

        // ========== 目标版本 ==========
        "target": "ES2020",
        // 编译目标: ES5, ES6, ES2015, ES2020, ESNext

        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        // 包含的库类型定义文件

        // ========== 模块系统 ==========
        "module": "ESNext",
        // 模块系统: CommonJS, AMD, ES6, ES2020, ESNext

        "moduleResolution": "node",
        // 模块解析策略: node (classic)

        // ========== 输出控制 ==========
        "outDir": "./dist",
        // 编译输出目录

        "rootDir": "./src",
        // 源码目录

        "declaration": true,
        // 生成 .d.ts 类型声明文件

        "declarationMap": true,
        // 生成声明文件的 source map

        "sourceMap": true,
        // 生成 source map

        // ========== 严格检查 ==========
        "noImplicitAny": true,
        // 禁止隐式 any 类型

        "strictNullChecks": true,
        // 严格 null 和 undefined 检查

        "strictFunctionTypes": true,
        // 严格函数类型检查

        "noUnusedLocals": true,
        // 检查未使用的局部变量

        "noUnusedParameters": true,
        // 检查未使用的参数

        "noImplicitReturns": true,
        // 检查函数是否所有路径都有返回值

        // ========== 其他选项 ==========
        "esModuleInterop": true,
        // 允许使用 import * as fs from 'fs'

        "allowSyntheticDefaultImports": true,
        // 允许合成默认导出

        "forceConsistentCasingInFileNames": true,
        // 强制文件名大小写一致

        "skipLibCheck": true,
        // 跳过类型声明文件的类型检查

        "resolveJsonModule": true,
        // 允许导入 JSON 文件

        "isolatedModules": true,
        // 将每个文件作为单独的模块

        "noEmit": false,
        // 不生成输出文件（用于类型检查）

        "jsx": "react-jsx"
        // JSX 处理方式
    },

    "include": ["src/**/*"],
    // 需要编译的文件

    "exclude": ["node_modules", "dist"]
    // 排除的文件
}
```

## 11. any vs unknown vs never

### 11.1 详细说明 any、unknown 和 never 的区别。

```typescript
// ========== any 类型 ==========
// any 是"任意类型"，使用它等同于放弃类型检查
let value: any = 4;
value = "string"; // OK
value = true; // OK
value.foo.bar.baz(); // OK，编译器不报错

// 问题：any 会"污染"周围类型
function processValue(val: any) {
    return val.toFixed(2); // 如果 val 不是 number，运行时错误
}

// ========== unknown 类型 ==========
// unknown 是"未知类型"，比 any 更安全
let unknownValue: unknown = 4;
unknownValue = "string"; // OK
unknownValue = true; // OK

// unknownValue.toFixed(2);  // Error，不能直接使用
// 必须进行类型检查后才能使用
if (typeof unknownValue === "number") {
    console.log(unknownValue.toFixed(2)); // OK，编译器知道是 number
}

// ========== never 类型 ==========
// never 是"永不返回"类型
function alwaysThrows(): never {
    throw new Error("永远抛出异常");
}

function infiniteLoop(): never {
    while (true) {
        // 永不返回
    }
}

// never 用于类型收窄
type Shape = Circle | Square | Triangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.side ** 2;
        case "triangle":
            return 0.5 * shape.base * shape.height;
        default:
            // shape: never，穷举检查
            const _exhaustive: never = shape;
            return _exhaustive;
    }
}

// ========== 三者对比 ==========
// any: 绕过所有类型检查
// unknown: 必须进行类型检查才能使用
// never: 不可能有值

// 函数返回 never 的场景：
// 1. 函数总是抛出异常
// 2. 函数是无限循环
// 3. 用于类型收窄的穷举检查

// ========== 实际应用 ==========
// 安全的 JSON 解析
function safeJSONParse(json: string): unknown {
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

const result = safeJSONParse('{"name": "张三"}');
if (typeof result === "object" && result !== null) {
    console.log((result as { name: string }).name);
}
```

## 12. 类型断言

### 12.1 类型断言有哪些方式？有什么风险？

```typescript
// ========== 类型断言方式 ==========
// 1. as 语法（推荐）
let value: unknown = "hello";
let str: string = value as string;

// 2. 尖括号语法（与 JSX 冲突，不推荐）
let str2: string = <string>value;

// ========== 非空断言 ==========
let name: string | null = getName();
console.log(name!.toUpperCase()); // 告诉编译器 name 不为 null

// ========== 确定赋值断言 ==========
let definitelyInitialized!: number;
initialize();
console.log(definitelyInitialized.toFixed());

// ========== 常量断言 ==========
const user = {
    name: "张三",
    age: 25,
} as const;
// user 变为只读对象，所有属性都是字面量类型

// ========== 类型断言风险 ==========
// 1. 假断言导致运行时错误
let value: any = "hello";
let num: number = value as number;
console.log(num.toFixed(2)); // 运行时错误！

// 2. 断言链（双重断言）
// any as unknown as string
// 应该尽量避免

// 3. 过度断言破坏类型安全
interface Cat {
    meow(): void;
}

interface Dog {
    bark(): void;
}

function isDog(animal: Cat | Dog): animal is Dog {
    return "bark" in animal;
}

const cat: Cat = { meow: () => {} };
// const dog = cat as Dog;  // 危险！破坏了类型安全

// ========== 安全使用类型断言 ==========
// 1. 使用类型守卫
function isString(value: unknown): value is string {
    return typeof value === "string";
}

if (isString(value)) {
    console.log(value.toUpperCase()); // 安全
}

// 2. 使用可辨识联合类型
interface SuccessResponse {
    status: "success";
    data: any;
}

interface ErrorResponse {
    status: "error";
    error: string;
}

type Response = SuccessResponse | ErrorResponse;

function handleResponse(response: Response) {
    if (response.status === "success") {
        console.log(response.data); // 类型收窄为 any
    } else {
        console.log(response.error);
    }
}

// 3. 类型守卫结合断言
function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Value is not a string!");
    }
}

function process(value: unknown) {
    assertIsString(value);
    console.log(value.toUpperCase()); // 安全
}
```

## 13. 函数重载

### 13.1 TypeScript 的函数重载如何使用？

```typescript
// ========== 函数重载签名 ==========
// 1. 先声明重载签名
function greet(name: string): string;
function greet(names: string[]): string[];
function greet(nameOrNames: string | string[]): string | string[] {
    if (typeof nameOrNames === "string") {
        return `Hello, ${nameOrNames}!`;
    } else {
        return nameOrNames.map((name) => `Hello, ${name}!`);
    }
}

// 2. 具体实现只有一个，但可以有多个类型签名

// ========== 实际应用：DOM 操作 ==========
function getElement(id: "username"): HTMLInputElement;
function getElement(id: "password"): HTMLInputElement;
function getElement(id: "submit"): HTMLButtonElement;
function getElement(id: string): HTMLElement | null {
    return document.getElementById(id);
}

const usernameInput = getElement("username");
usernameInput.value; // TypeScript 知道是 HTMLInputElement

// ========== 构造函数重载 ==========
class Builder {
    private data: Record<string, any> = {};

    withName(name: string): this {
        this.data.name = name;
        return this;
    }

    withAge(age: number): this {
        this.data.age = age;
        return this;
    }

    build(): { name?: string; age?: number } {
        return this.data;
    }
}

const user = new Builder().withName("张三").withAge(25).build();

// ========== 泛型重载 ==========
function create<T>(value: T): T;
function create<T>(value: T, defaultValue: T): T;
function create<T>(value: T, defaultValue?: T): T {
    return value !== undefined ? value : defaultValue!;
}

const a = create(42); // number
const b = create<string>("hi"); // string
```

## 14. 命名空间 vs 模块

### 14.1 命名空间和模块有什么区别？

```typescript
// ========== 命名空间（Namespace）==========
// 旧式组织代码的方式，已不推荐
namespace Validation {
    export interface StringValidator {
        isValid(s: string): boolean;
    }

    export class EmailValidator implements StringValidator {
        isValid(s: string): boolean {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isValid(s: string): boolean {
            return /^\d{6}$/.test(s);
        }
    }
}

// 使用
const validators: Validation.StringValidator[] = [];
validators.push(new Validation.EmailValidator());

// ========== 模块（Module）==========
// 现代 TypeScript 推荐方式
// user.ts
export interface User {
    id: number;
    name: string;
}

export function createUser(name: string): User {
    return { id: Date.now(), name };
}

// main.ts
import { User, createUser } from "./user";

// ========== 主要区别 ==========
// 1. 模块自动开启严格模式，命名空间不会
// 2. 模块可以声明合并，命名空间不行
// 3. 模块是真实的结构，命名空间只是逻辑分组
// 4. 模块可以被打包工具优化，命名空间不行
// 5. ES 模块是标准，命名空间是 TypeScript 特有

// ========== 推荐做法 ==========
// 使用 ES 模块 + ES6+ 语法
// 避免使用 namespace 关键字
// 使用 import/export 代替

// 如果必须使用命名空间（如旧项目改造）
// 考虑使用 @deprecated 标记
```

## 15. this 类型

### 15.1 TypeScript 中 this 类型如何工作？

```typescript
// ========== 显式 this 参数 ==========
// 在函数第一个参数位置声明 this 类型
function highlight(this: HTMLElement, content: string) {
    this.textContent = content;
    this.style.backgroundColor = "yellow";
}

// ========== 回调中的 this ==========
class Counter {
    private count = 0;

    // 错误：回调中的 this 会是 undefined
    // setInterval(function() {
    //     this.count++;  // Error
    // }, 1000);

    // 正确：使用箭头函数
    setInterval(() => {
        this.count++;
    }, 1000);

    // 正确：使用 bind
    setInterval(function() {
        this.count++;
    }.bind(this), 1000);
}

// ========== this 类型约束 ==========
interface Node {
    value: number;
    next?: Node;
}

function append(this: Node, value: number): Node {
    const newNode: Node = { value, next: this.next };
    this.next = newNode;
    return newNode;
}

// ========== 链式调用 ==========
class ChainBuilder {
    private parts: string[] = [];

    add(value: string): this {
        this.parts.push(value);
        return this;
    }

    upper(): this {
        this.parts = this.parts.map(p => p.toUpperCase());
        return this;
    }

    build(): string {
        return this.parts.join("-");
    }
}

const result = new ChainBuilder()
    .add("hello")
    .add("world")
    .upper()
    .build();  // "HELLO-WORLD"
```

## 16. 三斜线指令

### 16.1 三斜线指令是什么？什么时候使用？

```typescript
// ========== 三斜线指令 ==========
/// <reference path="logger.ts" />
/// <reference types="node" />
/// <reference lib="es2015.symbol" />

// 这些是 TypeScript 早期的模块导入方式
// 现代 TypeScript 推荐使用 import 语法

// ========== 常见使用场景 ==========
// 1. 声明文件引用
/// <reference types="react" />

// 2. 声明全局变量（在 .d.ts 文件中）
/// <reference path="./global.d.ts" />

// ========== 现代替代方案 ==========
// 替代 reference path
import { something } from "./module";

// 替代 reference types
import "react";

// 替代 reference lib
// 在 tsconfig.json 中配置 lib
```

## 17. Declaration Files

### 17.1 什么是声明文件？如何创建？

```typescript
// ========== 声明文件（.d.ts）==========
// 用于为 JavaScript 库提供类型信息

// my-library.d.ts
declare module "my-library" {
    export interface Config {
        debug: boolean;
        timeout: number;
    }

    export function initialize(config: Config): void;
    export class ApiClient {
        constructor(baseUrl: string);
        get<T>(path: string): Promise<T>;
        post<T>(path: string, data: any): Promise<T>;
    }

    export default ApiClient;
}

// ========== 全局声明 ==========
// global.d.ts
declare global {
    interface Window {
        ga: (command: string, ...args: any[]) => void;
    }

    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
        }
    }
}

export {};

// ========== 模块扩展 ==========
// 为现有模块添加类型
declare module "express" {
    interface Application {
        locals: any;
    }
}

// ========== 声明合并 ==========
// 为同一模块多次声明会自动合并
declare module "counter" {
    export function increment(): void;
}

declare module "counter" {
    export function decrement(): void;
}

// 使用时两个都能用
import { increment, decrement } from "counter";

// ========== 最佳实践 ==========
// 1. 优先使用 npm 包自带的 @types/xxx
// 2. 使用 declare module 扩展第三方模块
// 3. 使用 declare global 扩展全局类型
// 4. 确保声明文件与实际实现一致
```

## 18. 协变与逆变

### 18.1 什么是协变和逆变？

```typescript
// ========== 基础概念 ==========
// 协变（Covariant）：只能"更宽"的方向使用
// 逆变（Contravariant）：只能"更窄"的方向使用
// 不变（Invariant）：两个方向都不能

// ========== TypeScript 中的表现 ==========
// 函数参数是逆变的
type Func<A, B> = (a: A) => B;

type Parent = { name: string };
type Child = { name: string; age: number };

// 参数类型：逆变
let funcChildToParent: Func<Parent, Child>;
// 可以赋值给参数更宽的类型
let funcParentToParent: Func<Parent, Parent> = funcChildToParent;

// 返回值类型：协变
let returnChild: () => Child;
let returnParent: () => Parent = returnChild; // OK，Child 是 Parent 的子类型

// ========== 实际场景 ==========
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

function makeDogSpeak(dog: Dog): string {
    return `${dog.name} says woof!`;
}

// Dog extends Animal，所以 Func<Dog, Dog> 可以赋值给 Func<Animal, Animal>
// 但参数是逆变的，所以 Func<Animal, Dog> 可以赋值给 Func<Dog, Dog>

// ========== TypeScript 编译器选项 ==========
// strictFunctionTypes 开启后启用严格函数类型检查
// 会更严格地检查函数参数的协变/逆变

// ========== 类类型检查 ==========
class AnimalShelter<T extends Animal> {
    private animals: T[] = [];

    add(animal: T): void {
        this.animals.push(animal);
    }

    get(): T {
        return this.animals[0];
    }
}

const dogShelter = new AnimalShelter<Dog>();
// const animalShelter: AnimalShelter<Animal> = dogShelter;  // Error
// 因为 add 方法的参数是 T，不能逆变
```

## 19. TypeScript 与 JavaScript 区别

### 19.1 TypeScript 相比 JavaScript 有哪些优势？

```typescript
// ========== 静态类型检查 ==========
// JavaScript：运行时才发现错误
function add(a, b) {
    return a + b;
}
add(1, "2"); // "12" - 静默失败

// TypeScript：编译时发现错误
function addTS(a: number, b: number): number {
    return a + b;
}
// addTS(1, "2");  // 编译错误

// ========== IDE 支持 ==========
// TypeScript 提供：
// - 智能提示
// - 重构支持
// - 跳转到定义
// - 查找引用

// ========== 接口和类型别名 ==========
// TypeScript
interface User {
    name: string;
    age: number;
}

// JavaScript 只能使用对象和注释
// const user = { name: "张三", age: 25 };
// // name 和 age 是隐式的，没有类型保证

// ========== 泛型 ==========
// TypeScript
function identity<T>(arg: T): T {
    return arg;
}

// JavaScript 无法在语言层面支持泛型
// 只能使用 any 或注释

// ========== 枚举 ==========
// TypeScript
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

// JavaScript
const Direction = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3,
};

// ========== 访问修饰符 ==========
// TypeScript
class BankAccount {
    private balance: number;

    public deposit(amount: number): void {
        this.balance += amount;
    }

    protected withdraw(amount: number): void {
        if (amount <= this.balance) {
            this.balance -= amount;
        }
    }
}

// JavaScript 没有访问修饰符
// 只能依赖约定（_privateMethod）或 Symbol

// ========== 编译配置 ==========
// TypeScript 可以配置：
// - 目标 ECMAScript 版本
// - 模块系统
// - 严格模式
// - 严格 null 检查

// ========== 代码可读性 ==========
// TypeScript 的类型就是文档
function processUser(user: { id: number; name: string; email: string }): Promise<{ success: boolean }> {
    // ...
}

// JavaScript 需要额外注释
// function processUser(user) {
//     // @param {Object} user - 用户对象
//     // @param {number} user.id - 用户 ID
//     // @param {string} user.name - 用户名
//     // @param {string} user.email - 用户邮箱
//     // @returns {Promise<{success: boolean}>}
// }
```

## 20. 高级类型技巧

### 20.1 你知道哪些 TypeScript 高级类型技巧？

```typescript
// ========== 递归类型 ==========
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? (T[P] extends Function ? T[P] : DeepReadonly<T[P]>) : T[P];
};

type NestedObject = {
    user: {
        name: string;
        address: {
            city: string;
        };
    };
};

type ReadonlyNested = DeepReadonly<NestedObject>;
// 所有嵌套属性都变为 readonly

// ========== 模板字面量类型 ==========
type EventName = "click" | "focus" | "blur";
type Handler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

type PropEventSource<T> = {
    on<K extends string & keyof T>(eventName: `${K}Changed`, callback: (newValue: T[K]) => void): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

const person = makeWatchedObject({
    firstName: "张三",
    lastName: "李四",
    age: 25,
});

person.on("firstNameChanged", (newValue) => {
    console.log(`名字改为: ${newValue}`);
});

// ========== 索引访问类型 ==========
type Person = { name: string; age: number };
type Name = Person["name"]; // string

type ArrayElement<T> = T extends (infer E)[] ? E : never;
type StrArr = string[];
type StrArrElement = ArrayElement<StrArr>; // string

// ========== 类型查询 ==========
const user = { name: "张三", age: 25 };
type UserType = typeof user;
// type UserType = { name: string; age: number; }

type FunctionReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never;

// ========== 条件类型分布 ==========
type ToArray<T> = T extends any ? T[] : never;

type A = ToArray<string | number>;
// string[] | number[]（分发）

// ==========infer + 分布式条件类型 ==========
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>; // string
type B = UnwrapPromise<number>; // number
type C = UnwrapPromise<Promise<string> | Promise<number>>;
// string | number（分布式）

// ========== 混合类型技巧 ==========
// 类型安全的 EventEmitter
type EventMap = {
    [K: string]: any;
};

class TypedEventEmitter<T extends EventMap> {
    private handlers: { [K in keyof T]?: T[K][] } = {};

    on<K extends keyof T>(event: K, handler: T[K]): this {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event]!.push(handler);
        return this;
    }

    emit<K extends keyof T>(event: K, ...args: any[]): this {
        const handlers = this.handlers[event] as Function[];
        handlers?.forEach((h) => h(...args));
        return this;
    }
}

const emitter = new TypedEventEmitter<{
    userCreated: (user: { id: number; name: string }) => void;
    userDeleted: (id: number) => void;
}>();

emitter.on("userCreated", (user) => console.log(user.id));
emitter.emit("userDeleted", 123);
```

## 附录：面试常见问题汇总

### 必知必会概念

| 概念     | 说明                                        |
| -------- | ------------------------------------------- |
| 泛型约束 | 使用 `extends` 限制泛型类型                 |
| 类型守卫 | 缩小类型范围的 `typeof`、`instanceof`、`in` |
| 映射类型 | 使用 `in keyof` 遍历类型                    |
| 条件类型 | `T extends U ? X : Y`                       |
| infer    | 在条件类型中推断类型                        |
| 装饰器   | `@decorator` 语法（实验性）                 |
| 模块扩展 | `declare module` 扩展第三方类型             |

### 常见错误及解决方案

| 错误 | 解决方案 |
| - | |
| `Object is possibly 'null'` | 使用 `?.` 或类型守卫 |
| `Property does not exist` | 检查接口/类型定义 |
| `Type 'X' is not assignable to type 'Y'` | 使用类型断言或类型收窄 |
| `Generic type 'X' requires 1 type argument(s)` | 添加泛型参数 `<T>` |
| `Circular dependency` | 重构类型设计或使用 `interface` |
