# React 高频面试题 50 道

## 基础概念

### Q1：React 是什么？有什么核心特点？

React 是 Facebook 开发的用于构建用户界面的 JavaScript 库，其核心特点包括：

1. **虚拟 DOM**：React 在内存中维护一个虚拟 DOM 树，通过对比算法最小化真实 DOM 操作
2. **组件化**：一切皆组件，组件可复用、可组合、可维护
3. **单向数据流**：数据自顶向下流动，组件是纯粹的"函数"
4. **声明式编程**：描述"应该是什么"，而非"如何做"
5. **JSX 语法**：在 JavaScript 中编写类似 HTML 的语法
6. **Hooks**：React 16.8 引入的函数组件增强特性

### Q2：虚拟 DOM 是什么？工作原理是什么？

**虚拟 DOM（Virtual DOM）** 是真实 DOM 的 JavaScript 对象表示，是一个轻量级的 DOM 抽象层。

**工作原理**：

```
┌─────────────────────────────────────────────────────────────────┐
│                    虚拟 DOM 工作流程                             │
├─────────────────────────────────────────────────────────────────┤
│  1. 状态变化 → 创建新的虚拟 DOM 树                              │
│  2. Diff 算法 → 对比新旧虚拟 DOM                               │
│  3. Patch 更新 → 只更新变化的真实 DOM                          │
└─────────────────────────────────────────────────────────────────┘
```

**Diff 算法策略**：

1. **同级比较**：只会比较同一层级的节点，不会跨层级比较
2. **Key 标记**：通过 key 识别节点身份，优化列表渲染
3. **类型比较**：如果节点类型改变，直接替换整个子树

### Q3：JSX 是什么？为什么需要 JSX？

JSX（JavaScript XML）是 React 引入的一种语法扩展，允许在 JavaScript 中编写类似 HTML 的标记语法。

**为什么需要 JSX**：

1. **声明式 UI**：直观地描述 UI 应该是什么样子
2. **类型安全**：编译时检查错误
3. **开发体验**：熟悉的 HTML 语法降低学习成本
4. **与 JavaScript 集成**：可以在 JSX 中使用 JS 表达式

**JSX 语法规则**：

```jsx
// 1. 标签必须闭合
const element = <input type="text" />;

// 2. className 代替 class
const element = <div className="container">Content</div>;

// 3. JSX 表达式使用大括号
const name = 'World';
const element = <h1>Hello, {name}!</h1>;

// 4. 条件渲染
const element = isLoggedIn ? <UserProfile /> : <LoginForm />;

// 5. 列表渲染
const list = items.map(item => (
    <li key={item.id}>{item.name}</li>
));
```

### Q4：React 组件有哪几种？区别是什么？

React 组件主要分为类组件和函数组件两种类型。

**函数组件**：

```jsx
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

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

**类组件**：

```jsx
class Welcome extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: null };
    }

    componentDidMount() {
        this.fetchUser(this.props.userId);
    }

    render() {
        const { user } = this.state;
        if (!user) return <div>Loading...</div>;
        return <div>User: {user.name}</div>;
    }
}
```

**两者区别**：

| 特性           | 函数组件                    | 类组件                          |
| -------------- | --------------------------- | ------------------------------- |
| 语法           | ES6 函数                    | 继承 React.Component            |
| 状态管理       | useState Hook               | this.state 和 setState          |
| 生命周期       | useEffect Hook              | componentDidMount 等方法        |
| this 指向      | 无需处理                    | 需要 bind 或使用箭头函数         |
| 逻辑复用       | 自定义 Hooks                | HOC、Render Props               |
| 推荐程度       | ✅ 官方推荐                  | ⚠️ 逐步迁移中                   |

### Q5：Props 和 State 的区别是什么？

**Props（属性）**：

```jsx
function Welcome({ name, age }) {
    return (
        <div>
            <h1>Name: {name}</h1>
            <p>Age: {age}</p>
        </div>
    );
}

<Welcome name="Alice" age={25} />
```

**State（状态）**：

```jsx
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

**核心区别**：

