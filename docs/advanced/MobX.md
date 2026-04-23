# MobX 面试指南

## 一、核心概念

### 1.1 什么是 MobX？

MobX 是一个功能强大、性能卓越的状态管理库，它通过透明的函数式响应式编程（Transparent Functional Reactive Programming，TFRP）来实现状态管理。

**核心特性：**
- 响应式：状态变化自动触发更新
- 透明：开发者不需要关心响应式实现细节
- 高性能：细粒度更新，只更新变化的部分
- 低耦合：状态与UI完全分离

### 1.2 核心原则

MobX 遵循三大核心原则：

```
1. 单一数据源（Single Source of Truth）
   - 所有应用状态存储在一个可观察的对象中

2. 响应式（Reactivity）
   - 当状态变化时，所有依赖项自动更新

3. 分离关注点（Separation of Concerns）
   - 状态、业务逻辑、UI 完全分离
```

### 1.3 对比 Vue 和 React

| 特性 | MobX | Vue | React |
|------|------|-----|-------|
| 数据绑定 | 响应式 | 响应式 | 手动/状态管理 |
| 学习曲线 | 中等 | 低 | 高 |
| 代码风格 | 面向对象 | 声明式 | 函数式 |
| 性能 | 优秀 | 优秀 | 需要优化 |
| 调试 | 困难 | 容易 | 容易 |
| 社区生态 | 一般 | 丰富 | 丰富 |

---

## 二、核心 API

### 2.1 observable

`observable` 用于将数据标记为可观察的：

```typescript
import { observable } from 'mobx';

// 基本用法
class Store {
    @observable name: string = '张三';
    @observable age: number = 25;
    @observable isLoading: boolean = false;
    @observable hobbies: string[] = ['看书', '编程'];
    @observable profile: { title: string; company: string } = { title: '工程师', company: '某公司' };
}

const store = new Store();

// 数组
@observable todos: Todo[] = [];

// Map
@observable userMap: Map<string, User> = new Map();

// 配置方式
const store = observable({
    name: '张三',
    age: 25
});

// 使用 observable.map
const map = observable.map({ key: 'value' });
map.set('newKey', 'newValue');

// 使用 observable.array
const arr = observable.array([1, 2, 3]);
arr.push(4);
```

### 2.2 computed

`computed` 用于创建计算属性，其值基于响应式状态自动计算：

```typescript
import { observable, computed } from 'mobx';

class Store {
    @observable firstName: string = '张';
    @observable lastName: string = '三';
    @observable grades: number[] = [85, 90, 78, 92];

    @computed get fullName(): string {
        return this.firstName + this.lastName;
    }

    @computed get averageGrade(): number {
        return this.grades.reduce((a, b) => a + b, 0) / this.grades.length;
    }

    @computed get isExcellent(): boolean {
        return this.averageGrade >= 90;
    }
}

// getter 方式
const store = new Store();
store.firstName = '李';
console.log(store.fullName); // 自动计算： 李三
```

### 2.3 observer

`observer` 是 `react-rotx` 提供的 HOC，用于将 React 组件转换为响应式组件：

```tsx
import { observer } from 'mobx-react';
import React from 'react';
import { store } from './store';

const UserProfile = observer(() => {
    return (
        <div>
            <h1>{store.fullName}</h1>
            <p>年龄：{store.age}</p>
            <p>平均分：{store.averageGrade}</p>
            <button onClick={() => store.age++}>长大</button>
        </div>
    );
});

// 组件只在相关状态变化时重新渲染
// 不相关状态变化不会触发重新渲染
```

### 2.4 action

`action` 用于修改可观察状态：

```typescript
import { observable, action } from 'mobx';

class Store {
    @observable count: number = 0;

    @action
    increment() {
        this.count++;
    }

    @action
    decrement() {
        this.count--;
    }

    @action
    setCount(value: number) {
        this.count = value;
    }

    // 异步 action
    @action
    async fetchData() {
        this.isLoading = true;
        try {
            const data = await api.getData();
            this.data = data;
        } catch (error) {
            this.error = error;
        } finally {
            this.isLoading = false;
        }
    }
}

// 使用 runInAction 处理异步更新
import { runInAction } from 'mobx';

class Store {
    @observable data: any = null;

    async fetchData() {
        const response = await fetch('/api/data');
        const data = await response.json();

        // 在异步回调中更新状态
        runInAction(() => {
            this.data = data;
        });
    }
}
```

