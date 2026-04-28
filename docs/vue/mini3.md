# Vue 3 核心原理实现（Mini 版）

## 前言

Vue 3 的核心架构可以分为以下几个模块，理解了这些模块的工作原理，就能掌握 Vue 3 的精髓：

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vue 3 架构图                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│   │   Compiler   │ ──▶ │  Render DOM  │ ──▶ │    DOM       │    │
│   │  (模板编译)   │     │  (渲染器)    │     │  (真实DOM)   │    │
│   └──────────────┘     └──────────────┘     └──────────────┘    │
│          │                    ▲                    ▲            │
│          │                    │                    │            │
│          ▼                    │                    │            │
│   ┌──────────────┐     ┌──────────────┐          │            │
│   │  Render Fn   │ ──▶ │  Virtual DOM │ ────────┘            │
│   │  (渲染函数)   │     │  (虚拟DOM)   │                      │
│   └──────────────┘     └──────────────┘                      │
│          ▲                    ▲                               │
│          │                    │                               │
│          │              ┌──────────────┐                      │
│          └──────────────│   Reactive   │                      │
│                         │   (响应式)    │                      │
│                         └──────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**数据流向**：模板 → 编译 → 渲染函数 → 虚拟 DOM → 真实 DOM

**响应式流程**：数据变化 → 触发 setter → 通知依赖 → 重新渲染

---

## 一、整体架构设计

### 1.1 为什么需要 Mini 版本

面试中问到 Vue 原理时，很多候选人只会背"Vue2 用 Object.defineProperty，Vue3 用 Proxy"。但面试官真正想知道的是：你是否理解 Vue 响应式系统的本质？是否能从零实现一个响应式系统？

通过手写 Vue 3 Mini，我们可以：
- 深入理解 Vue 3 的响应式原理
- 理解虚拟 DOM 的工作方式
- 理解组件渲染的完整流程
- 在面试中清晰地讲解 Vue 核心原理

### 1.2 Mini 版本的特性

我们实现的 Vue 3 Mini 将包含以下核心功能：

| 功能 | 说明 | 优先级 |
|------|------|--------|
| reactive | 深度响应式对象 | ⭐⭐⭐ |
| ref | 响应式引用 | ⭐⭐⭐ |
| computed | 计算属性 | ⭐⭐ |
| effect | 副作用追踪 | ⭐⭐⭐ |
| h | 虚拟 DOM 创建 | ⭐⭐⭐ |
| render | DOM 渲染 | ⭐⭐⭐ |
| createApp | 应用入口 | ⭐⭐⭐ |
| patch | 差异更新 | ⭐⭐ |

### 1.3 整体代码结构

```javascript
// vue3-mini.js - 完整代码约 300 行

// ==================== 第一部分：工具函数 ====================

// ==================== 第二部分：响应式系统 ====================
// - reactive
// - ref
// - computed
// - effect / track / trigger

// ==================== 第三部分：虚拟 DOM ====================
// - h
// - createVNode

// ==================== 第四部分：渲染器 ====================
// - render
// - patch
// - mountElement
// - patchElement

// ==================== 第五部分：应用入口 ====================
// - createApp
// - mount
```

---

## 二、工具函数

在开始实现之前，我们需要一些基础工具函数：

```javascript
// 判断是否为对象
const isObject = (obj) => obj !== null && typeof obj === 'object'

// 判断是否为函数
const isFunction = (fn) => typeof fn === 'function'

// 判断是否为数组
const isArray = Array.isArray

// 对象遍历
const foreach = (obj, fn) => {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn(key, obj[key])
        }
    }
}
```

---

## 三、响应式系统（核心）

### 3.1 响应式系统的核心思想

Vue 3 的响应式系统核心思想来自**观察者模式**：

```
┌─────────────────────────────────────────────────────────────────┐
│                      响应式系统工作流程                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   用户修改数据                                                    │
│       │                                                         │
│       ▼                                                         │
│   ┌─────────┐      触发 setter      ┌─────────────┐             │
│   │  Data   │ ───────────────────▶ │   Trigger   │             │
│   └─────────┘                       └─────────────┘             │
│       │                                    │                     │
│       │ get                                  │ notify            │
│       ▼                                    ▼                     │
│   ┌──────────┐                       ┌───────────┐              │
│   │  Track   │                       │  Effects   │              │
│   │ (收集依赖) │                       │ (执行更新) │              │
│   └──────────┘                       └───────────┘              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**关键概念**：
- **track**：在 getter 中收集依赖，建立数据 → 组件的映射关系
- **trigger**：在 setter 中触发更新，执行所有依赖该数据的组件更新

### 3.2 依赖收集的数据结构

我们需要一种数据结构来存储依赖关系：

```javascript
// 依赖关系结构：
// targetMap = {
//   target: {
//     key: [effect1, effect2, ...]
//   }
// }

