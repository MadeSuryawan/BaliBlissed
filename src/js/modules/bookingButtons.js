import { Utils } from "/js/modules/utils.js";
import { openWhatsApp } from "/js/modules/openWA.js";

export const BookingButtons = {
    initializedButtons: new Set(),
    init() {
        // Track which buttons have already been initialized within this scope
        this.setBookingButtons();
    },
    setBookingButtons() {
        try {
            const bookingButtons = Utils.getElements(
                ".cta-button:not(.secondary), .whatsapp-button-modal",
            );
            if (bookingButtons.length === 0) return;

            bookingButtons.forEach((button) => {
                // Skip if this button has already been initialized
                if (this.initializedButtons.has(button)) return;

                // Mark this button as initialized
                this.initializedButtons.add(button);

                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling

                    let customMessage = null;
                    const path = window.location.pathname;
                    const isAboutPage = path.includes("/pages/about.html");

                    if (
                        button.classList.contains("cta-button") &&
                        !isAboutPage
                    ) {
                        const pageTitle = document.title.split("|")[0].trim();
                        customMessage = `Hello BaliBlissed! I'm interested in booking the ${pageTitle}. Can you provide more information?`;
                    }

                    openWhatsApp(customMessage);
                });

                // Remove any inline onclick attributes that might be causing duplicates
                button.removeAttribute("onclick");
            });
        } catch (error) {
            console.error("Error setting up booking buttons:", error);
        }
    },
};
