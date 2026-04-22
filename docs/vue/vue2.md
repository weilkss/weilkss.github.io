# Vue2

## 1. 对于 MVVM 的理解？

MVVM 全称是 Model-View-ViewModel

**Model：** 代表数据模型，也可以在 Model 中定义数据修改和操作的业务逻辑。
**View：** 代表 UI 组件，它负责将数据模型转化成 UI 展现出来。
**ViewModel：** 监听模型数据的改变和控制视图行为、处理用户交互，简单理解就是一个同步 View 和 Model 的对象，连接 Model 和 View

在 MVVM 架构下，View 和 Model 之间并没有直接的联系，而是通过 ViewModel 进行交互，Model 和 ViewModel 之间的交互是双向的， 因此 View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上

DOMListeners 和 DataBindings 是实现双向绑定的关键。DOMListeners 监听页面所有 View 层 DOM 元素的变化，当发生变化，Model 层的数据随之变化；DataBindings 监听 Model 层的数据，当数据发生变化，View 层的 DOM 元素随之变化

## 2. 什么是 vue 生命周期？

Vue 实例从创建到销毁的过程，就是生命周期。从开始创建、初始化数据、编译模板、挂载 Dom→ 渲染、更新 → 渲染、销毁等一系列过程，称之为 Vue 的生命周期

## 3. vue 生命周期的作用是什么？

它的生命周期中有多个事件钩子，让我们在控制整个 Vue 实例的过程时更容易形成好的逻辑

## 4. vue 生命周期总共有几个阶段？

它可以总共分为 8 个阶段：`创建前/后`, `载入前/后`,`更新前/后`,`销毁前/销毁后`

## 5. 第一次页面加载会触发哪几个钩子？

`beforeCreate`, `created`, `beforeMount`, `mounted`

## 6. DOM 渲染在 哪个周期中就已经完成？

DOM 渲染在 mounted 中就已经完成了

## 7. 说说生命周期的几个钩子和作用？

-   **beforeCreate（创建前）** 在数据观测和初始化事件还未开始
-   **created（创建后）** 完成数据观测，属性和方法的运算，初始化事件，\$el 属性还没有显示出来
-   **beforeMount（载入前）** 在挂载开始之前被调用，相关的 render 函数首次被调用。实例已完成以下的配置：编译模板，把 data 里面的数据和模板生成 html。注意此时还没有挂载 html 到页面上。
-   **mounted（载入后**） 在 el 被新创建的 vm.\$el 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的 html 内容替换 el 属性指向的 DOM 对象。完成模板中的 html 渲染到 html 页面中。此过程中进行 ajax 交互。
-   **beforeUpdate（更新前）** 在数据更新之前调用，发生在虚拟 DOM 重新渲染和打补丁之前。可以在该钩子中进一步地更改状态，不会触发附加的重渲染过程。
-   **updated（更新后）** 在由于数据更改导致的虚拟 DOM 重新渲染和打补丁之后调用。调用时，组件 DOM 已经更新，所以可以执行依赖于 DOM 的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
-   **beforeDestroy（销毁前）** 在实例销毁之前调用。实例仍然完全可用。
-   **destroyed（销毁后）** 在实例销毁之后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。

## 8. Vue 实现数据双向绑定的原理?

vue2.0 实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过 `Object.defineProperty()` 来劫持各个属性的 setter、getter，在数据变动时发布消息给订阅者，触发相应监听回调

vue3.0 的话是采用 es6 `proxy` 新特性来实现数据双向绑定

vue 的数据双向绑定 将 MVVM 作为数据绑定的入口，整合 Observer，Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 的数据变化，通过 Compile 来解析编译模板指令，最终利用 watcher 搭起 observer 和 Compile 之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据 model 变更双向绑定效果

## 9. Vue 组件间的参数传递

-   **父组件传给子组件：** 子组件通过 `props` 方法接受数据
-   **子组件传给父组件：** `$emit` 方法传递参数
-   **其他组件之间** vuex

## 10. Vue 的路由实现：hash 模式 和 history 模式

**hash 模式：** 在浏览器中符号"#"，#以及#后面的字符称之为 hash，用 window.location.hash 读取
特点：hash 虽然在 URL 中，但不被包括在 HTTP 请求中；用来指导浏览器动作，对服务端安全无用，hash 不会重加载页面

**history 模式：** history 采用 HTML5 的新特性；且提供了两个新方法：`pushState()`，`replaceState()` 可以对浏览器历史记录栈进行修改，以及 `popState` 事件的监听到状态变更

## 11. vue 路由的钩子函数

首页可以控制导航跳转，beforeEach，afterEach 等，一般用于页面 title 的修改

## 12. vuex 是什么？怎么使用？哪种功能场景使用它？

只用来读取的状态集中放在 store 中； 改变状态的方式是提交 mutations，这是个同步的事物； 异步逻辑应该封装在 action 中

