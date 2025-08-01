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
            "Hello BaliParadise! I'm interested in booking a vacation. Can you provide more information?",
        HEADER_SCROLL_THRESHOLD: 100,
        BUTTON_COLLAPSE_TIMEOUT: 1000,
        HOVER_DELAY: 600,
        PARALLAX_FACTOR: 0.5,
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

    // Data mapping destination titles to their card image URLs (relative to root or absolute)
    // Populate this object with ALL destinations and their correct image URLs from index.html
    const destinationImages = {
        "Bali ATV Quad Bike Adventure in Ubud":
            "destinations/activities/Bali_Atv_Ride_In_Ubud/Images/atv_track.jpg",
        "Mount Batur Sunrise Trekking or Jeep Private Tour":
            "destinations/activities/Mount_Batur_4wd_Jeep_Sunrise_Tour/Images/a_couple_is_watching_sunrise.jpg",
        "Nusa Lembongan & Manta Bay Snorkeling":
            "destinations/activities/Nusa_Lembongan_And_Manta_Bay_Snorkeling_Experience/Images/banner_03.jpg",
        "West Nusa Penida Tour":
            "destinations/activities/Nusa_Penida_Day_Tour_From_Bali/Images/banner_03.jpg",
        "Mount Batur 4WD Jeep Sunrise Tour":
            "destinations/activities/Mount_Batur_Sunrise_Trekking_or_Jeep_Private_Tour/Images/banner_03.jpg",
        "Lovina Dolphin Watching and Snorkeling Tour":
            "destinations/activities/Lovina_Dolphin_Watching_And_Snorkeling_Tour_In_Bali/Images/dolphin_watching_at_lovina_beach_in_bali.jpg",
        "Ijen Blue Fire Hiking Tour From Bali":
            "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Balinese Purification And Wellness Experience":
            "https://images.unsplash.com/photo-1577715694662-6222a3d6e21c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Tulamben Dive Escapade: Discover Scuba Day Trip with PADI 5*":
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Sanur's Aquatic Gateway: Open Water Diver with PADI 5*":
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Daytrip Scuba Diving or Snorkeling To Amed":
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Private Charter Boat For Scuba Diving or Snorkeling To Nusa Penida":
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Jet Ski Touring Experience In Bali":
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Uluwatu Temple Sunset and Kecak Fire Dance":
            "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Beauty Of Bali Customizable Full-Day Private Tour":
            "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Surfing Lesson at Kuta Beach by 27 Surf Bali":
            "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Jimbaran Seafood Dining and Sunset Experience":
            "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Ayung River Rafting in Bali with Activities and Sightseeing Tour":
            "https://images.unsplash.com/photo-1583452924150-ea5ea61009a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Ubud Highlights And Lempuyang Gate Of Heaven Tour":
            "https://images.unsplash.com/photo-1604999333679-b86d54738315?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Beach Horse Riding Experience at Seminyak Beach":
            "https://images.unsplash.com/photo-1570555679220-9ee36e4a7ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Blue Lagoon Beach Snorkeling Experience":
            "https://images.unsplash.com/photo-1589940801380-39c1d03c06a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Tanah Lot, Padang Padang & Uluwatu Sunset Kecak Dance Tour":
            "https://images.unsplash.com/photo-1555400038-63f5ba517a47?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Mount Agung Sunrise Trekking":
            "https://images.unsplash.com/photo-1596938399978-1103a9a0a0c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Tanjung Benoa Watersports Adventure":
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Example: Update required
        "Bali Swing Pioneer Experience in Ubud":
            "https://images.unsplash.com/photo-1591809859305-1823197a46c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Bali Helicopter Ride Experience":
            "https://images.unsplash.com/photo-1588499756007-ded3f865871f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Ubud Zipline & Sky Bike Adventure":
            "https://images.unsplash.com/photo-1531778272849-d1dd22444c06?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        "Bali Paragliding & Uluwatu Sunset Tour":
            "https://images.unsplash.com/photo-1588499756007-ded3f865871f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Example: Update required
        "Tulamben Wreck Diving Day Trip":
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Example: Update required
        "Bali UNESCO Heritage Sites Tour":
            "https://images.unsplash.com/photo-1500382841059-ce9998a2b4f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        // Add all other destinations here...
    };

    // To update destination card images on the main page
    function setDestCardImgs() {
        const destinationCards = Utils.getElements(".destination-card");

        if (!destinationCards.length) return; // Exit if no cards found

        destinationCards.forEach((card) => {
            const titleElement = card.querySelector(".destination-name");
            const imageElement = card.querySelector(".card-image");

            const cardTitle = titleElement.textContent
                .replace(/\s+/g, " ")
                .trim(); // Normalize whitespace (replace multiple spaces with single space)
            const imageUrl = destinationImages[cardTitle];

            if (!imageUrl) {
                console.warn(
                    `Image URL not found in destinationImages map for card title: "${cardTitle}"`
                );
                return;
            }

            imageElement.src = imageUrl;
            // Optionally update alt text if it's generic or missing
            if (!imageElement.alt || imageElement.alt === "#") {
                imageElement.alt = cardTitle;
            }
        });
    }

    // Function to update hero image on destination pages
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
            // const defaultBasePath = window.location.pathname.includes("/destinations/activities/") ? "../../../" : "../../";
            // heroImageElement.src = defaultBasePath + 'images/default-hero.webp';
            // heroImageElement.alt = 'Bali Paradise Getaway Default Hero';
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
        // heroImageElement.alt = cleanedTitle + " hero image";
    }

    const ComponentLoader = {
        async init() {
            // Use Promise.all to wait for both header and footer to load
            await this.loadComponents();
            // Now that components are loaded, initialize things that depend on them
            this.initializeDependentControllers();
            // Setup all booking buttons AFTER components are loaded
            setupBookingButtons();
        },

        loadComponents() {
            // ... (determine basePath logic remains the same) ...
            const path = window.location.pathname;
            const isDestinationPage = path.includes("/destinations/");
            const isActivityPage = path.includes("/destinations/activities/");
            const isServicePage = path.includes("/services/");
            let basePath = "";
            if (isActivityPage) basePath = "../../../";
            else if (isDestinationPage || isServicePage) basePath = "../../";

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
                              isServicePage
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
                              isServicePage
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
            container,
            basePath,
            isDestinationPage,
            isActivityPage,
            isServicePage
        ) {
            if (isDestinationPage || isActivityPage || isServicePage) {
                const links = container.querySelectorAll(
                    'a:not([href^="http"]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"])'
                );
                const images = container.querySelectorAll(
                    'img:not([src^="http"]):not([src^="/"])'
                ); // Select relative image paths

                links.forEach((link) => {
                    const href = link.getAttribute("href");
                    // Adjust relative paths like 'index.html' or 'services/...'
                    if (
                        href &&
                        !href.startsWith("../") &&
                        !href.startsWith("/")
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
            // Add multiple attempts to scroll to top
            window.addEventListener("load", () => {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 0);
            });

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
                const homeFloat = Utils.getElement("#home-float");
                if (homeFloat) {
                    const scrollHeight = document.documentElement.scrollHeight;
                    const clientHeight = document.documentElement.clientHeight;
                    const scrollThreshold = (scrollHeight - clientHeight) * 0.8; // 90% threshold

                    if (window.scrollY >= scrollThreshold) {
                        homeFloat.classList.add("visible");
                    } else {
                        homeFloat.classList.remove("visible");
                    }
                }
            } catch (error) {
                console.error("Error in scroll handler:", error);
            }
        },
    };

    const DelayedService = {
        init() {
            const serviceButton = document.querySelector(
                ".service-link-button"
            );
            if (!serviceButton) return;

            serviceButton.addEventListener("click", (e) => {
                // Prevent default navigation immediately
                e.preventDefault();
                const targetUrl = serviceButton.href; // Get the URL from the button's href

                if (Utils.isMobileDevice()) {
                    // Add a delay before navigating on mobile
                    setTimeout(() => {
                        window.location.href = targetUrl; // Redirect after delay
                    }, 600); // 1 second delay
                } else {
                    // Navigate immediately on non-mobile devices
                    window.location.href = targetUrl;
                }
            });
        },
    };

    // const ScrollAnimation_ori = {
    //     serviceObserver: null, // Observer for service link
    //     sectionObserver: null, // Observer for sections

    //     init() {
    //         try {
    //             const serviceElements = Utils.getElements(
    //                 ".service-link-content"
    //             );
    //             const sectionElements = Utils.getElements("section:not(.hero)");

    //             if (!serviceElements.length && !sectionElements.length) return;

    //             // Common callback function for both observers
    //             const observerCallback = (entries, observerInstance) => {
    //                 entries.forEach((entry) => {
    //                     if (entry.isIntersecting) {
    //                         entry.target.classList.add("visible");
    //                         // // Optional: Uncomment to animate only once per element type
    //                         // observerInstance.unobserve(entry.target);
    //                     } else {
    //                         // Element is leaving the viewport (optional: keep animating on scroll up/down)
    //                         entry.target.classList.remove("visible");
    //                     }
    //                 });
    //             };

    //             // Options and observer for .service-link-content
    //             if (serviceElements.length) {
    //                 const serviceObserverOptions = {
    //                     root: null,
    //                     rootMargin: "0px",
    //                     threshold: 0.6, // Trigger when 60% is visible
    //                 };
    //                 this.serviceObserver = new IntersectionObserver(
    //                     observerCallback,
    //                     serviceObserverOptions
    //                 );
    //                 serviceElements.forEach((el) =>
    //                     this.serviceObserver.observe(el)
    //                 );
    //             }

    //             // Options and observer for section:not(.hero)
    //             if (sectionElements.length) {
    //                 const sectionObserverOptions = {
    //                     root: null,
    //                     rootMargin: "0px",
    //                     threshold: 0.2, // Trigger when 20% is visible
    //                 };
    //                 this.sectionObserver = new IntersectionObserver(
    //                     observerCallback,
    //                     sectionObserverOptions
    //                 );
    //                 sectionElements.forEach((el) =>
    //                     this.sectionObserver.observe(el)
    //                 );
    //             }
    //         } catch (error) {
    //             console.error("Error initializing scroll animations:", error);
    //         }
    //     },

    //     disconnect() {
    //         if (this.serviceObserver) {
    //             this.serviceObserver.disconnect();
    //             this.serviceObserver = null;
    //         }
    //         if (this.sectionObserver) {
    //             this.sectionObserver.disconnect();
    //             this.sectionObserver = null;
    //         }
    //     },
    // };

    const ScrollAnimation = {
        // --- Configuration ---
        SERVICE_SELECTOR: ".service-link-content",
        SECTION_SELECTOR: "section:not(.hero)",
        SECTION_THRESHOLD: 0.1, // Trigger when 20% is visible
        SERVICE_THRESHOLD: 0.6, // Trigger when 60% is visible
        VISIBLE_CLASS: "visible", // Centralize the class name

        // --- State ---
        _serviceObserver: null, // Using '_' convention for internal state
        _sectionObserver: null,

        // --- Private Methods ---
        /**
         * Callback function executed when observed elements intersect the viewport.
         * @param {IntersectionObserverEntry[]} entries - Array of intersection entries.
         * @param {IntersectionObserver} observerInstance - The observer instance.
         */
        _handleIntersection(entries /*, observerInstance */) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(this.VISIBLE_CLASS);
                    // Optional: Uncomment to animate only once per element
                    // observerInstance.unobserve(entry.target);
                } else {
                    // Element is leaving the viewport
                    entry.target.classList.remove(this.VISIBLE_CLASS);
                }
            });
        },

        /**
         * Creates and initializes an IntersectionObserver instance.
         * @param {string} selector - The CSS selector for elements to observe.
         * @param {number} threshold - The visibility threshold for triggering the callback.
         * @returns {IntersectionObserver|null} The created observer instance or null if no elements found.
         */
        _createObserver(selector, threshold) {
            // Assume Utils.getElements exists and returns a NodeList or Array
            const elements = Utils.getElements(selector);
            if (!elements || elements.length === 0) {
                // console.warn(`ScrollAnimation: No elements found for selector "${selector}".`);
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
            // Ensure this runs only once or is idempotent if called multiple times
            if (this._serviceObserver || this._sectionObserver) {
                // console.log("ScrollAnimation already initialized.");
                return;
            }

            try {
                this._serviceObserver = this._createObserver(
                    this.SERVICE_SELECTOR,
                    this.SERVICE_THRESHOLD
                );
                this._sectionObserver = this._createObserver(
                    this.SECTION_SELECTOR,
                    this.SECTION_THRESHOLD
                );

                if (!this._serviceObserver && !this._sectionObserver) {
                    console.log(
                        "ScrollAnimation: No elements found to observe for any selector."
                    );
                } else {
                    // console.log("ScrollAnimation initialized."); // Optional success log
                }
            } catch (error) {
                console.error("Error initializing scroll animations:", error);
                // Attempt cleanup if initialization failed
                this.disconnect();
            }
        },

        /**
         * Disconnects all observers and cleans up resources.
         */
        disconnect() {
            if (this._serviceObserver) {
                this._serviceObserver.disconnect();
                this._serviceObserver = null;
            }
            if (this._sectionObserver) {
                this._sectionObserver.disconnect();
                this._sectionObserver = null;
            }
            console.log("ScrollAnimation observers disconnected."); // Optional log
        },
    };

    const NavigationController = {
        init() {
            this.setupMobileMenu();
            this.setupSmoothScrolling();
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
            this.aboutModal();
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

    const setupBookingButtons = () => {
        // Track which buttons have already been initialized within this scope
        const initializedButtons = new Set();

        try {
            // Find all relevant booking buttons
            const bookingButtons = Utils.getElements(".cta-button, .book-now");

            if (bookingButtons.length > 0) {
                bookingButtons.forEach((button) => {
                    // Skip if this button has already been initialized
                    if (initializedButtons.has(button)) {
                        return;
                    }

                    // Mark this button as initialized
                    initializedButtons.add(button);

                    // Add event listener
                    button.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent event bubbling

                        let customMessage = null;

                        // Check if it's a page-specific CTA button
                        if (button.classList.contains("cta-button")) {
                            // Extract the page title from the document title
                            const pageTitle = document.title
                                .split("|")[0]
                                .trim();
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
            }
        } catch (error) {
            console.error("Error setting up booking buttons:", error);
        }
    };

    const FloatingButtonsControllerOri = {
        buttonTimeouts: new Map(), // Stores timeout IDs for collapsing buttons
        isTapping: false, // Tracks if a touch event is in progress on mobile

        init() {
            try {
                const floatingButtons = Utils.getElements(".floating-button");
                // Ensure the WhatsApp button exists before proceeding
                const whatsappFloat = Utils.getElement("#whatsapp-float");
                if (!whatsappFloat) {
                    // console.warn("WhatsApp floating button (#whatsapp-float) not found.");
                    // If WhatsApp button is essential, might return here or handle differently
                }

                if (Utils.isMobileDevice()) {
                    this.setupMobileInteraction(floatingButtons);
                } else {
                    this.setupDesktopInteraction(
                        floatingButtons,
                        whatsappFloat
                    );
                }
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

            // Expand the target button
            button.classList.add("expanded");

            // Clear existing timeout for this button, if any
            if (this.buttonTimeouts.has(button)) {
                clearTimeout(this.buttonTimeouts.get(button));
            }

            // Set timeout to automatically collapse the button
            const timeoutId = setTimeout(() => {
                this.collapseButton(button); // Use collapseButton to ensure timeout is cleared from map
            }, CONFIG.BUTTON_COLLAPSE_TIMEOUT);

            this.buttonTimeouts.set(button, timeoutId);
        },

        collapseButton(button) {
            button.classList.remove("expanded");
            // Clear and remove the timeout associated with this button
            if (this.buttonTimeouts.has(button)) {
                clearTimeout(this.buttonTimeouts.get(button));
                this.buttonTimeouts.delete(button);
            }
        },

        handleButtonAction(button, e) {
            if (!button.classList.contains("expanded")) {
                // First interaction: Prevent default link behavior and expand
                e.preventDefault();
                this.expandButton(button);
            } else {
                // Second interaction (button already expanded): Perform action
                if (button.id === "whatsapp-float") {
                    e.preventDefault(); // Prevent default '#' link behavior
                    openWhatsAppChat(); // Use the standalone function
                    this.collapseButton(button); // Collapse after action
                }
                // Add 'else if' blocks here for other floating buttons if needed
                // else { /* Allow default behavior for other expanded buttons */ }
            }
        },

        setupMobileInteraction(floatingButtons) {
            floatingButtons.forEach((button) => {
                // Use touchend for primary interaction on mobile
                button.addEventListener("touchend", (e) => {
                    // Prevent potential "ghost clicks" that might follow touchend
                    e.preventDefault();
                    this.handleButtonAction(button, e);
                });

                // REMOVED the separate 'click' listener to avoid potential conflicts
                // Relying solely on 'touchend' for mobile interaction.
            });

            // Collapse buttons if user touches outside of them
            document.addEventListener(
                "touchstart",
                (e) => {
                    // Check if the touch is outside any floating button
                    if (!e.target.closest(".floating-button")) {
                        // Find any currently expanded floating button
                        const expandedButton = Utils.getElement(
                            ".floating-button.expanded"
                        );
                        if (expandedButton) {
                            // Collapse it
                            this.collapseButton(expandedButton);
                        }
                    }
                },
                { passive: true } // Use passive listener for better scroll performance
            );
        },

        setupDesktopInteraction(floatingButtons, whatsappFloat) {
            // Hover effect for all floating buttons
            floatingButtons.forEach((button) => {
                let hoverTimer = null;
                button.addEventListener("mouseenter", () => {
                    clearTimeout(hoverTimer); // Clear any pending collapse
                    if (!button.classList.contains("expanded")) {
                        // Expand immediately on hover enter
                        this.expandButton(button);
                        // Clear the auto-collapse timeout set by expandButton, as hover controls it now
                        if (this.buttonTimeouts.has(button)) {
                            clearTimeout(this.buttonTimeouts.get(button));
                            this.buttonTimeouts.delete(button);
                        }
                    }
                });

                button.addEventListener("mouseleave", () => {
                    // Set a delay before collapsing on hover leave
                    hoverTimer = setTimeout(() => {
                        this.collapseButton(button);
                    }, CONFIG.HOVER_DELAY);
                });
            });

            // Click handler specifically for the WhatsApp button on desktop
            if (whatsappFloat) {
                whatsappFloat.addEventListener("click", (e) => {
                    e.preventDefault(); // Prevent default link behavior
                    // No need to explicitly expand on click for desktop hover, but ensure it's visually open if somehow closed
                    // whatsappFloat.classList.add("expanded"); // Optional: Force expansion visual on click
                    openWhatsAppChat(); // Use the standalone function
                    this.collapseButton(whatsappFloat); // Collapse after action
                });
            }
        },
    };

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

                const locationName = addressSpan.textContent.trim();
                const addressLocation = locationName + ", Bali, Indonesia";

                // Open map modal when location is clicked
                locationElement.addEventListener("click", () => {
                    // Generate the appropriate map URL based on the location
                    const mapUrl = this.getMapUrlForLocation(
                        locationName,
                        addressLocation
                    );

                    // Set the iframe source
                    mapIframe.src = mapUrl;

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

        getMapUrlForLocation(locationName, addressLocation) {
            // Create a base URL with the encoded address
            const encodedAddress = encodeURIComponent(addressLocation);

            // Set specific parameters based on the location name
            switch (locationName) {
                case "Mount Batur":
                    // Parameters for Mount Batur
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63178.05870769603!2d115.3363808779767!3d-8.240042711826508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd1f403c8e8ee3f%3A0xd38045afa18670b4!2s${encodedAddress}!5e0!3m2!1sen!2sid!4v1744546957191!5m2!1sen!2sid`;

                case "Nusa Lembongan":
                    // Parameters for Nusa Lembongan
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63106.150796702204!2d115.4089464791813!3d-8.678764450453224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd26d9f537b69f3%3A0xdc1b94bd6c67a033!2s${encodedAddress}!5e0!3m2!1sen!2sid!4v1744546715537!5m2!1sen!2sid`;

                case "Nusa Penida":
                    // Parameters for Nusa Penida
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252382.39858815237!2d115.3639201795288!3d-8.741299893904245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd271194d1319d3%3A0x5c3a3706b2197b7b!2s${encodedAddress}!5e0!3m2!1sen!2sid!4v1744547957195!5m2!1sen!2sid`;

                case "Brasela, Ubud":
                    // Parameters for ATV, Ubud
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31573.890523321686!2d115.24793634509159!3d-8.42753551311218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2226c4e8c42bd%3A0xd37acdbc9b64ffd!2s${encodedAddress}!5e0!3m2!1sen!2sid!4v1744547593251!5m2!1sen!2sid`;

                case "Lovina Beach":
                    // Lovina Beach
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63190.69600463299!2d114.98880157776235!3d-8.160521814474285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd19b3dcc0765ab%3A0xab6c47770c720750!2s${encodedAddress}!5e0!3m2!1sen!2sid!4v1744601225502!5m2!1sen!2sid`;

                case "Tirta Empul Temple":
                    // Tirta Empul Temple
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15787.413436995239!2d115.3048108863503!3d-8.416059239840411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd218f4e06131b5%3A0x53a25a017714ecc1!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744605441753!5m2!1sen!2sid`;

                case "Tulamben":
                    // Parameters Tulamben
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126339.04149923936!2d115.50661864873565!3d-8.29333965650206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd1ff5d1e36e1ff%3A0x5030bfbca831720!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744606067197!5m2!1sen!2sid`;

                case "Sanur":
                    // Parameters Sanur
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31551.73079253046!2d115.23896984527451!3d-8.694745476471368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd241b7d35f0b21%3A0x5030bfbca830e40!2sS${addressLocation}!5e0!3m2!1sen!2sid!4v1744606533614!5m2!1sen!2sid`;

                case "Amed":
                    // Parameters Amed
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15790.063337163447!2d115.6720538363393!3d-8.35080773728279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcdff7c26aea48b%3A0xe814e752fd17550!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744606803481!5m2!1sen!2sid`;

                case "Nusa Dua":
                    // Parameters Nusa Dua
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7885.791988177492!2d115.22864797787398!3d-8.795841312492135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd243213c2ea8df%3A0xfe9b8fbae7a12e8f!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744607715630!5m2!1sen!2sid`;

                case "Uluwatu Temple":
                    // Parameters Uluwatu Temple
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15770.15467254223!2d115.07489383642097!3d-8.829335306694784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd24ffc20cb8191%3A0xcb98d1ba7db0495!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744608023535!5m2!1sen!2sid`;

                case "Kuta Beach":
                    // Parameters Kuta Beach
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7887.441994270617!2d115.16289542787064!3d-8.718021910572162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd246bc2ab70d43%3A0x82feaae12f4ab48e!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744608773712!5m2!1sen!2sid`;

                case "Kedonganan Beach":
                    // Parameters Kedonganan Beach
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7886.5156615647065!2d115.16335807787247!3d-8.761795061649702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd24468f30f174b%3A0xdd70159dc4cd2d8e!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744609124882!5m2!1sen!2sid`;

                case "Ayung River":
                    // Parameters Ayung River
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63110.82095510031!2d115.21597317910378!3d-8.650941751011633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd24077b11b836f%3A0xb1b754b869a54a2f!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744609435663!5m2!1sen!2sid`;

                case "Lempuyang Temple":
                    // Parameters Lempuyang Temple
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947.112944503302!2d115.62778021321411!3d-8.390551020077789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2074650566bad%3A0x9d09f3f6b34b8ffb!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744610442383!5m2!1sen!2sid`;

                case "Seminyak Beach":
                    // Parameters Seminyak Beach
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31552.13568548977!2d115.13572904527119!3d-8.689936276222365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2471c804bfd05%3A0xdcc2b5ae63dc9082!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744610733822!5m2!1sen!2sid`;

                case "Padangbai":
                    // Parameters Seminyak Beach
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31565.353429010596!2d115.48756034516235!3d-8.531462568192737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd20e6888a52347%3A0x5030bfbca831910!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744613119477!5m2!1sen!2sid`;

                case "Tanah Lot":
                    // Parameters Tanah Lot
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15778.949543094966!2d115.0765287363851!3d-8.621191648064672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd237824f71deab%3A0xcaabe270f7e34d69!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744613787067!5m2!1sen!2sid`;

                case "Mount Agung":
                    // Parameters Mount Agung
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63161.480058266956!2d115.46594397825662!3d-8.343223358658886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd202e428b2eac7%3A0xa7d7d26cb3a3a7ad!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744614122191!5m2!1sen!2sid`;

                case "Tanjung Benoa":
                    // Parameters Tanjung Benoa
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.292705736749!2d115.21222549135064!3d-8.758506639460656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd243bda5edd505%3A0x5aa7f8daba33bb29!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744614669466!5m2!1sen!2sid`;

                case "Timbis Beach":
                    // Parameters Timbis Beach
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63078.426114755406!2d115.1528596796394!3d-8.842146997619915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd25c9c97ba2f09%3A0x57528e822ace6831!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744617568277!5m2!1sen!2sid`;

                case "Jatiluwih":
                    // Parameters Jatiluwih
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126318.69814771487!2d115.03657164943495!3d-8.356394221643434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd227bedf45cc29%3A0x5030bfbca831a80!2s${addressLocation}!5e0!3m2!1sen!2sid!4v1744618265632!5m2!1sen!2sid`;

                default:
                    // Generic map URL with the location
                    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126180.25308523745!2d115.1171446871789!3d-8.650645903152404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd22f7520fca7d3%3A0x2872b62cc456cd84!2s${encodedAddress}!5e0!3m2!1sen!2sid!4v1744548957195!5m2!1sen!2sid`;
            }
        },
    };

    // Initialize all controllers when DOM is ready
    document.addEventListener("DOMContentLoaded", function () {
        async function initializeApp() {
            try {
                // Initialize controllers that don't depend on fetched components first
                ScrollController.init();
                DelayedService.init();
                PaginationController.init(); // Assumes pagination elements are in main HTML, not header/footer
                TestimonialsController.init(); // Assumes testimonial elements are in main HTML
                MapController.init();
                ScrollAnimation.init();

                // Load header/footer and initialize dependent controllers
                // setupBookingButtons is now called inside ComponentLoader.init after await
                await ComponentLoader.init();

                // *** Determine current page and run appropriate image updates ***
                const currentPagePath = window.location.pathname;

                // Check if it's a destination page (hero image update)
                if (currentPagePath.includes("/destinations/")) {
                    setDestHeroImg();
                }
                // Check if it's the main index page (card image update)
                // Adjust the condition if your main page URL is different (e.g., ends with '/' or '/index.html')
                else if (
                    currentPagePath.endsWith("/") ||
                    currentPagePath.endsWith("/index.html") ||
                    currentPagePath === "/BaliBlissed/"
                ) {
                    // Delay image updates slightly to ensure cards exist
                    setTimeout(setDestCardImgs, 150);
                }
            } catch (error) {
                console.error("Error during initialization:", error);
            }
        }

        // Call the async function
        initializeApp();
    });
})();