### 2.5 装饰器语法

MobX 支持使用装饰器语法：

```typescript
// 需要配置 tsconfig
{
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
}

// 使用装饰器
class Counter {
    @observable count: number = 0;

    @computed get doubled(): number {
        return this.count * 2;
    }

    @action.bound
    increment() {
        this.count++;
    }
}

// 非装饰器语法
const counter = types.model('Counter', {
    count: types.number,
    doubled: types.view(d => d.count * 2)
}).actions(self => ({
    increment() {
        self.count++;
    }
}));
```

---

## 三、完整实例

### 3.1 购物车 Store

```typescript
import { observable, computed, action, makeAutoObservable } from 'mobx';

interface Product {
    id: string;
    name: string;
    price: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

class CartStore {
    @observable items: CartItem[] = [];
    @observable isCheckout: boolean = false;

    constructor() {
        // 自动处理所有属性
        makeAutoObservable(this);
    }

    @computed get totalItems(): number {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    @computed get totalPrice(): number {
        return this.items.reduce((sum, item) =>
            sum + item.product.price * item.quantity, 0
        );
    }

    @computed get isEmpty(): boolean {
        return this.items.length === 0;
    }

    @action
    addItem(product: Product) {
        const existing = this.items.find(
            item => item.product.id === product.id
        );

        if (existing) {
            existing.quantity++;
        } else {
            this.items.push({ product, quantity: 1 });
        }
    }

    @action
    removeItem(productId: string) {
        const index = this.items.findIndex(
            item => item.product.id === productId
        );
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    @action
    updateQuantity(productId: string, quantity: number) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
            }
        }
    }

    @action
    clearCart() {
        this.items = [];
    }

    @action
    async checkout() {
        this.isCheckout = true;
        try {
            await api.checkout(this.items);
            this.clearCart();
            return { success: true };
        } catch (error) {
            return { success: false, error };
        } finally {
            this.isCheckout = false;
        }
    }
}

export const cartStore = new CartStore();
```

### 3.2 React 组件使用

```tsx
import React from 'react';
import { observer } from 'mobx-react';
import { cartStore } from './stores/CartStore';

const CartView = observer(() => {
    const { items, totalItems, totalPrice, isEmpty, isCheckout } = cartStore;

    if (isEmpty) {
        return <div className="cart-empty">购物车是空的</div>;
    }

    return (
        <div className="cart">
            <h2>购物车 ({totalItems} 件商品)</h2>

            <div className="cart-items">
                {items.map(item => (
                    <div key={item.product.id} className="cart-item">
                        <span>{item.product.name}</span>
                        <span>¥{item.product.price}</span>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={e => cartStore.updateQuantity(
                                item.product.id,
                                parseInt(e.target.value)
                            )}
                            min="1"
                        />
                        <span>¥{item.product.price * item.quantity}</span>
                        <button onClick={() => cartStore.removeItem(item.product.id)}>
                            删除
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-footer">
                <div className="total">
                    总计：<span>¥{totalPrice.toFixed(2)}</span>
                </div>
                <button
                    className="checkout-btn"
                    disabled={isCheckout}
                    onClick={() => cartStore.checkout()}
                >
                    {isCheckout ? '结算中...' : '结算'}
                </button>
            </div>
        </div>
    );
});

export default CartView;
```

---

## 四、高级特性

### 4.1 reactions

`reaction` 用于创建副作用：

```typescript
import { reaction } from 'mobx';

class Store {
    @observable name: string = '';
    @observable filter: string = '';
    @observable filteredList: string[] = [];
}

// 自动追踪
const store = new Store();

// 追踪 name 变化
const dispose = reaction(
    () => store.name,  // 追踪的函数
    (name, previousName) => {
        console.log(`name changed from ${previousName} to ${name}`);
        // 执行副作用，如 API 调用
        fetchUser(name);
    }
);

// 追踪多个值
reaction(
    () => [store.firstName, store.lastName],  // 数组形式追踪多个值
    ([firstName, lastName]) => {
        console.log(`name changed to ${firstName} ${lastName}`);
    }
);

// 清理
dispose();
```

### 4.2 autorun

`autorun` 类似 `reaction`，但追踪的是整个函数：

