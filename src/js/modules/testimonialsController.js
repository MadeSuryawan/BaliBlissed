import { Utils } from "/js/modules/utils.js";

export const TestimonialsController = {
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
            prevButton.addEventListener("click", () => this.navigate("prev"));
        }

        if (nextButton) {
            nextButton.addEventListener("click", () => this.navigate("next"));
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
                const modalText = Utils.getElement(".testimonial-modal-text");
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
                        modalContent.style.webkitOverflowScrolling = "touch";
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
        if (this.currentIndex >= this.testimonialCount - this.visibleCount) {
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
