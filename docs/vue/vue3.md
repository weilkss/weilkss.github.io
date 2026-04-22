# Vue3

## 1. Vue3 相比 Vue2 有哪些变化？

**Vue2 的问题：**

- 随着功能增长，组件变得越来越复杂，维护变得困难
- Vue2 对 TypeScript 的支持非常有限
- 响应式原理基于 `Object.defineProperty`，存在一些局限性

**Vue3 的改进：**

- 采用 `Proxy` 重写响应式系统，解决了 Vue2 中的响应式缺陷
- 更好的 TypeScript 支持，Vue3 本身就是用 TypeScript 编写的
- 新的组件化方案：Composition API，可以更好地组织逻辑
- 提供了 `<script setup>` 语法糖，简化组件编写
- 新增了 `Teleport`、`Suspense`、`Fragment` 等内置组件
- 虚拟 DOM 重写，编译时优化，提供了更快的渲染性能
- 更好的 Tree-shaking 支持，减少打包体积

## 2. Vue3 响应式原理是什么？

Vue3 采用 ES6 的 `Proxy` 实现响应式系统

```js
const state = new Proxy(data, {
  get(target, key) {
    track(target, key) // 收集依赖
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    Reflect.set(target, key, value)
    trigger(target, key) // 触发更新
    return true
  }
})
```

**对比 Vue2：**

- `Object.defineProperty` 需要遍历所有属性，对于新增属性需要手动 `Vue.set`
- `Proxy` 可以监听属性的增删、数组索引、长度变化等
- `Proxy` 不需要实例化，使用更简单

## 3. ref 和 reactive 的区别？

```js
// ref 用于基本类型
const count = ref(0)
console.log(count.value) // 0

// reactive 用于对象类型
const state = reactive({
  name: 'Vue3',
  count: 0
})
console.log(state.name) // Vue3
```

**主要区别：**

| 特性 | ref | reactive |
|------|-----|----------|
| 支持类型 | 基本类型和对象 | 仅对象/数组 |
| 访问方式 | 通过 `.value` | 直接访问 |
| 响应式 | 深层响应式 | 深层响应式 |
| 解构 | 支持，不会丢失响应式 | 解构会丢失响应式 |

## 4. toRef 和 toRefs 的作用？

`toRef` 用于从 reactive 对象中提取单个属性，保持响应式连接

```js
const state = reactive({
  name: 'Vue3',
  age: 25
})

const name = toRef(state, 'name')
console.log(name.value) // Vue3
name.value = 'Vue2' // 会影响到 state.name
```

`toRefs` 用于将 reactive 对象转换为普通对象，所有属性都是 ref

```js
const state = reactive({
  name: 'Vue3',
  age: 25
})

const stateRefs = toRefs(state)
// 可以解构使用，且保持响应式
const { name, age } = stateRefs
```

## 5. watch 和 watchEffect 的区别？

```js
// watch 懒执行，监听特定数据变化
watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
}, { immediate: true })

// watchEffect 立即执行，监听所有依赖
watchEffect(() => {
  console.log(`count is ${count.value}`)
})
```

**区别：**

| 特性 | watch | watchEffect |
|------|-------|-------------|
| 执行时机 | 懒执行，依赖变化时 | 立即执行 |
| 手动指定 | 需要指定监听源 | 自动收集依赖 |
| 访问旧值 | 可以 | 不可以 |

## 6. Vue3 的生命周期有哪些变化？

Vue3 提供了基于 Composition API 的生命周期钩子

```js
import {
  onMounted,
  onUpdated,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount
} from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('mounted')
    })
  }
}
```

**对应关系：**

| Vue2 | Vue3 Composition API |
|------|---------------------|
| beforeCreate | setup |
| created | setup |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeDestroy | onBeforeUnmount |
| destroyed | onUnmounted |

## 7. 什么是 Composition API？

Composition API 是一组基于函数的 API，允许我们更灵活地组织组件逻辑

```js
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    const increment = () => {
      count.value++
    }

    onMounted(() => {
      console.log('Component mounted')
    })

    return { count, doubled, increment }
  }
}
```

**优势：**

- 更好的逻辑复用，通过 composables 函数
- 更好的类型推导
- 更灵活的代码组织
- 更好的_tree-shaking 支持

## 8. setup 函数是什么？

`setup` 是 Vue3 新增的入口函数，在 `beforeCreate` 之前执行

```js
export default {
  setup() {
    // this 是 undefined
    const count = ref(0)

    // 模板中使用的变量需要 return
    return {
      count
    }
  }
}
```

**特点：**

- 在组件实例创建之前执行
- `this` 是 undefined
- 接收 `props` 和 `context` 作为参数
- 返回的数据可以在模板中使用

## 9. script setup 是什么？

