# React 基础知识

React 是 Facebook 开发的用于构建用户界面的 JavaScript 库，主要用于构建单页应用（SPA）。

---

## 核心概念

### JSX

JSX 是 JavaScript 的语法扩展，允许在 JavaScript 中编写类似 HTML 的语法。

```jsx
// JSX 语法
const element = <h1 className="title">Hello, React!</h1>;

// JSX 表达式
const name = "World";
const element = <h1>Hello, {name}!</h1>;

// 条件渲染
const isLoggedIn = true;
const element = (
    <div>
        {isLoggedIn ? <h1>Welcome!</h1> : <h1>Please login.</h1>}
    </div>
);

// 列表渲染
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((num) => (
    <li key={num}>{num}</li>
));
```

### 元素渲染

React 元素是不可变对象，创建后无法修改其属性或子节点。

```jsx
// 创建元素
const element = React.createElement(
    "h1",
    { className: "greeting" },
    "Hello, world!"
);

// 渲染到 DOM
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(element);
```

### 组件

组件分为函数组件和类组件两种形式。

```jsx
// 函数组件
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

// 类组件
class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

// 使用组件
const element = <Welcome name="Sara" />;
```

---

## Props

Props 是组件的只读属性，用于父组件向子组件传递数据。

```jsx
// 传递 props
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

<Welcome name="Sara" />

// Props .children 用于组件间嵌套内容
function Card(props) {
    return <div className="card">{props.children}</div>;
}

<Card>
    <h1>Title</h1>
    <p>Content</p>
</Card>
```

### 面试高频问题

### Q1：Props 和 State 的区别？

**答**：

| 特性 | Props | State |
|------|-------|-------|
| 作用 | 父组件传递给子组件的数据 | 组件内部管理的数据 |
| 职责 | 决定组件如何渲染 | 决定组件如何展示和交互 |
| 可变性 | 只读，不能在组件内部修改 | 可变，变化时会触发重新渲染 |
| 定义位置 | 父组件定义 | 组件内部定义和初始化 |
| 传递方向 | 单向数据流，只能父传子 | 组件内部私有 |

### Q2：为什么 Props 是只读的？

**答**：

1. **保证单向数据流**：React 推崇自上而下的数据流，props 从父组件流向子组件，子组件不能直接修改 props
2. **保证应用可预测性**：如果子组件可以修改 props，会导致数据流混乱，难以追踪数据变化来源
3. **职责分离**：数据拥有者（父组件）负责管理数据，展示者（子组件）负责呈现数据

---

## State

State 是组件内部的状态管理，用于存储会随时间变化的数据。

```jsx
// 类组件中的 state
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        };
    }

    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}

// 函数组件中的 state (Hooks)
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
```

### 面试高频问题

### Q1：setState 是同步还是异步的？

**答**：

在 React 中，`setState` 的行为比较复杂：

1. **在 React 事件处理函数中**：表现为异步，会进行批量更新

```jsx
// 在 React 事件中，setState 是异步的
handleClick() {
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count); // 仍是旧值
}
```

2. **在 setTimeout、Promise 等原生事件中**：表现为同步

```jsx
// 在原生事件中，setState 是同步的
componentDidMount() {
    setTimeout(() => {
        this.setState({ count: this.state.count + 1 });
        console.log(this.state.count); // 已更新
    }, 0);
}
```

3. **React 18 之前**：只有 React 事件处理函数中的批量更新才生效
4. **React 18 之后**：所有 setState 都是自动批处理的

### Q2：如何正确更新 State？

**答**：

1. **不要直接修改 state**：

```jsx
// 错误
this.state.count = this.state.count + 1;

// 正确
this.setState({ count: this.state.count + 1 });
```

2. **使用函数式 setState**：当新状态依赖旧状态时，使用函数式更新

```jsx
// 正确
this.setState((prevState) => ({
    count: prevState.count + 1,
}));
```

3. **状态提升**：如果多个组件需要共享状态，将状态提升到共同的父组件

---

## 生命周期

React 组件从创建到销毁会经历一系列生命周期方法。

### 类组件生命周期

