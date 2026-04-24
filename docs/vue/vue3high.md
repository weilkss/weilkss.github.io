# Vue3 高频面试题 60 道

## 基础概念

### Q1：Vue3 相比 Vue2 有哪些重大改进？

Vue3 是 Vue.js 的重大版本升级，带来了许多革命性的变化：

**响应式系统升级**：
- Vue2 使用 `Object.defineProperty`
- Vue3 使用 `Proxy`，性能更好，功能更强

**Composition API**：
- 更好的逻辑复用
- 更灵活的代码组织
- 更好的 TypeScript 支持

**新特性**：
- Fragment（多根节点组件）
- Teleport（传送门）
- Suspense（异步加载）
- 自动播放/暂停的响应式

**性能提升**：
- 编译时优化（静态提升、PatchFlag）
- 打包体积减小约 30%
- 更好的 Tree Shaking

**其他**：
- 更好的自定义渲染器
- 新的 CSS 变量支持
- `<script setup>` 语法糖

### Q2：Vue3 的响应式原理是什么？

Vue3 使用 `Proxy` 替代了 `Object.defineProperty`：

```javascript
const proxy = new Proxy(target, {
  get(target, key, receiver) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return result
  },
  deleteProperty(target, key) {
    const result = Reflect.deleteProperty(target, key)
    trigger(target, key)
    return result
  }
})
```

**优势**：
- 可以检测对象属性的添加和删除
- 支持 `Map`、`Set`、`WeakMap`、`WeakSet`
- 性能更好，初始化时不需要遍历
- 可以监听数组下标变化

### Q3：ref 和 reactive 的区别是什么？

| 特性 | ref | reactive |
|------|-----|----------|
| 适用类型 | 基本类型 | 对象/数组 |
| 访问方式 | `.value` | 直接访问 |
| 重新赋值 | 支持 | 不支持（需替换整个对象） |
| 解构丢失响应式 | 会 | 不会 |
| 转换 | `toRef` | `toRefs` |

```javascript
import { ref, reactive } from 'vue'

// ref 用于基本类型
const count = ref(0)
count.value++

// reactive 用于对象
const state = reactive({
  name: 'Vue3',
  items: []
})
state.name = 'New Name'
```

### Q4：shallowRef 和 ref 的区别？

- `ref`: 深层追踪变化
- `shallowRef`: 只追踪 `.value` 的变化

```javascript
const state = ref({ count: 0 })
state.value.count++ // 触发更新

const shallowState = shallowRef({ count: 0 })
shallowState.value.count++ // 不触发更新
shallowState.value = { count: 1 } // 触发更新
```

**使用场景**：
- `shallowRef` 适用于大数据量的列表渲染
- 需要完全替换对象时使用

### Q5：toRef 和 toRefs 的作用是什么？

将响应式对象的属性转换为 ref，保持响应式连接：

```javascript
const state = reactive({
  name: 'Vue3',
  version: '3.0'
})

// toRef 转换单个属性
const name = toRef(state, 'name')

// toRefs 转换整个对象
const { name, version } = toRefs(state)
```

**区别**：
- `toRef`: 创建一个 ref，保持与源对象的连接
- `toRefs`: 将对象的所有属性转换为 ref

### Q6：markRaw 的作用和使用场景？

标记一个对象为非响应式，用于性能优化：

```javascript
import { reactive, markRaw } from 'vue'

const rawObj = { name: 'raw' }
const state = reactive({
  data: markRaw(rawObj)
})
```

**使用场景**：
- 第三方库不需要响应式
- 大数据列表不需要追踪
- 静态配置对象

### Q7：computed 和 watch 的区别？

| 特性 | computed | watch |
|------|----------|-------|
| 用途 | 计算属性 | 监听数据变化 |
| 缓存 | 支持 | 不支持 |
| 返回值 | 必须有 | 可有可无 |
| 写法 | 自动收集依赖 | 明确指定依赖 |

```javascript
const count = ref(0)

// computed - 自动缓存
const double = computed(() => count.value * 2)

// watch - 明确监听
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} -> ${newVal}`)
})
```

### Q8：watch 和 watchEffect 的区别？

| 特性 | watch | watchEffect |
|------|-------|------------|
| 写法 | 明确指定监听目标 | 自动收集依赖 |
| 回调时机 | 依赖变化时执行 | 立即执行 |
| 获取旧值 | 支持 | 不支持 |
| 性能 | 更精确 | 可能多余执行 |

```javascript
// watch - 懒执行，需要明确指定依赖
watch(count, (newVal, oldVal) => {
  console.log('count changed')
}, { immediate: true })

