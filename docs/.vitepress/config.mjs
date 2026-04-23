import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Weilkss",
    description: "weilkss blog",
    outDir: "../dist",
    head: [["link", { rel: "icon", href: "/logo.svg" }]],
    themeConfig: {
        logo: "/logo.svg",
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "首页", link: "/" },
            { text: "基础", link: "/basis/css" },
            { text: "进阶", link: "/advanced/es6" },
            { text: "实现", link: "/achieve/防抖节流" },
            { text: "Vue", link: "/vue/vue3" },
            { text: "React", link: "/react/base" },
            { text: "Plugin", link: "/plugin" },
        ],
        sidebar: {
            "/basis": {
                items: [
                    {
                        text: "CSS",
                        link: "/basis/css",
                    },
                    {
                        text: "HTML",
                        link: "/basis/html",
                    },
                    {
                        text: "JavaScript",
                        link: "/basis/javascript",
                    },
                    {
                        text: "TypeScript",
                        link: "/basis/typescript",
                    },
                ],
            },
            "/advanced": {
                base: "/advanced/",
                items: [
                    {
                        text: "ES6深入",
                        link: "/es6",
                    },
                    {
                        text: "Git",
                        link: "/git",
                    },
                    {
                        text: "Node.js",
                        link: "/nodejs",
                    },
                    {
                        text: "MySQL",
                        link: "/mysql",
                    },
                    {
                        text: "PM2",
                        link: "/PM2",
                    },
                    {
                        text: "NestJS",
                        link: "/nestjs",
                    },
                    {
                        text: "Next.js",
                        link: "/nextjs",
                    },
                    {
                        text: "Webpack",
                        link: "/webpack",
                    },
                    {
                        text: "Vite",
                        link: "/vite",
                    },
                    {
                        text: "NPM",
                        link: "/npm",
                    },
                    {
                        text: "Monorepo",
                        link: "/monorepo",
                    },
                    {
                        text: "Docker",
                        link: "/Docker",
                    },
                    {
                        text: "性能优化",
                        link: "/性能优化",
                    },
                    {
                        text: "网络安全",
                        link: "/网络安全",
                    },
                    {
                        text: "WebSocket",
                        link: "/WebSocket",
                    },
                    {
                        text: "WebWorker",
                        link: "/WebWorker",
                    },
                    {
                        text: "SVG",
                        link: "/svg",
                    },
                    {
                        text: "Canvas",
                        link: "/canvas",
                    },
                    {
                        text: "WebGL",
                        link: "/webGL",
                    },
                    {
                        text: "WebRTC",
                        link: "/WebRTC",
                    },
                    {
                        text: "Electron",
                        link: "/electron",
                    },
                    {
                        text: "小程序",
                        link: "/小程序",
                    },
                    {
                        text: "PWA",
                        link: "/PWA",
                    },
                    {
                        text: "ReactNative",
                        link: "/reactnative",
                    },
                    {
                        text: "Taro",
                        link: "/taro",
                    },
                    {
                        text: "Qiankun",
                        link: "/qiankun",
                    },
                    {
                        text: "Single-SPA",
                        link: "/single-spa",
                    },
                    {
                        text: "Jest",
                        link: "/jest",
                    },
                    {
                        text: "Vitest",
                        link: "/vitest",
                    },
                    {
                        text: "MobX",
                        link: "/MobX",
                    },
                    {
                        text: "RESTful API",
                        link: "/RESTfulAPI",
                    },
                    {
                        text: "埋点",
                        link: "/埋点",
                    },
                ],
            },
            "/achieve": {
                items: [
                    { text: "防抖节流", link: "/achieve/防抖节流" },
                    { text: "深拷贝", link: "/achieve/深拷贝" },
                    { text: "instanceof", link: "/achieve/instanceof" },
                    { text: "reduce", link: "/achieve/reduce" },
                    { text: "数组去重", link: "/achieve/数组去重" },
                    { text: "继承方式", link: "/achieve/继承方式" },
                    { text: "数组flat实现", link: "/achieve/数组flat实现" },
                    { text: "new实现", link: "/achieve/new实现" },
                    { text: "call、apply和bind实现", link: "/achieve/apply、call、apply和bind实现实现" },
                    { text: "Promise实现", link: "/achieve/Promise实现" },
                    { text: "Promise方法实现", link: "/achieve/Promise方法实现" },
                    { text: "async-await实现", link: "/achieve/async-await实现" },
                    { text: "数组map实现", link: "/achieve/数组map实现" },
                    { text: "数组filter实现", link: "/achieve/数组filter实现" },
                    { text: "数组forEach实现", link: "/achieve/数组forEach实现" },
                    { text: "JSON.stringify实现", link: "/achieve/JSON.stringify实现" },
                    { text: "JSON.parse实现", link: "/achieve/JSON.parse实现" },
                    { text: "函数柯里化实现", link: "/achieve/函数柯里化实现" },
                    { text: "compose实现", link: "/achieve/compose实现" },
                    { text: "Object.create实现", link: "/achieve/Object.create实现" },
                    { text: "事件总线实现", link: "/achieve/事件总线实现" },
                    { text: "单例模式实现", link: "/achieve/单例模式实现" },
                    { text: "二分查找实现", link: "/achieve/二分查找实现" },
                ],
            },
            "/vue": {
                items: [
                    {
                        text: "Vue3知识",
                        link: "/vue/vue3",
                    },
                    {
                        text: "Vue2知识",
                        link: "/vue/vue2",
                    },
                    {
                        text: "手撕Vue3",
                        link: "/vue/prei3",
                    },
                    {
                        text: "手撕Vue2",
                        link: "/vue/prei2",
                    },
                ],
            },
            "/react": {
                base: "/react/",
                items: [
                    {
                        text: "基础知识",
                        link: "/base",
                    },
                    {
                        text: "高频面试",
                        link: "/high",
                    },
                    {
                        text: "手撕React",
                        link: "/mini",
                    },
                    {
                        text: "技术周边",
                        link: "/periphery",
                    },
                ],
            },
            "/plugin": {
                items: [
                    {
                        text: "前端轮子",
                        link: "/plugin/",
                    },
                ],
            },
        },
        socialLinks: [{ icon: "github", link: "https://github.com/weilkss" }],
    },
    vite: {
        publicDir: "../public",
    },
});
