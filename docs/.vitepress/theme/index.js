import DefaultTheme from "vitepress/theme";
import "./style.scss";

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        if (!import.meta.env.SSR) {
            import("react-vue-loading").then((module) => {
                const RVLoading = module.default;
                app.component("RVLoading", RVLoading);
            });

            setTimeout(() => {
                const outlineContainer = document.querySelector(".aside-container");
                if (!outlineContainer) return;

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === "class") {
                            const target = mutation.target;
                            if (target.classList.contains("active")) {
                                target.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                });
                            }
                        }
                    });
                });

                const links = document.querySelectorAll(".outline-link");
                links.forEach((link) => {
                    observer.observe(link, { attributes: true });
                });

                document.querySelector(".outline-link.active")?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 500);
        }
    },
};
