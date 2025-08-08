// Immediately Invoked Function Expression (IIFE) for initialization
(function () {
    "use strict";

    // Force scroll to top immediately
    window.scrollTo(0, 0);

    // Set scroll position in session history
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    // Configuration
    const CONFIG = {
        WHATSAPP_NUMBER: "+6285847006743",
        WHATSAPP_DEFAULT_MESSAGE:
            "Hello BaliBlissed! I'm interested in booking a vacation. Can you provide more information?",
        HEADER_SCROLL_THRESHOLD: 100,
        BUTTON_COLLAPSE_TIMEOUT: 1000,
        HOVER_DELAY: 600,
        PARALLAX_FACTOR: 0.5,
        NAV_LINKS: [
            "index.html#home",
            "index.html#destinations",
            "index.html#contact-form",
        ],
        DEST_IMAGES: "/json_data/destination_images.json",
        MAP_URLS: "/json_data/map_urls.json",
    };

    // Utility functions
    const Utils = {
        // Throttle function to limit execution frequency
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

        // Safe element selector that checks if element exists
        getElement(selector) {
            return document.querySelector(selector);
        },

        // Get multiple elements safely
        getElements(selector) {
            return document.querySelectorAll(selector);
        },

        // Check if we're on a mobile device
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
    };

    const destinationImages = {};

    // To update hero image on destination pages
    function setDestHeroImg() {
        // Select the hero image element specifically within a .destination-hero section
        const heroImageElement = document.querySelector(
            ".destination-hero .hero-bg"
        );

        if (!heroImageElement) {
            // Only log if we expect a hero image on this page (i.e., a destination page)
            if (window.location.pathname.includes("/destinations/")) {
                console.log(
                    "Could not find .destination-hero .hero-bg element on this page."
                );
                return;
            }
        }

        // Get the full document title
        const fullPageTitle = document.title;

        // Extract the core destination name, assuming format "Destination Name | Site Name"
        // Takes the part before the first '|' and trims whitespace
        let coreTitle = fullPageTitle.split("|")[0].trim();

        // Normalize whitespace (replace multiple spaces with single space)
        const cleanedTitle = coreTitle.replace(/\s+/g, " ").trim();

        // Look up the cleaned title in the destinationImages map
        const imageUrl = destinationImages[cleanedTitle];

        if (!imageUrl) {
            console.warn(
                `Image URL not found in destinationImages map for title derived from document.title: "${cleanedTitle}" (Original: "${fullPageTitle}")`
            );
            // Optional: Set a default hero image if the lookup fails
            heroImageElement.src = "/images/hero/IMG_7508_DxO.webp";
            heroImageElement.alt = "Bali Blissed";
            return;
        }

        // Determine base path for relative URLs based on current page depth
        const path = window.location.pathname;
        const isActivityPage = path.includes("/destinations/activities/");

        let basePath = "";
        // Adjust these paths based on your actual folder structure if needed
        if (isActivityPage) {
            basePath = "../../../"; // e.g., from /destinations/activities/activity-name/index.html
        } else if (path.includes("/destinations/")) {
            basePath = "../../"; // e.g., from /destinations/region-name/index.html
        }
        // Add more conditions if you have other destination structures

        // Set the src attribute, prepending base path only if imageUrl is relative
        if (!imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
            heroImageElement.src = basePath + imageUrl;
        } else {
            heroImageElement.src = imageUrl; // Use absolute URL as is
        }
        // Optional: Update alt text using the cleaned title
        heroImageElement.alt = cleanedTitle;
    }

    // add section to sessionStorage
    function add_section(section) {
        const arr = JSON.parse(
            sessionStorage.getItem("scrollToSection") || "[]"
        );
        arr.push(section);
        sessionStorage.setItem("scrollToSection", JSON.stringify(arr));
    }

    // get sections from sessionStorage
    function get_sections() {
        return JSON.parse(sessionStorage.getItem("scrollToSection") || "[]");
    }

    const ComponentLoader = {
        async init() {
            // Use Promise.all to wait for both header and footer to load
            await this.loadComponents();
            // Now that components are loaded, initialize things that depend on them
            this.initializeDependentControllers();
            // Setup all booking buttons AFTER components are loaded
            setBookingButtons();
        },

        loadComponents() {
            // ... (determine basePath logic remains the same) ...
            const path = window.location.pathname;
            const isDestinationPage = path.includes("/destinations/");
            const isActivityPage = path.includes("/destinations/activities/");
            const isServicePage = path.includes("/services/");
            const isPagesPage = path.includes("/pages/");

            let basePath = "";
            if (isActivityPage) basePath = "../../../";
            else if (isDestinationPage || isServicePage) basePath = "../../";
            else if (isPagesPage) basePath = "../";

            const headerPlaceholder = Utils.getElement("#header-placeholder");
            const footerPlaceholder = Utils.getElement("#footer-placeholder");

            const loadHeaderPromise = headerPlaceholder
                ? fetch(basePath + "includes/header.html")
                      .then((response) => response.text())
                      .then((data) => {
                          headerPlaceholder.innerHTML = data;
                          this.fixComponentPaths(
                              headerPlaceholder,
                              basePath,
                              isDestinationPage,
                              isActivityPage,
                              isServicePage,
                              isPagesPage
                          );
                          // Initialize header-specific JS immediately after loading
                          NavigationController.init(); // Depends on header elements
                          FloatingButtonsController.init(); // Depends on header elements (#whatsapp-float)
                      })
                      .catch((error) =>
                          console.error("Error loading header:", error)
                      )
                : Promise.resolve(); // Resolve immediately if no placeholder

            const loadFooterPromise = footerPlaceholder
                ? fetch(basePath + "includes/footer.html")
                      .then((response) => response.text())
                      .then((data) => {
                          footerPlaceholder.innerHTML = data;
                          this.fixComponentPaths(
                              footerPlaceholder,
                              basePath,
                              isDestinationPage,
                              isActivityPage,
                              isServicePage,
                              isPagesPage
                          );
                          // Footer specific JS initialization could go here if needed
                      })
                      .catch((error) =>
                          console.error("Error loading footer:", error)
                      )
                : Promise.resolve(); // Resolve immediately if no placeholder

            return Promise.all([loadHeaderPromise, loadFooterPromise]);
        },

        fixComponentPaths(
            placeHolder,
            basePath,
            isDestinationPage,
            isActivityPage,
            isServicePage,
            isPagesPage
        ) {
            if (
                isDestinationPage ||
                isActivityPage ||
                isServicePage ||
                isPagesPage
            ) {
                const links = placeHolder.querySelectorAll(
                    'a:not([href^="http"]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"])'
                );
                const images = placeHolder.querySelectorAll(
                    'img:not([src^="http"]):not([src^="/"])'
                ); // Select relative image paths

                links.forEach((link) => {
                    const href = link.getAttribute("href");

                    // Special handling for section links
                    if (CONFIG.NAV_LINKS.includes(href)) {
                        const section = href.split("#")[1];
                        // Convert to absolute path with hash
                        const homePage = basePath + "index.html";
                        link.setAttribute("href", homePage + "#" + section);

                        // Add click handler for smooth scroll after navigation
                        link.addEventListener("click", (e) => {
                            e.preventDefault();
                            add_section(section);
                            window.location.href = homePage;
                        });
                    }
                    // Adjust relative paths like 'index.html' or 'services/...'
                    else if (
                        href &&
                        !href.startsWith("../") &&
                        !href.startsWith("/") &&
                        !href.includes("#")
                    ) {
                        link.setAttribute("href", basePath + href);
                    }
                });
                images.forEach((img) => {
                    const src = img.getAttribute("src");
                    if (src && !src.startsWith("../")) {
                        // Check it's not already adjusted
                        img.setAttribute("src", basePath + src);
                    }
                });
            }
        },

        initializeDependentControllers() {
            // Initialize controllers that might depend on elements in header OR footer
            // Ensure ModalController runs after footer is loaded because About modal content is there
            ModalController.init();
        },
    };

    const ScrollController = {
        init() {
            // // Add multiple attempts to scroll to top
            // window.addEventListener("load", () => {
            //     setTimeout(() => {
            //         window.scrollTo(0, 0);
            //     }, 0);
            // });

            document.addEventListener("DOMContentLoaded", () => {
                window.scrollTo(0, 0);

                // One more attempt after a slight delay
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 100);
            });

            // Attach throttled scroll handler
            window.addEventListener(
                "scroll",
                Utils.throttle(this.handleScroll, 12)
            );
        },

        handleScroll() {
            try {
                // Header scroll effect
                const header = Utils.getElement("#header");
                if (header) {
                    if (window.scrollY > CONFIG.HEADER_SCROLL_THRESHOLD) {
                        header.classList.add("scrolled");
                    } else {
                        header.classList.remove("scrolled");
                    }
                }

                // Parallax effect
                const heroBg = Utils.getElement(".hero-bg");
                if (heroBg) {
                    const parallaxOffset =
                        window.scrollY * CONFIG.PARALLAX_FACTOR;
                    heroBg.style.transform = `translateY(${parallaxOffset}px)`;
                }

                // Home float button visibility
                const backToTop = Utils.getElement("#home-float");
                if (backToTop) {
                    const scrollHeight = document.documentElement.scrollHeight;
                    const clientHeight = document.documentElement.clientHeight;
                    const scrollThreshold = (scrollHeight - clientHeight) * 0.8; // 90% threshold

                    if (window.scrollY >= scrollThreshold) {
                        backToTop.classList.add("visible");
                    } else {
                        backToTop.classList.remove("visible");
                    }
                }
            } catch (error) {
                console.error("Error in scroll handler:", error);
            }
        },
    };

    const DelayedService = {
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

    const ScrollAnimation = {
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
            // Assume Utils.getElements exists and returns a NodeList or Array
            const elements = Utils.getElements(selector);
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
                for (const [selector, threshold] of Object.entries(
                    this._config
                )) {
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
            for (const observer in Object.values(this._observers)) {
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
            }
        },
    };

    const NavigationController = {
        init() {
            this.setupMobileMenu();
            this.setupSmoothScrolling();
            this.setupCrossPageNavigation();
        },

        setupMobileMenu() {
            try {
                const menuToggle = Utils.getElement(".menu-toggle");
                const mobileMenu = Utils.getElement(".mobile-menu");
                const overlay = Utils.getElement(".overlay");
                const closeBtn = Utils.getElement(".close-btn");

                if (menuToggle && mobileMenu && overlay && closeBtn) {
                    menuToggle.addEventListener("click", () => {
                        mobileMenu.classList.add("active");
                        overlay.classList.add("active");
                        document.body.style.overflow = "hidden";
                    });

                    const closeMenu = () => {
                        mobileMenu.classList.remove("active");
                        overlay.classList.remove("active");
                        document.body.style.overflow = "";
                    };

                    closeBtn.addEventListener("click", closeMenu);
                    overlay.addEventListener("click", closeMenu);
                }
            } catch (error) {
                console.error("Error setting up mobile menu:", error);
            }
        },

        setupCrossPageNavigation() {
            try {
                // Handle destinations links specifically
                const carCharterLink = Utils.getElement(".car-charter-link");
                const destinationLink = Utils.getElement(".destinations-link");
                const contactLink = Utils.getElement(".contact-link");

                const allLinks = [carCharterLink, destinationLink, contactLink];

                allLinks.forEach((link) => {
                    link.addEventListener("click", (e) => {
                        const href = link.getAttribute("href");
                        const currentPath = window.location.pathname;
                        const isHome =
                            currentPath.endsWith("/") ||
                            currentPath.endsWith("/index.html") ||
                            currentPath.includes("/BaliBlissed/index.html");

                        // Check if we're not on the main page
                        if (!isHome && CONFIG.NAV_LINKS.includes(href)) {
                            e.preventDefault();
                            add_section(href.split("#")[1]);

                            // Navigate to the main page
                            window.location.href = href.split("#")[0];
                        } else {
                            let overlay = Utils.getElement(".scroll-overlay");
                            if (!overlay) {
                                overlay = document.createElement("div");
                                overlay.className = "scroll-overlay";
                                document.body.appendChild(overlay);
                            }
                            document.body.classList.add("overlay-active");
                            overlay.classList.remove("fade-out");
                            // start fade-out a tiny bit after paint
                            requestAnimationFrame(() => {
                                overlay.classList.add("fade-out");
                            });
                            // clean up once animation ends
                            overlay.addEventListener(
                                "transitionend",
                                () => {
                                    overlay.remove();
                                    document.body.classList.remove(
                                        "overlay-active"
                                    );
                                },
                                { once: true }
                            );

                            // dim the page
                            // document.documentElement.classList.add("dimmed");

                            setTimeout(() => {
                                link.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                });
                                // after scroll,

                                // remove dim
                                // document.documentElement.classList.remove(
                                //     "dimmed"
                                // );

                                // remove overlay
                                overlay.remove();
                                document.body.classList.remove(
                                    "overlay-active"
                                );
                            }, 1500);
                        }
                    });
                });
            } catch (error) {
                console.error("Error setting up cross-page navigation:", error);
            }
        },

        setupSmoothScrolling() {
            try {
                const mobileMenu = Utils.getElement(".mobile-menu");
                const overlay = Utils.getElement(".overlay");

                Utils.getElements('a[href^="#"]').forEach((anchor) => {
                    anchor.addEventListener("click", function (e) {
                        e.preventDefault();

                        // Close mobile menu if open
                        if (mobileMenu && overlay) {
                            mobileMenu.classList.remove("active");
                            overlay.classList.remove("active");
                            document.body.style.overflow = "";
                        }

                        const href = this.getAttribute("href");
                        if (href && href !== "#") {
                            const target = Utils.getElement(href);
                            if (target) {
                                target.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }
                        }
                    });
                });
            } catch (error) {
                console.error("Error setting up smooth scrolling:", error);
            }
        },
    };

    const ModalController = {
        init() {
            // this.welcomeModal();
            // this.aboutModal();
        },

        welcomeModal() {
            try {
                const welcomeModal = Utils.getElement("#welcome-modal");
                if (!welcomeModal) {
                    console.error("Modal element not found.");
                    return;
                }

                const welcomeClose = Utils.getElement(".welcome-modal-close");
                const welcomeButton = Utils.getElement(".welcome-modal-button");
                showWelcome(welcomeModal, false);
                closeModal(welcomeModal, welcomeClose, welcomeButton);
            } catch (error) {
                console.error("Error setting up Welcome modal:", error);
            }
        },

        aboutModal() {
            try {
                const aboutLinks = Utils.getElements(".about-link");
                const aboutModal = Utils.getElement("#about-modal");
                const aboutBody = Utils.getElement(".about-modal-body");
                const aboutClose = Utils.getElement(".about-modal-close");
                const mobileMenu = Utils.getElement(".mobile-menu");
                const mobileOverlay = Utils.getElement(".overlay");

                if (!aboutLinks.length || !aboutModal || !aboutBody) {
                    console.warn("About modal elements not found.");
                    return;
                }

                const openModal = (e) => {
                    showAbout(
                        e,
                        aboutModal,
                        aboutBody,
                        mobileMenu,
                        mobileOverlay
                    );
                };

                aboutLinks.forEach((link) => {
                    link.addEventListener("click", openModal);
                });

                closeModal(aboutModal, aboutClose, null);
            } catch (error) {
                console.error("Error setting up About modal:", error);
            }
        },
    };

    const HeroAnimationController = {
        init() {
            this.animateHeroContent();
            this.setupHomeClickAnimation();
        },

        animateHeroContent() {
            const heroContent = Utils.getElement(".hero-content");
            if (!heroContent) return;

            // Check if we should trigger animation due to cross-page navigation
            const shouldAnimate = sessionStorage.getItem(
                "triggerHeroAnimation"
            );
            if (shouldAnimate) {
                sessionStorage.removeItem("triggerHeroAnimation");
            }

            // Small delay to ensure the page is ready
            setTimeout(() => {
                heroContent.classList.add("slide-in");
            }, 300);
        },

        setupHomeClickAnimation() {
            // Handle both navigation and mobile menu home links
            const homeLinks = Utils.getElements(
                'a[href*="#home"], a[href="index.html#home"], a[href="index.html"]'
            );

            homeLinks.forEach((link) => {
                link.addEventListener("click", (e) => {
                    const href = link.getAttribute("href");

                    // Check if we're navigating to home from another page
                    const currentPath = window.location.pathname;
                    const isHome =
                        currentPath.endsWith("/") ||
                        currentPath.endsWith("/index.html") ||
                        currentPath.includes("/BaliBlissed/index.html");

                    if (
                        !isHome &&
                        (href.includes("index.html") || href === "#home")
                    ) {
                        // Store animation trigger in session storage for cross-page navigation
                        sessionStorage.setItem("triggerHeroAnimation", "true");
                        return;
                    }

                    // If we're already on the home page, animate immediately
                    if (isHome && href.includes("#home")) {
                        e.preventDefault();
                        this.triggerHeroAnimation();

                        // Scroll to top smoothly
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        });
                    }
                });
            });
        },

        triggerHeroAnimation() {
            const heroContent = Utils.getElement(".hero-content");
            if (!heroContent) return;

            // Reset animation
            heroContent.classList.remove("slide-in");

            // Force reflow
            heroContent.offsetHeight;

            // Trigger animation again
            setTimeout(() => {
                heroContent.classList.add("slide-in");
            }, 900);
        },
    };

    function showWelcome(modal, oneTime, delay = 1500) {
        const modalShownFlag = "modalShown"; // Key for sessionStorage

        // Check if the modal should only be shown once per session
        if (oneTime && sessionStorage.getItem(modalShownFlag)) {
            return;
        }

        // Show the modal after the specified delay
        setTimeout(() => {
            // Show the modal and lock body scroll
            modal.classList.add("active");
            document.body.style.overflow = "hidden";

            // Set the session flag if oneTimePerSession is true
            if (oneTime) {
                sessionStorage.setItem(modalShownFlag, "true");
            }
        }, delay);
    }

    function showAbout(e, aboutModal, aboutBody, mobileMenu, mobileOverlay) {
        e.preventDefault();

        // Close mobile menu if it's active
        if (mobileMenu && mobileMenu.classList.contains("active")) {
            mobileMenu.classList.remove("active");
            if (!mobileOverlay) {
                return;
            }
            mobileOverlay.classList.remove("active");
        }

        // Get the footer 'About' content
        const footerAbout = Utils.getElement(
            "#footer-placeholder .footer-about"
        );

        if (!footerAbout) {
            console.error("Footer 'About' content not found in DOM.");
            aboutBody.innerHTML = "<p>Content could not be loaded.</p>";
            aboutModal.classList.add("active");
            document.body.style.overflow = "hidden";
            return;
        }

        // Populate the modal body with the footer content
        aboutBody.innerHTML = footerAbout.innerHTML;

        // Update image paths if necessary
        aboutBody.querySelectorAll("img").forEach((img) => {
            let src = img.getAttribute("src");
            if (src && !src.startsWith("/") && !src.startsWith("http")) {
                img.setAttribute("src", "/" + src);
            }
        });

        // Show the modal and lock body scroll
        aboutModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function animatedClose(modal, welcomeButton, delay = 1200) {
        if (!welcomeButton) {
            // Fallback if button is not found
            modal.classList.remove("active");
            document.body.style.overflow = "";
            return;
        }
        // Add the hover-trigger class to simulate hover animation
        welcomeButton.classList.add("hover-trigger");

        // Wait for the animation to complete before closing the modal
        setTimeout(() => {
            // Remove the hover-trigger class after the animation ends
            welcomeButton.classList.remove("hover-trigger");
            modal.classList.remove("active");

            // Restore body scroll after the timeout
            document.body.style.overflow = "";
        }, delay);
    }

    function closeModal(modal, closeButton, welcomeButton) {
        const closeModal = () => {
            animatedClose(modal, welcomeButton);
        };
        // Close modal on close button click
        closeButton.addEventListener("click", () => {
            closeModal();
        });
        // Close modal when clicking the background
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        // Close modal with Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeModal();
            }
        });

        if (!welcomeButton) {
            return;
        }
        // Handle the welcome button click
        welcomeButton.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent default link behavior
            closeModal();

            // Optionally, handle smooth scroll if it's an anchor link
            const href = welcomeButton.getAttribute("href");
            const target = Utils.getElement(href);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    function openWhatsAppChat(customMessage = null) {
        try {
            // If a custom message is provided, use it; otherwise use the default
            const message = customMessage || CONFIG.WHATSAPP_DEFAULT_MESSAGE;
            const whatsappURL = `https://wa.me/${
                CONFIG.WHATSAPP_NUMBER
            }?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, "_blank", "noopener,noreferrer");
        } catch (error) {
            console.error("Failed to open WhatsApp chat:", error);
            // Could add fallback behavior here
        }
    }

    function setBookingButtons() {
        // Track which buttons have already been initialized within this scope
        const initializedButtons = new Set();

        try {
            // Find all relevant booking buttons
            const bookingButtons = Utils.getElements(".cta-button, .book-now");

            if (bookingButtons.length === 0) return;

            bookingButtons.forEach((button) => {
                // Skip if this button has already been initialized
                if (initializedButtons.has(button)) return;

                // Mark this button as initialized
                initializedButtons.add(button);

                // Add event listener
                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling

                    let customMessage = null;
                    const path = window.location.pathname;
                    const isAboutPage = path.includes("/pages/");
                    // Check if it's a page-specific CTA button
                    if (
                        button.classList.contains("cta-button") &&
                        !isAboutPage
                    ) {
                        // Extract the page title from the document title
                        const pageTitle = document.title.split("|")[0].trim();
                        // Create a custom message with the page title
                        customMessage = `Hello BaliParadise! I'm interested in booking the ${pageTitle}. Can you provide more information?`;
                    }
                    // Otherwise, it's a general .book-now button, use the default message (null will trigger default in openWhatsAppChat)

                    // Use the standalone function to open chat
                    openWhatsAppChat(customMessage);
                });

                // Remove any inline onclick attributes that might be causing duplicates
                button.removeAttribute("onclick");
            });
        } catch (error) {
            console.error("Error setting up booking buttons:", error);
        }
    }

    const FloatingButtonsController = {
        buttonTimeouts: new Map(), // Stores timeout IDs for collapsing buttons

        init() {
            try {
                // Cache element lookups
                const floatingButtons = Array.from(
                    Utils.getElements(".floating-button")
                ); // Convert NodeList to Array
                const whatsappFloat = Utils.getElement("#whatsapp-float");

                if (floatingButtons.length === 0) {
                    // console.warn("No floating buttons found.");
                    return; // Exit if no buttons to manage
                }

                // Determine interaction mode once
                const isMobile = Utils.isMobileDevice();

                floatingButtons.forEach((button) => {
                    this.setupButtonInteraction(
                        button,
                        isMobile,
                        whatsappFloat
                    );
                });

                // Add a single listener to the document for outside clicks/taps
                this.setupOutsideInteractionListener(isMobile);
            } catch (error) {
                console.error("Error initializing floating buttons:", error);
            }
        },

        expandButton(button) {
            // Collapse any other expanded button first
            Utils.getElements(".floating-button.expanded").forEach((btn) => {
                if (btn !== button) {
                    this.collapseButton(btn);
                }
            });

            // Expand the target button if not already expanded
            if (!button.classList.contains("expanded")) {
                button.classList.add("expanded");
                this.startCollapseTimer(button, CONFIG.BUTTON_COLLAPSE_TIMEOUT);
            }
        },

        collapseButton(button) {
            if (button.classList.contains("expanded")) {
                button.classList.remove("expanded");
                this.clearCollapseTimer(button);
            }
        },

        startCollapseTimer(button, delay) {
            this.clearCollapseTimer(button); // Clear existing timer first
            const timeoutId = setTimeout(() => {
                this.collapseButton(button);
            }, delay);
            this.buttonTimeouts.set(button, timeoutId);
        },

        clearCollapseTimer(button) {
            if (this.buttonTimeouts.has(button)) {
                clearTimeout(this.buttonTimeouts.get(button));
                this.buttonTimeouts.delete(button);
            }
        },

        handleInteraction(button, event, isMobile, whatsappFloat) {
            const isExpanded = button.classList.contains("expanded");
            const isWhatsapp = button === whatsappFloat; // Direct comparison is faster

            if (isMobile) {
                // Mobile: First tap expands, second tap acts (if WhatsApp)
                event.preventDefault(); // Prevent ghost clicks and default link behavior
                if (!isExpanded) {
                    this.expandButton(button);
                } else if (isWhatsapp) {
                    openWhatsAppChat(); // Assumes this function exists globally
                    this.collapseButton(button);
                }
                // Add else if for other buttons if they have mobile actions on second tap
            } else {
                // Desktop: Click always acts (if WhatsApp), hover handles expand/collapse
                if (isWhatsapp) {
                    event.preventDefault(); // Prevent default link behavior for WhatsApp
                    openWhatsAppChat();
                    this.collapseButton(button); // Collapse after action
                }
            }
        },

        setupButtonInteraction(button, isMobile, whatsappFloat) {
            if (isMobile) {
                // Mobile: Use touchend for primary interaction
                button.addEventListener("touchend", (e) => {
                    this.handleInteraction(button, e, true, whatsappFloat);
                });
                // No 'click' listener needed for mobile to avoid conflicts
            } else {
                // Desktop: Hover to expand/collapse, click to act
                let hoverTimer = null;
                button.addEventListener("mouseenter", () => {
                    clearTimeout(hoverTimer); // Cancel pending collapse from mouseleave
                    this.clearCollapseTimer(button); // Cancel auto-collapse timer
                    this.expandButton(button); // Expand immediately
                    // No need to set a new timer here, mouseleave handles collapse
                });

                button.addEventListener("mouseleave", () => {
                    // Start timer to collapse after hover delay
                    hoverTimer = setTimeout(() => {
                        this.collapseButton(button);
                    }, CONFIG.HOVER_DELAY);
                });

                // Click listener specifically for actions on desktop
                button.addEventListener("click", (e) => {
                    this.handleInteraction(button, e, false, whatsappFloat);
                });
            }
        },

        setupOutsideInteractionListener(isMobile) {
            const eventType = isMobile ? "touchstart" : "mousedown"; // Use appropriate event

            document.addEventListener(
                eventType,
                (e) => {
                    // Check if the interaction is outside any floating button
                    const clickedButton = e.target.closest(".floating-button");
                    if (!clickedButton) {
                        // Find any currently expanded floating button
                        const expandedButton = Utils.getElement(
                            ".floating-button.expanded"
                        );
                        if (expandedButton) {
                            this.collapseButton(expandedButton);
                        }
                    }
                    // If the click was ON a button, the button's own handler manages expand/collapse
                },
                { passive: isMobile }
            ); // Use passive: true only for touchstart for performance
        },
    };

    const PaginationController = {
        currentPage: 1,
        isInitialLoad: true,

        init() {
            try {
                const prevButton = Utils.getElement(".prev-page");
                const nextButton = Utils.getElement(".next-page");
                const paginationNumbersContainer = Utils.getElement(
                    ".pagination-numbers"
                );
                const destinationPages =
                    Utils.getElements(".destinations-page");

                if (
                    !prevButton ||
                    !nextButton ||
                    !paginationNumbersContainer ||
                    destinationPages.length === 0
                ) {
                    return; // Exit if elements don't exist
                }

                this.prevButton = prevButton;
                this.nextButton = nextButton;
                this.paginationNumbersContainer = paginationNumbersContainer;
                this.destinationPages = destinationPages;
                this.destinationsSection = Utils.getElement("#destinations");
                this.totalPages = destinationPages.length;
                this.maxVisibleButtons = 3;

                // Set up event delegation for pagination numbers
                this.paginationNumbersContainer.addEventListener(
                    "click",
                    (e) => {
                        if (e.target.classList.contains("pagination-number")) {
                            const pageNumber = parseInt(
                                e.target.getAttribute("data-page")
                            );
                            if (!isNaN(pageNumber)) {
                                this.showPage(pageNumber, true);
                            }
                        }
                    }
                );

                // Add click event listeners to prev/next buttons
                this.prevButton.addEventListener("click", () => {
                    if (this.currentPage > 1) {
                        this.showPage(this.currentPage - 1, true);
                    }
                });

                this.nextButton.addEventListener("click", () => {
                    if (this.currentPage < this.totalPages) {
                        this.showPage(this.currentPage + 1, true);
                    }
                });

                // Initialize pagination - don't scroll on initial load
                setTimeout(() => {
                    this.showPage(1, false);
                }, 150);
            } catch (error) {
                console.error("Error initializing pagination:", error);
            }
        },

        showPage(pageNumber, userInitiated = false) {
            try {
                // Hide all pages
                this.destinationPages.forEach((page) => {
                    page.classList.remove("active");
                });

                // Show the selected page
                const pageToShow = Utils.getElement(
                    `.destinations-page[data-page="${pageNumber}"]`
                );
                if (pageToShow) {
                    pageToShow.classList.add("active");
                }

                // Update current page
                this.currentPage = pageNumber;

                // Update pagination UI
                this.updatePaginationUI();

                // Only scroll if this was triggered by a user action (button click)
                // and we're on mobile
                if (
                    userInitiated &&
                    this.destinationsSection &&
                    Utils.isMobileDevice()
                ) {
                    this.destinationsSection.scrollIntoView({
                        behavior: "smooth",
                    });
                }

                // After first call, it's no longer the initial load
                this.isInitialLoad = false;
            } catch (error) {
                console.error("Error showing page:", error);
            }
        },

        updatePaginationUI() {
            try {
                // Clear existing buttons
                this.paginationNumbersContainer.innerHTML = "";

                // Calculate which buttons to show
                let startPage = Math.max(
                    1,
                    this.currentPage - Math.floor(this.maxVisibleButtons / 2)
                );
                let endPage = startPage + this.maxVisibleButtons - 1;

                // Adjust if we're near the end
                if (endPage > this.totalPages) {
                    endPage = this.totalPages;
                    startPage = Math.max(
                        1,
                        endPage - this.maxVisibleButtons + 1
                    );
                }

                // Create the buttons
                for (let i = startPage; i <= endPage; i++) {
                    const button = document.createElement("button");
                    button.classList.add("pagination-number");
                    button.setAttribute("data-page", i);
                    button.textContent = i;

                    if (i === this.currentPage) {
                        button.classList.add("active");
                    }

                    this.paginationNumbersContainer.appendChild(button);
                }

                // Update prev/next button states
                if (this.currentPage === 1) {
                    this.prevButton.setAttribute("disabled", "disabled");
                    this.prevButton.classList.add("disabled");
                } else {
                    this.prevButton.removeAttribute("disabled");
                    this.prevButton.classList.remove("disabled");
                }

                if (this.currentPage === this.totalPages) {
                    this.nextButton.setAttribute("disabled", "disabled");
                    this.nextButton.classList.add("disabled");
                } else {
                    this.nextButton.removeAttribute("disabled");
                    this.nextButton.classList.remove("disabled");
                }
            } catch (error) {
                console.error("Error updating pagination UI:", error);
            }
        },
    };

    const TestimonialsController = {
        currentIndex: 0,
        testimonialCount: 0,
        visibleCount: 3, // Number of visible testimonials at once
        track: null,
        testimonials: null,
        scrollPosition: 0, // Add this to store scroll position

        init() {
            this.track = Utils.getElement(".testimonials-track");
            this.testimonials = Utils.getElements(".testimonial-card");

            if (!this.track || !this.testimonials.length) return;

            this.testimonialCount = this.testimonials.length;

            // Set up navigation
            const prevButton = Utils.getElement(".prev-testimonial");
            const nextButton = Utils.getElement(".next-testimonial");

            if (prevButton) {
                prevButton.addEventListener("click", () =>
                    this.navigate("prev")
                );
            }

            if (nextButton) {
                nextButton.addEventListener("click", () =>
                    this.navigate("next")
                );
            }

            // Check for text overflow and add fade effect
            this.setupTextOverflow();

            // Set up click handlers for testimonials
            this.setupTestimonialClicks();

            // Set up modal close functionality
            this.setupModal();

            // Set up swipe functionality
            this.setupSwipeEvents();

            // Adjust visible count based on screen size
            this.adjustVisibleCount();

            // Create indicators
            this.createIndicators();

            // Initialize button states
            this.updateButtonStates(prevButton, nextButton);

            // Add resize event listener
            window.addEventListener(
                "resize",
                Utils.throttle(() => {
                    this.adjustVisibleCount();
                    this.navigate("current"); // Refresh the current view
                    this.createIndicators(); // Recreate indicators when screen size changes

                    // Make sure buttons and indicators are visible on mobile
                    this.ensureMobileControlsVisibility();
                }, 200)
            );

            // Ensure mobile controls are visible on initial load
            this.ensureMobileControlsVisibility();
        },

        ensureMobileControlsVisibility() {
            const isMobile = Utils.isMobileDevice();
            const controls = Utils.getElement(".testimonial-controls");
            const indicators = Utils.getElement(".testimonial-indicators");

            if (controls) {
                if (isMobile) {
                    controls.style.display = "flex";
                    controls.style.opacity = "1";

                    // Ensure buttons are visible and properly sized
                    const buttons = controls.querySelectorAll("button");
                    buttons.forEach((button) => {
                        button.style.display = "flex";
                        button.style.opacity = "1";
                        button.style.width = "40px";
                        button.style.height = "40px";
                    });
                }
            }

            if (indicators) {
                if (isMobile) {
                    indicators.style.display = "flex";
                    indicators.style.opacity = "1";
                    indicators.style.marginTop = "15px";
                }
            }

            // Ensure modal works on mobile
            const modal = Utils.getElement(".testimonial-modal");
            if (modal && isMobile) {
                modal.style.zIndex = "9999";
            }
        },

        adjustVisibleCount() {
            const oldVisibleCount = this.visibleCount;

            if (window.innerWidth < 768) {
                this.visibleCount = 1;
            } else if (window.innerWidth < 992) {
                this.visibleCount = 2;
            } else {
                this.visibleCount = 3;
            }

            // If visible count changed, update the carousel
            if (oldVisibleCount !== this.visibleCount) {
                // Adjust card widths based on visible count
                if (this.testimonials && this.testimonials.length) {
                    const cardWidth = 100 / this.visibleCount;
                    this.testimonials.forEach((card) => {
                        card.style.width = `${cardWidth}%`;
                    });
                }

                // Reset to first slide when changing layouts
                this.currentIndex = 0;
                this.navigate("current");
            }
        },

        setupTextOverflow() {
            const testimonialTexts = Utils.getElements(".testimonial-text");

            testimonialTexts.forEach((text) => {
                // Force text to stay within bounds
                text.style.maxHeight = "150px";

                // Check if content overflows
                if (text.scrollHeight > text.clientHeight) {
                    text.classList.add("has-overflow");
                }
            });
        },

        setupTestimonialClicks() {
            const testimonialTexts = Utils.getElements(".testimonial-text");

            testimonialTexts.forEach((text) => {
                text.addEventListener("click", () => {
                    const card = text.closest(".testimonial-card");
                    const authorContent = card.querySelector(
                        ".testimonial-author"
                    ).innerHTML;

                    // Populate and show modal
                    const modal = Utils.getElement(".testimonial-modal");
                    const modalText = Utils.getElement(
                        ".testimonial-modal-text"
                    );
                    const modalAuthor = Utils.getElement(
                        ".testimonial-modal-author"
                    );

                    modalText.textContent = text.textContent;
                    modalAuthor.innerHTML = authorContent;

                    // Set modal display to flex
                    modal.style.display = "flex";

                    // Handle scrolling for mobile devices
                    if (Utils.isMobileDevice()) {
                        // Store current scroll position before locking scroll
                        this.scrollPosition = window.pageYOffset;

                        // Disable background scrolling but allow modal content to scroll
                        document.body.style.overflow = "hidden";
                        document.body.style.position = "fixed";
                        document.body.style.top = `-${this.scrollPosition}px`;
                        document.body.style.width = "100%";
                        document.body.style.touchAction = "none";

                        // Make sure modal content is scrollable
                        const modalContent = Utils.getElement(
                            ".testimonial-modal-content"
                        );
                        if (modalContent) {
                            modalContent.style.overflowY = "auto";
                            modalContent.style.webkitOverflowScrolling =
                                "touch";
                            modalContent.style.maxHeight = "80vh";
                        }
                    }
                });
            });
        },

        setupModal() {
            const modal = Utils.getElement(".testimonial-modal");
            const closeBtn = Utils.getElement(".testimonial-modal-close");
            const modalContent = Utils.getElement(".testimonial-modal-content");

            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    this.closeModal(modal);
                });
            }

            // Close modal when clicking outside content
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });

            // Close modal with Escape key
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && modal.style.display === "flex") {
                    this.closeModal(modal);
                }
            });

            // Add touch event handling for modal content
            if (modalContent && Utils.isMobileDevice()) {
                modalContent.addEventListener(
                    "touchstart",
                    (e) => {
                        // Allow scrolling within the modal content
                        e.stopPropagation();
                    },
                    { passive: true }
                );

                modalContent.addEventListener(
                    "touchmove",
                    (e) => {
                        // Allow scrolling within the modal content
                        e.stopPropagation();
                    },
                    { passive: true }
                );
            }
        },

        closeModal(modal) {
            modal.style.display = "none";

            // Re-enable scrolling when modal is closed
            if (Utils.isMobileDevice()) {
                document.body.style.position = "";
                document.body.style.overflow = "";
                document.body.style.height = "";
                document.body.style.width = "";
                document.body.style.top = "";
                document.body.style.touchAction = "";

                // Restore scroll position
                window.scrollTo(0, this.scrollPosition);
            }
        },

        navigate(direction) {
            const prevButton = Utils.getElement(".prev-testimonial");
            const nextButton = Utils.getElement(".next-testimonial");

            if (direction === "next") {
                this.currentIndex = Math.min(
                    this.currentIndex + 1,
                    this.testimonialCount - this.visibleCount
                );
            } else if (direction === "prev") {
                this.currentIndex = Math.max(this.currentIndex - 1, 0);
            }

            // Calculate the percentage to translate
            const cardWidth = 100 / this.visibleCount;
            const translateValue = -this.currentIndex * cardWidth;

            this.track.style.transform = `translateX(${translateValue}%)`;

            // Update button states
            this.updateButtonStates(prevButton, nextButton);

            // Update indicators
            this.updateActiveIndicator();
        },

        updateButtonStates(prevButton, nextButton) {
            if (!prevButton || !nextButton) return;

            // Enable/disable previous button
            if (this.currentIndex <= 0) {
                prevButton.classList.add("disabled");
                prevButton.setAttribute("disabled", "disabled");
            } else {
                prevButton.classList.remove("disabled");
                prevButton.removeAttribute("disabled");
            }

            // Enable/disable next button
            if (
                this.currentIndex >=
                this.testimonialCount - this.visibleCount
            ) {
                nextButton.classList.add("disabled");
                nextButton.setAttribute("disabled", "disabled");
            } else {
                nextButton.classList.remove("disabled");
                nextButton.removeAttribute("disabled");
            }
        },

        createIndicators() {
            const container = Utils.getElement(".testimonial-indicators");
            if (!container) return;

            // Clear existing indicators
            container.innerHTML = "";

            // Calculate number of indicators needed
            const totalIndicators = Math.max(
                1,
                this.testimonialCount - this.visibleCount + 1
            );

            // Limit to maximum 10 visible indicators
            const maxVisibleIndicators = 5;

            // Determine if we need pagination for indicators
            const needsPagination = totalIndicators > maxVisibleIndicators;

            // Calculate how many indicators to show
            const indicatorsToShow = needsPagination
                ? maxVisibleIndicators
                : totalIndicators;

            // Calculate the step size for paginated indicators
            const step = needsPagination
                ? Math.ceil(totalIndicators / maxVisibleIndicators)
                : 1;

            // Create indicator dots
            for (let i = 0; i < indicatorsToShow; i++) {
                const indicator = document.createElement("div");
                indicator.classList.add("testimonial-indicator");

                // Calculate the actual slide index this indicator represents
                const slideIndex = i * step;

                // Store the actual slide index as a data attribute
                indicator.setAttribute("data-slide", slideIndex);

                // Mark active if this indicator represents the current slide range
                if (
                    this.currentIndex >= slideIndex &&
                    (i === indicatorsToShow - 1 ||
                        this.currentIndex < (i + 1) * step)
                ) {
                    indicator.classList.add("active");
                }

                // Add click event to navigate to specific slide
                indicator.addEventListener("click", () => {
                    this.currentIndex = slideIndex;
                    this.navigate("current");
                });

                container.appendChild(indicator);
            }
        },

        updateActiveIndicator() {
            const indicators = Utils.getElements(".testimonial-indicator");
            if (!indicators.length) return;

            // Get the step size from the difference between first two indicators
            let step = 1;
            if (indicators.length >= 2) {
                const firstIndex = parseInt(
                    indicators[0].getAttribute("data-slide") || "0"
                );
                const secondIndex = parseInt(
                    indicators[1].getAttribute("data-slide") || "1"
                );
                step = secondIndex - firstIndex;
            }

            indicators.forEach((indicator) => {
                const slideIndex = parseInt(
                    indicator.getAttribute("data-slide") || "0"
                );

                // Check if current index falls within this indicator's range
                if (
                    this.currentIndex >= slideIndex &&
                    (slideIndex ===
                        parseInt(
                            indicators[indicators.length - 1].getAttribute(
                                "data-slide"
                            ) || "0"
                        ) ||
                        this.currentIndex < slideIndex + step)
                ) {
                    indicator.classList.add("active");
                } else {
                    indicator.classList.remove("active");
                }
            });
        },

        setupSwipeEvents() {
            if (!this.track) return;

            const container = this.track.closest(".testimonials-carousel");
            if (!container) return;

            // Prevent text selection during swipe
            container.style.userSelect = "none";

            // Touch events for mobile
            container.addEventListener(
                "touchstart",
                (e) => {
                    this.touchStartX = e.changedTouches[0].screenX;
                },
                { passive: true }
            );

            container.addEventListener(
                "touchend",
                (e) => {
                    this.touchEndX = e.changedTouches[0].screenX;
                    this.handleSwipe();
                },
                { passive: true }
            );

            // Mouse events for desktop (simulating swipe)
            container.addEventListener("mousedown", (e) => {
                this.isDragging = true;
                this.touchStartX = e.screenX;
                container.style.cursor = "grabbing";

                // Prevent default to avoid text selection
                e.preventDefault();
            });

            container.addEventListener("mousemove", (e) => {
                if (this.isDragging) {
                    // Prevent default during drag to avoid text selection
                    e.preventDefault();
                }
            });

            container.addEventListener("mouseup", (e) => {
                if (!this.isDragging) return;

                this.touchEndX = e.screenX;
                this.handleSwipe();
                this.isDragging = false;
                container.style.cursor = "";
            });

            container.addEventListener("mouseleave", () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    container.style.cursor = "";
                }
            });

            // Prevent context menu during swipe operations
            container.addEventListener("contextmenu", (e) => {
                if (this.isDragging) {
                    e.preventDefault();
                }
            });
        },

        handleSwipe() {
            const swipeThreshold = 50; // Minimum distance to register as a swipe
            const swipeDistance = this.touchEndX - this.touchStartX;

            if (swipeDistance > swipeThreshold) {
                // Swiped right - go to previous slide
                this.navigate("prev");
            } else if (swipeDistance < -swipeThreshold) {
                // Swiped left - go to next slide
                this.navigate("next");
            }
        },
    };

    const mapUrls = {};

    function getMapUrl(locationName) {
        let addressLocation = `${locationName}, Bali, Indonesia`;
        if (locationName === "Ijen Volcano") {
            addressLocation = `${locationName}, East Java, Indonesia`;
        }
        const encodedAddress = encodeURIComponent(addressLocation);
        const template = mapUrls[locationName] || mapUrls["default"];
        return `${template[0]}${encodedAddress}${template[1]}`;
    }

    const MapController = {
        init() {
            try {
                // Check if map is already initialized by page-specific script
                if (window.mapInitialized) return;

                // Find location elements on the page
                const locationElement = Utils.getElement(
                    "#destination-location"
                );
                if (!locationElement) return; // Exit if not on a page with location element

                const mapModal = Utils.getElement("#map-modal");
                const mapClose = Utils.getElement("#map-close");
                const mapIframe = Utils.getElement("#map-iframe");

                if (!mapModal || !mapClose || !mapIframe) return;

                // Get the location text from the address span
                const addressSpan = locationElement.querySelector("span");
                if (!addressSpan) return;

                // Open map modal when location is clicked
                locationElement.addEventListener("click", () => {
                    // Set the iframe source
                    mapIframe.src = getMapUrl(addressSpan.textContent.trim());

                    // Show the modal
                    mapModal.classList.add("active");

                    // Prevent scrolling on the body when modal is open
                    document.body.style.overflow = "hidden";
                });

                // Close map modal when close button is clicked
                mapClose.addEventListener("click", () => {
                    mapModal.classList.remove("active");

                    // Re-enable scrolling on the body
                    document.body.style.overflow = "";

                    // Clear the iframe source to stop it from running in the background
                    setTimeout(() => {
                        mapIframe.src = "";
                    }, 300);
                });

                // Close map modal when clicking outside the map container
                mapModal.addEventListener("click", (e) => {
                    if (e.target === mapModal) {
                        mapClose.click();
                    }
                });

                // Close map modal when ESC key is pressed
                document.addEventListener("keydown", (e) => {
                    if (
                        e.key === "Escape" &&
                        mapModal.classList.contains("active")
                    ) {
                        mapClose.click();
                    }
                });
            } catch (error) {
                console.error("Error initializing map functionality:", error);
            }
        },
    };

    async function loadJsonData(filePath, dictObj) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}`);
            }
            const data = await response.json();
            Object.assign(dictObj, data);
        } catch (error) {
            console.error(`Error loading JSON from ${filePath}:`, error);
        }
    }

    // Initialize all controllers when DOM is ready
    document.addEventListener("DOMContentLoaded", function () {
        async function initializeApp() {
            await loadJsonData(CONFIG.DEST_IMAGES, destinationImages); // 1️⃣ load JSON first
            await loadJsonData(CONFIG.MAP_URLS, mapUrls); // 1️⃣ load JSON first

            try {
                // Check if we need to scroll to a specific section after page load
                const sections = get_sections();
                if (sections) {
                    // Clear the stored section
                    sessionStorage.removeItem("scrollToSection");
                    sections.forEach((section) => {
                        // Wait for page to fully load, then scroll
                        setTimeout(() => {
                            const targetElement = Utils.getElement(
                                `#${section}`
                            );
                            if (targetElement) {
                                targetElement.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }
                        }, 500);
                    });
                }

                // Initialize controllers that don't depend on fetched components first
                ScrollController.init();
                DelayedService.init();
                PaginationController.init(); // Assumes pagination elements are in main HTML, not header/footer
                TestimonialsController.init(); // Assumes testimonial elements are in main HTML
                MapController.init();
                ScrollAnimation.init();
                // HeroAnimationController.init();

                // Load header/footer and initialize dependent controllers
                // setupBookingButtons is now called inside ComponentLoader.init after await
                await ComponentLoader.init();

                // Determine current page and run appropriate image updates ***
                const currentPagePath = window.location.pathname;

                // Check if it's a destination page (hero image update)
                if (currentPagePath.includes("/destinations/activities")) {
                    setDestHeroImg();
                }
            } catch (error) {
                console.error("Error during initialization:", error);
            }
        }

        // Call the async function
        initializeApp();

        // Initialize contact form and newsletter functionality
        initializeContactForm();
        initializeNewsletterModal();
    });

    // Contact Form Functionality
    function initializeContactForm() {
        const contactForm = Utils.getElement("#contact-form");
        if (contactForm) {
            contactForm.addEventListener("submit", handleContactFormSubmit);
        }
    }

    function handleContactFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            showNotification("Please fill in all required fields.", "error");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification("Please enter a valid email address.", "error");
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
            // Create WhatsApp message
            const message = `Hello BaliBlissed! I'm interested in your services.

            Name: ${data.name}
            Email: ${data.email}
            Phone: ${data.phone || "Not provided"}
            Travelers: ${data.travelers || "Not specified"}
            Service Interest: ${data.service || "Not specified"}
            Travel Dates: ${data.dates || "Flexible"}

            Message: ${data.message}`;

            const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(
                "+",
                ""
            )}?text=${encodeURIComponent(message)}`;

            // Reset form
            e.target.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Show success message
            showNotification(
                "Thank you! Your message has been prepared. Click OK to send via WhatsApp.",
                "success"
            );

            // Open WhatsApp
            setTimeout(() => {
                window.open(whatsappUrl, "_blank");
            }, 1000);
        }, 1500);
    }

    // Newsletter Modal Functionality
    function initializeNewsletterModal() {
        const newsletterForm = Utils.getElement("#newsletter-form");
        const closeBtn = Utils.getElement(".newsletter-modal-close");
        const overlay = Utils.getElement(".newsletter-modal-overlay");

        if (newsletterForm) {
            newsletterForm.addEventListener("submit", handleNewsletterSubmit);
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", closeNewsletterModal);
        }

        if (overlay) {
            overlay.addEventListener("click", closeNewsletterModal);
        }

        // // Show newsletter modal after 30 seconds (optional)
        // setTimeout(() => {
        //     showNewsletterModal(Utils.getElement("#newsletter-modal"));
        // }, 30000);
    }

    function handleNewsletterSubmit(e) {
        e.preventDefault();

        const email = e.target.querySelector("#newsletter-email").value;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification("Please enter a valid email address.", "error");
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
            closeNewsletterModal();

            // Show success message
            showNotification(
                "Thank you for subscribing! You'll receive our latest updates and exclusive offers.",
                "success"
            );
        }, 1500);
    }

    function showNewsletterModal(modal) {
        if (modal) {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        }
    }

    function closeNewsletterModal() {
        const modal = Utils.getElement("#newsletter-modal");
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    // Notification System
    function showNotification(message, type = "info") {
        // Remove existing notifications
        const existingNotifications =
            document.querySelectorAll(".notification");
        existingNotifications.forEach((notification) => notification.remove());

        // Create notification element
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

        // Add styles
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

        // Add to page
        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector(".notification-close");
        closeBtn.addEventListener("click", () => notification.remove());

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Add CSS for notifications
    if (document.querySelector("#notification-styles")) return;

    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
})();
