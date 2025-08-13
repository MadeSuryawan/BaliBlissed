import { Utils } from "/js/modules/utils.js";

/**
 * @module ContactForm - Manages the submission logic for contact forms.
 * This module is designed to handle multiple form instances on the same page.
 * (e.g., one in the page body and one in a modal) without conflicts.
 */
export const ContactForm = {
    _lock: false, // Simple debounce flag
    _submitBtn: null, // The submit button element
    init() {
        this.initializeContactForm();
    },

    initializeContactForm() {
        const contactMain = Utils.getElement("#contact-form");
        const contactModal = Utils.getElement("#modal-contact-form");

        // Filter out null values (e.g., if the modal is not present)
        const forms = [contactMain, contactModal].filter(Boolean);

        forms.forEach((form) => {
            this._submitBtn = form.querySelector(".contact-submit-btn");
            form.addEventListener("submit", this._handleSubmit.bind(this));
        });
    },

    /**
     * Handles the entire form submission process.
     * @param {Event} e - The form submission event.
     */
    async _handleSubmit(e) {
        e.preventDefault();
        if (this._lock) return; // debounce
        this._lock = true;
        const form = e.target;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // trim & empty test
        const fields = ["name", "email", "message"];
        const missing = fields.filter((k) => !data[k] || !data[k].trim());
        if (missing.length > 0) {
            this._showFieldErrors(form, missing);
            Utils.showNotification(
                "Please fill in all required fields.",
                "error",
            );
            this._lock = false;
            return;
        }

        // email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email.trim())) {
            this._showFieldErrors(form, ["email"]);
            Utils.showNotification(
                "Please enter a valid email address.",
                "error",
            );
            this._lock = false;
            return;
        }

        // show loading state
        this._setLoading(true);

        try {
            // send data to backend
            const response = await this._postJson("/send-contact", {
                name: data.name.trim(),
                email: data.email.trim(),
                message: data.message.trim(),
                phone: (data.phone || "").trim(),
                travelers: (data.travelers || "").trim(),
                service: (data.service || "").trim(),
                dates: (data.dates || "").trim(),
            });

            form.reset();
            Utils.showNotification(
                response.message || "Thank you! Your email has been sent.",
                "success",
            );
            // If this form is inside a modal, close the modal on success.
            const modal = form.closest(".modal");
            if (modal) {
                modal.classList.remove("active");
                document.body.style.overflow = "";
            }
        } catch (err) {
            Utils.showNotification(
                err.message || "Unable to send email.",
                "error",
            );
        } finally {
            this._setLoading(false);
            this._lock = false;
        }
    },

    // ---- helpers ----
    /**
     * Sends a POST request with JSON data.
     * @param {string} url - The URL to send the request to.
     * @param {Object} payload - The data to send.
     * @returns {Promise<Object>} A promise that resolves to the response data.
     */
    async _postJson(url, payload) {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const body = await res.json();
        if (!res.ok) {
            throw new Error(body.message || "Server error");
        }
        return body;
    },

    /**
     * Toggles the loading state of the submit button.
     * @param {boolean} isLoading - Whether to show the loading state.
     */
    _setLoading(isLoading) {
        const btn = this._submitBtn;
        if (!btn) return;
        btn.disabled = isLoading;
        btn.innerHTML = isLoading
            ? '<i class="fas fa-spinner fa-spin"></i> Sending...'
            : btn.dataset.originalText || "Send Email";
    },

    /**
     * Highlights invalid fields with a red border.
     * @param {HTMLFormElement} form - The form element.
     * @param {string[]} badFields - The names of the invalid fields.
     */
    _showFieldErrors(form, badFields) {
        badFields.forEach((name) => {
            const el = form.elements.namedItem(name);
            if (!el) return;
            el.classList.add("is-invalid");
            el.addEventListener(
                "input",
                () => el.classList.remove("is-invalid"),
                { once: true },
            );
        });
    },
};