| 特性         | Props                          | State                           |
| ------------ | ------------------------------ | ------------------------------- |
| 用途         | 组件间传递数据                | 组件内部管理数据               |
| 修改权限     | 父组件可修改，组件自身不可修改 | 组件自身可修改                 |
| 变化影响     | 变化时触发子组件重新渲染      | 变化时触发组件自身重新渲染     |

### Q6：React 的数据流是单向的吗？为什么？

是的，React 的数据流是单向的，这是 React 设计的核心原则之一。

```
Parent Component ──props──> Child Component ──callback──> Parent Component
       ▲                                                            │
       │                                                            │
       └────────────────── State Changes ───────────────────────────┘
```

**代码示例**：

```jsx
function App() {
    const [userName, setUserName] = useState('Alice');

    return (
        <div>
            <h1>App: {userName}</h1>
            <UserProfile name={userName} />
            <NameEditor onNameChange={setUserName} />
        </div>
    );
}

function UserProfile({ name }) {
    return <div>User: {name}</div>;
}

function NameEditor({ onNameChange }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        onNameChange(inputValue);
    };

    return (
        <div>
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button onClick={handleSubmit}>Update</button>
        </div>
    );
}
```

### Q7：React 的生命周期有哪些？

**类组件生命周期**：

| 阶段         | 方法                              | 说明                    |
| ------------ | --------------------------------- | ---------------------- |
| 挂载        | constructor()                     | 组件初始化             |
| 挂载        | componentDidMount()               | DOM 已挂载             |
| 更新        | componentDidUpdate()              | DOM 已更新             |
| 卸载        | componentWillUnmount()            | 组件即将卸载           |

**函数组件生命周期（Hooks）**：

```jsx
function LifecycleDemo() {
    useEffect(() => {
        console.log('相当于 componentDidMount');
        return () => {
            console.log('相当于 componentWillUnmount');
        };
    }, []);

    useEffect(() => {
        console.log('相当于 componentDidUpdate');
    });

    return <div>Lifecycle Demo</div>;
}
```

### Q8：React 中的 key 是什么？为什么重要？

Key 是 React 用于识别虚拟 DOM 节点的特殊 prop，在列表渲染中尤为重要。

```jsx
// ✅ 正确：使用稳定唯一 ID 作为 key
function UserList({ users }) {
    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}

// ❌ 错误：使用随机值作为 key
function BadList({ items }) {
    return (
        <ul>
            {items.map(item => (
                <li key={Math.random()}>{item.name}</li>
            ))}
        </ul>
    );
}
```

### Q9：React 中的事件处理机制是什么？

React 实现了合成事件（SyntheticEvent）系统，提供了跨浏览器兼容的事件处理机制。

```jsx
function EventHandler() {
    const handleClick = (event) => {
        console.log('Click event:', event);
        console.log('Target:', event.target);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted');
    };

    return (
        <div>
            <button onClick={handleClick}>Click Me</button>
            <form onSubmit={handleSubmit}>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
```

**事件冒泡与阻止**：

```jsx
function EventBubbling() {
    const handleDivClick = () => console.log('Div clicked');
    const handleButtonClick = (e) => {
        e.stopPropagation();
        console.log('Button clicked');
    };

    return (
        <div onClick={handleDivClick}>
            <button onClick={handleButtonClick}>Click me</button>
        </div>
    );
}
```

### Q10：React 中的条件渲染是什么？

条件渲染允许根据应用状态有条件地显示不同的 UI 元素。

```jsx
// 1. 三元运算符
function TernaryRender({ isLoggedIn }) {
    return <div>{isLoggedIn ? <UserDashboard /> : <LoginForm />}</div>;
}

// 2. && 运算符
function AndOperator({ count }) {
    return <div>{count > 0 && <p>Count: {count}</p>}</div>;
}

// 3. if 语句（早期 return）
function IfStatement({ user }) {
    if (!user) return <div>Please log in</div>;
    return <div>Welcome, {user.name}</div>;
}

// 4. 枚举模式
function EnumRender({ status }) {
    const statusConfig = {
        loading: <Spinner />,
        success: <SuccessMessage />,
        error: <ErrorMessage />
    };
    return <div>{statusConfig[status] || <DefaultView />}</div>;
}
```

## Hooks

### Q11：React Hooks 是什么？为什么需要 Hooks？