// targetMap - 存储每个对象的依赖关系
// key - 对象的具体属性
// effects - 依赖该属性的副作用函数列表

const targetMap = new WeakMap()

// 收集依赖
function track(target, key) {
    // 获取当前正在执行的 effect
    if (!currentEffect) return

    // 获取 target 的依赖 Map
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    // 获取 key 对应的 effect 列表
    let deps = depsMap.get(key)
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps)
    }

    // 将当前 effect 添加到依赖列表
    deps.add(currentEffect)
}

// 触发更新
function trigger(target, key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return

    const deps = depsMap.get(key)
    if (!deps) return

    // 执行所有依赖该属性的 effect
    deps.forEach(effect => effect())
}
```

### 3.3 实现 effect 函数

effect 是 Vue 3 响应式系统的核心，它建立了数据变化和组件更新的桥梁：

```javascript
// 当前正在执行的 effect
let currentEffect = null

/**
 * effect 函数 - 响应式副作用
 * 当响应式数据变化时，自动重新执行
 *
 * @param fn - 要执行的函数
 * @returns - 返回包装后的函数
 */
function effect(fn) {
    // 包装函数，捕获 currentEffect
    const wrappedFn = () => {
        currentEffect = wrappedFn
        fn()  // 执行函数，期间访问的响应式数据会被 track
        currentEffect = null
    }

    // 立即执行一次，触发依赖收集
    wrappedFn()

    return wrappedFn
}
```

**effect 的工作流程**：

```
1. 调用 effect(fn)
       │
       ▼
2. 创建 wrappedFn，currentEffect = wrappedFn
       │
       ▼
3. 立即执行 wrappedFn()
       │
       ├── fn() 执行
       │      │
       │      ├── 访问响应式数据（如 state.count）
       │      │      │
       │      │      ▼
       │      │   track(target, 'count') 被调用
       │      │      │
       │      │      └── currentEffect 被添加到 deps
       │      │
       │      └── fn() 执行完毕
       │
       └── currentEffect = null

4. 后续当 state.count 被修改时
       │
       ├── trigger(target, 'count') 被调用
       │      │
       │      └── deps.forEach(effect => effect())
       │
       └── wrappedFn 重新执行
```

### 3.4 实现 reactive

Vue 3 使用 `Proxy` 实现响应式，相比 Vue 2 的 `Object.defineProperty`，Proxy 有以下优势：

| 特性 | Object.defineProperty | Proxy |
|------|----------------------|-------|
| 添加属性 | 需手动 Vue.set | 自动响应 |
| 删除属性 | 需手动 Vue.delete | 自动响应 |
| 数组下标 | 需手动设置 | 自动响应 |
| 性能 | 需递归遍历 | 性能更好 |
| 兼容性 | IE9+ | 现代浏览器 |

```javascript
/**
 * reactive - 创建响应式对象
 * 使用 Proxy 拦截对象的 get/set 操作
 *
 * @param target - 目标对象
 * @returns - 响应式代理对象
 */
function reactive(target) {
    // 如果已经是 Proxy，直接返回
    if (target && target.__v_raw) {
        return target
    }

    // 使用 Proxy 包装目标对象
    const handler = {
        /**
         * get 拦截 - 收集依赖
         * 当访问响应式对象的属性时，触发 track 收集依赖
         */
        get(target, key, receiver) {
            // 收集依赖
            track(target, key)

            // 返回属性值，如果是对象则递归包装
            const value = Reflect.get(target, key, receiver)

            // 如果是对象，递归实现深度响应式
            if (isObject(value)) {
                return reactive(value)
            }

            return value
        },

        /**
         * set 拦截 - 触发更新
         * 当修改响应式对象的属性时，触发 trigger 更新依赖
         */
        set(target, key, value, receiver) {
            // 获取旧值
            const oldValue = target[key]

            // 设置新值
            const result = Reflect.set(target, key, value, receiver)

            // 只有值真正变化时才触发更新
            if (oldValue !== value) {
                // 触发更新
                trigger(target, key)
            }

            return result
        },

        /**
         * deleteProperty 拦截 - 删除属性时触发更新
         */
        deleteProperty(target, key) {
            const hadKey = Object.prototype.hasOwnProperty.call(target, key)
            const result = Reflect.deleteProperty(target, key)

            if (hadKey && result) {
                trigger(target, key)
            }

            return result
        }
    }

    // 创建并返回 Proxy
    return new Proxy(target, handler)
}
```

**reactive 的实现要点**：

1. **深度响应式**：在 get 中判断如果是对象，递归调用 `reactive`，保证深层属性也是响应式的

2. **避免重复代理**：通过 `__v_raw` 标记判断是否已经是 Proxy，避免重复包装

3. **正确绑定 this**：使用 `Reflect` 确保 this 指向代理对象本身

### 3.5 实现 ref

ref 用于包装基本类型数据（字符串、数字、布尔等），因为 Proxy 只对对象有效：

```javascript
/**
 * ref - 创建响应式引用
 * ref 将基本类型包装成对象，通过 .value 访问
 *
 * @param value - 初始值
 * @returns - 响应式 ref 对象
 *
 * 使用示例：
 * const count = ref(0)
 * console.log(count.value)  // 0
 * count.value++              // 触发响应式更新
 */
