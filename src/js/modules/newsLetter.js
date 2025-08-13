import { Utils } from "/js/modules/utils.js";

export const Newsletter = {
    init() {
        this.initializeNewsletterModal();
    },

    initializeNewsletterModal() {
        const newsletterForm = Utils.getElement("#newsletter-form");
        const closeBtn = Utils.getElement(".newsletter-modal-close");
        const overlay = Utils.getElement(".newsletter-modal-overlay");

        if (newsletterForm) {
            newsletterForm.addEventListener(
                "submit",
                this.handleNewsletterSubmit,
            );
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", this.closeNewsletterModal);
        }

        if (overlay) {
            overlay.addEventListener("click", this.closeNewsletterModal);
        }

        // // Show newsletter modal after 30 seconds (optional)
        // setTimeout(() => {
        //     this.showNewsletterModal(Utils.getElement("#newsletter-modal"));
        // }, 30000);
    },

    showNewsletterModal(modal) {
        if (modal) {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    },

    handleNewsletterSubmit(e) {
        e.preventDefault();

        const email = e.target.querySelector("#newsletter-email").value;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Utils.showNotification(
                "Please enter a valid email address.",
                "error",
            );
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector(".newsletter-submit-btn");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Subscribing...";
        submitBtn.disabled = true;

        // Simulate subscription (replace with actual API call)
        setTimeout(() => {
            // Reset form
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Close modal
            this.closeNewsletterModal();

            // Show success message
            Utils.showNotification(
                "Thank you for subscribing! You'll receive our latest updates and exclusive offers.",
                "success",
            );
        }, 1500);
    },

    closeNewsletterModal() {
        const modal = Utils.getElement("#newsletter-modal");
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    },
};