在 main.js 引入 store，注入。新建了一个目录 store，….. export

**场景有：** 单页应用中，组件之间的状态、音乐播放、登录状态、加入购物车

**state**

Vuex 使用单一状态树,即每个应用将仅仅包含一个 store 实例，但单一状态树和模块化并不冲突。存放的数据状态，不可以直接修改里面的数据。

**mutations**

mutations 定义的方法动态修改 Vuex 的 store 中的状态或数据。

**getters**

类似 vue 的计算属性，主要用来过滤一些数据。

**action**

actions 可以理解为通过将 mutations 里面处里数据的方法变成可异步的处理数据的方法，简单的说就是异步操作数据。view 层通过 store.dispath 来分发 action。

## 13. vue-cli 如何新增自定义指令？

**创建局部指令：** directives

```js
new Vue({
    directives: {
        fontweight: {
            inserted(el) {
                console.log("el", el);
            },
        },
    },
});
```

**创建全局指令：** directive

```js
Vue.directive("fontweight", {
    inserted(el) {
        console.log("el", el);
    },
});
```

## 14. vue 如何自定义一个过滤器？

```js
// html
<div id="app">
  <input type="text" v-model="msg" />
  {{ msg | capitalize }}
</div>

// 局部定义过滤器
new Vue({
    el: "#app",
    data: {
        msg: ''
    },
    filters: {
        capitalize: function (value) {
            //
        }
    }
})

// 全局定义过滤器
Vue.filter('capitalize', function (value) {
    //
})
```

## 15. css 只在当前组件起作用

在 style 标签中写入 scoped

## 16. v-if 和 v-show 区别

v-if 按照条件是否渲染，v-show 是 display 的 block 或 none

## 17. \$route 和 \$router 的区别

$route 是"路由信息对象"，包括 path，params，hash，query，fullPath，matched，name 等路由信息参数。而 $router 是"路由实例"对象包括了路由的跳转方法，钩子函数等

## 18. vue.js 的两个核心是什么？

数据驱动、组件系统

## 19. vue 几种常用的指令

v-for 、 v-if 、v-bind、v-on、v-show、v-else

## 20. vue 常用的修饰符？

-   **.prevent:** 提交事件不再重载页面
-   **.stop:** 阻止单击事件冒泡
-   **.self:** 当事件发生在该元素本身而不是子元素的时候会触发
-   **.capture:** 事件侦听，事件发生的时候会调用

## 21. \$attrs 和 \$listeners 的区别？

**\$attrs：**

- 包含父组件传入的非 prop 属性
- 可以通过 `inheritAttrs: false` 控制是否继承
- 配合 `$listeners` 可以实现跨级属性传递

```vue
<!-- 父组件 -->
<ChildComponent name="Vue" age="18" @click="handleClick" />

<!-- 子组件 -->
<script>
export default {
    mounted() {
        // 获取所有非 prop 属性
        console.log(this.$attrs) // { name: 'Vue', age: '18' }
        // 获取所有父组件传入的事件监听器
        console.log(this.$listeners) // { click: handleClick }
    }
}
</script>
```

## 22. mixins 是什么？如何使用？

mixins 是一种分发 Vue 组件中可复用功能的非常灵活的方式

```js
// mixin.js
export const myMixin = {
    data() {
        return {
            message: 'Hello'
        }
    },
    methods: {
        hello() {
            console.log('Hello from mixin!')
        }
    },
    mounted() {
        console.log('Mixin mounted')
    }
}

// 组件中使用
import { myMixin } from './mixin'

export default {
    mixins: [myMixin],
    mounted() {
        console.log('Component mounted')
    }
}
```

**合并规则：**

- 同名钩子函数将合并为一个数组，都会被调用
- 组件的选项会覆盖 mixins 的选项
- 值为对象的选项会被合并

## 23. 插槽是什么？有几种分类？

**插槽：** 用于组件内容分发，让父组件可以向子组件指定位置插入 html 内容

**默认插槽：**

```vue
<!-- Child.vue -->
<slot>默认内容</slot>

<!-- Parent.vue -->
<Child>这是插入的内容</Child>
```

**具名插槽：**

```vue
<!-- Child.vue -->
<div>
    <slot name="header"></slot>
    <slot name="footer"></slot>
</div>

<!-- Parent.vue -->
<Child>
    <template v-slot:header>Header</template>
    <template v-slot:footer>Footer</template>
</Child>
```

**作用域插槽：**

```vue
<!-- Child.vue -->
<slot :user="user">{{ user.name }}</slot>

<!-- Parent.vue -->
<Child>
    <template v-slot:default="slotProps">
        {{ slotProps.user.name }}
    </template>
</Child>
```

## 24. keep-alive 是什么？如何使用？