```
┌─────────────────────────────────────────────────────────────────┐
│                    类组件生命周期                                 │
├─────────────────────────────────────────────────────────────────┤
│  挂载阶段 (Mounting)                                            │
│  ├── constructor()        - 组件实例化                           │
│  ├── render()            - 渲染                                 │
│  └── componentDidMount() - DOM 已挂载，可进行副作用操作          │
│                                                                 │
│  更新阶段 (Updating)                                            │
│  ├── render()            - 重新渲染                             │
│  └── componentDidUpdate() - DOM 已更新，可进行副作用操作         │
│                                                                 │
│  卸载阶段 (Unmounting)                                          │
│  └── componentWillUnmount() - 组件即将卸载，清理副作用           │
└─────────────────────────────────────────────────────────────────┘
```

```jsx
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }

    componentDidMount() {
        console.log("组件已挂载");
        this.timer = setInterval(() => {
            console.log("Timer running");
        }, 1000);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("组件已更新", prevProps, prevState);
    }

    componentWillUnmount() {
        console.log("组件即将卸载");
        clearInterval(this.timer);
    }

    render() {
        return <div>Count: {this.state.count}</div>;
    }
}
```

### 函数组件生命周期（Hooks）

```jsx
import { useState, useEffect } from "react";

function Example() {
    const [count, setCount] = useState(0);

    // 相当于 componentDidMount + componentDidUpdate
    useEffect(() => {
        console.log("Effect running");
        document.title = `Count: ${count}`;

        // 相当于 componentWillUnmount
        return () => {
            console.log("Cleanup");
        };
    }, [count]); // 依赖数组，count 变化时执行

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
```

### 面试高频问题

### Q1：useEffect 的依赖数组为空和没有依赖数组有什么区别？

**答**：

| 情况 | 执行时机 | 说明 |
|------|---------|------|
| `useEffect(() => {})` | 每次渲染后都执行 | 不推荐，可能导致性能问题 |
| `useEffect(() => {}, [])` | 仅首次渲染后执行 | 相当于 componentDidMount |
| `useEffect(() => {}, [dep])` | 首次渲染 + dep 变化时执行 | 相当于 componentDidUpdate |

### Q2：useEffect 的 cleanup 函数什么时候执行？

**答**：

1. **组件卸载时**：执行 cleanup 函数进行清理

```jsx
useEffect(() => {
    const timer = setInterval(() => {
        console.log("Timer");
    }, 1000);

    return () => clearInterval(timer); // 卸载时清理
}, []);
```

2. **下一次 effect 执行前**：在运行新的 effect 之前，先执行上一次 effect 的 cleanup

```jsx
useEffect(() => {
    console.log("Effect 1");

    return () => {
        console.log("Cleanup 1"); // 下一次 effect 执行前会先执行这个
    };
}, [count]);
```

---

## 事件处理

React 中的事件处理与 DOM 事件类似，但有一些语法差异。

### 基本用法

```jsx
// 类组件中的事件处理
class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };
        // 绑定 this
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState((state) => ({
            isToggleOn: !state.isToggleOn,
        }));
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                {this.state.isToggleOn ? "ON" : "OFF"}
            </button>
        );
    }
}

// 函数组件中的事件处理
function Toggle() {
    const [isToggleOn, setIsToggleOn] = useState(true);

    return (
        <button onClick={() => setIsToggleOn(!isToggleOn)}>
            {isToggleOn ? "ON" : "OFF"}
        </button>
    );
}
```

### 传递参数给事件处理函数

```jsx
// 箭头函数方式
<button onClick={(e) => handleClick(id, e)}>Delete</button>

// bind 方式
<button onClick={handleClick.bind(null, id)}>Delete</button>

function handleClick(id, e) {
    console.log(id, e);
}
```

---

## 条件渲染

React 中的条件渲染与 JavaScript 条件语句类似。

```jsx
// 方式一：if 语句
function Greeting(props) {
    if (props.isLoggedIn) {
        return <UserGreeting />;
    }
    return <GuestGreeting />;
}

// 方式二：三元运算符
function LoginControl(props) {
    const isLoggedIn = props.isLoggedIn;
    return (
        <div>
            {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
        </div>
    );
}

// 方式三：逻辑运算符 &&
function Mailbox(props) {
    const unreadMessages = props.unreadMessages;
    return (
        <div>
            <h1>Hello!</h1>
            {unreadMessages.length > 0 && (
                <h2>You have {unreadMessages.length} unread messages.</h2>
            )}
        </div>
    );
}

// 方式四：阻止组件渲染
function WarningBanner(props) {
    if (!props.warn) {
        return null;
    }
    return <div className="warning">Warning!</div>;
}
```

