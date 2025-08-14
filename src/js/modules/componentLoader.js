import { Utils } from "/js/modules/utils.js";
import { CONFIG } from "/js/modules/config.js";

/**
 * ComponentLoader
 *
 * Dynamically loads shared layout components such as the header and footer into
 * placeholder elements that exist in each page's HTML (e.g., #header-placeholder,
 * #footer-placeholder). This enables a single source of truth for common UI
 * components while allowing content pages to remain lightweight.
 *
 * Key behaviors:
 * - Discovers placeholders in the current document and fetches the corresponding
 *   HTML includes from the root of the site (respecting <base href> if present).
 * - Adds a cache-busting query parameter to the request to prevent stale content
 *   during development (harmless in production as most CDNs ignore unknown params).
 * - Applies a 6s abort timeout to avoid hanging fetches.
 * - Emits a `component:loaded` CustomEvent after injecting each component, with
 *   the component name and its DOM element in the detail payload.
 * - When the current page is a nested route (a "subpage"), normalizes relative
 *   links and image sources inside the injected components so they resolve from
 *   the correct absolute base path.
 *
 * Dependencies:
 * - Utils: DOM helpers and section navigation utilities.
 * - CONFIG: Site-wide configuration constants (e.g., TO_HOME for in-page
 *   anchors on the homepage).
 */
