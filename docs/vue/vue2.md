# Vue2 基础知识

## 1. Vue2 介绍

Vue2 是 Vue.js 的第二个主要版本，于2016年10月正式发布。它是一个渐进式 JavaScript 框架，用于构建用户界面。

### Vue2 的特点

- **响应式数据绑定**：自动更新视图
- **组件系统**：可复用的组件
- **指令系统**：内置指令和自定义指令
- **虚拟 DOM**：高效的 DOM 更新
- **插件生态**：Vue Router、Vuex 等

## 2. 创建 Vue2 项目

### 使用 Vue CLI 创建

```bash
npm install -g @vue/cli
vue create my-vue2-app
cd my-vue2-app
npm run serve
```

### 使用 Vite 创建（需指定 vue2 模板）

```bash
npm create vite@latest my-vue2-app -- --template vue
cd my-vue2-app
npm install vue@2
```

## 3. 模板语法

### 插值

```html
<!-- 文本插值 -->
<span>{{ message }}</span>

<!-- HTML 插值 -->
<div v-html="rawHtml"></div>

<!-- 属性绑定 -->
<div v-bind:id="dynamicId"></div>
<div :id="dynamicId"></div>

<!-- 表达式 -->
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
```

### 指令

```html
<!-- 条件渲染 -->
<p v-if="show">Show me</p>
<p v-show="show">Show me</p>

<!-- 列表渲染 -->
<ul>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</ul>

<!-- 事件处理 -->
<button v-on:click="handleClick">Click</button>
<button @click="handleClick">Click</button>

<!-- 表单绑定 -->
<input v-model="message">

<!-- 模板 ref -->
<div ref="myDiv">Content</div>
```

## 4. 选项式 API

### 数据和方法

```javascript
export default {
  data() {
    return {
      message: 'Hello Vue',
      count: 0,
      items: []
    }
  },
  methods: {
    handleClick() {
      this.count++
    }
  }
}
```

### 计算属性

```javascript
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    },
    fullNameWithGetterSetter: {
      get() {
        return this.firstName + ' ' + this.lastName
      },
      set(newValue) {
        const names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[1]
      }
    }
  }
}
```

### 侦听器

```javascript
export default {
  data() {
    return {
      question: '',
      answer: 'I cannot answer until you ask a question!'
    }
  },
  watch: {
    question(newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  }
}
```

## 5. 生命周期钩子

### 生命周期图

```
beforeCreate  ↓
     ↓
   created  →  实例创建完成，data 和 methods 可用
     ↓
beforeMount  →  模板编译完成，即将挂载
     ↓
   mounted  →  DOM 已挂载，$el 可用
     ↓
beforeUpdate  →  数据变化，DOM 更新前
     ↓
   updated  →  DOM 更新完成
     ↓
beforeDestroy  →  实例销毁前
     ↓
  destroyed  →  实例已销毁
```

### 常用生命周期

```javascript
export default {
  beforeCreate() {
    console.log('beforeCreate')
  },
  created() {
    console.log('created')
    this.fetchData()
  },
  beforeMount() {
    console.log('beforeMount')
  },
  mounted() {
    console.log('mounted')
    this.$refs.myDiv // DOM 元素
  },
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  updated() {
    console.log('updated')
  },
  beforeDestroy() {
    console.log('beforeDestroy')
    this.cleanup()
  },
  destroyed() {
    console.log('destroyed')
  }
}
```

## 6. 组件通信

### Props 和 $emit

父组件：
```vue
<template>
  <ChildComponent
    :title="title"
    :count="count"
    @update="handleUpdate"
  />
</template>

<script>
export default {
  data() {
    return {
      title: 'Title',
      count: 0
    }
  },
  methods: {
    handleUpdate(value) {
      console.log('received:', value)
    }
  }
}
</script>
```

子组件：
```vue
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleClick() {
      this.$emit('update', 'new value')
    }
  }
}
</script>
```

### $parent 和 $children

```javascript
// 父组件
this.$children[0].parentMethod()

// 子组件
this.$parent.parentMethod()
```

### $refs

```vue
<template>
  <ChildComponent ref="childRef" />
  <div ref="divRef">Content</div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$refs.childRef)
    console.log(this.$refs.divRef)
  }
}
</script>
```

### provide 和 inject

祖先组件：
```javascript
export default {
  provide: {
    message: 'Hello from ancestor'
  }
}
```

后代组件：
```javascript
export default {
  inject: ['message'],
  mounted() {
    console.log(this.message)
  }
}
```

### 事件总线

