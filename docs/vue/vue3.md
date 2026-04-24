# Vue3 基础知识

## 1. Vue3 介绍

Vue3 是 Vue.js 的最新主要版本，于2020年9月正式发布。它带来了全新的响应式系统、更好的 TypeScript 支持、更小的体积和更快的性能。

### Vue3 与 Vue2 的主要区别

| 特性 | Vue2 | Vue3 |
|------|------|------|
| 响应式系统 | Object.defineProperty | Proxy |
| 初始化方式 | new Vue() | createApp() |
| Composition API | 不支持 | 支持 |
| TypeScript 支持 | 有限 | 完整支持 |
| 打包体积 | 较大 | 减小约 30% |
| 虚拟 DOM | 基于 VNode | 基于 Block tree |

## 2. 创建 Vue3 项目

### 使用 Vite 创建

```bash
npm create vite@latest my-vue3-app -- --template vue
cd my-vue3-app
npm install
npm run dev
```

### 使用 Vue CLI 创建

```bash
npm install -g @vue/cli
vue create my-vue3-app
cd my-vue3-app
npm run serve
```

## 3. Composition API

Composition API 是 Vue3 最核心的更新，它提供了更灵活的方式来组织组件逻辑。

### setup() 函数

setup() 是 Composition API 的入口点，在组件实例创建之前执行。

```vue
<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

// 响应式数据
const count = ref(0)
const state = reactive({
  name: 'Vue3',
  version: '3.x'
})

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
function increment() {
  count.value++
}

// 监听器
watch(count, (newVal, oldVal) => {
  console.log(`count 从 ${oldVal} 变为 ${newVal}`)
})

// 生命周期钩子
onMounted(() => {
  console.log('组件已挂载')
})

// 暴露给模板
return {
  count,
  state,
  doubleCount,
  increment
}
</script>
```

### ref 和 reactive

- `ref`: 用于创建基本类型的响应式数据，访问时需要 `.value`
- `reactive`: 用于创建对象类型的响应式数据，直接访问属性

```javascript
import { ref, reactive } from 'vue'

// ref 用于基本类型
const count = ref(0)
console.log(count.value) // 0

// reactive 用于对象
const state = reactive({
  name: 'Vue3',
  items: [1, 2, 3]
})
console.log(state.name) // Vue3
```

### toRefs 和 toRef

将响应式对象的每个属性转换为 ref。

```javascript
import { reactive, toRefs, toRef } from 'vue'

const state = reactive({
  name: 'Vue3',
  version: '3.0'
})

// toRefs 转换整个对象
const { name, version } = toRefs(state)

// toRef 转换单个属性
const nameRef = toRef(state, 'name')
```

### computed 计算属性

```javascript
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => { count.value = val - 1 }
})
```

### watch 监听器

```javascript
import { ref, watch } from 'vue'

const count = ref(0)

// 监听单个 ref
watch(count, (newVal, oldVal) => {
  console.log(`count: ${oldVal} -> ${newVal}`)
})

// 监听多个 ref
const count1 = ref(0)
const count2 = ref(0)
watch([count1, count2], ([new1, new2], [old1, old2]) => {
  console.log(`count1: ${old1} -> ${new1}, count2: ${old2} -> ${new2}`)
})

// 深度监听
const obj = ref({ deep: { nested: 'value' } })
watch(obj, (newVal) => console.log('obj changed'), { deep: true })
```

### watchEffect 立即执行监听

```javascript
import { ref, watchEffect } from 'vue'

const count = ref(0)
const message = ref('')

watchEffect(() => {
  // 立即执行，追踪 count.value 变化
  message.value = `count is ${count.value}`
})
```

## 4. 生命周期钩子

### Vue3 生命周期图

```
setup()
  ↓
onBeforeMount()
  ↓
onMounted()
  ↓
onBeforeUpdate()
  ↓
onUpdated()
  ↓
onBeforeUnmount()
  ↓
onUnmounted()
```

### 常用生命周期钩子

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
```

| Vue2 生命周期 | Vue3 生命周期 | 说明 |
|-------------|--------------|------|
| beforeCreate | setup() | 实例创建前 |
| created | setup() | 实例创建后 |
| beforeMount | onBeforeMount | 挂载前 |
| mounted | onMounted | 挂载后 |
| beforeUpdate | onBeforeUpdate | 更新前 |
| updated | onUpdated | 更新后 |
| beforeDestroy | onBeforeUnmount | 销毁前 |
| destroyed | onUnmounted | 销毁后 |

## 5. 组件通信

### Props 和 Emits

```vue
<!-- Child.vue -->
<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update', 'delete'])

function handleClick() {
  emit('update', 'new value')
}
</script>
```

```vue
<!-- Parent.vue -->
<script setup>
import Child from './Child.vue'

function handleUpdate(value) {
  console.log('received:', value)
}
</script>

<template>
  <Child
    title="标题"
    :count="10"
    @update="handleUpdate"
  />
</template>
```

### provide 和 inject

用于祖先组件向后代组件传递数据。

```javascript
// 祖先组件
import { provide, ref } from 'vue'