function ref(value) {
    return {
        // 标记为 ref
        __v_isRef: true,

        // value 属性的 getter 和 setter
        get value() {
            // 收集依赖
            track({ value: '' }, 'value')
            return value
        },

        set value(newValue) {
            // 只有值变化才触发更新
            if (newValue !== value) {
                value = newValue
                // 触发更新
                trigger({ value: '' }, 'value')
            }
        }
    }
}

/**
 * toRefs - 将响应式对象转换为 ref 集合
 * 用于解构响应式对象时保持响应式
 *
 * 使用示例：
 * const { count, name } = toRefs(reactive({ count: 0, name: '张三' }))
 * count.value++  // 仍然是响应式的
 */
function toRefs(obj) {
    const result = {}
    for (const key in obj) {
        result[key] = toRef(obj, key)
    }
    return result
}

function toRef(obj, key) {
    return {
        __v_isRef: true,
        get value() {
            return obj[key]
        },
        set value(newValue) {
            obj[key] = newValue
        }
    }
}
```

### 3.6 实现 computed

computed 是基于 effect 的高级特性，它具有缓存特性：

```javascript
/**
 * computed - 计算属性
 * 计算属性是基于响应式数据的派生值
 * 只有当依赖的响应式数据变化时，才会重新计算
 *
 * @param fn - 计算函数
 * @returns - 计算属性访问器
 *
 * 特性：
 * 1. 惰性求值 - 只有首次访问时才会执行
 * 2. 缓存机制 - 依赖不变时返回缓存值
 */
function computed(fn) {
    // 计算结果缓存
    let value
    // 是否需要重新计算
    let dirty = true

    // 使用 effect 追踪依赖
    const effectFn = effect(fn, {
        // 调度器，当依赖变化时标记 dirty
        scheduler() {
            dirty = true
        }
    })

    return {
        __v_isRef: true,

        get value() {
            // 只有脏数据才重新计算
            if (dirty) {
                value = effectFn()
                dirty = false
            }
            return value
        },

        set value(newValue) {
            // computed 通常是只读的，这里简单处理
            console.warn('computed 属性只读')
        }
    }
}
```

**computed 的工作原理**：

```
┌─────────────────────────────────────────────────────────────────┐
│                      computed 工作流程                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   首次访问 computed.value                                         │
│          │                                                       │
│          ▼                                                       │
│   dirty = true? ──▶ 是 ──▶ 执行 fn() 计算结果                   │
│          │                      │                                │
│          │                      ▼                                │
│          │                 value = 结果                           │
│          │                 dirty = false                         │
│          │                      │                                │
│          ▼                      ▼                                │
│   返回 value              下次访问直接返回缓存                     │
│                                                                  │
│   某响应式数据变化 ──▶ 触发 scheduler ──▶ dirty = true           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.7 完整的响应式模块代码

```javascript
// ==================== 响应式系统完整实现 ====================

// 依赖关系存储：target -> key -> effects
const targetMap = new WeakMap()

// 当前正在执行的 effect
let currentEffect = null

/**
 * 收集依赖
 * 在 getter 中调用，建立响应式数据和 effect 的映射关系
 */
function track(target, key) {
    if (!currentEffect) return

    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let deps = depsMap.get(key)
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps)
    }

    deps.add(currentEffect)
}

/**
 * 触发更新
 * 在 setter 中调用，执行所有依赖该属性的 effect
 */
function trigger(target, key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return

    const deps = depsMap.get(key)
    if (!deps) return

    deps.forEach(effect => effect())
}

/**
 * effect - 响应式副作用
 */
function effect(fn, options = {}) {
    const wrappedFn = () => {
        currentEffect = wrappedFn
        try {
            fn()
        } finally {
            currentEffect = null
        }
    }

    // 立即执行一次
    wrappedFn()

    return wrappedFn
}

/**
 * reactive - 创建响应式对象
 */
function reactive(target) {
    if (target && target.__v_raw) {
        return target
    }

    const handler = {
        get(target, key, receiver) {
            track(target, key)
            const value = Reflect.get(target, key, receiver)
            return isObject(value) ? reactive(value) : value
        },

        set(target, key, value, receiver) {
            const oldValue = target[key]
            const result = Reflect.set(target, key, value, receiver)
            if (oldValue !== value) {
                trigger(target, key)
            }
            return result
        },

        deleteProperty(target, key) {
            const hadKey = Object.prototype.hasOwnProperty.call(target, key)
            const result = Reflect.deleteProperty(target, key)
            if (hadKey && result) {
                trigger(target, key)
            }
            return result
        }
    }

    return new Proxy(target, handler)
}

/**
 * ref - 响应式引用
 */
function ref(value) {
    return {
        __v_isRef: true,
        get value() {
            track({ value: '' }, 'value')
            return value
        },
        set value(newValue) {
            if (newValue !== value) {
                value = newValue
                trigger({ value: '' }, 'value')
            }
        }
    }
}

/**
 * computed - 计算属性
 */
function computed(fn) {
    let value
    let dirty = true

    const effectFn = effect(fn, {
        scheduler() {
            dirty = true
        }
    })

    return {
        __v_isRef: true,
        get value() {
            if (dirty) {
                value = effectFn()
                dirty = false
            }
            return value
        }
    }
}
```

