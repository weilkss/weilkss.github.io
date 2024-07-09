import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "blog",
    description: "weilkss blog",
    outDir: "../dist",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: "首页", link: "/" },
            { text: "基础", link: "/basis/css" },
            { text: "进阶", link: "/advanced/es6" },
            { text: "实现", link: "/achieve/index" },
            { text: "Vue", link: "/vue/index" },
            { text: "React", link: "/react/index" },
            { text: "Plugin", link: "/plugin/vue" },
            { text: "Skill", link: "/skill/notes" },
        ],

        sidebar: {
            "/basis/": {
                items: [
                    {
                        text: "css",
                        link: "/basis/css",
                    },
                    {
                        text: "html",
                        link: "/basis/html",
                    },
                    {
                        text: "javascript",
                        link: "/basis/javascript",
                    },
                ],
            },
            "/advanced/": {
                base: "/advanced/",
                items: [
                    {
                        text: "进阶",
                        collapsed: false,
                        items: [{ text: "ES6", link: "/es6" }],
                    },
                ],
            },
            "/achieve/": {
                base: "/achieve/",
                items: [
                    {
                        text: "实现",
                        collapsed: false,
                        items: [
                            { text: "介绍", link: "/index" },
                            { text: "promise", link: "/promise" },
                        ],
                    },
                ],
            },
            "/vue/": {
                items: [
                    {
                        text: "Vue2",
                        link: "/vue/vue2",
                    },
                    {
                        text: "Vue3",
                        link: "/vue/vue3",
                    },
                ],
            },
            "/react/": {
                base: "/react/",
                items: [
                    {
                        text: "react",
                        collapsed: false,
                        items: [{ text: "介绍", link: "/index" }],
                    },
                ],
            },
            "/plugin/": {
                base: "/plugin/",
                items: [
                    {
                        text: "plugin",
                        collapsed: false,
                        link: "/vue",
                    },
                ],
            },
            "/skill/": {
                base: "/skill/",
                text: "skill",
                items: [
                    {
                        text: "简历准备",
                        link: "/notes",
                    },
                    {
                        text: "面试前的准备",
                        link: "/preparation",
                    },
                    {
                        text: "面试的注意事项",
                        link: "/matter",
                    },
                    {
                        text: "如何通过HR⾯",
                        link: "/hr",
                    },
                    {
                        text: "面试后的思考总结",
                        link: "/summarize",
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