`<script setup>` 是 Vue3.2 引入的语法糖，简化 Composition API 的使用

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

**优势：**

- 更简洁的代码
- 自动暴露 `setup` 返回的所有内容
- 更好的运行时性能
- 更好的 IDE 支持

## 10. computed 和 method 的区别？

```js
// computed - 有缓存，依赖不变时不重新计算
const doubled = computed(() => count.value * 2)

// method - 每次调用都会执行
const getDoubled = () => count.value * 2
```

**区别：**

- `computed` 有缓存机制，只有依赖变化时才重新计算
- `method` 没有缓存，每次调用都会执行
- `computed` 适合用于派生状态
- `method` 适合用于事件处理

## 11. Vue3 中的 provide 和 inject 是什么？

用于祖先组件向后代组件传值，不受层级限制

```js
// 祖先组件
import { provide, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    provide('count', count)
    provide('message', 'Hello')
  }
}

// 后代组件
import { inject } from 'vue'

export default {
  setup() {
    const count = inject('count')
    const message = inject('message', 'default') // 带默认值

    return { count, message }
  }
}
```

## 12. Vue3 中如何获取组件实例？

```js
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const compRef = ref(null)

    onMounted(() => {
      // 获取子组件实例
      console.log(compRef.value)
    })

    return { compRef }
  }
}
```

```vue
<template>
  <ChildComponent ref="compRef" />
</template>
```

## 13. Teleport 是什么？

`Teleport` 可以将组件的 DOM 移动到其他位置

```vue
<template>
  <Teleport to="body">
    <div class="modal">
      <h2>Modal Content</h2>
    </div>
  </Teleport>
</template>
```

**常见应用场景：**

- 模态框
- 弹出通知
- Loading 遮罩层

## 14. Suspense 是什么？

`Suspense` 用于处理异步组件的加载状态

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

## 15. Fragment 是什么？

Vue3 组件可以返回多个根节点，不再需要单一的根元素包裹

```vue
<template>
  <header>Header</header>
  <main>Content</main>
  <footer>Footer</footer>
</template>
```

## 16. Vue3 中的 v-model 如何使用？

Vue3 增强了对 `v-model` 的支持

```vue
<!-- 组件中 -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const updateValue = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input :value="props.modelValue" @input="updateValue" />
</template>
```

```vue
<!-- 使用组件 -->
<ChildComponent v-model="count" />
<!-- 等价于 -->
<ChildComponent :modelValue="count" @update:modelValue="count = $event" />
```

**多 v-model 绑定：**

```vue
<ChildComponent v-model:title="title" v-model:content="content" />
```

## 17. defineProps 和 defineEmits 如何使用？

```js
// defineProps - 定义组件 props
const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0
  }
})

// defineEmits - 定义组件事件
const emit = defineEmits(['update', 'delete'])

const handleClick = () => {
  emit('update', newValue)
}
```

## 18. Vue3 中的响应式工具有哪些？

| API | 作用 |
|-----|------|
| `isRef` | 判断是否是 ref |
| `isReactive` | 判断是否是 reactive |
| `isReadonly` | 判断是否是 readonly |
| `toRaw` | 获取原始对象 |
| `markRaw` | 标记为非响应式 |
| `shallowRef` | 浅层 ref |
| `shallowReactive` | 浅层 reactive |

## 19. shallowRef 和 ref 的区别？

```js
// ref - 深层响应式
const state = ref({ count: 0 })
state.value.count = 1 // 触发更新

// shallowRef - 浅层响应式，只监听 .value 的变化
const state = shallowRef({ count: 0 })
state.value.count = 1 // 不触发更新
state.value = { count: 1 } // 触发更新
```

## 20. readonly 和 shallowReadonly 的区别？

```js
const state = reactive({ count: 0, nested: { num: 0 } })

// readonly - 深层只读
const copy = readonly(state)
copy.count = 1 // 警告
copy.nested.num = 1 // 警告

// shallowReadonly - 浅层只读
const copy = shallowReadonly(state)
copy.count = 1 // 警告
copy.nested.num = 1 // 正常
```

## 21. Vue3 中的自定义指令是什么？

```js
const vFocus = {
  mounted: (el) => el.focus()
}

// 全局注册
app.directive('focus', vFocus)
```

```vue
<!-- 使用 -->
<input v-focus />
```

## 22. Vue3 中的 Hooks 是什么？

Hooks 是 Composition API 的一种封装，用于逻辑复用

```js
// useCount.js
import { ref, computed } from 'vue'

export function useCount() {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)

  const increment = () => count.value++
  const decrement = () => count.value--

  return { count, doubled, increment, decrement }
}
```

```js
// 组件中使用
import { useCount } from './useCount'

export default {
  setup() {
    const { count, doubled, increment, decrement } = useCount()
    return { count, doubled, increment, decrement }
  }
}
```

