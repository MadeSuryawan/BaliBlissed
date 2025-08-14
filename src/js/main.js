import { Utils } from "/js/modules/utils.js";
import { CONFIG } from "/js/modules/config.js";
import { ComponentLoader } from "/js/modules/componentLoader.js";
import { PaginationController } from "/js/modules/paginationController.js";
import { TestimonialsController } from "/js/modules/testimonialsController.js";
import { ContactForm } from "/js/modules/contactForm.js";
// import { Newsletter } from "/js/modules/newsLetter.js";
import { ScrollAnimation } from "/js/modules/scrollAnimation.js";
import { MobileMenu } from "/js/modules/mobileMenu.js";
import { ScrollController } from "/js/modules/scrollController.js";
import { MapController } from "/js/modules/mapController.js";
import { DelayedService } from "/js/modules/delayedService.js";
import { BookingButtons } from "/js/modules/bookingButtons.js";
import { FloatBttnsController } from "/js/modules/floatingBttnController.js";
import { ThemeController } from "/js/modules/themeController.js";
import { ContactModalController } from "/js/modules/contactModalController.js";
import { ModalController } from "/js/modules/modalController.js";
import { RippleEffect } from "/js/modules/rippleEffect.js";

/**
 * Main application entry point.
 * This IIFE (Immediately Invoked Function Expression) ensures our code runs
 * in its own scope and doesn't pollute the global namespace.
 */
(function () {
    "use strict";

    // Force scroll to top on page load to prevent inconsistent browser behavior.
    window.scrollTo(0, 0);

    // Manually control scroll restoration to handle cross-page anchor links.
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    document.addEventListener("DOMContentLoaded", function () {
        async function initializeApp() {
            // 1. Load necessary data first (e.g., map URLs).
            const mapUrls = await (
                typeof CONFIG !== "undefined" && CONFIG.MAP_URLS
                    ? Utils.loadJsonData(CONFIG.MAP_URLS)
                    : Promise.resolve({})
            ).catch((err) => {
                console.error("Failed to load map URLs:", err);
                return {};
            });

            try {
                // 2. Initialize core modules that don't depend on header/footer.
                ScrollController.init();
                DelayedService.init();
                PaginationController.init();
                TestimonialsController.init();
                // Newsletter.init();
                RippleEffect.init();
                MapController.init(mapUrls);
                ScrollAnimation.init();

                // 3. Load shared components (header/footer) and then initialize modules that depend on them.
                await ComponentLoader.init();

                // 4. Initialize independent modules in parallel; failures won't block others
                await Promise.allSettled([
                    Promise.resolve().then(() => ThemeController.init()),
                    Promise.resolve().then(() => MobileMenu.init()),
                    Promise.resolve().then(() => BookingButtons.init()),
                    Promise.resolve().then(() => FloatBttnsController.init()),
                    Promise.resolve().then(() => ModalController.init()),
                    Promise.resolve().then(() => ContactModalController.init()),
                    Promise.resolve().then(() => ContactForm.init()),
                ]);

                // 5. Check if we need to scroll to a specific section after page load
                const section = Utils.get_section();
                if (section) Utils.scrollToSection(section);
            } catch (error) {
                console.error(
                    "Error during application initialization:",
                    error,
                );
            }
        }

        initializeApp();
    });

    // Add CSS for notifications
    if (document.querySelector("#notification-styles")) return;

    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
})();
