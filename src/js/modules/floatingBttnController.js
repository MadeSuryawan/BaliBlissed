import { Utils } from "/js/modules/utils.js";
import { CONFIG } from "/js/modules/config.js";
import { openWhatsApp } from "/js/modules/openWA.js";

export const FloatBttnsController = {
    buttonTimeouts: new Map(), // Stores timeout IDs for collapsing buttons

    init() {
        try {
            // Cache element lookups
            const floatingButtons = Array.from(
                Utils.getElements(".floating-button"),
            ); // Convert NodeList to Array
            const whatsappFloat = Utils.getElement("#whatsapp-float");

            if (floatingButtons.length === 0) {
                // console.warn("No floating buttons found.");
                return; // Exit if no buttons to manage
            }

            // Determine interaction mode once
            const isMobile = Utils.isMobileDevice();

            floatingButtons.forEach((button) => {
                this.setupButtonInteraction(button, isMobile, whatsappFloat);
            });

            // Add a single listener to the document for outside clicks/taps
            this.setupOutsideInteractionListener(isMobile);
        } catch (error) {
            console.error("Error initializing floating buttons:", error);
        }
    },

    expandButton(button) {
        // Collapse any other expanded button first
        Utils.getElements(".floating-button.expanded").forEach((btn) => {
            if (btn !== button) {
                this.collapseButton(btn);
            }
        });

        // Expand the target button if not already expanded
        if (!button.classList.contains("expanded")) {
            button.classList.add("expanded");
            this.startCollapseTimer(button, CONFIG.BUTTON_COLLAPSE_TIMEOUT);
        }
    },

    collapseButton(button) {
        if (button.classList.contains("expanded")) {
            button.classList.remove("expanded");
            this.clearCollapseTimer(button);
        }
    },

    startCollapseTimer(button, delay) {
        this.clearCollapseTimer(button); // Clear existing timer first
        const timeoutId = setTimeout(() => {
            this.collapseButton(button);
        }, delay);
        this.buttonTimeouts.set(button, timeoutId);
    },

    clearCollapseTimer(button) {
        if (this.buttonTimeouts.has(button)) {
            clearTimeout(this.buttonTimeouts.get(button));
            this.buttonTimeouts.delete(button);
        }
    },

    handleInteraction(button, event, isMobile, whatsappFloat) {
        const isExpanded = button.classList.contains("expanded");
        const isWhatsapp = button === whatsappFloat; // Direct comparison is faster

        if (isMobile) {
            // Mobile: First tap expands, second tap acts (if WhatsApp)
            event.preventDefault(); // Prevent ghost clicks and default link behavior
            if (!isExpanded) {
                this.expandButton(button);
            } else if (isWhatsapp) {
                openWhatsApp(); // Assumes this function exists globally
                this.collapseButton(button);
            }
            // Add else if for other buttons if they have mobile actions on second tap
        } else {
            // Desktop: Click always acts (if WhatsApp), hover handles expand/collapse
            if (isWhatsapp) {
                event.preventDefault(); // Prevent default link behavior for WhatsApp
                openWhatsApp();
                this.collapseButton(button); // Collapse after action
            }
        }
    },

    setupButtonInteraction(button, isMobile, whatsappFloat) {
        if (isMobile) {
            // Mobile: Use touchend for primary interaction
            button.addEventListener("touchend", (e) => {
                this.handleInteraction(button, e, true, whatsappFloat);
            });
            // No 'click' listener needed for mobile to avoid conflicts
        } else {
            // Desktop: Hover to expand/collapse, click to act
            let hoverTimer = null;
            button.addEventListener("mouseenter", () => {
                clearTimeout(hoverTimer); // Cancel pending collapse from mouseleave
                this.clearCollapseTimer(button); // Cancel auto-collapse timer
                this.expandButton(button); // Expand immediately
                // No need to set a new timer here, mouseleave handles collapse
            });

            button.addEventListener("mouseleave", () => {
                // Start timer to collapse after hover delay
                hoverTimer = setTimeout(() => {
                    this.collapseButton(button);
                }, CONFIG.HOVER_DELAY);
            });

            // Click listener specifically for actions on desktop
            button.addEventListener("click", (e) => {
                this.handleInteraction(button, e, false, whatsappFloat);
            });
        }
    },

    setupOutsideInteractionListener(isMobile) {
        const eventType = isMobile ? "touchstart" : "mousedown"; // Use appropriate event

        document.addEventListener(
            eventType,
            (e) => {
                // Check if the interaction is outside any floating button
                const clickedButton = e.target.closest(".floating-button");
                if (!clickedButton) {
                    // Find any currently expanded floating button
                    const expandedButton = document.querySelector(
                        ".floating-button.expanded",
                    );
                    if (expandedButton) {
                        this.collapseButton(expandedButton);
                    }
                }
                // If the click was ON a button, the button's own handler manages expand/collapse
            },
            { passive: isMobile },
        ); // Use passive: true only for touchstart for performance
    },
};
