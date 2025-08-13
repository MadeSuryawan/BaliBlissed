import { Utils } from "/js/modules/utils.js";
// import { openWhatsApp } from "/js/modules/openWA.js";

export const ContactForm = {
    init() {
        this.initializeContactForm();
    },

    initializeContactForm() {
        const contactForm = Utils.getElement("#contact-form");
        if (contactForm) {
            contactForm.addEventListener("submit", this.ContactFormSubmit);
        }
    },

    ContactFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            Utils.showNotification(
                "Please fill in all required fields.",
                "error",
            );
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            Utils.showNotification(
                "Please enter a valid email address.",
                "error",
            );
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector(".contact-submit-btn");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // const message = `Hello BaliBlissed! I'm interested in your services.

            //     Name: ${data.name}
            //     Email: ${data.email}
            //     Phone: ${data.phone || "Not provided"}
            //     Travelers: ${data.travelers || "Not specified"}
            //     Service Interest: ${data.service || "Not specified"}
            //     Travel Dates: ${data.dates || "Flexible"}
            //     Message: ${data.message}`;

            e.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            Utils.showNotification(
                "Thank you! Your message has been sent.",
                "success",
            );

            // setTimeout(() => {
            //     openWhatsApp(message);
            // }, 1000);
        }, 3000);
    },
};