Hooks 是 React 16.8 引入的新特性，允许在函数组件中使用 state 和其他 React 特性。

**为什么需要 Hooks**：

| 问题（类组件）                              | Hooks 解决方案                       |
| ------------------------------------------- | ------------------------------------ |
| 逻辑复用困难（HOC/Render Props 复杂度高）   | 自定义 Hooks 共享逻辑                |
| 组件嵌套过深（Wrapper Hell）                | 扁平化组件结构                        |
| 类组件学习成本高                            | 函数组件更直观                        |

**基本 Hooks 使用**：

```jsx
// useState - 状态管理
function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// useEffect - 副作用处理
function UserData({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`/api/users/${userId}`).then(res => res.json()).then(setUser);
    }, [userId]);

    return <div>{user?.name}</div>;
}

// useContext - 跨组件通信
const ThemeContext = React.createContext('light');
```

### Q12：useState 的正确使用方式是什么？

**基本用法**：

```jsx
function Counter() {
    const [count, setCount] = useState(0);
    return <div><p>{count}</p><button onClick={() => setCount(count + 1)}>Increment</button></div>;
}
```

**函数式更新**：

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    const goodIncrement = () => {
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        setCount(prev => prev + 1); // 最终加 3
    };

    return <button onClick={goodIncrement}>+3</button>;
}
```

**对象状态更新**：

```jsx
function UserProfile() {
    const [user, setUser] = useState({ name: 'Alice', age: 25 });

    const updateAge = () => {
        setUser(prev => ({ ...prev, age: prev.age + 1 }));
    };

    return <div><p>{user.name} - {user.age}</p><button onClick={updateAge}>Update Age</button></div>;
}
```

### Q13：useEffect 的正确使用方式是什么？

```jsx
// 1. 每次渲染后执行（无依赖）
useEffect(() => {
    console.log('Every render');
});

// 2. 只在首次挂载时执行（空依赖）
useEffect(() => {
    console.log('Component mounted');
    return () => {
        console.log('Component will unmount');
    };
}, []);

// 3. 依赖项变化时执行
useEffect(() => {
    fetchUser(userId);
}, [userId]);
```

**常见使用场景**：

```jsx
// 数据获取
function DataFetching({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function fetchData() {
            const response = await fetch(`/api/users/${userId}`);
            const data = await response.json();
            if (!cancelled) setUser(data);
        }
        fetchData();
        return () => { cancelled = true; };
    }, [userId]);

    return <div>{user?.name}</div>;
}

// 事件订阅
function WindowListener() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <div>Window width: {width}</div>;
}
```

### Q14：useContext 的使用场景和原理是什么？

**基本用法**：

```jsx
const ThemeContext = React.createContext('light');

function App() {
    return (
        <ThemeContext.Provider value={{ theme: 'dark' }}>
            <Header />
        </ThemeContext.Provider>
    );
}

function Header() {
    const { theme } = useContext(ThemeContext);
    return <div style={{ background: theme }}>Header</div>;
}
```

**主题管理示例**：

```jsx
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
```

### Q15：useReducer 的使用场景是什么？

**基本用法**：

```jsx
function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT': return { ...state, count: state.count + 1 };
        case 'DECREMENT': return { ...state, count: state.count - 1 };
        case 'RESET': return { ...state, count: 0 };
        default: return state;
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
            <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
        </div>
    );
}
```

**待办事项列表示例**：

```jsx
const initialState = { todos: [], filter: 'all' };

function todoReducer(state, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }]
            };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
                )
            };
        default: return state;
    }
}
```

### Q16：useRef 的使用场景是什么？

**基本用法**：

```jsx
// 1. 访问 DOM 元素
function TextInput() {
    const inputRef = useRef(null);
    const focusInput = () => inputRef.current.focus();

    return (
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={focusInput}>Focus</button>
        </div>
    );
}

// 2. 存储不需要触发渲染的值
function Timer() {
    const [count, setCount] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => setCount(prev => prev + 1), 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    return <div>Count: {count}</div>;
}