```typescript
import { autorun } from 'mobx';

const store = new Store();

// 每次追踪的值变化都会执行
autorun(() => {
    console.log('name changed:', store.name);
    // 会立即执行一次，然后每次 store.name 变化时执行
});

// 用于日志、持久化等副作用
autorun(() => {
    localStorage.setItem('name', store.name);
});
```

### 4.3 when

`when` 用于条件响应：

```typescript
import { when } from 'mobx';

class Store {
    @observable isLoaded: boolean = false;
    @observable data: any = null;
}

// 当条件满足时执行一次
when(
    () => store.isLoaded,
    () => {
        console.log('Data is loaded!');
        // 执行一次后自动清理
    }
);

// 等待 promise
const dispose = when(async () => {
    return await fetch('/api/ready');
});

const result = await dispose;
```

### 4.4 依赖追踪原理

```typescript
// MobX 依赖追踪示意图

/*
当执行 render() 时：
1. 组件开始追踪
2. 访问 store.name → 建立依赖：组件 → name
3. 访问 store.age → 建立依赖：组件 → age
4. 组件渲染完成，依赖建立完成

当 store.name = '新名字' 时：
1. name 发生变化
2. MobX 通知所有依赖方（组件）
3. 组件重新执行 render()
4. 重新建立依赖关系
*/

// 细粒度更新原理
class Store {
    @observable user = { name: '张三', age: 25 };
}

const store = new Store();

// 追踪 user.name - 只会依赖 name
autorun(() => {
    console.log(store.user.name);  // 只追踪 name
});

// 更新 user.age 不会触发上面的 autorun
store.user.age = 30;  // 不会触发

// 更新 user.name 会触发
store.user.name = '李四';  // 触发
```

### 4.5 数组和 Map 的响应式

```typescript
import { observable, toJS } from 'mobx';

// observable.array
const list = observable.array([1, 2, 3]);

// 数组方法
list.push(4);      // 添加
list.pop();        // 移除最后一个
list.shift();       // 移除第一个
list.unshift(0);    // 添加到开头
list.splice(1, 1);  // 删除/替换
list.remove(2);     // 移除指定元素

// 切片（不响应式）
const snapshot = list.slice();  // 返回普通数组
const jsArray = toJS(list);     // 转换为普通 JS 数组

// observable.map
const map = observable.map({
    key1: 'value1',
    key2: 'value2'
});

map.set('key3', 'value3');
map.delete('key1');
map.has('key1');
map.get('key1');

// 遍历
map.keys();
map.values();
map.entries();
map.forEach((value, key) => {});

// 与普通 Map 互转
const jsMap = new Map(map);
const observableMap = observable.map(jsMap);
```

---

## 五、最佳实践

### 5.1 Store 组织结构

```typescript
// stores/index.ts
import { createContext, useContext } from 'react';
import { cartStore } from './CartStore';
import { userStore } from './UserStore';
import { productStore } from './ProductStore';

export const stores = {
    cartStore,
    userStore,
    productStore
};

export const StoreContext = createContext(stores);

export const useStores = () => {
    return useContext(StoreContext);
};

export const useCartStore = () => useStores().cartStore;
export const useUserStore = () => useStores().userStore;
export const useProductStore = () => useStores().productStore;

// App.tsx
import { stores } from './stores';

ReactDOM.render(
    <StoreContext.Provider value={stores}>
        <App />
    </StoreContext.Provider>
);

// 组件中使用
const CartView = observer(() => {
    const { cartStore } = useStores();
    // 或者
    const cartStore = useCartStore();
});
```

### 5.2 性能优化

```tsx
// 1. 组件细粒度拆分
// 避免：大组件监听整个 Store
// 推荐：小组件只监听需要的属性

const UserName = observer(({ name }) => <span>{name}</span>);
const UserAge = observer(({ age }) => <span>{age}</span>);

// 2. 使用 computed 缓存复杂计算
class Store {
    @observable items: number[] = [];

    // 避免：在 render 中重复计算
    // 推荐：使用 computed
    @computed get sum(): number {
        return this.items.reduce((a, b) => a + b, 0);
    }
}

// 3. 使用 keys 优化列表
const ItemList = observer(({ itemIds }) => {
    return (
        <div>
            {itemIds.map(id => (
                // 使用 id 作为 key
                <Item key={id} id={id} />
            ))}
        </div>
    );
});

// 4. 避免派生状态作为 props 传递
// 不好：传递派生状态
<UserList users={store.filteredUsers} />

// 好：传递原始数据和计算逻辑
<UserList users={store.users} filter={store.filter} />
```