// watchEffect - 立即执行，自动收集依赖
watchEffect(() => {
  console.log(`count is ${count.value}`)
})
```

### Q9：setup 函数的特点和使用方式？

setup 是 Composition API 的入口点：

```javascript
export default {
  setup(props, context) {
    // 1. this 是 undefined
    // 2. 可以返回对象或渲染函数
    // 3. 支持 async 语法

    const count = ref(0)

    // context 包含: attrs, slots, emit, expose
    const { attrs, slots, emit, expose } = context

    return {
      count
    }
  }
}
```

**执行时机**：
- 在组件实例创建之前执行
- 在 `beforeCreate` 之前执行

### Q10：setup 中如何使用 props？

通过 `defineProps` 宏（编译器宏）定义：

```javascript
// 基础用法
const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0,
    required: true
  }
})

// 使用
console.log(props.title)
```

**TypeScript 用法**：
```typescript
defineProps<{
  title: string
  count?: number
}>()
```

### Q11：setup 中的 context 包含哪些属性？

- `attrs`: 未被 props 接收的属性（等价于 Vue2 的 $attrs）
- `slots`: 插槽内容（等价于 $slots）
- `emit`: 触发事件（等价于 $emit）
- `expose`: 暴露组件属性给父组件

```javascript
setup(props, { attrs, slots, emit, expose }) {
  expose({
    open: () => console.log('opened')
  })
}
```

### Q12：如何在 setup 中使用生命周期钩子？

```javascript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered
} from 'vue'

onMounted(() => {
  console.log('mounted')
})

onBeforeUnmount(() => {
  console.log('before unmount')
})
```

**与 Vue2 对应关系**：

| Vue2 | Vue3 |
|------|------|
| beforeCreate | setup() |
| created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeDestroy | onBeforeUnmount |
| destroyed | onUnmounted |

### Q13：provide 和 inject 的用法？

用于祖先组件向后代组件传递数据：

```javascript
// 祖先组件
import { provide, ref } from 'vue'

const count = ref(0)
provide('count', count)
provide('message', 'Hello from ancestor')

// 后代组件
import { inject } from 'vue'

const count = inject('count')
const message = inject('message', 'default value')
```

**特点**：
- 非响应式，除非传递响应式数据
- 可以传递任意类型
- 支持默认值

### Q14：getCurrentInstance 的用法？

获取当前组件实例：

```javascript
import { getCurrentInstance } from 'vue'

onMounted(() => {
  const instance = getCurrentInstance()
  console.log(instance.ctx) // 组件上下文（开发环境）
  console.log(instance.proxy) // 组件代理
})
```

**注意**：Composition API 中推荐在 `onMounted` 等生命周期中使用。

### Q15：Vue3 组件可以有多少个根元素？

Vue3 支持**多个根元素**（Fragment）：

```vue
<template>
  <header>Header</header>
  <main>Content</main>
  <footer>Footer</footer>
</template>
```

**注意事项**：
- 有多个根时，需要明确 `v-if`/`v-for`
- 模板中不能使用模糊匹配
- `$attrs` 会自动传递给所有根节点

### Q16：Teleport 的作用和使用场景？

将组件内容传送到指定 DOM 节点：

```vue
<teleport to="body">
  <div class="modal">Modal Content</div>
</teleport>

<teleport to="#portal-target" :disabled="isMobile">
  <component />
</teleport>
```

**使用场景**：
- 模态框（Modal）
- 通知提示（Toast）
- 下拉菜单（Dropdown）
- 全屏加载（Loading）

### Q17：Suspense 的用法？

用于异步组件加载状态：

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>
```

**异步组件定义**：
```javascript
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./Heavy.vue'),
  loadingComponent: Loading,
  errorComponent: Error,
  delay: 200,
  timeout: 3000
})
```

### Q18：v-model 在 Vue3 中的变化？

- 默认 prop 改为 `modelValue`
- 默认事件改为 `update:modelValue`
- 支持多个 v-model

```vue
<!-- 单个 v-model -->
<UserInput v-model="name" />

<!-- 多个 v-model -->
<UserForm v-model:name="name" v-model:age="age" />
```

子组件：
```javascript
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function update(value) {
  emit('update:modelValue', value)
}
```

### Q19：defineProps 和 defineEmits 是编译器宏吗？

是的，它们是编译器宏，不需要导入：