---

## 列表渲染与 Key

渲染列表时，需要为每个列表项提供唯一的 key 属性。

```jsx
function NumberList(props) {
    const numbers = props.numbers;
    const listItems = numbers.map((number) => (
        <li key={number.toString()}>{number}</li>
    ));
    return <ul>{listItems}</ul>;
}

// 使用索引作为 key（不推荐）
numbers.map((number, index) => (
    <li key={index}>{number}</li>
));
```

### 面试高频问题

### Q1：为什么列表渲染需要 key？

**答**：

1. **帮助 React 识别哪些元素改变了**：key 帮助 React 高效地复用和更新已有 DOM 节点
2. **提高渲染性能**：没有 key 时，React 只能通过位置来判断元素是否改变
3. **避免 bug**：没有 key 时，列表项的位置交换可能导致状态错乱

```jsx
// 没有 key，位置交换会导致状态错乱
// [A, B] -> [B, A]，React 会认为 A 变成 B，B 变成 A

// 有 key，React 能正确识别
// [A, B] -> [B, A]，React 知道 A 移到后面，B 移到前面
```

### Q2：key 为什么不推荐使用索引？

**答**：

1. **列表顺序变化时会出现 bug**：如果列表项的顺序发生变化，使用索引作为 key 会导致错误的更新
2. **性能问题**：索引作为 key 无法帮助 React 优化渲染
3. **状态问题**：可能导致组件状态混乱

```jsx
// 不推荐
{numbers.map((number, index) => (
    <li key={index}>{number}</li>
))}

// 推荐 - 使用唯一 ID
{numbers.map((number) => (
    <li key={number.id}>{number.text}</li>
))}
```

---

## Hooks

React Hooks 是 React 16.8 引入的新特性，允许在函数组件中使用 state 和生命周期。

### useState

```jsx
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}
```

### useEffect

```jsx
import { useState, useEffect } from "react";

function UserStatus(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser(props.userId)
            .then((response) => setUser(response.data))
            .catch((error) => console.error(error));

        return () => {
            // 清理操作
        };
    }, [props.userId]);

    if (!user) return <div>Loading...</div>;
    return <div>User: {user.name}</div>;
}
```

### useContext

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext("light");

function App() {
    const [theme, setTheme] = useState("light");

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <Toolbar />
        </ThemeContext.Provider>
    );
}

function Toolbar() {
    const { theme, setTheme } = useContext(ThemeContext);
    return (
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            Current Theme: {theme}
        </button>
    );
}
```

### useReducer

```jsx
import { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return { count: state.count + 1 };
        case "decrement":
            return { count: state.count - 1 };
        case "reset":
            return { count: 0 };
        default:
            return state;
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: "increment" })}>+</button>
            <button onClick={() => dispatch({ type: "decrement" })}>-</button>
            <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
        </div>
    );
}
```

### useRef

```jsx
import { useState, useRef, useEffect } from "react";

function Timer() {
    const [count, setCount] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCount((c) => c + 1);
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div>
            <p>Timer: {count}</p>
            <button onClick={() => clearInterval(intervalRef.current)}>
                Stop
            </button>
        </div>
    );
}

// useRef 保存 DOM 引用
function TextInput() {
    const inputRef = useRef(null);

    const focusInput = () => {
        inputRef.current.focus();
    };

    return (
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={focusInput}>Focus</button>
        </div>
    );
}
```

### useMemo 和 useCallback

```jsx
import { useState, useMemo, useCallback } from "react";

function ExpensiveCalculation({ numbers }) {
    // useMemo 缓存计算结果
    const computedValue = useMemo(() => {
        console.log("Calculating...");
        return numbers.reduce((acc, n) => acc + n, 0);
    }, [numbers]);

    return <div>Result: {computedValue}</div>;
}

