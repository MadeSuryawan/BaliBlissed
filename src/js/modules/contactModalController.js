import { Utils } from "/js/modules/utils.js";

/**
 * @module ContactModalController - Manages the behavior of the contact form modal.
 * This controller ensures that on any page OTHER than the homepage,
 * clicking a "Contact" link opens a modal instead of navigating.
 */
export const ContactModalController = {
    init() {
        const path = window.location.pathname;
        // Determine if we are on the main page.
        // This is a more robust check for the homepage.
        // It ensures that only the root index.html is considered the homepage.
        const isHomePage =
            path === "/" ||
            (path.endsWith("/index.html") &&
                (path.match(/\//g) || []).length <= 1);

        // If we are on the homepage, do nothing. The default scroll behavior is correct.
        if (isHomePage) {
            return;
        }

        // If we are on any other page, set up the modal.
        this.setupModalTriggers();
    },

    /**
     * Finds all contact links and attaches event listeners to open the modal.
     */
    setupModalTriggers() {
        try {
            // Select all elements that should open the contact modal.
            const contactLinks = Utils.getElements(".contact-link");
            const modal = Utils.getElement("#contact-modal");
            const closeButton = Utils.getElement("#contact-modal-close");
            const overlay = modal; // The modal background itself acts as the overlay.

            // If essential elements are missing, exit gracefully.
            if (!modal || !closeButton || contactLinks.length === 0) {
                return;
            }

            const openModal = (e) => {
                e.preventDefault(); // Prevent the link from navigating.
                modal.classList.add("active");
                document.body.style.overflow = "hidden"; // Prevent background scrolling.
            };

            const closeModal = () => {
                modal.classList.remove("active");
                document.body.style.overflow = ""; // Restore background scrolling.
            };

            // Attach event listeners.
            contactLinks.forEach((link) =>
                link.addEventListener("click", openModal),
            );
            closeButton.addEventListener("click", closeModal);
            overlay.addEventListener("click", (e) => {
                // Close only if the click is on the overlay itself, not the content.
                if (e.target === overlay) {
                    closeModal();
                }
            });
            // Close modal with Escape key
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && modal.classList.contains("active")) {
                    closeModal();
                }
            });
        } catch (error) {
            console.error("Error setting up contact modal:", error);
        }
    },
};
