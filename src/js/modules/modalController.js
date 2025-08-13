import { Utils } from "/js/modules/utils.js";

export const ModalController = {
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
            this.showWelcome(welcomeModal, false);
            this.closeModal(welcomeModal, welcomeClose, welcomeButton);
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
                this.showAbout(
                    e,
                    aboutModal,
                    aboutBody,
                    mobileMenu,
                    mobileOverlay,
                );
            };

            aboutLinks.forEach((link) => {
                link.addEventListener("click", openModal);
            });

            this.closeModal(aboutModal, aboutClose, null);
        } catch (error) {
            console.error("Error setting up About modal:", error);
        }
    },

    showWelcome(modal, oneTime, delay = 1500) {
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
    },

    showAbout(e, aboutModal, aboutBody, mobileMenu, mobileOverlay) {
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
            "#footer-placeholder .footer-about",
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
    },

    closeModal(modal, closeButton, welcomeButton) {
        const closeModal = () => {
            this.animatedClose(modal, welcomeButton);
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
    },

    animatedClose(modal, welcomeButton, delay = 1200) {
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
    },
};