```javascript
// 这些都是编译器宏，不需要 import
defineProps({ title: String })
defineEmits(['update', 'delete'])
defineExpose({ name: 'exposed' })
```

**编译器宏**：
- `defineProps`
- `defineEmits`
- `defineExpose`
- `defineSlots`
- `defineModel`（Vue 3.4+）

### Q20：Vue3 的事件修饰符有哪些？

- `.stop` - 阻止冒泡
- `.prevent` - 阻止默认行为
- `.self` - 仅自身
- `.capture` - 捕获模式
- `.once` - 只触发一次
- `.passive` - 被动模式

```html
<button @click.stop="handleClick">Click</button>
<form @submit.prevent="handleSubmit">...</form>
<div @scroll.passive="onScroll">...</div>
```

## 组件相关

### Q21：Vue3 中如何动态组件？

```vue
<component :is="currentComponent" />

<script setup>
import Home from './Home.vue'
import About from './About.vue'

const currentComponent = ref(Home)
</script>
```

**keep-alive 缓存**：
```vue
<keep-alive include="Home,About">
  <component :is="currentComponent" />
</keep-alive>
```

### Q22：defineExpose 的用法？

暴露组件属性给父组件：

```vue
<script setup>
defineExpose({
  name: 'Child',
  open: () => console.log('opened'),
  close: () => console.log('closed')
})
</script>
```

父组件访问：
```javascript
const childRef = ref(null)
childRef.value.open()
```

### Q23：Vue3 中如何使用 CSS 变量？

```vue
<template>
  <div :style="{ '--color': themeColor }">
    Content
  </div>
</template>

<script setup>
const themeColor = ref('#42b983')
</script>

<style scoped>
div {
  color: var(--color);
}
</style>
```

### Q24：Vue3 中的 isMounted 和 isDev 怎么用？

```javascript
import { isMounted, isDev } from 'vue'

onMounted(() => {
  if (isDev) {
    console.log('Development mode')
  }
})
```

### Q25：nextTick 的原理？

利用 Promise/MutationObserver/setImmediate/setTimeout 实现异步更新：

```javascript
import { nextTick } from 'vue'

async function update() {
  count.value++
  await nextTick()
  console.log('DOM 已更新')
}
```

## 路由

### Q26：Vue Router 4 的新特性？

- Composition API 支持
- 动态路由添加
- 命名视图改进
- 新的 history API

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [...]
})
```

### Q27：如何在 Vue3 中使用路由导航守卫？

```javascript
// 全局前置守卫
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth) {
    return { name: 'Login' }
  }
})

// 全局后置守卫
router.afterEach((to, from) => {
  console.log('navigation complete')
})

// 组件内守卫
onMounted(() => {
  const unwatch = router.beforeResolve((to, from) => {
    console.log('beforeResolve')
  })
  onUnmounted(() => unwatch())
})
```

### Q28：router.push 和 router.replace 的区别？

- `push`: 添加新历史记录（可以后退）
- `replace`: 替换当前历史记录（不可以后退）

```javascript
router.push('/home')
router.replace('/about')
router.go(-1)
```

### Q29：路由懒加载的实现方式？

```javascript
// 方式1：动态导入
const Home = () => import('./views/Home.vue')

// 方式2：路由中直接使用
{
  path: '/about',
  component: () => import('./views/About.vue')
}

// 方式3：预加载
const About = () => import(/* webpackPrefetch: true */ './views/About.vue')
```

### Q30：如何获取路由参数？

```javascript
// 组合式 API
import { useRoute } from 'vue-router'

const route = useRoute()
console.log(route.params.id)
console.log(route.query.name)

// 组件中
this.$route.params.id
this.$route.query.name
```

## 状态管理

### Q31：Pinia 相比 Vuex 的优势？

- API 更简洁
- 支持 Composition API
- 无需 mutation（同步）
- 支持 TypeScript
- 模块化更灵活
- 体积更小

### Q32：Pinia 的核心概念？

- `state`: 状态
- `getters`: 计算属性
- `actions`: 方法

```javascript
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
    user: null
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    isLoggedIn: (state) => !!state.user
  },
  actions: {
    increment() {
      this.count++
    },
    async fetchUser(id) {
      const user = await api.getUser(id)
      this.user = user
    }
  }
})
```

### Q33：如何在组件中使用 Pinia？

```javascript
import { storeToRefs } from 'pinia'
import { useStore } from './stores/counter'