export const ComponentLoader = {
    /**
     * Initialize the component loader.
     *
     * Orchestrates the loading of all supported components (currently header and
     * footer) and waits for completion.
     *
     * @returns {Promise<void>} A promise that resolves once component loading has completed.
     */
    async init() {
        // Load all components in parallel and wait for them to finish.
        await this.loadComponents();
        this.setupSmoothScrolling();
    },

    /**
     * Load and inject supported components into their placeholders.
     *
     * Resolves the correct base path for fetching include files by inspecting the
     * document's <base href> (if present) and the current location. Fetches each
     * include with a cache-busting query string, injects the HTML into the
     * corresponding placeholder, adjusts internal resource paths when needed, and
     * emits a `component:loaded` event per component.
     *
     * @returns {Promise<HTMLElement[]>} A list of placeholder elements that were successfully populated.
     */
    async loadComponents() {
        // Compute an absolute root path using the <base href> tag when present; fall back to '/'.
        // Using URL(..., origin) ensures we always end up with an absolute URL string.
        const rootPath = new URL(
            document.querySelector("base[href]")?.getAttribute("href") || "/",
            window.location.origin,
        ).href;

        // Discover placeholders present on the page (header/footer may be optional on some pages).
        const hPlaceholder = Utils.getElement("#header-placeholder");
        const fPlaceholder = Utils.getElement("#footer-placeholder");
        const placeHolders = [hPlaceholder, fPlaceholder].filter(Boolean);

        // Map placeholder id to include file name under /includes.
        const includeMap = {
            "header-placeholder": "header",
            "footer-placeholder": "footer",
        };
        const cacheBuster = CONFIG.BUILD_VERSION || String(Date.now());

        // Fetch and inject all components concurrently; do not fail the whole flow if one fails.
        const results = await Promise.allSettled(
            placeHolders.map(async (placeHolder) => {
                const include = includeMap[placeHolder.id] ?? null;
                if (!include) return null;

                // Abort fetch if it takes longer than 6 seconds to avoid hanging.
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout
                try {
                    // Build the include URL and add a cache buster parameter.
                    const url = new URL(`includes/${include}.html`, rootPath);
                    url.searchParams.set("v", cacheBuster);

                    const response = await fetch(url, {
                        signal: controller.signal,
                    });

                    if (!response.ok) {
                        throw new Error(
                            `Failed to load ${include}: ${response.status} ${response.statusText}`,
                        );
                    }

                    const data = await response.text();

                    // Inject the component markup into the placeholder container.
                    placeHolder.innerHTML = data;

                    // On nested pages, normalize internal links and images to absolute paths.
                    this.sectionToHome(placeHolder, rootPath);

                    // Notify listeners that a specific component has been loaded and injected.
                    // Consumers can listen: document.addEventListener('component:loaded', (e) => { ... })
                    document.dispatchEvent(
                        new CustomEvent("component:loaded", {
                            detail: { name: include, element: placeHolder },
                            bubbles: true,
                            composed: true,
                        }),
                    );
                    return placeHolder;
                } catch (error) {
                    if (error && error.name === "AbortError") {
                        console.warn(
                            `Loading ${include} aborted after timeout`,
                        );
                    } else {
                        console.error(`Error loading ${include}:`, error);
                    }
                    return null; // don't block other includes
                } finally {
                    // Clear the timeout to prevent unnecessary aborts.
                    clearTimeout(timeoutId);
                }
            }),
        );

        // Return only the successfully fulfilled placeholder elements.
        return results
            .filter((r) => r.status === "fulfilled" && r.value)
            .map((r) => r.value);
    },

    sectionToHome(placeHolder, basePath) {
        if (Utils.isHome()) return;

        // Select only local navigation links
        const links = placeHolder.querySelectorAll(
            ".navigation a, .mobile-menu a",
        );
        links.forEach((link) => {
            const href = link.getAttribute("href");

            // For links that point to sections on the homepage (e.g., #destinations)
            if (!CONFIG.TO_HOME.includes(href)) return;

            const section = href.split("#")[1];

            // Convert to absolute path with hash targeting the homepage section.
            const homePage = new URL("./", basePath).href;
            // Ensure default navigation works (e.g., middle-click/Cmd+Click)
            link.setAttribute("href", `${homePage}#${section}`);

            // Add click handler to navigate home and perform smooth scroll after load.
            link.addEventListener(
                "click",
                (e) => {
                    e.preventDefault();
                    Utils.add_section(section);
                    window.location.href = homePage;
                },
                undefined,
            );
        });
    },

    setupSmoothScrolling() {
        try {
            const mobileMenu = Utils.getElement(".mobile-menu");
            const overlay = Utils.getElement(".overlay");

            Utils.getElements('a[href^="#"], a[href^="/index.html#"]').forEach(
                (anchor) => {
                    anchor.addEventListener("click", (e) => {
                        const href = anchor.getAttribute("href").split("#")[1];
                        if (!href) return;

                        const target = Utils.getElement(`#${href}`);
                        if (!target) return;

                        e.preventDefault();
                        // Close mobile menu if open
                        if (mobileMenu && overlay) {
                            mobileMenu.classList.remove("active");
                            overlay.classList.remove("active");
                            document.body.style.overflow = "";
                        }

                        // target.scrollIntoView({
                        //     behavior: "smooth",
                        // });
                        this.scrollWithOverlay(target);
                    });
                },
            );
        } catch (error) {
            console.error("Error setting up smooth scrolling:", error);
        }
    },

    /**
     * Smoothly scrolls to a target element with a fade overlay effect
     * @param {HTMLElement} link - The target element to scroll to
     */
    scrollWithOverlay(link) {
        const fadeDelay = 10;
        const fadeClass = "fade-out";
        const overlayClass = "scroll-overlay";
        const activeClass = "overlay-active";

        let overlay = Utils.getElement(`.${overlayClass}`);
        let fadeTimeoutId = null;
        let scrollComplete = false;

        // Create overlay if it doesn't exist
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = overlayClass;
            overlay.setAttribute("aria-hidden", "true");
            overlay.setAttribute("role", "presentation");
            document.body.appendChild(overlay);
        }

        // Show overlay by adding active class
        document.body.classList.add(activeClass);

        // Remove fade class if present to ensure opacity is reset
        overlay.classList.remove(fadeClass);

        // Start fade-out animation after next paint
        requestAnimationFrame(() => {
            // Force reflow to ensure transition triggers
            void overlay.offsetWidth;
            overlay.classList.add(fadeClass);
        });

        // Clean up after animation completes
        const cleanup = () => {
            if (scrollComplete) {
                overlay.remove();
                document.body.classList.remove(activeClass);
            }
            if (fadeTimeoutId) {
                clearTimeout(fadeTimeoutId);
            }
        };

        overlay.addEventListener("transitionend", cleanup, { once: true });

        // Smooth scroll to target after delay
        fadeTimeoutId = setTimeout(() => {
            try {
                link.scrollIntoView({
                    behavior: "smooth",
                });

                scrollComplete = true;

                // Restart fade-out after scroll completes
                // Remove fade class first to reset animation
                overlay.classList.remove(fadeClass);

                // Force reflow before adding class again
                requestAnimationFrame(() => {
                    void overlay.offsetWidth;
                    overlay.classList.add(fadeClass);
                });
            } catch (error) {
                console.error("Scroll failed:", error);
                cleanup();
            }
        }, fadeDelay);
    },
};