function CallbackExample() {
    const [count, setCount] = useState(0);

    // useCallback 缓存函数引用
    const handleClick = useCallback(() => {
        console.log("Clicked");
    }, []);

    return (
        <div>
            <p>Count: {count}</p>
            <ChildComponent onClick={handleClick} />
        </div>
    );
}
```

### 自定义 Hooks

```jsx
// 自定义 Hook：useLocalStorage
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

// 使用自定义 Hook
function App() {
    const [name, setName] = useLocalStorage("name", "");
    return (
        <div>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
            />
            <p>Hello, {name}</p>
        </div>
    );
}
```

---

## 组件通信

React 组件之间有多种通信方式。

### 父子组件通信

```jsx
// 父组件向子组件传递数据（Props）
function Parent() {
    const message = "Hello from parent";
    return <Child message={message} />;
}

function Child({ message }) {
    return <div>{message}</div>;
}

// 子组件向父组件传递数据（回调函数）
function Parent() {
    const handleChildData = (data) => {
        console.log("Received from child:", data);
    };
    return <Child onData={handleChildData} />;
}

function Child({ onData }) {
    const sendData = () => {
        onData("Data from child");
    };
    return <button onClick={sendData}>Send to Parent</button>;
}
```

### 跨级组件通信（Context）

```jsx
const ThemeContext = createContext();

function App() {
    return (
        <ThemeContext.Provider value="dark">
            <Toolbar />
        </ThemeContext.Provider>
    );
}

function Toolbar() {
    const theme = useContext(ThemeContext);
    return <div>Theme: {theme}</div>;
}
```

### 兄弟组件通信

```jsx
// 通过父组件中转
function Parent() {
    const [sharedData, setSharedData] = useState("");

    return (
        <div>
            <ChildA onData={setSharedData} />
            <ChildB data={sharedData} />
        </div>
    );
}
```

### 状态管理库（Redux/Zustand）

```jsx
// 使用 Zustand
import { create } from "zustand";

const useStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {
    const { count, increment, decrement } = useStore();
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
        </div>
    );
}
```

---

## 组件类型

### 受控组件与非受控组件

```jsx
// 受控组件 - 表单数据由 React 控制
function ControlledInput() {
    const [value, setValue] = useState("");

    return (
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

// 非受控组件 - 表单数据由 DOM 本身控制
function UncontrolledInput() {
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Value:", inputRef.current.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input ref={inputRef} type="text" />
            <button type="submit">Submit</button>
        </form>
    );
}
```

### 高阶组件（HOC）

```jsx
// 高阶组件示例
function withAuthentication(WrappedComponent) {
    return function AuthenticatedComponent(props) {
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        if (!isAuthenticated) {
            return <div>Please login.</div>;
        }

        return <WrappedComponent {...props} />;
    };
}

// 使用
const AuthenticatedDashboard = withAuthentication(Dashboard);
```

### Render Props

```jsx
// Render Props 模式
function MouseTracker({ render }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };

    return <div onMouseMove={handleMouseMove}>{render(position)}</div>;
}

// 使用
function App() {
    return (
        <MouseTracker
            render={({ x, y }) => (
                <div>
                    Mouse position: ({x}, {y})
                </div>
            )}
        />
    );
}
```

---

## 性能优化

### React.memo

```jsx
import { memo } from "react";

const MyComponent = memo(function MyComponent(props) {
    return <div>{props.name}</div>;
});
```

### useMemo 和 useCallback

```jsx
function Parent() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState("");

    // 只有 count 变化时才创建新对象
    const data = useMemo(() => ({
        count,
        type: "example"
    }), [count]);

    // 只有 count 变化时才创建新函数
    const handleClick = useCallback(() => {
        console.log(count);
    }, [count]);

    return (
        <div>
            <Child onClick={handleClick} data={data} />
            <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
    );
}
```

### 避免不必要的渲染

```jsx
// 1. 合理拆分组件
function List({ items, onClick }) {
    return items.map((item) => (
        <ListItem key={item.id} item={item} onClick={onClick} />
    ));
}

// 2. 列表渲染使用唯一 key
// 3. 组件职责单一，减少渲染范围
```

---

## 错误边界

错误边界是 React 组件，用于捕获子组件树中的 JavaScript 错误。

```jsx
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}

// 使用
function App() {
    return (
        <ErrorBoundary>
            <MyWidget />
        </ErrorBoundary>
    );
}
```
