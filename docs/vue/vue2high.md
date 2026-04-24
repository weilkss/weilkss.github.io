# Vue2 高频面试题 60 道

## 基础概念

### Q1：Vue2 的响应式原理是什么？

Vue2 使用 `Object.defineProperty` 实现响应式数据绑定：

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

### Q2：Vue2 响应式的限制有哪些？

- 无法检测对象属性的添加或删除
- 无法检测数组直接通过索引设置项
- 需要使用 `Vue.set` 或 `Vue.delete`

```javascript
// 添加属性
Vue.set(this.userInfo, 'age', 18)
this.$set(this.userInfo, 'age', 18)

// 删除属性
Vue.delete(this.userInfo, 'age')
this.$delete(this.userInfo, 'age')

// 数组更新
this.items.splice(index, 1, newValue)
```

### Q3：Vue.set 和 Vue.delete 的原理？

内部调用了 `Object.defineProperty` 重新定义属性，使其响应式：

```javascript
Vue.set = function(obj, key, val) {
  defineReactive(obj, key, val)
}
```

### Q4：什么是依赖收集？

当数据变化时，Vue 会自动更新所有依赖该数据的组件。这个过程通过"发布-订阅"模式实现：

```javascript
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}
```

### Q5：异步更新队列的原理？

Vue 为了提高性能，会将数据变化放入异步队列批量更新：

```javascript
function nextTick(callback) {
  Promise.resolve().then(callback)
}
```

### Q6：Vue2 的生命周期钩子有哪些？

- `beforeCreate`: 实例初始化
- `created`: 实例创建完成
- `beforeMount`: 挂载前
- `mounted`: 挂载完成
- `beforeUpdate`: 更新前
- `updated`: 更新完成
- `beforeDestroy`: 销毁前
- `destroyed`: 销毁完成

### Q7：beforeCreate 和 created 的区别？

| 特性 | beforeCreate | created |
|------|-------------|---------|
| data | 不可用 | 可用 |
| methods | 不可用 | 可用 |
| 模板 | 未编译 | 未编译 |
| DOM | 不可用 | 不可用 |

### Q8：beforeMount 和 mounted 的区别？

| 特性 | beforeMount | mounted |
|------|------------|--------|
| 模板 | 已编译 | 已编译 |
| DOM | 不可用 | 可用 |

### Q9：beforeDestroy 和 destroyed 的区别？

- `beforeDestroy`: 实例仍可用，清理工作
- `destroyed`: 实例已被销毁，移除所有监听

### Q10：父子组件生命周期执行顺序？

**加载渲染**：
```
父 beforeCreate → 父 created → 父 beforeMount
  → 子 beforeCreate → 子 created → 子 beforeMount → 子 mounted
→ 父 mounted
```

**更新**：
```
父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated
```

**销毁**：
```
父 beforeDestroy → 子 beforeDestroy → 子 destroyed → 父 destroyed
```

## 组件通信

### Q11：props 和 $emit 的用法？

```javascript
// 父组件
<Child :title="title" @update="handleUpdate" />

// 子组件
props: {
  title: String
},
methods: {
  handleClick() {
    this.$emit('update', 'new value')
  }
}
```

### Q12：$parent 和 $children 的用法？

```javascript
// 子组件访问父组件
this.$parent.parentMethod()

// 父组件访问子组件
this.$children[0].childMethod()
```

### Q13：$refs 的用法？

```javascript
// 组件 ref
<ChildComponent ref="childRef" />

// DOM ref
<div ref="myDiv">Content</div>

// 访问
this.$refs.childRef
this.$refs.myDiv
```

### Q14：provide 和 inject 的用法？

祖先组件：
```javascript
provide() {
  return {
    message: this.message
  }
}
```

后代组件：
```javascript
inject: ['message']
```

### Q15：事件总线的原理？

使用一个 Vue 实例作为中央事件总线：

```javascript
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()

// 监听
EventBus.$on('event', callback)

// 触发
EventBus.$emit('event', data)

// 取消监听
EventBus.$off('event', callback)
```

### Q16：v-model 的原理？

```html
<input v-model="message" />

<!-- 等价于 -->
<input :value="message" @input="message = $event.target.value" />
```

### Q17：.sync 修饰符的原理？

```html
<ChildComponent :title.sync="title" />

<!-- 等价于 -->
<ChildComponent :title="title" @update:title="title = $event" />
```

子组件：
```javascript
this.$emit('update:title', 'new value')
```

### Q18：Vue2 中的组件通信方式有哪些？

1. **props / $emit**: 父子通信
2. **$parent / $children**: 父子组件互相访问
3. **$refs**: 访问子组件或 DOM
4. **provide / inject**: 祖先向后代传值
5. **事件总线**: 任意组件通信
6. **Vuex**: 全局状态管理

### Q19：v-bind 和 v-model 的区别？

- `v-bind`: 单向数据绑定，数据流向 props
- `v-model`: 双向数据绑定，等价于 v-bind + v-on

```html
<!-- v-bind 单向 -->
<Child :value="message" />

<!-- v-model 双向 -->
<input v-model="message" />
```