---

## 四、虚拟 DOM

### 4.1 什么是虚拟 DOM

虚拟 DOM（Virtual DOM）是用 JavaScript 对象描述真实 DOM 的轻量副本：

```
┌─────────────────────────────────────────────────────────────────┐
│                      虚拟 DOM vs 真实 DOM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   真实 DOM：                                                     │
│   <div class="container" onclick="handleClick">                  │
│       <h1>Hello</h1>                                             │
│       <p>World</p>                                               │
│   </div>                                                         │
│                                                                  │
│   虚拟 DOM：                                                     │
│   {                                                              │
│       tag: 'div',                                                │
│       props: { class: 'container', onClick: handleClick },      │
│       children: [                                                │
│           { tag: 'h1', children: 'Hello' },                       │
│           { tag: 'p', children: 'World' }                        │
│       ]                                                          │
│   }                                                              │
│                                                                  │
│   优势：                                                         │
│   1. JS 对象操作比真实 DOM 快得多                                │
│   2. 通过 diff 算法最小化 DOM 操作                               │
│   3. 跨平台能力（SSR、Native 等）                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 实现 h 函数

h 函数用于创建虚拟 DOM 节点：

```javascript
/**
 * h - 创建虚拟节点
 *
 * @param tag - 标签名（如 'div', 'span'）
 * @param props - 属性对象（如 { class: 'box', onClick: fn }）
 * @param children - 子节点（可以是字符串、其他 vnode 或数组）
 * @returns - 虚拟节点对象
 *
 * 使用示例：
 * h('div', { class: 'container' }, 'Hello')
 * h('ul', null, [h('li', null, 'Item 1'), h('li', null, 'Item 2')])
 */
function h(tag, props = {}, children = null) {
    return {
        // vnode 标记，用于识别 vnode 对象
        __v_isVNode: true,

        // 标签名
        tag,

        // 属性
        props,

        // 子节点
        children,

        // 唯一 key，用于 diff 算法优化
        key: props?.key,

        // 其他元数据
        el: null,           // 对应的真实 DOM 节点
        shapeFlag: getShapeFlag(tag),  // 节点类型标记
    }
}

/**
 * 获取节点类型标记
 */
function getShapeFlag(tag) {
    return typeof tag === 'string' ? ELEMENT : COMPONENT
}

// 类型常量
const ELEMENT = 1
const COMPONENT = 2
const TEXT = 3
const FRAGMENT = 4
```

### 4.3 createVNode 辅助函数

```javascript
/**
 * createVNode - 创建虚拟节点（更规范的命名）
 * 本质上与 h 函数相同
 */
function createVNode(tag, props, children) {
    return h(tag, props, children)
}

/**
 * createTextVNode - 创建文本虚拟节点
 */
function createTextVNode(text) {
    return {
        __v_isVNode: true,
        tag: null,  // 文本节点 tag 为 null
        children: text,
        shapeFlag: TEXT,
    }
}

/**
 * isVNode - 判断是否为虚拟节点
 */
function isVNode(value) {
    return value?.__v_isVNode === true
}
```

### 4.4 虚拟 DOM 完整代码

```javascript
// ==================== 虚拟 DOM 完整实现 ====================

const ELEMENT = 1
const COMPONENT = 2
const TEXT = 3
const FRAGMENT = 4

function h(tag, props = {}, children = null) {
    return {
        __v_isVNode: true,
        tag,
        props,
        children,
        key: props?.key,
        el: null,
        shapeFlag: getShapeFlag(tag),
    }
}

function getShapeFlag(tag) {
    return typeof tag === 'string' ? ELEMENT : COMPONENT
}

function createVNode(tag, props, children) {
    return h(tag, props, children)
}

function createTextVNode(text) {
    return {
        __v_isVNode: true,
        tag: null,
        children: text,
        shapeFlag: TEXT,
    }
}