export default {
  setup() {
    const store = useStore()
    const { count, doubleCount } = storeToRefs(store)
    const { increment } = store

    return {
      count,
      doubleCount,
      increment
    }
  }
}
```

### Q34：Pinia 的持久化方案？

```javascript
import { defineStore } from 'pinia'
import { persist } from 'pinia-plugin-persistedstate'

export const useStore = defineStore('main', {
  state: () => ({ count: 0 }),
  actions: { increment() { this.count++ } },
  persist: true
})
```

## 性能优化

### Q35：Vue3 有哪些性能优化？

**编译时优化**：
- 静态节点提升（HoistStatic）
- PatchFlag 减少更新
- 缓存事件处理函数（CacheHandlers）
- Block tree

**运行时优化**：
- `shallowRef` / `shallowReactive`
- `markRaw` 跳过响应式
- `v-if` vs `v-show` 合理使用
- `keep-alive` 缓存组件

**打包优化**：
- Tree shaking
-更好的代码分割
- 内联关键 CSS

### Q36：v-if 和 v-show 的选择？

| 特性 | v-if | v-show |
|------|------|--------|
| 原理 | 条件渲染 | display 控制 |
| 初始渲染 | 不渲染 | 渲染 |
| 切换开销 | 高（重建） | 低（仅切换） |
| 适用场景 | 不频繁切换 | 频繁切换 |

```html
<!-- 不频繁切换 -->
<div v-if="showModal">Modal</div>

<!-- 频繁切换 -->
<div v-show="isActive">Active Content</div>
```

### Q37：如何避免不必要的响应式转换？

```javascript
// 不推荐
const data = reactive(JSON.parse(jsonString))

// 推荐 - 使用 markRaw
const data = reactive(markRaw(JSON.parse(jsonString)))

// 推荐 - 使用 shallowRef
const data = shallowRef(JSON.parse(jsonString))
```

### Q38：computed 的性能优势？

computed 具有缓存特性，只有依赖变化时才会重新计算：

```javascript
// 不推荐 - 每次调用都执行
const getDouble = () => count.value * 2

// 推荐 - 缓存结果
const double = computed(() => count.value * 2)
```

### Q39：keep-alive 的使用方式？

```vue
<!-- 缓存指定组件 -->
<keep-alive include="Home,About">
  <component :is="currentComponent" />
</keep-alive>

<!-- 排除指定组件 -->
<keep-alive exclude="Login">
  <router-view />
</keep-alive>

<!-- 最大缓存数 -->
<keep-alive :max="10">
  <component :is="currentComponent" />
</keep-alive>
```

## TypeScript 支持

### Q40：Vue3 中 defineProps 的类型定义方式？

```typescript
// 方式1：运行时声明
defineProps({
  name: String,
  age: Number
})

// 方式2：类型声明（推荐）
defineProps<{
  name: string
  age?: number
}>()

// 方式3：带默认值
import { withDefaults } from 'vue'
withDefaults(defineProps<{
  name: string
  age?: number
}>(), {
  age: 18
})
```

### Q41：Vue3 中 defineEmits 的类型定义？

```typescript
// 方式1：对象语法（推荐）
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}>()

// 方式2：数组语法
const emit = defineEmits(['update', 'delete'])
```

### Q42：Vue3 中如何定义泛型组件？

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()

const emit = defineEmits<{
  (e: 'select', item: T): void
}>()
</script>
```

### Q43：Vue3 的 TypeScript 支持有哪些改进？

- 完整的类型推断
- 自动类型导入
- 更准确的模板类型检查
- 内置类型定义

## 虚拟 DOM

### Q44：Vue3 虚拟 DOM 的变化？

- 基于 Block tree
- 动态节点标记（PatchFlag）
- 静态提升（HoistStatic）
- 缓存事件处理（CacheHandlers）

**PatchFlag**：
```javascript
const VNode = {
  type: 'div',
  props: { id: 'app' },
  children: 'Hello',
  patchFlag: 1 // 1 = TEXT，动态文本
}
```

### Q45：nextTick 的原理？

```javascript
const callbacks = []
let pending = false

function nextTick(callback) {
  callbacks.push(callback)
  if (!pending) {
    pending = true
    Promise.resolve().then(flushCallbacks)
  }
}

function flushCallbacks() {
  pending = false
  callbacks.forEach(cb => cb())
}
```

## 高级特性

### Q46：customRef 的使用场景？

创建自定义 ref，如防抖 ref：

```javascript
import { customRef } from 'vue'

function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
```

### Q47：EffectScope 的作用？

管理响应式副作用的作用域：