`<keep-alive>` 是 Vue 内置的抽象组件，用于缓存组件实例，避免重复创建和销毁

```vue
<keep-alive include="Home,About" exclude="Login" :max="10">
    <router-view />
</keep-alive>
```

**属性：**

- `include` - 匹配到的组件会被缓存
- `exclude` - 匹配到的组件不会被缓存
- `max` - 最大缓存数量

**生命周期变化：**

- 首次进入：`beforeMounted -> mounted`
- 再次进入：`activated`
- 离开时：`deactivated`

## 25. 动态组件是什么？

动态组件指通过 `:is` 特性来切换不同的组件

```vue
<component :is="currentComponent"></component>

<script>
export default {
    data() {
        return {
            currentComponent: 'Home'
        }
    },
    methods: {
        switchComponent(name) {
            this.currentComponent = name
        }
    }
}
</script>
```

## 26. Vue 2.7 有什么新特性？

Vue 2.7 是 Vue 2 的最后一个版本，带来了部分 Composition API 的支持

**新特性：**

- 支持 `setup` 语法糖（实验性）
- `toRef` 和 `toRefs`
- `computed` 支持 `setup` 中使用
- `watch` 和 `watchEffect` 支持
- 更好的 TypeScript 支持

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
    count.value++
}

return { count, doubled, increment }
</script>
```

## 27. Vue 响应式原理？

Vue2 采用 `Object.defineProperty` 实现响应式

```js
function defineReactive(obj, key, value) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            return value
        },
        set(newValue) {
            if (newValue !== value) {
                value = newValue
                // 通知更新
            }
        }
    })
}
```

**局限性：**

- 无法检测对象属性的添加或删除
- 无法检测数组索引和长度的变化
- 需要使用 `Vue.set` / `Vue.delete` 解决

## 28. 如何理解 Vue 的渐进式？

Vue 被设计为可以自底向上逐层应用

- **视图层** - 只使用模板和响应式数据绑定
- **组件系统** - 使用组件化管理
- **路由** - vue-router
- **状态管理** - vuex
- **构建工具** - vue-cli / vite

## 29. nextTick 的作用和原理？

nextTick 可以在 DOM 更新后延迟执行回调

```js
this.message = 'updated'
this.$nextTick(() => {
    // DOM 已经更新完成
    console.log(this.$refs.content.innerText)
})
```

**实现原理：**

- 优先使用 Promise.then
- 降级使用 MutationObserver
- 再降级使用 setTimeout

## 30. Vue 中如何实现异步组件？

```js
// 工厂函数
const AsyncComponent = () => ({
    component: import('./AsyncComponent.vue'),
    loading: LoadingComponent,
    error: ErrorComponent,
    delay: 200,
    timeout: 3000
})

export default {
    components: {
        AsyncComponent
    }
}
```

## 31. Vue 的事件总线是什么？

事件总线用于非父子组件之间的通信

```js
// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()

// 组件 A - 发送事件
import { EventBus } from './event-bus'
EventBus.$emit('message', 'Hello')

// 组件 B - 接收事件
import { EventBus } from './event-bus'
EventBus.$on('message', (msg) => {
    console.log(msg)
})

// 组件销毁时移除
EventBus.$off('message')
```

## 32. Vue 的 scoped 原理？

scoped 通过给元素添加唯一的 data 属性实现样式隔离

```vue
<style scoped>
.container {
    /*编译后*/
    /*.container[data-v-xxxx]*/
}
</style>
```

## 33. 为什么 Vue 的 data 必须是函数？

根实例的 data 可以是对象，但组件的 data 必须是函数

因为组件可能被多次实例化，如果 data 是对象，所有实例会共享同一个 data

```js
data() {
    return {
        message: 'Hello'
    }
}
```

## 34. Vue 的单向数据流？

父组件的属性可以传递给子组件，但子组件不能直接修改父组件传来的 props

```vue
<!-- 父组件 -->
<Child :count="count" @update="handleUpdate" />

<!-- 子组件 -->
props: ['count'],
methods: {
    update() {
        // 通过 $emit 通知父组件修改
        this.$emit('update', newValue)
    }
}
```

## 35. computed 和 watch 的区别？

**computed：**

- 用于计算属性
- 基于响应式依赖缓存
- 依赖不变时不重新计算

**watch：**

- 用于监听数据变化
- 不缓存值
- 适合执行异步操作

```js
computed: {
    fullName() {
        return this.firstName + ' ' + this.lastName
    }
}

