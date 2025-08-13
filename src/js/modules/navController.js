import { Utils } from "/js/modules/utils.js";
import { CONFIG } from "/js/modules/config.js";

export const NavigationController = {
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupCrossPageNavigation();
    },

    setupMobileMenu() {
        try {
            const menuToggle = Utils.getElement(".menu-toggle");
            const mobileMenu = Utils.getElement(".mobile-menu");
            const overlay = Utils.getElement(".overlay");
            const closeBtn = Utils.getElement(".close-btn");

            if (menuToggle && mobileMenu && overlay && closeBtn) {
                menuToggle.addEventListener("click", () => {
                    mobileMenu.classList.add("active");
                    overlay.classList.add("active");
                    document.body.style.overflow = "hidden";
                });

                const closeMenu = () => {
                    mobileMenu.classList.remove("active");
                    overlay.classList.remove("active");
                    document.body.style.overflow = "";
                };

                closeBtn.addEventListener("click", closeMenu);
                overlay.addEventListener("click", closeMenu);
            }
        } catch (error) {
            console.error("Error setting up mobile menu:", error);
        }
    },

    setupCrossPageNavigation() {
        try {
            // Handle destinations links specifically
            const carCharterLink = Utils.getElement(".car-charter-link");
            const destinationLink = Utils.getElement(".destinations-link");
            const contactLink = Utils.getElement(".contact-link");

            const allLinks = [carCharterLink, destinationLink, contactLink];

            allLinks.forEach((link) => {
                link.addEventListener("click", (e) => {
                    const href = link.getAttribute("href");
                    const currentPath = window.location.pathname;
                    const isHome =
                        currentPath.endsWith("/") ||
                        currentPath.endsWith("/index.html") ||
                        currentPath.includes("/BaliBlissed/index.html");

                    // Check if we're not on the main page
                    if (!isHome && CONFIG.NAV_LINKS.includes(href)) {
                        e.preventDefault();
                        Utils.add_section(href.split("#")[1]);

                        // Navigate to the main page
                        window.location.href = href.split("#")[0];
                    } else {
                        let overlay = Utils.getElement(".scroll-overlay");
                        if (!overlay) {
                            overlay = document.createElement("div");
                            overlay.className = "scroll-overlay";
                            document.body.appendChild(overlay);
                        }
                        document.body.classList.add("overlay-active");
                        overlay.classList.remove("fade-out");
                        // start fade-out a tiny bit after paint
                        requestAnimationFrame(() => {
                            overlay.classList.add("fade-out");
                        });
                        // clean up once animation ends
                        overlay.addEventListener(
                            "transitionend",
                            () => {
                                overlay.remove();
                                document.body.classList.remove(
                                    "overlay-active",
                                );
                            },
                            { once: true },
                        );

                        // dim the page
                        // document.documentElement.classList.add("dimmed");

                        setTimeout(() => {
                            link.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                            // after scroll,

                            // remove dim
                            // document.documentElement.classList.remove(
                            //     "dimmed"
                            // );

                            // remove overlay
                            overlay.remove();
                            document.body.classList.remove("overlay-active");
                        }, 1500);
                    }
                });
            });
        } catch (error) {
            console.error("Error setting up cross-page navigation:", error);
        }
    },

    setupSmoothScrolling() {
        try {
            const mobileMenu = Utils.getElement(".mobile-menu");
            const overlay = Utils.getElement(".overlay");

            Utils.getElements('a[href^="#"]').forEach((anchor) => {
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();

                    // Close mobile menu if open
                    if (mobileMenu && overlay) {
                        mobileMenu.classList.remove("active");
                        overlay.classList.remove("active");
                        document.body.style.overflow = "";
                    }

                    const href = this.getAttribute("href");
                    if (href && href !== "#") {
                        const target = Utils.getElement(href);
                        if (target) {
                            target.scrollIntoView({
                                behavior: "smooth",
                            });
                        }
                    }
                });
            });
        } catch (error) {
            console.error("Error setting up smooth scrolling:", error);
        }
    },
};