// 3. 保存上一个值
function PreviousValue() {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef();

    useEffect(() => { prevCountRef.current = count; });

    return (
        <div>
            <p>Current: {count}</p>
            <p>Previous: {prevCountRef.current}</p>
        </div>
    );
}
```

### Q17：useMemo 和 useCallback 的区别和使用场景是什么？

**useMemo - 缓存计算结果**：

```jsx
function ExpensiveComponent({ a, b }) {
    const result = useMemo(() => {
        console.log('Computing...');
        return expensiveCalculation(a, b);
    }, [a, b]);

    return <div>Result: {result}</div>;
}
```

**useCallback - 缓存函数引用**：

```jsx
function Button({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>;
}

function Parent() {
    const [count, setCount] = useState(0);

    const handleClick = useCallback(() => console.log('Clicked'), []);
    const increment = useCallback(() => setCount(prev => prev + 1), []);

    return (
        <div>
            <Button onClick={handleClick}>Click</Button>
            <Button onClick={increment}>Increment</Button>
        </div>
    );
}
```

**区别**：

| API            | 作用                   | 缓存内容           |
| -------------- | ---------------------- | ------------------ |
| React.memo     | 高阶组件，缓存整个组件 | 组件的渲染结果    |
| useMemo        | Hook，缓存计算结果     | 任意值             |
| useCallback    | Hook，缓存函数引用     | 函数               |

### Q18：自定义 Hook 是什么？如何创建？

自定义 Hook 是以 `use` 开头的函数，用于封装和复用有状态逻辑。

**常见自定义 Hook**：

```jsx
// 1. useLocalStorage
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch { return initialValue; }
    });

    const setValue = (value) => {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    };

    return [storedValue, setValue];
}

// 2. useDebounce
function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

// 3. useFetch
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => { setData(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [url]);

    return { data, loading, error };
}

// 4. useToggle
function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(() => setValue(v => !v), []);
    const setTrue = useCallback(() => setValue(true), []);
    const setFalse = useCallback(() => setValue(false), []);
    return { value, toggle, setTrue, setFalse };
}
```

## 性能优化

### Q19：React 性能优化的方法有哪些？

**减少不必要渲染**：

```jsx
// 1. React.memo - 缓存组件
const MemoizedComponent = React.memo(function MyComponent({ data }) {
    return <div>{data.name}</div>;
});

// 2. useMemo - 缓存计算结果
function ExpensiveList({ items, filter }) {
    const filteredItems = useMemo(() => {
        return items.filter(item => item.name.includes(filter));
    }, [items, filter]);
    return filteredItems.map(item => <Item key={item.id} item={item} />);
}

// 3. useCallback - 缓存回调函数
function Parent() {
    const [count, setCount] = useState(0);
    const handleClick = useCallback(() => {}, []);
    return <><MemoizedChild onClick={handleClick} /><button onClick={() => setCount(c => c + 1)}>{count}</button></>;
}
```

**代码分割**：

```jsx
import { Suspense, lazy } from 'react';
const OtherComponent = lazy(() => import('./OtherComponent'));

function MyComponent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtherComponent />
        </Suspense>
    );
}
```

### Q20：React.memo、useMemo、useCallback 的区别是什么？

| API            | 作用                   | 缓存内容           | 使用场景                    |
| -------------- | ---------------------- | ------------------ | --------------------------- |
| React.memo     | 高阶组件，缓存整个组件 | 组件的渲染结果    | 防止父组件更新导致子组件不必要渲染 |
| useMemo        | Hook，缓存计算结果     | 任意值（计算结果） | 昂贵计算、对象/数组引用稳定  |
| useCallback    | Hook，缓存函数引用     | 函数               | 回调函数传递给子组件        |

## 组件通信

### Q21：React 组件间有哪些通信方式？

**父子组件通信**：

```jsx
// 父 → 子（Props）
function Parent() {
    return <Child message="Hello" />;
}

// 子 → 父（回调函数）
function Parent() {
    const [value, setValue] = useState('');
    return <Child onChange={(v) => setValue(v)} />;
}
```

**跨层级通信（Context）**：

```jsx
const UserContext = React.createContext();

function App() {
    return (
        <UserContext.Provider value={{ user: { name: 'Alice' } }}>
            <GrandParent />
        </UserContext.Provider>
    );
}

