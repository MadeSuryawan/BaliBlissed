import { Utils } from "/js/modules/utils.js";
import { CONFIG } from "/js/modules/config.js";
import { ComponentLoader } from "/js/modules/componentLoader.js";
import { PaginationController } from "/js/modules/paginationController.js";
import { TestimonialsController } from "/js/modules/testimonialsController.js";
import { ContactForm } from "/js/modules/contactForm.js";
// import { Newsletter } from "/js/modules/newsLetter.js";
import { ScrollAnimation } from "/js/modules/scrollAnimation.js";
import { ScrollController } from "/js/modules/scrollController.js";
import { MapController } from "/js/modules/mapController.js";
import { DelayedService } from "/js/modules/delayedService.js";
import { ThemeController } from "/js/modules/themeController.js";
import { ContactModalController } from "/js/modules/contactModalController.js";
// import { RippleEffect } from "/js/modules/rippleEffect.js";

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

    /**
     * Asynchronously loads JSON data from a file.
     * @param {string} jsonFile - The path to the JSON file.
     * @returns {Promise<Object>} A promise that resolves to the parsed JSON object.
     */
    async function loadJsonData(jsonFile) {
        const dataDict = {};
        try {
            const response = await fetch(jsonFile);
            if (!response.ok) {
                throw new Error(`Failed to load ${jsonFile}`);
            }
            const data = await response.json();
            Object.assign(dataDict, data);
        } catch (error) {
            console.error(`Error loading JSON from ${jsonFile}:`, error);
        }
        return dataDict;
    }

    // Initialize all controllers when DOM is ready
    document.addEventListener("DOMContentLoaded", function () {
        async function initializeApp() {
            // 1. Load necessary data first (e.g., map URLs).
            const mapUrls = await loadJsonData(CONFIG.MAP_URLS);

            try {
                // Check if we need to scroll to a specific section after page load
                const sections = Utils.get_sections();
                if (sections) {
                    // Clear the stored section
                    sessionStorage.removeItem("scrollToSection");
                    sections.forEach((section) => {
                        // Wait for page to fully load, then scroll
                        setTimeout(() => {
                            const targetElement = Utils.getElement(
                                `#${section}`,
                            );
                            if (targetElement) {
                                targetElement.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }
                        }, 900);
                    });
                }
                // 2. Initialize core modules that don't depend on header/footer.
                ScrollController.init();
                DelayedService.init();
                PaginationController.init();
                TestimonialsController.init();
                // Newsletter.init();
                MapController.init(mapUrls);
                ScrollAnimation.init();

                // 4. Load shared components (header/footer) and then initialize modules that depend on them.
                await ComponentLoader.init();
                ContactForm.init();
                ThemeController.init(); // Depends on theme switcher in header/footer.
                ContactModalController.init(); // Initialize the new contact modal logic.
                // RippleEffect.init(); // Initialize the button ripple effect.
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
