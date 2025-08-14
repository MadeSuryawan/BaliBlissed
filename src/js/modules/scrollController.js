import { Utils } from "/js/modules/utils.js";
import { CONFIG } from "/js/modules/config.js";

export const ScrollController = {
    init() {
        // // Add multiple attempts to scroll to top
        // window.addEventListener("load", () => {
        //     setTimeout(() => {
        //         window.scrollTo(0, 0);
        //     }, 0);
        // });

        // document.addEventListener("DOMContentLoaded", () => {
        //     window.scrollTo(0, 0);

        //     // One more attempt after a slight delay
        //     setTimeout(() => {
        //         window.scrollTo(0, 0);
        //     }, 100);
        // });

        // Attach throttled scroll handler
        window.addEventListener(
            "scroll",
            Utils.throttle(this.handleScroll, 12),
        );
    },

    handleScroll() {
        try {
            // Header scroll effect
            const header = Utils.getElement("#header");
            if (header) {
                if (window.scrollY > CONFIG.HEADER_SCROLL_THRESHOLD) {
                    header.classList.add("scrolled");
                } else {
                    header.classList.remove("scrolled");
                }
            }

            // Parallax effect
            const heroBg = Utils.getElement(".hero-bg");
            if (heroBg) {
                const parallaxOffset = window.scrollY * CONFIG.PARALLAX_FACTOR;
                heroBg.style.transform = `translateY(${parallaxOffset}px)`;
            }

            // Home float button visibility
            const backToTop = Utils.getElement("#home-float");
            if (backToTop) {
                const scrollHeight = document.documentElement.scrollHeight;
                const clientHeight = document.documentElement.clientHeight;
                const scrollThreshold = (scrollHeight - clientHeight) * 0.7; // 70% threshold

                if (window.scrollY >= scrollThreshold) {
                    backToTop.classList.add("visible");
                } else {
                    backToTop.classList.remove("visible");
                }
            }
        } catch (error) {
            console.error("Error in scroll handler:", error);
        }
    },
};