function Child() {
    const { user } = useContext(UserContext);
    return <p>{user.name}</p>;
}
```

**状态管理库（Zustand）**：

```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
}));

function Counter() {
    const { count, increment } = useStore();
    return <button onClick={increment}>{count}</button>;
}
```

## 状态管理

### Q22：Redux 的工作原理是什么？

Redux 是一个可预测的状态管理库，采用单向数据流和不可变更新模式。

```
UI ──dispatch──> Action ──reduce──> Store ──subscribe──> UI
                        ▲                              │
                        └──────────────────────────────┘
```

**基本使用**：

```jsx
import { createStore } from 'redux';

const INCREMENT = 'counter/increment';

function counterReducer(state = { count: 0 }, action) {
    switch (action.type) {
        case INCREMENT: return { ...state, count: state.count + 1 };
        default: return state;
    }
}

const store = createStore(counterReducer);
store.dispatch({ type: INCREMENT });
console.log(store.getState());
```

**React-Redux**：

```jsx
import { Provider, useSelector, useDispatch } from 'react-redux';

function App() {
    return (
        <Provider store={store}>
            <Counter />
        </Provider>
    );
}

function Counter() {
    const count = useSelector(state => state.count);
    const dispatch = useDispatch();
    return <button onClick={() => dispatch({ type: 'INCREMENT' })}>{count}</button>;
}
```

### Q23：Zustand 和 Redux 的区别是什么？

| 特性           | Redux                          | Zustand                        |
| -------------- | ------------------------------ | ------------------------------- |
| API 复杂度     | 较复杂                         | 极简（create 函数）            |
| 模板代码       | 较多                           | 很少                           |
| 不可变性       | 必须保持不可变                 | 可直接修改                     |
| 学习曲线       | 较陡峭                         | 平缓                           |
| 适用场景       | 大型复杂应用                   | 中小型应用                     |

**Zustand 示例**：

```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
}));

// 无需 Provider！
function Counter() {
    const { count, increment } = useStore();
    return <button onClick={increment}>{count}</button>;
}
```

## 路由

### Q24：React Router 的工作原理是什么？

**基本使用**：

```jsx
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/users/:id" element={<User />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

function User() {
    const params = useParams();
    return <div>User ID: {params.id}</div>;
}

function Home() {
    const navigate = useNavigate();
    return <button onClick={() => navigate('/about')}>Go to About</button>;
}
```

## 渲染控制

### Q25：React 的渲染流程是什么？

```
┌─────────────────────────────────────────────────────────────────┐
│  1. 触发渲染（State/Props/Context 变化）                        │
│  2. Render 阶段（生成虚拟 DOM，Diff 比较）                      │
│  3. Commit 阶段（更新 DOM，执行副作用）                        │
└─────────────────────────────────────────────────────────────────┘
```

### Q26：React 的 Diff 算法是什么？

Diff 算法通过三个核心假设将复杂度从 O(n³) 降低到 O(n)：

1. **不同类型的元素产生不同的树**
2. **同级别元素使用 key 标记**
3. **同级比较**

```jsx
// 不同类型 - 完全替换
<div><Counter /></div> → <span><Counter /></span>

// 同类型 - 保留 DOM，只更新属性
<div className="before" /> → <div className="after" />

// 列表 - 使用 key 识别
<li key="a">A</li> <li key="b">B</li> → <li key="b">B</li> <li key="a">A</li>
```

### Q27：React 的批处理是什么？

批处理是将多个状态更新合并为一次渲染的优化机制。

```jsx
// React 18+ 所有更新自动批处理
function Batching() {
    const [count, setCount] = useState(0);
    const [user, setUser] = useState(null);

    const handleClick = async () => {
        setCount(1);      // 入队
        setUser({ name: 'Alice' }); // 入队，仍然批处理！
    };

    return <button onClick={handleClick}>{count}</button>;
}
```

## 高级特性

### Q28：React Portal 是什么？

Portal 允许将子组件渲染到父组件 DOM 树之外的 DOM 节点。

```jsx
import { createPortal } from 'react-dom';