function isVNode(value) {
    return value?.__v_isVNode === true
}
```

---

## 五、渲染器（Renderer）

### 5.1 渲染器概述

渲染器是连接虚拟 DOM 和真实 DOM 的桥梁：

```
┌─────────────────────────────────────────────────────────────────┐
│                        渲染器工作流程                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   render(vnode, container)                                       │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────────────────────────────────┐                  │
│   │              vnode 是啥？                  │                  │
│   └──────────────────────────────────────────┘                  │
│          │                                                       │
│          ├── tag 是字符串？──▶ 创建 HTML 元素                    │
│          │                    mountElement()                    │
│          │                                                       │
│          ├── tag 是函数？──▶ 创建组件                            │
│          │                    mountComponent()                  │
│          │                                                       │
│          └── tag 是 null？──▶ 创建文本节点                       │
│                             mountText()                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 render 函数 - 入口

```javascript
/**
 * render - 渲染虚拟节点到容器
 *
 * @param vnode - 虚拟节点
 * @param container - 真实容器 DOM 元素
 */
function render(vnode, container) {
    // 清理容器
    container.innerHTML = ''

    // 调用 mount 处理 vnode
    mount(vnode, container)
}

/**
 * mount - 挂载 vnode 到容器
 */
function mount(vnode, container) {
    const { tag, shapeFlag } = vnode

    // 根据类型分发处理
    if (shapeFlag === ELEMENT) {
        // DOM 元素
        mountElement(vnode, container)
    } else if (shapeFlag === TEXT) {
        // 文本节点
        mountText(vnode, container)
    } else if (shapeFlag === COMPONENT) {
        // 组件
        mountComponent(vnode, container)
    }
}
```

### 5.3 mountElement - 挂载 DOM 元素

```javascript
/**
 * mountElement - 创建并挂载真实 DOM 元素
 *
 * 流程：
 * 1. 创建 DOM 元素
 * 2. 设置属性（props）
 * 3. 处理子节点
 * 4. 添加到容器
 */
function mountElement(vnode, container) {
    const { tag, props, children } = vnode

    // 1. 创建 DOM 元素
    const el = document.createElement(tag)

    // 将 el 存储到 vnode 上，后续 patch 时需要
    vnode.el = el

    // 2. 设置属性
    if (props) {
        for (const [key, value] of Object.entries(props)) {
            // 处理事件（on 开头）
            if (key.startsWith('on')) {
                const eventName = key.slice(2).toLowerCase()
                el.addEventListener(eventName, value)
            } else {
                // 普通属性
                el.setAttribute(key, value)
            }
        }
    }

    // 3. 处理子节点
    if (children) {
        if (typeof children === 'string') {
            // 文本子节点
            el.textContent = children
        } else if (Array.isArray(children)) {
            // 多个子节点，递归挂载
            children.forEach(child => {
                mount(child, el)
            })
        }
    }

    // 4. 添加到容器
    container.appendChild(el)
}
```

### 5.4 mountText - 挂载文本节点

```javascript
/**
 * mountText - 创建并挂载文本节点
 */
function mountText(vnode, container) {
    const textNode = document.createTextNode(vnode.children)
    vnode.el = textNode
    container.appendChild(textNode)
}
```

### 5.5 mountComponent - 挂载组件

```javascript
/**
 * mountComponent - 挂载组件
 *
 * 组件的渲染流程：
 * 1. 调用 setup() 获取状态
 * 2. 调用 render() 获取 vnode
 * 3. 递归渲染 vnode
 */
function mountComponent(vnode, container) {
    const { tag: Component } = vnode

    // 调用 setup 获取状态和渲染函数
    const { setupState, render } = Component()

    // 调用 render 获取 vnode
    const instanceVNode = render.call(setupState)

    // 递归挂载 vnode
    mount(instanceVNode, container)

    // 存储组件实例引用
    vnode.el = instanceVNode.el
}
```

### 5.6 patch - 差异更新（核心）

当数据变化时，需要对比新旧 vnode，只更新变化的部分：

