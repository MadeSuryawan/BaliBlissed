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

// Immediately Invoked Function Expression (IIFE) for initialization
(function () {
    "use strict";

    // Force scroll to top immediately
    window.scrollTo(0, 0);

    // Set scroll position in session history
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

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
            const mapUrls = await loadJsonData(CONFIG.MAP_URLS); // 1️⃣ load JSON first

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
                                `#${section}`
                            );
                            if (targetElement) {
                                targetElement.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }
                        }, 900);
                    });
                }

                // Initialize controllers that don't depend on fetched components first
                ScrollController.init();
                DelayedService.init();
                PaginationController.init();
                TestimonialsController.init();
                ContactForm.init();
                // Newsletter.init();
                MapController.init(mapUrls);
                ScrollAnimation.init();

                // Load header/footer and initialize dependent controllers
                await ComponentLoader.init();
            } catch (error) {
                console.error("Error during initialization:", error);
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