### Q20：如何实现跨组件通信？

```javascript
// 方式1：事件总线
EventBus.$emit('event', data)
EventBus.$on('event', callback)

// 方式2：Vuex
this.$store.commit('mutation', data)
this.$store.dispatch('action', data)

// 方式3：provide/inject
provide('data', this.data)
inject('data')
```

## 路由

### Q21：Vue Router 的模式有哪些？

- `hash`: 使用 URL hash，如 `#/home`
- `history`: 使用 HTML5 History API，如 `/home`

```javascript
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

### Q22：router.push 和 router.replace 的区别？

- `push`: 添加新历史记录（可以后退）
- `replace`: 替换当前历史记录（不可以后退）

```javascript
router.push('/home')
router.replace('/about')
router.go(-1)
```

### Q23：路由守卫有哪些？

- 全局：`beforeEach`, `afterEach`
- 路由：`beforeEnter`
- 组件：`beforeRouteEnter`, `beforeRouteUpdate`, `beforeRouteLeave`

### Q24：beforeRouteEnter 为什么不能访问 this？

因为导航守卫触发时组件实例还没创建。可以通过回调访问：

```javascript
beforeRouteEnter(to, from, next) {
  next(vm => {
    // vm 可以访问组件实例
  })
}
```

### Q25：路由懒加载的实现？

```javascript
// 方式1：动态导入
const Home = () => import('./views/Home.vue')

// 方式2：路由中直接使用
{
  path: '/',
  component: () => import('./views/Home.vue')
}

// 方式3：Webpack magic comment
const Home = () => import(/* webpackChunkName: "home" */ './views/Home.vue')
```

### Q26：如何获取路由参数？

```javascript
// params 参数
this.$route.params.id

// query 参数
this.$route.query.name
```

### Q27：嵌套路由如何使用？

```javascript
{
  path: '/user',
  component: User,
  children: [
    {
      path: 'profile',
      component: UserProfile
    },
    {
      path: 'posts',
      component: UserPosts
    }
  ]
}
```

### Q28：导航守卫的参数有哪些？

- `to`: 目标路由对象
- `from`: 当前路由对象
- `next`: 确认导航的函数

```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    next({ name: 'Login' })
  } else {
    next()
  }
})
```

### Q29：路由元信息 meta 的用法？

```javascript
{
  path: '/admin',
  component: Admin,
  meta: { requiresAuth: true, role: 'admin' }
}