### 5.3 调试工具

```typescript
// 安装 mobx-devtools
// Chrome 插件：MobX Developer Tools

// 在开发环境启用
if (process.env.NODE_ENV === 'development') {
    import('mobx-devtools').catch(() => {});
}

// 使用 spy 监听所有变化
import { spy } from 'mobx';

spy(event => {
    console.log(event);
    // { type: 'update', object: Store, name: 'count', newValue: 1 }
});

// 使用 mobx-logger
import { trace } from 'mobx';

const Component = observer(() => {
    trace();  // 在 DEVTOOLS 中显示追踪信息
    return <div>{store.name}</div>;
});
```

---

## 六、常见问题与解决方案

### 6.1 对象引用问题

```typescript
// 问题：直接替换整个对象会丢失响应式
store.user = { name: '新名字', age: 30 };  // 响应式丢失

// 解决：使用 Object.assign 或单独更新属性
Object.assign(store.user, { name: '新名字' });
store.user.name = '新名字';

// 或者使用 observable.ref 保持引用
import { observable, ref } from 'mobx';

const store = observable({
    user: ref({ name: '张三' })
});
```

### 6.2 异步更新问题

```typescript
// 问题：异步操作中直接修改状态
async fetchUser() {
    const response = await fetch('/api/user');
    const user = await response.json();
    this.user = user;  // 可能不在 action 中
}

// 解决：使用 runInAction
async fetchUser() {
    const response = await fetch('/api/user');
    const user = await response.json();

    runInAction(() => {
        this.user = user;
    });
}

// 或者使用 flow 语法（需要生成器支持）
import { flow } from 'mobx';

class Store {
    @observable user = null;

    fetchUser = flow(function* () {
        const response = yield fetch('/api/user');
        this.user = yield response.json();
    });
}
```

### 6.3 内存泄漏

```typescript
import { reaction, disposeOnUnmount } from 'mobx';
import React, { useEffect } from 'react';

class Store {
    @observable name = '';
}

// 组件中
const MyComponent = observer(() => {
    useEffect(() => {
        const dispose = reaction(
            () => store.name,
            name => console.log(name)
        );

        // 组件卸载时清理
        return () => dispose();
    }, []);

    // 或者使用装饰器
    disposeOnUnmount(this, reaction(...));
});
```

---

## 七、面试题

### 7.1 面试题1：MobX 和 Redux 的区别？

**参考答案：**

| 特性 | MobX | Redux |
|------|------|-------|
| 设计理念 | 响应式，自动追踪 | 函数式，单向数据流 |
| 代码风格 | 面向对象 | 函数式 |
| 学习曲线 | 较平缓 | 较陡峭 |
| 样板代码 | 较少 | 较多 |
| 数据流 | 双向绑定 | 单向数据流 |
| 不可变性 | 不强制 | 强制 |
| DevTools | 支持 | 支持 |
| 中间件 | 少 | 丰富 |
| 适用场景 | 中小项目 | 大型项目 |

**MobX 优势：**
- 样板代码少，开发效率高
- 面向对象，更易理解
- 自动追踪依赖，性能好

**Redux 优势：**
- 单一数据源，易于调试
- 时间旅行调试
- 中间件丰富，社区活跃
- 适合大型复杂应用

### 7.2 面试题2：MobX 的响应式原理？

**参考答案：**

MobX 的响应式基于 **ES6 Proxy**（现代浏览器）或 **Object.defineProperty**（旧版浏览器）实现。

**核心流程：**

```
1. observable 包装数据
   ↓
2. 组件渲染时访问响应式属性，建立依赖关系
   ↓
3. 属性变化时，MobX 通知所有依赖方
   ↓
4. 依赖方自动更新
```

**实现原理：**

```typescript
// 简化的响应式实现
function observable(target, key) {
    const value = target[key];

    Object.defineProperty(target, key, {
        get() {
            // 收集依赖
            trackingContext.collect(key, this);
            return value;
        },
        set(newValue) {
            value = newValue;
            // 触发更新
            trackingContext.notify(key);
        }
    });
}

// 组件中使用
const component = {
    render() {
        // 访问 store.name，自动建立依赖
        console.log(store.name);
    }
};

// name 变化时
store.name = '新名字';  // 触发 notify
// 自动调用 component.render()
```