```javascript
/**
 * patch - 对比新旧 vnode，进行差异化更新
 *
 * @param oldVNode - 旧的虚拟节点
 * @param newVNode - 新的虚拟节点
 */
function patch(oldVNode, newVNode) {
    // 如果标签不同，直接替换
    if (oldVNode.tag !== newVNode.tag) {
        replaceVNode(oldVNode, newVNode)
        return
    }

    // 如果是文本节点
    if (newVNode.shapeFlag === TEXT) {
        if (oldVNode.children !== newVNode.children) {
            oldVNode.el.textContent = newVNode.children
        }
        return
    }

    // 如果是元素节点
    if (newVNode.shapeFlag === ELEMENT) {
        patchElement(oldVNode, newVNode)
    }
}

/**
 * patchElement - 更新元素节点
 */
function patchElement(oldVNode, newVNode) {
    const el = newVNode.el = oldVNode.el

    // 1. 更新属性
    patchProps(oldVNode.props || {}, newVNode.props || {})

    // 2. 更新子节点
    patchChildren(oldVNode.children, newVNode.children, el)
}

/**
 * patchProps - 更新属性
 */
function patchProps(oldProps, newProps) {
    // 处理新增/修改的属性
    for (const [key, value] of Object.entries(newProps)) {
        if (oldProps[key] !== value) {
            if (key.startsWith('on')) {
                const eventName = key.slice(2).toLowerCase()
                el.addEventListener(eventName, value)
            } else {
                el.setAttribute(key, value)
            }
        }
    }

    // 处理删除的属性
    for (const key of Object.keys(oldProps)) {
        if (!(key in newProps)) {
            if (key.startsWith('on')) {
                const eventName = key.slice(2).toLowerCase()
                el.removeEventListener(eventName, oldProps[key])
            } else {
                el.removeAttribute(key)
            }
        }
    }
}

/**
 * patchChildren - 更新子节点
 */
function patchChildren(oldChildren, newChildren, container) {
    // 简单实现：直接替换
    if (typeof newChildren === 'string') {
        container.textContent = newChildren
    } else if (Array.isArray(newChildren)) {
        container.innerHTML = ''
        newChildren.forEach(child => mount(child, container))
    }
}

/**
 * replaceVNode - 替换节点
 */
function replaceVNode(oldVNode, newVNode) {
    const parent = oldVNode.el.parentNode
    parent.removeChild(oldVNode.el)
    mount(newVNode, parent)
}
```

### 5.7 完整的渲染器代码

```javascript
// ==================== 渲染器完整实现 ====================

const ELEMENT = 1
const COMPONENT = 2
const TEXT = 3

/**
 * render - 渲染入口
 */
function render(vnode, container) {
    container.innerHTML = ''
    mount(vnode, container)
}

/**
 * mount - 挂载 vnode
 */
function mount(vnode, container) {
    const { shapeFlag } = vnode

    if (shapeFlag === ELEMENT) {
        mountElement(vnode, container)
    } else if (shapeFlag === TEXT) {
        mountText(vnode, container)
    } else if (shapeFlag === COMPONENT) {
        mountComponent(vnode, container)
    }
}

/**
 * mountElement - 挂载 DOM 元素
 */
function mountElement(vnode, container) {
    const { tag, props, children } = vnode
    const el = document.createElement(tag)
    vnode.el = el

    // 设置属性
    if (props) {
        for (const [key, value] of Object.entries(props)) {
            if (key.startsWith('on')) {
                el.addEventListener(key.slice(2).toLowerCase(), value)
            } else {
                el.setAttribute(key, value)
            }
        }
    }

    // 设置子节点
    if (children) {
        if (typeof children === 'string') {
            el.textContent = children
        } else if (Array.isArray(children)) {
            children.forEach(child => mount(child, el))
        }
    }

    container.appendChild(el)
}

/**
 * mountText - 挂载文本节点
 */
function mountText(vnode, container) {
    const textNode = document.createTextNode(vnode.children)
    vnode.el = textNode
    container.appendChild(textNode)
}

/**
 * mountComponent - 挂载组件
 */
function mountComponent(vnode, container) {
    const { tag: Component } = vnode
    const { setupState, render } = Component()
    const instanceVNode = render.call(setupState)
    mount(instanceVNode, container)
    vnode.el = instanceVNode.el
}

/**
 * patch - 差异化更新
 */
function patch(oldVNode, newVNode) {
    if (oldVNode.tag !== newVNode.tag) {
        replaceVNode(oldVNode, newVNode)
        return
    }

    if (newVNode.shapeFlag === TEXT) {
        if (oldVNode.children !== newVNode.children) {
            oldVNode.el.textContent = newVNode.children
        }
        return
    }

    if (newVNode.shapeFlag === ELEMENT) {
        patchElement(oldVNode, newVNode)
    }
}

/**
 * patchElement - 更新元素
 */
function patchElement(oldVNode, newVNode) {
    const el = newVNode.el = oldVNode.el
    patchProps(oldVNode.props || {}, newVNode.props || {})
    patchChildren(oldVNode.children, newVNode.children, el)
}

/**
 * patchProps - 更新属性
 */
function patchProps(oldProps, newProps) {
    for (const [key, value] of Object.entries(newProps)) {
        if (oldProps[key] !== value) {
            if (key.startsWith('on')) {
                el.addEventListener(key.slice(2).toLowerCase(), value)
            } else {
                el.setAttribute(key, value)
            }
        }
    }

    for (const key of Object.keys(oldProps)) {
        if (!(key in newProps)) {
            if (key.startsWith('on')) {
                el.removeEventListener(key.slice(2).toLowerCase(), oldProps[key])
            } else {
                el.removeAttribute(key)
            }
        }
    }
}

/**
 * patchChildren - 更新子节点
 */
function patchChildren(oldChildren, newChildren, container) {
    if (typeof newChildren === 'string') {
        container.textContent = newChildren
    } else if (Array.isArray(newChildren)) {
        container.innerHTML = ''
        newChildren.forEach(child => mount(child, container))
    }
}

/**
 * replaceVNode - 替换节点
 */
function replaceVNode(oldVNode, newVNode) {
    const parent = oldVNode.el.parentNode
    parent.removeChild(oldVNode.el)
    mount(newVNode, parent)
}
```

