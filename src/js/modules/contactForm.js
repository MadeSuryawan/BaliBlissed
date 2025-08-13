import { Utils } from "/js/modules/utils.js";

export const ContactForm = {
    _lock: false, // simple debounce flag
    init() {
        this.initializeContactForm();
    },

    initializeContactForm() {
        const contactForm = Utils.getElement("#contact-form");
        if (!contactForm) return;

        this._submitBtn = contactForm.querySelector(".contact-submit-btn");
        contactForm.addEventListener("submit", this._handleSubmit.bind(this));
    },

    async _handleSubmit(e) {
        e.preventDefault();
        if (this._lock) return; // debounce
        this._lock = true;

        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);

        // trim & empty test
        const fields = ["name", "email", "message"];
        const missing = fields.filter((k) => !data[k] || !data[k].trim());
        if (missing.length) {
            this._showFieldErrors(e, missing);
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
            this._showFieldErrors(e, ["email"]);
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
            await this._postJson("/send-contact", {
                name: data.name.trim(),
                email: data.email.trim(),
                message: data.message.trim(),
                phone: (data.phone || "").trim(),
                travelers: (data.travelers || "").trim(),
                service: (data.service || "").trim(),
                dates: (data.dates || "").trim(),
            });

            e.target.reset();
            Utils.showNotification(
                "Thank you! Your message has been sent.",
                "success",
            );
        } catch (err) {
            Utils.showNotification(
                err.message || "Unable to send message.",
                "error",
            );
        } finally {
            this._setLoading(false);
            this._lock = false;
        }
    },

    // ---- helpers ----
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

    _setLoading(on) {
        const btn = this._submitBtn;
        if (!btn) return;
        btn.disabled = on;
        btn.innerHTML = on
            ? '<i class="fas fa-spinner fa-spin"></i> Sending...'
            : btn.dataset.originalText || "Send Message";
    },

    _showFieldErrors(e, badFields) {
        badFields.forEach((name) => {
            const el = e.target.elements.namedItem(name);
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