```javascript
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()

// 发送事件
EventBus.$emit('update', data)

// 监听事件
EventBus.$on('update', (data) => {
  console.log(data)
})

// 移除监听
EventBus.$off('update')
```

## 7. 响应式原理

### Object.defineProperty

Vue2 使用 `Object.defineProperty` 实现响应式：

```javascript
function defineReactive(obj, key, value) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log(`获取 ${key}`)
      return value
    },
    set(newValue) {
      if (value === newValue) return
      console.log(`设置 ${key} 为 ${newValue}`)
      value = newValue
    }
  })
}
```

### 响应式的限制

- 无法检测对象属性的添加或删除
- 无法检测数组直接通过索引设置项
- 需要使用 `Vue.set` 或 `Vue.delete`

```javascript
import Vue from 'vue'

// 添加属性
Vue.set(this.userInfo, 'age', 18)
this.$set(this.userInfo, 'age', 18)

// 删除属性
Vue.delete(this.userInfo, 'age')
this.$delete(this.userInfo, 'age')

// 数组更新
Vue.set(this.items, index, newValue)
this.items.splice(index, 1, newValue)
```

## 8. 插槽

### 默认插槽

```vue
<!-- Child.vue -->
<div>
  <slot>默认内容</slot>
</div>

<!-- Parent.vue -->
<Child>Content</Child>
```

### 具名插槽

```vue
<!-- Child.vue -->
<div>
  <header><slot name="header"></slot></header>
  <main><slot></slot></main>
  <footer><slot name="footer"></slot></footer>
</div>

<!-- Parent.vue -->
<Child>
  <template v-slot:header>Header</template>
  <template v-slot:default>Content</template>
  <template v-slot:footer>Footer</template>
</Child>
```

### 作用域插槽

```vue
<!-- Child.vue -->
<ul>
  <li v-for="item in items" :key="item.id">
    <slot :item="item">{{ item.name }}</slot>
  </li>
</ul>

<!-- Parent.vue -->
<Child :items="items">
  <template v-slot:default="{ item }">
    {{ item.name }} - {{ item.price }}
  </template>
</Child>
```

## 9. 过滤器

```javascript
export default {
  filters: {
    capitalize(value) {
      if (!value) return ''
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    currency(value, currency = '$') {
      return currency + value.toFixed(2)
    }
  }
}
```

```html
<!-- 使用过滤器 -->
{{ message | capitalize }}
{{ price | currency }}
{{ price | currency('¥') }}
```

## 10. 自定义指令

### 全局指令

```javascript
Vue.directive('focus', {
  bind(el, binding, vnode) {
    // 指令第一次绑定到元素时调用
  },
  inserted(el, binding, vnode) {
    // 元素插入父节点时调用
    el.focus()
  },
  update(el, binding, vnode, oldVnode) {
    // 所在组件的 VNode 更新时调用
  },
  componentUpdated(el, binding, vnode, oldVnode) {
    // 所在组件的 VNode 和子 VNode 全部更新后调用
  },
  unbind(el, binding, vnode) {
    // 指令与元素解绑时调用
  }
})
```

### 局部指令

```javascript
export default {
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  }
}
```

### 指令钩子参数

- `el`: 指令绑定的元素
- `binding`: 包含以下属性的对象
  - `name`: 指令名
  - `value`: 绑定的值
  - `oldValue`: 之前的值
  - `expression`: 绑定的表达式
  - `arg`: 传给指令的参数
  - `modifiers`: 包含修饰符的对象
- `vnode`: 虚拟节点
- `oldVnode`: 之前的虚拟节点

## 11. 路由

### Vue Router 3

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

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

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
```

```javascript
// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

### 路由导航

```html
<router-link to="/">Home</router-link>
<router-link :to="{ name: 'About' }">About</router-link>
<router-view />
```

```javascript
// 编程式导航
this.$router.push('/')
this.$router.push({ name: 'About' })
this.$router.replace('/')
this.$router.go(-1)
```

### 路由守卫

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

// 全局后置守卫
router.afterEach((to, from) => {
  console.log('navigation complete')
})

// 组件内守卫
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // vm 可以访问组件实例
    })
  },
  beforeRouteUpdate(to, from, next) {
    // 路由参数变化时调用
    next()
  },
  beforeRouteLeave(to, from, next) {
    // 离开组件时调用
    next()
  }
}
```

## 12. 状态管理

### Vuex 3

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    user: null
  },
  getters: {
    doubleCount: state => state.count * 2,
    isLoggedIn: state => !!state.user
  },
  mutations: {
    increment(state) {
      state.count++
    },
    setUser(state, user) {
      state.user = user
    }
  },
  actions: {
    async fetchUser({ commit }, userId) {
      const user = await api.getUser(userId)
      commit('setUser', user)
    }
  },
  modules: {
    // 模块化
  }
})
```