function Modal({ children, isOpen }) {
    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-content">{children}</div>
        </div>,
        document.body
    );
}
```

**使用场景**：模态框、工具提示、下拉菜单、浮动通知

### Q29：React Error Boundary 是什么？

Error Boundary 是用于捕获子组件树中 JavaScript 错误的组件。

```jsx
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || <div>Something went wrong</div>;
        }
        return this.props.children;
    }
}
```

### Q30：React Suspense 是什么？

Suspense 用于在组件等待时显示加载状态。

```jsx
import { Suspense, lazy } from 'react';

const OtherComponent = lazy(() => import('./OtherComponent'));

function MyComponent() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtherComponent />
        </Suspense>
    );
}
```

## TypeScript

### Q31：React 中如何正确使用 TypeScript？

**Props 类型定义**：

```tsx
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

function Button({ children, onClick, variant = 'primary', disabled }: ButtonProps) {
    return <button className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>{children}</button>;
}
```

**State 类型定义**：

```tsx
// 基础 state
function Counter() {
    const [count, setCount] = useState<number>(0);
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// 对象 state
interface UserState { name: string; email: string; }
function UserForm() {
    const [user, setUser] = useState<UserState>({ name: '', email: '' });
    return <form>{/* ... */}</form>;
}

// union 类型
type Status = 'idle' | 'loading' | 'success' | 'error';
```

**事件处理类型**：

```tsx
function EventHandlers() {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e.currentTarget);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    };
    return <div><input onChange={handleChange} /><button onClick={handleClick}>Click</button></div>;
}
```

## 工程化

### Q32：如何搭建一个 React 项目？

**使用 Vite（推荐）**：

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
npm run build
```

**项目结构**：

```
my-app/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── store/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
└── vite.config.ts
```

## 生态工具

### Q33：React 与 Vue 的区别是什么？

| 特性           | React                              | Vue                                |
| -------------- | ---------------------------------- | ---------------------------------- |
| 设计理念       | 灵活的 UI 库                       | 渐进式框架                         |
| 模板语法       | JSX                                | 单文件组件（HTML 模板）           |
| 状态管理       | Context、Redux、Zustand            | Vuex、Pinia                        |
| 学习曲线       | JSX 需要适应                       | 模板更直观                         |

### Q34：React 与 Angular 的区别是什么？

| 特性           | React                              | Angular                            |
| -------------- | ---------------------------------- | ---------------------------------- |
| 类型           | UI 库                              | 完整框架                           |
| 体积           | 小（~40KB）                        | 大（~500kb）                       |
| 学习曲线       | 平缓                               | 陡峭                              |
| 模板           | JSX                                | HTML 扩展                         |

## 实际应用

### Q35：如何实现一个表单组件？

```tsx
interface FormState { username: string; email: string; password: string; }
interface FormErrors { username?: string; email?: string; password?: string; }

function RegistrationForm() {
    const [form, setForm] = useState<FormState>({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.username.trim()) newErrors.username = 'Username is required';
        if (!form.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
        if (!form.password) newErrors.password = 'Password is required';
        else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) console.log('Form submitted:', form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            {errors.username && <span>{errors.username}</span>}
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <span>{errors.email}</span>}
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {errors.password && <span>{errors.password}</span>}
            <button type="submit">Register</button>
        </form>
    );
}
```

### Q36：如何实现一个搜索自动补全组件？

```tsx
interface Suggestion { id: string; text: string; }

function Autocomplete() {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const debouncedSearch = useMemo(() => debounce(async (query: string) => {
        if (!query.trim()) { setSuggestions([]); return; }
        const results = await searchAPI(query);
        setSuggestions(results);
    }, 300), []);

    useEffect(() => { debouncedSearch(inputValue); }, [inputValue, debouncedSearch]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') setHighlightedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
        else if (e.key === 'ArrowUp') setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        else if (e.key === 'Enter' && highlightedIndex >= 0) {
            setInputValue(suggestions[highlightedIndex].text);
            setSuggestions([]);
        } else if (e.key === 'Escape') setSuggestions([]);
    };

    return (
        <div className="autocomplete">
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} />
            {suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <li key={suggestion.id} className={index === highlightedIndex ? 'highlighted' : ''}
                            onClick={() => { setInputValue(suggestion.text); setSuggestions([]); }}>
                            {suggestion.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

### Q37：如何实现一个分页组件？

```tsx
interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => onPageChange(page)}>{page}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next</button>
        </div>
    );
}
```

### Q38：如何实现一个图片懒加载组件？

```tsx
interface LazyImageProps { src: string; alt: string; placeholder?: string; }