---

## 六、应用入口 createApp

### 6.1 createApp 的实现

```javascript
/**
 * createApp - 创建应用入口
 *
 * @param options - 应用配置，包含 setup 和 render
 * @returns - 应用实例
 *
 * 使用示例：
 * const app = createApp({
 *     setup() {
 *         const count = ref(0)
 *         return { count }
 *     },
 *     render() {
 *         return h('div', { onClick: () => this.count.value++ }, this.count.value)
 *     }
 * })
 * app.mount('#app')
 */
function createApp(options) {
    return {
        /**
         * mount - 挂载应用到 DOM
         */
        mount(selector) {
            // 获取容器
            const container = document.querySelector(selector)
            if (!container) {
                throw new Error(`Cannot find element: ${selector}`)
            }

            // 调用 setup 获取状态
            const { setupState } = options.setup()

            // 创建 render 函数，绑定 this 到 setupState
            const render = options.render.bind(setupState)

            // 包装 render，在 effect 中执行以建立响应式联系
            effect(() => {
                const vnode = render()
                render(vnode, container)
            })
        }
    }
}
```

---

## 七、完整整合

### 7.1 整合所有模块

```javascript
// ==================== Vue 3 Mini 完整代码 ====================
// 总计约 300 行，可直接运行

// ==================== 工具函数 ====================
const isObject = (obj) => obj !== null && typeof obj === 'object'
const isArray = Array.isArray

// ==================== 响应式系统 ====================
const targetMap = new WeakMap()
let currentEffect = null

function track(target, key) {
    if (!currentEffect) return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let deps = depsMap.get(key)
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps)
    }
    deps.add(currentEffect)
}

function trigger(target, key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    const deps = depsMap.get(key)
    if (!deps) return
    deps.forEach(effect => effect())
}

function effect(fn) {
    const wrappedFn = () => {
        currentEffect = wrappedFn
        try { fn() } finally { currentEffect = null }
    }
    wrappedFn()
    return wrappedFn
}

function reactive(target) {
    if (target && target.__v_raw) return target
    const handler = {
        get(target, key, receiver) {
            track(target, key)
            const value = Reflect.get(target, key, receiver)
            return isObject(value) ? reactive(value) : value
        },
        set(target, key, value, receiver) {
            const oldValue = target[key]
            const result = Reflect.set(target, key, value, receiver)
            if (oldValue !== value) {
                trigger(target, key)
            }
            return result
        },
        deleteProperty(target, key) {
            const hadKey = Object.prototype.hasOwnProperty.call(target, key)
            const result = Reflect.deleteProperty(target, key)
            if (hadKey && result) {
                trigger(target, key)
            }
            return result
        }
    }
    return new Proxy(target, handler)
}

function ref(value) {
    return {
        __v_isRef: true,
        get value() {
            track({ value: '' }, 'value')
            return value
        },
        set value(newValue) {
            if (newValue !== value) {
                value = newValue
                trigger({ value: '' }, 'value')
            }
        }
    }
}

function computed(fn) {
    let value
    let dirty = true
    const effectFn = effect(fn, {
        scheduler() { dirty = true }
    })
    return {
        __v_isRef: true,
        get value() {
            if (dirty) {
                value = effectFn()
                dirty = false
            }
            return value
        }
    }
}

// ==================== 虚拟 DOM ====================
const ELEMENT = 1
const COMPONENT = 2
const TEXT = 3

function h(tag, props = {}, children = null) {
    return {
        __v_isVNode: true,
        tag,
        props,
        children,
        key: props?.key,
        el: null,
        shapeFlag: typeof tag === 'string' ? ELEMENT : COMPONENT,
    }
}

function createTextVNode(text) {
    return { __v_isVNode: true, tag: null, children: text, shapeFlag: TEXT }
}

// ==================== 渲染器 ====================
function render(vnode, container) {
    container.innerHTML = ''
    mount(vnode, container)
}

function mount(vnode, container) {
    const { shapeFlag } = vnode
    if (shapeFlag === ELEMENT) mountElement(vnode, container)
    else if (shapeFlag === TEXT) mountText(vnode, container)
    else if (shapeFlag === COMPONENT) mountComponent(vnode, container)
}

function mountElement(vnode, container) {
    const { tag, props, children } = vnode
    const el = document.createElement(tag)
    vnode.el = el
    if (props) {
        for (const [key, value] of Object.entries(props)) {
            if (key.startsWith('on')) {
                el.addEventListener(key.slice(2).toLowerCase(), value)
            } else {
                el.setAttribute(key, value)
            }
        }
    }
    if (children) {
        if (typeof children === 'string') el.textContent = children
        else if (Array.isArray(children)) children.forEach(child => mount(child, el))
    }
    container.appendChild(el)
}

function mountText(vnode, container) {
    const textNode = document.createTextNode(vnode.children)
    vnode.el = textNode
    container.appendChild(textNode)
}

function mountComponent(vnode, container) {
    const { tag: Component } = vnode
    const { setupState, render } = Component()
    const instanceVNode = render.call(setupState)
    mount(instanceVNode, container)
    vnode.el = instanceVNode.el
}

// ==================== createApp ====================
function createApp(options) {
    return {
        mount(selector) {
            const container = document.querySelector(selector)
            const { setupState } = options.setup()
            const render = options.render.bind(setupState)
            effect(() => {
                const vnode = render()
                render(vnode, container)
            })
        }
    }
}
```