const count = ref(0)
provide('count', count)
provide('message', 'Hello from ancestor')
```

```javascript
// 后代组件
import { inject } from 'vue'

const count = inject('count')
const message = inject('message', 'default value')
```

### v-model

```vue
<!-- 组件支持 -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function updateValue(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <input :value="props.modelValue" @input="updateValue" />
</template>
```

```vue
<!-- 使用 -->
<script setup>
import { ref } from 'vue'
const searchQuery = ref('')
</script>

<template>
  <MyInput v-model="searchQuery" />
</template>
```

## 6. 响应式系统原理

### Proxy 响应式原理

Vue3 使用 Proxy 替代了 Vue2 的 Object.defineProperty。

```javascript
const target = { name: 'Vue3' }

const handler = {
  get(target, key, receiver) {
    console.log(`获取 ${key}`)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log(`设置 ${key} 为 ${value}`)
    return Reflect.set(target, key, value, receiver)
  },
  deleteProperty(target, key) {
    console.log(`删除 ${key}`)
    return Reflect.deleteProperty(target, key)
  }
}

const proxy = new Proxy(target, handler)
```

### reactive 实现

```javascript
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
      return true
    }
  })
}
```

### ref 实现

```javascript
function ref(value) {
  return {
    get value() {
      track(ref, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(ref, 'value')
    }
  }
}
```

## 7. 新的组件

### Fragment

Vue3 组件可以拥有多个根元素。

```vue
<template>
  <header>Header</header>
  <main>Content</main>
  <footer>Footer</footer>
</template>
```

### Teleport

将组件内容传送到指定 DOM 节点。

```vue
<teleport to="body">
  <div class="modal">Modal Content</div>
</teleport>

<teleport to="#portal-target">
  <component />
</teleport>
```

### Suspense

用于异步组件加载状态。

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

## 8. TypeScript 支持

### 定义组件 Props

```typescript
import { defineProps, PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  title: string
  author: string
  year?: number
  books?: Book[]
}>()
```

### 泛型组件

```vue
<script setup lang="ts">
defineProps<{
  items: T[]
  selected: T
}>()

defineEmits<{
  (e: 'select', item: T): void
}>()
</script>
```

## 9. 常用 Composition API 工具

### nextTick

等待 DOM 更新后再执行。

```javascript
import { ref, nextTick } from 'vue'

const count = ref(0)

async function increment() {
  count.value++
  await nextTick()
  console.log('DOM 已更新')
}
```

### markRaw

标记对象为非响应式。

```javascript
import { reactive, markRaw } from 'vue'

const obj = { name: 'raw object' }
const state = reactive({
  data: markRaw(obj)
})
```

### shallowRef 和 shallowReactive

创建浅层响应式数据。

```javascript
import { shallowRef, shallowReactive } from 'vue'

// shallowRef 只追踪 .value 的变化
const state = shallowRef({ count: 0 })

// shallowReactive 只处理对象第一层属性
const state = shallowReactive({
  count: 0,
  deep: { nested: 'value' }
})
```

### customRef

创建自定义 ref。

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

## 10. 路由和状态管理

### Vue Router 4

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./views/About.vue'),
    children: [
      {
        path: 'team',
        component: () => import('./views/Team.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

### Pinia 状态管理

```javascript
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})
```

```javascript
// 组件中使用
import { storeToRefs } from 'pinia'
import { useCounterStore } from './stores/counter'

const store = useCounterStore()
const { count, doubleCount } = storeToRefs(store)
store.increment()
</script>
```

## 11. 实用技巧

### 异步组件

```javascript
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./components/Heavy.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

### 模板引用

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

### CSS 变量

```vue
<script setup>
const theme = {
  primary: '#42b983',
  fontSize: '16px'
}
</script>

<template>
  <div class="card" :style="theme">
    Content
  </div>
</template>

<style scoped>
.card {
  color: var(--primary);
  font-size: var(--fontSize);
}
</style>
```

## 12. 性能优化

### 使用 computed 替代 methods

```javascript
// 不推荐 - 每次调用都会执行
const getDouble = () => count.value * 2

// 推荐 - 缓存结果，只有依赖变化时重新计算
const double = computed(() => count.value * 2)
```

### 合理使用 shallowRef

```javascript
// 大数据列表使用 shallowRef
const largeList = shallowRef([])

function updateList() {
  // 替换整个数组，触发更新
  largeList.value = generateNewList()
}
```

### 使用 keep-alive 缓存组件

```vue
<template>
  <keep-alive include="Home,About" :max="10">
    <component :is="currentComponent" />
  </keep-alive>
</template>
```

## 总结

Vue3 带来了许多新特性和改进：

1. **更强大的响应式系统** - 基于 Proxy，性能更好
2. **Composition API** - 更好的逻辑复用和类型推断
3. **更好的 TypeScript 支持** - 完整的类型支持
4. **更小的体积** - 更好的 tree-shaking
5. **新的组件** - Fragment、Teleport、Suspense
6. **更好的性能** - 虚拟 DOM 优化，编译时优化

这些特性使得 Vue3 成为构建现代 Vue 应用的更好的选择。