watch: {
    message(newVal, oldVal) {
        console.log(`message changed from ${oldVal} to ${newVal}`)
    }
}
```

## 36. Vue 的 diff 算法原理？

Vue 的虚拟 DOM 采用同层比较的 diff 算法

**过程：**

1. 先比较同层级节点
2. 不同则删除重建
3. 相同节点比较属性
4. 相同节点比较子节点
5. 递归比较子节点

**优化策略：**

- 先头后尾比较
- 同 key 比对
- 原地复用节点

## 37. 虚拟 DOM 的优缺点？

**优点：**

- 减少直接 DOM 操作
- 跨平台能力（SSR、Weex）
- 保证性能下限

**缺点：**

- 首次渲染可能稍慢
- 极端场景下仍需手动优化

## 38. Vue 组件命名规范？

推荐使用 PascalCase 或 kebab-case

```vue
<!-- PascalCase -->
<MyComponent />

<!-- kebab-case -->
<my-component />
```

**注意：**

- 组件名不要与 HTML 元素名冲突
- 避免使用保留字

## 39. Vue 的 API 风格？

**选项式 API（Options API）：**

```js
export default {
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

**组合式 API（Vue 2.7+ / Vue 3）：**

```js
import { ref } from 'vue'

export default {
    setup() {
        const count = ref(0)
        const increment = () => count.value++

        return { count, increment }
    }
}
```

## 40. Vue 的插件机制？

插件可以添加全局功能

```js
// my-plugin.js
export default {
    install(Vue, options) {
        // 添加全局方法
        Vue.myGlobalMethod = function() {}

        // 添加全局属性
        Vue.prototype.$myPlugin = options

        // 添加指令
        Vue.directive('my-directive', {})

        // 添加混入
        Vue.mixin({})
    }
}

// main.js
import MyPlugin from './my-plugin'
Vue.use(MyPlugin, { option: 'value' })
```

## 41. Vue 的模板编译原理？

**编译过程：**

1. 解析模板生成 AST
2. 优化 AST（标记静态节点）
3. 生成渲染函数代码

```js
// 模板
<div>{{ message }}</div>

// 渲染函数
render() {
    return createElement('div', this.message)
}
```

## 42. v-model 的原理？

v-model 本质是 value 属性 + input 事件

```vue
<input v-model="message" />

<!-- 等价于 -->
<input :value="message" @input="message = $event.target.value" />
```

## 43. key 的作用是什么？

key 用于 Vue 的 diff 算法优化

- 唯一标识节点
- 辅助判断是否为相同节点
- 避免就地复用

```vue
<div v-for="item in list" :key="item.id">
    {{ item.name }}
</div>
```

## 44. Vue 的 transition 组件？

transition 用于元素或组件的过渡动画

```vue
<transition name="fade">
    <p v-if="show">Hello</p>
</transition>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
```

## 45. Vue 的 $refs 是什么？

$refs 用于获取 DOM 元素或组件实例

```vue
<template>
    <div ref="myDiv">Content</div>
    <ChildComponent ref="child" />
</template>

<script>
export default {
    mounted() {
        console.log(this.$refs.myDiv)
        console.log(this.$refs.child)
    }
}
</script>
```

## 46. Vue 的 provide / inject？

provide / inject 用于祖先组件向后代组件传值

```js
// 祖先组件
provide() {
    return {
        theme: this.theme
    }
}

// 后代组件
inject: ['theme']
```

## 47. Vue 的 $options 是什么？

$options 用于获取 Vue 实例的初始化选项

```js
export default {
    name: 'MyComponent',
    customOption: 'Hello',
    mounted() {
        console.log(this.$options.name) // MyComponent
        console.log(this.$options.customOption) // Hello
    }
}
```

## 48. Vue 的 $parent 和 $children？

- `$parent` - 访问父组件实例
- `$children` - 访问子组件实例数组

```js
// 子组件
this.$parent.emit('customEvent', data)

// 父组件
console.log(this.$children[0])
```

## 49. Vue 2 VS Vue 3 主要区别？

| 特性 | Vue2 | Vue3 |
|------|------|------|
| 响应式原理 | Object.defineProperty | Proxy |
| 生命周期 | 选项式 | 组合式（可选） |
| TypeScript | 有限支持 | 完整支持 |
| 打包体积 | 较大 | 较小 |
| 虚拟 DOM | 完整虚拟 DOM | 优化（Block tree） |
| 组合式 API | 不支持 | 支持 |
| Suspense | 不支持 | 支持 |
| Teleport | 不支持 | 支持 |

## 50. Vue2 停止维护说明？

**重要提醒：** Vue 2 于 2023 年 12 月 31 日停止维护，不再提供安全更新。

**迁移建议：**

- 推荐升级到 Vue 3
- 使用 Composition API
- 使用 Pinia 替代 Vuex
- 考虑使用 Vite 作为构建工具

**如需继续维护 Vue 2 项目：**

- 确保不暴露在公网
- 使用 Vue 2.7 获取最新特性
- 关注安全公告

**学习路线建议：**

- 有 Vue2 基础可直接学习 Vue3
- Vue3 完全兼容 Vue2 的开发模式
- 重点学习 Composition API 和新特性