function LazyImage({ src, alt, placeholder = '/placeholder.png' }: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); }
        }, { rootMargin: '50px' });

        if (imgRef.current) observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className="lazy-image-container">
            {!isLoaded && <img src={placeholder} alt="loading" className="placeholder" />}
            {isInView && <img src={src} alt={alt} onLoad={() => setIsLoaded(true)} className={isLoaded ? 'loaded' : ''} />}
        </div>
    );
}
```

### Q39：如何实现一个无限滚动列表？

```tsx
function InfiniteScrollList({ fetchMore, hasMore, children, loader }: { fetchMore: () => Promise<void>; hasMore: boolean; children: React.ReactNode; loader?: React.ReactNode }) {
    const observerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(async ([entry]) => {
            if (entry.isIntersecting && hasMore) await fetchMore();
        }, { rootMargin: '100px' });

        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [fetchMore, hasMore]);

    return (
        <div className="infinite-scroll">
            {children}
            {hasMore && <div ref={observerRef} className="loading-trigger">{loader || <div>Loading more...</div>}</div>}
        </div>
    );
}
```

### Q40：如何实现一个主题切换组件？

```tsx
type Theme = 'light' | 'dark';
interface ThemeContextType { theme: Theme; toggleTheme: () => void; }

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

function ThemeToggle() {
    const { theme, toggleTheme } = useContext(ThemeContext) as ThemeContextType;
    return <button onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>;
}
```

## 原理深入

### Q41：React 的 fiber 架构是什么？

Fiber 是 React 16 引入的新协调算法，将渲染工作拆分成小单元，可以中断和恢复。

**Fiber 节点结构**：

```typescript
interface Fiber {
    type: string | null;
    key: string | null;
    child: Fiber | null;
    sibling: Fiber | null;
    return: Fiber | null;
    stateNode: any;
    memoizedState: any;
    memoizedProps: any;
    pendingProps: any;
    effectTag: number;
    alternate: Fiber | null;
}
```

**两个阶段**：

1. **Render 阶段（可中断）**：构建 Fiber 树，确定需要更新的内容
2. **Commit 阶段（不可中断）**：执行 DOM 操作，执行副作用

### Q42：React 的并发模式是什么？

并发模式是 React 18 引入的新特性，允许渲染可中断。

```jsx
// useTransition - 标记非紧急更新
function SearchResults({ query }) {
    const [isPending, startTransition] = useTransition();
    const [results, setResults] = useState([]);

    const handleChange = (e) => {
        startTransition(() => {
            const newResults = searchAPI(e.target.value);
            setResults(newResults);
        });
    };

    return (
        <div>
            <input onChange={handleChange} />
            {isPending ? <Spinner /> : <ResultsList results={results} />}
        </div>
    );
}

// useDeferredValue - 延迟值更新
function SearchInput() {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);
    return <div><input value={query} onChange={e => setQuery(e.target.value)} /><SlowList text={deferredQuery} /></div>;
}
```

### Q43：React 的 setState 是同步还是异步的？

**React 18 之前**：在合成事件和生命周期中是异步的

**React 18 之后**：所有更新自动批处理

```jsx
function Example() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(1); // 批处理
        console.log(count); // 可能是旧值
    };

    return <button onClick={handleClick}>{count}</button>;
}

// flushSync 强制同步
import { flushSync } from 'react-dom';

