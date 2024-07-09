# Vue2

1. ## 对于 MVVM 的理解？

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

## 7. 说说声明周期的几个钩子和作用？

-   **beforeCreate（创建前）** 在数据观测和初始化事件还未开始
-   **created（创建后）** 完成数据观测，属性和方法的运算，初始化事件，\$el 属性还没有显示出来
-   **beforeMount（载入前）** 在挂载开始之前被调用，相关的 render 函数首次被调用。实例已完成以下的配置：编译模板，把 data 里面的数据和模板生成 html。注意此时还没有挂载 html 到页面上。
-   **mounted（载入后**） 在 el 被新创建的 vm.\$el 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的 html 内容替换 el 属性指向的 DOM 对象。完成模板中的 html 渲染到 html 页面中。此过程中进行 ajax 交互。
-   **beforeUpdate（更新前）** 在数据更新之前调用，发生在虚拟 DOM 重新渲染和打补丁之前。可以在该钩子中进一步地更改状态，不会触发附加的重渲染过程。
-   **updated（更新后）** 在由于数据更改导致的虚拟 DOM 重新渲染和打补丁之后调用。调用时，组件 DOM 已经更新，所以可以执行依赖于 DOM 的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
-   **beforeDestroy（销毁前）** 在实例销毁之前调用。实例仍然完全可用。
-   **destroyed（销毁后）** 在实例销毁之后调用。调用后，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。

## 8. Vue 实现数据双向绑定的原理?

vue2.0 实现数据双向绑定主要是：采用数据劫持结合发布者-订阅者模式的方式，通过 `Object.defineProperty（）`来劫持各个属性的 setter、getter，在数据变动时发布消息给订阅者，触发相应监听回调

vue3.0 的话是采用 es6 `proxy` 新特性来实现数据双向绑定

vue 的数据双向绑定 将 MVVM 作为数据绑定的入口，整合 Observer，Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 的数据变化，通过 Compile 来解析编译模板指令，最终利用 watcher 搭起 observer 和 Compile 之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据 model 变更双向绑定效果

## 9. Vue 组件间的参数传递

-   **父组件传给子组件：** 子组件通过 `props` 方法接受数据;
-   **子组件传给父组件：** `$emit` 方法传递参数
-   **其他组件之间** vuex

## 10. Vue 的路由实现：hash 模式 和 history 模式

**hash 模式：** 在浏览器中符号“#”，#以及#后面的字符称之为 hash，用 window.location.hash 读取；
特点：hash 虽然在 URL 中，但不被包括在 HTTP 请求中；用来指导浏览器动作，对服务端安全无用，hash 不会重加载页面

**history 模式：** history 采用 HTML5 的新特性；且提供了两个新方法：`pushState()`，`replaceState()`可以对浏览器历史记录栈进行修改，以及 `popState` 事件的监听到状态变更

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
        fontweight: (el) => {
            console.log("el", el);
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
    el:"#app",
    data:{
        msg:''
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

## 17. `$route` 和 `$router` 的区别

$route是“路由信息对象”，包括path，params，hash，query，fullPath，matched，name等路由信息参数。而$router 是“路由实例”对象包括了路由的跳转方法，钩子函数等

## 18. vue.js 的两个核心是什么？

数据驱动、组件系统

## 19. vue 几种常用的指令

v-for 、 v-if 、v-bind、v-on、v-show、v-else

## 20. vue 常用的修饰符？

-   **.prevent:** 提交事件不再重载页面
-   **.stop:** 阻止单击事件冒泡
-   **.self:** 当事件发生在该元素本身而不是子元素的时候会触发
-   **.capture:** 事件侦听，事件发生的时候会调用
