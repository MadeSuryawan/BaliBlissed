import { Utils } from "/js/modules/utils.js";

export const DelayedService = {
    init() {
        const button = document.querySelector(".service-link-button");
        if (!button) return;

        button.addEventListener("click", (e) => {
            // Prevent default navigation immediately
            e.preventDefault();
            const targetUrl = button.href; // Get the URL from the button's href

            if (Utils.isMobileDevice()) {
                // Add a delay before navigating on mobile
                setTimeout(() => {
                    window.location.href = targetUrl; // Redirect after delay
                }, 600); // 1 second delay
                return;
            }
            // Navigate immediately on non-mobile devices
            window.location.href = targetUrl;
        });
    },
};