## 23. Vue3 中如何处理异步组件？

```js
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent({
  loader: () => import('./AsyncComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

## 24. Vue3 编译优化有哪些？

**静态提升：**

```vue
<template>
  <!-- 静态内容会被提升 -->
  <div class="static">Static Content</div>
  <!-- 动态内容 -->
  <div>{{ dynamic }}</div>
</template>
```

**属性标记：**

- 静态属性会被标记
- 动态属性会被追踪

**对比 Vue2：**

- Vue2 需要通过 `shouldComponentUpdate` 手动优化
- Vue3 自动编译优化，更少的虚拟 DOM 调用

## 25. 什么是 Tree-shaking？

Vue3 通过模块化设计，实现了更好的 Tree-shaking

**支持 Tree-shaking 的特性：**

- `computed`
- `watch`
- `transition`
- `v-model`

**不支持 Tree-shaking：**

- 始终打包的核心功能

## 26. Vue3 中的 nextTick 有什么变化？

Vue3 中 `nextTick` 的 API 保持一致，但内部实现更高效

```js
import { nextTick } from 'vue'

const updateDOM = async () => {
  // DOM 更新
  await nextTick()
  // DOM 已经更新
}
```

## 27. Vue3 中如何处理错误？

```js
import { onErrorCaptured } from 'vue'

export default {
  setup() {
    onErrorCaptured((err, instance, info) => {
      console.error('Error:', err)
      console.error('Component:', instance)
      console.error('Info:', info)
      return false // 阻止错误传播
    })
  }
}
```

## 28. Vue3 中的依赖注入有什么变化？

Vue3 提供了 `provide/inject` 的响应式版本

```js
import { provide, inject, computed } from 'vue'

// 提供
export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)

    provide('count', count)
    provide('doubled', doubled)

    return { count }
  }
}

// 注入
export default {
  setup() {
    const count = inject('count')
    const doubled = inject('doubled')

    return { count, doubled }
  }
}
```

## 29. Vue3 中的 CSS 变量支持？

```vue
<script setup>
const theme = ref('dark')
</script>

<template>
  <div class="container" :class="theme">
    <slot />
  </div>
</template>

<style>
.container {
  --theme-color: v-bind('theme');
  background: var(--theme-color);
}
</style>
```

## 30. Vue3 中如何实现全局状态管理？

**方式一：使用 Composition API**

```js
// store.js
import { reactive, readonly } from 'vue'

const state = reactive({
  count: 0
})

export function useStore() {
  const increment = () => state.count++
  return { state: readonly(state), increment }
}
```

**方式二：使用 Pinia（推荐）**

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

## 31. Vue3 中如何实现路由守卫？

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [...]
})

router.beforeEach((to, from) => {
  // 验证逻辑
  return true // 继续导航
})

router.beforeResolve(async (to) => {
  // 异步路由组件加载完成后
})

router.afterEach((to, from) => {
  // 导航完成后
})
```

## 32. Vue3 中的路由有哪些变化？

```js
// history 模式变化
import { createWebHistory } from 'vue-router'

// Vue2
// createWebHashHistory - hash 模式
// createWebHistory - history 模式

// 新增特性
const router = createRouter({
  history: createWebHistory(),
  routes: [...],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})
```

## 33. Vue3 中如何实现路由懒加载？

```js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
]
```

## 34. Vue3 中的 keep-alive 有什么变化？

```vue
<template>
  <keep-alive
    :include="['Home', 'About']"
    :exclude="['Login']"
    :max="10"
  >
    <router-view />
  </keep-alive>
</template>
```

**新增属性：**

- `max` - 最大缓存组件数量

## 35. Vue3 中如何使用 TypeScript？

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

const emit = defineEmits<{
  (e: 'update', value: number): void
}>()
</script>
```

## 36. Vue3 中如何定义异步组件？

```js
import { defineAsyncComponent } from 'vue'

// 基础用法
const AsyncComponent = defineAsyncComponent(() => import('./AsyncComponent.vue'))

// 带选项
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./AsyncComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000,
  suspensible: false
})
```

## 37. Vue3 中的 defineExpose 是什么？

`<script setup>` 中组件默认不暴露任何属性，使用 `defineExpose` 显式暴露

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++

defineExpose({
  count,
  increment
})
</script>
```

```js
// 父组件获取
const childRef = ref(null)
console.log(childRef.value.count) // 0
childRef.value.increment()
```

## 38. Vue3 中的 v-memo 是什么？

`v-memo` 用于缓存模板的子树

```vue
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.selected]">
    <ComplexContent :item="item" />
  </div>
</template>
```

**使用场景：**

- 大列表渲染
- 选择性更新