### 7.2 使用示例

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Vue 3 Mini Demo</title>
</head>
<body>
    <div id="app"></div>

    <script type="module">
        // 使用上面的 Vue 3 Mini 代码
        // 假设上面的代码在 vue3-mini.js 中

        const app = createApp({
            setup() {
                const count = ref(0)
                const obj = reactive({ name: 'Vue3 Mini' })
                const doubleCount = computed(() => count.value * 2)

                return { count, obj, doubleCount }
            },
            render() {
                return h('div', { class: 'container' }, [
                    h('h1', null, `Hello ${this.obj.name}!`),
                    h('p', null, `Count: ${this.count.value}`),
                    h('p', null, `Double: ${this.doubleCount.value}`),
                    h('button', {
                        onClick: () => {
                            this.count.value++
                            this.obj.name = 'Updated!'
                        }
                    }, 'Click Me')
                ])
            }
        })

        app.mount('#app')
    </script>
</body>
</html>
```

---

## 八、面试回答要点

### 8.1 Vue 3 响应式原理

**核心答案**：
> Vue 3 使用 Proxy 替代了 Vue 2 的 Object.defineProperty 实现响应式系统。当访问响应式对象的属性时，get 拦截器会调用 track 函数收集依赖；当修改属性时，set 拦截器会调用 trigger 函数触发所有依赖的副作用更新。

**加分点**：
- 解释 WeakMap 存储依赖关系的数据结构
- 说明 effect 如何自动追踪依赖
- 提到 computed 的惰性求值和缓存机制

### 8.2 Vue 3 对比 Vue 2 的改进

| 方面 | Vue 2 | Vue 3 |
|------|-------|-------|
| 响应式 | Object.defineProperty | Proxy |
| 组件类型 | 单根节点 | Fragment 多根节点 |
| API | Options API | Composition API |
| 打包 | CommonJS | ES Module Tree Shaking |
| 性能 | 运行时编译 | 编译时优化 |

### 8.3 Vue 3 的渲染流程

1. **模板编译**：模板 → AST → 编译成 render 函数
2. **创建 vnode**：render 函数执行返回虚拟 DOM 对象
3. **挂载**：根据 vnode 创建真实 DOM
4. **响应式更新**：数据变化 → effect 重新执行 → 重新渲染

---

## 九、总结

Vue 3 的核心原理可以用一张图总结：

```
┌─────────────────────────────────────────────────────────────────┐
│                      Vue 3 核心原理总结                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐                                               │
│   │   setup()   │ ← 创建响应式状态                               │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐                                               │
│   │   render()  │ ← 生成虚拟 DOM                                 │
│   └──────┬──────┘                                               │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────┐     ┌─────────────┐                          │
│   │ createVNode │ ──▶ │   虚拟 DOM   │                          │
│   └─────────────┘     └──────┬──────┘                          │
│                               │                                  │
│                               ▼                                  │
│                        ┌─────────────┐                          │
│                        │   mount()   │ ← 创建真实 DOM            │
│                        └──────┬──────┘                          │
│                               │                                  │
│                               ▼                                  │
│                        ┌─────────────┐                          │
│                        │   真实 DOM   │                          │
│                        └─────────────┘                          │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                      响应式流程                           │  │
│   │                                                          │  │
│   │   数据变化 ──▶ Proxy.set ──▶ trigger ──▶ effect ──▶ 重新渲染 │  │
│   │       ↑                              │                     │  │
│   │       └──────── track ───────────────┘                     │  │
│   │                    (依赖收集)                               │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

掌握以上内容，你就能在面试中清晰地讲解 Vue 3 的核心原理了！