```javascript
// 组件中使用
export default {
  computed: {
    count() {
      return this.$store.state.count
    },
    doubleCount() {
      return this.$store.getters.doubleCount
    }
  },
  methods: {
    increment() {
      this.$store.commit('increment')
    },
    async fetchUser() {
      this.$store.dispatch('fetchUser', 1)
    }
  }
}
```

### mapState, mapGetters, mapActions

```javascript
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['count', 'user']),
    ...mapGetters(['doubleCount'])
  },
  methods: {
    ...mapMutations(['increment']),
    ...mapActions(['fetchUser'])
  }
}
```

## 13. 过渡动画

### CSS 过渡

```html
<transition name="fade">
  <p v-if="show">Hello</p>
</transition>
```

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
```

### CSS 动画

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

### 过渡模式

```html
<!-- 多个元素切换 -->
<transition name="fade" mode="out-in">
  <component :is="currentView" />
</transition>
```

### 列表过渡

```html
<transition-group name="list">
  <li v-for="item in items" :key="item.id">{{ item }}</li>
</transition-group>
```

## 14. 混入 (Mixin)

### 基础混入

```javascript
// mixin.js
export const myMixin = {
  data() {
    return {
      message: 'Hello from mixin'
    }
  },
  created() {
    console.log('mixin created')
  },
  methods: {
    hello() {
      console.log('hello from mixin')
    }
  }
}
```

```javascript
// 使用混入
import { myMixin } from './mixin'

export default {
  mixins: [myMixin]
}
```

### 全局混入

```javascript
Vue.mixin({
  created() {
    console.log('global mixin created')
  }
})
```

### 选项合并策略

- `data`: 组件数据优先
- `methods`, `computed`: 合并，对象键冲突时组件优先
- `生命周期钩子`: 混合调用，mixin 的先调用

## 15. 实用技巧

### 异步组件

```javascript
const AsyncComponent = () => ({
  component: import('./Heavy.vue'),
  loading: LoadingComponent,
  error: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

```javascript
// 组件中
components: {
  AsyncComponent
}
```

### 模板中使用三元表达式

```html
<a :href="url" :class="{ active: isActive && !error }">
  {{ error ? 'Error' : isActive ? 'Active' : 'Inactive' }}
</a>
```

### 动态指令参数

```html
<a @[event]="handleEvent">Link</a>

<script>
export default {
  data() {
    return {
      event: 'click'
    }
  }
}
</script>
```

## 16. 性能优化

### 合理使用 v-if 和 v-show

- `v-if`: 条件不频繁时使用（不渲染 DOM）
- `v-show`: 频繁切换时使用（始终渲染，仅切换 display）

### 使用 computed 替代 methods

```javascript
// 不推荐
methods: {
  getDouble() {
    return this.count * 2
  }
}

// 推荐
computed: {
  double() {
    return this.count * 2
  }
}
```

### 使用 key 优化列表渲染

```html
<!-- 添加 key 帮助 Vue 复用已有元素 -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>
```

### 懒加载组件

```javascript
components: {
  HeavyComponent: () => import('./Heavy.vue')
}
```

## 17. TypeScript 支持

### Vue.extend

```typescript
import Vue from 'vue'

interface User {
  name: string
  age: number
}

const MyComponent = Vue.extend({
  data() {
    return {
      user: null as User | null
    }
  },
  methods: {
    updateUser(user: User) {
      this.user = user
    }
  }
})
```

### 类组件

```typescript
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
  message: string = 'Hello'
  count: number = 0

  get double(): number {
    return this.count * 2
  }

  handleClick(): void {
    this.count++
  }
}
```

## 18. 服务端渲染 (SSR)

### Nuxt.js

```bash
npx create-nuxt-app my-ssr-app
cd my-ssr-app
npm run dev
```

```javascript
// nuxt.config.js
export default {
  head: {
    title: 'My SSR App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  }
}
```

## 总结

Vue2 的核心知识点：

1. **响应式原理** - Object.defineProperty
2. **生命周期** - beforeCreate 到 destroyed
3. **组件通信** - props, $emit, $parent, $children, provide/inject
4. **路由** - Vue Router 3
5. **状态管理** - Vuex 3
6. **模板语法** - 插值、指令、过滤器
7. **过渡动画** - transition, transition-group
8. **混入** - mixin 复用逻辑