## 39. Vue3 中的性能优化有哪些？

**代码层面：**

- 使用 `v-memo` 避免不必要的更新
- 使用 `shallowRef` 减少响应式开销
- 合理使用 `computed` 缓存
- 路由懒加载

**编译优化：**

- 静态提升
- 事件监听缓存
- Block tree

**打包优化：**

- Tree-shaking
- 更好的压缩

## 40. Vue3 中如何实现组件通信？

**父子通信：**

```vue
<!-- 父组件 -->
<ChildComponent
  :title="title"
  @update="handleUpdate"
  v-model="count"
/>
```

```vue
<!-- 子组件 -->
<script setup>
defineProps(['title'])
const emit = defineEmits(['update', 'update:modelValue'])

emit('update', newValue)
emit('update:modelValue', newValue)
</script>
```

**跨级通信：**

- `provide/inject`
- `Vuex/Pinia`

## 41. Vue3 中的响应式系统如何工作？

**核心流程：**

1. **依赖收集：** 当访问响应式数据时，Proxy 的 getter 会被调用，记录当前副作用
2. **触发更新：** 当修改响应式数据时，Proxy 的 setter 会被调用，执行所有相关副作用
3. **调度执行：** 可以控制副作用的执行时机

```js
const state = reactive({ count: 0 })

effect(() => {
  console.log(state.count) // 读取，触发 getter
})

state.count++ // 修改，触发 setter，执行 effect
```

## 42. Vue3 中的 effectScope 是什么？

`effectScope` 用于组织相关的响应式副作用

```js
import { effectScope, reactive, effect } from 'vue'

const scope = effectScope()

scope.run(() => {
  const state = reactive({ count: 0 })

  effect(() => {
    console.log(state.count)
  })
})

// 销毁所有副作用
scope.stop()
```

## 43. Vue3 中如何使用 mixins？

Vue3 仍然支持 mixins，但推荐使用 Composables

```js
// mixin
export const countMixin = {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
```

**缺点：**

- 来源不明确
- 属性冲突
- 难以类型推导

## 44. Vue3 中的 render 函数有什么变化？

Vue3 的 render 函数更加简洁

```js
import { h } from 'vue'

export default {
  setup(props, { slots, attrs, emit }) {
    return () => h('div', { class: 'container' }, [
      h('h1', props.title),
      slots.default?.()
    ])
  }
}
```

## 45. Vue3 中的函数式组件有什么变化？

Vue3 中函数式组件仍然可用，但性能优势不再明显

```js
// 函数式组件
const MyComponent = (props, { slots, attrs, emit }) => {
  return h('div', props.title)
}

export default MyComponent
```

## 46. Vue3 中的编译器常量有哪些？

```vue
<script setup>
import { NEXT_VERSION } from 'vue'

console.log(VITE_APP_TITLE) // 构建时常量
</script>
```

**常用 Vite 环境变量：**

- `VITE_APP_TITLE`
- `VITE_API_URL`
- `MODE`
- `DEV`
- `PROD`

## 47. Vue3 中如何实现插件开发？

```js
// my-plugin.js
export default {
  install(app, options) {
    // 添加全局属性
    app.config.globalProperties.$myPlugin = options

    // 添加全局指令
    app.directive('my-directive', {
      mounted(el, binding) {
        el.textContent = binding.value
      }
    })

    // 添加全局组件
    app.component('MyComponent', MyComponent)

    // 添加组合式 API
    app.mixin({
      setup() {
        // ...
      }
    })
  }
}
```

```js
// main.js
import MyPlugin from './my-plugin'

app.use(MyPlugin, { option: 'value' })
```

## 48. Vue3 中的 CSS 模块化如何使用？

```vue
<style module>
.container {
  padding: 20px;
}

.title {
  font-size: 24px;
}
</style>

<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Title</h1>
  </div>
</template>
```

## 49. Vue3 中的 Transition 组件有什么变化？

```vue
<template>
  <Transition name="fade" mode="out-in">
    <component :is="currentView" />
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

**新增特性：**

- 更好的 JavaScript 钩子
- 更好的 CSS 动画支持

## 50. Vue3 项目的最佳实践？

**代码规范：**

- 使用 `<script setup>` 语法糖
- 统一使用 Composition API
- 合理拆分 composables
- 使用 TypeScript

**性能优化：**

- 路由懒加载
- 组件懒加载
- 合理使用 `shallowRef`
- 避免不必要的响应式

**项目结构：**

```
src/
├── assets/
├── components/
├── composables/
├── views/
├── router/
├── stores/
├── App.vue
└── main.ts
```

**开发建议：**

- 使用 Pinia 替代 Vuex
- 使用 Vite 作为构建工具
- 合理使用 TypeScript
- 编写单元测试