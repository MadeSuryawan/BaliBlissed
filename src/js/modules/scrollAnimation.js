export const ScrollAnimation = {
    // --- Configuration ---
    VISIBLE_CLASS: "visible", // Centralize the class name
    _observers: {},

    // Configuration dictionary for selectors and thresholds
    _config: {
        ".service-link-content": 0.6, // Trigger when 60% is visible
        "section:not(.hero)": 0.1, // Trigger when 10% is visible
        ".hero-content": 0.9, // Trigger when 90% is visible
        ".about-hero": 0.9, // Trigger when 90% is visible
    },

    // --- Private Methods ---
    /**
     * Callback function executed when observed elements intersect the viewport.
     * @param {IntersectionObserverEntry[]} entries - Array of intersection entries.
     */
    _handleIntersection(entries /*, observerInstance */) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add(this.VISIBLE_CLASS);
                // Optional: Uncomment to animate only once per element
                // observerInstance.unobserve(entry.target);
            } else {
                entry.target.classList.remove(this.VISIBLE_CLASS);
            }
        });
    },

    /**
     * Creates and initializes an IntersectionObserver instance.
     * @param {string} selector - The CSS selector for elements to observe.
     * @param {number} threshold - The visibility threshold.
     * @returns {IntersectionObserver|null} The created observer instance or null if no elements found.
     */
    _startObserver(selector, threshold) {
        // Assume document.querySelectorAll exists and returns a NodeList or Array
        const elements = document.querySelectorAll(selector);
        if (!elements || elements.length === 0) {
            return null; // No elements to observe
        }

        const options = {
            root: null, // Use the viewport as the root
            rootMargin: "0px",
            threshold: threshold,
        };

        // Bind 'this' to ensure VISIBLE_CLASS is accessible in _handleIntersection
        const observer = new IntersectionObserver(
            this._handleIntersection.bind(this),
            options
        );

        elements.forEach((el) => observer.observe(el));
        return observer;
    },

    // --- Public Methods ---
    /**
     * Initializes the scroll animation observers.
     */
    init() {
        // Skip if already initialized
        if (Object.keys(this._observers).length > 0) {
            return;
        }

        try {
            // Clear any existing observers
            this.disconnect();

            // Create observers for each config entry
            for (const [selector, threshold] of Object.entries(this._config)) {
                this._observers[selector] = this._startObserver(
                    selector,
                    threshold
                );
            }

            // Check if any observers were created
            const hasObservers = Object.values(this._observers).some(
                (observer) => observer !== null
            );
            if (!hasObservers) {
                console.log(
                    "ScrollAnimation: No elements found to observe for any selector."
                );
            }
        } catch (error) {
            console.error("Error initializing scroll animations:", error);
            this.disconnect();
        }
    },

    /**
     * Disconnects all observers and cleans up resources.
     */
    disconnect() {
        for (const selector in Object.keys(this._observers)) {
            if (this._observers[selector]) {
                this._observers[selector].disconnect();
                this._observers[selector] = null;
            }
        }
    },
};