function SyncExample() {
    const [count, setCount] = useState(0);
    const handleClick = () => {
        flushSync(() => setCount(1));
        console.log(count); // 1
    };
    return <button onClick={handleClick}>{count}</button>;
}
```

### Q44：useLayoutEffect 和 useEffect 区别是什么？

| 特性           | useEffect                        | useLayoutEffect                   |
| -------------- | -------------------------------- | --------------------------------- |
| 执行时机       | 渲染后异步执行                   | 渲染后同步执行                   |
| 是否阻塞渲染   | 不阻塞                           | 阻塞渲染                         |
| SSR 支持       | 支持                            | 不支持                           |

```tsx
// useLayoutEffect - 用于 DOM 测量和同步操作
function MeasureComponent() {
    const [width, setWidth] = useState(0);
    const divRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (divRef.current) setWidth(divRef.current.offsetWidth);
    }, []);

    return <div ref={divRef}>{width}px</div>;
}
```

## 样式方案

### Q45：React 中的样式方案有哪些？

**1. CSS Modules**：

```css
/* Button.module.css */
.button { background: blue; color: white; }
.primary { background: blue; }
.secondary { background: gray; }
```

```tsx
import styles from './Button.module.css';
function Button({ variant = 'primary', children }) {
    return <button className={`${styles.button} ${styles[variant]}`}>{children}</button>;
}
```

**2. Styled Components**：

```tsx
import styled from 'styled-components';

const Button = styled.button`
    background: ${props => props.$primary ? 'blue' : 'gray'};
    color: white;
    padding: 8px 16px;
`;

function App() {
    return <div><Button $primary>Primary</Button><Button>Secondary</Button></div>;
}
```

**3. Tailwind CSS**：

```tsx
function Button({ children }) {
    return <button className="bg-blue-500 text-white px-4 py-2 rounded">{children}</button>;
}
```

## 测试

### Q46：如何测试 React 组件？

**安装**：

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

**基本测试**：

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Counter', () => {
    it('renders initial count', () => {
        render(<Counter initialCount={5} />);
        expect(screen.getByText('Count: 5')).toBeInTheDocument();
    });

    it('increments count when button is clicked', async () => {
        const user = userEvent.setup();
        render(<Counter />);
        await user.click(screen.getByRole('button', { name: 'Increment' }));
        expect(screen.getByText('Count: 1')).toBeInTheDocument();
    });
});
```

## 新特性

### Q47：React 18 有哪些新特性？

1. **自动批处理扩展**：所有更新（包括异步）都会批处理
2. **并发渲染**：渲染可中断，更好地支持复杂交互
3. **useTransition**：标记非紧急更新
4. **useDeferredValue**：延迟值更新
5. **Suspense 支持 SSR**：流式 SSR

```jsx
// Concurrent Features
const [isPending, startTransition] = useTransition();
const deferredValue = useDeferredValue(value);
```

### Q48：React 19 有哪些新特性？

1. **Actions**：表单 actions 和 pending 状态自动管理
2. **use() Hook**：可以在 Hook 中读取 Promise 和 Context
3. **Refs 作为 props**：可以直接传递 refs 作为 props
4. **更好的错误处理**：错误信息更清晰
5. **Document Metadata**：支持在组件中渲染 `<title>`、`<meta>` 等

### Q49：什么是 React Server Components？

React Server Components 允许组件在服务器上渲染，减少客户端 JavaScript 体积。

```jsx
// Server Component（默认）
async function BlogPost({ id }) {
    const post = await db.posts.find(id); // 直接访问数据库
    return <article><h1>{post.title}</h1><p>{post.content}</p></article>;
}

// Client Component
'use client';
function LikeButton() {
    const [liked, setLiked] = useState(false);
    return <button onClick={() => setLiked(true)}>{liked ? '❤️' : '🤍'}</button>;
}
```

### Q50：如何优化 React 应用的性能？

**优化策略**：

1. **代码分割**：使用 React.lazy 和 Suspense
2. **虚拟化长列表**：使用 react-window 或 react-virtual
3. **减少不必要渲染**：React.memo、useMemo、useCallback
4. **避免匿名函数和对象**：使用 useCallback 和 useMemo
5. **延迟加载非关键资源**：图片懒加载、路由懒加载
6. **使用生产构建**：确保使用 minified 生产版本
7. **分析性能**：使用 React DevTools Profiler

```jsx
// 代码分割
const OtherComponent = lazy(() => import('./OtherComponent'));

// 虚拟列表
import { FixedSizeList } from 'react-window';
function VirtualList({ items }) {
    return (
        <FixedSizeList height={400} itemCount={items.length} itemSize={50} width="100%">
            {({ index, style }) => <div style={style}>{items[index].name}</div>}
        </FixedSizeList>
    );
}
```