```javascript
import { effectScope, ref, effect } from 'vue'

const scope = effectScope()

scope.run(() => {
  const count = ref(0)
  effect(() => console.log(count.value))
})

scope.stop()
```

### Q48：app.config.globalProperties 的用法？

添加全局属性：

```javascript
import { createApp } from 'vue'

const app = createApp(App)
app.config.globalProperties.$http = axios
app.config.globalProperties.$filters = {
  formatDate(date) {
    return new Date(date).toLocaleDateString()
  }
}
```

### Q49：app.use 的原理？

安装 Vue 插件：

```javascript
app.use(plugin, options)

// 相当于
if (typeof plugin.install === 'function') {
  plugin.install(app, options)
}
```

### Q50：renderTracked 和 renderTriggered 的用法？

调试虚拟 DOM 重新渲染：

```javascript
import { getCurrentInstance } from 'vue'

onMounted(() => {
  const instance = getCurrentInstance()

  instance.renderTracked = ({ key, target, type }) => {
    console.log('renderTracked:', key, target, type)
  }

  instance.renderTriggered = ({ key, target, type }) => {
    console.log('renderTriggered:', key, target, type)
  }
})
```

## 编译和构建

### Q51：Vite 相比 Webpack 的优势？

- 开发服务器启动更快（ESM 按需编译）
- 热更新更快
- 配置更简单
- 内置 TypeScript 和 CSS 支持
- 构建速度更快（Rollup）

### Q52：如何分析 Vue3 打包体积？

```bash
npm run build -- --mode production
npx vite-bundle-visualizer
```

### Q53：Vue3 的 Tree Shaking 优化？

Vue3 中许多 API 可以被 Tree Shaking：

```javascript
// 不会被 Tree Shaking
import { ref, reactive } from 'vue'

// 会被 Tree Shaking
import { defineAsyncComponent } from 'vue'
```

**使用编译时标志**：
```javascript
// 仅在开发环境
import { warn } from 'vue'
```

## 实用技巧

### Q54：如何强制更新组件？

```javascript
import { shallowRef } from 'vue'

const state = shallowRef({ count: 0 })

function forceUpdate() {
  state.value = { ...state.value }
}
```

### Q55：异步组件的错误处理？

```javascript
const AsyncComp = defineAsyncComponent({
  loader: () => import('./Heavy.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000,
  onError(error, retry, fail, attempts) {
    if (attempts < 3) {
      retry()
    } else {
      fail()
    }
  }
})
```

### Q56：Vue3 中的 CSS 变量穿透？

```vue
<style scoped>
:deep(.child-class) {
  color: red;
}

:slotted(.slot-class) {
  color: blue;
}

:global(.global-class) {
  color: green;
}
</style>
```

### Q57：Vue3 中的模板 ref 用法？

```vue
<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref(null)
const listRef = ref(null)

onMounted(() => {
  inputRef.value.focus()
  console.log(listRef.value.children)
})
</script>

<template>
  <input ref="inputRef" />
  <ul ref="listRef">
    <li v-for="i in 5" :key="i">{{ i }}</li>
  </ul>
</template>
```

## 进阶话题

### Q58：Vue3 的响应式系统如何实现依赖收集？

```javascript
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    const deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (depsMap) {
    const deps = depsMap.get(key)
    deps?.forEach(effect => effect())
  }
}
```

### Q59：Vue3 的 PatchFlag 优化原理？

```javascript
// 编译前
<div>{{ msg }}</div>

// 编译后
createVNode('div', {
  class: 'container'
}, [createTextVNode(msg)], PatchFlag.TEXT)
```

**PatchFlag 类型**：
- `1` = TEXT
- `2` = CLASS
- `4` = STYLE
- `8` = PROPS

### Q60：Vue3 的 Block Tree 是什么？

Block tree 是一种优化虚拟 DOM Diff 策略：

```javascript
const vnode = {
  type: 'div',
  block: true,
  dynamicChildren: [
    { type: 'span', patchFlag: 1 } // 动态节点
  ]
}
```

**优势**：
- 跳过静态节点
- 只比较动态节点
- 大幅提升 Diff 性能

## 总结

Vue3 高频面试核心点：

1. **响应式原理** - Proxy vs Object.defineProperty
2. **Composition API** - setup, ref, reactive, computed, watch
3. **新特性** - Teleport, Suspense, Fragment
4. **性能优化** - PatchFlag, Block tree, shallowRef
5. **TypeScript** - defineProps, defineEmits, 泛型组件
6. **生态** - Pinia, Vue Router 4, Vite
