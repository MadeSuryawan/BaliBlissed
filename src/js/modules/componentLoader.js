import { Utils } from "/js/modules/utils.js";
import { CONFIG } from "/js/modules/config.js";
import { NavigationController } from "/js/modules/navController.js";
import { openWhatsApp } from "/js/modules/openWA.js";
import { FloatingButtonsController } from "/js/modules/floatingBttnController.js";
import { ModalController } from "/js/modules/modalController.js";

export const ComponentLoader = {
    async init() {
        // Use Promise.all to wait for both header and footer to load
        await this.loadComponents();
        // Now that components are loaded, initialize things that depend on them
        this.initializeDependentControllers();
        // Setup all booking buttons AFTER components are loaded
        this.setBookingButtons();
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
                        Utils.add_section(section);
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

    setBookingButtons() {
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
                    // Otherwise, it's a general .book-now button, use the default message (null will trigger default in openWhatsApp)

                    // Use the standalone function to open chat
                    openWhatsApp(customMessage);
                });

                // Remove any inline onclick attributes that might be causing duplicates
                button.removeAttribute("onclick");
            });
        } catch (error) {
            console.error("Error setting up booking buttons:", error);
        }
    },
};
