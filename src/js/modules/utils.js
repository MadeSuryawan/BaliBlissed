export const Utils = {
    // Throttle function to limit execution frequency.
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    getElement(selector) {
        return document.querySelector(selector);
    },

    getElements(selector) {
        return document.querySelectorAll(selector);
    },

    isMobileDevice() {
        // Check if the primary input mechanism supports touch points.
        const hasTouch =
            "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;

        // You could also combine with a width check if needed for other styling,
        // but for interaction consistency on touch devices, this is often sufficient.
        // const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
        // return hasTouch || isSmallScreen;

        // For ensuring the two-tap interaction on touch devices regardless of width:
        return hasTouch;
    },

    add_section(section) {
        // const secStr = JSON.parse(
        //     sessionStorage.getItem("scrollToSection") || "",
        // );
        // arr.push(section);
        // sessionStorage.setItem("scrollToSection", JSON.stringify(arr));
        sessionStorage.setItem("scrollToSection", section);
    },

    get_section() {
        return sessionStorage.getItem("scrollToSection");
    },

    showNotification(message, type = "info") {
        // Remove existing notifications if any exist in the DOM.
        const notifs = Utils.getElements(".notification");
        notifs.forEach((notif) => notif.remove());

        // Create notification element.
        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${
                    type === "success"
                        ? "fa-check-circle"
                        : type === "error"
                          ? "fa-exclamation-circle"
                          : "fa-info-circle"
                }"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles.
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${
                type === "success"
                    ? "#4CAF50"
                    : type === "error"
                      ? "#f44336"
                      : "#2196F3"
            };
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add to page.
        document.body.appendChild(notification);

        // Close button functionality.
        const closeBtn = notification.querySelector(".notification-close");
        closeBtn.addEventListener("click", () => notification.remove());

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    },

    isHome() {
        const path = window.location.pathname;
        return (
            path === "/" ||
            path === "/index.html" ||
            (path.endsWith("/index.html") &&
                (path.match(/\//g) || []).length <= 1)
        );
    },

    /**
     * Asynchronously loads JSON data from a file.
     * @param {string} jsonFile - The path to the JSON file.
     * @returns {Promise<Object>} A promise that resolves to the parsed JSON object.
     */
    async loadJsonData(jsonFile) {
        try {
            const response = await fetch(jsonFile, {
                headers: { Accept: "application/json" },
            });
            if (!response.ok) {
                const errMssg = `Failed to load ${jsonFile}: ${response.status} ${response.statusText}`;
                throw new Error(errMssg);
            }
            const contentType = response.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                const errMssg = `Unexpected content type for ${jsonFile}: ${contentType}`;
                throw new Error(errMssg);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading JSON from ${jsonFile}:`, error);
            return null;
        }
    },

    scrollToSection(section) {
        // Validate input
        if (typeof section !== "string" || !section.trim()) return;

        const doScroll = () => {
            // Normalize the selector to handle inputs that may already include a leading '#',
            // to avoid invalid selectors like '##id'. This is a safeguard.
            const selector = section.startsWith("#") ? section : `#${section}`;
            const targetElement = Utils.getElement(selector);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
                sessionStorage.removeItem("scrollToSection");
            }
        };
        if (
            document.readyState === "complete" ||
            document.readyState === "interactive"
        ) {
            requestAnimationFrame(doScroll);
        } else {
            window.addEventListener("DOMContentLoaded", doScroll, {
                once: true,
            });
        }
    },
};