// 访问
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 检查权限
  }
  next()
})
```

### Q30：路由的滚动行为？

```javascript
const router = new VueRouter({
  routes: [...],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
```

## 状态管理

### Q31：Vuex 的核心概念？

- `state`: 状态
- `getters`: 计算属性
- `mutations`: 同步修改状态
- `actions`: 异步操作
- `modules`: 模块化

### Q32：为什么 mutations 必须是同步的？

为了方便调试和追踪状态变化。异步操作会导致 devtools 无法正确追踪。

### Q33：actions 和 mutations 的区别？

| 特性 | mutations | actions |
|------|-----------|---------|
| 同步 | 必须同步 | 可以异步 |
| 直接修改状态 | 是 | 否（通过提交 mutation） |
| 可处理副作用 | 否 | 是 |

### Q34：模块的命名空间？

```javascript
const moduleA = {
  namespaced: true,
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  }
}
```

访问：
```javascript
this.$store.commit('moduleA/increment')
this.$store.getters['moduleA/count']
```

### Q35：如何在组件中调用 Vuex？

```javascript
computed: {
  ...mapState(['count', 'user']),
  ...mapGetters(['doubleCount'])
},
methods: {
  ...mapMutations(['increment']),
  ...mapActions(['fetchUser'])
}
```

### Q36：Vuex 的辅助函数有哪些？

- `mapState`: 映射 state
- `mapGetters`: 映射 getters
- `mapMutations`: 映射 mutations
- `mapActions`: 映射 actions

```javascript
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
```

### Q37：Vuex 的严格模式？

```javascript
const store = new Vuex.Store({
  strict: true,
  // 只能通过 mutation 修改状态
})
```

### Q38：Vuex 插件如何开发？

```javascript
const myPlugin = (store) => {
  store.subscribe((mutation, state) => {
    console.log(mutation.type, mutation.payload)
  })
}

Vuex.Store({
  plugins: [myPlugin]
})
```

### Q39：Vuex 热重载如何实现？

```javascript
if (module.hot) {
  module.hot.accept(['./modules/count'], () => {
    const newCount = require('./modules/count').default
    store.hotUpdate({ modules: { count: newCount } })
  })
}
```

### Q40：Vuex 的模块化实践？

```javascript
const store = new Vuex.Store({
  modules: {
    user: userModule,
    cart: cartModule,
    order: orderModule
  },
  strict: true
})
```

## 虚拟 DOM

### Q41：虚拟 DOM 的优势？

- 减少直接 DOM 操作
- 批量更新提高性能
- 跨平台能力（SSR、Native）

### Q42：虚拟 DOM 的工作流程？

1. 数据变化
2. 生成新的虚拟 DOM
3. Diff 算法对比新旧虚拟 DOM
4. 更新必要的真实 DOM

### Q43：Diff 算法的原理？

- 同级比较，不跨级
- 同 key 的元素尽可能复用
- 类型不同则销毁重建

### Q44：key 的作用？

帮助 Vue 追踪节点，实现高效复用：

```html
<li v-for="item in items" :key="item.id">{{ item.name }}</li>
```

### Q45：为什么需要 key？

- 精准跟踪每个节点
- 高效更新虚拟 DOM
- 避免渲染错误

## 指令

### Q46：常用内置指令？

- `v-bind`: 绑定属性
- `v-on`: 绑定事件
- `v-if/v-show`: 条件渲染
- `v-for`: 列表渲染
- `v-model`: 表单绑定
- `v-slot`: 插槽
- `v-once`: 只渲染一次
- `v-html`: 解析 HTML

### Q47：v-if 和 v-show 的区别？

| 特性 | v-if | v-show |
|------|------|--------|
| 原理 | 条件渲染 | display 控制 |
| 初始渲染 | 不渲染 | 渲染 |
| 切换开销 | 高（重建） | 低（仅切换） |
| 适用场景 | 不频繁切换 | 频繁切换 |

### Q48：自定义指令的钩子？

- `bind`: 指令绑定
- `inserted`: 元素插入
- `update`: 组件更新
- `componentUpdated`: 组件和子组件更新
- `unbind`: 指令解绑

```javascript
Vue.directive('focus', {
  bind(el, binding, vnode) {
    // 指令第一次绑定到元素时调用
  },
  inserted(el, binding, vnode) {
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

### Q49：指令的 binding 对象包含哪些属性？

- `name`: 指令名
- `value`: 绑定的值
- `oldValue`: 旧值
- `expression`: 表达式
- `arg`: 参数
- `modifiers`: 修饰符对象

### Q50：v-once 和 v-memo 的区别？

- `v-once`: 只渲染一次，之后不再更新
- `v-memo`: Vue 3.2+ 新增，缓存模板子树

```html
<!-- v-once -->
<div v-once>{{ message }}</div>

<!-- v-memo -->
<div v-memo="[dependency1, dependency2]">{{ message }}</div>
```

## 插槽

### Q51：默认插槽和具名插槽？

```vue
<!-- 默认插槽 -->
<slot></slot>

<!-- 具名插槽 -->
<slot name="header"></slot>
```

```vue
<!-- 使用 -->
<Child>
  <template v-slot:default>Content</template>
  <template v-slot:header>Header</template>
</Child>
```

### Q52：作用域插槽的原理？

子组件通过 slot 传递数据给父组件：

```vue
<!-- 子组件 -->
<slot :item="item">{{ item.name }}</slot>

<!-- 父组件 -->
<Child>
  <template v-slot:default="{ item }">
    {{ item.name }}
  </template>
</Child>
```

### Q53：动态插槽名？

```vue
<slot :name="slotName"></slot>

<Child>
  <template v-slot:[dynamicName]>Content</template>
</Child>
```

### Q54：插槽的备用内容？

```vue
<!-- 子组件 -->
<slot name="header">Default Header</slot>

<!-- 如果父组件没有提供，则显示默认内容 -->
```

## 过滤器

### Q55：过滤器的用法？

```javascript
filters: {
  capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  },
  currency(value, currency = '$') {
    return currency + value.toFixed(2)
  }
}
```

```html
{{ message | capitalize }}
{{ price | currency }}
{{ price | currency('¥') }}
```

### Q56：全局过滤器和局部过滤器？

```javascript
// 全局
Vue.filter('capitalize', function(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
})

// 局部
filters: {
  capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

## 混入 (Mixin)

### Q57：Mixin 的合并策略？

- `data`: 组件数据优先
- `生命周期钩子`: 混合调用
- `methods/computed`: 合并，冲突时组件优先

### Q58：全局混入的注意事项？

全局混入会影响所有组件，通常用于插件：

```javascript
Vue.mixin({
  created() {
    console.log('global mixin')
  }
})
```

### Q59：Mixin 和 Mixin 之间的冲突？

```javascript
const mixin1 = {
  methods: {
    hello() {
      console.log('mixin1')
    }
  }
}

const mixin2 = {
  methods: {
    hello() {
      console.log('mixin2')
    }
  }
}

// 组件中
mixins: [mixin1, mixin2]
this.hello() // mixin2 优先
```

### Q60：Mixin 的使用场景？

- 逻辑复用
- 选项合并
- 插件开发

## 总结

Vue2 高频面试核心点：

1. **响应式原理** - Object.defineProperty 的限制和解决方案
2. **生命周期** - 执行顺序和父子组件通信
3. **组件通信** - props, $emit, $parent, $children, provide/inject, 事件总线
4. **Vuex** - state, getters, mutations, actions 的区别和使用
5. **Vue Router** - 路由模式、导航守卫、懒加载
6. **性能优化** - v-if/v-show, computed, key, keep-alive