**computed 计算属性：**
- 基于 Dirty Checking 机制
- 缓存上次计算结果
- 只有依赖项变化时才重新计算

### 7.3 面试题3：如何在 MobX 中处理异步？

**参考答案：**

**方案一：runInAction**

```typescript
@action
async fetchData() {
    try {
        const data = await api.getData();
        runInAction(() => {
            this.data = data;
            this.isLoading = false;
        });
    } catch (error) {
        runInAction(() => {
            this.error = error;
            this.isLoading = false;
        });
    }
}
```

**方案二：flow 语法**

```typescript
import { flow } from 'mobx';

class Store {
    @observable data = null;
    @observable error = null;

    fetchData = flow(function* () {
        try {
            const data = yield api.getData();
            this.data = data;
        } catch (error) {
            this.error = error;
        }
    });
}
```

**方案三：使用 task（ mobx-utils）**

```typescript
import { task } from 'mobx-utils';

class Store {
    @observable data = null;

    async fetchData() {
        const [data, error] = await task(
            api.getData().then(res => [res, null])
                     .catch(err => [null, err])
        );
        this.data = data;
    }
}
```

### 7.4 面试题4：MobX 的性能优化策略？

**参考答案：**

**1. 细粒度拆分组件**

```tsx
// 不好：大组件
const UserProfile = observer(() => (
    <div>
        <UserName name={store.user.name} />
        <UserAge age={store.user.age} />
        <UserAddress address={store.user.address} />
    </div>
));

// 好：拆分小组件
const UserName = observer(({ name }) => <span>{name}</span>);
const UserAge = observer(({ age }) => <span>{age}</span>);
const UserAddress = observer(({ address }) => <div>{address}</div>);
```

**2. 使用 keys 追踪**

```tsx
// 为每个追踪的值使用独立的 key
const Component = observer(({ id }) => {
    const item = useMemo(() => store.getItem(id), [id]);
    return <div>{item.name}</div>;
});
```

**3. 避免派生状态**

```typescript
// 不好：派生状态作为 observable
@observable filteredItems = [];

// 好：使用 computed
@computed get filteredItems() {
    return this.items.filter(item => item.active);
}
```

**4. 批量更新**

```typescript
import { batch } from 'mobx';

batch(() => {
    store.name = 'name1';
    store.age = 25;
    store.address = 'address';
});  // 只触发一次更新
```

### 7.5 面试题5：MobX 在大型项目中的实践？

**参考答案：**

**项目结构：**

```
src/
├── stores/              # 状态管理
│   ├── index.ts        # Store 入口
│   ├── UserStore.ts    # 用户相关
│   ├── ProductStore.ts # 产品相关
│   ├── CartStore.ts    # 购物车
│   └── UIStore.ts      # UI 状态
├── models/             # 数据模型
│   ├── User.ts
│   └── Product.ts
├── api/                # API 层
│   └── index.ts
└── utils/              # 工具函数
```

**Store 隔离：**

```typescript
// 每个 Store 职责单一
class UserStore {
    @observable user: User | null = null;
    @observable isLogin: boolean = false;

    @computed get isVip(): boolean {
        return this.user?.vipLevel > 0;
    }

    @action async login(credentials) {
        // 登录逻辑
    }

    @action logout() {
        this.user = null;
    }
}
```

**服务层分离：**

```typescript
// api/services/UserService.ts
export class UserService {
    async login(credentials) {
        return api.post('/login', credentials);
    }

    async getUserInfo() {
        return api.get('/user/info');
    }
}

// stores/UserStore.ts
import { UserService } from '@/api/services/UserService';

class UserStore {
    private userService = new UserService();

    @action async login(credentials) {
        const user = await this.userService.login(credentials);
        runInAction(() => {
            this.user = user;
        });
    }
}
```

**持久化集成：**

```typescript
import { persist } from 'mobx-persist';

// 使用 mobx-persist
class Store {
    @observable name = '';

    @persist
    set name(value: string) {
        this.name = value;
    }
}

// 配合 localStorage
const createStore = () => {
    const store = new Store();
    persist('store', store, {
        storage: localStorage,
        jsonify: false
    });
    return store;
};
```
